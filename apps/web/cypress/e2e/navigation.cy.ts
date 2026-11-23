export {};

const hydrated = 'astro-island[component-url*="Navbar"]';

describe("Primary navigation", () => {
  it("collapses the links into a menu sheet on phones", () => {
    cy.viewport(375, 812);
    cy.visit("/notes/");
    cy.get(hydrated).should("not.have.attr", "ssr");
    cy.get('[data-cy="notes-btn"]').should("not.be.visible");

    cy.get('[data-cy="menu-btn"]').should("be.visible").click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Menu").should("be.visible");
      cy.get("a").should("have.length", 7);
      cy.contains("a", "Notes").should("have.attr", "aria-current", "page");
    });

    cy.focused().type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
    cy.focused().should("have.attr", "data-cy", "menu-btn");

    cy.get('[data-cy="menu-btn"]').click();
    cy.get('[role="dialog"]').contains("a", "Works").click();
    cy.location("pathname").should("eq", "/works/");
  });

  it("shows the link row from the sm breakpoint", () => {
    cy.viewport(640, 900);
    cy.visit("/");
    cy.get('[data-cy="menu-btn"]').should("not.be.visible");
    cy.get('[data-cy="works-btn"]').should("be.visible");
    cy.get('nav[aria-label="Primary"]').then(($nav) => {
      expect($nav[0].getBoundingClientRect().right).to.be.at.most(640 - 16);
    });
  });
});
