import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';

export default class OrgDetails extends LightningElement {
    // Define recordId property to hold the contact record Id
    recordId;
    recordId1;
    showEdit;
    
    constructor(){
        super();
        this.recordId = '0038000000VVcJhAAL';
        this.recordId1 = '	01p1E0000015coEQAQ';
        this.showEdit = false;
    }

    // Wire method to get the contact record
    @wire(
        getRecord, 
        { 
            recordId: '$recordId', 
            fields: ['Contact.AccountId', 'Contact.FirstName', 'Contact.LastName', 'Contact.Email'] 
        }
    ) record;

    @wire(
        getRecord, 
        { 
            recordId: '$recordId1', 
            fields: ['ApexClass.Name', 'ApexClass.Status', 'ApexClass.LengthWithoutComments', 'ApexClass.Id'] 
        }
    ) record1;

    handleEdit(e){
        this.toggleView();
    }

    toggleView(){
        this.showEdit = !this.showEdit;
    }

    // Handler for form submission
    handleSubmit(event) {
        try{
            event.preventDefault(); // Prevent default form submission
            const fields = event.detail; // Extract fields data
            console.log(`Fields looks like : ${fields}`);
            if(!fields) return;
            updateRecord({ fields })
                .then(() => {
                    // Dispatch success toast message
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated successfully',
                            variant: 'success'
                        })
                    );
                    this.toggleView();
                })
                .catch(error => {
                    // Dispatch error toast message
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'An error occurred while updating the contact: ' + error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
            catch(e){
                console.log(`Error occurred : ${e}`);
            }
    }

    // Handler for successful form submission
    handleSuccess(event) {
        // No action needed here as form submission is handled in handleSubmit method
    }

    // Handler for error during form submission
    handleError(event) {
        // No action needed here as form submission is handled in handleSubmit method
    }
}