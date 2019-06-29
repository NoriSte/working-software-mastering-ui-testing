/// <reference types="Cypress" />

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  beforeEach(() => {
    cy.viewport(300, 600);
  });

  it("should work with the right credentials", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: `**/api/authentication`,
      response: "fixture:authentication/success.json"
    }).as("auth-xhr");

    cy.visit("/");
    cy.get(".username-field").type(username);
    cy.get(".password-field").type(password);
    cy.get(".login-button").click();

    cy.wait("@auth-xhr").then(xhr => {
      // a lot of times the front-end app does not work because of wrong communication with the
      // back-end app, always assert on the request payload
      // 👍
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    cy.get(".success").should("be.visible");
  });
});
