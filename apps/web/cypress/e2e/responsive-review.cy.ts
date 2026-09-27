const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
  { name: "wide", width: 1536, height: 1000 },
];

describe("Responsive review", () => {
  for (const viewport of viewports) {
    it(`renders the homepage at ${viewport.name} width`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/");
      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
      });
      cy.get('[data-cy="featured-work"]')
        .should("have.length", 5)
        .and("have.class", "grid")
        .and("have.class", "border-t");
      cy.get('[data-cy="featured-works"] img').should("have.length", 5);
      cy.screenshot(`responsive/home-${viewport.name}`, { capture: "viewport" });
    });

    it(`renders the case study at ${viewport.name} width`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/experiences/pt-shidiq-membangun-indonesia");
      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
      });
      if (viewport.name === "wide") {
        cy.get('nav[aria-label="On this page"]').should("be.visible");
      } else {
        cy.get('button[aria-label="Open table of contents"]').should("be.visible").click();
        cy.get('[data-slot="sheet-content"][data-side="bottom"]').should("be.visible");
        cy.get('button[aria-label="Close table of contents"]').click();
      }
      cy.screenshot(`responsive/experience-${viewport.name}`, { capture: "viewport" });
    });
  }
});
