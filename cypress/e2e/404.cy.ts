describe("Not Found page", () => {
  it("Should display Not Found page and test it", () => {
    cy.visit("http://localhost:3000/something", { failOnStatusCode: false });

    cy.get(`[data-cy="title"]`).should("be.visible");

    cy.get(`[data-cy="description"]`).should("be.visible");

    cy.get(`[data-cy="bottom-nav"]`).should("be.visible");
  });
});
