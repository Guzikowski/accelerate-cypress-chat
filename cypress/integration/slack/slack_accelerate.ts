import { first, isElement } from "cypress/types/lodash";
import * as faker from "faker";

// Some cy.* commands perform actionability - see https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Actionability

// Selectors
const emailInputSelector = "#email";
const passwordInputSelector = "#password";
const signinButtonSelector = "#signin_btn";
const mfaInputTokenSelector = ".two_factor_input_item";
const teamNameHeaderSelector = ".p-ia__sidebar_header__team_name_text";
const labelSelector = (label: string): string => `[aria-label='${label}']`;
const channelSelector = (channel: string): string =>
  `[data-qa=channel_sidebar_name_${channel}]`;
const userSelector = "[data-qa='user-button']";
const userMenuSelector = ".c-menu_item__label";
const signedOutSelector = '[data-qa="signin_button"]';
const messageTextAreaSelector =
  '[data-qa="message_input"][data-message-input="true"]';
const sendMessageButtonSelector = '[data-qa="texty_send_button"]';
const channelTitleSelector =
  ".p-view_header__channel_title.p-view_header__truncated_text";
const textSectionPreviousMessage = ".p-rich_text_section";

// Environment Constants
const userName1: string = Cypress.env("userName1");
const password1: string = Cypress.env("password1");
const otp1: string = Cypress.env("otp1");
const userName2: string = Cypress.env("userName2");
const password2: string = Cypress.env("password2");
const otp2: string = Cypress.env("otp2");

// String Constants
const uniqueTestMessage = `Test Message: ${faker.lorem.words(10)}`;
const signOutMessage = "Sign out of PartsTrader Markets";
const lastChannelName = "Recent Apps";

const LoginUsingMFA = (username: string, password: string, otp: string) => {
  cy.on("window:confirm", (txt) => {
    // Alert confirm pop-up that we dismiss
    expect(txt).to.contains("Open Slack?");
    return false; // equivalent of click cancel
  });
  cy.visit(Cypress.env("baseUrl"));
  cy.get(emailInputSelector).type(username); // performs actionability
  cy.get(passwordInputSelector).type(password, { log: false });
  cy.get(signinButtonSelector).click();
  cy.task("generateOTP", otp).then((token: string) => {
    cy.get(mfaInputTokenSelector)
      .should("be.visible")
      .first()
      .type(token, { log: false });
    cy.get(teamNameHeaderSelector).should("be.visible").contains(/^Part/); // PartsTrader (sometimes gets shortened to Parts... depending on Width)
  });
  cy.get(messageTextAreaSelector).should("be.visible");
  cy.get(userSelector).should("be.visible");
  cy.get(labelSelector(lastChannelName));
};

const Logout = () => {
  cy.get(userSelector).click();
  cy.get(userMenuSelector).contains(signOutMessage).click();
  cy.get(signedOutSelector).should("be.visible").contains("Sign in");
};

const ScrollToChannel = (label: string, channel: string) => {
  cy.get(labelSelector(label))
    .invoke("attr", "aria-expanded")
    .then((el) => {
      if (el === "false") {
        cy.log("Previously collapsed");
        cy.get(labelSelector(label))
          .scrollIntoView({
            offset: { top: -200, left: 0 }, // Scrolls up, forcing the element 'down'
          })
          .contains(label)
          .click({ scrollBehavior: false });
      } else {
        cy.log("Previously expanded");
        cy.get(labelSelector(label)).scrollIntoView({
          offset: { top: -100, left: 0 }, // Scrolls up, forcing the element 'down'
        });
      }
    })
    .should("be.visible");
  cy.get(channelSelector(channel))
    .should("be.visible")
    .click({ scrollBehavior: false }); // Turn off actionability checks as this does some wierd scrolling stuff

  // Verify on the inception channel
  cy.get(channelTitleSelector).should("be.visible").contains(channel); // multiple classes
};

const SendTextMessage = (message: string) => {
  cy.get(messageTextAreaSelector).should("be.visible").clear().type(message);
  cy.get(sendMessageButtonSelector).click();
};

const CheckTextMessagePreviouslySent = (message: string) => {
  cy.get(textSectionPreviousMessage).should("be.visible").contains(message);
};

//
// Lets Automate (Only took us 3 hours to get here!!!!!!)
//

describe("Slack Test's", () => {
  it.only("Scenario 1", () => {
    // Login
    LoginUsingMFA(userName1, password1, otp1);

    // Check if Channels Exists, is expanded then scroll into view, else click on it and scroll into view

    ScrollToChannel("Channels", "inception-project");
    // cy.get('[data-qa="message_input"]').should('be.visible').contains(/^Message #inception-project$/)

    // Enter a message in the channel
    SendTextMessage(uniqueTestMessage);

    // //Verify what we have type appears as last received message. This is a bad selector
    CheckTextMessagePreviouslySent(uniqueTestMessage);

    // Trying to get the hover over icons - not working
    // cy.get(".p-rich_text_section").contains(testMessage).click({ force: true });
    // cy.get(".p-rich_text_section").contains(testMessage).focus();
    // cy.pause();
    // // log out
    Logout();

    // mfaLogin(userName2, password2, otp2);

    // // Go to the channel
    // cy.get("[data-qa=channel_sidebar__section_heading_label__channels]")
    //   .scrollIntoView()
    //   .should("be.visible");

    // cy.get("[data-qa=channel_sidebar_name_inception-project]")
    //   .should("be.visible")
    //   .click({ force: true }); // Turn off actionability checks as this does some wierd scrolling stuff

    // // Verify on the inception channel
    // cy.get(
    //   ".p-view_header__channel_title.p-view_header__truncated_text"
    // ).should("be.visible"); // multiple classe

    // cy.get(".p-rich_text_section").contains(testMessage).trigger("mouseover");
    // // Hover
    // // c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_small c-message_actions__button
    // Logout();
  });
});
