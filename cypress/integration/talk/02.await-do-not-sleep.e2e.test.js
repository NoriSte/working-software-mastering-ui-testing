/// <reference types="Cypress" />

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  before(() => {
    cy.request("POST", `http://localhost:3001/e2e-tests/wipe-data`);
    cy.request("POST", `http://localhost:3001/e2e-tests/seed-data`, {
      username,
      password
    });
  });

  beforeEach(() => {
    cy.viewport(300, 600);
  });

  it("should work with the right credentials", () => {
    // let cypress intercept every request
    // 👁
    cy.server();

    // add an alias to the AJAX call
    // 🤔
    cy.route({
      method: "POST",
      url: `**/api/authentication`
    }).as("auth-xhr");

    cy.visit("/");
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);
    cy.get(".login-button").click();

    // wait for the AJAX call happening, it does not matter how long it takes!
    // The test waits the right amount of time
    // 😱😱😱😱😱
    cy.wait("@auth-xhr");

    cy.get(".success").should("be.visible");
  });
});
