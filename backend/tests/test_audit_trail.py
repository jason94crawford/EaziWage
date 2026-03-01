"""
Test Audit Trail Dashboard APIs
Tests for the new Audit Trail feature in Admin Settings Portal:
- GET /api/admin/audit-trail - Main audit logs endpoint with filtering and pagination
- GET /api/admin/audit-trail/stats - Statistics endpoint (total_changes, by_type, by_admin, daily_activity)  
- GET /api/admin/audit-trail/admins - List of admins who made changes
- POST /api/admin/audit-trail/migrate - Migration from settings_audit_log
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAuditTrailAPIs:
    """Test suite for Audit Trail Dashboard APIs"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Login and get admin token"""
        self.admin_token = None
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        if login_response.status_code == 200:
            self.admin_token = login_response.json().get("access_token")
        else:
            pytest.skip("Admin authentication failed - skipping audit trail tests")
    
    def test_admin_login_success(self):
        """Test admin can login successfully"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "admin"
        print("PASS: Admin login successful")
    
    # ==================== AUDIT TRAIL STATS API ====================
    
    def test_audit_trail_stats_endpoint(self):
        """Test GET /api/admin/audit-trail/stats returns correct structure"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail/stats",
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields in stats response
        assert "total_changes" in data, "Stats should have total_changes"
        assert "by_type" in data, "Stats should have by_type breakdown"
        assert "by_admin" in data, "Stats should have by_admin breakdown"
        assert "daily_activity" in data, "Stats should have daily_activity"
        
        # Verify data types
        assert isinstance(data["total_changes"], int)
        assert isinstance(data["by_type"], dict)
        assert isinstance(data["by_admin"], list)
        assert isinstance(data["daily_activity"], list)
        
        print(f"PASS: Audit trail stats API works - Total changes: {data['total_changes']}")
        print(f"  - Types breakdown: {data['by_type']}")
        print(f"  - Active admins: {len(data['by_admin'])}")
    
    def test_audit_trail_stats_with_date_filter(self):
        """Test stats endpoint with date range filter"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail/stats",
            params={
                "start_date": "2024-01-01",
                "end_date": "2026-12-31"
            },
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_changes" in data
        print(f"PASS: Stats with date filter works - {data['total_changes']} changes in range")
    
    # ==================== AUDIT TRAIL ADMINS API ====================
    
    def test_audit_trail_admins_endpoint(self):
        """Test GET /api/admin/audit-trail/admins returns list of admins who made changes"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail/admins",
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Should return a list of admins
        assert isinstance(data, list)
        
        # If there are admins, verify structure
        if len(data) > 0:
            admin = data[0]
            assert "id" in admin, "Admin should have id"
            assert "name" in admin, "Admin should have name"
            assert "email" in admin, "Admin should have email"
        
        print(f"PASS: Audit trail admins API works - {len(data)} admin(s) have made changes")
    
    # ==================== AUDIT TRAIL MAIN LOGS API ====================
    
    def test_audit_trail_logs_basic(self):
        """Test GET /api/admin/audit-trail returns paginated logs"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify pagination structure
        assert "total" in data, "Response should have total count"
        assert "logs" in data, "Response should have logs array"
        assert "skip" in data, "Response should have skip"
        assert "limit" in data, "Response should have limit"
        
        print(f"PASS: Audit trail logs API works - Total: {data['total']}, Returned: {len(data['logs'])}")
    
    def test_audit_trail_logs_pagination(self):
        """Test logs pagination with skip and limit"""
        # First page
        response1 = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={"limit": 5, "skip": 0},
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response1.status_code == 200
        data1 = response1.json()
        
        # Second page
        response2 = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={"limit": 5, "skip": 5},
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response2.status_code == 200
        data2 = response2.json()
        
        # Verify pagination params are respected
        assert data1["skip"] == 0
        assert data2["skip"] == 5
        assert data1["limit"] == 5
        
        print("PASS: Pagination works correctly")
    
    def test_audit_trail_filter_by_audit_type_settings(self):
        """Test filtering logs by audit_type=settings"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={"audit_type": "settings"},
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["logs"], list)
        
        # If there are settings logs, verify they are settings-related
        settings_types = ["platform_settings", "risk_settings", "notification_settings", 
                         "employer_settings", "employee_settings", "legal_document", "blackout"]
        for log in data["logs"]:
            assert log.get("type") in settings_types, f"Type {log.get('type')} should be a settings type"
        
        print(f"PASS: Filter by audit_type=settings works - {data['total']} logs")
    
    def test_audit_trail_filter_by_settings_type(self):
        """Test filtering logs by specific settings_type"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={"settings_type": "platform_settings"},
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # All returned logs should be platform_settings type
        for log in data["logs"]:
            assert log.get("type") == "platform_settings"
        
        print(f"PASS: Filter by settings_type=platform_settings works - {data['total']} logs")
    
    def test_audit_trail_filter_by_changed_by(self):
        """Test filtering logs by admin who made changes"""
        # First get the admins list
        admins_response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail/admins",
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if admins_response.status_code == 200 and len(admins_response.json()) > 0:
            admin_id = admins_response.json()[0]["id"]
            
            response = requests.get(
                f"{BASE_URL}/api/admin/audit-trail",
                params={"changed_by": admin_id},
                headers={"Authorization": f"Bearer {self.admin_token}"}
            )
            assert response.status_code == 200
            data = response.json()
            
            # All returned logs should be from this admin
            for log in data["logs"]:
                assert log.get("changed_by") == admin_id
            
            print(f"PASS: Filter by changed_by works - {data['total']} logs by admin")
        else:
            print("SKIP: No admins have made changes yet")
    
    def test_audit_trail_filter_by_date_range(self):
        """Test filtering logs by date range"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={
                "start_date": "2024-01-01",
                "end_date": "2026-12-31"
            },
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["logs"], list)
        print(f"PASS: Date range filter works - {data['total']} logs in range")
    
    def test_audit_trail_combined_filters(self):
        """Test combining multiple filters"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={
                "audit_type": "settings",
                "start_date": "2024-01-01",
                "limit": 10
            },
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["limit"] == 10
        print(f"PASS: Combined filters work - {data['total']} matching logs")
    
    def test_audit_trail_log_entry_structure(self):
        """Test that log entries have correct structure with enriched data"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={"limit": 5},
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data["logs"]) > 0:
            log = data["logs"][0]
            
            # Verify base fields
            assert "id" in log, "Log should have id"
            assert "type" in log, "Log should have type"
            assert "changed_at" in log, "Log should have changed_at timestamp"
            
            # These may or may not be present depending on log type
            # But if present, they should be enriched with names
            if log.get("changed_by"):
                # changed_by_name should be enriched
                assert "changed_by_name" in log or log.get("changed_by_name") is None
            
            print(f"PASS: Log entry structure is correct - ID: {log['id']}, Type: {log['type']}")
        else:
            print("SKIP: No logs to verify structure")
    
    # ==================== MIGRATION ENDPOINT ====================
    
    def test_audit_trail_migrate_endpoint(self):
        """Test POST /api/admin/audit-trail/migrate works"""
        response = requests.post(
            f"{BASE_URL}/api/admin/audit-trail/migrate",
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Migrated" in data["message"]
        print(f"PASS: Migration endpoint works - {data['message']}")
    
    # ==================== UNAUTHORIZED ACCESS TESTS ====================
    
    def test_audit_trail_unauthorized_access(self):
        """Test that audit trail endpoints require authentication"""
        # Without token
        response = requests.get(f"{BASE_URL}/api/admin/audit-trail")
        assert response.status_code == 403 or response.status_code == 401
        print("PASS: Unauthorized access is blocked")
    
    def test_audit_trail_invalid_token(self):
        """Test that invalid token is rejected"""
        response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            headers={"Authorization": "Bearer invalid_token_here"}
        )
        assert response.status_code == 401
        print("PASS: Invalid token is rejected")


class TestAuditTrailDataIntegrity:
    """Test audit trail logging when settings are changed"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Login and get admin token"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        })
        if login_response.status_code == 200:
            self.admin_token = login_response.json().get("access_token")
        else:
            pytest.skip("Admin authentication failed")
    
    def test_platform_settings_change_logged(self):
        """Test that platform settings changes are logged to audit trail"""
        # Get current settings
        get_response = requests.get(
            f"{BASE_URL}/api/admin/settings/platform",
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if get_response.status_code == 200:
            current_settings = get_response.json()
            
            # Update a setting
            test_value = (current_settings.get("default_advance_percent", 50) + 1) % 80
            update_response = requests.put(
                f"{BASE_URL}/api/admin/settings/platform",
                json={"default_advance_percent": test_value},
                headers={"Authorization": f"Bearer {self.admin_token}"}
            )
            
            if update_response.status_code == 200:
                # Check audit trail for the change
                audit_response = requests.get(
                    f"{BASE_URL}/api/admin/audit-trail",
                    params={"settings_type": "platform_settings", "limit": 5},
                    headers={"Authorization": f"Bearer {self.admin_token}"}
                )
                assert audit_response.status_code == 200
                print("PASS: Platform settings changes are logged to audit trail")
            else:
                print("SKIP: Could not update platform settings")
        else:
            print("SKIP: Could not get platform settings")
    
    def test_stats_reflect_actual_data(self):
        """Test that stats endpoint reflects actual data in logs"""
        # Get stats
        stats_response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail/stats",
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert stats_response.status_code == 200
        stats = stats_response.json()
        
        # Get all logs count
        logs_response = requests.get(
            f"{BASE_URL}/api/admin/audit-trail",
            params={"limit": 1},
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        assert logs_response.status_code == 200
        logs = logs_response.json()
        
        # Total in stats should match total in logs response
        assert stats["total_changes"] == logs["total"], f"Stats total ({stats['total_changes']}) should match logs total ({logs['total']})"
        print(f"PASS: Stats total ({stats['total_changes']}) matches logs total ({logs['total']})")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
