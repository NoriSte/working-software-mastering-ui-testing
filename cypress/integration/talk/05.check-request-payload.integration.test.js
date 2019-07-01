/// <reference types="Cypress" />

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

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
    });

    cy.get(".success").should("be.visible");
  });
});
