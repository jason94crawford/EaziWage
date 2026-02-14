"""
Backend API tests for Auth pages - Login, Register, Google OAuth callback
Tests: Authentication endpoints and Google OAuth flow
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://eazi-employer-hub.preview.emergentagent.com')

class TestAuthEndpoints:
    """Test authentication related endpoints"""
    
    def test_api_health(self):
        """Test API is running"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert "EaziWage" in data["message"]
        print("✅ API health check passed")
    
    def test_login_valid_credentials(self):
        """Test login with valid employee credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "demo.employee@eaziwage.com",
                "password": "Employee@123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data
        assert "user" in data
        assert data["token_type"] == "bearer"
        
        # Verify user data
        user = data["user"]
        assert user["email"] == "demo.employee@eaziwage.com"
        assert user["role"] == "employee"
        assert "id" in user
        print(f"✅ Login successful for: {user['full_name']}")
    
    def test_login_admin_credentials(self):
        """Test login with admin credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "superadmin@eaziwage.com",
                "password": "Admin@12345"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["user"]["role"] == "admin"
        print(f"✅ Admin login successful: {data['user']['email']}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "invalid@test.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print("✅ Invalid credentials correctly returns 401")
    
    def test_login_empty_credentials(self):
        """Test login with empty credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "",
                "password": ""
            }
        )
        # Should return 422 (validation error) or 401
        assert response.status_code in [401, 422]
        print("✅ Empty credentials handled correctly")
    
    def test_register_new_employee(self):
        """Test registration of new employee"""
        unique_email = f"TEST_employee_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Employee",
                "phone": "+254700000001",
                "role": "employee"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert data["user"]["email"] == unique_email
        assert data["user"]["role"] == "employee"
        print(f"✅ New employee registered: {unique_email}")
    
    def test_register_new_employer(self):
        """Test registration of new employer"""
        unique_email = f"TEST_employer_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Employer",
                "phone": "+254700000002",
                "role": "employer"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["user"]["role"] == "employer"
        print(f"✅ New employer registered: {unique_email}")
    
    def test_register_duplicate_email(self):
        """Test registration with existing email returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": "demo.employee@eaziwage.com",  # Existing email
                "password": "TestPass@123",
                "full_name": "Duplicate User",
                "phone": "+254700000003",
                "role": "employee"
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert "already registered" in data["detail"].lower()
        print("✅ Duplicate email correctly rejected")
    
    def test_get_me_authenticated(self):
        """Test /auth/me endpoint with valid token"""
        # First login to get token
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "demo.employee@eaziwage.com",
                "password": "Employee@123"
            }
        )
        token = login_response.json()["access_token"]
        
        # Now test /auth/me
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "demo.employee@eaziwage.com"
        print(f"✅ /auth/me returned: {data['full_name']}")
    
    def test_get_me_without_token(self):
        """Test /auth/me without token returns 403"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 403
        print("✅ /auth/me without token correctly returns 403")


class TestGoogleOAuthEndpoint:
    """Test Google OAuth callback endpoint"""
    
    def test_google_callback_invalid_session(self):
        """Test Google callback with invalid session_id returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google/callback",
            json={
                "session_id": "invalid-session-id",
                "role": "employee"
            }
        )
        # Should return 401 for invalid session
        assert response.status_code == 401
        print("✅ Invalid Google session correctly returns 401")
    
    def test_google_callback_endpoint_exists(self):
        """Test that Google callback endpoint exists"""
        # Test with empty/minimal payload to verify endpoint exists
        response = requests.post(
            f"{BASE_URL}/api/auth/google/callback",
            json={"session_id": "test"}
        )
        # Should not return 404 (endpoint not found)
        assert response.status_code != 404
        print("✅ Google OAuth callback endpoint exists")


class TestUtilityEndpoints:
    """Test utility endpoints used in registration flow"""
    
    def test_get_countries(self):
        """Test countries endpoint returns valid data"""
        response = requests.get(f"{BASE_URL}/api/countries")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify country structure
        country = data[0]
        assert "code" in country
        assert "name" in country
        assert "currency" in country
        assert "mobile_money" in country
        print(f"✅ Countries endpoint returned {len(data)} countries")
    
    def test_get_industries(self):
        """Test industries endpoint returns valid data"""
        response = requests.get(f"{BASE_URL}/api/industries")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify industry structure
        industry = data[0]
        assert "code" in industry
        assert "name" in industry
        assert "risk" in industry
        print(f"✅ Industries endpoint returned {len(data)} industries")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
