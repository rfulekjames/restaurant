/// <reference types="cypress" />

describe('registration and login', () => {

	let user = {}

	beforeEach(() => {
		cy.visit('')
	})


	it('successfull registration', () => {
		cy.fixture('user').then((userData) => {
			user = userData
			cy.webapp.makeUniqueUserEmail(user)
			cy.webapp.successfullRegistration(user)
		})
	})


	it('unsuccessfull registration', () => {

		cy.get('#registrationAnchor')
			.click()
		cy.get('#usernameInput')
			.type(user.username).should('have.value', user.username)
		cy.get('#emailInput')
			.type(user.email).should('have.value', user.email)
		cy.get('#passwordInput')
			.type(user.password).should('have.value', user.password)
		cy.get('#password2Input')
			.type(user.password).should('have.value', user.password)
		cy.get('#submitButton').click()

		cy.get('#dismissButton')
			.should('have.text', 'dismiss')
			.click()
	})


	it('unsuccessfull login action', () => {

		cy.get('#emailInput')
			.type(user.email).should('have.value', user.email)
		cy.get('#passwordInput')
			.type(user.password + '1').should('have.value', user.password + '1')
		cy.get('#loginButton').click()

		cy.get('#dismissButton')
			.should('have.text', 'dismiss')
			.click()

		cy.get('#emailInput')
			.type('a').should('have.value', user.email + 'a')
		cy.get('#passwordInput')
			.type('{backspace}').should('have.value', user.password)
		cy.get('#loginButton').click()
	})

	it('successfull login action', () => {

		cy.get('#emailInput')
			.type(user.email).should('have.value', user.email)
		cy.get('#passwordInput')
			.type(user.password).should('have.value', user.password)
		cy.get('#loginButton').click()

		cy.get('#usernameAnchor')
			.should('have.text', user.username)

		cy.get('#restaurantNameInput')
			.type(user.restaurantName).should('have.value', user.restaurantName)
		cy.get('#enterButton').click()

		cy.get('#restaurantNameAnchor')
			.contains(user.restaurantName)

	})
})
