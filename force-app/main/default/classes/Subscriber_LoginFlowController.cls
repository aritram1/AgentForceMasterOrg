// Subscriber class

public with sharing class Subscriber_LoginFlowController {

    // Public REST endpoint of the target org's guest-accessible API
    private static final String USAGE_API_ENDPOINT = Label.Usage_API_Endpoint;
    private static final String SECRET_API_KEY = Label.Secret_API_Key_For_UsageAPI;

    /**
     * Invocable method to be called from a Flow (e.g., Login Flow)
     * Accepts a list of User Ids (typically the one user who just logged in)
     */
    @InvocableMethod(label='Send Login Info')
    public static void sendLoginInfo(List<Id> userIds) {
        for (Id userId : userIds) {
            try {
                // Fetch basic User info for the logged-in user
                User u = [SELECT Id, UserName, Email, LastLoginDate FROM User WHERE Id = :userId LIMIT 1];

                // Build the JSON payload to send
                Map<String, Object> payload = new Map<String, Object>{
                    'username' => u.UserName,
                    'logintime' => DateTime.now().formatGmt('yyyy-MM-dd\'T\'HH:mm:ss\'Z\''),
                    'apiKey' => SECRET_API_KEY
                };
                String body = JSON.serialize(payload);

                System.debug('payload=>' + payload);
                
                // Prepare the HTTP request
                HttpRequest req = new HttpRequest();
                req.setEndpoint(USAGE_API_ENDPOINT);
                req.setMethod('POST');
                req.setHeader('Content-Type', 'application/json');
                req.setBody(body);

                // Send the HTTP request
                Http http = new Http();
                HttpResponse res = http.send(req);

                // Debug the response (optional)
                System.debug('✅ Login info sent. Status: ' + res.getStatus());
                System.debug('Response body: ' + res.getBody());

            } catch (Exception ex) {
                // Handle any exceptions during the callout
                System.debug('⚠️ Error sending login info for userId ' + userId + ': ' + ex.getMessage());
            }
        }
    }
}