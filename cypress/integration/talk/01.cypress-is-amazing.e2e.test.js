/// <reference types="Cypress" />

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  before(() => {
    // e2e tests need real data
    cy.request("POST", `http://localhost:3001/e2e-tests/wipe-data`);
    cy.request("POST", `http://localhost:3001/e2e-tests/seed-data`, {
      username,
      password
    });
  });

  it("should work with the right credentials", () => {
    cy.viewport(300, 600);
    cy.visit("/");
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);
    cy.get(".login-button").click();
    cy.wait(5000); // in the meantime, the AJAX call should happen
    cy.get(".success").should("be.visible");
  });
});
