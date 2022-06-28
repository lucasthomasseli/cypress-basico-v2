/// <reference types="Cypress" />

Cypress._.times(5, function() {
    describe('Politica de Privacidade CAC-TAT', function() {
        beforeEach(function() {
            cy.visit('./src/privacy.html')
        })
    
        it('Validando página de Política de Privacidade', function() {
            cy.contains('Talking About Testing').should('be.visible')
        })
    })
})