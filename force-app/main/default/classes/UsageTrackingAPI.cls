@RestResource(urlMapping='/api/usage/new/*')
global class UsageTrackingAPI {

    // Set your secret token here (can move to Custom Metadata for security)
    private static final String SECRET_API_KEY = Label.Secret_API_Key_For_UsageAPI;
    private static Map<String,Object> payload = new Map<String,Object>();
    private static String username = '';
    private static String logintime = '';
    private static String apiKey;

    private static String errorMessage = '';

    @HttpPost
    global static void handlePost() {

        // Set up the response and request context objects
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');

        // Parse incoming request
        String requestBody = req.requestBody.toString();

        // Check if the request body is a valid json
        try {
            payload = (Map<String, Object>) JSON.deserializeUntyped(requestBody);
            
        } 
        catch (Exception ex) {
            res.statusCode = 400;
            res.responseBody = Blob.valueOf('Invalid JSON');
            return;
        }

        // Extract fields
        String username = (String) payload.get('username');
        String logintime = (String) payload.get('logintime');
        String apiKey = (String) payload.get('apiKey');
        System.debug('✅ Received username from guest: ' + username);
        System.debug('✅ Received logintime from guest: ' + logintime);
        System.debug('✅ Received apiKey from guest: ' + apiKey);

        // Check for required fields
        if (!payload.containsKey('username') || !payload.containsKey('apiKey')) {
            res.statusCode = 400;
            res.responseBody = Blob.valueOf('Missing required fields : username, apiKey');
            return;
        }

        // API key check
        if (apiKey != SECRET_API_KEY) {
            res.statusCode = 403;
            res.responseBody = Blob.valueOf('Forbidden: Invalid API Key');
            return;
        }

        // Finally send the login usage / tracking info
        try {
            String resStr = logUsageTracking(username);
            res.statusCode = 200;
            res.responseBody = Blob.valueOf(resStr);
        } 
        catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(e.getMessage());
            return;
        }
    }

	private static String logUsageTracking(String username){
        Map<String, Object> response = new Map<String, Object>();
        Connected_Org__c org = [SELECT id, Last_Login_Date__c, Last_Login_Status__c, Admin_User_Name__c from Connected_Org__c WHERE Admin_User_Name__c = :username LIMIT 1];
        if (org != null) {
            org.Last_Login_Date__c = Date.today();
            org.Last_Login_Time__c = DateTime.now();
            org.Last_Login_Status__c = 'Success';
            update org;

            response.put('success', true);
            response.put('org', org.id);
            response.put('username', org.Admin_User_Name__c);
            response.put('logintime', org.Last_Login_Time__c);
        }
        else{
            response.put('success', false);
            response.put('errormessage', 'No matching Connected_Org__c record found for the provided username.');
        }
        return JSON.serialize(response);
	}   
}