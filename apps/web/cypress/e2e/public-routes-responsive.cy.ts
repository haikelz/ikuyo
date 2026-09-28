const defaultRoutes = [
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

      cy.request({ url: "/sitemap-0.xml", failOnStatusCode: false }).then(({ status, body }) => {
        const sitemap =
          status === 200 && typeof body === "string"
            ? Array.from(body.matchAll(/<loc>([^<]+)<\/loc>/g), (match) =>
                match[1] ? new URL(match[1]).pathname : null,
              ).filter((route) => route !== null)
            : [];
        const routes = [...new Set([...defaultRoutes, ...sitemap])];

        for (const route of routes) {
          cy.visit({ url: route, failOnStatusCode: route !== "/404" });
          cy.get("h1").should("be.visible");
          cy.document().then((document) => {
            expect(document.documentElement.scrollWidth, route).to.eq(
              document.documentElement.clientWidth,
            );
          });

          if (sitemap.length > 0) {
            const routeName = route.replace(/^\/+|\/+$/g, "").replaceAll("/", "__") || "home";
            cy.screenshot(`all-public-routes/${viewport.name}/${routeName}`, {
              capture: "viewport",
            });
          }
        }
      });
    });
  }
});
