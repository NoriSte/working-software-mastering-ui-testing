/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL } from "../../../src/constants";

context("Authentication", () => {
  beforeEach(() => {
    cy.viewport(300, 600);
    cy.server();
    cy.visit("/");
  });

  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  it("should expose a shortcut for fast authentication", () => {
    cy.route({
      method: "POST",
      response: "fixture:authentication/success.json",
      url: `**${AUTHENTICATE_API_URL}`
    }).as("auth-xhr");

    cy.window().invoke("cypressShortcuts.authenticate", username, password);

    cy.wait("@auth-xhr");

    // cyu.visit("<THE_ROUTE_TO_BE_TESTED>"");
  });
});
