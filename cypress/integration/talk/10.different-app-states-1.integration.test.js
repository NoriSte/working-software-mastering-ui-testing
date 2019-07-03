/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL } from "../../../src/constants";
import {
  LOGIN_BUTTON,
  PASSWORD_PLACEHOLDER,
  UNAUTHORIZED_ERROR,
  USERNAME_PLACEHOLDER
} from "../../../src/strings";

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  it("should alert the user it the credentials are wrong", () => {
    cy.server();
    cy.route({
      method: "POST",
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,
      status: 401
    }).as("auth-xhr");

    cy.viewport(300, 600);
    cy.visit("/");

    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(username);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(password);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .click();
    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    cy.getByText(UNAUTHORIZED_ERROR).should("be.visible");
  });
});
