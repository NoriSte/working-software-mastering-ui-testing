/// <reference types="Cypress" />

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  before(() => {
    // wipe the server data
    cy.request("POST", `http://localhost:3001/e2e-tests/wipe-data`);

    // add a temporary user
    cy.request("POST", `http://localhost:3001/e2e-tests/seed-data`, {
      username,
      password
    });
  });

  beforeEach(() => {
    // resize the window
    cy.viewport(300, 600);
  });

  it("should work with the right credentials", () => {
    // visit the home page
    cy.visit("/");

    // fill the form
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);

    // click the login button
    cy.get(".login-button").click();

    // sleep the test for 5 seconds, the AJAX call should happen
    cy.wait(5000);

    // check that the success feedback is visible
    cy.get(".success").should("be.visible");
  });
});
