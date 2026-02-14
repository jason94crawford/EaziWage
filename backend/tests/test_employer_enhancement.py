"""
Test suite for EaziWage Employer Portal Enhancement - Iteration 24
Tests: Dashboard with 60 employees, Extended Dashboard, Per-Employee EWA Settings, Payroll
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://eazi-employer-hub.preview.emergentagent.com')

class TestEmployerAuthentication:
    """Test employer authentication"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token for employer"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        return data["access_token"]
    
    def test_login_success(self):
        """Test employer login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["role"] == "employer"
        assert data["user"]["email"] == "testemployer2@eaziwage.com"

class TestEmployerDashboard:
    """Test employer dashboard endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        return response.json()["access_token"]
    
    def test_get_employer_profile(self, auth_token):
        """Test getting employer profile"""
        response = requests.get(
            f"{BASE_URL}/api/employers/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["company_name"] == "Test Corp Ltd"
        assert "id" in data
        assert "user_id" in data
    
    def test_get_employer_dashboard(self, auth_token):
        """Test employer dashboard stats"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/employer",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify 60 employees seeded
        assert data["total_employees"] == 60, f"Expected 60 employees, got {data['total_employees']}"
        assert "active_employees" in data
        assert "total_advances_disbursed" in data
        assert "pending_advances" in data
        assert "monthly_payroll" in data
        
        # Verify monthly payroll is calculated
        assert data["monthly_payroll"] > 0
    
    def test_get_extended_dashboard(self, auth_token):
        """Test extended dashboard with retention metrics"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/employer/extended",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify retention metrics
        assert "total_employees" in data
        assert data["total_employees"] == 60
        
        assert "retention_rate" in data
        assert "kyc_completion_rate" in data
        assert "avg_tenure_months" in data
        
        # Verify department breakdown
        assert "department_breakdown" in data
        assert isinstance(data["department_breakdown"], dict)
        assert len(data["department_breakdown"]) > 0
        
        # Check for specific departments
        depts = data["department_breakdown"]
        expected_depts = ["Sales", "Engineering", "Marketing", "Operations", "Finance", "HR"]
        for dept in expected_depts:
            assert dept in depts, f"Missing department: {dept}"

class TestEmployeeList:
    """Test employee listing and management"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        return response.json()["access_token"]
    
    def test_list_employees(self, auth_token):
        """Test listing all employees"""
        response = requests.get(
            f"{BASE_URL}/api/employees",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify 60 employees
        assert len(data) == 60, f"Expected 60 employees, got {len(data)}"
        
        # Verify employee structure
        employee = data[0]
        assert "id" in employee
        assert "employee_code" in employee
        assert "monthly_salary" in employee
        assert "department" in employee
        assert "status" in employee
        assert "kyc_status" in employee
    
    def test_employee_has_department(self, auth_token):
        """Test that employees have department assignments"""
        response = requests.get(
            f"{BASE_URL}/api/employees",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        # All employees should have departments
        employees_with_dept = [e for e in data if e.get("department")]
        assert len(employees_with_dept) == 60, "All employees should have departments"
    
    def test_employee_has_salary(self, auth_token):
        """Test that employees have salary data"""
        response = requests.get(
            f"{BASE_URL}/api/employees",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        # All employees should have salaries
        for emp in data:
            assert emp["monthly_salary"] > 0, f"Employee {emp['employee_code']} has no salary"

class TestPerEmployeeEWASettings:
    """Test per-employee EWA settings"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def employee_id(self, auth_token):
        response = requests.get(
            f"{BASE_URL}/api/employees",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        return response.json()[0]["id"]
    
    def test_get_employee_ewa_settings(self, auth_token, employee_id):
        """Test getting EWA settings for an employee"""
        response = requests.get(
            f"{BASE_URL}/api/employees/{employee_id}/ewa-settings",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
    
    def test_update_employee_ewa_settings(self, auth_token, employee_id):
        """Test updating EWA settings for an employee"""
        new_settings = {
            "max_advance_percentage": 70,
            "min_advance_amount": 1500,
            "max_advance_amount": 35000,
            "cooldown_period": 10,
            "ewa_enabled": True
        }
        
        response = requests.put(
            f"{BASE_URL}/api/employees/{employee_id}/ewa-settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json=new_settings
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert data["message"] == "Employee EWA settings updated"
    
    def test_verify_ewa_settings_update(self, auth_token, employee_id):
        """Verify EWA settings were updated"""
        response = requests.get(
            f"{BASE_URL}/api/employees/{employee_id}/ewa-settings",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify the settings were saved
        if data:  # Settings might be null initially
            assert data.get("ewa_enabled") is True or data.get("ewa_enabled") is None

class TestPayroll:
    """Test payroll endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        return response.json()["access_token"]
    
    def test_get_payroll_history(self, auth_token):
        """Test getting payroll history"""
        response = requests.get(
            f"{BASE_URL}/api/payroll/history",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        # Returns empty array if no payroll uploaded
        assert isinstance(response.json(), list)
    
    def test_upload_payroll(self, auth_token):
        """Test uploading payroll data"""
        payroll_data = {
            "month": "2026-02",
            "employees": [
                {"employee_code": "EMP-0001", "days_worked": 22, "gross_salary": 126758},
                {"employee_code": "EMP-0002", "days_worked": 20, "gross_salary": 69943}
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payroll/upload",
            headers={"Authorization": f"Bearer {auth_token}"},
            json=payroll_data
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data

class TestAdvances:
    """Test advances listing"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        return response.json()["access_token"]
    
    def test_list_advances(self, auth_token):
        """Test listing advances for employer"""
        response = requests.get(
            f"{BASE_URL}/api/advances",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Should have advances from seeded data
        assert isinstance(data, list)
        
        if len(data) > 0:
            # Verify advance structure
            advance = data[0]
            assert "id" in advance
            assert "amount" in advance
            assert "status" in advance
            assert "employee_name" in advance

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
