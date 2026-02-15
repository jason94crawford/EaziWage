"""
Test P0 UI fixes verification and P1 Change Password API
- P1: POST /api/users/me/change-password endpoint
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://earned-wage-preview.preview.emergentagent.com')

# Test credentials
DEMO_EMPLOYEE_EMAIL = "demo.employee@eaziwage.com"
DEMO_EMPLOYEE_PASSWORD = "Employee@123"


class TestChangePasswordAPI:
    """Tests for the P1 Change Password API endpoint"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for demo employee"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DEMO_EMPLOYEE_EMAIL,
            "password": DEMO_EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        return response.json()["access_token"]
    
    @pytest.fixture
    def auth_headers(self, auth_token):
        """Return headers with auth token"""
        return {"Authorization": f"Bearer {auth_token}"}
    
    def test_change_password_endpoint_exists(self, auth_headers):
        """Test that POST /api/users/me/change-password endpoint exists"""
        # First, test with empty payload to verify endpoint exists
        response = requests.post(
            f"{BASE_URL}/api/users/me/change-password",
            headers=auth_headers,
            json={}
        )
        # Should get 422 (validation error) or 400 (bad request), not 404
        assert response.status_code != 404, "Change password endpoint not found"
        print(f"Endpoint exists - Status: {response.status_code}")
    
    def test_change_password_wrong_current_password(self, auth_headers):
        """Test that wrong current password returns 400 error"""
        response = requests.post(
            f"{BASE_URL}/api/users/me/change-password",
            headers=auth_headers,
            json={
                "current_password": "wrong_password",
                "new_password": "NewPassword@123"
            }
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "incorrect" in data.get("detail", "").lower() or "current" in data.get("detail", "").lower()
        print(f"Wrong password test passed: {data}")
    
    def test_change_password_new_password_too_short(self, auth_headers):
        """Test that new password must be at least 8 characters"""
        response = requests.post(
            f"{BASE_URL}/api/users/me/change-password",
            headers=auth_headers,
            json={
                "current_password": DEMO_EMPLOYEE_PASSWORD,
                "new_password": "short"
            }
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "8 characters" in data.get("detail", "").lower()
        print(f"Short password test passed: {data}")
    
    def test_change_password_success_and_restore(self, auth_headers):
        """Test successful password change and restore original"""
        NEW_PASSWORD = "NewTestPassword@123"
        
        # Step 1: Change password to new password
        response = requests.post(
            f"{BASE_URL}/api/users/me/change-password",
            headers=auth_headers,
            json={
                "current_password": DEMO_EMPLOYEE_PASSWORD,
                "new_password": NEW_PASSWORD
            }
        )
        assert response.status_code == 200, f"Password change failed: {response.text}"
        data = response.json()
        assert "success" in data.get("message", "").lower()
        print(f"Password changed successfully: {data}")
        
        # Step 2: Verify can login with new password
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DEMO_EMPLOYEE_EMAIL,
            "password": NEW_PASSWORD
        })
        assert login_response.status_code == 200, f"Login with new password failed: {login_response.text}"
        new_token = login_response.json()["access_token"]
        print("Login with new password successful")
        
        # Step 3: Verify cannot login with old password
        old_login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DEMO_EMPLOYEE_EMAIL,
            "password": DEMO_EMPLOYEE_PASSWORD
        })
        assert old_login_response.status_code == 401, "Old password should not work anymore"
        print("Old password correctly rejected")
        
        # Step 4: RESTORE original password
        restore_response = requests.post(
            f"{BASE_URL}/api/users/me/change-password",
            headers={"Authorization": f"Bearer {new_token}"},
            json={
                "current_password": NEW_PASSWORD,
                "new_password": DEMO_EMPLOYEE_PASSWORD
            }
        )
        assert restore_response.status_code == 200, f"Password restore failed: {restore_response.text}"
        print("Original password restored successfully")
        
        # Step 5: Verify login with original password works again
        final_login = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DEMO_EMPLOYEE_EMAIL,
            "password": DEMO_EMPLOYEE_PASSWORD
        })
        assert final_login.status_code == 200, "Login with restored password failed"
        print("Login with restored password successful - test complete")
    
    def test_change_password_requires_authentication(self):
        """Test that change password requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/users/me/change-password",
            json={
                "current_password": "anypassword",
                "new_password": "newpassword123"
            }
        )
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
        print(f"Auth required test passed - Status: {response.status_code}")


class TestAuthAndBasicEndpoints:
    """Test basic auth and API endpoints are working"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "running"
        print(f"API root: {data}")
    
    def test_employee_login(self):
        """Test employee can login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DEMO_EMPLOYEE_EMAIL,
            "password": DEMO_EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == DEMO_EMPLOYEE_EMAIL
        print(f"Employee login successful: {data['user']['email']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
