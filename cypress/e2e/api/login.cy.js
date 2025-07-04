describe('API – Authentification (Login)', () => {

  // Initilisation de l'objet users qui contient un tableau des utilisateurs
  let users

  // Avant tous les tests, on charge les données de test (emails et mots de passe) depuis le fixture users.json
  before(() => {
    cy.fixture('users.json').then(u => {
      users = u
    })
  })

  // Scénario de succès : lorsqu'on fournit des credentials valides,
  // l'API doit renvoyer un status HTTP 200 et un token d'authentification de type string
  it('Succès : login avec credentials valides renvoie 200 + token', () => {
    cy.login(users.valid).then(resp => {
      // On vérifie que le code HTTP est 200
      expect(resp.status).to.eq(200)
      // On vérifie que le corps de la réponse contient une propriété 'token' de type string
      expect(resp.body).to.have.property('token').and.be.a('string')
    })
  })

  // Scénario d'échec : mot de passe incorrect,
  // l'API doit renvoyer un status HTTP 401 (Unauthorized) et un message d'erreur
  it('Échec : mauvais mot de passe renvoie 401', () => {
    cy.login(users.invalid).then(resp => {
      expect(resp.status).to.eq(401)
      // On vérifie la présence d'un message d'erreur explicite
      expect(resp.body).to.have.property('message')
      expect(resp.body.message).to.contain('Invalid credentials')
    })
  })

  // Scénario d'échec : envoi d'un payload vide,
  // l'API doit renvoyer un status HTTP 400 (Bad Request)
  it('Échec : payload vide renvoie 400', () => {
    cy.login({}).then(resp => {
      expect(resp.status).to.eq(400)
    })
  })

  // Scénario d'échec : email manquant dans le payload,
  // l'API doit renvoyer un status HTTP 400
  it('Échec : email manquant renvoie 400', () => {
    cy.login({ password: users.valid.password }).then(resp => {
      expect(resp.status).to.eq(400)
    })
  })

  // Scénario d'échec : password manquant dans le payload,
  // l'API doit renvoyer un status HTTP 400
  it('Échec : password manquant renvoie 400', () => {
    cy.login({ email: users.valid.email }).then(resp => {
      expect(resp.status).to.eq(400)
    })
  })

  // Scénario de validation : format d'email invalide doit être rejeté
  // L'API peut renvoyer 400 (Bad Request) ou 422 (Unprocessable Entity)
  it('Échec : format email invalide renvoie 422 ou 400', () => {
    cy.login({ email: 'not-an-email', password: users.valid.password }).then(resp => {
      expect([400, 422]).to.include(resp.status)
    })
  })

  // Scénario de validation : types incorrects (non-string) pour email et password
  // L'API doit renvoyer 400 ou 422
  it('Échec : types non-string renvoient 400 ou 422', () => {
    cy.login({ email: 12345, password: true }).then(resp => {
      expect([400, 422]).to.include(resp.status)
    })
  })

  // Cas limite de sécurité : tentative d'injection SQL simple,
  // l'API doit rejeter avec un status HTTP 400
  it('Cas limite : injection SQL simple renvoie 400', () => {
    cy.login({ email: `"' OR '1'='1"`, password: 'anything' }).then(resp => {
      expect(resp.status).to.eq(400)
    })
  })

})
