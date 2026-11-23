describe("Astro view transitions", () => {
  it("lifts the old page, raises the new one, slides the nav pill, and honors reduced motion", () => {
    cy.viewport(1280, 900);
    cy.visit("/");

    cy.get('[data-cy="works-btn"]').click();
    cy.location("pathname").should("eq", "/works/");

    cy.get('link[rel="stylesheet"]').then(($links) => {
      const stylesheet = Array.from($links, (link) => (link as HTMLLinkElement).href).find((href) =>
        href.includes("Layout."),
      );

      expect(stylesheet).to.exist;
      cy.request(stylesheet as string).then(({ body }) => {
        const styles = String(body).replace(/\s/g, "");

        expect(styles).to.contain("::view-transition-new(root)");
        expect(styles).to.contain("page-in");
        expect(styles).to.contain("page-in-back");
        expect(styles).to.contain("::view-transition-group(nav-pill)");
        expect(styles).to.contain("::view-transition-old(site-nav)");
        expect(styles).to.contain("prefers-reduced-motion:reduce");
        expect(styles).to.contain("animation:none");
      });
    });
  });
});
