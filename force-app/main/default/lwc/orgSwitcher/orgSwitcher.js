import { LightningElement, wire, track } from 'lwc';
import getAvailableOrgs from '@salesforce/apex/OrgSwitcherController.getAvailableOrgs';

export default class OrgSwitcher extends LightningElement {
    items = [];
    error;
    isLoading; // Spinner control
    sortBy = 'Last_Login_Time__c'; // Default sort field
    filterBy = 'All'; // Default filter field
    
    filterOptions = [
        { label: 'All Orgs', value: 'All' },
        { label: 'Active Orgs', value: 'Active_Orgs' },
        { label: 'Inactive Orgs', value: 'Inactive_Orgs' },
        { label: 'SSO Enabled', value: 'SSO_Enabled' },
        { label: 'SSO Disabled', value: 'SSO_Disabled' },
    ];
    sortOptions = [
        { label: 'Last Login', value: 'Last_Login' },
        { label: 'Name', value: 'Name' }
    ];

    handleGetData() {
        this.isLoading = true; // Show spinner while loading
        getAvailableOrgs({ filterBy : this.filterBy, sortBy : this.sortBy })
        .then((data) => {
            this.items = data.map((record, index) => ({
                serialNumber: index + 1,
                id: record.Id,
                name: record.Name,
                adminUserName: record.Admin_User_Name__c,
                adminUserPassword: record.Admin_User_Password__c,
                loginUrl: record.Login_URL__c,
                connectedAppId: record.Connected_App_Id__c,
                ipdInitiatedLoginUrl: record.IdP_Initiated_Login_URL__c,
                icon: record.Org_Icon__c,
                isActive: record.IsActive__c,
                isActiveText: record.IsActive__c ? 'Yes' : 'No',
                isSSOEnabled: record.SSO_Enabled__c,
                isSSOEnabledText: record.SSO_Enabled__c ? 'Yes' : 'No',
                lastLoginTime: record.Last_Login_Time__c,
                lastLoginStatus: record.Last_Login_Status__c
            }));
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            console.error('Error fetching available orgs:', error);
        })
        .finally(() => {
            this.isLoading = false; // Hide spinner after data is loaded
        });
    }

    connectedCallback() {
        this.handleGetData();
    }

    handleFilterChange(e){
        this.filterBy = e.detail.value;
        console.log('this.filterBy => ', this.filterBy);
        this.handleGetData();
    }

    handleSortChange(e){
        this.sortBy = e.detail.value;
        console.log('this.sortBy => ', this.sortBy);
        this.handleGetData();
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////

// Old version

// import { LightningElement, wire } from 'lwc';
// import { getListUi } from 'lightning/uiListApi';
// import CONNECTED_ORG_OBJECT from '@salesforce/schema/Connected_Org__c';
// import ORG_NAME_FIELD from '@salesforce/schema/Connected_Org__c.Name';
// import ADMIN_USER_NAME_FIELD from '@salesforce/schema/Connected_Org__c.Admin_User_Name__c';
// import ADMIN_USER_PASSWORD_FIELD from '@salesforce/schema/Connected_Org__c.Admin_User_Password__c';
// import IS_ACTIVE_FIELD from '@salesforce/schema/Connected_Org__c.IsActive__c';
// import APP_URL_FIELD from '@salesforce/schema/Connected_Org__c.App_URL__c';
// import LOGIN_URL_FIELD from '@salesforce/schema/Connected_Org__c.Login_URL__c';
// import CONNECTED_APP_ID_FIELD from '@salesforce/schema/Connected_Org__c.Connected_App_Id__c';
// import LAST_LOGIN_DATE_FIELD from '@salesforce/schema/Connected_Org__c.Last_Login_Date__c';
// import LAST_LOGIN_STATUS_FIELD from '@salesforce/schema/Connected_Org__c.Last_Login_Status__c';
// import ORG_ICON_FIELD from '@salesforce/schema/Connected_Org__c.Org_Icon__c';
// import IDP_INITIATED_BASE_URL from '@salesforce/label/c.IdP_Initiated_Base_URL';
// import getAvailableOrgs from '@salesforce/apex/OrgSwitcherController.getAvailableOrgs';

// const FIELDS = [
//     'Id',
//     ORG_NAME_FIELD,
//     ADMIN_USER_NAME_FIELD,
//     ADMIN_USER_PASSWORD_FIELD,
//     LOGIN_URL_FIELD,
//     IS_ACTIVE_FIELD,
//     APP_URL_FIELD,
//     CONNECTED_APP_ID_FIELD,
//     LAST_LOGIN_DATE_FIELD,
//     LAST_LOGIN_STATUS_FIELD,
//     ORG_ICON_FIELD
// ];

// export default class OrgSwitcher extends LightningElement {
//     items = [];
//     error;
//     isLoading = true; // Spinner control

//     @wire(getListUi, {
//         objectApiName: CONNECTED_ORG_OBJECT,
//         listViewApiName: 'All',
//         fields: FIELDS,
//         filterBy: [{ fieldApiName: IS_ACTIVE_FIELD.fieldApiName, operator: 'equals', value: true }]
//     })
//     wiredConnectedOrgs({ error, data }) {
//         try{
//             console.log(`inside wiredConnectedOrgs => ${new Date().getMilliseconds()}`);
            
//             if (data) {
//                 this.items = data.records.records.map(record => ({
//                     serialNumber: record.id,
//                     id: record.id,
//                     name: record.fields[ORG_NAME_FIELD.fieldApiName].value,
//                     adminUserName: record.fields[ADMIN_USER_NAME_FIELD.fieldApiName].value,
//                     adminUserPassword: record.fields[ADMIN_USER_PASSWORD_FIELD.fieldApiName].value,
//                     loginUrl: record.fields[LOGIN_URL_FIELD.fieldApiName].value,
//                     connectedAppId: IDP_INITIATED_BASE_URL + record.fields[CONNECTED_APP_ID_FIELD.fieldApiName].value,
//                     appUrl: record.fields[APP_URL_FIELD.fieldApiName].value,
//                     icon: record.fields[ORG_ICON_FIELD.fieldApiName].value,
//                     isActive: (record.fields[IS_ACTIVE_FIELD.fieldApiName].value == true) ? 'Yes' : 'No',
//                     lastLoginDate: record.fields[LAST_LOGIN_DATE_FIELD.fieldApiName].value,
//                     lastLoginStatus: record.fields[LAST_LOGIN_STATUS_FIELD.fieldApiName].value
//                 }));
//                 this.error = undefined;
//             } else if (error) {
//                 this.error = error;
//                 console.error('Error fetching connected orgs:', error);
//             }
//         }
//         catch(error){
//             console.log(error);
//         }   
//         this.isLoading = false; // Hide spinner after data is loaded
//     }
// }