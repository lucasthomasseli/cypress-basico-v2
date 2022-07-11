/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    
    const threems = 3000

    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', function() {
        cy.clock()

        cy.get('#firstName').type('Walmyr')
        cy.get('#lastName').type('Filho')
        cy.get('#email').type('walmyr.filho@hotmail.com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
        
        cy.get('.success').should('be.visible') // Verifica se a mensagem de sucesso está aparecendo.

        cy.tick(threems)

        cy.get('.success').should('not.be.visible')
    })

    it('Exibir mensagem de erro ao não preencher campos obrigatórios', function() {
        cy.clock()
        
        cy.contains('button', 'Enviar').click()  
        cy.get('.error').should('be.visible')

        cy.tick(threems)

        cy.get('.error').should('not.be.visible')
    })

    it('Envia o formulário com sucesso usando um comando customizado', function() {
        cy.clock()
        
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(threems)

        cy.get('.success').should('not.be.visible')
    })

    Cypress._.times(5, function() {
        it('Selecionar o Produto (Youtube) pelo texto', function() {
            cy.get('#product')
              .select('YouTube') //Texto
              .should('have.value', 'youtube')
    
        })
    })

    it('Selecionar o Produto (Mentoria) por seu valor', function() {
        cy.get('#product')
            .select('mentoria') //Valor
            .should('have.value', 'mentoria')

    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
            .select(1) //Índice
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('[type="radio"]')
            .should('have.length', 3)
            .each(function($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            /*
            Neste trecho do código, ele selecionou todas as opções
            seguidamente e checou de todas foram realmente selecionadas.
            */
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last().uncheck()
            .should('not.be.checked')
            /*
            Primeiro marcou todos os checkboxes,
            depois desmarcou apenas o último e checa de 
            se o último realmente está desmarcado.
            */
    })

    it('selecione um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
            /*
            Explicação na Seção 7 - Aula 29.
            */
        }) 
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
            /*
            Explicação na Seção 7 - Aula 30.
            */
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
                /*
                Explicação na Seção 7 - Aula 31.
                */
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
        /*
        Explicação na Seção 8 - Aula 33.
        */
    })

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', function() {
        cy.get('#privacy a')
          .invoke('removeAttr', 'target')
          .click()

        cy.contains('Talking About Testing').should('be.visible')
        /*
        Explicação na Seção 8 - Aula 34.
        */
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function() {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')

        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios')
          .invoke('hide')
          .should('not.be.visible')
          /*
          Explicação desse test case na "Seção 12 - Aula 50".
          */
    })

    it('preenche a area de texto usando o comando invoke', function() {
        const longText = Cypress._.repeat('012345679', 20) /* Repete 20 vezes os caracteres do primeiro argumento */
        
        cy.get('#open-text-area')
          /*.type(longText, { delay: 0 })*/
          .invoke('val', longText)
          .should('have.value', longText)
        /*
        Explicação na "Seção 12 - Aula 52"
        */
    })

    it('faz uma requisição HTTP na aplicação do CAC TAT', function() {
        
        //PRIMEIRA FORMA DE ESCREVER O TESTE:
        cy.request({
            method: 'GET',
            url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        }).then(function(response) {
            const { status, statusText, body } = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).contain('CAC TAT')
        })
        
        /*
        //SEGUNDA FORMA DE ESCREVER O TESTE:
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
          .should(function(response) {
            const { status, statusText, body } = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
          })  
        */

        /*
        Explicação na Seção 12 - Aula 54
        */
    })
  })