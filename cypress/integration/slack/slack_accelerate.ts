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

// Environment Constants - some are contained in cypress.env.json(.gitignored) to aid circumvent pushing secure info to remote repo
const userName1: string = Cypress.env("userName1");
const password1: string = Cypress.env("password1");
const otp1: string = Cypress.env("otp1");
const userName2: string = Cypress.env("userName2");
const password2: string = Cypress.env("password2");
const otp2: string = Cypress.env("otp2");

// String Constants
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
  cy.task("generateOTP", otp, { log: false }).then((token: string) => {
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
    .click({ scrollBehavior: false })
    .wait(200); // Turn off actionability checks as this does some wierd scrolling stuff

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
    const uniqueTestMessage = `Test Message: ${faker.lorem.words(10)}`;

    LoginUsingMFA(userName1, password1, otp1);
    //LoginUsingMFA(userName2, password2, otp2);

    ScrollToChannel("Channels", "inception-project");

    SendTextMessage(uniqueTestMessage);

    CheckTextMessagePreviouslySent(uniqueTestMessage);

    Logout();
  });
});
