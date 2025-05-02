public with sharing class OrgSwitcherController {
    
    /**
     * Retrieves data with caching enabled for improved performance.
     */
    @AuraEnabled(cacheable=true)
    public static List<Connected_Org__c> getAvailableOrgs(String filterBy, String orderBy) {
        try {

            // Use Database.query to dynamically sort by the provided field
            String query = 'SELECT ' +
                'Id, Name, Admin_User_Name__c, Admin_User_Password__c, ' +
                'IsActive__c, Connected_App_Id__c, ' +
                'Last_Login_Status__c, Org_Icon__c, ' +
                'IdP_Initiated_Login_URL__c, Last_Login_Time__c, ' +
                'Login_URL__c, SSO_Enabled__c, Github_Repo__c ' +
                'FROM Connected_Org__c ' +
                getWhereClause(filterBy) + 
                getOrderByClause(orderBy);
            System.debug('Query: ' + query);    
            return Database.query(query);
        } 
        catch (Exception ex) {
            // Log the exception and throw a user-friendly error
            System.debug('Error fetching connected orgs: ' + ex.getMessage());
            throw new AuraHandledException('Unable to fetch connected orgs. Please try again later.');
        }
    }


	private static String getOrderByClause(String orderBy){
        // Construct the ORDER BY clause based on the `orderBy` parameter
        String orderByClause = '';
        if (orderBy == 'Name') {
            orderByClause = ' ORDER BY Name ASC';
        } 
        else if (orderBy == 'Last_Login') {
            orderByClause = ' ORDER BY Last_Login_Time__c DESC';
        } 
        else {
            orderByClause = '';
        }
        return orderByClause;
	} 

    // Construct the WHERE clause based on the `filterBy` parameter
    private static String getWhereClause(String filterBy){
        String whereClause = '';
        if (filterBy == 'All') {
            whereClause = '';
        } 
        else if (filterBy == 'Active_Orgs') {
            whereClause = ' WHERE IsActive__c = true ';
        }
        else if (filterBy == 'Inactive_Orgs') {
            whereClause = ' WHERE IsActive__c = false ';
        } 
        else if (filterBy == 'SSO_Enabled') {
            whereClause = ' WHERE SSO_Enabled__c = true ';
        }
        else if (filterBy == 'SSO_Disabled') {
            whereClause = ' WHERE SSO_Enabled__c = false ';
        }
        else if (filterBy == 'Orgs_Not_Logged_In_Last_30_Days') {
            DateTime last30Days = DateTime.now().addDays(-30);
            String last30DaysString = last30Days.format('yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
            whereClause = ' WHERE Last_Login_Time__c = null OR Last_Login_Time__c < ' + last30DaysString;
        }
        return whereClause;
    }
}