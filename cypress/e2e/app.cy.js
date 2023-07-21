/* eslint-disable no-undef */
/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  it("Logs In", () => {
    cy.visit("http://13.39.80.135:5000/")
    cy.get("h1").first().contains("Hello")
    cy.get("nav").contains("Talent Verify")
    cy.get("nav a").last().contains("Login")
  })
})
