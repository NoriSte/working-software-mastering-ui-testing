/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL, SERVER_URL } from "../../../src/constants";
import {
  LOGIN_BUTTON,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
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

  before(() => {
    cy.request("POST", `${SERVER_URL}/e2e-tests/seed-data`, {
      username,
      password
    });
  });

  it("should work with the right credentials", () => {
    // intercepts every auth AJAX request
    cy.route({
      method: "POST",
      url: `**${AUTHENTICATE_API_URL}`
    }).as("auth-xhr");

    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(`${username}`);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(`${password}`);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .click();

    // checks the auth AJAX response payload
    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.have.property("token");
    });

    cy.getByText(SUCCESS_FEEDBACK).should("be.visible");
  });
});
