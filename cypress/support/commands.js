// Commande "login" qui retourne le token (ou échoue si status≠200)
Cypress.Commands.add('login', (credentials) => {
  return cy.request({
    method: 'POST',
    url: '/login',
    baseUrl: Cypress.config('baseUrl'),
    body: credentials,
    failOnStatusCode: false
  })
})

Cypress.Commands.add('loginPage', (user) => {
  cy.visit('http://localhost:4200/#/login');
  cy.get('[data-cy=login-input-username]').type(user.username);
  cy.get('[data-cy=login-input-password]').type(user.password);
  cy.get('[data-cy=login-submit]').click();
  cy.get('[data-cy="nav-link-logout"]').should('be.visible');
})