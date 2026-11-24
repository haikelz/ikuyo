const experiencePaths = [
  "/experiences/undisclosed-1",
  "/experiences/linkupcareer",
  "/experiences/puskesmas-pangkalbalam",
  "/experiences/dibimbing",
];

describe("Experience pages", () => {
  it("links every homepage experience to a detail page", () => {
    cy.visit("/");

    cy.get('[data-cy="experience"] [data-cy="experience-link"]')
      .should("have.length", 4)
      .each(($link) => {
        expect($link.attr("href")).to.match(/^\/experiences\/[a-z0-9-]+$/);
      });
  });

  it("keeps homepage experience rows to company, role, and dates", () => {
    cy.visit("/");

    cy.get('[data-cy="experience"] article').should("have.length.greaterThan", 0);
    cy.get('[data-cy="experience"] li').should("not.exist");
  });

  it("serves every migrated experience route", () => {
    for (const path of experiencePaths) {
      cy.request(path).its("status").should("eq", 200);
    }
  });

  it("renders an experience article with its role and highlights", () => {
    cy.visit("/experiences/linkupcareer");

    cy.title().should("eq", "Linkupcareer.id — Haikel Ilham Hakim");
    cy.get("h1").should("contain.text", "Linkupcareer.id");
    cy.get('[data-cy="experience-position"]').should("contain.text", "IT Staff");
    cy.get('[data-cy="experience-highlights"] li').should("have.length", 2);
    cy.get('button[aria-label="back to experiences"]').should("be.visible");
  });
});
