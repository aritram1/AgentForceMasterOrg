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

### 3. **Subscriber_LoginFlowController**
- **Description**: An Apex class designed to handle login flows for subscriber orgs and manage interactions with external APIs.
- **File**: `Subscriber_LoginFlowController.cls`
- **Key Features**:
  - Handles login flow logic for subscriber orgs.
  - Sends a POST request to an external API to track login events.
  - Validates responses from the external API and logs errors if any issues occur.
  - Provides utility methods to support login flow customization.

---

## Permission Sets

### **Org_Switcher_PS**
- **Description**: A permission set designed to provide access to the `OrgSwitcher` functionality.
- **File**: `Org_Switcher_PS.permissionset-meta.xml`
- **Key Features**:
  - Grants visibility to the `standard-SemanticModel` tab.
  - Ensures users assigned to this permission set can access the `OrgSwitcher` component.

---

## FlexiPage

### **Connected_Org_Lightning_Page**
- **Description**: A Lightning FlexiPage that displays connected org details using the `orgSwitcher` and `orgDetailCard` components.
- **File**: `Connected_Org_Lightning_Page.flexipage-meta.xml`

---

## Configuration Details

### How to Enable Source Org as IdP for SSO

1. **Enable the Identity Provider in the IdP Org**:
   - Navigate to:
     ```
     Setup > Identity > Identity Provider
     ```
   - Enable the Identity Provider.
   - Download the metadata file and the certificate file to use later.

2. **Create a Connected App for Each SSO-Enabled Org**:
   - A connected app needs to be built in the IdP org to enable secure communication and authentication. The connected app should have the following values:
     - **Enable SAML**: `true`
     - **Start URL**: `<idp domain>/idp/login?app=<connectedAppId>` (get this value from connected app > manage > IdP initiated URL)
     - **Entity ID** and **ACS URL**: `<target domain>` (the values should be same and must end with `my.salesforce.com`)
     - **Subject Type**: `<Federation Id>`
     - **IdP Certificate**: `<IdP Certificate>` (from the above step)
   - Assign the connected app to the System Administrator profile.

---

### How to Enable Target Org as SP for SSO

1. **Enable and configure the SSO Settings in the SP Org**:
   - Enable SAML settings by navigating ```Setup > Single Sign-On Settings > Turn on SAML```
   - Name it appropriately (e.g. "AgentForce Main Org")
   - Navigate to: ```Upload the Metadata File``` and ```Upload the Certificate``` to upload the metadata file and the certificate received from the IdP org.

2. **Verify SSO Configuration**:
   - Ensure that the SSO settings are correctly configured in the SP org.
   - Test the SSO login to confirm the setup.

---

### What to Do When Adding a New SP Org

To add a new SP org to the system, follow these steps:

#### In the IdP Org:
1. **Create a Connected App for the New SP Org**:
   - Follow the same steps as outlined in the "How to Enable Source Org as IdP for SSO" section.
   - Use the new SP org's domain as the **Entity ID** and **ACS URL**.

#### In the New SP Org:
1. **Enable and configure the SSO Settings in the SP Org**:
   - Enable SAML settings by navigating ```Setup > Single Sign-On Settings > Turn on SAML```
   - Create one SAML config (name it appropriately e.g. "AgentForce Main Org")
   - Navigate to: ```Upload the Metadata File``` and ```Upload the Certificate``` to upload the metadata file and the certificate received from the IdP org.

2. **Deploy the components in `subscriber_pkg.xml`**:
   - the following components require to be in the subscriber org to facilitate usage tracking
   -- main login flow (`Custom_Login_Screen_Flow`) behind the login process and 
   -- the related controller (`Subscriber_LoginFlowController.cls`) to the new SP org.
   -- the remote site (https://agentforcemainorg-391f6ca95a-dev-ed.develop.my.salesforce-sites.com/usagemonitorsite/services/apexrest/api/usage/new)
   -- custom labels for domain and idp url

3. **Create a New Login Flow**:
   - Visit Set up > Login > Login Flow to create a login flow with the flow deployed in step 2 above.
   - Ensure naming it appropriately e.g. "Login To Salesforce"

4. **Enable User for SSO**:
   - Set the federation Id same for both the orgs so users can use SSO.

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
- Org List
   Type    Alias               Username                          Org ID             Status    Expires    
 ─ ─────── ─────────────────── ───────────────────────────────── ────────────────── ───────── ────────── 
   DevHub  aritram1            aritram1@gmail.com                00D80000000L1emEAC Connected            
   DevHub  Aritram1DevhubOrg   aritram1@gmail.com.devhub         00DdL00000ESvAMUA1 Connected            
           3DaysAppOrg         aritram2@agentforce.com           00DgK0000008aifUAA Connected            
           adminUtilOrg        aritram1@gmail.com.au             00DdM00000JAqqPUAT Connected            
           AgentForceOrg3      aritram3@agentforce.com           00DgL000000d5ZSUAY Connected            
           AgentforceOrg4      aritram4@agentforce.com           00DgL000000nMfKUAU Connected            
           AgentforceOrg5      aritram5@agentforce.com           00DgK000000qUR8UAM Connected            
           expenso_c19a523a71  expenso@expenso.com               00DgL000002NMhpUAG Connected            
           FiNest              aritram1@gmail.com.expenso        00DQy00000EdJp8MAF Connected            
           finplan-managed     aritram1@gmail.com.financeplanner 00D5i00000CIhxbEAD Connected            
           InterviewAppOrg     aritram1@agentforce.com.iview     00DgK000000gHHNUA2 Connected            
           IoT Org             aritram1@gmail.com.iot            00D5g000002uhdlEAA Connected            
           LWCRecipesOrg       aritram1@gmail.com.lwc            00D2w00000Bc84REAR Connected            
           mainorgagentfoprce  aritram1@agentforce.com           00DgL000000nCQAUA2 Connected            

Legend:  🌳=Default DevHub, 🍁=Default Org 

-- EOD --