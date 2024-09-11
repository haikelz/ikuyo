describe("Tags page", () => {
  it("Should display Tags page and test it", () => {
    cy.visit("http://localhost:3000/tags");

    cy.get(`[data-cy="heading"]`).should("be.visible");

    cy.get(`[data-cy="description"]`).should("be.visible");

    cy.get(`[data-cy="tags-list"]`).should("be.visible");

    cy.get(`[data-cy="bottom-nav"]`).should("be.visible");
  });
});
