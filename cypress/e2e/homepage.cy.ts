describe("Homepage", () => {
  it("Should display homepage and test it", () => {
    cy.visit("http://localhost:3000");

    cy.get(`[data-cy="name"]`).should("be.visible");

    cy.get(`[data-cy="description"]`).should("be.visible");

    cy.get(`[data-cy="experience"]`).should("be.visible");

    cy.get(`[data-cy="featured-works"]`).should("be.visible");

    cy.get(`[data-cy="featured-notes"]`).should("be.visible");

    cy.get(`[data-cy="bottom-nav"]`).should("be.visible");
  });
});
