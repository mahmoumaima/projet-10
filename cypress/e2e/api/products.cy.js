describe('API – Produits (products)', () => {


   let token, users, actualQuantity, availableId, outOfStockId;

    // Avant tous les tests, on charge les utilisateurs depuis users.json et on récupère un token valide via login
    before(() => {
        cy.fixture('users.json').then(u => {
        users = u
        return cy.login(users.valid)
        }).then(resp => {
        expect(resp.status).to.eq(200)
        token = resp.body.token  // On stocke le token pour les requêtes authentifiées
        })

        // On recupère deux produits, un dont le availableStock > 0 et l'autre availableStock <=0
         cy.request({
            method: 'GET',
            url: '/products',
            }).its('body').then(products => {
            availableId    = products.find(p => p.availableStock > 0)?.id ?? products[0].id
            outOfStockId   = products.find(p => p.availableStock === 0)?.id ?? -1
        })
    })

    // dispo manuellement

    it('Succes : recuperer les commandes en etant authentifies', () => {
       cy.request({
            url: '/products/6',
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
            }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.be.an('object');
            expect(resp.body).to.have.property('name', 'Dans la forêt');
            expect(resp.body).to.have.property('aromas', 'Bois de santal');
            expect(resp.body).to.have.property('price', 24);
            expect(resp.body).to.have.property('varieties', 9);
            actualQuantity = resp.body.availableStock;
        });  
    })

     it('Produit disponible → 200', () => {
        cy.request({
            method: 'PUT',
            url: '/orders/add',
            headers: { Authorization: `Bearer ${token}` },
            body: { product: 6, quantity: 1 },
            failOnStatusCode: false
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            cy.request({
                url: '/products/6',
                headers: { Authorization: `Bearer ${token}` },
                failOnStatusCode: false,
                }).then((resp) => {
                expect(resp.status).to.eq(200);
                expect(resp.body.availableStock).to.eq(actualQuantity - 1);
            }); 
        });  
    })

      // npon dispo manuellement
    it('Produit repture de stock → 400', () => {
        cy.request({
            method: 'PUT',
            url: '/orders/add',
            headers: { Authorization: `Bearer ${token}` },
            body: { product: 3, quantity: 1 },
            failOnStatusCode: false
        }).then((resp) => {
            expect(resp.status).to.eq(400);
        });  
    })


    // dispo auto
    it('Succes : recuperer les commandes en etant authentifies avec un ID récupéré automatiquement', () => {
       cy.request({
            url: '/products/' + availableId,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
            }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.be.an('object');
            expect(resp.body).to.have.property('name', 'Dans la forêt');
            expect(resp.body).to.have.property('aromas', 'Bois de santal');
            expect(resp.body).to.have.property('price', 24);
            expect(resp.body).to.have.property('varieties', 9);
            actualQuantity = resp.body.availableStock;
        });  
    })

     it('Produit disponible → 200 avec un ID récupéré automatiquement', () => {
        cy.request({
            method: 'PUT',
            url: '/orders/add',
            headers: { Authorization: `Bearer ${token}` },
            body: { product: availableId, quantity: 1 },
            failOnStatusCode: false
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            cy.request({
                url: '/products/' + availableId,
                headers: { Authorization: `Bearer ${token}` },
                failOnStatusCode: false,
                }).then((resp) => {
                expect(resp.status).to.eq(200);
                expect(resp.body.availableStock).to.eq(actualQuantity - 1);
            }); 
        });  
    })

    // non dispo aut
    it('Produit repture de stock → 400 avec un ID récupéré automatiquement', () => {
        cy.request({
            method: 'PUT',
            url: '/orders/add',
            headers: { Authorization: `Bearer ${token}` },
            body: { product: outOfStockId, quantity: 1 },
            failOnStatusCode: false
        }).then((resp) => {
            expect(resp.status).to.eq(400);
        });  
    })

});