describe('API – Commandes (orders)', () => {


   let token, users;

    // Avant tous les tests, on charge les utilisateurs depuis users.json et on récupère un token valide via login
    before(() => {
        cy.fixture('users.json').then(u => {
        users = u
        return cy.login(users.valid)
        }).then(resp => {
        expect(resp.status).to.eq(200)
        token = resp.body.token  // On stocke le token pour les requêtes authentifiées
        })
    })

     it('Echec : recuperer les commandes sans etre authentifies', () => {
        cy.request({
            url: '/orders',
            failOnStatusCode: false,
            }).then((resp) => {
            expect(resp.status).to.eq(401);
            expect(resp.body).to.have.property('code', 401);
            expect(resp.body).to.have.property('message', 'JWT Token not found');
        });
    })

    it('Succes : recuperer les commandes en etant authentifies', () => {
       cy.request({
            url: '/orders',
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
            }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.be.an('object');
            expect(resp.body).to.have.property('orderLines');
            expect(resp.body).to.have.property('orderLines').and.be.an('array');
        });  
    })

    
});