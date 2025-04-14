public with sharing class OrgSwitcherController {
    @AuraEnabled(cacheable=true)
    public static List<Connected_Org__c> getAvailableOrgs() {
        try {
            // Query to fetch only active connected orgs
            return [
            SELECT 
                Id, Name, Admin_User_Name__c, Admin_User_Password__c, 
                IsActive__c, Connected_App_Id__c, 
                Last_Login_Status__c, Org_Icon__c,
                IdP_Initiated_Login_URL__c,Last_Login_Time__c,
                Login_URL__c,SSO_Enabled__c
            FROM Connected_Org__c 
            ORDER BY Last_Login_Time__c desc
            ];
        } catch (Exception ex) {
            // Log the exception and throw a user-friendly error
            System.debug('Error fetching connected orgs: ' + ex.getMessage());
            throw new AuraHandledException('Unable to fetch connected orgs. Please try again later.');
        }
    }

    public OrgSwitcherController() {

    }
}