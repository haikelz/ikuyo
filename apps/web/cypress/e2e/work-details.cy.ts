const projects = [
  {
    path: "/works/ahsanxpress",
    projectDescription: "sharia-oriented delivery ecosystem",
    expectedResponsibilities: [
      "Refactored parts of the Go backend",
      "Swagger documentation for more than 360 existing API routes",
      "live courier tracking over WebSockets",
      "reducing S3 usage from around 100 GB to 5 GB",
    ],
  },
  {
    path: "/works/spmb-universitas-cakrawala",
    projectDescription: "industry-oriented education",
    expectedResponsibilities: [
      "Researched Node.js and Go",
      "Go with Fiber",
      "shortlist registration and student biodata",
      "ESLint and Prettier",
    ],
  },
];

describe("Project detail responsibilities", () => {
  for (const project of projects) {
    it(`shows the responsibility list for ${project.path}`, () => {
      cy.visit(project.path);
      cy.contains("h2", "About the project").should("be.visible");
      cy.get("article h2").then(($headings) => {
        const projectIndex = [...$headings].findIndex(
          (heading) => heading.textContent?.trim() === "About the project",
        );
        const responsibilitiesIndex = [...$headings].findIndex(
          (heading) => heading.textContent?.trim() === "My responsibilities",
        );

        expect(projectIndex).to.be.greaterThan(-1);
        expect(responsibilitiesIndex).to.be.greaterThan(projectIndex);
      });
      cy.get("article").should("contain", project.projectDescription);
      cy.contains("h2", "My responsibilities").should("be.visible");
      cy.get("article ul li").should("have.length.greaterThan", 0);

      for (const responsibility of project.expectedResponsibilities) {
        cy.get("article ul").should("contain", responsibility);
      }
    });
  }
});
