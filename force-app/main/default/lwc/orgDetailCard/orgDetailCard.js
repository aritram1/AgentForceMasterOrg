import { LightningElement, api, track } from 'lwc';
import DOMAIN_BASE_URL from '@salesforce/label/c.Domain_Base_URL';
import IDP_INITIATED_BASE_URL from '@salesforce/label/c.IdP_Initiated_Base_URL';

export default class OrgDetailCard extends LightningElement {

    @api org;
    disabled = false;
    
    connectedCallback(){
        this.disabled = (this.org.isActive == 'No');
        // this.org.isSSOEnabled = (this.org.isSSOEnabled == true) ? 'Yes' : 'No' ;
    }


    handleMenuSelect(event) {
        const selected = event.detail.value;
        if (selected === 'login') {
            this.openOrgLoginPage();
        } 
        else if (selected === 'edit') {
            this.editTheRecord();
        }
        else if (selected === 'ssologin') {
            this.handleLoginWithSSO();
        }
        else if (selected === 'view') {
            this.viewTheRecord();
        }
    }

    handleLoginWithSSO(e){
        window.open(this.org.ipdInitiatedLoginUrl, '_blank');
    }

    openOrgLoginPage(e){
        let url = this.org.loginUrl + '?un=' + this.org.adminUserName;
        window.open(url , '_blank');
    }

    editTheRecord(e){
        let recordId = this.org.id;
        console.log('Edit the record1=> ' + recordId);
        
        // Construct the edit page URL with dynamic recordId
        const editPageURL = DOMAIN_BASE_URL + "/lightning/r/Connected_Org__c/" + recordId + "/edit";
        const backgroundContext = "/lightning/n/Org_Switcher";
        const finalURL = editPageURL + "?count=1&backgroundContext=" + encodeURIComponent(backgroundContext);

        // Redirect to the constructed URL
        window.location.href = finalURL;

    }

    viewTheRecord(e){
        let recordId = this.org.id;        
        // Construct the view page URL and Open
        const viewPageURL = DOMAIN_BASE_URL + '/lightning/r/Connected_Org__c/' + recordId + '/view';
        window.open(viewPageURL , '_blank');
    }
}