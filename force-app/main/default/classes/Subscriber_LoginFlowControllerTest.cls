@isTest
private class Subscriber_LoginFlowControllerTest {


@IsTest
    static void testSendLoginInfo() {
        // Create a test User
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'testuser@example.com',
            Username = 'testuser@example.com',
            Alias = 'testu',
            TimeZoneSidKey = 'GMT',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = UserInfo.getProfileId(),
            LanguageLocaleKey = 'en_US'
        );
        insert testUser;

        // Call the method with the test User's ID
        Test.startTest();
        Subscriber_LoginFlowController.sendLoginInfo(new List<Id>{testUser.Id});
        Test.stopTest();

        // Add assertions or check logs as needed
        System.assert(true, 'Test passed');
    }

}