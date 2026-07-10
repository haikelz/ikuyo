describe("Accessibility features", () => {
  beforeEach(() => {
    cy.clearLocalStorage("theme");
    cy.visit("/");
  });

  it("skip-to-content link is visible when focused", () => {
    cy.get('a[href="#main-content"]').focus();
    cy.get('a[href="#main-content"]')
      .should("be.visible")
      .and("contain.text", "Skip to content");
  });

  it("skip-to-content link navigates focus to main content", () => {
    cy.get('a[href="#main-content"]').click({ force: true });
    cy.get("main").should("have.id", "main-content");
  });

  it("has semantic landmarks on the page", () => {
    cy.get("nav").should("exist");
    cy.get("main").should("exist");
    cy.get("footer").should("exist");
  });

  it("focus-visible outline is applied to skip link on focus", () => {
    cy.get('a[href="#main-content"]').focus();
    cy.focused().should("have.css", "outline-style").and("not.eq", "none");
  });
});
