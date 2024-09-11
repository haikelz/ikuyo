describe("Works page", () => {
  it("Should display Works page and test it", () => {
    cy.visit("http://localhost:3000/works");

    cy.get(`[data-cy="heading"]`).should("be.visible");

    cy.get(`[data-cy="description"]`).should("be.visible");

    cy.get(`[data-cy="works-list"]`).should("be.visible");

    cy.get(`[data-cy="bottom-nav"]`).should("be.visible");
  });
});
