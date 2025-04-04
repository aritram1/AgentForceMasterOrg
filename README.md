# AgentForceMasterOrg

This project contains Salesforce Lightning Web Components (LWC) and Apex classes designed to manage and interact with connected Salesforce orgs. Below is an overview of the key components and their functionality.

---

## Lightning Web Components (LWC)

### 1. **orgSwitcher**
- **Description**: A Lightning Web Component that displays a list of connected Salesforce orgs and allows users to switch between them.
- **Files**:
  - `orgSwitcher.html`: Defines the UI layout of the component.
  - `orgSwitcher.js`: Contains the logic for fetching and displaying connected orgs using the `getListUi` wire adapter.
  - `orgSwitcher.js-meta.xml`: Metadata configuration for the component, exposing it to various Lightning pages.
  - `orgSwitcher.css`: Custom styles for the component.
- **Key Features**:
  - Displays a spinner while loading data.
  - Shows a list of connected orgs with details.
  - Displays a message if no connected orgs are available.

---

### 2. **orgDetailCard**
- **Description**: A Lightning Web Component that displays detailed information about a single connected org.
- **Files**:
  - `orgDetailCard.html`: Defines the UI layout for displaying org details.
  - `orgDetailCard.js`: Contains logic for handling actions like login, SSO login, and editing org details.
  - `orgDetailCard.js-meta.xml`: Metadata configuration for the component.
  - `orgDetailCard.css`: Custom styles for the component.
  - `__tests__/orgDetailCard.test.js`: Jest test file for unit testing the component.
- **Key Features**:
  - Displays org details such as login URL, admin username, and last login status.
  - Provides actions like login, SSO login, and edit.
  - Disables actions for inactive orgs.

---

## Apex Classes

### 1. **OrgSwitcherController**
- **Description**: A placeholder Apex class for potential server-side logic related to the `orgSwitcher` component.
- **File**: `OrgSwitcherController.cls`

---

### 2. **UsageTrackingAPI**
- **Description**: A REST API endpoint for tracking usage of connected orgs.
- **File**: `UsageTrackingAPI.cls`
- **Key Features**:
  - Validates incoming API requests with a secret key.
  - Updates the `Last_Login_Date__c` and `Last_Login_Status__c` fields of the `Connected_Org__c` object.
  - Returns a JSON response indicating success or failure.

---

### 3. **LoginFlowController**
- **Description**: An Apex class designed to send login information to an external API when a user logs in.
- **File**: `LoginFlowController.cls`
- **Key Features**:
  - Sends a POST request to an external API with user login details.
  - Handles errors gracefully and logs debug information.

---

## FlexiPage

### **Connected_Org_Lightning_Page**
- **Description**: A Lightning FlexiPage that displays connected org details using the `orgSwitcher` and `orgDetailCard` components.
- **File**: `Connected_Org_Lightning_Page.flexipage-meta.xml`

---

## Configuration Details

### What to Do When a New Org is Added

1. **Create a Connected App**:
   - A connected app needs to be built in the new org to enable secure communication and authentication.

2. **Deploy the Login Flow and Related Controller**:
   - Deploy the main flow (`Custom_Login_Screen_Flow`) behind the login process and the related controller (`Subscriber_LoginFlowController.cls`) to the new org.

3. **Create a New Login Flow**:
   - Use the flow deployed in step 2 to create a new login flow in the subscriber org.

4. **Add a New Remote Site Setting**:
   - Add a new remote site setting in the subscriber org with the value:
     ```
     https://orgfarm-391f6ca95a-dev-ed.develop.my.salesforce-sites.com/usagemonitorsite/services/apexrest/api/usage/new
     ```
   - This allows the org to make callouts to the external API.

---

## Configuration Files

- **`sfdx-project.json`**: Defines the Salesforce DX project configuration.
- **`package.json`**: Contains project dependencies and scripts for linting, testing, and formatting.
- **`.prettierrc` and `.prettierignore`**: Configuration for Prettier code formatting.
- **`.eslintrc.json`**: Configuration for ESLint rules.

---

## Testing

- **Unit Tests**: Jest is used for testing LWC components. Example test file: `orgDetailCard/__tests__/orgDetailCard.test.js`.
- **Run Tests**:
  ```bash
  npm run test:unit
  ```

---

## Deployment

- **Scratch Org Setup**:
  - Use the `project-scratch-def.json` file to create a scratch org.
  - Run the following commands:
    ```bash
    sfdx force:org:create -f config/project-scratch-def.json -a AgentForceScratch
    sfdx force:source:push
    sfdx force:org:open
    ```

---

## Additional Notes

- **API Key Management**: The `UsageTrackingAPI` and `LoginFlowController` classes use a hardcoded API key. For better security, consider storing the key in Custom Metadata or Custom Settings.
- **Custom Object**: The `Connected_Org__c` custom object is used to store details about connected orgs.

-- EOD -- 