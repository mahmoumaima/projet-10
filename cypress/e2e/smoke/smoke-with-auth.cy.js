describe('Smoke Tests Connecté – Eco Bliss Bath V2', () => {
    
    beforeEach(() => {
        // Charger les fixtures utilisateurs
        cy.fixture('users.json').then(users => {
        // Utiliser la commande custom cy.login s'authentifier
        cy.loginPage(users.valid);
        });
    });

    it('Connexion : verifier l\'existance du boutton deconnexion et panier', () => {
    cy.visit('http://localhost:4200/#/');

    cy.get('[data-cy="nav-link-logout"]').should('exist').should('be.visible');
    cy.get('[data-cy="nav-link-cart"]').should('exist').should('be.visible');

    cy.get('[data-cy="nav-link-login"]').should('not.exist');
    cy.get('[data-cy="nav-link-register"]').should('not.exist');

    cy.get('[data-cy="nav-link-logout"]').click();``
    
    cy.get('[data-cy="nav-link-logout"]').should('not.exist');
    cy.get('[data-cy="nav-link-cart"]').should('not.exist');

    cy.get('[data-cy="nav-link-login"]').should('exist').should('be.visible');
    cy.get('[data-cy="nav-link-register"]').should('exist').should('be.visible');




   });


});
