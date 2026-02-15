import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class EaziWageAPITester:
    def __init__(self, base_url="https://wage-advance-demo.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.employee_token = None
        self.employer_token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        
        # Store created IDs for cleanup and testing
        self.employer_id = None
        self.employee_id = None
        self.advance_id = None

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, headers: Optional[Dict] = None, 
                 token: Optional[str] = None) -> tuple[bool, Dict[str, Any]]:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if headers:
            request_headers.update(headers)
            
        if token:
            request_headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=request_headers)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_body = response.json()
                    print(f"   Error: {error_body}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_countries_endpoint(self):
        """Test countries utility endpoint"""
        return self.run_test("Countries", "GET", "countries", 200)

    def test_industries_endpoint(self):
        """Test industries utility endpoint"""
        return self.run_test("Industries", "GET", "industries", 200)

    def test_employee_registration(self):
        """Test employee registration"""
        timestamp = datetime.now().strftime("%H%M%S")
        employee_data = {
            "email": f"employee_{timestamp}@test.com",
            "phone": f"+25470000{timestamp}",
            "full_name": f"Test Employee {timestamp}",
            "role": "employee",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("Employee Registration", "POST", "auth/register", 200, employee_data)
        if success and 'access_token' in response:
            self.employee_token = response['access_token']
            print(f"   Employee token obtained: {self.employee_token[:20]}...")
        return success, response

    def test_employer_registration(self):
        """Test employer registration"""
        timestamp = datetime.now().strftime("%H%M%S")
        employer_data = {
            "email": f"employer_{timestamp}@company.com",
            "phone": f"+25470000{timestamp}",
            "full_name": f"Test Employer {timestamp}",
            "role": "employer",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("Employer Registration", "POST", "auth/register", 200, employer_data)
        if success and 'access_token' in response:
            self.employer_token = response['access_token']
            print(f"   Employer token obtained: {self.employer_token[:20]}...")
        return success, response

    def test_login(self, email: str, password: str):
        """Test login functionality"""
        login_data = {
            "email": email,
            "password": password
        }
        
        return self.run_test("Login", "POST", "auth/login", 200, login_data)

    def test_protected_endpoint_without_token(self):
        """Test that protected endpoints return 401 without token"""
        return self.run_test("Protected Endpoint (No Token)", "GET", "auth/me", 401)

    def test_auth_me_employee(self):
        """Test /auth/me endpoint with employee token"""
        if not self.employee_token:
            print("⚠️ Skipping - No employee token available")
            return False, {}
        
        return self.run_test("Auth Me (Employee)", "GET", "auth/me", 200, token=self.employee_token)

    def test_auth_me_employer(self):
        """Test /auth/me endpoint with employer token"""
        if not self.employer_token:
            print("⚠️ Skipping - No employer token available")
            return False, {}
        
        return self.run_test("Auth Me (Employer)", "GET", "auth/me", 200, token=self.employer_token)

    def test_employer_profile_creation(self):
        """Test employer profile creation"""
        if not self.employer_token:
            print("⚠️ Skipping - No employer token available")
            return False, {}

        employer_profile = {
            "company_name": "Test Company Ltd",
            "registration_number": "RC12345",
            "tax_id": "TAX67890",
            "country": "KE",
            "address": "123 Test Street, Nairobi",
            "employee_count": 50,
            "industry": "technology",
            "payroll_cycle": "monthly",
            "contact_person": "Test Contact",
            "contact_email": "contact@testcompany.com",
            "contact_phone": "+254700123456"
        }
        
        success, response = self.run_test("Employer Profile Creation", "POST", "employers", 200, 
                                        employer_profile, token=self.employer_token)
        if success and 'id' in response:
            self.employer_id = response['id']
            print(f"   Employer profile ID: {self.employer_id}")
        
        return success, response

    def test_get_employer_profile(self):
        """Test getting employer profile"""
        if not self.employer_token:
            print("⚠️ Skipping - No employer token available")
            return False, {}
        
        return self.run_test("Get Employer Profile", "GET", "employers/me", 200, token=self.employer_token)

    def test_employee_profile_creation(self):
        """Test employee profile creation"""
        if not self.employee_token or not self.employer_id:
            print("⚠️ Skipping - No employee token or employer ID available")
            return False, {}

        employee_profile = {
            "employer_id": self.employer_id,
            "employee_code": "EMP001",
            "national_id": "12345678",
            "date_of_birth": "1990-01-01",
            "employment_type": "full-time",
            "job_title": "Software Developer",
            "monthly_salary": 50000.0,
            "mobile_money_provider": "M-PESA",
            "mobile_money_number": "+254700123456",
            "country": "KE"
        }
        
        success, response = self.run_test("Employee Profile Creation", "POST", "employees", 200, 
                                        employee_profile, token=self.employee_token)
        if success and 'id' in response:
            self.employee_id = response['id']
            print(f"   Employee profile ID: {self.employee_id}")
        
        return success, response

    def test_get_employee_profile(self):
        """Test getting employee profile"""
        if not self.employee_token:
            print("⚠️ Skipping - No employee token available")
            return False, {}
        
        return self.run_test("Get Employee Profile", "GET", "employees/me", 200, token=self.employee_token)

    def test_employee_dashboard(self):
        """Test employee dashboard endpoint"""
        if not self.employee_token:
            print("⚠️ Skipping - No employee token available")
            return False, {}
        
        return self.run_test("Employee Dashboard", "GET", "dashboard/employee", 200, token=self.employee_token)

    def test_employer_dashboard(self):
        """Test employer dashboard endpoint"""
        if not self.employer_token:
            print("⚠️ Skipping - No employer token available")
            return False, {}
        
        return self.run_test("Employer Dashboard", "GET", "dashboard/employer", 200, token=self.employer_token)

    def test_admin_login(self):
        """Test admin login with provided credentials"""
        admin_data = {
            "email": "superadmin@eaziwage.com",
            "password": "Admin@12345"
        }
        
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, admin_data)
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"   Admin token obtained: {self.admin_token[:20]}...")
        return success, response

    def test_admin_dashboard(self):
        """Test admin dashboard endpoint"""
        if not self.admin_token:
            print("⚠️ Skipping - No admin token available")
            return False, {}
        
        return self.run_test("Admin Dashboard", "GET", "dashboard/admin", 200, token=self.admin_token)

    def test_kyc_endpoints(self):
        """Test KYC document endpoints"""
        if not self.employee_token:
            print("⚠️ Skipping - No employee token available")
            return False, {}
        
        # Test KYC document upload
        doc_data = {
            "document_type": "national_id",
            "document_url": "/uploads/kyc/test_id.jpg",
            "document_number": "12345678"
        }
        
        success, response = self.run_test("KYC Document Upload", "POST", "kyc/documents", 200, 
                                        doc_data, token=self.employee_token)
        
        # Test KYC document list
        self.run_test("KYC Document List", "GET", "kyc/documents", 200, token=self.employee_token)
        
        return success, response

    def test_risk_scoring_endpoints(self):
        """Test risk scoring endpoints"""
        if not self.admin_token or not self.employer_id:
            print("⚠️ Skipping - No admin token or employer ID available")
            return False, {}
        
        # Test employer risk scoring
        risk_data = {
            "legal_compliance": {"registration_status": 4, "tax_compliance": 3, "ewa_agreement": 5},
            "financial_health": {"audited_financials": 3, "liquidity_ratio": 4, "payroll_sustainability": 3},
            "operational": {"employee_count": 4, "churn_rate": 3, "payroll_integration": 4},
            "sector_exposure": {"industry_risk": 3, "regulatory_exposure": 4},
            "aml_transparency": {"beneficial_ownership": 4, "pep_screening": 5}
        }
        
        return self.run_test("Employer Risk Scoring", "POST", f"risk-scores/employer/{self.employer_id}", 
                           200, risk_data, token=self.admin_token)

    def test_role_based_access(self):
        """Test role-based access control"""
        if not self.employee_token or not self.employer_token:
            print("⚠️ Skipping - Missing tokens for role-based testing")
            return True

        # Employee trying to access employer endpoints (should fail)
        print("\n🔒 Testing Role-Based Access Control...")
        
        # Employee accessing employer dashboard (should fail)
        success, _ = self.run_test("Employee->Employer Dashboard (Should Fail)", "GET", 
                                 "dashboard/employer", 403, token=self.employee_token)
        
        # Employer accessing employee dashboard (should fail) 
        success, _ = self.run_test("Employer->Employee Dashboard (Should Fail)", "GET",
                                 "dashboard/employee", 403, token=self.employer_token)
        
        return True

def main():
    print("🚀 Starting EaziWage API Tests...")
    print("=" * 50)
    
    tester = EaziWageAPITester()
    
    try:
        # Test utility endpoints (no auth required)
        print("\n📋 Testing Utility Endpoints...")
        tester.test_root_endpoint()
        tester.test_countries_endpoint()
        tester.test_industries_endpoint()
        
        # Test authentication
        print("\n🔐 Testing Authentication...")
        tester.test_employee_registration()
        tester.test_employer_registration()
        tester.test_admin_login()  # Test admin login with provided credentials
        
        # Test protected endpoint without token
        tester.test_protected_endpoint_without_token()
        
        # Test auth/me endpoints
        tester.test_auth_me_employee()
        tester.test_auth_me_employer()
        
        # Test profile creation
        print("\n👤 Testing Profile Creation...")
        tester.test_employer_profile_creation()
        tester.test_employee_profile_creation()
        
        # Test profile retrieval
        print("\n📊 Testing Profile Retrieval...")
        tester.test_get_employer_profile()
        tester.test_get_employee_profile()
        
        # Test dashboard endpoints
        print("\n📈 Testing Dashboard Endpoints...")
        tester.test_employee_dashboard()
        tester.test_employer_dashboard()
        tester.test_admin_dashboard()
        
        # Test KYC endpoints
        print("\n📄 Testing KYC Endpoints...")
        tester.test_kyc_endpoints()
        
        # Test Risk Scoring endpoints  
        print("\n⚖️ Testing Risk Scoring Endpoints...")
        tester.test_risk_scoring_endpoints()
        
        # Test role-based access
        tester.test_role_based_access()
        
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        failed = tester.tests_run - tester.tests_passed
        print(f"❌ {failed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())