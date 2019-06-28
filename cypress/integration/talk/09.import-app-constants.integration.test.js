/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL } from "../../../src/constants";
import {
  LOGIN_BUTTON,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
  USERNAME_PLACEHOLDER
} from "../../../src/strings";

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

      // the test will not fail in case of minor front-end changes
      // ❤️
      url: `**${AUTHENTICATE_API_URL}`,

      response: "fixture:authentication/authentication-success.json"
    }).as("auth-xhr");

    cy.visit("/");

    // the test will not fail in case of minor front-end changes
    // ❤️
    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(username);

    // the test will not fail in case of minor front-end changes
    // ❤️
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(password);

    // the test will not fail in case of minor front-end changes
    // ❤️
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .click();

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    // the test will not fail in case of minor front-end changes
    // ❤️
    cy.getByText(SUCCESS_FEEDBACK).should("be.visible");
  });
});
