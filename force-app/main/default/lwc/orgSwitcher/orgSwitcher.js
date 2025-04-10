import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import CONNECTED_ORG_OBJECT from '@salesforce/schema/Connected_Org__c';
import ORG_NAME_FIELD from '@salesforce/schema/Connected_Org__c.Name';
import ADMIN_USER_NAME_FIELD from '@salesforce/schema/Connected_Org__c.Admin_User_Name__c';
import ADMIN_USER_PASSWORD_FIELD from '@salesforce/schema/Connected_Org__c.Admin_User_Password__c';
import IS_ACTIVE_FIELD from '@salesforce/schema/Connected_Org__c.IsActive__c';
import APP_URL_FIELD from '@salesforce/schema/Connected_Org__c.App_URL__c';
import LOGIN_URL_FIELD from '@salesforce/schema/Connected_Org__c.Login_URL__c';
import CONNECTED_APP_ID_FIELD from '@salesforce/schema/Connected_Org__c.Connected_App_Id__c';
import LAST_LOGIN_TIME_FIELD from '@salesforce/schema/Connected_Org__c.Last_Login_Time__c';
import LAST_LOGIN_STATUS_FIELD from '@salesforce/schema/Connected_Org__c.Last_Login_Status__c';
import ORG_ICON_FIELD from '@salesforce/schema/Connected_Org__c.Org_Icon__c';
import IS_SSO_ENABLED from '@salesforce/schema/Connected_Org__c.SSO_Enabled__c';
import IDP_INITIATED_BASE_URL from '@salesforce/label/c.IdP_Initiated_Base_URL';

const FIELDS = [
    'Id',
    ORG_NAME_FIELD,
    ADMIN_USER_NAME_FIELD,
    ADMIN_USER_PASSWORD_FIELD,
    LOGIN_URL_FIELD,
    IS_ACTIVE_FIELD,
    IS_SSO_ENABLED,
    APP_URL_FIELD,
    CONNECTED_APP_ID_FIELD,
    LAST_LOGIN_TIME_FIELD,
    LAST_LOGIN_STATUS_FIELD,
    ORG_ICON_FIELD
];

export default class OrgSwitcher extends LightningElement {
    items = [];
    error;
    isLoading = true; // Spinner control

    @wire(getListUi, {
        objectApiName: CONNECTED_ORG_OBJECT,
        listViewApiName: 'All',
        fields: FIELDS,
        //filterBy: [{ fieldApiName: IS_ACTIVE_FIELD.fieldApiName, operator: 'equals', value: true }]
    })
    wiredConnectedOrgs({ error, data }) {
        try{
            console.log(`inside wiredConnectedOrgs => ${new Date().getMilliseconds()}`);
            console.log(`inside wiredConnectedOrgs lolu ${JSON.stringify(data)}`); //  => ${data}`);
            if (data) {
                console.log(`I am here`);
                this.items = data.records.records.map(record => ({
                    serialNumber: record.id,
                    id: record.id,
                    name: record.fields[ORG_NAME_FIELD.fieldApiName].value,
                    adminUserName: record.fields[ADMIN_USER_NAME_FIELD.fieldApiName].value,
                    adminUserPassword: record.fields[ADMIN_USER_PASSWORD_FIELD.fieldApiName].value,
                    loginUrl: record.fields[LOGIN_URL_FIELD.fieldApiName].value,
                    connectedAppId: IDP_INITIATED_BASE_URL + record.fields[CONNECTED_APP_ID_FIELD.fieldApiName].value,
                    appUrl: record.fields[APP_URL_FIELD.fieldApiName].value,
                    icon: record.fields[ORG_ICON_FIELD.fieldApiName].value,
                    isActive: (record.fields[IS_ACTIVE_FIELD.fieldApiName].value == true) ? 'Yes' : 'No',
                    isSSOEnabled: record.fields[IS_SSO_ENABLED.fieldApiName].value,
                    lastLoginTime: record.fields[LAST_LOGIN_TIME_FIELD.fieldApiName].value,
                    lastLoginTimeFormatted: this.formatLastLoginTime(record.fields[LAST_LOGIN_TIME_FIELD.fieldApiName].value ?? ''),
                    lastLoginStatus: record.fields[LAST_LOGIN_STATUS_FIELD.fieldApiName].value
                }));
                console.log(`I am here too =>${this.items.length}`);
                this.error = undefined;
            } 
            else if (error) {
                this.error = error;
                console.error('Error fetching connected orgs:', error);
            }
        }
        catch(error){
            console.log('Some error!' + error);
            console.log(error);
        }   
        this.isLoading = false; // Hide spinner after data is loaded
    }   

    formatLastLoginTime(lastLoginTime) {
        let formattedValue = 'Unavailable';
        try {
            if (lastLoginTime != '') {
                const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                formattedValue = new Date(lastLoginTime).toLocaleString('en-US', options);
            }
        } 
        catch (error) {
            console.error('Error formatting last login time:', error);
        }
        return formattedValue;
    }
}