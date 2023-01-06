/// <reference types="cypress" />


//the test might fail if performed around midnight or noon
//TODO: fix the test to be independent of the time of the day
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

  it('create, update and delete a reservation', () => {

    //create reservation
    cy.get('#0_0_null_null').click()
    cy.get('#setTableButton').click()
    cy.get('#reservationManagerAnchor').click()
    cy.get('#0_0_1_4').click()
    cy.get('#customerNameInput').type('John Doe').should('have.value', 'John Doe')
    cy.get('#contactDetailsInput').type('tel: 110 123 12312').should('have.value', 'tel: 110 123 12312')
    cy.get('#addReservationButton').click();


    cy.get('#reservationReportingAnchor').click()
    cy.get('table').contains('td', 'John Doe').should('exist')
    cy.get('table').contains('td', 'tel: 110 123 12312').should('exist')

    //update reservation
    cy.get('#reservationManagerAnchor').click()
    cy.get('#0_0_1_4').click()
    cy.get('#pastReservationsRadio').click()
    cy.get('#updateReservationButton1').click()
    cy.get('#customerNameInput').type(' Sr.').should('have.value', 'John Doe Sr.')
    cy.get('#addReservationButton').click();
    cy.get('#reservationReportingAnchor').click()
    cy.get('table').contains('td', 'John Doe Sr.').should('exist')

    //delete reservation
    cy.get('#reservationManagerAnchor').click()
    cy.get('#0_0_1_4').click()
    cy.get('#pastReservationsRadio').click()
    cy.get('#deleteReservationButton1').click()
    cy.get('#deleteReservationButton1').should('not.exist')

    cy.get('#reservationReportingAnchor').click()
    cy.get('table').contains('td', 'John Doe Sr.').should('not.exist')
  })


  it('more reservations', () => {

    //create reservation
    cy.get('#reservationManagerAnchor').click()
    cy.get('#0_0_1_4').click()
    cy.get('#customerNameInput').type('John Doe1').should('have.value', 'John Doe1')
    cy.get('#contactDetailsInput').type('tel: 110 123 12312').should('have.value', 'tel: 110 123 12312')
    cy.get('#addReservationButton').click()

    //create 2nd reservation for 2023-01-01 (would fail if today is 2023-01-01 which shouldn't happen
    //since we don't assume time travel)
    cy.get('#customerNameInput').type('John Doe2').should('have.value', 'John Doe2')
    cy.get('#contactDetailsInput').type('tel: 220 123 12312').should('have.value', 'tel: 220 123 12312')
    cy.get('#addReservationButton').click()
    cy.get('.alert').contains('The table is already reserved')
    cy.get('#dismissButton').should('have.text', 'dismiss').click()
    cy.get('#dateInput').type('2023-01-01').should('have.value', '2023-01-01')
    cy.get('#addReservationButton').click()

    cy.get('#reservationReportingAnchor').click()
    cy.get('table').contains('td', 'John Doe2').should('not.exist')
    cy.get('table').contains('td', 'John Doe1').should('exist')

    cy.get('#dateInput').type('2023-01-01').should('have.value', '2023-01-01')
    cy.get('table').contains('td', 'John Doe2').should('exist')
    cy.get('table').contains('td', 'John Doe1').should('not.exist')

    //create 3nd reservation for today but a different table (would fail if today is 2023-01-01 which shouldn't happen
    //since we don't assume time travel)
    cy.get('#tableLayouEditorAnchor').click()
    cy.get('#0_1_null_null').click()
    cy.get('#setTableButton').click()

    cy.get('#reservationManagerAnchor').click()
    cy.get('#0_1_2_4').click()
    cy.get('#customerNameInput').type('John Doe3').should('have.value', 'John Doe3')
    cy.get('#contactDetailsInput').type('tel: 330 123 12312').should('have.value', 'tel: 330 123 12312')
    cy.get('#addReservationButton').click()

    cy.get('#reservationReportingAnchor').click()
    cy.get('table').contains('td', 'John Doe1').should('exist')
    cy.get('table').contains('td', 'John Doe3').should('exist')
    cy.get('table').contains('td', 'John Doe3').siblings().contains('td', 'tel: 330 123 12312').should('exist')
    //Reservation for each Jon Don should be in a different table
    cy.get('table').contains('td', 'John Doe3')
      .parent()
      .parent()
      .contains('td', 'John Doe')
      .should('not.have.value', 'John Doe')


    //Add 3rd reservation for the same date and table
    cy.get('#reservationManagerAnchor').click()
    cy.get('#0_1_2_4').click()
    cy.get('#customerNameInput').type('John Doe4').should('have.value', 'John Doe4')
    cy.get('#contactDetailsInput').type('tel: 440 123 12312').should('have.value', 'tel: 440 123 12312')

    cy.get('#am').then(($input) => {
      //flip am to pm or vice-versa so that we don't have a time conflict
      if ($input.is(':selected')) {
        cy.get('#amPm').select('PM')
      } else {
        cy.get('#amPm').select('AM')
      }
      cy.get('#addReservationButton').click()

      //table should contain John Doe3 and John Doe4
      cy.get('#reservationReportingAnchor').click()
      cy.get('table').contains('td', 'John Doe3')
        .parent()
        .parent()
        .contains('td', 'John Doe4')
        .should('exist')

      //another table should contain only John Doe1
      cy.get('table').contains('td', 'John Doe1')
        .parent()
        .parent()
        .contains('td', 'John Doe3')
        .should('not.exist')
    })

    //finally delete the 1st table
    cy.get('#tableLayouEditorAnchor').click()
    cy.get('#0_0_1_4').click()
    cy.get('#deleteTableButton').click()

    cy.on('window:confirm', () => true);
    cy.get('#reservationReportingAnchor').click()

    cy.get('td').filter((_, elt) => elt.innerText === 'John Doe').should('have.length', 0)
  })

})
