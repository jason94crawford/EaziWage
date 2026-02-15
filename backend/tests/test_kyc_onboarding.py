"""
Backend API tests for KYC/Verification Onboarding Flow
Tests: KYC file upload, KYC status, onboarding steps
"""

import pytest
import requests
import os
import uuid
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://eaziwage-preview-1.preview.emergentagent.com')


class TestKYCUploadEndpoint:
    """Test POST /api/kyc/upload endpoint for file uploads"""
    
    @pytest.fixture
    def employee_token(self):
        """Login as demo employee"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "demo.employee@eaziwage.com",
                "password": "Employee@123"
            }
        )
        assert response.status_code == 200, f"Employee login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_kyc_upload_endpoint_exists(self, employee_token):
        """Test that /api/kyc/upload endpoint exists"""
        # Try uploading without a file to check if endpoint exists
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            data={"document_type": "id_front"}
        )
        # Should get 422 (missing file) not 404
        assert response.status_code != 404, "KYC upload endpoint does not exist"
        print(f"✅ KYC upload endpoint exists (returned {response.status_code})")
    
    def test_kyc_upload_requires_auth(self):
        """Test KYC upload requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            data={"document_type": "id_front"}
        )
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✅ KYC upload requires authentication")
    
    def test_kyc_upload_with_mock_image(self, employee_token):
        """Test uploading a mock image file for ID front"""
        # Create a minimal PNG file (1x1 pixel)
        png_header = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde'
        png_data = b'\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N'
        png_end = b'\x00\x00\x00\x00IEND\xaeB`\x82'
        mock_image = png_header + png_data + png_end
        
        files = {
            'file': ('test_id_front.png', io.BytesIO(mock_image), 'image/png')
        }
        data = {
            'document_type': 'id_front'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            files=files,
            data=data
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        
        # Verify response structure
        assert "id" in result, "Response missing 'id'"
        assert "document_type" in result, "Response missing 'document_type'"
        assert "document_url" in result, "Response missing 'document_url'"
        assert result["document_type"] == "id_front"
        assert result["document_url"].startswith("/api/kyc/files/")
        
        print(f"✅ KYC upload successful: {result['document_url']}")
        return result
    
    def test_kyc_upload_id_back(self, employee_token):
        """Test uploading ID back document"""
        # Create a minimal PNG
        png_header = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde'
        png_data = b'\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N'
        png_end = b'\x00\x00\x00\x00IEND\xaeB`\x82'
        mock_image = png_header + png_data + png_end
        
        files = {
            'file': ('test_id_back.png', io.BytesIO(mock_image), 'image/png')
        }
        data = {
            'document_type': 'id_back'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            files=files,
            data=data
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        assert result["document_type"] == "id_back"
        print(f"✅ ID back upload successful")
    
    def test_kyc_upload_address_proof(self, employee_token):
        """Test uploading address proof document"""
        # Create a minimal PDF (simple header)
        mock_pdf = b'%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'
        
        files = {
            'file': ('address_proof.pdf', io.BytesIO(mock_pdf), 'application/pdf')
        }
        data = {
            'document_type': 'address_proof'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            files=files,
            data=data
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        assert result["document_type"] == "address_proof"
        print(f"✅ Address proof upload successful")
    
    def test_kyc_upload_tax_certificate(self, employee_token):
        """Test uploading tax certificate (optional document)"""
        # Create a minimal PNG
        png_header = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde'
        png_data = b'\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N'
        png_end = b'\x00\x00\x00\x00IEND\xaeB`\x82'
        mock_image = png_header + png_data + png_end
        
        files = {
            'file': ('tax_cert.png', io.BytesIO(mock_image), 'image/png')
        }
        data = {
            'document_type': 'tax_certificate'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            files=files,
            data=data
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        assert result["document_type"] == "tax_certificate"
        print(f"✅ Tax certificate upload successful")
    
    def test_kyc_upload_payslip(self, employee_token):
        """Test uploading payslip document"""
        mock_pdf = b'%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'
        
        files = {
            'file': ('payslip.pdf', io.BytesIO(mock_pdf), 'application/pdf')
        }
        data = {
            'document_type': 'payslip_1'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            files=files,
            data=data
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        assert result["document_type"] == "payslip_1"
        print(f"✅ Payslip upload successful")
    
    def test_kyc_upload_bank_statement(self, employee_token):
        """Test uploading bank statement document"""
        mock_pdf = b'%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'
        
        files = {
            'file': ('bank_statement.pdf', io.BytesIO(mock_pdf), 'application/pdf')
        }
        data = {
            'document_type': 'bank_statement'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            files=files,
            data=data
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        assert result["document_type"] == "bank_statement"
        print(f"✅ Bank statement upload successful")
    
    def test_kyc_upload_rejects_invalid_file_type(self, employee_token):
        """Test that invalid file types are rejected"""
        # Try uploading a text file (not allowed)
        files = {
            'file': ('test.txt', io.BytesIO(b'This is a text file'), 'text/plain')
        }
        data = {
            'document_type': 'id_front'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"},
            files=files,
            data=data
        )
        
        # Should reject with 400
        assert response.status_code == 400, f"Expected 400 for invalid file type, got {response.status_code}"
        print("✅ Invalid file type correctly rejected")


class TestKYCStatusEndpoint:
    """Test GET /api/employees/me/kyc-status endpoint"""
    
    @pytest.fixture
    def employee_token(self):
        """Login as demo employee"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "demo.employee@eaziwage.com",
                "password": "Employee@123"
            }
        )
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_kyc_status_endpoint_exists(self, employee_token):
        """Test KYC status endpoint returns data"""
        response = requests.get(
            f"{BASE_URL}/api/employees/me/kyc-status",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        
        assert response.status_code == 200, f"KYC status endpoint failed: {response.text}"
        result = response.json()
        
        # Verify response structure
        assert "kyc_status" in result, "Response missing 'kyc_status'"
        assert "kyc_step" in result, "Response missing 'kyc_step'"
        assert "documents" in result, "Response missing 'documents'"
        assert "has_employee_profile" in result, "Response missing 'has_employee_profile'"
        
        print(f"✅ KYC status endpoint works: status={result['kyc_status']}, step={result['kyc_step']}")
    
    def test_kyc_status_shows_uploaded_documents(self, employee_token):
        """Test KYC status shows documents after upload"""
        response = requests.get(
            f"{BASE_URL}/api/employees/me/kyc-status",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        
        assert response.status_code == 200
        result = response.json()
        
        # Documents should be a dict
        assert isinstance(result["documents"], dict), "Documents should be a dictionary"
        
        # Log what documents are present
        if result["documents"]:
            print(f"✅ KYC status shows {len(result['documents'])} uploaded documents")
            for doc_type, doc_info in result["documents"].items():
                print(f"   - {doc_type}: {doc_info.get('status', 'unknown')}")
        else:
            print("✅ KYC status shows no documents (empty dict)")


class TestKYCStepUpdateEndpoint:
    """Test PATCH /api/employees/me/kyc-step endpoint"""
    
    @pytest.fixture
    def employee_token(self):
        """Login as demo employee"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "demo.employee@eaziwage.com",
                "password": "Employee@123"
            }
        )
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_kyc_step_update_endpoint(self, employee_token):
        """Test updating KYC step"""
        response = requests.patch(
            f"{BASE_URL}/api/employees/me/kyc-step",
            headers={"Authorization": f"Bearer {employee_token}"},
            params={"step": 3}
        )
        
        assert response.status_code == 200, f"KYC step update failed: {response.text}"
        result = response.json()
        assert "message" in result
        assert "step" in result
        assert result["step"] == 3
        
        print(f"✅ KYC step update works: step={result['step']}")


class TestEmployerPublicEndpoint:
    """Test public endpoint for listing approved employers"""
    
    def test_approved_employers_public_endpoint(self):
        """Test GET /api/employers/public/approved"""
        response = requests.get(f"{BASE_URL}/api/employers/public/approved")
        
        assert response.status_code == 200, f"Public employers endpoint failed: {response.text}"
        result = response.json()
        
        assert isinstance(result, list), "Response should be a list"
        print(f"✅ Public approved employers endpoint works: {len(result)} employers")
        
        if result:
            # Verify employer structure
            employer = result[0]
            assert "id" in employer
            assert "company_name" in employer
            print(f"   First employer: {employer.get('company_name', 'Unknown')}")


class TestEmployeeOnboardingFields:
    """Test new KYC fields in employee profile"""
    
    @pytest.fixture
    def new_employee_token(self):
        """Register and get token for a new employee"""
        unique_email = f"TEST_kyc_fields_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST KYC Fields User",
                "phone": "+254700555666",
                "phone_country_code": "KE",
                "role": "employee"
            }
        )
        
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not create test user")
    
    @pytest.fixture
    def employer_id(self):
        """Get an approved employer ID"""
        response = requests.get(f"{BASE_URL}/api/employers/public/approved")
        
        if response.status_code == 200:
            employers = response.json()
            if employers:
                return employers[0]["id"]
        
        pytest.skip("No approved employers available")
    
    def test_employee_profile_with_kyc_fields(self, new_employee_token, employer_id):
        """Test creating employee with all new KYC fields"""
        response = requests.post(
            f"{BASE_URL}/api/employees",
            headers={"Authorization": f"Bearer {new_employee_token}"},
            json={
                "employer_id": employer_id,
                "employee_code": f"EMP{uuid.uuid4().hex[:6]}",
                "national_id": "KYC12345678",
                "id_type": "national_id",
                "date_of_birth": "1992-03-15",
                "employment_type": "full-time",
                "job_title": "Software Engineer",
                "monthly_salary": 85000,
                "mobile_money_provider": "M-PESA",
                "mobile_money_number": "+254700555666",
                "country": "KE",
                # New KYC fields
                "tax_id": "TIN123456789",
                "address_line1": "123 Main Street",
                "address_line2": "Apt 4B",
                "city": "Nairobi",
                "postal_code": "00100",
                "department": "Engineering",
                "start_date": "2024-01-15"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            # Verify new KYC fields are stored
            assert data.get("tax_id") == "TIN123456789", "tax_id not stored"
            assert data.get("address_line1") == "123 Main Street", "address_line1 not stored"
            assert data.get("city") == "Nairobi", "city not stored"
            assert data.get("department") == "Engineering", "department not stored"
            assert data.get("start_date") == "2024-01-15", "start_date not stored"
            print(f"✅ Employee created with all KYC fields")
        elif response.status_code == 400 and "already exists" in response.text.lower():
            print("✅ Employee profile already exists (expected)")
        else:
            pytest.fail(f"Unexpected error: {response.status_code} - {response.text}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
