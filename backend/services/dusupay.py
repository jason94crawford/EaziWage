"""
Dusupay Payment Gateway Integration Service
Handles payouts/disbursements to Mobile Money and Bank Accounts
across Kenya, Tanzania, Uganda, and Rwanda.

Documentation: https://developer.dusupay.com
"""

import os
import uuid
import hmac
import hashlib
import httpx
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from enum import Enum
from pydantic import BaseModel


# ======================== CONFIGURATION ========================

class DusupayConfig:
    """Dusupay API Configuration"""
    
    def __init__(self):
        self.public_key = os.environ.get("DUSUPAY_PUBLIC_KEY", "")
        self.secret_key = os.environ.get("DUSUPAY_SECRET_KEY", "")
        self.webhook_secret = os.environ.get("DUSUPAY_WEBHOOK_SECRET", "")
        self.environment = os.environ.get("DUSUPAY_ENVIRONMENT", "sandbox")  # sandbox or production
        
        # Base URLs
        self.sandbox_url = "https://sandboxapi.dusupay.com/v1"
        self.production_url = "https://payments.dusupay.com/v1"
    
    @property
    def base_url(self) -> str:
        if self.environment == "production":
            return self.production_url
        return self.sandbox_url
    
    @property
    def is_configured(self) -> bool:
        return bool(self.public_key and self.secret_key)
    
    @property
    def is_sandbox(self) -> bool:
        return self.environment != "production"


# ======================== ENUMS ========================

class PayoutMethod(str, Enum):
    MOBILE_MONEY = "mobile_money"
    BANK = "bank"


class PayoutStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class Currency(str, Enum):
    KES = "KES"  # Kenya Shilling
    TZS = "TZS"  # Tanzania Shilling
    UGX = "UGX"  # Uganda Shilling
    RWF = "RWF"  # Rwanda Franc
    USD = "USD"  # US Dollar


# ======================== PROVIDER MAPPINGS ========================

# Mobile Money Provider IDs by Country
MOBILE_MONEY_PROVIDERS = {
    "KE": {  # Kenya
        "mpesa": "safaricom_ke",
        "safaricom": "safaricom_ke",
        "airtel": "airtel_ke",
        "airtel_money": "airtel_ke",
    },
    "TZ": {  # Tanzania
        "mpesa": "vodacom_tz",
        "vodacom": "vodacom_tz",
        "airtel": "airtel_tz",
        "airtel_money": "airtel_tz",
        "tigo": "tigo_tz",
        "tigo_pesa": "tigo_tz",
        "halopesa": "halotel_tz",
    },
    "UG": {  # Uganda
        "mtn": "mtn_ug",
        "mtn_momo": "mtn_ug",
        "airtel": "airtel_ug",
        "airtel_money": "airtel_ug",
    },
    "RW": {  # Rwanda
        "mtn": "mtn_rw",
        "mtn_momo": "mtn_rw",
        "airtel": "airtel_rw",
        "airtel_money": "airtel_rw",
    },
}

# Country to Currency mapping
COUNTRY_CURRENCY = {
    "KE": Currency.KES,
    "TZ": Currency.TZS,
    "UG": Currency.UGX,
    "RW": Currency.RWF,
}

# Country codes to full names
COUNTRY_NAMES = {
    "KE": "Kenya",
    "TZ": "Tanzania",
    "UG": "Uganda",
    "RW": "Rwanda",
}


# ======================== REQUEST/RESPONSE MODELS ========================

class PayoutRequest(BaseModel):
    """Payout request model"""
    amount: float
    currency: str
    method: PayoutMethod
    provider_id: str
    account_number: str
    account_name: str
    merchant_reference: str
    narration: Optional[str] = None
    callback_url: Optional[str] = None
    
    # Bank-specific fields
    bank_code: Optional[str] = None
    bank_name: Optional[str] = None
    branch_code: Optional[str] = None


class PayoutResponse(BaseModel):
    """Payout response model"""
    success: bool
    message: str
    internal_reference: Optional[str] = None
    merchant_reference: Optional[str] = None
    status: Optional[str] = None
    error_code: Optional[str] = None
    raw_response: Optional[Dict[str, Any]] = None


class WebhookPayload(BaseModel):
    """Webhook callback payload"""
    event: str
    payload: Dict[str, Any]


# ======================== DUSUPAY SERVICE ========================

class DusupayService:
    """
    Dusupay Payment Service
    
    Handles:
    - Mobile Money Payouts (M-Pesa, MTN MoMo, Airtel Money)
    - Bank Transfer Payouts
    - Transaction Status Checks
    - Webhook Verification
    """
    
    def __init__(self, config: Optional[DusupayConfig] = None):
        self.config = config or DusupayConfig()
        self._client: Optional[httpx.AsyncClient] = None
    
    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.config.base_url,
                headers={
                    "Content-Type": "application/json",
                    "secret-key": self.config.secret_key,
                },
                timeout=30.0
            )
        return self._client
    
    async def close(self):
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None
    
    def generate_reference(self, prefix: str = "EWA") -> str:
        """Generate a unique merchant reference"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_id = uuid.uuid4().hex[:8].upper()
        return f"{prefix}-{timestamp}-{unique_id}"
    
    def get_provider_id(self, country_code: str, provider_name: str) -> Optional[str]:
        """Get Dusupay provider ID from country and provider name"""
        country_providers = MOBILE_MONEY_PROVIDERS.get(country_code.upper(), {})
        provider_key = provider_name.lower().replace(" ", "_").replace("-", "_")
        return country_providers.get(provider_key)
    
    def get_currency(self, country_code: str) -> Currency:
        """Get currency for a country"""
        return COUNTRY_CURRENCY.get(country_code.upper(), Currency.USD)
    
    # ======================== PAYOUT METHODS ========================
    
    async def create_mobile_money_payout(
        self,
        amount: float,
        country_code: str,
        provider_name: str,
        phone_number: str,
        recipient_name: str,
        reference: Optional[str] = None,
        narration: Optional[str] = None,
        callback_url: Optional[str] = None,
    ) -> PayoutResponse:
        """
        Create a Mobile Money payout
        
        Args:
            amount: Amount to disburse
            country_code: Country code (KE, TZ, UG, RW)
            provider_name: Provider name (mpesa, mtn, airtel, etc.)
            phone_number: Recipient's phone number
            recipient_name: Recipient's full name
            reference: Optional merchant reference (auto-generated if not provided)
            narration: Transaction description
            callback_url: Webhook URL for status updates
        
        Returns:
            PayoutResponse with transaction details
        """
        if not self.config.is_configured:
            return PayoutResponse(
                success=False,
                message="Dusupay is not configured. Please set DUSUPAY_PUBLIC_KEY and DUSUPAY_SECRET_KEY environment variables.",
                error_code="NOT_CONFIGURED"
            )
        
        # Get provider ID
        provider_id = self.get_provider_id(country_code, provider_name)
        if not provider_id:
            return PayoutResponse(
                success=False,
                message=f"Unknown provider '{provider_name}' for country '{country_code}'",
                error_code="INVALID_PROVIDER"
            )
        
        # Get currency
        currency = self.get_currency(country_code)
        
        # Generate reference if not provided
        merchant_reference = reference or self.generate_reference()
        
        # Prepare request payload
        payload = {
            "currency": currency.value,
            "amount": amount,
            "method": PayoutMethod.MOBILE_MONEY.value,
            "provider_id": provider_id,
            "merchant_reference": merchant_reference,
            "account_number": phone_number,
            "account_name": recipient_name,
            "narration": narration or "EaziWage Advance Disbursement",
        }
        
        if callback_url:
            payload["callback_url"] = callback_url
        
        return await self._execute_payout(payload)
    
    async def create_bank_payout(
        self,
        amount: float,
        country_code: str,
        bank_code: str,
        account_number: str,
        account_name: str,
        reference: Optional[str] = None,
        narration: Optional[str] = None,
        callback_url: Optional[str] = None,
        branch_code: Optional[str] = None,
    ) -> PayoutResponse:
        """
        Create a Bank Transfer payout
        
        Args:
            amount: Amount to disburse
            country_code: Country code (KE, TZ, UG, RW)
            bank_code: Bank code from Dusupay
            account_number: Recipient's bank account number
            account_name: Recipient's account name
            reference: Optional merchant reference
            narration: Transaction description
            callback_url: Webhook URL for status updates
            branch_code: Optional branch code
        
        Returns:
            PayoutResponse with transaction details
        """
        if not self.config.is_configured:
            return PayoutResponse(
                success=False,
                message="Dusupay is not configured. Please set DUSUPAY_PUBLIC_KEY and DUSUPAY_SECRET_KEY environment variables.",
                error_code="NOT_CONFIGURED"
            )
        
        # Get currency
        currency = self.get_currency(country_code)
        
        # Generate reference if not provided
        merchant_reference = reference or self.generate_reference()
        
        # Prepare request payload
        payload = {
            "currency": currency.value,
            "amount": amount,
            "method": PayoutMethod.BANK.value,
            "provider_id": bank_code,
            "merchant_reference": merchant_reference,
            "account_number": account_number,
            "account_name": account_name,
            "narration": narration or "EaziWage Advance Disbursement",
        }
        
        if callback_url:
            payload["callback_url"] = callback_url
        
        if branch_code:
            payload["branch_code"] = branch_code
        
        return await self._execute_payout(payload)
    
    async def _execute_payout(self, payload: Dict[str, Any]) -> PayoutResponse:
        """Execute the payout request"""
        try:
            response = await self.client.post("/payouts", json=payload)
            data = response.json()
            
            if response.status_code in [200, 201, 202]:
                return PayoutResponse(
                    success=True,
                    message=data.get("message", "Payout initiated"),
                    internal_reference=data.get("data", {}).get("internal_reference"),
                    merchant_reference=data.get("data", {}).get("merchant_reference"),
                    status=data.get("data", {}).get("transaction_status", "PENDING"),
                    raw_response=data
                )
            else:
                return PayoutResponse(
                    success=False,
                    message=data.get("message", "Payout failed"),
                    error_code=str(data.get("code", response.status_code)),
                    raw_response=data
                )
        
        except httpx.TimeoutException:
            return PayoutResponse(
                success=False,
                message="Request timed out. Please try again.",
                error_code="TIMEOUT"
            )
        except httpx.RequestError as e:
            return PayoutResponse(
                success=False,
                message=f"Network error: {str(e)}",
                error_code="NETWORK_ERROR"
            )
        except Exception as e:
            return PayoutResponse(
                success=False,
                message=f"Unexpected error: {str(e)}",
                error_code="UNKNOWN_ERROR"
            )
    
    # ======================== STATUS & VERIFICATION ========================
    
    async def check_payout_status(self, merchant_reference: str) -> PayoutResponse:
        """
        Check the status of a payout transaction
        
        Args:
            merchant_reference: The merchant reference of the transaction
        
        Returns:
            PayoutResponse with current status
        """
        if not self.config.is_configured:
            return PayoutResponse(
                success=False,
                message="Dusupay is not configured",
                error_code="NOT_CONFIGURED"
            )
        
        try:
            response = await self.client.get(
                "/payouts/status",
                params={"merchant_reference": merchant_reference}
            )
            data = response.json()
            
            if response.status_code == 200:
                return PayoutResponse(
                    success=True,
                    message="Status retrieved",
                    internal_reference=data.get("data", {}).get("internal_reference"),
                    merchant_reference=merchant_reference,
                    status=data.get("data", {}).get("transaction_status"),
                    raw_response=data
                )
            else:
                return PayoutResponse(
                    success=False,
                    message=data.get("message", "Failed to get status"),
                    error_code=str(data.get("code", response.status_code)),
                    raw_response=data
                )
        
        except Exception as e:
            return PayoutResponse(
                success=False,
                message=f"Error checking status: {str(e)}",
                error_code="STATUS_CHECK_ERROR"
            )
    
    async def get_banks(self, country_code: str) -> List[Dict[str, Any]]:
        """
        Get list of supported banks for a country
        
        Args:
            country_code: Country code (KE, TZ, UG, RW)
        
        Returns:
            List of bank dictionaries with id, name, code
        """
        if not self.config.is_configured:
            return []
        
        try:
            response = await self.client.get(
                "/banks",
                params={
                    "country": country_code.upper(),
                    "transaction_type": "payout"
                }
            )
            data = response.json()
            
            if response.status_code == 200:
                return data.get("data", [])
            return []
        
        except Exception:
            return []
    
    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """
        Verify webhook signature from Dusupay
        
        Args:
            payload: Raw request body
            signature: Signature from request header
        
        Returns:
            True if signature is valid
        """
        if not self.config.webhook_secret:
            # If no webhook secret configured, skip verification (development mode)
            return True
        
        expected_signature = hmac.new(
            self.config.webhook_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected_signature, signature)
    
    def parse_webhook(self, payload: Dict[str, Any]) -> WebhookPayload:
        """Parse and validate webhook payload"""
        return WebhookPayload(
            event=payload.get("event", "unknown"),
            payload=payload.get("payload", {})
        )


# ======================== MOCK SERVICE FOR TESTING ========================

class MockDusupayService(DusupayService):
    """
    Mock Dusupay Service for testing without real API calls
    Simulates successful payouts with realistic delays
    """
    
    def __init__(self):
        super().__init__()
        self._transactions: Dict[str, Dict] = {}
    
    async def create_mobile_money_payout(
        self,
        amount: float,
        country_code: str,
        provider_name: str,
        phone_number: str,
        recipient_name: str,
        reference: Optional[str] = None,
        narration: Optional[str] = None,
        callback_url: Optional[str] = None,
    ) -> PayoutResponse:
        """Mock mobile money payout - always succeeds"""
        merchant_reference = reference or self.generate_reference()
        internal_reference = f"MOCK-{uuid.uuid4().hex[:12].upper()}"
        
        # Store transaction for status checks
        self._transactions[merchant_reference] = {
            "internal_reference": internal_reference,
            "merchant_reference": merchant_reference,
            "status": "COMPLETED",  # Mock always completes
            "amount": amount,
            "currency": self.get_currency(country_code).value,
            "method": "mobile_money",
            "recipient": phone_number,
        }
        
        return PayoutResponse(
            success=True,
            message="[MOCK] Payout initiated successfully",
            internal_reference=internal_reference,
            merchant_reference=merchant_reference,
            status="PENDING",
            raw_response={
                "code": 202,
                "status": "accepted",
                "message": "Transaction Initiated",
                "data": {
                    "internal_reference": internal_reference,
                    "merchant_reference": merchant_reference,
                    "transaction_status": "PENDING"
                },
                "_mock": True
            }
        )
    
    async def create_bank_payout(
        self,
        amount: float,
        country_code: str,
        bank_code: str,
        account_number: str,
        account_name: str,
        reference: Optional[str] = None,
        narration: Optional[str] = None,
        callback_url: Optional[str] = None,
        branch_code: Optional[str] = None,
    ) -> PayoutResponse:
        """Mock bank payout - always succeeds"""
        merchant_reference = reference or self.generate_reference()
        internal_reference = f"MOCK-{uuid.uuid4().hex[:12].upper()}"
        
        self._transactions[merchant_reference] = {
            "internal_reference": internal_reference,
            "merchant_reference": merchant_reference,
            "status": "COMPLETED",
            "amount": amount,
            "currency": self.get_currency(country_code).value,
            "method": "bank",
            "recipient": account_number,
        }
        
        return PayoutResponse(
            success=True,
            message="[MOCK] Bank payout initiated successfully",
            internal_reference=internal_reference,
            merchant_reference=merchant_reference,
            status="PENDING",
            raw_response={"_mock": True}
        )
    
    async def check_payout_status(self, merchant_reference: str) -> PayoutResponse:
        """Mock status check"""
        tx = self._transactions.get(merchant_reference)
        if tx:
            return PayoutResponse(
                success=True,
                message="[MOCK] Status retrieved",
                internal_reference=tx["internal_reference"],
                merchant_reference=merchant_reference,
                status=tx["status"],
                raw_response={"_mock": True}
            )
        return PayoutResponse(
            success=False,
            message="Transaction not found",
            error_code="NOT_FOUND"
        )


# ======================== SERVICE FACTORY ========================

def get_dusupay_service() -> DusupayService:
    """
    Factory function to get the appropriate Dusupay service
    Returns MockDusupayService if not configured, otherwise real service
    """
    config = DusupayConfig()
    
    if config.is_configured:
        return DusupayService(config)
    else:
        # Return mock service when not configured
        return MockDusupayService()


# Singleton instance
_dusupay_service: Optional[DusupayService] = None

def get_service() -> DusupayService:
    """Get or create the Dusupay service singleton"""
    global _dusupay_service
    if _dusupay_service is None:
        _dusupay_service = get_dusupay_service()
    return _dusupay_service
