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
    cy.viewport(300, 600);
  });

  it("should work with the right credentials", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: `**/api/authentication`,
      response: "fixture:authentication/authentication-success.json"
    }).as("auth-xhr");

    cy.visit("/");
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);
    cy.get(".login-button").click();

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);

      // since the integration tests already tested the front-end app, we use E2E tests to check the
      // back-end app. It needs to ensure that the back-end app works and gets the correct response
      // data
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.have.property("token");
    });

    cy.get(".success").should("be.visible");
  });
});
