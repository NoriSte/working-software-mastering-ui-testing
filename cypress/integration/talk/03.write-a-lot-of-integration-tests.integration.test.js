/// <reference types="Cypress" />

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  before(() => {
    // no more data wipe/seed are needed!
    // 🎉🎉🎉
  });

  beforeEach(() => {
    cy.viewport(300, 600);
  });

  it("should work with the right credentials", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: `**/api/authentication`,
      // Cypress responds with a fixed response. The AJAX call will be blazing fast
      // 🚀🚀🚀
      response: "fixture:authentication/authentication-success.json"
    }).as("auth-xhr");

    cy.visit("/");
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);
    cy.get(".login-button").click();
    cy.wait("@auth-xhr");
    cy.get(".success").should("be.visible");
  });
});
