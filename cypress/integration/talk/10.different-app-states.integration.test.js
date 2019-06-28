/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL } from "../../../src/constants";
import {
  GENERIC_ERROR,
  LOADING,
  LOGIN_BUTTON,
  LONG_WAITING,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
  UNAUTHORIZED_ERROR,
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

  it("should work with the right credentials", () => {
    cy.route({
      method: "POST",
      response: "fixture:authentication/authentication-success.json",
      url: `**${AUTHENTICATE_API_URL}`
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

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    cy.getByText(SUCCESS_FEEDBACK).should("be.visible");
  });

  const fillFormAndClick = ({ username, password }) => {
    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(username);
    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(password);
    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .click();
  };

  it("should alert the user it the login lasts long", () => {
    cy.route({
      method: "POST",
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,
      delay: 20000
    }).as("auth-xhr");

    fillFormAndClick({ username, password });

    cy.getByText(LOADING).should("be.visible");
    cy.getByText(LONG_WAITING).should("be.visible");
  });

  it("should alert the user it the credentials are wrong", () => {
    cy.route({
      method: "POST",
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,

      // testing all the flows is easy without a real server and some real data
      // 👍
      status: 401
    }).as("auth-xhr");

    fillFormAndClick({ username, password });

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    cy.getByText(UNAUTHORIZED_ERROR).should("be.visible");
  });

  it("should alert the user it the server does not work", () => {
    cy.route({
      method: "POST",
      response: {},
      url: `**${AUTHENTICATE_API_URL}`,

      // testing all the flows is easy without a real server and some real data
      // 👍
      status: 500
    }).as("auth-xhr");

    fillFormAndClick({ username, password });
    cy.getByText(LOGIN_BUTTON).click();

    cy.getByText(GENERIC_ERROR).should("be.visible");
  });
});
