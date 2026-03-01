"""
Test Admin Settings Portal API Endpoints
- Platform settings (Global EWA limits, fees, cooldown)
- Risk settings (thresholds, auto-actions)
- Notification settings (email/SMS alerts)
- Employer config (per-employer settings)
- Employee config (per-employee overrides)
- Blackout periods (create, edit, delete)
- Legal documents (view, edit)
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin test credentials
ADMIN_EMAIL = "superadmin@eaziwage.com"
ADMIN_PASSWORD = "Admin@12345"


class TestAdminSettingsAuth:
    """Test admin authentication for settings access"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        return data["access_token"]
    
    def test_admin_login(self, admin_token):
        """Test admin can login successfully"""
        assert admin_token is not None
        print(f"✓ Admin login successful, token obtained")


class TestPlatformSettings:
    """Test Global Platform Settings (EWA limits, fees, cooldown)"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_platform_settings(self, admin_token):
        """Test GET /api/admin/settings/platform returns default settings"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/platform",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get platform settings: {response.text}"
        data = response.json()
        
        # Verify key fields exist
        assert "default_advance_percent" in data
        assert "min_advance_amount" in data
        assert "max_advance_amount" in data
        assert "default_cooldown_days" in data
        print(f"✓ Platform settings retrieved successfully")
        print(f"  - Default advance percent: {data.get('default_advance_percent')}%")
        print(f"  - Min advance: {data.get('min_advance_amount')} KES")
        print(f"  - Max advance: {data.get('max_advance_amount')} KES")
    
    def test_update_platform_settings(self, admin_token):
        """Test PUT /api/admin/settings/platform updates settings"""
        # New settings to update
        new_settings = {
            "default_advance_percent": 65,
            "min_advance_amount": 600,
            "max_advance_amount": 150000,
            "daily_advance_limit": 4,
            "weekly_advance_limit": 8,
            "monthly_advance_limit": 20,
            "min_processing_fee": 3.0,
            "max_processing_fee": 6.5,
            "mobile_fee": 55,
            "bank_fee": 110,
            "default_cooldown_days": 2,
            "new_employee_wait_days": 14,
            "instant_mobile_enabled": True,
            "bank_transfers_enabled": True,
            "auto_approval_enabled": True,
            "weekend_advances_enabled": False,
            "enabled_countries": ["KE", "UG", "TZ"]
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/settings/platform",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=new_settings
        )
        assert response.status_code == 200, f"Failed to update platform settings: {response.text}"
        data = response.json()
        assert data.get("message") == "Platform settings updated successfully"
        print(f"✓ Platform settings updated successfully")
        
        # Verify the update persisted
        get_response = requests.get(
            f"{BASE_URL}/api/admin/settings/platform",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert get_response.status_code == 200
        updated_data = get_response.json()
        assert updated_data["default_advance_percent"] == 65
        print(f"✓ Platform settings update verified (advance_percent=65)")
    
    def test_unauthorized_access_platform_settings(self):
        """Test unauthorized access to platform settings fails"""
        response = requests.get(f"{BASE_URL}/api/admin/settings/platform")
        assert response.status_code == 403 or response.status_code == 401
        print(f"✓ Unauthorized access blocked correctly")


class TestRiskSettings:
    """Test Risk & Compliance Settings (thresholds, auto-actions)"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_risk_settings(self, admin_token):
        """Test GET /api/admin/settings/risk returns risk configuration"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/risk",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get risk settings: {response.text}"
        data = response.json()
        
        # Verify key risk fields
        assert "employer_low_threshold" in data
        assert "employee_low_threshold" in data
        assert "auto_suspend_threshold" in data
        print(f"✓ Risk settings retrieved successfully")
        print(f"  - Employer low threshold: {data.get('employer_low_threshold')}")
        print(f"  - Auto-suspend threshold: {data.get('auto_suspend_threshold')}")
    
    def test_update_risk_settings(self, admin_token):
        """Test PUT /api/admin/settings/risk updates risk settings"""
        new_settings = {
            "employer_low_threshold": 85,
            "employer_medium_threshold": 65,
            "employee_low_threshold": 85,
            "employee_medium_threshold": 65,
            "auto_suspend_threshold": 35,
            "reduce_limits_threshold": 55,
            "auto_suspend_on_fraud": True,
            "auto_reduce_on_warning": True,
            "notify_on_high_risk": True,
            "require_id_verification": True,
            "require_face_id": True,
            "require_address_proof": True,
            "require_employment_contract": True,
            "reverification_frequency": "quarterly"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/settings/risk",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=new_settings
        )
        assert response.status_code == 200, f"Failed to update risk settings: {response.text}"
        print(f"✓ Risk settings updated successfully")


class TestNotificationSettings:
    """Test Notification Settings (Email/SMS alerts)"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_notification_settings(self, admin_token):
        """Test GET /api/admin/settings/notifications"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/notifications",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get notification settings: {response.text}"
        data = response.json()
        
        # Verify email settings
        assert "email_new_employer" in data
        assert "email_fraud_alert" in data
        # Verify SMS settings
        assert "sms_fraud_alert" in data
        print(f"✓ Notification settings retrieved successfully")
    
    def test_update_notification_settings(self, admin_token):
        """Test PUT /api/admin/settings/notifications"""
        new_settings = {
            "email_new_employer": True,
            "email_large_advance": True,
            "email_fraud_alert": True,
            "email_daily_summary": False,
            "email_weekly_report": True,
            "sms_fraud_alert": True,
            "sms_system_alert": True,
            "sms_large_transaction": True,
            "large_advance_threshold": 75000,
            "daily_volume_threshold": 2000000,
            "fraud_alert_emails": "admin@eaziwage.com,security@eaziwage.com",
            "admin_sms_numbers": "+254700000000,+254711111111"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/settings/notifications",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=new_settings
        )
        assert response.status_code == 200, f"Failed to update notification settings: {response.text}"
        print(f"✓ Notification settings updated successfully")


class TestEmployerConfig:
    """Test Employer-specific Configuration"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_employers_list(self, admin_token):
        """Test GET /api/admin/settings/employers returns employer list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/employers",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get employers: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Employers list retrieved: {len(data)} employers")
        return data
    
    def test_get_employer_settings(self, admin_token):
        """Test GET /api/admin/settings/employers/{id} for specific employer"""
        # First get employers list
        list_response = requests.get(
            f"{BASE_URL}/api/admin/settings/employers",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        employers = list_response.json()
        
        if employers:
            employer_id = employers[0]["id"]
            response = requests.get(
                f"{BASE_URL}/api/admin/settings/employers/{employer_id}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            assert response.status_code == 200, f"Failed to get employer settings: {response.text}"
            data = response.json()
            assert "employer" in data
            assert "settings" in data
            print(f"✓ Employer settings retrieved for: {data['employer'].get('company_name', 'Unknown')}")
        else:
            print("⚠ No employers found to test - skipping individual employer test")
    
    def test_update_employer_settings(self, admin_token):
        """Test PUT /api/admin/settings/employers/{id}"""
        # First get employers list
        list_response = requests.get(
            f"{BASE_URL}/api/admin/settings/employers",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        employers = list_response.json()
        
        if employers:
            employer_id = employers[0]["id"]
            new_settings = {
                "advance_limit_percent": 55,
                "cooldown_days": 4,
                "processing_fee": 5.0,
                "max_monthly_advances": 12,
                "funding_model": "prefunded",
                "risk_tier": "medium",
                "funding_buffer_percent": 25,
                "credit_limit": 3000000,
                "employee_advance_limit_min": 15,
                "employee_advance_limit_max": 55,
                "employee_cooldown_min": 2,
                "employee_cooldown_max": 10,
                "ewa_enabled": True,
                "instant_enabled": True,
                "auto_approve": False,
                "weekend_access": False
            }
            
            response = requests.put(
                f"{BASE_URL}/api/admin/settings/employers/{employer_id}",
                headers={
                    "Authorization": f"Bearer {admin_token}",
                    "Content-Type": "application/json"
                },
                json=new_settings
            )
            assert response.status_code == 200, f"Failed to update employer settings: {response.text}"
            print(f"✓ Employer settings updated successfully")
        else:
            print("⚠ No employers found to test - skipping update test")


class TestEmployeeConfig:
    """Test Employee-specific Configuration"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_employees_list(self, admin_token):
        """Test GET /api/admin/settings/employees returns employee list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/employees",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get employees: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Employees list retrieved: {len(data)} employees")
    
    def test_get_employee_settings(self, admin_token):
        """Test GET /api/admin/settings/employees/{id} for specific employee"""
        # First get employees list
        list_response = requests.get(
            f"{BASE_URL}/api/admin/settings/employees",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        employees = list_response.json()
        
        if employees:
            employee_id = employees[0]["id"]
            response = requests.get(
                f"{BASE_URL}/api/admin/settings/employees/{employee_id}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            assert response.status_code == 200, f"Failed to get employee settings: {response.text}"
            data = response.json()
            assert "employee" in data
            assert "settings" in data
            assert "stats" in data
            print(f"✓ Employee settings retrieved for: {data['employee'].get('full_name', 'Unknown')}")
        else:
            print("⚠ No employees found to test - skipping individual employee test")
    
    def test_update_employee_settings(self, admin_token):
        """Test PUT /api/admin/settings/employees/{id}"""
        list_response = requests.get(
            f"{BASE_URL}/api/admin/settings/employees",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        employees = list_response.json()
        
        if employees:
            employee_id = employees[0]["id"]
            new_settings = {
                "use_custom_settings": True,
                "advance_limit_percent": 70,
                "cooldown_days": 2,
                "max_monthly_advances": 15,
                "fee_rate": 4.0,
                "ewa_enabled": True,
                "vip_status": False,
                "manual_approval": False,
                "on_watchlist": False,
                "admin_notes": "TEST: Updated via admin settings API test"
            }
            
            response = requests.put(
                f"{BASE_URL}/api/admin/settings/employees/{employee_id}",
                headers={
                    "Authorization": f"Bearer {admin_token}",
                    "Content-Type": "application/json"
                },
                json=new_settings
            )
            assert response.status_code == 200, f"Failed to update employee settings: {response.text}"
            print(f"✓ Employee settings updated successfully")
        else:
            print("⚠ No employees found to test - skipping update test")


class TestBlackoutPeriods:
    """Test Blackout Periods CRUD operations"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_blackout_periods(self, admin_token):
        """Test GET /api/admin/settings/blackouts"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/blackouts",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get blackouts: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Blackout periods retrieved: {len(data)} periods")
    
    def test_create_blackout_period(self, admin_token):
        """Test POST /api/admin/settings/blackouts creates new period"""
        blackout_data = {
            "name": "TEST Holiday Blackout",
            "start_date": "2026-12-24",
            "end_date": "2026-12-31",
            "applies_to": "all",
            "reason": "Test holiday period - DO NOT USE",
            "is_active": False  # Keep inactive for testing
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/settings/blackouts",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=blackout_data
        )
        assert response.status_code == 200, f"Failed to create blackout: {response.text}"
        data = response.json()
        assert "id" in data
        print(f"✓ Blackout period created: {data['id']}")
        return data["id"]
    
    def test_update_blackout_period(self, admin_token):
        """Test PUT /api/admin/settings/blackouts/{id}"""
        # First create one
        create_response = requests.post(
            f"{BASE_URL}/api/admin/settings/blackouts",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={
                "name": "TEST Update Blackout",
                "start_date": "2026-11-01",
                "end_date": "2026-11-05",
                "applies_to": "KE",
                "reason": "Test update",
                "is_active": False
            }
        )
        assert create_response.status_code == 200
        blackout_id = create_response.json()["id"]
        
        # Update it
        update_data = {
            "name": "TEST Update Blackout - UPDATED",
            "start_date": "2026-11-01",
            "end_date": "2026-11-10",
            "applies_to": "all",
            "reason": "Test update - modified",
            "is_active": False
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/settings/blackouts/{blackout_id}",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=update_data
        )
        assert response.status_code == 200, f"Failed to update blackout: {response.text}"
        print(f"✓ Blackout period updated successfully")
    
    def test_delete_blackout_period(self, admin_token):
        """Test DELETE /api/admin/settings/blackouts/{id}"""
        # First create one
        create_response = requests.post(
            f"{BASE_URL}/api/admin/settings/blackouts",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json={
                "name": "TEST Delete Blackout",
                "start_date": "2026-10-01",
                "end_date": "2026-10-05",
                "applies_to": "all",
                "reason": "Test delete",
                "is_active": False
            }
        )
        assert create_response.status_code == 200
        blackout_id = create_response.json()["id"]
        
        # Delete it
        response = requests.delete(
            f"{BASE_URL}/api/admin/settings/blackouts/{blackout_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to delete blackout: {response.text}"
        print(f"✓ Blackout period deleted successfully")
        
        # Verify deletion
        get_response = requests.get(
            f"{BASE_URL}/api/admin/settings/blackouts",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        blackouts = get_response.json()
        assert not any(b["id"] == blackout_id for b in blackouts)
        print(f"✓ Deletion verified - blackout no longer exists")


class TestLegalDocuments:
    """Test Legal Documents management"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_all_legal_documents(self, admin_token):
        """Test GET /api/admin/settings/legal-documents"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/legal-documents",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get legal documents: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Legal documents retrieved: {len(data)} documents")
    
    def test_create_or_update_employee_terms(self, admin_token):
        """Test PUT /api/admin/settings/legal-documents/employee_terms"""
        doc_data = {
            "document_type": "employee_terms",
            "title": "Employee Terms and Conditions - TEST",
            "content": "# Employee Terms\n\nThis is a TEST document for employee terms and conditions.\n\n## Section 1\nTest content here.",
            "version": "1.0.1",
            "effective_date": "2026-01-01",
            "is_active": True
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/settings/legal-documents/employee_terms",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json"
            },
            json=doc_data
        )
        assert response.status_code == 200, f"Failed to create employee terms: {response.text}"
        print(f"✓ Employee terms document created/updated")
    
    def test_get_specific_legal_document(self, admin_token):
        """Test GET /api/admin/settings/legal-documents/{doc_type}"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/legal-documents/employee_terms",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        # May return 404 if not created yet, or 200 if exists
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            data = response.json()
            assert "title" in data or "content" in data
            print(f"✓ Legal document retrieved: {data.get('title', 'employee_terms')}")
        else:
            print("⚠ Employee terms document not found - will be created on first save")
    
    def test_get_legal_document_history(self, admin_token):
        """Test GET /api/admin/settings/legal-documents/{doc_type}/history"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/legal-documents/employee_terms/history",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get document history: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Legal document history retrieved: {len(data)} versions")
    
    def test_public_legal_document_access(self):
        """Test public access to legal documents (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/legal-documents/employee_terms")
        assert response.status_code == 200, f"Failed to get public legal document: {response.text}"
        data = response.json()
        assert "title" in data or "content" in data
        print(f"✓ Public legal document access works")


class TestSettingsAuditLog:
    """Test Settings Audit Log"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_audit_log(self, admin_token):
        """Test GET /api/admin/settings/audit-log"""
        response = requests.get(
            f"{BASE_URL}/api/admin/settings/audit-log",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Failed to get audit log: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Audit log retrieved: {len(data)} entries")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
