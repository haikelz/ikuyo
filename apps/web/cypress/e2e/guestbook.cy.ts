describe("Guestbook client data", () => {
  const first = {
    id: "1",
    created_at: "2026-01-04T00:00:00Z",
    username: "First visitor",
    message: "First message",
  };
  const newest = {
    id: "2",
    created_at: "2026-02-05T00:00:00Z",
    username: "New visitor",
    message: "New message",
  };

  it("loads in the browser and refreshes entries without a page rebuild", () => {
    let entries = [first];
    cy.intercept("GET", "**/api/v1/guestbook", (request) => {
      request.reply({ body: { data: entries } });
    }).as("guestbook");
    cy.visit("/guestbook");
    cy.wait("@guestbook");
    cy.get('[data-cy="guestbook-row"]').should("have.length", 1).and("contain", "First message");

    cy.then(() => {
      entries = [first, newest];
    });
    cy.document().then((document) => {
      Object.defineProperty(document, "hidden", { configurable: true, value: false });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    cy.wait("@guestbook");
    cy.get('[data-cy="guestbook-row"]').should("have.length", 2);
    cy.get('[data-cy="guestbook-row"]').first().should("contain", "New message");
    cy.screenshot("guestbook-client-loaded", { capture: "viewport" });
  });

  it("distinguishes an empty guestbook from a failed request", () => {
    cy.intercept("GET", "**/api/v1/guestbook", { data: [] });
    cy.visit("/guestbook");
    cy.contains("There is no message right now!").should("be.visible");

    cy.intercept("GET", "**/api/v1/guestbook", { statusCode: 503, body: {} });
    cy.reload();
    cy.contains("Could not load messages").should("be.visible");
    cy.contains("There is no message right now!").should("not.exist");
  });
});
