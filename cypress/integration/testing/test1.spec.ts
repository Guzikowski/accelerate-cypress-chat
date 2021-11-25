describe('My First Test', () => {
    it.skip('Does not do much!', () => {
      expect(true).to.equal(true)
    })

    it.skip('Visits the Kitchen Sink', () => {
        cy.visit('https://example.cypress.io')
      })

    it.only('Visits Slack', () => {
        // Login
        cy.visit('https://ptml.slack.com/')
        cy.get('#email').type('carmen.liao@ptml.com')
        cy.get('#password').type('passwordpassword123')
        cy.get('#signin_btn').click()
        // Wait and enter mfa manually
        cy.wait(20000)
        // Wait for slack main page to appear
        cy.get('.p-ia__sidebar_header__team_name_text').should('be.visible')
        

        // Lets Automate (Only took us 3 hours to get here!!!!!!)
        // click, on inception channel
        // cy.get('[data-qa=channel_sidebar_name_inception-project]').should('have.value', 'inception-project').click();
        // cy.get('[data-qa=channel_sidebar_name_inception-project]').scrollIntoView().should('be.visible').click();
        cy.get('[data-qa=channel_sidebar__section_heading_label__channels]').scrollIntoView().should('be.visible');
        
        cy.get('[data-qa=channel_sidebar_name_inception-project]').should('be.visible').click({force:true}); // Turn off actionability checks as this does some wierd scrolling stuff
        

        // Verify on the inception channel
        cy.get('.p-view_header__channel_title.p-view_header__truncated_text').should('be.visible') // multiple classes
        // cy.get('[data-qa="message_input"]').should('be.visible').contains(/^Message #inception-project$/)
        cy.get('[data-qa="message_input"]').should('be.visible')

        // Enter a message in the channel
        cy.get('[data-qa=message_input]').type('Test Message - Hello Mr Ed. Is it time for Brunch?')

        // //Verify what we have type appears as last received message
        cy.get("[data-qa='virtual-list-item']:last-of-type .c-message_kit__blocks").contains(/^Test Message - Hello Mr Ed. Is it time for Brunch?$/)
    })

  })


