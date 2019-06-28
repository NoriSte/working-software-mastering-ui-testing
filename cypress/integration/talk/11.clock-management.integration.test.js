/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL } from "../../../src/constants";
import {
  LOADING,
  LOGIN_BUTTON,
  LONG_WAITING,
  PASSWORD_PLACEHOLDER,
  USERNAME_PLACEHOLDER
} from "../../../src/strings";

context("Authentication", () => {
  beforeEach(() => {
    cy.viewport(300, 600);
    cy.server();
    cy.visit("/");
  });

  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  it("should alert the user it the login lasts long", () => {
    // cypress gives you control over the browser clock
    // 🤔
    cy.clock();

    cy.route({
      method: "POST",
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,
      delay: 20000
    }).as("auth-xhr");

    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(username);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(password);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .click();

    // and so, time-lapsing is possible, setTimeouts do not need to be awaited
    // 😱😱😱
    cy.tick(3000);

    cy.getByText(LOADING).should("be.visible");
    cy.getByText(LONG_WAITING).should("be.visible");
  });
});
