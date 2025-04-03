import { LightningElement, api, track } from 'lwc';

const domain = 'https://orgfarm-391f6ca95a-dev-ed.develop.lightning.force.com';

export default class OrgDetailCard extends LightningElement {

    @api org;
    disabled = false;

    connectedCallback(){
        this.disabled = (this.org.isActive == 'No');
    }

    handleLoginWithSSO(e){
        window.open(this.org.appURL, '_blank');
    }

    openOrgLoginPage(e){
        window.open(this.org.loginUrl, '_blank');
    }

    editTheRecord(e){
        let recordId = this.org.id;
        
        console.log('Edit the record1=> ' + recordId);
        // Construct the edit page URL with dynamic recordId
        const editPageURL = `${domain}/lightning/r/Connected_Org__c/${recordId}/edit`;
        console.log('editPageURL=> ' + editPageURL);
        const backgroundContext = encodeURIComponent("/lightning/n/Org_Switcher");
        console.log('backgroundContext=> ' + backgroundContext);
        const finalURL = `${editPageURL}?count=1&backgroundContext=${backgroundContext}`;
        console.log('finalUrl==>' + finalURL);

        // Redirect to the constructed URL
        window.location.href = finalURL;
        // let url = domain 
        //             + `/${this.org.id}` 
        //             + '/edit?count=1&backgroundContext=/lightning/r/Connected_Org__c/' 
        //             + this.org.id 
        //             + '/view';
        //window.open(finalURL, '_blank');

        // let s = '/lightning/r/Connected_Org__c/' + a00gL0000017pbVQAQ + 
        // let m = '/edit?count=1&backgroundContext=%2Flightning%2Fr%2FConnected_Org__c%2Fa00gL0000017pbVQAQ%2Fview

    }
}