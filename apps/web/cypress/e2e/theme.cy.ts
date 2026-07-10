describe("Theme toggle", () => {
  beforeEach(() => {
    cy.clearLocalStorage("theme");
    cy.visit("/");
  });

  it("loads in dark mode by default when no localStorage is set", () => {
    cy.get("html").should("have.class", "dark");
  });

  it("switches to light mode when toggle is clicked", () => {
    cy.get('[data-cy="theme-toggle"]').first().click();
    cy.get("html").should("not.have.class", "dark");
  });

  it("switches back to dark mode when toggle is clicked again", () => {
    cy.get('[data-cy="theme-toggle"]').first().click();
    cy.get("html").should("not.have.class", "dark");
    cy.get('[data-cy="theme-toggle"]').first().click();
    cy.get("html").should("have.class", "dark");
  });

  it("persists theme across page navigation", () => {
    cy.get('[data-cy="theme-toggle"]').first().click();
    cy.get("html").should("not.have.class", "dark");
    cy.visit("/notes");
    cy.get("html").should("not.have.class", "dark");
  });
});
