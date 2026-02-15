from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import shutil
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Upload directory setup
UPLOAD_DIR = ROOT_DIR / "uploads"
KYC_UPLOAD_DIR = UPLOAD_DIR / "kyc"
PROFILE_UPLOAD_DIR = UPLOAD_DIR / "profiles"
UPLOAD_DIR.mkdir(exist_ok=True)
KYC_UPLOAD_DIR.mkdir(exist_ok=True)
PROFILE_UPLOAD_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'eaziwage-secret-key-2026')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="EaziWage API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ======================== MODELS ========================

class UserRole:
    EMPLOYEE = "employee"
    EMPLOYER = "employer"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    phone: str
    full_name: str
    role: str
    phone_country_code: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    phone: str
    full_name: str
    role: str
    created_at: str
    is_verified: bool = False

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Employer Models
class EmployerCreate(BaseModel):
    company_name: str
    registration_number: str
    tax_id: str
    country: str
    address: str
    employee_count: int
    industry: str
    payroll_cycle: str  # weekly, bi-weekly, monthly
    contact_person: str
    contact_email: EmailStr
    contact_phone: str

# Enhanced Employer Onboarding Models
class BeneficialOwner(BaseModel):
    full_name: str
    id_number: str
    ownership_percentage: float
    nationality: str
    is_pep: bool = False  # Politically Exposed Person

class EmployerOnboardingCreate(BaseModel):
    # Step 1: Company Basic Info
    company_name: str
    registration_number: str
    date_of_incorporation: Optional[str] = None
    country: str
    
    # Step 2: Business Address
    physical_address: str
    city: str
    postal_code: Optional[str] = None
    county_region: Optional[str] = None
    
    # Step 3: Tax & Legal
    tax_id: str
    vat_number: Optional[str] = None
    
    # Step 4: Beneficial Ownership
    beneficial_owners: Optional[List[Dict[str, Any]]] = None
    
    # Step 5: Business Operations
    industry: str
    sector: str
    business_description: Optional[str] = None
    years_in_operation: Optional[int] = None
    employee_count: int
    countries_of_operation: Optional[List[str]] = None  # Multi-select: KE, UG, TZ, RW
    
    # Step 6: Financial Info
    annual_revenue_range: Optional[str] = None
    payroll_cycle: str
    monthly_payroll_amount: Optional[float] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    
    # Step 7: Contact Info
    contact_person: str
    contact_email: EmailStr
    contact_phone: str
    contact_position: Optional[str] = None
    
    # Document paths (optional - can skip)
    certificate_of_incorporation: Optional[str] = None
    business_registration: Optional[str] = None
    tax_compliance_certificate: Optional[str] = None
    cr12_document: Optional[str] = None  # Company directors/shareholders
    kra_pin_certificate: Optional[str] = None
    business_permit: Optional[str] = None
    audited_financials: Optional[str] = None
    bank_statement: Optional[str] = None
    proof_of_address: Optional[str] = None
    proof_of_bank_account: Optional[str] = None  # Bank confirmation letter
    employment_contract_template: Optional[str] = None  # Standard employment contract

class EmployerOnboardingResponse(BaseModel):
    id: str
    user_id: str
    company_name: str
    registration_number: str
    date_of_incorporation: Optional[str] = None
    country: str
    physical_address: str
    city: str
    postal_code: Optional[str] = None
    county_region: Optional[str] = None
    tax_id: str
    vat_number: Optional[str] = None
    beneficial_owners: Optional[List[Dict[str, Any]]] = None
    industry: str
    sector: str
    business_description: Optional[str] = None
    years_in_operation: Optional[int] = None
    employee_count: int
    countries_of_operation: Optional[List[str]] = None
    annual_revenue_range: Optional[str] = None
    payroll_cycle: str
    monthly_payroll_amount: Optional[float] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    contact_person: str
    contact_email: str
    contact_phone: str
    contact_position: Optional[str] = None
    status: str  # pending, under_review, approved, rejected
    kyc_status: str  # pending, in_progress, complete, approved, rejected
    risk_score: Optional[float] = None
    onboarding_step: int = 0
    created_at: str
    documents: Optional[Dict[str, str]] = None

class EmployerResponse(BaseModel):
    id: str
    user_id: str
    company_name: str
    registration_number: str
    tax_id: str
    country: str
    address: str
    employee_count: int
    industry: str
    payroll_cycle: str
    contact_person: str
    contact_email: str
    contact_phone: str
    status: str  # pending, approved, rejected
    risk_score: Optional[float] = None
    risk_rating: Optional[str] = None
    risk_factors: Optional[Dict[str, Any]] = None
    created_at: str

# Employee Models
class EmployeeCreate(BaseModel):
    employer_id: Optional[str] = None  # Auto-assigned by backend
    employee_code: Optional[str] = None  # Auto-assigned by backend
    national_id: str
    id_type: Optional[str] = "national_id"  # national_id or passport
    nationality: Optional[str] = None  # Required if id_type is passport
    date_of_birth: str
    employment_type: str  # full-time, part-time, contract
    job_title: str
    monthly_salary: float
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    mobile_money_provider: Optional[str] = None
    mobile_money_number: Optional[str] = None
    country: str  # Country of Work
    # New KYC fields
    tax_id: Optional[str] = None  # TIN number
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    department: Optional[str] = None  # Auto-assigned by backend
    start_date: Optional[str] = None  # Employment start date

class EmployeeResponse(BaseModel):
    id: str
    user_id: str
    employer_id: Optional[str] = None
    employer_name: Optional[str] = None
    employee_code: Optional[str] = None
    national_id: Optional[str] = None
    id_type: Optional[str] = "national_id"
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None
    employment_type: Optional[str] = None
    job_title: Optional[str] = None
    monthly_salary: float = 0
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    mobile_money_provider: Optional[str] = None
    mobile_money_number: Optional[str] = None
    country: Optional[str] = None
    status: str = "pending"
    risk_score: Optional[float] = None
    kyc_status: str = "pending"
    kyc_step: int = 0  # Current onboarding step
    earned_wages: float = 0
    advance_limit: float = 0
    created_at: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    # New KYC fields
    tax_id: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    department: Optional[str] = None
    start_date: Optional[str] = None
    # KYC document paths
    id_document_front: Optional[str] = None
    id_document_back: Optional[str] = None
    address_proof: Optional[str] = None
    tax_certificate: Optional[str] = None
    payslip_1: Optional[str] = None
    payslip_2: Optional[str] = None
    bank_statement: Optional[str] = None
    selfie: Optional[str] = None
    employment_contract: Optional[str] = None

# Advance Request Models
class AdvanceCreate(BaseModel):
    amount: float
    disbursement_method: str  # mobile_money, bank_transfer
    reason: Optional[str] = None

class AdvanceResponse(BaseModel):
    id: str
    employee_id: str
    employee_name: str
    employer_id: str
    employer_name: str
    amount: float
    fee_percentage: float
    fee_amount: float
    net_amount: float
    disbursement_method: str
    disbursement_details: Dict[str, Any]
    status: str  # pending, approved, disbursed, repaid, rejected
    reason: Optional[str] = None
    created_at: str
    processed_at: Optional[str] = None

# KYC Document Models
class KYCDocumentCreate(BaseModel):
    document_type: str  # national_id, passport, tax_certificate, payslip, bank_statement
    document_url: str
    document_number: Optional[str] = None

class KYCDocumentResponse(BaseModel):
    id: str
    user_id: str
    document_type: str
    document_url: str
    document_number: Optional[str] = None
    status: str  # pending, approved, rejected
    reviewer_notes: Optional[str] = None
    created_at: str
    reviewed_at: Optional[str] = None

# Risk Score Models
class RiskScoreUpdate(BaseModel):
    legal_compliance: Dict[str, int]  # registration_status, tax_compliance, etc.
    financial_health: Dict[str, int]  # audited_financials, liquidity_ratio, etc.
    operational: Dict[str, int]  # employee_count, churn_rate, payroll_integration
    sector_exposure: Dict[str, int]  # industry_risk, regulatory_exposure
    aml_transparency: Dict[str, int]  # beneficial_ownership, pep_screening

class RiskScoreResponse(BaseModel):
    entity_type: str  # employer or employee
    entity_id: str
    legal_compliance_score: float
    financial_health_score: float
    operational_score: float
    sector_exposure_score: float
    aml_transparency_score: float
    composite_risk_score: float
    risk_rating: str  # A, B, C, D
    application_fee_percentage: float
    calculated_at: str

# Payroll Models
class PayrollUpload(BaseModel):
    month: str  # YYYY-MM
    employees: List[Dict[str, Any]]  # [{employee_code, days_worked, gross_salary, deductions}]

# Transaction Models
class TransactionResponse(BaseModel):
    id: str
    type: str  # advance, repayment, fee
    amount: float
    reference: str
    status: str
    created_at: str
    metadata: Dict[str, Any]

# Dashboard Stats Models
class EmployeeDashboardStats(BaseModel):
    earned_wages: float
    advance_limit: float
    total_advances: float
    pending_repayment: float
    recent_transactions: List[TransactionResponse]

class EmployerDashboardStats(BaseModel):
    total_employees: int
    active_employees: int
    total_advances_disbursed: float
    pending_advances: int
    monthly_payroll: float
    risk_score: Optional[float] = None

class AdminDashboardStats(BaseModel):
    total_employers: int
    total_employees: int
    pending_employer_verifications: int
    pending_employee_verifications: int
    total_advances_today: float
    pending_disbursements: int

# ======================== UTILITIES ========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(*roles):
    async def role_checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker

# Risk Scoring Calculations
EMPLOYER_WEIGHTS = {
    "legal_compliance": {"registration_status": 0.10, "tax_compliance": 0.07, "ewa_agreement": 0.03},
    "financial_health": {"audited_financials": 0.15, "liquidity_ratio": 0.10, "payroll_sustainability": 0.10},
    "operational": {"employee_count": 0.05, "churn_rate": 0.05, "payroll_integration": 0.10},
    "sector_exposure": {"industry_risk": 0.10, "regulatory_exposure": 0.05},
    "aml_transparency": {"beneficial_ownership": 0.05, "pep_screening": 0.05}
}

EMPLOYEE_WEIGHTS = {
    "legal_compliance": {"verification_status": 0.15, "tax_compliance": 0.10, "consent_data_rights": 0.10},
    "financial_health": {"account_verification": 0.45},
    "operational": {"employment_status": 0.075, "employment_contract": 0.075, "recent_payslips": 0.025, "bank_statements": 0.025}
}

def calculate_composite_risk_score(scores: Dict[str, Dict[str, int]], weights: Dict[str, Dict[str, float]]) -> float:
    total_weighted_score = 0
    total_weight = 0
    for category, factors in weights.items():
        if category in scores:
            for factor, weight in factors.items():
                if factor in scores[category]:
                    score = scores[category][factor]
                    total_weighted_score += score * weight
                    total_weight += weight
    return total_weighted_score / total_weight if total_weight > 0 else 0

def get_risk_rating(crs: float) -> str:
    if crs >= 4.0:
        return "A"  # Low Risk
    elif crs >= 3.0:
        return "B"  # Medium Risk
    elif crs >= 2.6:
        return "C"  # High Risk
    else:
        return "D"  # Very High Risk

def calculate_application_fee(crs_total: float) -> float:
    base_fee = 3.5
    risk_adjustment = 3.0
    return base_fee + (risk_adjustment * (1 - crs_total / 5))

# Industry Risk Classification (Kenya)
INDUSTRY_RISK = {
    "agriculture": 3, "manufacturing": 3, "construction": 3, "mining": 1,
    "retail": 3, "hospitality": 3, "healthcare": 5, "education": 5,
    "financial_services": 5, "technology": 5, "transport": 3, "utilities": 5,
    "real_estate": 3, "professional_services": 5, "government": 5, "ngo": 3,
    "other": 3
}

# ======================== AUTH ENDPOINTS ========================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "phone": user_data.phone,
        "phone_country_code": user_data.phone_country_code,
        "full_name": user_data.full_name,
        "role": user_data.role,
        "password_hash": hash_password(user_data.password),
        "is_verified": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, user_data.role)
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            phone=user_data.phone,
            full_name=user_data.full_name,
            role=user_data.role,
            created_at=user_doc["created_at"],
            is_verified=False
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["role"])
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            phone=user["phone"],
            full_name=user["full_name"],
            role=user["role"],
            created_at=user["created_at"],
            is_verified=user.get("is_verified", False)
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        phone=user["phone"],
        full_name=user["full_name"],
        role=user["role"],
        created_at=user["created_at"],
        is_verified=user.get("is_verified", False)
    )

# Google OAuth Callback
class GoogleAuthCallback(BaseModel):
    session_id: str
    role: str = "employee"

class GoogleAuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    is_new_user: bool

@api_router.post("/auth/google/callback", response_model=GoogleAuthResponse)
async def google_auth_callback(data: GoogleAuthCallback):
    import httpx
    
    try:
        # Get user data from Emergent Auth
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": data.session_id}
            )
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            auth_data = response.json()
    except Exception as e:
        logger.error(f"Google auth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")
    
    email = auth_data.get("email")
    name = auth_data.get("name", "")
    picture = auth_data.get("picture", "")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    is_new_user = False
    
    if existing_user:
        # Existing user - update if needed
        user_id = existing_user["id"]
        user_role = existing_user["role"]
        
        # Update picture if changed
        if picture and existing_user.get("picture") != picture:
            await db.users.update_one(
                {"id": user_id},
                {"$set": {"picture": picture}}
            )
    else:
        # New user - create account
        is_new_user = True
        user_id = str(uuid.uuid4())
        user_role = data.role if data.role in ["employee", "employer"] else "employee"
        
        user_doc = {
            "id": user_id,
            "email": email,
            "phone": "",
            "full_name": name,
            "role": user_role,
            "picture": picture,
            "password_hash": "",  # No password for OAuth users
            "auth_provider": "google",
            "is_verified": True,  # Google accounts are pre-verified
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
        existing_user = user_doc
    
    # Create token
    token = create_token(user_id, user_role)
    
    return GoogleAuthResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            email=email,
            phone=existing_user.get("phone", ""),
            full_name=existing_user.get("full_name", name),
            role=user_role,
            created_at=existing_user.get("created_at", datetime.now(timezone.utc).isoformat()),
            is_verified=True
        ),
        is_new_user=is_new_user
    )

# ======================== EMPLOYER ENDPOINTS ========================

@api_router.post("/employers", response_model=EmployerResponse)
async def create_employer(data: EmployerCreate, user: dict = Depends(require_role(UserRole.EMPLOYER))):
    # Check if employer profile exists
    existing = await db.employers.find_one({"user_id": user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Employer profile already exists")
    
    employer_id = str(uuid.uuid4())
    employer_doc = {
        "id": employer_id,
        "user_id": user["id"],
        **data.model_dump(),
        "status": "pending",
        "risk_score": None,
        "risk_factors": {},
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.employers.insert_one(employer_doc)
    
    return EmployerResponse(**{k: v for k, v in employer_doc.items() if k != "_id"})

@api_router.get("/employers/me", response_model=EmployerResponse)
async def get_my_employer(user: dict = Depends(require_role(UserRole.EMPLOYER))):
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    return EmployerResponse(**employer)

@api_router.get("/employers", response_model=List[EmployerResponse])
async def list_employers(status: Optional[str] = None, user: dict = Depends(require_role(UserRole.ADMIN))):
    query = {}
    if status:
        query["status"] = status
    employers = await db.employers.find(query, {"_id": 0}).to_list(1000)
    return [EmployerResponse(**e) for e in employers]

# Public endpoint for employee registration - list approved employers only
@api_router.get("/employers/public/approved", response_model=List[EmployerResponse])
async def list_approved_employers_public():
    """Public endpoint to list approved employers for employee registration"""
    employers = await db.employers.find({"status": "approved"}, {"_id": 0}).to_list(1000)
    return [EmployerResponse(**e) for e in employers]

@api_router.get("/employers/{employer_id}", response_model=EmployerResponse)
async def get_employer(employer_id: str, user: dict = Depends(require_role(UserRole.ADMIN, UserRole.EMPLOYER))):
    employer = await db.employers.find_one({"id": employer_id}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    return EmployerResponse(**employer)

@api_router.patch("/employers/{employer_id}/status")
async def update_employer_status(employer_id: str, status: str, user: dict = Depends(require_role(UserRole.ADMIN))):
    result = await db.employers.update_one(
        {"id": employer_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Employer not found")
    return {"message": "Status updated"}

# ======================== EMPLOYER ONBOARDING ENDPOINTS ========================

# Business sectors for employer onboarding
BUSINESS_SECTORS = [
    {"code": "agriculture", "name": "Agriculture & Farming", "category": "Primary"},
    {"code": "mining", "name": "Mining & Quarrying", "category": "Primary"},
    {"code": "manufacturing", "name": "Manufacturing", "category": "Secondary"},
    {"code": "construction", "name": "Construction", "category": "Secondary"},
    {"code": "utilities", "name": "Utilities (Water, Electricity, Gas)", "category": "Secondary"},
    {"code": "wholesale_retail", "name": "Wholesale & Retail Trade", "category": "Tertiary"},
    {"code": "hospitality", "name": "Hospitality & Tourism", "category": "Tertiary"},
    {"code": "transport_logistics", "name": "Transport & Logistics", "category": "Tertiary"},
    {"code": "ict", "name": "ICT & Telecommunications", "category": "Tertiary"},
    {"code": "financial_services", "name": "Financial Services & Insurance", "category": "Tertiary"},
    {"code": "real_estate", "name": "Real Estate", "category": "Tertiary"},
    {"code": "professional_services", "name": "Professional Services (Legal, Accounting)", "category": "Tertiary"},
    {"code": "education", "name": "Education & Training", "category": "Tertiary"},
    {"code": "healthcare", "name": "Healthcare & Pharmaceuticals", "category": "Tertiary"},
    {"code": "media_entertainment", "name": "Media & Entertainment", "category": "Tertiary"},
    {"code": "ngo", "name": "NGO & Non-Profit", "category": "Tertiary"},
    {"code": "government", "name": "Government & Public Sector", "category": "Tertiary"},
    {"code": "security", "name": "Security Services", "category": "Tertiary"},
    {"code": "other", "name": "Other", "category": "Other"},
]

@api_router.get("/employers/onboarding/sectors")
async def get_business_sectors():
    """Get list of business sectors for employer onboarding"""
    return BUSINESS_SECTORS

@api_router.post("/employers/onboarding", response_model=EmployerOnboardingResponse)
async def create_employer_onboarding(data: EmployerOnboardingCreate, user: dict = Depends(require_role(UserRole.EMPLOYER))):
    """Create or update employer onboarding profile with comprehensive due diligence data"""
    # Check if employer profile already exists
    existing = await db.employers.find_one({"user_id": user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Employer profile already exists. Use update endpoint.")
    
    employer_id = str(uuid.uuid4())
    
    # Prepare documents dict from uploaded document paths
    documents = {}
    doc_fields = [
        'certificate_of_incorporation', 'business_registration', 'tax_compliance_certificate',
        'cr12_document', 'kra_pin_certificate', 'business_permit', 'audited_financials',
        'bank_statement', 'proof_of_address', 'proof_of_bank_account', 'employment_contract_template'
    ]
    for field in doc_fields:
        value = getattr(data, field, None)
        if value:
            documents[field] = value
    
    employer_doc = {
        "id": employer_id,
        "user_id": user["id"],
        "company_name": data.company_name,
        "registration_number": data.registration_number,
        "date_of_incorporation": data.date_of_incorporation,
        "country": data.country,
        "physical_address": data.physical_address,
        "city": data.city,
        "postal_code": data.postal_code,
        "county_region": data.county_region,
        "tax_id": data.tax_id,
        "vat_number": data.vat_number,
        "beneficial_owners": data.beneficial_owners or [],
        "industry": data.industry,
        "sector": data.sector,
        "business_description": data.business_description,
        "years_in_operation": data.years_in_operation,
        "employee_count": data.employee_count,
        "countries_of_operation": data.countries_of_operation or [],
        "annual_revenue_range": data.annual_revenue_range,
        "payroll_cycle": data.payroll_cycle,
        "monthly_payroll_amount": data.monthly_payroll_amount,
        "bank_name": data.bank_name,
        "bank_account_number": data.bank_account_number,
        "contact_person": data.contact_person,
        "contact_email": data.contact_email,
        "contact_phone": data.contact_phone,
        "contact_position": data.contact_position,
        "status": "pending",
        "kyc_status": "pending",
        "risk_score": None,
        "onboarding_step": 7,  # Completed all steps
        "documents": documents,
        "created_at": datetime.now(timezone.utc).isoformat(),
        # Legacy fields for compatibility
        "address": data.physical_address,
    }
    
    await db.employers.insert_one(employer_doc)
    
    # Return response
    result = {k: v for k, v in employer_doc.items() if k != "_id"}
    return EmployerOnboardingResponse(**result)

@api_router.put("/employers/onboarding")
async def update_employer_onboarding(data: EmployerOnboardingCreate, user: dict = Depends(require_role(UserRole.EMPLOYER))):
    """Update employer onboarding profile"""
    existing = await db.employers.find_one({"user_id": user["id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Employer profile not found. Create one first.")
    
    # Prepare documents dict
    documents = existing.get("documents", {})
    doc_fields = [
        'certificate_of_incorporation', 'business_registration', 'tax_compliance_certificate',
        'cr12_document', 'kra_pin_certificate', 'business_permit', 'audited_financials',
        'bank_statement', 'proof_of_address', 'proof_of_bank_account', 'employment_contract_template'
    ]
    for field in doc_fields:
        value = getattr(data, field, None)
        if value:
            documents[field] = value
    
    update_data = {
        "company_name": data.company_name,
        "registration_number": data.registration_number,
        "date_of_incorporation": data.date_of_incorporation,
        "country": data.country,
        "physical_address": data.physical_address,
        "city": data.city,
        "postal_code": data.postal_code,
        "county_region": data.county_region,
        "tax_id": data.tax_id,
        "vat_number": data.vat_number,
        "beneficial_owners": data.beneficial_owners or [],
        "industry": data.industry,
        "sector": data.sector,
        "business_description": data.business_description,
        "years_in_operation": data.years_in_operation,
        "employee_count": data.employee_count,
        "countries_of_operation": data.countries_of_operation or [],
        "annual_revenue_range": data.annual_revenue_range,
        "payroll_cycle": data.payroll_cycle,
        "monthly_payroll_amount": data.monthly_payroll_amount,
        "bank_name": data.bank_name,
        "bank_account_number": data.bank_account_number,
        "contact_person": data.contact_person,
        "contact_email": data.contact_email,
        "contact_phone": data.contact_phone,
        "contact_position": data.contact_position,
        "documents": documents,
        "address": data.physical_address,
    }
    
    await db.employers.update_one(
        {"user_id": user["id"]},
        {"$set": update_data}
    )
    
    return {"message": "Employer profile updated successfully"}

@api_router.patch("/employers/onboarding/step")
async def update_employer_onboarding_step(step: int, user: dict = Depends(require_role(UserRole.EMPLOYER))):
    """Update employer onboarding step for progress tracking"""
    result = await db.employers.update_one(
        {"user_id": user["id"]},
        {"$set": {"onboarding_step": step}}
    )
    if result.matched_count == 0:
        # Create a minimal employer record to track progress
        await db.employers.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "onboarding_step": step,
            "status": "onboarding",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    return {"message": "Step updated", "step": step}

@api_router.post("/employers/onboarding/document")
async def upload_employer_document(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    user: dict = Depends(require_role(UserRole.EMPLOYER))
):
    """Upload employer onboarding document"""
    # Validate document type
    valid_types = [
        'certificate_of_incorporation', 'business_registration', 'tax_compliance_certificate',
        'cr12_document', 'kra_pin_certificate', 'business_permit', 'audited_financials',
        'bank_statement', 'proof_of_address', 'proof_of_bank_account', 'employment_contract_template'
    ]
    if document_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid document type. Must be one of: {', '.join(valid_types)}")
    
    # Create employer documents directory
    employer_doc_dir = UPLOAD_DIR / "employer_docs"
    employer_doc_dir.mkdir(exist_ok=True)
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ['.pdf', '.jpg', '.jpeg', '.png', '.webp']:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: PDF, JPG, PNG, WebP")
    
    unique_filename = f"{user['id']}_{document_type}_{uuid.uuid4().hex[:8]}{file_extension}"
    file_path = employer_doc_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    document_url = f"/uploads/employer_docs/{unique_filename}"
    
    # Update employer record with document path
    await db.employers.update_one(
        {"user_id": user["id"]},
        {"$set": {f"documents.{document_type}": document_url}}
    )
    
    return {
        "document_type": document_type,
        "document_url": document_url,
        "filename": file.filename
    }

# ======================== EMPLOYEE ENDPOINTS ========================

@api_router.post("/employees", response_model=EmployeeResponse)
async def create_employee(data: EmployeeCreate, user: dict = Depends(require_role(UserRole.EMPLOYEE))):
    # Check if employee profile exists
    existing = await db.employees.find_one({"user_id": user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Employee profile already exists")
    
    # Employer is optional - will be auto-assigned later by admin
    employer = None
    employer_name = None
    if data.employer_id:
        employer = await db.employers.find_one({"id": data.employer_id}, {"_id": 0})
        if employer:
            employer_name = employer.get("company_name")
    
    employee_id = str(uuid.uuid4())
    advance_limit = data.monthly_salary * 0.5  # 50% of salary
    
    # Auto-generate employee code if not provided
    employee_code = data.employee_code
    if not employee_code:
        employee_code = f"EMP-{uuid.uuid4().hex[:8].upper()}"
    
    employee_doc = {
        "id": employee_id,
        "user_id": user["id"],
        **data.model_dump(),
        "employee_code": employee_code,  # Override with auto-generated if needed
        "status": "pending",
        "risk_score": None,
        "risk_factors": {},
        "kyc_status": "pending",
        "kyc_step": 0,
        "earned_wages": 0,
        "advance_limit": advance_limit,
        "created_at": datetime.now(timezone.utc).isoformat(),
        # Initialize KYC document fields
        "id_document_front": None,
        "id_document_back": None,
        "address_proof": None,
        "tax_certificate": None,
        "payslip_1": None,
        "payslip_2": None,
        "bank_statement": None,
        "selfie": None,
        "employment_contract": None
    }
    await db.employees.insert_one(employee_doc)
    
    return EmployeeResponse(
        **{k: v for k, v in employee_doc.items() if k != "_id"},
        employer_name=employer_name
    )

@api_router.get("/employees/me", response_model=EmployeeResponse)
async def get_my_employee(user: dict = Depends(require_role(UserRole.EMPLOYEE))):
    employee = await db.employees.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    
    # Get employer name if not already in employee document
    if not employee.get("employer_name") and employee.get("employer_id"):
        employer = await db.employers.find_one({"id": employee.get("employer_id")}, {"_id": 0})
        if employer:
            employee["employer_name"] = employer.get("company_name")
    
    return EmployeeResponse(**employee)

@api_router.get("/employees", response_model=List[EmployeeResponse])
async def list_employees(
    employer_id: Optional[str] = None,
    status: Optional[str] = None,
    kyc_status: Optional[str] = None,
    user: dict = Depends(require_role(UserRole.ADMIN, UserRole.EMPLOYER))
):
    query = {}
    if user["role"] == UserRole.EMPLOYER:
        employer = await db.employers.find_one({"user_id": user["id"]})
        if employer:
            query["employer_id"] = employer["id"]
    elif employer_id:
        query["employer_id"] = employer_id
    if status:
        query["status"] = status
    if kyc_status:
        query["kyc_status"] = kyc_status
    
    employees = await db.employees.find(query, {"_id": 0}).to_list(1000)
    
    # Get employer names
    employer_ids = list(set(e.get("employer_id") for e in employees))
    employers = await db.employers.find({"id": {"$in": employer_ids}}, {"_id": 0}).to_list(1000)
    employer_map = {e["id"]: e["company_name"] for e in employers}
    
    return [EmployeeResponse(**e, employer_name=employer_map.get(e.get("employer_id"))) for e in employees]

@api_router.patch("/employees/{employee_id}/status")
async def update_employee_status(employee_id: str, status: str, user: dict = Depends(require_role(UserRole.ADMIN))):
    result = await db.employees.update_one(
        {"id": employee_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Status updated"}

@api_router.patch("/employees/{employee_id}/kyc-status")
async def update_employee_kyc_status(employee_id: str, kyc_status: str, user: dict = Depends(require_role(UserRole.ADMIN))):
    result = await db.employees.update_one(
        {"id": employee_id},
        {"$set": {"kyc_status": kyc_status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "KYC status updated"}

# ======================== ADVANCE ENDPOINTS ========================

@api_router.post("/advances", response_model=AdvanceResponse)
async def create_advance(data: AdvanceCreate, user: dict = Depends(require_role(UserRole.EMPLOYEE))):
    employee = await db.employees.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    
    if employee["status"] != "approved" or employee["kyc_status"] != "approved":
        raise HTTPException(status_code=400, detail="Account not verified")
    
    if data.amount > employee["advance_limit"]:
        raise HTTPException(status_code=400, detail=f"Amount exceeds limit of {employee['advance_limit']}")
    
    if data.amount > employee["earned_wages"]:
        raise HTTPException(status_code=400, detail=f"Amount exceeds earned wages of {employee['earned_wages']}")
    
    employer = await db.employers.find_one({"id": employee["employer_id"]}, {"_id": 0})
    
    # Calculate fee based on risk scores
    employee_crs = employee.get("risk_score", 3.0)
    employer_crs = employer.get("risk_score", 3.0) if employer else 3.0
    total_crs = (employee_crs + employer_crs) / 2
    fee_percentage = calculate_application_fee(total_crs)
    fee_amount = data.amount * (fee_percentage / 100)
    net_amount = data.amount - fee_amount
    
    # Get disbursement details
    disbursement_details = {}
    if data.disbursement_method == "mobile_money":
        disbursement_details = {
            "provider": employee.get("mobile_money_provider"),
            "number": employee.get("mobile_money_number")
        }
    else:
        disbursement_details = {
            "bank": employee.get("bank_name"),
            "account": employee.get("bank_account")
        }
    
    advance_id = str(uuid.uuid4())
    advance_doc = {
        "id": advance_id,
        "employee_id": employee["id"],
        "employee_name": user["full_name"],
        "employer_id": employee["employer_id"],
        "employer_name": employer["company_name"] if employer else "Unknown",
        "amount": data.amount,
        "fee_percentage": fee_percentage,
        "fee_amount": fee_amount,
        "net_amount": net_amount,
        "disbursement_method": data.disbursement_method,
        "disbursement_details": disbursement_details,
        "status": "pending",
        "reason": data.reason,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "processed_at": None
    }
    await db.advances.insert_one(advance_doc)
    
    # Create transaction record
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "advance_request",
        "amount": data.amount,
        "reference": advance_id,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "metadata": {"advance_id": advance_id}
    })
    
    return AdvanceResponse(**{k: v for k, v in advance_doc.items() if k != "_id"})

@api_router.get("/advances", response_model=List[AdvanceResponse])
async def list_advances(
    status: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    query = {}
    
    if user["role"] == UserRole.EMPLOYEE:
        employee = await db.employees.find_one({"user_id": user["id"]})
        if employee:
            query["employee_id"] = employee["id"]
    elif user["role"] == UserRole.EMPLOYER:
        employer = await db.employers.find_one({"user_id": user["id"]})
        if employer:
            query["employer_id"] = employer["id"]
    
    if status:
        query["status"] = status
    
    advances = await db.advances.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [AdvanceResponse(**a) for a in advances]

@api_router.get("/advances/{advance_id}", response_model=AdvanceResponse)
async def get_advance(advance_id: str, user: dict = Depends(get_current_user)):
    advance = await db.advances.find_one({"id": advance_id}, {"_id": 0})
    if not advance:
        raise HTTPException(status_code=404, detail="Advance not found")
    return AdvanceResponse(**advance)

@api_router.patch("/advances/{advance_id}/approve")
async def approve_advance(advance_id: str, user: dict = Depends(require_role(UserRole.ADMIN))):
    advance = await db.advances.find_one({"id": advance_id}, {"_id": 0})
    if not advance:
        raise HTTPException(status_code=404, detail="Advance not found")
    
    if advance["status"] != "pending":
        raise HTTPException(status_code=400, detail="Advance already processed")
    
    # Update advance status
    await db.advances.update_one(
        {"id": advance_id},
        {"$set": {"status": "approved", "processed_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Update employee earned wages
    await db.employees.update_one(
        {"id": advance["employee_id"]},
        {"$inc": {"earned_wages": -advance["amount"]}}
    )
    
    # Update transaction
    await db.transactions.update_one(
        {"reference": advance_id},
        {"$set": {"status": "approved"}}
    )
    
    return {"message": "Advance approved"}

@api_router.patch("/advances/{advance_id}/disburse")
async def disburse_advance(advance_id: str, user: dict = Depends(require_role(UserRole.ADMIN))):
    advance = await db.advances.find_one({"id": advance_id}, {"_id": 0})
    if not advance:
        raise HTTPException(status_code=404, detail="Advance not found")
    
    if advance["status"] != "approved":
        raise HTTPException(status_code=400, detail="Advance not approved")
    
    # Mock disbursement - in production, integrate with mobile money/bank APIs
    disbursement_ref = f"EW-{datetime.now().strftime('%Y%m%d%H%M%S')}-{advance_id[:8]}"
    
    await db.advances.update_one(
        {"id": advance_id},
        {"$set": {
            "status": "disbursed",
            "disbursement_reference": disbursement_ref,
            "disbursed_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Create disbursement transaction
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": advance["employee_id"],
        "type": "disbursement",
        "amount": advance["net_amount"],
        "reference": disbursement_ref,
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "metadata": {"advance_id": advance_id, "method": advance["disbursement_method"]}
    })
    
    return {"message": "Disbursement initiated", "reference": disbursement_ref}

@api_router.patch("/advances/{advance_id}/reject")
async def reject_advance(advance_id: str, reason: str = "", user: dict = Depends(require_role(UserRole.ADMIN))):
    result = await db.advances.update_one(
        {"id": advance_id, "status": "pending"},
        {"$set": {"status": "rejected", "rejection_reason": reason, "processed_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Advance not found or already processed")
    
    await db.transactions.update_one(
        {"reference": advance_id},
        {"$set": {"status": "rejected"}}
    )
    
    return {"message": "Advance rejected"}

# ======================== KYC ENDPOINTS ========================

@api_router.post("/kyc/documents", response_model=KYCDocumentResponse)
async def upload_kyc_document(data: KYCDocumentCreate, user: dict = Depends(get_current_user)):
    doc_id = str(uuid.uuid4())
    doc = {
        "id": doc_id,
        "user_id": user["id"],
        **data.model_dump(),
        "status": "pending",
        "reviewer_notes": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "reviewed_at": None
    }
    await db.kyc_documents.insert_one(doc)
    
    # Update KYC status to submitted
    if user["role"] == UserRole.EMPLOYEE:
        await db.employees.update_one(
            {"user_id": user["id"]},
            {"$set": {"kyc_status": "submitted"}}
        )
    
    return KYCDocumentResponse(**{k: v for k, v in doc.items() if k != "_id"})

@api_router.get("/kyc/documents", response_model=List[KYCDocumentResponse])
async def list_kyc_documents(
    user_id: Optional[str] = None,
    status: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    query = {}
    if user["role"] != UserRole.ADMIN:
        query["user_id"] = user["id"]
    elif user_id:
        query["user_id"] = user_id
    if status:
        query["status"] = status
    
    docs = await db.kyc_documents.find(query, {"_id": 0}).to_list(1000)
    return [KYCDocumentResponse(**d) for d in docs]

@api_router.patch("/kyc/documents/{doc_id}/review")
async def review_kyc_document(doc_id: str, status: str, notes: str = "", user: dict = Depends(require_role(UserRole.ADMIN))):
    result = await db.kyc_documents.update_one(
        {"id": doc_id},
        {"$set": {
            "status": status,
            "reviewer_notes": notes,
            "reviewed_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document reviewed"}

# File Upload endpoint for KYC documents
@api_router.post("/kyc/upload")
async def upload_kyc_file(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    document_number: Optional[str] = Form(None),
    user: dict = Depends(get_current_user)
):
    """Upload a KYC document file"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.")
    
    # Validate file size (max 5MB)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    if file_size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 5MB")
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix if file.filename else ".jpg"
    unique_filename = f"{user['id']}_{document_type}_{uuid.uuid4().hex[:8]}{file_ext}"
    file_path = KYC_UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create document record
    doc_id = str(uuid.uuid4())
    doc_url = f"/api/kyc/files/{unique_filename}"
    doc = {
        "id": doc_id,
        "user_id": user["id"],
        "document_type": document_type,
        "document_url": doc_url,
        "document_number": document_number,
        "file_name": file.filename,
        "file_size": file_size,
        "content_type": file.content_type,
        "status": "pending",
        "reviewer_notes": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "reviewed_at": None
    }
    await db.kyc_documents.insert_one(doc)
    
    # Update employee's document path
    if user["role"] == UserRole.EMPLOYEE:
        update_field = None
        if document_type == "id_front":
            update_field = "id_document_front"
        elif document_type == "id_back":
            update_field = "id_document_back"
        elif document_type == "address_proof":
            update_field = "address_proof"
        elif document_type == "tax_certificate":
            update_field = "tax_certificate"
        elif document_type == "payslip_1":
            update_field = "payslip_1"
        elif document_type == "payslip_2":
            update_field = "payslip_2"
        elif document_type == "bank_statement":
            update_field = "bank_statement"
        elif document_type == "selfie":
            update_field = "selfie"
        elif document_type == "employment_contract":
            update_field = "employment_contract"
        
        if update_field:
            await db.employees.update_one(
                {"user_id": user["id"]},
                {"$set": {update_field: doc_url, "kyc_status": "submitted"}}
            )
    
    return {
        "id": doc_id,
        "document_type": document_type,
        "document_url": doc_url,
        "file_name": file.filename,
        "file_size": file_size,
        "status": "pending"
    }

# Serve uploaded KYC files
@api_router.get("/kyc/files/{filename}")
async def get_kyc_file(filename: str, user: dict = Depends(get_current_user)):
    """Serve a KYC document file"""
    file_path = KYC_UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # For admin, allow access to any file
    # For users, verify they own the file
    if user["role"] != UserRole.ADMIN:
        if not filename.startswith(user["id"]):
            raise HTTPException(status_code=403, detail="Access denied")
    
    from fastapi.responses import FileResponse
    return FileResponse(file_path)

# Update employee KYC step
@api_router.patch("/employees/me/kyc-step")
async def update_employee_kyc_step(step: int, user: dict = Depends(require_role(UserRole.EMPLOYEE))):
    """Update the current KYC onboarding step for tracking progress"""
    result = await db.employees.update_one(
        {"user_id": user["id"]},
        {"$set": {"kyc_step": step}}
    )
    if result.modified_count == 0:
        # Employee profile might not exist yet, which is fine
        pass
    return {"message": "KYC step updated", "step": step}

# Get employee KYC status with documents
@api_router.get("/employees/me/kyc-status")
async def get_employee_kyc_status(user: dict = Depends(require_role(UserRole.EMPLOYEE))):
    """Get comprehensive KYC status for the employee"""
    employee = await db.employees.find_one({"user_id": user["id"]}, {"_id": 0})
    documents = await db.kyc_documents.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    
    # Check which documents are uploaded and approved
    doc_status = {}
    for doc in documents:
        doc_status[doc["document_type"]] = {
            "status": doc["status"],
            "uploaded_at": doc["created_at"],
            "document_url": doc["document_url"]
        }
    
    return {
        "kyc_status": employee.get("kyc_status", "pending") if employee else "not_started",
        "kyc_step": employee.get("kyc_step", 0) if employee else 0,
        "documents": doc_status,
        "has_employee_profile": employee is not None
    }

# ======================== RISK SCORING ENDPOINTS ========================

@api_router.post("/risk-scores/employer/{employer_id}")
async def update_employer_risk_score(employer_id: str, data: RiskScoreUpdate, user: dict = Depends(require_role(UserRole.ADMIN))):
    employer = await db.employers.find_one({"id": employer_id}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    scores = {
        "legal_compliance": data.legal_compliance,
        "financial_health": data.financial_health,
        "operational": data.operational,
        "sector_exposure": data.sector_exposure,
        "aml_transparency": data.aml_transparency
    }
    
    crs = calculate_composite_risk_score(scores, EMPLOYER_WEIGHTS)
    rating = get_risk_rating(crs)
    fee = calculate_application_fee(crs)
    
    await db.employers.update_one(
        {"id": employer_id},
        {"$set": {
            "risk_score": crs,
            "risk_factors": scores,
            "risk_rating": rating
        }}
    )
    
    # Store risk score history
    await db.risk_scores.insert_one({
        "id": str(uuid.uuid4()),
        "entity_type": "employer",
        "entity_id": employer_id,
        "scores": scores,
        "composite_risk_score": crs,
        "risk_rating": rating,
        "application_fee_percentage": fee,
        "calculated_at": datetime.now(timezone.utc).isoformat()
    })
    
    return RiskScoreResponse(
        entity_type="employer",
        entity_id=employer_id,
        legal_compliance_score=calculate_composite_risk_score({"legal_compliance": data.legal_compliance}, {"legal_compliance": EMPLOYER_WEIGHTS["legal_compliance"]}),
        financial_health_score=calculate_composite_risk_score({"financial_health": data.financial_health}, {"financial_health": EMPLOYER_WEIGHTS["financial_health"]}),
        operational_score=calculate_composite_risk_score({"operational": data.operational}, {"operational": EMPLOYER_WEIGHTS["operational"]}),
        sector_exposure_score=calculate_composite_risk_score({"sector_exposure": data.sector_exposure}, {"sector_exposure": EMPLOYER_WEIGHTS["sector_exposure"]}),
        aml_transparency_score=calculate_composite_risk_score({"aml_transparency": data.aml_transparency}, {"aml_transparency": EMPLOYER_WEIGHTS["aml_transparency"]}),
        composite_risk_score=crs,
        risk_rating=rating,
        application_fee_percentage=fee,
        calculated_at=datetime.now(timezone.utc).isoformat()
    )

@api_router.post("/risk-scores/employee/{employee_id}")
async def update_employee_risk_score(employee_id: str, data: RiskScoreUpdate, user: dict = Depends(require_role(UserRole.ADMIN))):
    employee = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    scores = {
        "legal_compliance": data.legal_compliance,
        "financial_health": data.financial_health,
        "operational": data.operational
    }
    
    crs = calculate_composite_risk_score(scores, EMPLOYEE_WEIGHTS)
    rating = get_risk_rating(crs)
    
    await db.employees.update_one(
        {"id": employee_id},
        {"$set": {
            "risk_score": crs,
            "risk_factors": scores,
            "risk_rating": rating
        }}
    )
    
    # Store risk score history
    await db.risk_scores.insert_one({
        "id": str(uuid.uuid4()),
        "entity_type": "employee",
        "entity_id": employee_id,
        "scores": scores,
        "composite_risk_score": crs,
        "risk_rating": rating,
        "calculated_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"message": "Risk score updated", "composite_risk_score": crs, "risk_rating": rating}

@api_router.get("/risk-scores/{entity_type}/{entity_id}")
async def get_risk_score(entity_type: str, entity_id: str, user: dict = Depends(require_role(UserRole.ADMIN))):
    score = await db.risk_scores.find_one(
        {"entity_type": entity_type, "entity_id": entity_id},
        {"_id": 0},
        sort=[("calculated_at", -1)]
    )
    if not score:
        raise HTTPException(status_code=404, detail="Risk score not found")
    return score

# ======================== PAYROLL ENDPOINTS ========================

@api_router.post("/payroll/upload")
async def upload_payroll(data: PayrollUpload, user: dict = Depends(require_role(UserRole.EMPLOYER))):
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    # Process each employee's payroll
    for emp_data in data.employees:
        employee = await db.employees.find_one({
            "employer_id": employer["id"],
            "employee_code": emp_data.get("employee_code")
        })
        
        if employee:
            days_worked = emp_data.get("days_worked", 0)
            gross_salary = emp_data.get("gross_salary", employee.get("monthly_salary", 0))
            
            # Calculate earned wages (pro-rata based on days worked)
            daily_rate = gross_salary / 30
            earned_wages = daily_rate * days_worked
            advance_limit = earned_wages * 0.5  # 50% of earned wages
            
            await db.employees.update_one(
                {"id": employee["id"]},
                {"$set": {
                    "earned_wages": earned_wages,
                    "advance_limit": advance_limit,
                    "last_payroll_update": datetime.now(timezone.utc).isoformat()
                }}
            )
    
    # Store payroll record
    await db.payroll_records.insert_one({
        "id": str(uuid.uuid4()),
        "employer_id": employer["id"],
        "month": data.month,
        "employees": data.employees,
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"message": f"Payroll uploaded for {len(data.employees)} employees"}

@api_router.get("/payroll/history")
async def get_payroll_history(user: dict = Depends(require_role(UserRole.EMPLOYER))):
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    records = await db.payroll_records.find(
        {"employer_id": employer["id"]},
        {"_id": 0}
    ).sort("uploaded_at", -1).to_list(100)
    
    return records

# ======================== TRANSACTION ENDPOINTS ========================

@api_router.get("/transactions", response_model=List[TransactionResponse])
async def list_transactions(user: dict = Depends(get_current_user)):
    query = {"user_id": user["id"]}
    
    if user["role"] == UserRole.EMPLOYEE:
        employee = await db.employees.find_one({"user_id": user["id"]})
        if employee:
            query = {"$or": [{"user_id": user["id"]}, {"user_id": employee["id"]}]}
    
    transactions = await db.transactions.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [TransactionResponse(**t) for t in transactions]

# ======================== DASHBOARD ENDPOINTS ========================

@api_router.get("/dashboard/employee", response_model=EmployeeDashboardStats)
async def get_employee_dashboard(user: dict = Depends(require_role(UserRole.EMPLOYEE))):
    employee = await db.employees.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    
    # Get total advances
    advances = await db.advances.find({"employee_id": employee["id"]}, {"_id": 0}).to_list(1000)
    total_advances = sum(a.get("amount", 0) for a in advances if a.get("status") in ["approved", "disbursed"])
    pending_repayment = sum(a.get("amount", 0) for a in advances if a.get("status") == "disbursed")
    
    # Get recent transactions
    transactions = await db.transactions.find(
        {"$or": [{"user_id": user["id"]}, {"user_id": employee["id"]}]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(10)
    
    return EmployeeDashboardStats(
        earned_wages=employee.get("earned_wages", 0),
        advance_limit=employee.get("advance_limit", 0),
        total_advances=total_advances,
        pending_repayment=pending_repayment,
        recent_transactions=[TransactionResponse(**t) for t in transactions]
    )

@api_router.get("/dashboard/employer", response_model=EmployerDashboardStats)
async def get_employer_dashboard(user: dict = Depends(require_role(UserRole.EMPLOYER))):
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    employees = await db.employees.find({"employer_id": employer["id"]}, {"_id": 0}).to_list(1000)
    active_employees = [e for e in employees if e.get("status") == "approved"]
    
    advances = await db.advances.find({"employer_id": employer["id"]}, {"_id": 0}).to_list(1000)
    total_disbursed = sum(a.get("amount", 0) for a in advances if a.get("status") in ["approved", "disbursed"])
    pending_advances = len([a for a in advances if a.get("status") == "pending"])
    
    monthly_payroll = sum(e.get("monthly_salary", 0) for e in active_employees)
    
    return EmployerDashboardStats(
        total_employees=len(employees),
        active_employees=len(active_employees),
        total_advances_disbursed=total_disbursed,
        pending_advances=pending_advances,
        monthly_payroll=monthly_payroll,
        risk_score=employer.get("risk_score")
    )

@api_router.get("/dashboard/admin", response_model=AdminDashboardStats)
async def get_admin_dashboard(user: dict = Depends(require_role(UserRole.ADMIN))):
    employers = await db.employers.find({}, {"_id": 0}).to_list(1000)
    employees = await db.employees.find({}, {"_id": 0}).to_list(1000)
    
    pending_employer_verifications = len([e for e in employers if e.get("status") == "pending"])
    pending_employee_verifications = len([e for e in employees if e.get("kyc_status") == "submitted"])
    
    # Today's advances
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    advances = await db.advances.find({"created_at": {"$gte": today_start.isoformat()}}, {"_id": 0}).to_list(1000)
    total_advances_today = sum(a.get("amount", 0) for a in advances)
    pending_disbursements = len([a for a in advances if a.get("status") == "approved"])
    
    return AdminDashboardStats(
        total_employers=len(employers),
        total_employees=len(employees),
        pending_employer_verifications=pending_employer_verifications,
        pending_employee_verifications=pending_employee_verifications,
        total_advances_today=total_advances_today,
        pending_disbursements=pending_disbursements
    )

# ======================== UTILITY ENDPOINTS ========================

@api_router.get("/countries")
async def get_countries():
    return [
        {"code": "KE", "name": "Kenya", "currency": "KES", "mobile_money": ["M-PESA", "Airtel Money"]},
        {"code": "UG", "name": "Uganda", "currency": "UGX", "mobile_money": ["MTN Mobile Money", "Airtel Money"]},
        {"code": "TZ", "name": "Tanzania", "currency": "TZS", "mobile_money": ["M-PESA", "Tigo Pesa", "Airtel Money"]},
        {"code": "RW", "name": "Rwanda", "currency": "RWF", "mobile_money": ["MTN Mobile Money", "Airtel Money"]}
    ]

@api_router.get("/industries")
async def get_industries():
    return [
        {"code": "agriculture", "name": "Agriculture", "risk": "medium"},
        {"code": "manufacturing", "name": "Manufacturing", "risk": "medium"},
        {"code": "construction", "name": "Construction", "risk": "medium"},
        {"code": "mining", "name": "Mining & Quarrying", "risk": "high"},
        {"code": "retail", "name": "Retail & Wholesale", "risk": "medium"},
        {"code": "hospitality", "name": "Hospitality & Tourism", "risk": "medium"},
        {"code": "healthcare", "name": "Healthcare", "risk": "low"},
        {"code": "education", "name": "Education", "risk": "low"},
        {"code": "financial_services", "name": "Financial Services", "risk": "low"},
        {"code": "technology", "name": "Technology & IT", "risk": "low"},
        {"code": "transport", "name": "Transport & Logistics", "risk": "medium"},
        {"code": "utilities", "name": "Utilities", "risk": "low"},
        {"code": "real_estate", "name": "Real Estate", "risk": "medium"},
        {"code": "professional_services", "name": "Professional Services", "risk": "low"},
        {"code": "government", "name": "Government", "risk": "low"},
        {"code": "ngo", "name": "NGO & Non-Profit", "risk": "medium"},
        {"code": "other", "name": "Other", "risk": "medium"}
    ]

# ======================== PROFILE PICTURE ENDPOINTS ========================

@api_router.post("/users/me/profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """Upload or update user's profile picture"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.")
    
    # Validate file size (max 2MB)
    content = await file.read()
    file_size = len(content)
    if file_size > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 2MB")
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix if file.filename else ".jpg"
    unique_filename = f"{user['id']}_profile_{uuid.uuid4().hex[:8]}{file_ext}"
    file_path = PROFILE_UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    profile_url = f"/api/profiles/{unique_filename}"
    
    # Update user's profile picture URL
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"profile_picture_url": profile_url}}
    )
    
    return {
        "profile_picture_url": profile_url,
        "file_size": file_size,
        "message": "Profile picture uploaded successfully"
    }

@api_router.get("/profiles/{filename}")
async def get_profile_picture(filename: str):
    """Serve a profile picture file"""
    file_path = PROFILE_UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(file_path)

# ======================== USER SETTINGS ENDPOINTS ========================

class UserSettingsUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    phone_country_code: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class EmployeeSettingsUpdate(BaseModel):
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    mobile_money_provider: Optional[str] = None
    mobile_money_number: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None

@api_router.put("/users/me/settings")
async def update_user_settings(
    data: UserSettingsUpdate,
    user: dict = Depends(get_current_user)
):
    """Update user's basic settings"""
    update_data = {}
    if data.full_name is not None:
        update_data["full_name"] = data.full_name
    if data.phone is not None:
        update_data["phone"] = data.phone
    if data.phone_country_code is not None:
        update_data["phone_country_code"] = data.phone_country_code
    
    if update_data:
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": update_data}
        )
    
    return {"message": "Settings updated successfully"}

@api_router.post("/users/me/change-password")
async def change_password(
    data: ChangePasswordRequest,
    user: dict = Depends(get_current_user)
):
    """Change the current user's password"""
    # Get the full user with password hash
    user_doc = await db.users.find_one({"id": user["id"]})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(data.current_password, user_doc.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    # Update password
    new_hash = hash_password(data.new_password)
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"password_hash": new_hash}}
    )
    
    return {"message": "Password changed successfully"}

@api_router.put("/employees/me/settings")
async def update_employee_settings(
    data: EmployeeSettingsUpdate,
    user: dict = Depends(require_role(UserRole.EMPLOYEE))
):
    """Update employee's profile settings"""
    update_data = {}
    if data.address_line1 is not None:
        update_data["address_line1"] = data.address_line1
    if data.address_line2 is not None:
        update_data["address_line2"] = data.address_line2
    if data.city is not None:
        update_data["city"] = data.city
    if data.postal_code is not None:
        update_data["postal_code"] = data.postal_code
    if data.mobile_money_provider is not None:
        update_data["mobile_money_provider"] = data.mobile_money_provider
    if data.mobile_money_number is not None:
        update_data["mobile_money_number"] = data.mobile_money_number
    if data.bank_name is not None:
        update_data["bank_name"] = data.bank_name
    if data.bank_account is not None:
        update_data["bank_account"] = data.bank_account
    
    if update_data:
        result = await db.employees.update_one(
            {"user_id": user["id"]},
            {"$set": update_data}
        )
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Employee profile not found")
    
    return {"message": "Employee settings updated successfully"}

@api_router.get("/users/me/full-profile")
async def get_full_user_profile(user: dict = Depends(get_current_user)):
    """Get complete user profile with all details including employee info"""
    user_data = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    
    result = {
        "id": user_data.get("id"),
        "email": user_data.get("email"),
        "phone": user_data.get("phone"),
        "phone_country_code": user_data.get("phone_country_code"),
        "full_name": user_data.get("full_name"),
        "role": user_data.get("role"),
        "profile_picture_url": user_data.get("profile_picture_url"),
        "is_verified": user_data.get("is_verified", False),
        "created_at": user_data.get("created_at"),
    }
    
    # If employee, include employee profile data
    if user_data.get("role") == "employee":
        employee = await db.employees.find_one({"user_id": user["id"]}, {"_id": 0})
        if employee:
            result["employee"] = employee
            
            # Get employer name
            if employee.get("employer_id"):
                employer = await db.employers.find_one({"id": employee["employer_id"]}, {"_id": 0})
                if employer:
                    result["employee"]["employer_name"] = employer.get("company_name")
            
            # Get KYC documents
            documents = await db.kyc_documents.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
            result["kyc_documents"] = documents
    
    return result

# ======================== EMPLOYER SETTINGS ENDPOINTS ========================

class EmployerAddressUpdate(BaseModel):
    physical_address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    county_region: Optional[str] = None
    country: Optional[str] = None

@api_router.put("/employers/me/address")
async def update_employer_address(
    data: EmployerAddressUpdate,
    user: dict = Depends(require_role(UserRole.EMPLOYER))
):
    """Update employer's address details"""
    update_data = {}
    if data.physical_address is not None:
        update_data["physical_address"] = data.physical_address
        update_data["address"] = data.physical_address
    if data.city is not None:
        update_data["city"] = data.city
    if data.postal_code is not None:
        update_data["postal_code"] = data.postal_code
    if data.county_region is not None:
        update_data["county_region"] = data.county_region
    if data.country is not None:
        update_data["country"] = data.country
    
    if update_data:
        result = await db.employers.update_one(
            {"user_id": user["id"]},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Employer profile not found")
    
    return {"message": "Address updated successfully"}

class BankChangeRequest(BaseModel):
    new_bank_name: str
    new_bank_account_number: str
    reason: str

@api_router.post("/employers/me/bank-change-request")
async def request_bank_change(
    data: BankChangeRequest,
    user: dict = Depends(require_role(UserRole.EMPLOYER))
):
    """Request a bank account change (requires approval)"""
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    request_id = str(uuid.uuid4())
    request_doc = {
        "id": request_id,
        "employer_id": employer["id"],
        "user_id": user["id"],
        "type": "bank_change",
        "current_bank_name": employer.get("bank_name"),
        "current_bank_account": employer.get("bank_account_number"),
        "new_bank_name": data.new_bank_name,
        "new_bank_account_number": data.new_bank_account_number,
        "reason": data.reason,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.change_requests.insert_one(request_doc)
    
    return {"message": "Bank change request submitted for approval", "request_id": request_id}

# Per-Employee EWA Settings
class EmployeeEWASettings(BaseModel):
    max_advance_percentage: Optional[float] = None  # Override employer default
    min_advance_amount: Optional[float] = None
    max_advance_amount: Optional[float] = None
    cooldown_period: Optional[int] = None  # Days
    ewa_enabled: bool = True

@api_router.put("/employees/{employee_id}/ewa-settings")
async def update_employee_ewa_settings(
    employee_id: str,
    data: EmployeeEWASettings,
    user: dict = Depends(require_role(UserRole.EMPLOYER))
):
    """Update EWA settings for a specific employee"""
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    # Verify employee belongs to this employer
    employee = await db.employees.find_one({"id": employee_id, "employer_id": employer["id"]}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    ewa_settings = {
        "max_advance_percentage": data.max_advance_percentage,
        "min_advance_amount": data.min_advance_amount,
        "max_advance_amount": data.max_advance_amount,
        "cooldown_period": data.cooldown_period,
        "ewa_enabled": data.ewa_enabled
    }
    
    await db.employees.update_one(
        {"id": employee_id},
        {"$set": {"ewa_settings": ewa_settings}}
    )
    
    return {"message": "Employee EWA settings updated"}

@api_router.get("/employees/{employee_id}/ewa-settings")
async def get_employee_ewa_settings(
    employee_id: str,
    user: dict = Depends(require_role(UserRole.EMPLOYER))
):
    """Get EWA settings for a specific employee"""
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    employee = await db.employees.find_one({"id": employee_id, "employer_id": employer["id"]}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return employee.get("ewa_settings", {
        "max_advance_percentage": None,
        "min_advance_amount": None,
        "max_advance_amount": None,
        "cooldown_period": None,
        "ewa_enabled": True
    })

# ======================== SEED DATA ENDPOINT ========================

@api_router.post("/seed/demo-employees")
async def seed_demo_employees(user: dict = Depends(require_role(UserRole.EMPLOYER))):
    """Seed 60 demo employees with varying parameters for the employer"""
    import random
    
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    # Check if already seeded
    existing = await db.employees.count_documents({"employer_id": employer["id"]})
    if existing >= 50:
        return {"message": f"Already have {existing} employees", "count": existing}
    
    # Sample data for realistic employees
    first_names = ["John", "Jane", "David", "Sarah", "Michael", "Emily", "James", "Grace", "Peter", "Mary",
                   "Daniel", "Ruth", "Joseph", "Faith", "Samuel", "Esther", "Brian", "Agnes", "Kevin", "Florence",
                   "Dennis", "Mercy", "Patrick", "Joyce", "George", "Catherine", "Collins", "Lucy", "Victor", "Ann"]
    last_names = ["Mwangi", "Ochieng", "Wanjiku", "Kamau", "Otieno", "Njeri", "Kimani", "Achieng", "Omondi", "Wambui",
                  "Kibet", "Akinyi", "Mutua", "Chebet", "Nyambura", "Kiprop", "Muthoni", "Rotich", "Kariuki", "Kosgei"]
    departments = ["Sales", "Marketing", "Engineering", "Operations", "Finance", "HR", "Customer Support", "Product", "Legal", "Admin"]
    job_titles = ["Manager", "Senior Specialist", "Specialist", "Associate", "Assistant", "Coordinator", "Analyst", "Engineer", "Executive", "Officer"]
    employment_types = ["full-time", "full-time", "full-time", "full-time", "part-time", "contract"]
    kyc_statuses = ["approved", "approved", "approved", "approved", "pending", "submitted", "rejected"]
    statuses = ["approved", "approved", "approved", "approved", "pending", "pending"]
    
    employees_created = []
    
    for i in range(60):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        full_name = f"{first_name} {last_name}"
        department = random.choice(departments)
        job_title = f"{random.choice(job_titles)} - {department}"
        
        # Varying salaries based on seniority
        base_salary = random.randint(30000, 150000)
        
        # Varying start dates (1-5 years ago)
        days_ago = random.randint(30, 1825)  # 1 month to 5 years
        start_date = (datetime.now(timezone.utc) - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        
        # Calculate tenure in months
        tenure_months = days_ago // 30
        
        # Earned wages based on days worked this month
        days_worked = random.randint(10, 25)
        daily_rate = base_salary / 30
        earned_wages = daily_rate * days_worked
        
        # Random KYC and status
        kyc_status = random.choice(kyc_statuses)
        status = random.choice(statuses)
        
        # Per-employee EWA settings (some have custom, some use defaults)
        ewa_settings = None
        if random.random() < 0.3:  # 30% have custom settings
            ewa_settings = {
                "max_advance_percentage": random.choice([30, 40, 50, 60]),
                "min_advance_amount": random.choice([500, 1000, 2000]),
                "max_advance_amount": random.choice([20000, 30000, 50000]),
                "cooldown_period": random.choice([3, 5, 7, 14]),
                "ewa_enabled": random.random() > 0.1  # 90% enabled
            }
        
        employee_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        employee_code = f"EMP-{str(i+1).zfill(4)}"
        email = f"{first_name.lower()}.{last_name.lower()}{i}@testcorp.com"
        
        # Create user
        await db.users.insert_one({
            "id": user_id,
            "email": email,
            "phone": f"+2547{random.randint(10000000, 99999999)}",
            "full_name": full_name,
            "role": "employee",
            "password_hash": hash_password("Employee@123"),
            "is_verified": kyc_status == "approved",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=days_ago)).isoformat()
        })
        
        # Create employee
        employee_doc = {
            "id": employee_id,
            "user_id": user_id,
            "employer_id": employer["id"],
            "employee_code": employee_code,
            "national_id": f"ID{random.randint(10000000, 99999999)}",
            "date_of_birth": f"{random.randint(1975, 2000)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "employment_type": random.choice(employment_types),
            "job_title": job_title,
            "department": department,
            "monthly_salary": base_salary,
            "country": "KE",
            "start_date": start_date,
            "tenure_months": tenure_months,
            "status": status,
            "kyc_status": kyc_status,
            "kyc_step": 7 if kyc_status == "approved" else random.randint(0, 6),
            "earned_wages": earned_wages if status == "approved" else 0,
            "advance_limit": earned_wages * 0.5 if status == "approved" else 0,
            "risk_score": round(random.uniform(2.5, 5.0), 2) if kyc_status == "approved" else None,
            "ewa_settings": ewa_settings,
            "created_at": (datetime.now(timezone.utc) - timedelta(days=days_ago)).isoformat(),
            "mobile_money_provider": random.choice(["M-PESA", "Airtel Money"]),
            "mobile_money_number": f"+2547{random.randint(10000000, 99999999)}",
        }
        await db.employees.insert_one(employee_doc)
        
        employees_created.append(employee_id)
        
        # Create some advances for approved employees
        if status == "approved" and kyc_status == "approved" and random.random() < 0.5:
            advance_count = random.randint(1, 5)
            for _ in range(advance_count):
                advance_id = str(uuid.uuid4())
                advance_amount = random.randint(1000, int(earned_wages * 0.4))
                fee_percentage = round(random.uniform(3.5, 6.5), 2)
                fee_amount = advance_amount * (fee_percentage / 100)
                advance_status = random.choice(["disbursed", "disbursed", "disbursed", "approved", "pending", "repaid"])
                
                days_ago_advance = random.randint(1, min(days_ago, 90))
                
                await db.advances.insert_one({
                    "id": advance_id,
                    "employee_id": employee_id,
                    "employee_name": full_name,
                    "employer_id": employer["id"],
                    "employer_name": employer.get("company_name"),
                    "amount": advance_amount,
                    "fee_percentage": fee_percentage,
                    "fee_amount": fee_amount,
                    "net_amount": advance_amount - fee_amount,
                    "disbursement_method": random.choice(["mobile_money", "bank_transfer"]),
                    "disbursement_details": {"provider": "M-PESA"},
                    "status": advance_status,
                    "created_at": (datetime.now(timezone.utc) - timedelta(days=days_ago_advance)).isoformat()
                })
    
    return {"message": f"Created {len(employees_created)} demo employees with advances", "count": len(employees_created)}

# Enhanced Dashboard with retention metrics
@api_router.get("/dashboard/employer/extended")
async def get_employer_dashboard_extended(user: dict = Depends(require_role(UserRole.EMPLOYER))):
    """Get extended employer dashboard with retention metrics"""
    employer = await db.employers.find_one({"user_id": user["id"]}, {"_id": 0})
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    employees = await db.employees.find({"employer_id": employer["id"]}, {"_id": 0}).to_list(1000)
    advances = await db.advances.find({"employer_id": employer["id"]}, {"_id": 0}).to_list(10000)
    
    # Basic stats
    total_employees = len(employees)
    active_employees = len([e for e in employees if e.get("status") == "approved"])
    pending_employees = len([e for e in employees if e.get("status") == "pending"])
    
    # KYC stats
    kyc_approved = len([e for e in employees if e.get("kyc_status") == "approved"])
    kyc_pending = len([e for e in employees if e.get("kyc_status") in ["pending", "submitted"]])
    kyc_rejected = len([e for e in employees if e.get("kyc_status") == "rejected"])
    kyc_completion_rate = round((kyc_approved / total_employees * 100), 1) if total_employees > 0 else 0
    
    # Tenure/Retention stats
    tenures = [e.get("tenure_months", 0) for e in employees if e.get("tenure_months")]
    avg_tenure = round(sum(tenures) / len(tenures), 1) if tenures else 0
    
    # Calculate retention rate (employees with > 12 months tenure)
    long_tenure = len([t for t in tenures if t >= 12])
    retention_rate = round((long_tenure / total_employees * 100), 1) if total_employees > 0 else 0
    
    # New hires (last 30 days)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    new_hires = len([e for e in employees if e.get("created_at") and datetime.fromisoformat(e["created_at"].replace('Z', '+00:00')) > thirty_days_ago])
    
    # Department breakdown
    department_counts = {}
    for e in employees:
        dept = e.get("department", "Unassigned")
        department_counts[dept] = department_counts.get(dept, 0) + 1
    
    # Salary stats
    salaries = [e.get("monthly_salary", 0) for e in employees if e.get("monthly_salary")]
    avg_salary = round(sum(salaries) / len(salaries)) if salaries else 0
    total_payroll = sum(salaries)
    
    # Advance stats
    total_disbursed = sum(a.get("amount", 0) for a in advances if a.get("status") in ["approved", "disbursed"])
    pending_advances = len([a for a in advances if a.get("status") == "pending"])
    
    # EWA utilization
    employees_with_advances = len(set(a.get("employee_id") for a in advances))
    ewa_utilization_rate = round((employees_with_advances / active_employees * 100), 1) if active_employees > 0 else 0
    
    return {
        "total_employees": total_employees,
        "active_employees": active_employees,
        "pending_employees": pending_employees,
        "kyc_approved": kyc_approved,
        "kyc_pending": kyc_pending,
        "kyc_rejected": kyc_rejected,
        "kyc_completion_rate": kyc_completion_rate,
        "avg_tenure_months": avg_tenure,
        "retention_rate": retention_rate,
        "new_hires_30_days": new_hires,
        "department_breakdown": department_counts,
        "avg_salary": avg_salary,
        "total_monthly_payroll": total_payroll,
        "total_advances_disbursed": total_disbursed,
        "monthly_advances_disbursed": total_disbursed,  # For Payroll page sync
        "avg_fee_rate": 4.5,  # Default fee rate
        "pending_advances": pending_advances,
        "ewa_utilization_rate": ewa_utilization_rate,
        "employees_with_advances": employees_with_advances,
        "risk_score": employer.get("risk_score")
    }

# ============================================
# ADMIN PORTAL ENDPOINTS
# ============================================

# Review Requests (from employers requesting risk score review, etc.)
@api_router.post("/admin/review-requests")
async def create_review_request(
    data: dict,
    user: dict = Depends(get_current_user)
):
    """Create a review request from employer (e.g., risk score review)"""
    request_id = str(uuid.uuid4())
    await db.admin_requests.insert_one({
        "id": request_id,
        "type": data.get("type", "general"),
        "employer_id": data.get("employer_id"),
        "user_id": user["id"],
        "message": data.get("message"),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Review request submitted", "request_id": request_id}

@api_router.get("/admin/review-requests")
async def get_review_requests(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get all review requests for admin"""
    requests = await db.admin_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return requests

# Admin Dashboard - Platform Overview
@api_router.get("/admin/dashboard")
async def get_admin_dashboard(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get comprehensive admin dashboard stats"""
    # Employers
    employers = await db.employers.find({}, {"_id": 0}).to_list(1000)
    total_employers = len(employers)
    active_employers = len([e for e in employers if e.get("status") == "approved"])
    pending_employers = len([e for e in employers if e.get("status") == "pending"])
    
    # Employees
    employees = await db.employees.find({}, {"_id": 0}).to_list(10000)
    total_employees = len(employees)
    active_employees = len([e for e in employees if e.get("status") == "approved"])
    pending_employees = len([e for e in employees if e.get("status") == "pending"])
    
    # KYC Stats
    kyc_pending_employers = len([e for e in employers if e.get("status") == "pending"])
    kyc_pending_employees = len([e for e in employees if e.get("kyc_status") in ["pending", "submitted"]])
    
    # Advances
    advances = await db.advances.find({}, {"_id": 0}).to_list(10000)
    total_advances = len(advances)
    total_disbursed = sum(a.get("amount", 0) for a in advances if a.get("status") in ["approved", "disbursed", "repaid"])
    total_fees = sum(a.get("fee_amount", 0) for a in advances if a.get("status") in ["approved", "disbursed", "repaid"])
    pending_advances = len([a for a in advances if a.get("status") == "pending"])
    
    # Monthly stats (current month)
    current_month = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_advances = [a for a in advances if a.get("created_at") and datetime.fromisoformat(a["created_at"].replace('Z', '+00:00')) >= current_month]
    monthly_disbursed = sum(a.get("amount", 0) for a in monthly_advances if a.get("status") in ["approved", "disbursed"])
    monthly_fees = sum(a.get("fee_amount", 0) for a in monthly_advances if a.get("status") in ["approved", "disbursed"])
    
    # Risk distribution
    employer_risk_scores = [e.get("risk_score", 3.0) for e in employers if e.get("risk_score")]
    avg_employer_risk = round(sum(employer_risk_scores) / len(employer_risk_scores), 2) if employer_risk_scores else 0
    
    # Review requests
    pending_reviews = await db.admin_requests.count_documents({"status": "pending"})
    
    # API Health (mock)
    api_health = {
        "mpesa": {"status": "healthy", "latency": 120},
        "airtel_money": {"status": "healthy", "latency": 95},
        "bank_api": {"status": "healthy", "latency": 200},
        "payroll_sync": {"status": "healthy", "latency": 150}
    }
    
    return {
        "employers": {
            "total": total_employers,
            "active": active_employers,
            "pending": pending_employers
        },
        "employees": {
            "total": total_employees,
            "active": active_employees,
            "pending": pending_employees
        },
        "kyc_pending": {
            "employers": kyc_pending_employers,
            "employees": kyc_pending_employees
        },
        "advances": {
            "total_count": total_advances,
            "total_disbursed": total_disbursed,
            "total_fees": total_fees,
            "pending_count": pending_advances
        },
        "monthly": {
            "disbursed": monthly_disbursed,
            "fees": monthly_fees,
            "advance_count": len(monthly_advances)
        },
        "risk": {
            "avg_employer_score": avg_employer_risk
        },
        "pending_reviews": pending_reviews,
        "api_health": api_health
    }

# Admin - List all employers
@api_router.get("/admin/employers")
async def admin_list_employers(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get all employers for admin management"""
    employers = await db.employers.find({}, {"_id": 0}).to_list(1000)
    # Enrich with user data
    for employer in employers:
        user_data = await db.users.find_one({"id": employer.get("user_id")}, {"_id": 0, "password_hash": 0})
        employer["user"] = user_data
        # Get employee count
        emp_count = await db.employees.count_documents({"employer_id": employer["id"]})
        employer["employee_count_actual"] = emp_count
    return employers

# Admin - Update employer status
@api_router.patch("/admin/employers/{employer_id}/status")
async def admin_update_employer_status(
    employer_id: str,
    data: dict,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Activate/deactivate employer account"""
    new_status = data.get("status")
    if new_status not in ["approved", "pending", "rejected", "suspended"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.employers.update_one(
        {"id": employer_id},
        {"$set": {"status": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    return {"message": f"Employer status updated to {new_status}"}

# Admin - Override employer risk score
@api_router.patch("/admin/employers/{employer_id}/risk-score")
async def admin_override_employer_risk(
    employer_id: str,
    data: dict,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Manually override employer risk score"""
    new_score = data.get("risk_score")
    reason = data.get("reason", "Admin override")
    
    if not 0 <= new_score <= 5:
        raise HTTPException(status_code=400, detail="Risk score must be between 0 and 5")
    
    # Determine rating
    if new_score >= 4:
        rating = "A"
    elif new_score >= 3:
        rating = "B"
    elif new_score >= 2.6:
        rating = "C"
    else:
        rating = "D"
    
    result = await db.employers.update_one(
        {"id": employer_id},
        {"$set": {
            "risk_score": new_score,
            "risk_rating": rating,
            "risk_override": {
                "admin_id": user["id"],
                "reason": reason,
                "timestamp": datetime.now(timezone.utc).isoformat()
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    return {"message": f"Risk score updated to {new_score} ({rating})", "rating": rating}

# Admin - List all employees across all employers
@api_router.get("/admin/employees")
async def admin_list_employees(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get all employees for admin management"""
    employees = await db.employees.find({}, {"_id": 0}).to_list(10000)
    # Enrich with employer name
    employer_cache = {}
    for emp in employees:
        employer_id = emp.get("employer_id")
        if employer_id and employer_id not in employer_cache:
            employer = await db.employers.find_one({"id": employer_id}, {"_id": 0, "company_name": 1})
            employer_cache[employer_id] = employer.get("company_name") if employer else "Unknown"
        emp["employer_name"] = employer_cache.get(employer_id, "Unknown")
    return employees

# Admin - Get single employee with full details and advance history
@api_router.get("/admin/employees/{employee_id}")
async def admin_get_employee_detail(
    employee_id: str,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Get detailed employee info including advance history"""
    employee = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Get employer name
    if employee.get("employer_id"):
        employer = await db.employers.find_one({"id": employee["employer_id"]}, {"_id": 0})
        employee["employer_name"] = employer.get("company_name") if employer else "Unknown"
    
    # Get user details
    user_data = await db.users.find_one({"id": employee.get("user_id")}, {"_id": 0})
    if user_data:
        employee["email"] = user_data.get("email")
        employee["phone"] = user_data.get("phone")
        employee["full_name"] = user_data.get("full_name")
    
    # Get advance history
    advances = await db.advances.find(
        {"employee_id": employee_id}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Get KYC documents
    kyc_docs = await db.kyc_documents.find(
        {"user_id": employee.get("user_id")},
        {"_id": 0}
    ).to_list(100)
    
    # Calculate advance statistics
    total_advances = sum(a.get("amount", 0) for a in advances if a.get("status") in ["approved", "disbursed"])
    pending_repayment = sum(a.get("amount", 0) for a in advances if a.get("status") == "disbursed")
    total_fees_paid = sum(a.get("fee_amount", 0) for a in advances if a.get("status") == "disbursed")
    
    return {
        **employee,
        "advances": advances,
        "kyc_documents": kyc_docs,
        "advance_stats": {
            "total_advances": total_advances,
            "pending_repayment": pending_repayment,
            "total_fees_paid": total_fees_paid,
            "advance_count": len([a for a in advances if a.get("status") in ["approved", "disbursed"]])
        }
    }

# Admin - Update employee details
@api_router.put("/admin/employees/{employee_id}")
async def admin_update_employee(
    employee_id: str,
    data: dict,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Update employee details (limited fields)"""
    allowed_fields = [
        "job_title", "department", "monthly_salary", "employment_type",
        "bank_name", "bank_account", "mobile_money_provider", "mobile_money_number"
    ]
    
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Recalculate advance limit if salary changed
    if "monthly_salary" in update_data:
        update_data["advance_limit"] = update_data["monthly_salary"] * 0.5
    
    result = await db.employees.update_one(
        {"id": employee_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"message": "Employee updated successfully"}

# Admin - Update employee status
@api_router.patch("/admin/employees/{employee_id}/status")
async def admin_update_employee_status(
    employee_id: str,
    data: dict,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Activate/deactivate employee account"""
    new_status = data.get("status")
    if new_status not in ["approved", "pending", "rejected", "suspended"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.employees.update_one(
        {"id": employee_id},
        {"$set": {"status": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"message": f"Employee status updated to {new_status}"}

# Admin - Update employee KYC status
@api_router.patch("/admin/employees/{employee_id}/kyc")
async def admin_update_employee_kyc(
    employee_id: str,
    data: dict,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Approve/reject employee KYC"""
    new_status = data.get("kyc_status")
    if new_status not in ["approved", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Invalid KYC status")
    
    update_data = {
        "kyc_status": new_status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if new_status == "approved":
        update_data["status"] = "approved"
        update_data["kyc_step"] = 7
    
    result = await db.employees.update_one({"id": employee_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"message": f"Employee KYC status updated to {new_status}"}

# Admin - Override employee risk score
@api_router.patch("/admin/employees/{employee_id}/risk-score")
async def admin_override_employee_risk(
    employee_id: str,
    data: dict,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Manually override employee risk score"""
    new_score = data.get("risk_score")
    reason = data.get("reason", "Admin override")
    
    if not 0 <= new_score <= 5:
        raise HTTPException(status_code=400, detail="Risk score must be between 0 and 5")
    
    result = await db.employees.update_one(
        {"id": employee_id},
        {"$set": {
            "risk_score": new_score,
            "risk_override": {
                "admin_id": user["id"],
                "reason": reason,
                "timestamp": datetime.now(timezone.utc).isoformat()
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"message": f"Employee risk score updated to {new_score}"}

# Admin - Get all advances
@api_router.get("/admin/advances")
async def admin_list_advances(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get all advances for reconciliation"""
    advances = await db.advances.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    return advances

# Admin - Reconciliation summary
@api_router.get("/admin/reconciliation")
async def admin_get_reconciliation(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get reconciliation data with reference tracking"""
    advances = await db.advances.find({}, {"_id": 0}).to_list(10000)
    
    # Group by employer for reconciliation
    employer_reconciliation = {}
    for adv in advances:
        employer_id = adv.get("employer_id")
        if employer_id not in employer_reconciliation:
            employer_reconciliation[employer_id] = {
                "employer_id": employer_id,
                "employer_name": adv.get("employer_name", "Unknown"),
                "total_advances": 0,
                "total_amount": 0,
                "total_fees": 0,
                "pending_recoupment": 0,
                "recouped": 0,
                "advances": []
            }
        
        amount = adv.get("amount", 0)
        fee = adv.get("fee_amount", 0)
        status = adv.get("status")
        
        employer_reconciliation[employer_id]["total_advances"] += 1
        employer_reconciliation[employer_id]["total_amount"] += amount
        employer_reconciliation[employer_id]["total_fees"] += fee
        
        if status in ["disbursed", "approved"]:
            employer_reconciliation[employer_id]["pending_recoupment"] += amount + fee
        elif status == "repaid":
            employer_reconciliation[employer_id]["recouped"] += amount + fee
        
        # Add reference for tracking
        adv["reference"] = f"EWA-{adv.get('id', '')[:8].upper()}"
        employer_reconciliation[employer_id]["advances"].append(adv)
    
    return {
        "summary": {
            "total_employers": len(employer_reconciliation),
            "total_advances": sum(e["total_advances"] for e in employer_reconciliation.values()),
            "total_disbursed": sum(e["total_amount"] for e in employer_reconciliation.values()),
            "total_fees": sum(e["total_fees"] for e in employer_reconciliation.values()),
            "pending_recoupment": sum(e["pending_recoupment"] for e in employer_reconciliation.values()),
            "total_recouped": sum(e["recouped"] for e in employer_reconciliation.values())
        },
        "by_employer": list(employer_reconciliation.values())
    }

# Admin - Flag advance for fraud review
@api_router.post("/admin/advances/{advance_id}/flag")
async def admin_flag_advance(
    advance_id: str,
    data: dict,
    user: dict = Depends(require_role(UserRole.ADMIN))
):
    """Flag an advance for fraud review"""
    flag_type = data.get("flag_type", "suspicious")  # suspicious, fraud, mispayment
    notes = data.get("notes", "")
    
    result = await db.advances.update_one(
        {"id": advance_id},
        {"$set": {
            "flagged": True,
            "flag_type": flag_type,
            "flag_notes": notes,
            "flagged_by": user["id"],
            "flagged_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Advance not found")
    
    return {"message": f"Advance flagged as {flag_type}"}

# Admin - Get flagged advances
@api_router.get("/admin/advances/flagged")
async def admin_get_flagged_advances(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get all flagged advances for review"""
    flagged = await db.advances.find({"flagged": True}, {"_id": 0}).to_list(1000)
    return flagged

# Admin - Notifications
@api_router.get("/admin/notifications")
async def admin_get_notifications(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get admin notifications"""
    # Combine various notification sources
    notifications = []
    
    # Pending review requests
    reviews = await db.admin_requests.find({"status": "pending"}, {"_id": 0}).to_list(50)
    for r in reviews:
        notifications.append({
            "id": r["id"],
            "type": "review_request",
            "title": f"Risk Review Request",
            "message": r.get("message", "Employer requested risk score review"),
            "created_at": r.get("created_at"),
            "read": False
        })
    
    # Pending KYC (employers)
    pending_employers = await db.employers.find({"status": "pending"}, {"_id": 0, "id": 1, "company_name": 1, "created_at": 1}).to_list(20)
    for e in pending_employers:
        notifications.append({
            "id": f"emp-{e['id']}",
            "type": "employer_kyc",
            "title": "Employer Verification Pending",
            "message": f"{e.get('company_name', 'New employer')} awaiting verification",
            "created_at": e.get("created_at"),
            "read": False
        })
    
    # Flagged advances
    flagged = await db.advances.find({"flagged": True}, {"_id": 0, "id": 1, "flag_type": 1, "flagged_at": 1, "amount": 1}).to_list(20)
    for f in flagged:
        notifications.append({
            "id": f"flag-{f['id']}",
            "type": "flagged_advance",
            "title": f"Flagged: {f.get('flag_type', 'suspicious').title()}",
            "message": f"Advance of KES {f.get('amount', 0):,} requires review",
            "created_at": f.get("flagged_at"),
            "read": False
        })
    
    # Sort by date
    notifications.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return notifications[:50]

# Admin - API Health Status
@api_router.get("/admin/api-health")
async def admin_get_api_health(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get API health status for all integrations"""
    # Mock API health data
    return {
        "integrations": [
            {
                "name": "M-PESA API",
                "provider": "Safaricom",
                "status": "healthy",
                "latency_ms": 120,
                "uptime_percent": 99.8,
                "last_check": datetime.now(timezone.utc).isoformat(),
                "transactions_today": 156
            },
            {
                "name": "Airtel Money API",
                "provider": "Airtel",
                "status": "healthy",
                "latency_ms": 95,
                "uptime_percent": 99.5,
                "last_check": datetime.now(timezone.utc).isoformat(),
                "transactions_today": 89
            },
            {
                "name": "Bank Transfer API",
                "provider": "Banking Partner",
                "status": "healthy",
                "latency_ms": 200,
                "uptime_percent": 99.9,
                "last_check": datetime.now(timezone.utc).isoformat(),
                "transactions_today": 45
            },
            {
                "name": "Payroll Sync API",
                "provider": "Integrated Payroll",
                "status": "healthy",
                "latency_ms": 150,
                "uptime_percent": 99.7,
                "last_check": datetime.now(timezone.utc).isoformat(),
                "syncs_today": 12
            }
        ],
        "overall_status": "healthy",
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

# Admin - Reports
@api_router.get("/admin/reports/summary")
async def admin_get_reports_summary(user: dict = Depends(require_role(UserRole.ADMIN))):
    """Get platform-wide reports summary"""
    advances = await db.advances.find({}, {"_id": 0}).to_list(10000)
    employers = await db.employers.find({}, {"_id": 0}).to_list(1000)
    employees = await db.employees.find({}, {"_id": 0}).to_list(10000)
    
    # Monthly breakdown (last 6 months)
    monthly_data = {}
    for adv in advances:
        created = adv.get("created_at", "")
        if created:
            month = created[:7]  # YYYY-MM
            if month not in monthly_data:
                monthly_data[month] = {"disbursed": 0, "fees": 0, "count": 0}
            if adv.get("status") in ["approved", "disbursed", "repaid"]:
                monthly_data[month]["disbursed"] += adv.get("amount", 0)
                monthly_data[month]["fees"] += adv.get("fee_amount", 0)
                monthly_data[month]["count"] += 1
    
    # Country breakdown
    country_data = {}
    for emp in employers:
        country = emp.get("country", "KE")
        if country not in country_data:
            country_data[country] = {"employers": 0, "employees": 0, "disbursed": 0}
        country_data[country]["employers"] += 1
    
    for e in employees:
        country = e.get("country", "KE")
        if country in country_data:
            country_data[country]["employees"] += 1
    
    return {
        "monthly": monthly_data,
        "by_country": country_data,
        "totals": {
            "total_employers": len(employers),
            "total_employees": len(employees),
            "total_advances": len(advances),
            "total_disbursed": sum(a.get("amount", 0) for a in advances if a.get("status") in ["approved", "disbursed", "repaid"]),
            "total_fees": sum(a.get("fee_amount", 0) for a in advances if a.get("status") in ["approved", "disbursed", "repaid"])
        }
    }

@api_router.get("/")
async def root():
    return {"message": "EaziWage API v1.0", "status": "running"}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
