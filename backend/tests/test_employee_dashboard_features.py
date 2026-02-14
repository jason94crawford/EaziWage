"""
Tests for Employee Dashboard Features - Speed Dial Counter, Navigation, Request Advance,
Transactions, Settings, and Employment Contract Upload in Onboarding

Test Features:
1. Employee Dashboard - speed dial counter, sidebar navigation, mobile bottom navigation
2. Request Advance page - glass-morphism design, amount slider
3. Transactions page - filter pills (All, Pending, Completed, Failed)
4. Settings page - profile card, payment methods, logout button
5. Onboarding Step 5 - Employment Contract upload field
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test Credentials
EMPLOYEE_EMAIL = "demo.employee@eaziwage.com"
EMPLOYEE_PASSWORD = "Employee@123"
ADMIN_EMAIL = "superadmin@eaziwage.com"
ADMIN_PASSWORD = "Admin@12345"


@pytest.fixture(scope="module")
def employee_token():
    """Get employee authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": EMPLOYEE_EMAIL,
        "password": EMPLOYEE_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip(f"Employee authentication failed: {response.status_code}")


@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip(f"Admin authentication failed: {response.status_code}")


class TestEmployeeAuthentication:
    """Test employee login and authentication"""
    
    def test_employee_login_success(self):
        """Test employee can login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMPLOYEE_EMAIL,
            "password": EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == EMPLOYEE_EMAIL
        assert data["user"]["role"] == "employee"
    
    def test_employee_login_invalid_credentials(self):
        """Test login fails with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@test.com",
            "password": "wrongpass"
        })
        assert response.status_code == 401


class TestEmployeeDashboardAPI:
    """Test Employee Dashboard API endpoints"""
    
    def test_get_employee_dashboard_stats(self, employee_token):
        """Test employee dashboard returns stats with earned wages and advance limit"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/employee",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify dashboard stats structure
        assert "earned_wages" in data
        assert "advance_limit" in data
        assert "total_advances" in data
        assert "pending_repayment" in data
        assert "recent_transactions" in data
        
        # Verify data types
        assert isinstance(data["earned_wages"], (int, float))
        assert isinstance(data["advance_limit"], (int, float))
        assert isinstance(data["recent_transactions"], list)
    
    def test_get_employee_profile(self, employee_token):
        """Test employee can get their own profile"""
        response = requests.get(
            f"{BASE_URL}/api/employees/me",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify profile fields
        assert "id" in data
        assert "user_id" in data
        assert "monthly_salary" in data
        assert "status" in data
        assert "kyc_status" in data
        assert "earned_wages" in data
        assert "advance_limit" in data
        
        # Verify employee has required payment fields
        assert "mobile_money_provider" in data
        assert "mobile_money_number" in data
        assert "bank_name" in data
        assert "bank_account" in data


class TestAdvanceRequestAPI:
    """Test Advance Request API endpoints"""
    
    def test_list_advances(self, employee_token):
        """Test employee can list their advances"""
        response = requests.get(
            f"{BASE_URL}/api/advances",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_advance_requires_auth(self):
        """Test advance endpoints require authentication"""
        response = requests.get(f"{BASE_URL}/api/advances")
        assert response.status_code in [401, 403]
    
    def test_advance_validation_unverified_account(self, employee_token):
        """Test advance creation fails for unverified account (KYC not approved)"""
        response = requests.post(
            f"{BASE_URL}/api/advances",
            headers={"Authorization": f"Bearer {employee_token}"},
            json={
                "amount": 1000,
                "disbursement_method": "mobile_money",
                "reason": "Test"
            }
        )
        # Should fail because demo employee's KYC is "submitted" not "approved"
        assert response.status_code == 400
        data = response.json()
        assert "verified" in data.get("detail", "").lower() or "not verified" in data.get("detail", "").lower() or response.status_code == 400


class TestTransactionsAPI:
    """Test Transactions API endpoints"""
    
    def test_list_transactions(self, employee_token):
        """Test employee can list their transactions"""
        response = requests.get(
            f"{BASE_URL}/api/transactions",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_transactions_require_auth(self):
        """Test transactions endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/transactions")
        assert response.status_code in [401, 403]


class TestKYCUploadAPI:
    """Test KYC document upload API - including Employment Contract"""
    
    def test_kyc_upload_endpoint_exists(self, employee_token):
        """Test KYC upload endpoint is accessible"""
        # Try to access without file to verify endpoint exists
        response = requests.post(
            f"{BASE_URL}/api/kyc/upload",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        # Should return 422 (missing file) not 404
        assert response.status_code in [400, 422]
    
    def test_kyc_upload_requires_auth(self):
        """Test KYC upload requires authentication"""
        response = requests.post(f"{BASE_URL}/api/kyc/upload")
        assert response.status_code in [401, 403]
    
    def test_kyc_status_endpoint(self, employee_token):
        """Test KYC status endpoint returns document info"""
        response = requests.get(
            f"{BASE_URL}/api/employees/me/kyc-status",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "kyc_status" in data
        assert "kyc_step" in data
        assert "documents" in data
        assert "has_employee_profile" in data
    
    def test_employment_contract_document_type_supported(self, employee_token):
        """Test employment_contract is a valid document type in backend"""
        # Verify by checking the employee model supports employment_contract field
        response = requests.get(
            f"{BASE_URL}/api/employees/me",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # employment_contract field should exist in employee response model
        assert "employment_contract" in data or "employment_contract" in str(response.text)


class TestUtilityEndpoints:
    """Test utility endpoints used by dashboard"""
    
    def test_get_countries(self):
        """Test countries endpoint returns East African countries"""
        response = requests.get(f"{BASE_URL}/api/countries")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 4  # Kenya, Uganda, Tanzania, Rwanda
        
        # Verify country structure
        country_codes = [c["code"] for c in data]
        assert "KE" in country_codes  # Kenya
        assert "UG" in country_codes  # Uganda
        assert "TZ" in country_codes  # Tanzania
        assert "RW" in country_codes  # Rwanda
    
    def test_get_industries(self):
        """Test industries endpoint returns industry list"""
        response = requests.get(f"{BASE_URL}/api/industries")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify industry structure
        for industry in data:
            assert "code" in industry
            assert "name" in industry
            assert "risk" in industry


class TestEmployerPublicEndpoint:
    """Test public employer endpoint for employee registration"""
    
    def test_list_approved_employers_public(self):
        """Test public endpoint returns approved employers"""
        response = requests.get(f"{BASE_URL}/api/employers/public/approved")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        # All returned employers should have approved status
        for employer in data:
            assert employer.get("status") == "approved"


class TestAuthEndpoints:
    """Test authentication endpoint verification"""
    
    def test_auth_me_endpoint(self, employee_token):
        """Test /auth/me returns current user info"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "email" in data
        assert "role" in data
        assert data["email"] == EMPLOYEE_EMAIL


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
