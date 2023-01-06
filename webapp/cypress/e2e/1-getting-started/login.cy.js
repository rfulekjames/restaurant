/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {

  let randomValue = 1
  let email = ''
  let password = ''
  let restaurantName = 'Pizzeria'
  let username = 'UserNo1'
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000')
  })

  it('successfull registration', () => {
  
    randomValue = Math.floor(Math.random() * 1000000)
    email = `dd${randomValue}@dd.sk`
    password = 'aaaaaaa'

    cy.get('#registrationAnchor')
      .click()
    cy.get('#usernameInput')
      .type(username).should('have.value', username)
    cy.get('#emailInput')
      .type(email).should('have.value', email)
    cy.get('#passwordInput')
      .type(password).should('have.value', password)
    cy.get('#password2Input')
      .type(password).should('have.value', password)
    cy.get('#submitButton').click()

    cy.get('#usernameAnchor')
      .should('have.text', username)

    cy.get('#restaurantNameInput')
      .type(restaurantName).should('have.value', restaurantName)
    cy.get('#enterButton').click()

    cy.get('#restaurantNameAnchor')
    .contains(restaurantName)
  })

  it('unsuccessfull registration', () => {

    cy.get('#registrationAnchor')
      .click()
    cy.get('#usernameInput')
      .type(username).should('have.value', username)
    cy.get('#emailInput')
      .type(email).should('have.value', email)
    cy.get('#passwordInput')
      .type(password).should('have.value', password)
    cy.get('#password2Input')
      .type(password).should('have.value', password)
    cy.get('#submitButton').click()

    cy.get('#dismissButton')
      .should('have.text', 'dismiss')
      .click()
  })


  it('unsuccessfull login action', () => {

    cy.get('#emailInput')
      .type(email).should('have.value', email)
    cy.get('#passwordInput')
      .type(password + '1').should('have.value', password + '1')
    cy.get('#loginButton').click()

    cy.get('#dismissButton')
      .should('have.text', 'dismiss')
      .click()

    cy.get('#emailInput')
      .type('a').should('have.value', email + 'a')
    cy.get('#passwordInput')
      .type('{backspace}').should('have.value', password)
    cy.get('#loginButton').click()
  })

  it('successfull login action', () => {

    cy.get('#emailInput')
      .type(email).should('have.value', email)
    cy.get('#passwordInput')
      .type(password).should('have.value', password)
    cy.get('#loginButton').click()

    cy.get('#usernameAnchor')
      .should('have.text', username)

    cy.get('#restaurantNameInput')
      .type(restaurantName).should('have.value', restaurantName)
    cy.get('#enterButton').click()

    cy.get('#restaurantNameAnchor')
     .contains(restaurantName)

  })
})
