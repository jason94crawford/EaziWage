"""
Test Employee Dashboard Redesign Features
- Dashboard, RequestAdvance, Transactions, Settings pages
- Green gradient theme
- Profile picture upload
- Editable settings
- KYC Documents summary
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEmployeeDashboardRedesign:
    """Test Employee Dashboard redesign features"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures - login as demo employee"""
        self.base_url = BASE_URL
        # Login as demo employee
        login_response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={"email": "demo.employee@eaziwage.com", "password": "Employee@123"}
        )
        if login_response.status_code == 200:
            self.token = login_response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
            self.user = login_response.json()["user"]
        else:
            pytest.skip("Failed to login as demo employee")
    
    # === GET /api/users/me/full-profile tests ===
    
    def test_get_full_profile_returns_user_data(self):
        """Test GET /api/users/me/full-profile returns complete user data"""
        response = requests.get(
            f"{self.base_url}/api/users/me/full-profile",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify user fields
        assert "id" in data
        assert "email" in data
        assert "full_name" in data
        assert "role" in data
        assert data["email"] == "demo.employee@eaziwage.com"
        assert data["role"] == "employee"
    
    def test_get_full_profile_includes_employee_data(self):
        """Test full profile includes employee profile data"""
        response = requests.get(
            f"{self.base_url}/api/users/me/full-profile",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Employee data should be present
        assert "employee" in data
        employee = data["employee"]
        
        # Verify employee fields
        assert "employer_name" in employee
        assert "monthly_salary" in employee
        assert "earned_wages" in employee
        assert "advance_limit" in employee
        assert "status" in employee
        assert "kyc_status" in employee
        assert "mobile_money_provider" in employee
        assert "bank_name" in employee
    
    def test_get_full_profile_includes_kyc_documents(self):
        """Test full profile includes KYC documents list"""
        response = requests.get(
            f"{self.base_url}/api/users/me/full-profile",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # KYC documents should be present
        assert "kyc_documents" in data
        assert isinstance(data["kyc_documents"], list)
    
    # === PUT /api/users/me/settings tests ===
    
    def test_update_user_settings_phone(self):
        """Test updating user phone number"""
        response = requests.put(
            f"{self.base_url}/api/users/me/settings",
            headers=self.headers,
            json={"phone": "+254799888777"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Settings updated successfully"
        
        # Verify the change was saved
        profile = requests.get(
            f"{self.base_url}/api/users/me/full-profile",
            headers=self.headers
        ).json()
        assert profile["phone"] == "+254799888777"
    
    def test_update_user_settings_full_name(self):
        """Test updating user full name"""
        response = requests.put(
            f"{self.base_url}/api/users/me/settings",
            headers=self.headers,
            json={"full_name": "Updated Demo Employee"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Settings updated successfully"
        
        # Verify the change was saved
        profile = requests.get(
            f"{self.base_url}/api/users/me/full-profile",
            headers=self.headers
        ).json()
        assert profile["full_name"] == "Updated Demo Employee"
        
        # Reset to original
        requests.put(
            f"{self.base_url}/api/users/me/settings",
            headers=self.headers,
            json={"full_name": "Demo Employee"}
        )
    
    # === PUT /api/employees/me/settings tests ===
    
    def test_update_employee_settings_city(self):
        """Test updating employee city"""
        response = requests.put(
            f"{self.base_url}/api/employees/me/settings",
            headers=self.headers,
            json={"city": "Mombasa"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Employee settings updated successfully"
        
        # Verify the change was saved
        profile = requests.get(
            f"{self.base_url}/api/users/me/full-profile",
            headers=self.headers
        ).json()
        assert profile["employee"]["city"] == "Mombasa"
        
        # Reset to original
        requests.put(
            f"{self.base_url}/api/employees/me/settings",
            headers=self.headers,
            json={"city": "Nairobi"}
        )
    
    def test_update_employee_settings_address(self):
        """Test updating employee address fields"""
        response = requests.put(
            f"{self.base_url}/api/employees/me/settings",
            headers=self.headers,
            json={
                "address_line1": "123 Test Street",
                "postal_code": "00100"
            }
        )
        assert response.status_code == 200
        
        # Verify the change
        profile = requests.get(
            f"{self.base_url}/api/users/me/full-profile",
            headers=self.headers
        ).json()
        assert profile["employee"]["address_line1"] == "123 Test Street"
        assert profile["employee"]["postal_code"] == "00100"
    
    # === Dashboard API tests ===
    
    def test_employee_dashboard_returns_stats(self):
        """Test GET /api/dashboard/employee returns dashboard stats"""
        response = requests.get(
            f"{self.base_url}/api/dashboard/employee",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify stats fields
        assert "earned_wages" in data
        assert "advance_limit" in data
        assert "total_advances" in data
        assert "pending_repayment" in data
        assert "recent_transactions" in data
    
    def test_employee_me_returns_profile(self):
        """Test GET /api/employees/me returns employee profile"""
        response = requests.get(
            f"{self.base_url}/api/employees/me",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify profile fields for dashboard display
        assert "status" in data
        assert "kyc_status" in data
        assert "earned_wages" in data
        assert "advance_limit" in data
        assert "employer_name" in data
        assert "job_title" in data
    
    # === Advances API tests ===
    
    def test_list_advances_empty_or_has_items(self):
        """Test GET /api/advances returns list"""
        response = requests.get(
            f"{self.base_url}/api/advances",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    # === Transactions API tests ===
    
    def test_list_transactions(self):
        """Test GET /api/transactions returns list"""
        response = requests.get(
            f"{self.base_url}/api/transactions",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    # === API status checks ===
    
    def test_api_health(self):
        """Test API is running"""
        response = requests.get(f"{self.base_url}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
    
    def test_countries_endpoint(self):
        """Test countries utility endpoint"""
        response = requests.get(f"{self.base_url}/api/countries")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should have East African countries
        country_codes = [c["code"] for c in data]
        assert "KE" in country_codes  # Kenya
        assert "UG" in country_codes  # Uganda
        assert "TZ" in country_codes  # Tanzania
    
    def test_industries_endpoint(self):
        """Test industries utility endpoint"""
        response = requests.get(f"{self.base_url}/api/industries")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0


class TestProfilePictureUpload:
    """Test profile picture upload feature"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures - login as demo employee"""
        self.base_url = BASE_URL
        # Login as demo employee
        login_response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={"email": "demo.employee@eaziwage.com", "password": "Employee@123"}
        )
        if login_response.status_code == 200:
            self.token = login_response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            pytest.skip("Failed to login as demo employee")
    
    def test_profile_picture_endpoint_exists(self):
        """Test profile picture upload endpoint exists"""
        # Create a test image (1x1 transparent PNG)
        import base64
        png_1x1 = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        )
        
        files = {"file": ("test_profile.png", png_1x1, "image/png")}
        response = requests.post(
            f"{self.base_url}/api/users/me/profile-picture",
            headers={"Authorization": f"Bearer {self.token}"},
            files=files
        )
        
        # Should return 200 with profile_picture_url
        assert response.status_code == 200
        data = response.json()
        assert "profile_picture_url" in data
    
    def test_profile_picture_invalid_file_type(self):
        """Test profile picture rejects invalid file types"""
        # Try to upload a text file
        files = {"file": ("test.txt", b"invalid file content", "text/plain")}
        response = requests.post(
            f"{self.base_url}/api/users/me/profile-picture",
            headers={"Authorization": f"Bearer {self.token}"},
            files=files
        )
        
        # Should return 400 for invalid file type
        assert response.status_code == 400


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
