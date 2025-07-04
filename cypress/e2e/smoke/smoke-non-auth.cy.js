describe('Smoke Tests Non Connecté – Eco Bliss Bath V2', () => {
    
  it('Accueil : la page d\'accueil se charge sans erreur', () => {
    cy.visit('http://localhost:4200/#/');
    // Vérifier le titre de la page et la présence du header principal
    cy.title().should('include', 'EcoBlissBath');
  });

   it('Connexion : verifier l\'existance du boutton connexion et inscription', () => {
    cy.visit('http://localhost:4200/#/');
    cy.get('[data-cy="nav-link-login"]').should('exist').should('be.visible');
     cy.get('[data-cy="nav-link-register"]').should('exist').should('be.visible');

   });


  it('Connexion : vérifier la page de login', () => {
    cy.visit('http://localhost:4200/#/login');


    // Le formulaire doit exister
    cy.get('[data-cy="login-form"]').should('exist');

    // Les champs email et password doivent avoir le bon type 
    cy.get('[data-cy="login-input-username"]').should('have.attr', 'type', 'text');
    cy.get('[data-cy="login-input-password"]').should('have.attr', 'type', 'password');
    cy.get('[data-cy="login-submit"]').should('exist');
  });

});
