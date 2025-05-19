@isTest
private class OrgSwitcherControllerTest {


@IsTest
    static void testGetAvailableOrgs() {
        // Create a test Connected_Org__c record
        Connected_Org__c testOrg = new Connected_Org__c(
            Name = 'Test Org',
            Admin_User_Name__c = 'testuser',
            Admin_User_Password__c = 'testpassword',
            IsActive__c = true,
            Connected_App_Id__c = 'testAppId',
            Last_Login_Status__c = 'Success',
            Org_Icon__c = 'testIcon',
            Login_URL__c = 'https://test.salesforce.com',
            SSO_Enabled__c = true,
            Github_Repo__c = 'testRepo'
        );
        insert testOrg;

        // Call the method with filterBy and orderBy parameters
        List<Connected_Org__c> result = OrgSwitcherController.getAvailableOrgs('Active', 'Name');

        // Assert that the result is not null and contains the expected record
        System.assertNotEquals(null, result);
        System.assertEquals(1, result.size());
        System.assertEquals(testOrg.Id, result[0].Id);
    }

}