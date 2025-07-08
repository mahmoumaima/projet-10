describe('API – Avis (reviews)', () => {
  let users, token

  // Avant tous les tests: on charge les utilisateurs et on récupère un token valide
  before(() => {
    cy.fixture('users.json').then(u => {
      users = u
      return cy.login(users.valid)
    }).then(resp => {
      expect(resp.status).to.eq(200)
      token = resp.body.token  // Stocke le token pour les requêtes authentifiées
    })
  })

  it('POST /reviews XSS dans comment → rejet ou sanitization', () => {
    cy.request({
      method: 'POST',
      url: '/reviews',
      headers: { Authorization: `Bearer ${token}` },
      body: { title: 'XSS', comment: '<script>alert(1)</script>', rating: 1 },
      failOnStatusCode: false
    }).then(resp => {
      expect([400, 200]).to.include(resp.status)
      if (resp.status === 200) {
        expect(resp.body.comment).not.to.contain('<script>')
      }
    })
  })

})
