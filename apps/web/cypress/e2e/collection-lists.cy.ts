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
  it("previews the first three projects in each Works category on the homepage", () => {
    cy.visit("/works");
    cy.document().then((document) => {
      const previews = [
        {
          works: "company-projects",
          featured: "featured-works",
          title: "Company Projects",
          excluded: "gtcd",
        },
        {
          works: "personal-projects",
          featured: "featured-personal-works",
          title: "Personal Projects",
          excluded: "AhsanXpress",
        },
      ].map((category) => ({
        ...category,
        hrefs: Array.from(
          document.querySelectorAll<HTMLAnchorElement>(
            `[data-cy="${category.works}"] [data-cy="work-row"] h3 a`,
          ),
        )
          .slice(0, 3)
          .map((link) => link.getAttribute("href")),
      }));

      cy.visit("/");
      for (const { featured, title, excluded, hrefs } of previews) {
        cy.get(`[data-cy="${featured}"]`)
          .should("contain", title)
          .and("not.contain", excluded)
          .within(() => {
            cy.get('a[href="/works"]').should("contain", "View all");
            cy.get('[data-cy="featured-work"]')
              .should("have.length", 3)
              .each(($project) => {
                cy.wrap($project).find("img").should("have.attr", "alt");
              });
            cy.get('[data-cy="featured-work"] h3 a').then(($links) => {
              const displayedHrefs = Array.from($links, (link) => link.getAttribute("href"));
              expect(displayedHrefs).to.deep.eq(hrefs);
            });
          });
      }

      cy.get('[data-cy="featured-personal-works"] [data-cy="featured-work"] h3 a')
        .first()
        .then(($link) => {
          const detailPath = $link.attr("href");
          const title = $link.text().trim();
          cy.wrap($link).click();
          cy.location("pathname").should("eq", detailPath);
          cy.get("h1").should("contain", title);
        });
    });
  });

  it("groups company projects before personal projects on the works page", () => {
    cy.visit("/works");

    cy.get('[data-cy="company-projects"] [data-cy="work-row"]')
      .should("have.length.greaterThan", 0)
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
    cy.get('[data-cy="company-projects"]').should("contain", "SPMB Universitas Cakrawala");
    cy.get('[data-cy="company-projects"] [data-cy="work-row"] img')
      .first()
      .should("have.attr", "src", "https://ik.imagekit.io/haikelz/works/ahsanxpress/images.png");
    cy.contains('[data-cy="personal-projects"] [data-cy="work-row"]', "gtcd")
      .closest('[data-cy="work-row"]')
      .find("img")
      .scrollIntoView()
      .should("have.attr", "src", "/og/works/gtcd.png")
      .and(($image) => expect(($image[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0));
  });
});
