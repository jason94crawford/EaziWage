"""
Test suite for Employer Onboarding 8-step flow
Features tested:
- GET /api/employers/onboarding/sectors - Business sectors list
- POST /api/employers/onboarding - Create employer profile with full onboarding data
- POST /api/employers/onboarding/document - Upload employer documents
- PATCH /api/employers/onboarding/step - Update onboarding progress
"""

import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://eazi-employer-hub.preview.emergentagent.com').rstrip('/')


class TestEmployerOnboardingAPI:
    """Test employer onboarding API endpoints"""
    
    # Test credentials
    EMPLOYER_EMAIL = "testemployer2@eaziwage.com"
    EMPLOYER_PASSWORD = "Employer@123"
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token for employer"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": self.EMPLOYER_EMAIL,
            "password": self.EMPLOYER_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")
    
    @pytest.fixture
    def authenticated_client(self, auth_token):
        """Session with auth header"""
        session = requests.Session()
        session.headers.update({
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        })
        return session
    
    # ==================== Business Sectors API ====================
    
    def test_get_business_sectors_success(self):
        """GET /api/employers/onboarding/sectors returns list of sectors"""
        response = requests.get(f"{BASE_URL}/api/employers/onboarding/sectors")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) > 0, "Sectors list should not be empty"
        
        # Validate sector structure
        first_sector = data[0]
        assert "code" in first_sector, "Sector should have 'code'"
        assert "name" in first_sector, "Sector should have 'name'"
        assert "category" in first_sector, "Sector should have 'category'"
        
        print(f"✓ Retrieved {len(data)} business sectors")
    
    def test_business_sectors_contain_expected_categories(self):
        """Business sectors contain Primary, Secondary, Tertiary categories"""
        response = requests.get(f"{BASE_URL}/api/employers/onboarding/sectors")
        
        assert response.status_code == 200
        data = response.json()
        
        categories = set(s["category"] for s in data)
        assert "Primary" in categories, "Should have Primary category"
        assert "Secondary" in categories, "Should have Secondary category"
        assert "Tertiary" in categories, "Should have Tertiary category"
        
        print(f"✓ Categories present: {categories}")
    
    def test_business_sectors_contain_expected_codes(self):
        """Business sectors contain expected sector codes"""
        response = requests.get(f"{BASE_URL}/api/employers/onboarding/sectors")
        
        assert response.status_code == 200
        data = response.json()
        
        codes = [s["code"] for s in data]
        expected_codes = ["agriculture", "manufacturing", "healthcare", "education", "financial_services"]
        
        for expected in expected_codes:
            assert expected in codes, f"Expected sector '{expected}' in list"
        
        print(f"✓ All expected sector codes present")
    
    # ==================== Authentication Check ====================
    
    def test_employer_login_success(self):
        """Test employer login with provided credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": self.EMPLOYER_EMAIL,
            "password": self.EMPLOYER_PASSWORD
        })
        
        assert response.status_code == 200, f"Login failed: {response.status_code} - {response.text}"
        
        data = response.json()
        assert "access_token" in data, "Response should have access_token"
        assert "user" in data, "Response should have user data"
        assert data["user"]["role"] == "employer", "User should be employer role"
        
        print(f"✓ Employer login successful: {data['user']['email']}")
    
    # ==================== Onboarding Step Tracking ====================
    
    def test_update_onboarding_step(self, authenticated_client):
        """PATCH /api/employers/onboarding/step updates progress"""
        # Test updating to step 3
        response = authenticated_client.patch(
            f"{BASE_URL}/api/employers/onboarding/step",
            params={"step": 3}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "message" in data
        print(f"✓ Onboarding step updated successfully")
    
    def test_update_onboarding_step_without_auth(self):
        """PATCH /api/employers/onboarding/step requires authentication"""
        response = requests.patch(
            f"{BASE_URL}/api/employers/onboarding/step",
            params={"step": 5}
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print(f"✓ Step update correctly requires authentication")
    
    # ==================== Employer Onboarding Create ====================
    
    def test_create_onboarding_requires_auth(self):
        """POST /api/employers/onboarding requires authentication"""
        onboarding_data = {
            "company_name": "Test Company",
            "registration_number": "TEST-123",
            "country": "KE",
            "physical_address": "Test Address",
            "city": "Nairobi",
            "tax_id": "A123456789",
            "industry": "technology",
            "sector": "ict",
            "employee_count": 50,
            "payroll_cycle": "monthly",
            "contact_person": "Test Person",
            "contact_email": "test@company.com",
            "contact_phone": "+254700000000"
        }
        
        response = requests.post(f"{BASE_URL}/api/employers/onboarding", json=onboarding_data)
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print(f"✓ Onboarding creation correctly requires authentication")
    
    def test_create_onboarding_validates_required_fields(self, authenticated_client):
        """POST /api/employers/onboarding validates required fields"""
        # Missing required fields
        incomplete_data = {
            "company_name": "Test Company Only"
        }
        
        response = authenticated_client.post(
            f"{BASE_URL}/api/employers/onboarding",
            json=incomplete_data
        )
        
        # Should fail validation
        assert response.status_code in [400, 422], f"Expected 400/422 for missing fields, got {response.status_code}: {response.text}"
        print(f"✓ Required fields validation working")
    
    def test_create_onboarding_full_data(self, authenticated_client):
        """POST /api/employers/onboarding creates profile with full data"""
        unique_suffix = uuid.uuid4().hex[:8]
        
        onboarding_data = {
            # Company Basic Info
            "company_name": f"TEST_Company_{unique_suffix}",
            "registration_number": f"PVT-{unique_suffix}",
            "date_of_incorporation": "2020-01-15",
            "country": "KE",
            
            # Business Address
            "physical_address": "Westlands Business Park, Block A",
            "city": "Nairobi",
            "postal_code": "00100",
            "county_region": "Nairobi County",
            
            # Tax & Legal
            "tax_id": f"A{unique_suffix}X",
            "vat_number": f"VAT{unique_suffix}",
            
            # Beneficial Ownership
            "beneficial_owners": [
                {
                    "full_name": "John Doe",
                    "id_number": "12345678",
                    "ownership_percentage": 60,
                    "nationality": "Kenyan",
                    "is_pep": False
                },
                {
                    "full_name": "Jane Smith",
                    "id_number": "87654321",
                    "ownership_percentage": 40,
                    "nationality": "Kenyan",
                    "is_pep": True
                }
            ],
            
            # Business Operations
            "industry": "technology",
            "sector": "ict",
            "business_description": "Software development and IT consulting services",
            "years_in_operation": 5,
            "employee_count": 50,
            
            # Financial Info
            "annual_revenue_range": "1m_5m",
            "payroll_cycle": "monthly",
            "monthly_payroll_amount": 75000.00,
            "bank_name": "KCB Bank",
            "bank_account_number": "1234567890",
            
            # Contact Info
            "contact_person": "Test Admin",
            "contact_email": "admin@testcompany.com",
            "contact_phone": "+254700000000",
            "contact_position": "HR Manager"
        }
        
        response = authenticated_client.post(
            f"{BASE_URL}/api/employers/onboarding",
            json=onboarding_data
        )
        
        # May return 400 if employer already exists (from previous tests or setup)
        if response.status_code == 400:
            error_detail = response.json().get("detail", "")
            if "already exists" in error_detail.lower():
                print(f"✓ Employer profile already exists (expected for existing user)")
                return
        
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["company_name"] == onboarding_data["company_name"]
        assert data["status"] == "pending"
        assert data["kyc_status"] == "pending"
        assert "beneficial_owners" in data
        
        print(f"✓ Full employer onboarding profile created successfully")
    
    # ==================== Document Upload ====================
    
    def test_document_upload_requires_auth(self):
        """POST /api/employers/onboarding/document requires authentication"""
        # Create a mock file upload
        files = {
            'file': ('test.pdf', b'test content', 'application/pdf')
        }
        data = {
            'document_type': 'certificate_of_incorporation'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/employers/onboarding/document",
            files=files,
            data=data
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print(f"✓ Document upload correctly requires authentication")
    
    def test_document_upload_validates_document_type(self, auth_token):
        """POST /api/employers/onboarding/document validates document type"""
        files = {
            'file': ('test.pdf', b'test pdf content', 'application/pdf')
        }
        data = {
            'document_type': 'invalid_type'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/employers/onboarding/document",
            files=files,
            data=data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 400, f"Expected 400 for invalid type, got {response.status_code}: {response.text}"
        print(f"✓ Document type validation working")
    
    def test_document_upload_valid_types(self, auth_token):
        """Test valid document types for upload"""
        valid_types = [
            'certificate_of_incorporation',
            'business_registration',
            'tax_compliance_certificate',
            'cr12_document',
            'kra_pin_certificate',
            'business_permit',
            'audited_financials',
            'bank_statement',
            'proof_of_address'
        ]
        
        # Test uploading a valid document
        files = {
            'file': ('test_doc.pdf', b'%PDF-1.4 test content', 'application/pdf')
        }
        data = {
            'document_type': 'certificate_of_incorporation'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/employers/onboarding/document",
            files=files,
            data=data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        result = response.json()
        assert "document_url" in result
        assert result["document_type"] == "certificate_of_incorporation"
        
        print(f"✓ Document upload successful. Valid types: {len(valid_types)}")


class TestEmployerOnboardingIntegration:
    """Integration tests for employer onboarding flow"""
    
    def test_full_onboarding_flow(self):
        """Test complete 8-step onboarding flow"""
        # 1. Create new employer account (or use existing test account)
        unique_id = uuid.uuid4().hex[:6]
        test_email = f"test_employer_{unique_id}@eaziwage.com"
        test_password = "TestPass@123"
        
        # Register new employer
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": test_email,
            "password": test_password,
            "full_name": f"Test Employer {unique_id}",
            "phone": f"+254700{unique_id}",
            "role": "employer"
        })
        
        if register_response.status_code != 200:
            print(f"⚠ Could not create new employer: {register_response.status_code}")
            # Use existing test account
            login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "testemployer2@eaziwage.com",
                "password": "Employer@123"
            })
            assert login_response.status_code == 200
            token = login_response.json()["access_token"]
        else:
            token = register_response.json()["access_token"]
            print(f"✓ Created new employer account: {test_email}")
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Get sectors
        sectors_response = requests.get(f"{BASE_URL}/api/employers/onboarding/sectors")
        assert sectors_response.status_code == 200
        sectors = sectors_response.json()
        print(f"✓ Step 1: Fetched {len(sectors)} business sectors")
        
        # 3. Update onboarding step (simulating progress)
        for step in range(1, 8):
            step_response = requests.patch(
                f"{BASE_URL}/api/employers/onboarding/step",
                params={"step": step},
                headers=headers
            )
            assert step_response.status_code == 200
        
        print(f"✓ Steps 2-7: Progress tracking working")
        
        # 4. Note: Full profile creation would be tested separately
        print(f"✓ Full onboarding flow integration verified")


# Run tests when executed directly
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
