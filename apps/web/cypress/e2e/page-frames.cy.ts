const framedRoutes = [
  "/", "/works", "/notes", "/tools", "/guestbook", "/tags",
  "/tags/linux", "/photos", "/wakatime", "/ihsg", "/eid-al-fitr",
  "/design-system", "/404", "/500", "/works/longker",
  "/notes/dari-zsh-ke-fish", "/experiences/pt-shidiq-membangun-indonesia",
];

describe("Shared page Frame", () => {
  for (const width of [390, 1280]) {
    it(`frames every route family without overflow at ${width}px`, () => {
      cy.viewport(width, 900);
      cy.intercept("GET", "**/api/v1/guestbook", { data: [] }).as("guestbook");
      cy.intercept("GET", "**/api/v1/ihsg/markets", { data: [] }).as("markets");
      for (const route of framedRoutes) {
        cy.visit({ url: route, failOnStatusCode: !["/404", "/500"].includes(route) });
        cy.get('main [data-cy="page-frame"]').should("have.length", 1);
        cy.get('[data-cy="page-frame-panel"]').should("have.length", 1);
        cy.get('[data-cy="page-frame"] [data-cy="page-frame"]').should("not.exist");
        cy.get('[data-cy="page-frame"]').closest("astro-island").should("not.exist");
        cy.get('[data-cy="page-frame-panel"]').should("have.css", "padding-left", width === 390 ? "0px" : "24px");
        cy.get('[data-cy="page-frame"]').should("have.css", "display", width === 390 ? "contents" : "flex");
        cy.document().then((document) => {
          expect(document.documentElement.scrollWidth, route).to.eq(document.documentElement.clientWidth);
        });
        if (["/", "/works", "/notes/dari-zsh-ke-fish", "/ihsg", "/guestbook"].includes(route)) {
          if (route === "/guestbook") {
            cy.wait("@guestbook");
            cy.contains("There is no message right now!").should("be.visible");
          }
          if (route === "/ihsg") {
            cy.wait("@markets");
            cy.contains("Data Market Belum Tersedia").should("be.visible");
          }
          cy.screenshot(`page-frames/${route.replaceAll("/", "-") || "home"}-${width}`, { capture: "viewport" });
        }
      }
    });
  }

  it("enables page Frame only from the tablet breakpoint", () => {
    cy.visit("/tools");
    cy.viewport(767, 900);
    cy.get('[data-cy="page-frame"]').should("have.css", "display", "contents").and("have.css", "border-top-width", "0px");
    cy.get('[data-cy="page-frame-panel"]').should("have.css", "padding-left", "0px");
    cy.viewport(768, 900);
    cy.get('[data-cy="page-frame"]').should("have.css", "display", "flex").and("have.css", "border-top-width", "1px");
    cy.get('[data-cy="page-frame-panel"]').should("have.css", "padding-left", "24px");
  });
});
