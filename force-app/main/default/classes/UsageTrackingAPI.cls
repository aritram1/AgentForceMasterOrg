@RestResource(urlMapping='/api/usage/new/*')
global class UsageTrackingAPI {

    // Set your secret token here (can move to Custom Metadata for security)
    private static final String SECRET_API_KEY = '9830702921';
    private static Map<String,Object> payload = new Map<String,Object>();
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

        // Check for required fields
        if (!payload.containsKey('username') || !payload.containsKey('logintime') || !payload.containsKey('apiKey')) {
            res.statusCode = 400;
            res.responseBody = Blob.valueOf('Missing required fields');
            return;
        }

        // API key check
        String apiKey = (String) payload.get('apiKey');
        if (apiKey != SECRET_API_KEY) {
            res.statusCode = 403;
            res.responseBody = Blob.valueOf('Forbidden: Invalid API Key');
            return;
        }

        // Extract fields
        String username = (String) payload.get('username');
        String logintime = (String) payload.get('logintime');

        // Process your logic here
        System.debug('✅ Received from guest: ' + username + ', ' + logintime);

        try {
            String resStr = logUsageTracking(username, logintime);
            res.statusCode = 200;
            res.responseBody = Blob.valueOf(resStr);
        } 
        catch (Exception e) {
            res.statusCode = 500;
            res.responseBody = Blob.valueOf(e.getMessage());
            return;
        }
    }

	private static String logUsageTracking(String username, String logintime){
        Map<String, Object> response = new Map<String, Object>();
        Connected_Org__c org = [SELECT id, Last_Login_Date__c, Last_Login_Status__c, Admin_User_Name__c from Connected_Org__c WHERE Admin_User_Name__c = :username LIMIT 1];
        if (org != null) {
            org.Last_Login_Date__c = Date.today(); // logintime 
            org.Last_Login_Status__c = 'Success';
            update org;

            response.put('success', true);
            response.put('org', org.id);
            response.put('username', username);
            response.put('logintime', logintime);
        }
        else{
            response.put('success', false);
            response.put('errormessage', 'No matching Connected_Org__c record found for the provided username.');
        }
        return JSON.serialize(response);
	}   
}
