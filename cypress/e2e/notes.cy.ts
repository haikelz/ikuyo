describe("Notes page", () => {
  it("Should display Notes page and test it", () => {
    cy.visit("http://localhost:3000/notes");

    cy.get(`[data-cy="heading"]`).should("be.visible");

    cy.get(`[data-cy="description"]`).should("be.visible");

    cy.get(`[data-cy="notes-list"]`).should("be.visible");

    cy.get(`[data-cy="bottom-nav"]`).should("be.visible");
  });
});
