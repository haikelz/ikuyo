const experiencePaths = [
  "/experiences/web-programmer",
  "/experiences/linkupcareer",
  "/experiences/puskesmas-pangkalbalam",
  "/experiences/dibimbing",
  "/experiences/infinite-learning",
  "/experiences/data-entry",
  "/experiences/frontend-web-developer",
  "/experiences/we-up-indonesia",
];

describe("Experience pages", () => {
  it("links every homepage experience to a detail page", () => {
    cy.visit("/");

    cy.get('[data-cy="experience"] [data-cy="experience-link"]')
      .should("have.length", 8)
      .each(($link) => {
        expect($link.attr("href")).to.match(/^\/experiences\/[a-z0-9-]+$/);
      });
  });

  it("serves every migrated experience route", () => {
    for (const path of experiencePaths) {
      cy.request(path).its("status").should("eq", 200);
    }
  });

  it("renders an experience article with its role and highlights", () => {
    cy.visit("/experiences/linkupcareer");

    cy.title().should("eq", "Linkupcareer.id");
    cy.get("h1").should("contain.text", "Linkupcareer.id");
    cy.get('[data-cy="experience-position"]').should("contain.text", "IT Staff");
    cy.get('[data-cy="experience-highlights"] li').should("have.length", 2);
    cy.get('button[aria-label="back to experiences"]').should("be.visible");
  });
});
