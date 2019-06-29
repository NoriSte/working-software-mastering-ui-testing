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

    // the user consumes the UI through the contents, do the same! Debugging is easier too
    // 😉
    cy.getByPlaceholderText("Your username")
      .should("be.visible")
      .type(username);

    // the user consumes the UI through the contents, do the same! Debugging is easier too
    // 😉
    cy.getByPlaceholderText("Your password")
      .should("be.visible")
      .type(password);

    // the user consumes the UI through the contents, do the same! Debugging is easier too
    // 😉
    cy.getByText("Login")
      .should("be.visible")
      .click();

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    // the user consumes the UI through the contents, do the same! Debugging is easier too
    // 😉
    cy.getByText("Welcome back!");
  });
});
