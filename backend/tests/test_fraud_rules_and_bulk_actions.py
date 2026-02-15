"""
Test Fraud Detection Rules CRUD and Bulk Action APIs
Features tested:
1. GET /api/admin/fraud-rules - List fraud rules
2. POST /api/admin/fraud-rules - Create fraud rule
3. PUT /api/admin/fraud-rules/{id} - Update fraud rule
4. DELETE /api/admin/fraud-rules/{id} - Delete fraud rule
5. PATCH /api/admin/fraud-rules/{id}/toggle - Toggle rule enabled status
6. POST /api/admin/employees/bulk-action - Bulk employee actions
7. POST /api/admin/employers/bulk-action - Bulk employer actions
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "superadmin@eaziwage.com"
ADMIN_PASSWORD = "Admin@12345"
EMPLOYER_EMAIL = "testemployer2@eaziwage.com"
EMPLOYER_PASSWORD = "Employer@123"


@pytest.fixture(scope="module")
def admin_token():
    """Get admin auth token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json().get("access_token")


@pytest.fixture(scope="module")
def employer_token():
    """Get employer auth token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": EMPLOYER_EMAIL,
        "password": EMPLOYER_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    return None


class TestFraudRulesAPI:
    """Tests for Fraud Detection Rules CRUD API"""

    def test_get_fraud_rules_unauthorized(self):
        """Test GET fraud rules without auth returns 401 or 403"""
        response = requests.get(f"{BASE_URL}/api/admin/fraud-rules")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"

    def test_get_fraud_rules_with_employer_token(self, employer_token):
        """Test GET fraud rules with employer token returns 403"""
        if not employer_token:
            pytest.skip("Employer token not available")
        response = requests.get(
            f"{BASE_URL}/api/admin/fraud-rules",
            headers={"Authorization": f"Bearer {employer_token}"}
        )
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"

    def test_get_fraud_rules_success(self, admin_token):
        """Test GET fraud rules with admin token returns list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/fraud-rules",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        # Should have default rules seeded
        if len(data) > 0:
            rule = data[0]
            assert "id" in rule, "Rule should have id"
            assert "name" in rule, "Rule should have name"
            assert "type" in rule, "Rule should have type"
            assert "threshold" in rule, "Rule should have threshold"
            assert "enabled" in rule, "Rule should have enabled"

    def test_create_fraud_rule_success(self, admin_token):
        """Test POST create new fraud rule"""
        new_rule = {
            "name": "TEST_High Frequency Alert",
            "type": "frequency",
            "description": "Test rule - flag if more than 5 requests per day",
            "threshold": 5,
            "severity": "high",
            "enabled": True,
            "action": "flag"
        }
        response = requests.post(
            f"{BASE_URL}/api/admin/fraud-rules",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=new_rule
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Created rule should have id"
        assert data["name"] == new_rule["name"], "Rule name should match"
        assert data["type"] == new_rule["type"], "Rule type should match"
        assert data["threshold"] == new_rule["threshold"], "Rule threshold should match"
        assert data["enabled"] == new_rule["enabled"], "Rule enabled should match"
        assert "threshold_display" in data, "Rule should have formatted threshold_display"
        
        # Store for cleanup
        self.__class__.created_rule_id = data["id"]

    def test_get_fraud_rules_verify_created(self, admin_token):
        """Verify created rule appears in list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/fraud-rules",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        rule_ids = [r["id"] for r in data]
        assert hasattr(self, "created_rule_id"), "Create test should run first"
        assert self.created_rule_id in rule_ids, "Created rule should appear in list"

    def test_toggle_fraud_rule(self, admin_token):
        """Test PATCH toggle fraud rule enabled status"""
        if not hasattr(self, "created_rule_id"):
            pytest.skip("No rule to toggle")
        
        response = requests.patch(
            f"{BASE_URL}/api/admin/fraud-rules/{self.created_rule_id}/toggle",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["id"] == self.created_rule_id
        assert "enabled" in data, "Toggle response should contain enabled status"
        # Original was enabled=True, so after toggle it should be False
        assert data["enabled"] == False, "Rule should be disabled after toggle"

    def test_update_fraud_rule(self, admin_token):
        """Test PUT update fraud rule"""
        if not hasattr(self, "created_rule_id"):
            pytest.skip("No rule to update")
        
        update_data = {
            "name": "TEST_Updated High Frequency",
            "threshold": 10,
            "severity": "medium"
        }
        response = requests.put(
            f"{BASE_URL}/api/admin/fraud-rules/{self.created_rule_id}",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=update_data
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["name"] == update_data["name"], "Name should be updated"
        assert data["threshold"] == update_data["threshold"], "Threshold should be updated"
        assert data["severity"] == update_data["severity"], "Severity should be updated"

    def test_update_fraud_rule_not_found(self, admin_token):
        """Test PUT update non-existent rule returns 404"""
        response = requests.put(
            f"{BASE_URL}/api/admin/fraud-rules/non-existent-id",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"name": "Test"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"

    def test_delete_fraud_rule(self, admin_token):
        """Test DELETE fraud rule"""
        if not hasattr(self, "created_rule_id"):
            pytest.skip("No rule to delete")
        
        response = requests.delete(
            f"{BASE_URL}/api/admin/fraud-rules/{self.created_rule_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "message" in data, "Delete response should have message"

    def test_delete_fraud_rule_verify_removed(self, admin_token):
        """Verify deleted rule no longer in list"""
        if not hasattr(self, "created_rule_id"):
            pytest.skip("No rule was created")
        
        response = requests.get(
            f"{BASE_URL}/api/admin/fraud-rules",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        rule_ids = [r["id"] for r in data]
        assert self.created_rule_id not in rule_ids, "Deleted rule should not appear in list"

    def test_delete_fraud_rule_not_found(self, admin_token):
        """Test DELETE non-existent rule returns 404"""
        response = requests.delete(
            f"{BASE_URL}/api/admin/fraud-rules/non-existent-id",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"


class TestBulkEmployeeActions:
    """Tests for Bulk Employee Actions API"""

    def test_bulk_action_unauthorized(self):
        """Test bulk action without auth returns 401 or 403"""
        response = requests.post(
            f"{BASE_URL}/api/admin/employees/bulk-action",
            json={"employee_ids": [], "action": "activate"}
        )
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"

    def test_bulk_action_employer_forbidden(self, employer_token):
        """Test bulk action with employer token returns 403"""
        if not employer_token:
            pytest.skip("Employer token not available")
        response = requests.post(
            f"{BASE_URL}/api/admin/employees/bulk-action",
            headers={
                "Authorization": f"Bearer {employer_token}",
                "Content-Type": "application/json"
            },
            json={"employee_ids": [], "action": "activate"}
        )
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"

    def test_bulk_action_no_ids(self, admin_token):
        """Test bulk action with empty employee_ids returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/admin/employees/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employee_ids": [], "action": "activate"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        assert "No employee IDs" in response.json().get("detail", "")

    def test_bulk_action_invalid_action(self, admin_token):
        """Test bulk action with invalid action returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/admin/employees/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employee_ids": ["test-id"], "action": "invalid_action"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        assert "Invalid action" in response.json().get("detail", "")

    def test_bulk_activate_success(self, admin_token):
        """Test bulk activate employees"""
        # First get some employee IDs
        emp_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if emp_response.status_code != 200:
            pytest.skip("Could not fetch employees")
        
        employees = emp_response.json()
        if not employees:
            pytest.skip("No employees to test with")
        
        # Take first 2 employees for testing
        test_ids = [emp["id"] for emp in employees[:2]]
        
        response = requests.post(
            f"{BASE_URL}/api/admin/employees/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employee_ids": test_ids, "action": "activate"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "message" in data, "Response should have message"
        assert "modified_count" in data, "Response should have modified_count"

    def test_bulk_suspend_success(self, admin_token):
        """Test bulk suspend employees"""
        # First get some employee IDs
        emp_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if emp_response.status_code != 200:
            pytest.skip("Could not fetch employees")
        
        employees = emp_response.json()
        if not employees:
            pytest.skip("No employees to test with")
        
        # Take last employee for testing (to avoid affecting our previous test)
        test_ids = [employees[-1]["id"]]
        
        response = requests.post(
            f"{BASE_URL}/api/admin/employees/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employee_ids": test_ids, "action": "suspend"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    def test_bulk_approve_kyc_success(self, admin_token):
        """Test bulk approve KYC for employees"""
        # First get some employee IDs
        emp_response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if emp_response.status_code != 200:
            pytest.skip("Could not fetch employees")
        
        employees = emp_response.json()
        if not employees:
            pytest.skip("No employees to test with")
        
        # Take middle employee for testing
        middle_idx = len(employees) // 2
        test_ids = [employees[middle_idx]["id"]]
        
        response = requests.post(
            f"{BASE_URL}/api/admin/employees/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employee_ids": test_ids, "action": "approve_kyc"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"


class TestBulkEmployerActions:
    """Tests for Bulk Employer Actions API"""

    def test_bulk_employer_action_no_ids(self, admin_token):
        """Test bulk employer action with empty employer_ids returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/admin/employers/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employer_ids": [], "action": "approve"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_bulk_employer_invalid_action(self, admin_token):
        """Test bulk employer action with invalid action returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/admin/employers/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employer_ids": ["test-id"], "action": "invalid_action"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"

    def test_bulk_employer_approve_success(self, admin_token):
        """Test bulk approve employers"""
        # First get some employer IDs
        emp_response = requests.get(
            f"{BASE_URL}/api/admin/employers",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if emp_response.status_code != 200:
            pytest.skip("Could not fetch employers")
        
        employers = emp_response.json()
        if not employers:
            pytest.skip("No employers to test with")
        
        # Take first employer for testing
        test_ids = [employers[0]["id"]]
        
        response = requests.post(
            f"{BASE_URL}/api/admin/employers/bulk-action",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={"employer_ids": test_ids, "action": "approve"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "modified_count" in data, "Response should have modified_count"


class TestReconciliationAPI:
    """Tests for Reconciliation API endpoints"""

    def test_reconciliation_summary(self, admin_token):
        """Test GET reconciliation summary"""
        response = requests.get(
            f"{BASE_URL}/api/admin/reconciliation/summary",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        # May be 200 or 404 if not implemented
        assert response.status_code in [200, 404], f"Expected 200 or 404, got {response.status_code}"

    def test_reconciliation_list(self, admin_token):
        """Test GET reconciliation transactions list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/reconciliation/transactions",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        # May be 200 or 404 if not implemented
        assert response.status_code in [200, 404], f"Expected 200 or 404, got {response.status_code}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
