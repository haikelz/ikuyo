const routes = [
  "/uses",
  "/now",
  "/photos",
  "/tags",
  "/tags/linux",
  "/wakatime",
  "/ihsg",
  "/eid-al-fitr",
  "/design-system",
  "/works/longker",
  "/notes/mengapa-saya-menggunakan-linux",
  "/404",
];

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

export {};

describe("Public route responsive fit", () => {
  for (const viewport of viewports) {
    it(`keeps every public route within the ${viewport.name} viewport`, () => {
      cy.viewport(viewport.width, viewport.height);

      for (const route of routes) {
        cy.visit({ url: route, failOnStatusCode: route !== "/404" });
        cy.get("h1").should("be.visible");
        cy.document().then((document) => {
          expect(document.documentElement.scrollWidth, route).to.eq(
            document.documentElement.clientWidth,
          );
        });
      }
    });
  }
});
