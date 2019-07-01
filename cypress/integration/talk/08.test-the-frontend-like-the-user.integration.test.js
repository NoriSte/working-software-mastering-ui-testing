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

    cy.getByPlaceholderText("Your username")
      .should("be.visible")
      .type(username);

    cy.getByPlaceholderText("Your password")
      .should("be.visible")
      .type(password);

    cy.getByText("Login")
      .should("be.visible")
      .click();

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    cy.getByText("Welcome back!").should("be.visible");
  });
});
