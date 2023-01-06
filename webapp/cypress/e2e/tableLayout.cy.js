/// <reference types="cypress" />

describe('table creation and update', () => {

	let user = {}

	beforeEach(() => {
		cy.visit('http://localhost:3000')
		if (user.username) {
			cy.webapp.successfullLoginAndEnterRestaurant(user)
		}
	})

	it('successfull registration', () => {

		cy.fixture('user').then((userData) => {
			user = userData
			cy.webapp.makeUniqueUserEmail(user)
			cy.webapp.successfullRegistration(user)
		})
	})

	it('cannot access reservation manager and reporting yet', () => {

		cy.get('#reservationManagerAnchor').click();

		cy.on('window:alert', (alertText) => {
			expect(alertText).to.contains('let alone');
		})
		cy.get('#reservationReportingAnchor').click();

		cy.on('window:alert', (alertText) => {
			expect(alertText).to.contains('let alone');
		})
	})

	it('table creation and drag and drop', () => {

		const dataTransfer = new DataTransfer();
		cy.get('#0_0_null_null').click();
		cy.get('#setTableButton').click();
		cy.get('#0_0_1_4').trigger('dragstart', {
			dataTransfer
		});
		cy.get('#1_1').trigger('drop', {
			dataTransfer
		});
	})

	it('table deletion', () => {

		cy.get('#1_1_1_4').click();
		cy.get('#deleteTableButton').click();

		cy.on('window:confirm', () => true);
		cy.get('#reservationManagerAnchor').click();

		cy.on('window:alert', (alertText) => {
			expect(alertText).to.contains('let alone');
		})
	})

})
