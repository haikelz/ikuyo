describe("Guestbook page", () => {
  it("Should display Guestbook page and test it", () => {
    cy.visit("http://localhost:3000/guestbook");

    cy.get(`[data-cy="heading"]`).should("be.visible");

    cy.get(`[data-cy="description"]`).should("be.visible");

    cy.get(`[data-cy="guestbook"]`).should("be.visible");

    cy.get(`[data-cy="bottom-nav"]`).should("be.visible");
  });
});
