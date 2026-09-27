describe("MDX processing", () => {
  it("renders configured code-block wrappers and filenames", () => {
    cy.visit("/notes/dari-zsh-ke-fish");

    cy.get(".code-block-wrapper [data-copy-button]").should("exist");
    cy.get(".code-block-filename").should("contain.text", "config.fish");
  });
});
