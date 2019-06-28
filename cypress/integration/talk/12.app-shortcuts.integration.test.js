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
      response: "fixture:authentication/authentication-success.json",
      url: `**${AUTHENTICATE_API_URL}`
    }).as("auth-xhr");

    // Front-end shortcuts make the tests faster, you must not use the UI to reach the desired
    // state, the UI is soooooo slow
    // 🚀🚀🚀
    cy.window().invoke("cypressShortcuts.authenticate", username, password);

    cy.wait("@auth-xhr");
  });
});
