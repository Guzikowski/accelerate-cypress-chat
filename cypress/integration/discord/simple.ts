it("blah", () => {
  // cy.session(["simon.crook.001@gmail.com", "We11ingtonWe11ington#"], () => {
  // cy.visit("https://discord.com/login");
  cy.intercept("/api/*", ({ headers }) => {
    headers[
      "Authorization"
    ] = `Bearer OTExODY1NTIxOTMzMjYyODc5.YZyMrw.t9lXL_qbPK3INII5QJEqTa6MYm4`;
  }).as("matchedUrl");
  // cy.visit(
  //   "https://discord.com/channels/911865814792155176/911865814792155180"
  // );
  // cy.get('input[name="email"]').type("simon.crook.001@gmail.com");
  // // cy.get('input[name="email"]').type("ed.guzikowski@ptml.com");
  // cy.get('input[name="password"]').type("We11ingtonWe11ington#");
  // // cy.get('input[name="password"]').type("Accelerat3");
  // cy.intercept("/api/v9/users/@me/billing/user-trial-offer").as("blah");
  // cy.get('button[type="submit"]').click();
  // // cy.url().should(
  // //   "eq",
  // //   "https://discord.com/channels/911865814792155176/911865814792155180"
  // // );
  // cy.get("div[aria-label='Download Apps']")
  //   .should("be.visible")
  //   .click({ force: true });

  // cy.get("p").contains("Get Discord at home");
  // // cy.wait("@blah");
  cy.request({
    url: "https://discord.com",
    method: "POST",
    body: {
      login: "simon.crook.001@gmail.com",
      password: "We11ingtonWe11ington#",
      undelete: false,
      login_source: null,
      gift_code_sku_id: null,
    },
    followRedirect: true,
  });
  cy.visit(
    "https://discord.com/channels/911865814792155176/911865814792155180"
  );
});
// });
