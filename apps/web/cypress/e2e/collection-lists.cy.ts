const collections = [
  { path: "/works", row: '[data-cy="work-row"]' },
  { path: "/notes", row: '[data-cy="note-row"]' },
  { path: "/guestbook", row: '[data-cy="guestbook-row"]' },
];

describe("Editorial collection lists", () => {
  for (const width of [375, 1280]) {
    for (const collection of collections) {
      it(`renders ${collection.path} as rows at ${width}px`, () => {
        cy.viewport(width, 900);
        cy.visit(collection.path);
        cy.get(collection.row)
          .should("have.length.greaterThan", 0)
          .and("have.class", "grid")
          .and("have.class", "border-t");
        cy.document().then((document) => {
          expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
        });
      });
    }
  }
});
