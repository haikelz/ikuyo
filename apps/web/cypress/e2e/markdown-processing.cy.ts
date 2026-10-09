describe("MDX processing", () => {
  it("renders configured code-block wrappers and filenames", () => {
    cy.visit("/notes/dari-zsh-ke-fish");

    cy.get(".code-block-wrapper [data-copy-button]").should("exist");
    cy.get(".code-block-filename").should("contain.text", "config.fish");
  });

  it("marks the section being read in the existing table of contents", () => {
    cy.viewport(1536, 900);
    cy.visit("/notes/dari-zsh-ke-fish");
    cy.get('nav[aria-label="On this page"] [data-scrollspy-anchor]').should("have.length.greaterThan", 1);
    cy.get('nav[aria-label="On this page"] [data-scrollspy-anchor]').eq(1).invoke("attr", "data-scrollspy-anchor").then((slug) => {
      cy.get(`[id="${slug}"]`).then(($heading) => {
        cy.window().then((window) => {
          window.document.documentElement.style.scrollBehavior = "auto";
          window.scrollTo(0, $heading[0].getBoundingClientRect().top + window.scrollY - 100);
        });
      });
      cy.get(`nav[aria-label="On this page"] [data-scrollspy-anchor="${slug}"]`).should("have.attr", "aria-current", "location");
    });
    cy.screenshot("reui-patterns/scrollspy-desktop", { capture: "viewport" });
    cy.viewport(375, 812);
    cy.get('button[aria-label="Open table of contents"]').click();
    cy.get('[role="dialog"] [aria-current="location"]').should("be.visible");
    cy.screenshot("reui-patterns/scrollspy-mobile", { capture: "viewport" });
    cy.get('[role="dialog"] [aria-current="location"]').click();
    cy.get('[role="dialog"]').should("not.exist");
  });
});
