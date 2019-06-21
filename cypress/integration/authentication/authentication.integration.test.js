/// <reference types="Cypress" />

import { CREATE_TODO_BUTTON, SUCCESS_FEEDBACK } from "../../../src/strings";
import { AUTHENTICATE_API_URL } from "../../src/constants";
import { LOGIN_BUTTON, PASSWORD_PLACEHOLDER, USERNAME_PLACEHOLDER } from "../../src/strings";

context("Authentication", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/");
  });

  it("should work with the right credentials", () => {
    const username = "stefano@conio.com";
    const password = "mysupersecretpassword";
    cy.route({
      method: "POST",
      response: "fixture:authentication-success.json",
      url: `**${AUTHENTICATE_API_URL}`
    }).as("auth-xhr");

    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(`${username}{tab}`);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(`${password}{tab}`);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .type("pwd{tab}");

    cy.wait("auth-xhr").then(xhr => {
      expect(xhr)
        .its("request.body")
        .to.have.property("username", username);
      expect(xhr)
        .its("request.body")
        .to.have.property("password", password);
    });

    cy.getByText(SUCCESS_FEEDBACK).should("be.visible");
    cy.getByText(CREATE_TODO_BUTTON).should("be.visible");
  });
});
