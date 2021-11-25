import * as faker from "faker";

const login = (username, password) => {
  cy.visit(`${Cypress.env("baseUrl")}`);
  cy.get("#email").type(Cypress.env("username"));
  cy.get("#password").type(Cypress.env("password"));
  cy.get("#signin_btn").click();
  // Wait and enter mfa manually
  cy.wait(20000);
  // Wait for slack main page to appear
  cy.get(".p-ia__sidebar_header__team_name_text").should("be.visible");
};

describe("My First Test", () => {
  it.skip("Does not do much!", () => {
    expect(true).to.equal(true);
  });

  it.skip("Visits the Kitchen Sink", () => {
    cy.visit("https://example.cypress.io");
  });

  it.only("Visits Slack", () => {
    // Login
    login("simon.crook@ptml.com", "XXXXXXXXXX");

    // Lets Automate (Only took us 3 hours to get here!!!!!!)
    // click, on inception channel
    // cy.get('[data-qa=channel_sidebar_name_inception-project]').should('have.value', 'inception-project').click();
    // cy.get('[data-qa=channel_sidebar_name_inception-project]').scrollIntoView().should('be.visible').click();
    cy.get("[data-qa=channel_sidebar__section_heading_label__channels]")
      .scrollIntoView()
      .should("be.visible");

    cy.get("[data-qa=channel_sidebar_name_inception-project]")
      .should("be.visible")
      .click({ force: true }); // Turn off actionability checks as this does some wierd scrolling stuff

    // Verify on the inception channel
    cy.get(
      ".p-view_header__channel_title.p-view_header__truncated_text"
    ).should("be.visible"); // multiple classes
    // cy.get('[data-qa="message_input"]').should('be.visible').contains(/^Message #inception-project$/)
    cy.get('[data-qa="message_input"]').should("be.visible");

    let a =
      "Test Message - Hello Mr Ed. Is it time for Brunch? " +
      faker.lorem.words(10);

    // Enter a message in the channel
    cy.get("[data-qa=message_input]").clear().type(a);
    cy.get('[data-qa="texty_send_button"]').click();
    // //Verify what we have type appears as last received message. This is a bad selector

    cy.wait(100);
    cy.get(".p-rich_text_section").contains(a);
    cy.get(".p-rich_text_section").contains(a).click({ force: true });
    cy.get(".p-rich_text_section").contains(a).focus();
    cy.pause();
    // log out
    cy.get("[data-qa='user-button']").click();
    cy.get(".c-menu_item__label")
      .contains("Sign out of PartsTrader Markets")
      .click();

    cy.get(".p-refreshed_page__heading").should("be.visible");
    login("carmen.liao@ptml.com", "XXXXXXXXX");

    // Go to the channel
    cy.get("[data-qa=channel_sidebar__section_heading_label__channels]")
      .scrollIntoView()
      .should("be.visible");

    cy.get("[data-qa=channel_sidebar_name_inception-project]")
      .should("be.visible")
      .click({ force: true }); // Turn off actionability checks as this does some wierd scrolling stuff

    // Verify on the inception channel
    cy.get(
      ".p-view_header__channel_title.p-view_header__truncated_text"
    ).should("be.visible"); // multiple classe

    cy.get(".p-rich_text_section").contains(a).trigger("mouseover");
    // Hover
    // c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_small c-message_actions__button
  });
});
