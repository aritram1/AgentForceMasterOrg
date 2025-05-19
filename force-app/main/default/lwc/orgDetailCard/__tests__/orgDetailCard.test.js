import { createElement } from 'lwc';
import OrgDetailCard from 'c/orgDetailCard';

describe('c-org-detail-card', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-org-detail-card', {
            is: OrgDetailCard
        });
        element.org = {
            name: 'Test Org',
            loginUrl: 'https://test.salesforce.com',
            adminUserName: 'testuser@example.com',
            adminUserPassword: 'password123',
            isActive: true,
            isActiveText: 'Yes',
            isSSOEnabled: false,
            isSSOEnabledText: 'No',
            ipdInitiatedLoginUrl: 'https://sso.test.salesforce.com',
            lastLoginTime: '2023-10-26T12:00:00Z',
            lastLoginStatus: 'Success',
            icon: 'custom:custom18'
        };
        document.body.appendChild(element);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Verify that the component renders the lightning-card with the correct title', () => {
        const card = element.shadowRoot.querySelector('lightning-card');
        expect(card.title).toBe('Test Org');
    });

    it('Verify that the component renders the correct number of lightning-menu-item elements', () => {
        const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
        expect(menuItems.length).toBe(3);
    });

    it('Verify that the component renders the correct number of lightning-button-menu elements', () => {
        const buttonMenus = element.shadowRoot.querySelectorAll('lightning-button-menu');
        expect(buttonMenus.length).toBe(1);
    });

    it('Verify that the component renders the correct number of lightning-button elements', () => {
        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        expect(buttons.length).toBe(1);
    });

    it('Verify that the lightning-button element has the correct label', () => {
        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button.label).toBe('Edit');
    });

    it('Verify that the lightning-button element has the correct data-url attribute', () => {
        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button.dataset.url).toBe('testuser@example.com');
    });

    it('Verify that the lightning-button element has the correct variant', () => {
        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button.variant).toBe('brand');
    });

    it('Verify that the lightning-button element has the correct class', () => {
        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button.classList.contains('slds-var-m-right_xx-small')).toBe(true);
    });

    it('Verify that the lightning-button-menu element has the correct alternative-text attribute', () => {
        const buttonMenu = element.shadowRoot.querySelector('lightning-button-menu');
        expect(buttonMenu.alternativeText).toBe('More Actions');
    });

    it('Verify that the lightning-button-menu element has the correct icon-name attribute', () => {
        const buttonMenu = element.shadowRoot.querySelector('lightning-button-menu');
        expect(buttonMenu.iconName).toBe('utility:down');
    });

    it('Verify that the lightning-button-menu element has the correct menu-alignment attribute', () => {
        const buttonMenu = element.shadowRoot.querySelector('lightning-button-menu');
        expect(buttonMenu.menuAlignment).toBe('right');
    });

    it('Verify that the lightning-button-menu element has the correct variant', () => {
        const buttonMenu = element.shadowRoot.querySelector('lightning-button-menu');
        expect(buttonMenu.variant).toBe('border-filled');
    });

    it('Verify that the lightning-menu-item elements have the correct labels and values', () => {
        const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
        expect(menuItems[0].label).toBe('View');
        expect(menuItems[0].value).toBe('view');
        expect(menuItems[1].label).toBe('Login');
        expect(menuItems[1].value).toBe('login');
        expect(menuItems[2].label).toBe('Login with SSO');
        expect(menuItems[2].value).toBe('ssologin');
    });

    it('Verify that the lightning-menu-item elements have the correct labels and values when org is inactive', () => {
        element.org.isActive = false;
        element.org.isSSOEnabled = false;
        return Promise.resolve().then(() => {
            const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
            expect(menuItems[0].label).toBe('View');
            expect(menuItems[0].value).toBe('view');
            expect(menuItems[1].label).toBe('Login');
            expect(menuItems[1].value).toBe('login');
        });
    });

    it('Verify that the lightning-menu-item elements have the correct labels and values when org is SSO enabled', () => {
        element.org.isActive = true;
        element.org.isSSOEnabled = true;
        return Promise.resolve().then(() => {
            const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
            expect(menuItems[0].label).toBe('View');
            expect(menuItems[0].value).toBe('view');
            expect(menuItems[1].label).toBe('Login');
            expect(menuItems[1].value).toBe('login');
            expect(menuItems[2].label).toBe('Login with SSO');
            expect(menuItems[2].value).toBe('ssologin');
        });
    });

    it('Verify that the lightning-menu-item elements have the correct labels and values when org is inactive and SSO enabled', () => {
        element.org.isActive = false;
        element.org.isSSOEnabled = true;
        return Promise.resolve().then(() => {
            const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
            expect(menuItems[0].label).toBe('View');
            expect(menuItems[0].value).toBe('view');
            expect(menuItems[1].label).toBe('Login');
            expect(menuItems[1].value).toBe('login');
        });
    });

    it('Verify that the lightning-menu-item elements have the correct labels and values when org is active and SSO disabled', () => {
        element.org.isActive = true;
        element.org.isSSOEnabled = false;
        return Promise.resolve().then(() => {
            const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
            expect(menuItems[0].label).toBe('View');
            expect(menuItems[0].value).toBe('view');
            expect(menuItems[1].label).toBe('Login');
            expect(menuItems[1].value).toBe('login');
            expect(menuItems[2].label).toBe('Login with SSO');
            expect(menuItems[2].value).toBe('ssologin');
        });
    });

    it('Verify that the lightning-menu-item elements have the correct labels and values when org is inactive and SSO disabled', () => {
        element.org.isActive = false;
        element.org.isSSOEnabled = false;
        return Promise.resolve().then(() => {
            const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
            expect(menuItems[0].label).toBe('View');
            expect(menuItems[0].value).toBe('view');
            expect(menuItems[1].label).toBe('Login');
            expect(menuItems[1].value).toBe('login');
        });
    });

    it('Verify that the lightning-menu-item elements have the correct labels and values when org is active and SSO enabled', () => {
        element.org.isActive = true;
        element.org.isSSOEnabled = true;
        return Promise.resolve().then(() => {
            const menuItems = element.shadowRoot.querySelectorAll('lightning-menu-item');
            expect(menuItems[0].label).toBe('View');
            expect(menuItems[0].value).toBe('view');
            expect(menuItems[1].label).toBe('Login');
            expect(menuItems[1].value).toBe('login');
            expect(menuItems[2].label).toBe('Login with SSO');
            expect(menuItems[2].value).toBe('ssologin');
        });
    });
});