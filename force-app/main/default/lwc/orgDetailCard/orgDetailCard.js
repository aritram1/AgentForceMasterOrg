import { LightningElement, api, track } from 'lwc';

const domain = 'https://orgfarm-391f6ca95a-dev-ed.develop.lightning.force.com';

const idpInitiatedUrl = 'https://orgfarm-391f6ca95a-dev-ed.develop.my.salesforce.com/idp/login?app=';

export default class OrgDetailCard extends LightningElement {

    @api org;
    disabled = false;

    connectedCallback(){
        this.disabled = (this.org.isActive == 'No');
    }

    handleLoginWithSSO(e){
        window.open(idpInitiatedUrl + this.org.connectedAppId , '_blank');
    }

    openOrgLoginPage(e){
        let url = this.org.loginUrl + '?un=' + this.org.adminUserName;
        window.open(url , '_blank');
        //
    }

    handleMenuSelect(event) {
        const selected = event.detail.value;
        if (selected === 'login') {
            this.openOrgLoginPage(); // or pass org.loginUrl
        } 
        else if (selected === 'edit') {
            this.editTheRecord(); // or pass org.adminUserName
        }
        else if (selected === 'ssologin') {
            this.handleLoginWithSSO(); // or pass org.adminUserName
        }
    }

    editTheRecord(e){
        let recordId = this.org.id;
        console.log('Edit the record1=> ' + recordId);
        
        // Construct the edit page URL with dynamic recordId
        const editPageURL = domain + "/lightning/r/Connected_Org__c/" + recordId + "/edit";
        const backgroundContext = "/lightning/n/Org_Switcher";
        const finalURL = editPageURL + "?count=1&backgroundContext=" + encodeURIComponent(backgroundContext);

        // Redirect to the constructed URL
        window.location.href = finalURL;

    }
}