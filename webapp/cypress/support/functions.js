
cy.webapp = {
	makeUniqueUserEmail: (user) => {
		let randomValue = Math.floor(Math.random() * 1000000000)
		user.email = `test.${randomValue}${user.email}`
	},
	successfullRegistration: (user) => {
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

		cy.get('#usernameAnchor')
			.should('have.text', user.username)

		cy.get('#restaurantNameInput')
			.type(user.restaurantName).should('have.value', user.restaurantName)
		cy.get('#enterButton').click()

		cy.get('#restaurantNameAnchor')
			.contains(user.restaurantName)
	},
	successfullLoginAndEnterRestaurant: (user) => {
		cy.get('#emailInput').type(user.email)
		cy.get('#passwordInput').type(user.password)
		cy.get('#loginButton').click()
		cy.get('#restaurantNameInput').type(user.restaurantName)
		cy.get('#enterButton').click()
	},
}

