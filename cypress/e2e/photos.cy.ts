describe("Photos page", () => {
  it("Should display Photos page and test it", () => {
    cy.visit("http://localhost:3000/photos");

    cy.get(`[data-cy="heading"]`).should("be.visible");

    cy.get(`[data-cy="description"]`).should("be.visible");

    cy.get(`[data-cy="photos-list"]`).should("be.visible");

    cy.get(`[data-cy="bottom-nav"]`).should("be.visible");
  });
});
