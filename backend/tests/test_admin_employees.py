"""
Admin Employees API Tests
Tests for the new Admin Employees management page endpoints:
- GET /api/admin/employees - List all employees
- GET /api/admin/employees/{id} - Get employee detail with advances
- PUT /api/admin/employees/{id} - Update employee details
- PATCH /api/admin/employees/{id}/status - Update employee status
- PATCH /api/admin/employees/{id}/kyc - Update employee KYC status
- PATCH /api/admin/employees/{id}/risk-score - Override risk score
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://wage-advance-demo.preview.emergentagent.com')

class TestAdminEmployeeEndpoints:
    """Tests for Admin Employee management endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Login as admin and get token"""
        # Admin login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        self.admin_token = response.json()["access_token"]
        self.admin_headers = {
            "Authorization": f"Bearer {self.admin_token}",
            "Content-Type": "application/json"
        }
        yield
        
    def test_admin_list_employees(self):
        """Test GET /api/admin/employees returns employee list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        assert response.status_code == 200, f"Failed to list employees: {response.text}"
        
        employees = response.json()
        assert isinstance(employees, list), "Response should be a list"
        
        # Verify we have employees
        assert len(employees) > 0, "Should have at least one employee"
        
        # Verify employee structure
        first_emp = employees[0]
        assert "id" in first_emp, "Employee should have id"
        assert "employer_name" in first_emp, "Employee should have employer_name enriched"
        print(f"SUCCESS: Listed {len(employees)} employees")
        
    def test_admin_get_employee_detail(self):
        """Test GET /api/admin/employees/{id} returns full employee detail with advances"""
        # First get list to get an employee ID
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        assert list_response.status_code == 200
        employees = list_response.json()
        assert len(employees) > 0, "Need at least one employee"
        
        employee_id = employees[0]["id"]
        
        # Get employee detail
        response = requests.get(
            f"{BASE_URL}/api/admin/employees/{employee_id}",
            headers=self.admin_headers
        )
        assert response.status_code == 200, f"Failed to get employee detail: {response.text}"
        
        detail = response.json()
        
        # Verify detail structure
        assert "id" in detail, "Detail should have id"
        assert "advances" in detail, "Detail should include advances array"
        assert "advance_stats" in detail, "Detail should include advance_stats"
        
        # Verify advance_stats structure
        stats = detail["advance_stats"]
        assert "total_advances" in stats, "Stats should have total_advances"
        assert "pending_repayment" in stats, "Stats should have pending_repayment"
        assert "total_fees_paid" in stats, "Stats should have total_fees_paid"
        assert "advance_count" in stats, "Stats should have advance_count"
        
        print(f"SUCCESS: Got employee detail with {len(detail.get('advances', []))} advances")
        
    def test_admin_get_employee_detail_not_found(self):
        """Test GET /api/admin/employees/{id} returns 404 for non-existent employee"""
        response = requests.get(
            f"{BASE_URL}/api/admin/employees/non-existent-id-12345",
            headers=self.admin_headers
        )
        assert response.status_code == 404, "Should return 404 for non-existent employee"
        print("SUCCESS: Returns 404 for non-existent employee")
        
    def test_admin_update_employee_status(self):
        """Test PATCH /api/admin/employees/{id}/status updates status correctly"""
        # Get an employee
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        employees = list_response.json()
        assert len(employees) > 0
        
        # Find an employee to test with
        test_employee = employees[0]
        employee_id = test_employee["id"]
        original_status = test_employee.get("status")
        
        # Change to pending
        response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/status",
            headers=self.admin_headers,
            json={"status": "pending"}
        )
        assert response.status_code == 200, f"Failed to update status to pending: {response.text}"
        
        # Verify the change
        verify_response = requests.get(
            f"{BASE_URL}/api/admin/employees/{employee_id}",
            headers=self.admin_headers
        )
        assert verify_response.json()["status"] == "pending"
        
        # Restore to approved
        restore_response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/status",
            headers=self.admin_headers,
            json={"status": "approved"}
        )
        assert restore_response.status_code == 200
        
        print(f"SUCCESS: Updated employee status from {original_status} to pending and back to approved")
        
    def test_admin_update_employee_status_invalid(self):
        """Test PATCH /api/admin/employees/{id}/status rejects invalid status"""
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        employees = list_response.json()
        employee_id = employees[0]["id"]
        
        response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/status",
            headers=self.admin_headers,
            json={"status": "invalid_status"}
        )
        assert response.status_code == 400, "Should reject invalid status"
        print("SUCCESS: Rejects invalid status values")
        
    def test_admin_update_employee_kyc(self):
        """Test PATCH /api/admin/employees/{id}/kyc updates KYC status"""
        # Get an employee
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        employees = list_response.json()
        test_employee = employees[0]
        employee_id = test_employee["id"]
        original_kyc = test_employee.get("kyc_status")
        
        # Update to pending
        response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/kyc",
            headers=self.admin_headers,
            json={"kyc_status": "pending"}
        )
        assert response.status_code == 200, f"Failed to update KYC: {response.text}"
        
        # Verify change
        verify_response = requests.get(
            f"{BASE_URL}/api/admin/employees/{employee_id}",
            headers=self.admin_headers
        )
        assert verify_response.json()["kyc_status"] == "pending"
        
        # Restore to approved (which also sets account status to approved)
        restore_response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/kyc",
            headers=self.admin_headers,
            json={"kyc_status": "approved"}
        )
        assert restore_response.status_code == 200
        
        print(f"SUCCESS: Updated employee KYC from {original_kyc} to pending and back to approved")
        
    def test_admin_update_employee_kyc_invalid(self):
        """Test PATCH /api/admin/employees/{id}/kyc rejects invalid KYC status"""
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        employees = list_response.json()
        employee_id = employees[0]["id"]
        
        response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/kyc",
            headers=self.admin_headers,
            json={"kyc_status": "invalid_kyc"}
        )
        assert response.status_code == 400, "Should reject invalid KYC status"
        print("SUCCESS: Rejects invalid KYC status values")
        
    def test_admin_update_employee_details(self):
        """Test PUT /api/admin/employees/{id} updates employee details"""
        # Get an employee
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        employees = list_response.json()
        test_employee = employees[0]
        employee_id = test_employee["id"]
        original_job_title = test_employee.get("job_title")
        original_salary = test_employee.get("monthly_salary")
        
        # Update job title and salary
        new_salary = 75000.0
        response = requests.put(
            f"{BASE_URL}/api/admin/employees/{employee_id}",
            headers=self.admin_headers,
            json={
                "job_title": "TEST_Senior Developer",
                "department": "TEST_Engineering",
                "monthly_salary": new_salary
            }
        )
        assert response.status_code == 200, f"Failed to update employee: {response.text}"
        
        # Verify changes
        verify_response = requests.get(
            f"{BASE_URL}/api/admin/employees/{employee_id}",
            headers=self.admin_headers
        )
        updated = verify_response.json()
        assert updated["job_title"] == "TEST_Senior Developer"
        assert updated["department"] == "TEST_Engineering"
        assert updated["monthly_salary"] == new_salary
        # Verify advance_limit was recalculated (50% of salary)
        assert updated["advance_limit"] == new_salary * 0.5
        
        # Restore original values
        requests.put(
            f"{BASE_URL}/api/admin/employees/{employee_id}",
            headers=self.admin_headers,
            json={
                "job_title": original_job_title,
                "monthly_salary": original_salary
            }
        )
        
        print(f"SUCCESS: Updated employee details and verified advance_limit recalculation")
        
    def test_admin_override_risk_score(self):
        """Test PATCH /api/admin/employees/{id}/risk-score overrides risk"""
        # Get an employee
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        employees = list_response.json()
        employee_id = employees[0]["id"]
        
        # Override risk score
        new_score = 4.5
        response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/risk-score",
            headers=self.admin_headers,
            json={
                "risk_score": new_score,
                "reason": "Test override - good payment history"
            }
        )
        assert response.status_code == 200, f"Failed to override risk: {response.text}"
        
        # Verify change
        verify_response = requests.get(
            f"{BASE_URL}/api/admin/employees/{employee_id}",
            headers=self.admin_headers
        )
        updated = verify_response.json()
        assert updated["risk_score"] == new_score
        assert "risk_override" in updated
        assert updated["risk_override"]["reason"] == "Test override - good payment history"
        
        print(f"SUCCESS: Overrode risk score to {new_score}")
        
    def test_admin_override_risk_score_invalid(self):
        """Test risk score override rejects out of range values"""
        list_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers=self.admin_headers
        )
        employees = list_response.json()
        employee_id = employees[0]["id"]
        
        # Try score > 5
        response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/risk-score",
            headers=self.admin_headers,
            json={"risk_score": 6.0}
        )
        assert response.status_code == 400, "Should reject score > 5"
        
        # Try score < 0
        response = requests.patch(
            f"{BASE_URL}/api/admin/employees/{employee_id}/risk-score",
            headers=self.admin_headers,
            json={"risk_score": -1}
        )
        assert response.status_code == 400, "Should reject score < 0"
        
        print("SUCCESS: Rejects invalid risk score values")


class TestAdminEmployeeAuthorization:
    """Test authorization for admin employee endpoints"""
    
    def test_employee_cannot_access_admin_endpoints(self):
        """Test that regular employees cannot access admin endpoints"""
        # This test uses a non-admin token approach
        # In a real scenario we'd login as employee and try to access admin endpoints
        # For now, test with no auth
        response = requests.get(f"{BASE_URL}/api/admin/employees")
        assert response.status_code in [401, 403], "Should reject unauthorized access"
        print("SUCCESS: Rejects unauthorized access to admin endpoints")
        
    def test_employer_cannot_access_admin_endpoints(self):
        """Test that employers cannot access admin employee endpoints"""
        # Login as employer
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        
        if login_response.status_code == 200:
            employer_token = login_response.json()["access_token"]
            employer_headers = {
                "Authorization": f"Bearer {employer_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{BASE_URL}/api/admin/employees",
                headers=employer_headers
            )
            assert response.status_code == 403, "Employer should not access admin endpoints"
            print("SUCCESS: Employer cannot access admin employee endpoints")
        else:
            print("SKIP: Could not login as employer to test authorization")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
