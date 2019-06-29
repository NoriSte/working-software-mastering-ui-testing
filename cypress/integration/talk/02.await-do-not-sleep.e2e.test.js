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

  it("should work with the right credentials", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: `**/api/authentication`
    }).as("auth-xhr");

    cy.viewport(300, 600);
    cy.visit("/");
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);
    cy.get(".login-button").click();

    cy.wait("@auth-xhr"); // it does not matter how long it takes

    cy.get(".success").should("be.visible");
  });
});
