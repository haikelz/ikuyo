describe("Frame composition", () => {
  for (const width of [390, 1280]) {
    it(`renders Frame variants at ${width}px`, () => {
      cy.viewport(width, 900);
      cy.visit("/design-system#frame");
      cy.get('[data-cy="frame-default"]').should("have.css", "border-top-width", "1px");
      cy.get('[data-cy="frame-ghost"]').should("have.css", "border-top-width", "0px");
      cy.get('[data-cy="frame-stacked"] [data-slot="frame-panel"]').last()
        .should("have.css", "border-top-width", "0px")
        .and("have.css", "border-top-left-radius", "0px");
      cy.get('[data-cy="frame-stacked"] [data-slot="frame-panel"]').first()
        .should("have.css", "border-bottom-left-radius", "0px")
        .and("have.css", "padding-left", "12px");
      cy.get('[data-cy="frame-ghost"] [data-slot="frame-panel"]').should("have.css", "padding-left", "20px");
      cy.get('[data-cy="frame-dense"]').should("have.css", "padding-left", "0px");
      cy.get('[data-cy="frame-dense"] [data-slot="frame-panel"]').first()
        .should("have.css", "border-top-left-radius", "12px")
        .and("have.css", "padding-left", "16px");
      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
        document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
      });
      cy.get("#frame").scrollIntoView({ duration: 0 });
      cy.wait(500);
      cy.get("#frame").screenshot(`frame-${width}`);
    });
  }
});
