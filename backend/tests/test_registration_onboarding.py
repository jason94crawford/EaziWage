"""
Backend API tests for Registration and Onboarding features
Tests: Mobile number with dialing code, Employee onboarding fields
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://earn-wage-test.preview.emergentagent.com')

class TestRegistrationWithMobileNumber:
    """Test registration with mobile number and dialing code"""
    
    def test_register_employee_with_phone_country_code(self):
        """Test registration accepts phone and phone_country_code fields"""
        unique_email = f"TEST_mobile_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Mobile User",
                "phone": "+254700123456",
                "phone_country_code": "KE",
                "role": "employee"
            }
        )
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == unique_email
        assert data["user"]["phone"] == "+254700123456"
        assert data["user"]["role"] == "employee"
        print(f"✅ Employee registered with phone: {data['user']['phone']}")
    
    def test_register_employee_with_tanzania_code(self):
        """Test registration with Tanzania dialing code"""
        unique_email = f"TEST_tz_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Tanzania User",
                "phone": "+255700123456",
                "phone_country_code": "TZ",
                "role": "employee"
            }
        )
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert data["user"]["phone"] == "+255700123456"
        print(f"✅ Tanzania user registered: {data['user']['email']}")
    
    def test_register_employee_with_uganda_code(self):
        """Test registration with Uganda dialing code"""
        unique_email = f"TEST_ug_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Uganda User",
                "phone": "+256700123456",
                "phone_country_code": "UG",
                "role": "employee"
            }
        )
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert data["user"]["phone"] == "+256700123456"
        print(f"✅ Uganda user registered: {data['user']['email']}")
    
    def test_register_employee_with_rwanda_code(self):
        """Test registration with Rwanda dialing code"""
        unique_email = f"TEST_rw_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Rwanda User",
                "phone": "+250700123456",
                "phone_country_code": "RW",
                "role": "employee"
            }
        )
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert data["user"]["phone"] == "+250700123456"
        print(f"✅ Rwanda user registered: {data['user']['email']}")
    
    def test_register_employer_with_phone(self):
        """Test employer registration with phone field"""
        unique_email = f"TEST_employer_phone_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Employer",
                "phone": "+254700999999",
                "phone_country_code": "KE",
                "role": "employer"
            }
        )
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert data["user"]["role"] == "employer"
        print(f"✅ Employer registered with phone: {data['user']['phone']}")


class TestCountriesEndpoint:
    """Test countries endpoint for onboarding - Country of Work"""
    
    def test_get_countries_returns_4_countries(self):
        """Test countries endpoint returns Kenya, Uganda, Tanzania, Rwanda"""
        response = requests.get(f"{BASE_URL}/api/countries")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify 4 countries are returned
        assert len(data) == 4, f"Expected 4 countries, got {len(data)}"
        
        # Verify country codes
        country_codes = [c["code"] for c in data]
        expected_codes = ["KE", "UG", "TZ", "RW"]
        for code in expected_codes:
            assert code in country_codes, f"Missing country code: {code}"
        
        print(f"✅ Countries endpoint returns {len(data)} countries: {country_codes}")
    
    def test_countries_have_mobile_money_providers(self):
        """Test each country has mobile money providers"""
        response = requests.get(f"{BASE_URL}/api/countries")
        data = response.json()
        
        for country in data:
            assert "mobile_money" in country, f"Missing mobile_money for {country['name']}"
            assert len(country["mobile_money"]) > 0, f"No mobile money providers for {country['name']}"
        
        print("✅ All countries have mobile money providers")


class TestEmployeeCreationWithIdType:
    """Test employee creation with id_type and nationality fields"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for employee"""
        unique_email = f"TEST_employee_create_{uuid.uuid4().hex[:8]}@test.com"
        
        # Register new employee
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Employee Creator",
                "phone": "+254700111222",
                "phone_country_code": "KE",
                "role": "employee"
            }
        )
        
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not create test user")
    
    @pytest.fixture
    def employer_id(self, auth_token):
        """Get an approved employer ID for testing"""
        # First check public approved employers
        response = requests.get(f"{BASE_URL}/api/employers/public/approved")
        
        if response.status_code == 200:
            employers = response.json()
            if employers:
                return employers[0]["id"]
        
        # If no approved employers, skip the test
        pytest.skip("No approved employers available for testing")
    
    def test_employee_profile_with_national_id(self, auth_token, employer_id):
        """Test creating employee profile with national_id type"""
        response = requests.post(
            f"{BASE_URL}/api/employees",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "employer_id": employer_id,
                "employee_code": f"EMP{uuid.uuid4().hex[:6]}",
                "national_id": "12345678",
                "id_type": "national_id",
                "date_of_birth": "1990-01-15",
                "employment_type": "full-time",
                "job_title": "Software Developer",
                "monthly_salary": 80000,
                "mobile_money_provider": "M-PESA",
                "mobile_money_number": "+254700111222",
                "country": "KE"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            assert data["id_type"] == "national_id"
            print(f"✅ Employee created with national_id type")
        elif response.status_code == 400 and "already exists" in response.text.lower():
            print("✅ Employee profile already exists (expected for this test user)")
        else:
            pytest.fail(f"Unexpected error: {response.status_code} - {response.text}")
    
    def test_employee_profile_with_passport(self, auth_token, employer_id):
        """Test creating employee profile with passport type and nationality"""
        # Create new user for this test
        unique_email = f"TEST_passport_{uuid.uuid4().hex[:8]}@test.com"
        
        reg_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": unique_email,
                "password": "TestPass@123",
                "full_name": "TEST Passport User",
                "phone": "+254700333444",
                "phone_country_code": "KE",
                "role": "employee"
            }
        )
        
        if reg_response.status_code != 200:
            pytest.skip("Could not create test user for passport test")
        
        new_token = reg_response.json()["access_token"]
        
        response = requests.post(
            f"{BASE_URL}/api/employees",
            headers={"Authorization": f"Bearer {new_token}"},
            json={
                "employer_id": employer_id,
                "employee_code": f"EMP{uuid.uuid4().hex[:6]}",
                "national_id": "AB1234567",
                "id_type": "passport",
                "nationality": "US",  # Country of Nationality when passport is selected
                "date_of_birth": "1985-06-20",
                "employment_type": "full-time",
                "job_title": "Product Manager",
                "monthly_salary": 120000,
                "mobile_money_provider": "M-PESA",
                "mobile_money_number": "+254700333444",
                "country": "KE"  # Country of Work
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            assert data["id_type"] == "passport"
            assert data.get("nationality") == "US"
            print(f"✅ Employee created with passport type and nationality")
        elif response.status_code == 400 and "already exists" in response.text.lower():
            print("✅ Employee profile already exists (expected)")
        else:
            pytest.fail(f"Unexpected error: {response.status_code} - {response.text}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
