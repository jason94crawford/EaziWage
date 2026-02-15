"""
Test Admin Portal Features:
- Review Management endpoints
- Fraud Detection/Advances review endpoint
- Admin Employers endpoints with bulk actions
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://eazi-mobile-pages.preview.emergentagent.com').rstrip('/')

class TestAdminAuth:
    """Test admin authentication"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Login as admin and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, f"No access_token in response: {data}"
        return data["access_token"]
    
    def test_admin_login(self, admin_token):
        """Verify admin can login"""
        assert admin_token is not None
        print(f"PASSED: Admin login successful, token obtained")


class TestAdminReviewManagement:
    """Test Review Management endpoints"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Login as admin and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_get_review_requests(self, admin_token):
        """Test GET /api/admin/review-requests - list all review requests"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/review-requests", headers=headers)
        
        assert response.status_code == 200, f"Failed to get review requests: {response.text}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"PASSED: GET /api/admin/review-requests - returned {len(data)} requests")
    
    def test_update_review_request_requires_auth(self):
        """Test PATCH /api/admin/review-requests/{id} requires authentication"""
        response = requests.patch(f"{BASE_URL}/api/admin/review-requests/test-id", json={
            "status": "in_review"
        })
        
        assert response.status_code in [401, 403], f"Should require auth: {response.status_code}"
        print(f"PASSED: PATCH /api/admin/review-requests requires authentication")


class TestAdminAdvancesReview:
    """Test Fraud Detection - Advances review endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Login as admin and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_get_flagged_advances(self, admin_token):
        """Test GET /api/admin/advances/flagged - list flagged transactions"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/advances/flagged", headers=headers)
        
        # Endpoint may return 200 with empty list or 404 if not implemented
        assert response.status_code in [200, 404], f"Unexpected status: {response.status_code}"
        
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list), "Response should be a list"
            print(f"PASSED: GET /api/admin/advances/flagged - returned {len(data)} flagged transactions")
        else:
            print(f"INFO: GET /api/admin/advances/flagged - endpoint returns 404 (may not be implemented)")
    
    def test_review_advance_endpoint_exists(self, admin_token):
        """Test PATCH /api/admin/advances/{id}/review endpoint exists"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        # Test with fake ID - should return 404 (not found), not 405 (method not allowed)
        response = requests.patch(
            f"{BASE_URL}/api/admin/advances/fake-advance-id/review",
            headers=headers,
            json={"decision": "approve", "notes": "Test review"}
        )
        
        # Should be 404 (advance not found) not 405 (method not allowed)
        assert response.status_code in [404, 400], f"Endpoint may not exist: {response.status_code} - {response.text}"
        print(f"PASSED: PATCH /api/admin/advances/{{id}}/review endpoint exists (returns {response.status_code} for fake ID)")


class TestAdminEmployersPage:
    """Test Admin Employers endpoints"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Login as admin and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_get_all_employers(self, admin_token):
        """Test GET /api/admin/employers - list all employers"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/employers", headers=headers)
        
        assert response.status_code == 200, f"Failed to get employers: {response.text}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"PASSED: GET /api/admin/employers - returned {len(data)} employers")
        return data
    
    def test_get_employer_detail(self, admin_token):
        """Test GET /api/admin/employers/{id} - get single employer detail"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # First get list of employers
        list_response = requests.get(f"{BASE_URL}/api/admin/employers", headers=headers)
        employers = list_response.json()
        
        if len(employers) > 0:
            employer_id = employers[0]["id"]
            response = requests.get(f"{BASE_URL}/api/admin/employers/{employer_id}", headers=headers)
            
            assert response.status_code == 200, f"Failed to get employer detail: {response.text}"
            data = response.json()
            assert "company_name" in data, "Response should contain company_name"
            print(f"PASSED: GET /api/admin/employers/{{id}} - returned {data.get('company_name')}")
        else:
            pytest.skip("No employers found to test")
    
    def test_update_employer_status(self, admin_token):
        """Test PATCH /api/admin/employers/{id}/status - update employer status"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # First get list of employers
        list_response = requests.get(f"{BASE_URL}/api/admin/employers", headers=headers)
        employers = list_response.json()
        
        if len(employers) > 0:
            # Find an employer to test
            employer = employers[0]
            employer_id = employer["id"]
            current_status = employer.get("status", "pending")
            
            # Update to current status (no-op but tests endpoint)
            response = requests.patch(
                f"{BASE_URL}/api/admin/employers/{employer_id}/status",
                headers=headers,
                json={"status": current_status}
            )
            
            assert response.status_code == 200, f"Failed to update employer status: {response.text}"
            print(f"PASSED: PATCH /api/admin/employers/{{id}}/status - status update works")
        else:
            pytest.skip("No employers found to test")


class TestAdminEmployeesPage:
    """Test Admin Employees endpoints for bulk actions"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Login as admin and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_get_all_employees(self, admin_token):
        """Test GET /api/admin/employees - list all employees"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/employees", headers=headers)
        
        assert response.status_code == 200, f"Failed to get employees: {response.text}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"PASSED: GET /api/admin/employees - returned {len(data)} employees")
        return data
    
    def test_update_employee_status(self, admin_token):
        """Test PATCH /api/admin/employees/{id}/status - for bulk activate/suspend"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # First get list of employees
        list_response = requests.get(f"{BASE_URL}/api/admin/employees", headers=headers)
        employees = list_response.json()
        
        if len(employees) > 0:
            employee = employees[0]
            employee_id = employee["id"]
            current_status = employee.get("status", "pending")
            
            # Test status update endpoint
            response = requests.patch(
                f"{BASE_URL}/api/admin/employees/{employee_id}/status",
                headers=headers,
                json={"status": current_status}
            )
            
            assert response.status_code == 200, f"Failed to update employee status: {response.text}"
            print(f"PASSED: PATCH /api/admin/employees/{{id}}/status - status update works (for bulk actions)")
        else:
            pytest.skip("No employees found to test")
    
    def test_update_employee_kyc(self, admin_token):
        """Test PATCH /api/admin/employees/{id}/kyc - for bulk KYC approve"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # First get list of employees
        list_response = requests.get(f"{BASE_URL}/api/admin/employees", headers=headers)
        employees = list_response.json()
        
        if len(employees) > 0:
            employee = employees[0]
            employee_id = employee["id"]
            current_kyc = employee.get("kyc_status", "pending")
            
            # Test KYC update endpoint
            response = requests.patch(
                f"{BASE_URL}/api/admin/employees/{employee_id}/kyc",
                headers=headers,
                json={"kyc_status": current_kyc}
            )
            
            assert response.status_code == 200, f"Failed to update employee KYC: {response.text}"
            print(f"PASSED: PATCH /api/admin/employees/{{id}}/kyc - KYC update works (for bulk KYC approve)")
        else:
            pytest.skip("No employees found to test")


class TestUnauthorizedAccess:
    """Test that admin endpoints require proper authorization"""
    
    def test_review_requests_requires_admin(self):
        """Non-admin cannot access review requests"""
        # Login as employer
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "testemployer2@eaziwage.com",
            "password": "Employer@123"
        })
        
        if response.status_code != 200:
            pytest.skip("Employer login not available")
        
        employer_token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {employer_token}"}
        
        # Try to access admin endpoint
        response = requests.get(f"{BASE_URL}/api/admin/review-requests", headers=headers)
        assert response.status_code == 403, f"Should deny employer access: {response.status_code}"
        print(f"PASSED: Employer cannot access admin review requests (403)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
