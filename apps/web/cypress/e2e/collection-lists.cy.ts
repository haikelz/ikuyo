const collections = [
  { path: "/works", row: '[data-cy="work-row"]' },
  { path: "/notes", row: '[data-cy="note-row"]' },
  { path: "/guestbook", row: '[data-cy="guestbook-row"]' },
];

describe("Editorial collection lists", () => {
  for (const width of [375, 1280]) {
    for (const collection of collections) {
      it(`renders ${collection.path} as rows at ${width}px`, () => {
        cy.viewport(width, 900);
        cy.visit(collection.path);
        cy.get(collection.row)
          .should("have.length.greaterThan", 0)
          .and("have.class", "grid")
          .and("have.class", "border-t");
        cy.document().then((document) => {
          expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
        });
      });
    }
  }
});

describe("Project classification", () => {
  const companyProjects = [
    "AhsanXpress",
    "SPMB Universitas Cakrawala",
    "Catatpro",
    "KelolaSurat",
    "Shidiq Membangun Indonesia Landing Page",
  ];

  it("shows company projects and generated thumbnails on the homepage", () => {
    cy.visit("/");

    cy.get('[data-cy="featured-work"]').should("have.length", 5);
    cy.get('[data-cy="featured-work"]').each(($project) => {
      cy.wrap($project).find("img").should("have.attr", "alt");
    });
    cy.get('[data-cy="featured-works"]').should("contain", "AhsanXpress");
    cy.get('[data-cy="featured-works"]').should("not.contain", "Taritme");
    for (const title of companyProjects) {
      cy.get('[data-cy="featured-works"]').should("contain", title);
    }
  });

  it("groups company projects before personal projects on the works page", () => {
    cy.visit("/works");

    cy.get('[data-cy="company-projects"] [data-cy="work-row"]')
      .should("have.length", 5)
      .each(($project) => {
        cy.wrap($project).find("img").should("have.attr", "alt");
      });
    cy.get('[data-cy="personal-projects"] [data-cy="work-row"]')
      .should("have.length.greaterThan", 0)
      .each(($project) => {
        cy.wrap($project).find("img").should("have.attr", "alt");
      });
    cy.get('[data-cy="company-projects"]').then(($company) => {
      expect($company.next('[data-cy="personal-projects"]')).to.have.length(1);
    });
    cy.get('[data-cy="company-projects"]').should(
      "contain",
      "Shidiq Membangun Indonesia Landing Page",
    );
    cy.get('[data-cy="company-projects"] [data-cy="work-row"] img')
      .first()
      .should("have.attr", "src", "/og/works/ahsanxpress.png");
    cy.contains('[data-cy="personal-projects"] [data-cy="work-row"]', "Puasa Sunnah API")
      .closest('[data-cy="work-row"]')
      .find("img")
      .should("have.attr", "src", "/og/works/puasa-sunnah.png")
      .and(($image) => expect(($image[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0));
  });
});
