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
    cy.server();
    cy.route({
      method: "POST",
      url: `**/api/authentication`,
      response: "fixture:authentication/success.json"
    }).as("auth-xhr");
    cy.viewport(300, 600);
    cy.visit("/");
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);
    cy.get(".login-button").click();

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);

      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.have.property("token");
    });

    cy.get(".success").should("be.visible");
  });
});
