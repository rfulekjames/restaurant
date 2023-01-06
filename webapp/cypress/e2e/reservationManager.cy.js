/// <reference types="cypress" />

describe('table creation and update', () => {

  let user = {}

  beforeEach(() => {
    cy.visit('')
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

  it('create a reservation', () => {

    cy.get('#0_0_null_null').click()
    cy.get('#setTableButton').click()
    cy.get('#reservationManagerAnchor').click()
    cy.get('#0_0_1_4').click()
    cy.get('#customerNameInput').type('John Doe').should('have.value', 'John Doe')
    cy.get('#contactDetailsInput').type('tel: 110 123 12312').should('have.value', 'tel: 110 123 12312')
    cy.get('#addReservationButton').click();


    cy.get('#reservationReportingAnchor').click()
    cy.get('table').contains('td', 'John Doe')
    cy.get('table').contains('td', 'tel: 110 123 12312')
  })

})
