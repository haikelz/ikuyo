export {};

const hydrated = 'astro-island[component-url*="Navbar"]';

describe("Primary navigation", () => {
  it("collapses the links into a menu sheet on phones", () => {
    cy.viewport(375, 812);
    cy.visit("/notes/");
    cy.get(hydrated).should("not.have.attr", "ssr");
    cy.get('[data-cy="notes-btn"]').should("not.be.visible");
    cy.get('nav[aria-label="Primary"] a[aria-label="Home"] img').should("be.visible");

    cy.get('[data-cy="menu-btn"]').should("be.visible").click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Menu").should("be.visible");
      cy.get("a").should("have.length", 5);
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

describe("Navigation surface", () => {
  for (const width of [375, 1280]) {
    it(`blends into the page at the top and returns to the pill once scrolled at ${width}px`, () => {
      cy.viewport(width, 800);
      cy.visit("/notes/");
      cy.get(hydrated).should("not.have.attr", "ssr");
      const nav = () => cy.get('nav[aria-label="Primary"]');

      nav().should("have.class", "border-transparent").and("not.have.class", "shadow-panel");
      nav().then(($nav) => {
        const topWidth = $nav[0].getBoundingClientRect().width;
        cy.scrollTo(0, 300);
        nav().should("have.class", "shadow-panel").and("have.class", "border-border");
        nav().should(($pill) => {
          const rect = $pill[0].getBoundingClientRect();
          // 0.7 leaves room for the ~23rem five-link row against the 39rem top bar.
          expect(rect.width).to.be.lessThan(topWidth * 0.7);
          // Phones keep the pill on the right gutter; from sm it stays centered.
          if (width < 640) expect(rect.right).to.be.closeTo(width - 16, 1);
        });
      });
      cy.scrollTo(0, 0);
      nav().should("have.class", "border-transparent").and("not.have.class", "shadow-panel");
    });
  }
});
