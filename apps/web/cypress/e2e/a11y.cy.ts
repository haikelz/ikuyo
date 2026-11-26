describe("Accessibility features", () => {
  beforeEach(() => {
    cy.clearLocalStorage("theme");
    cy.visit("/");
  });

  it("skip-to-content link is visible when focused", () => {
    cy.get('a[href="#main-content"]').focus();
    cy.get('a[href="#main-content"]').should("be.visible").and("contain.text", "Skip to content");
  });

  it("skip-to-content link navigates focus to main content", () => {
    cy.get('a[href="#main-content"]').click({ force: true });
    cy.get("main").should("have.id", "main-content");
  });

  it("has semantic landmarks on the page", () => {
    cy.get("nav").should("exist");
    cy.get("main").should("exist");
    cy.get("footer").should("exist");
  });

  it("focus-visible outline is applied to skip link on focus", () => {
    cy.get('a[href="#main-content"]').focus();
    cy.focused().should("have.css", "outline-style").and("not.eq", "none");
  });
});

const routeTemplates = [
  "/",
  "/works",
  "/works/longker",
  "/notes",
  "/notes/mengapa-saya-menggunakan-linux",
  "/experiences/linkupcareer",
  "/tags",
  "/tags/linux",
  "/photos",
  "/guestbook",
  "/now",
  "/uses",
  "/wakatime",
  "/ihsg",
  "/eid-al-fitr",
  "/design-system",
  "/404",
];

describe("Page template semantics", () => {
  for (const route of routeTemplates) {
    it(`${route} has a complete document structure`, () => {
      cy.visit({ url: route, failOnStatusCode: route !== "/404" });
      cy.title().should("not.be.empty");
      cy.get('html[lang="en"]').should("exist");
      cy.get("main").should("have.length", 1);
      cy.get("h1").should("have.length", 1);
      cy.get('nav[aria-label="Primary"], nav').should("exist");
      cy.get("footer").should("exist");
      cy.get('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').should("not.exist");
      cy.get("button").each(($button) => {
        expect($button.attr("aria-label") ?? $button.text().trim()).not.to.equal("");
      });
      cy.get("img:not([alt])").should("not.exist");
    });
  }
});

describe("Keyboard interactions", () => {
  it("steps through the photo slideshow and returns focus to the last photo's tile", () => {
    cy.visit("/photos");
    const tiles = () => cy.get('button[aria-label^="View photo"]');
    tiles().eq(1).focus().click();
    cy.get('[role="dialog"]').should("be.visible").and("contain.text", "2 / ");
    cy.focused().closest('[role="dialog"]').should("exist");

    cy.focused().type("{rightarrow}");
    cy.get('[role="dialog"]').should("contain.text", "3 / ");
    cy.get('[role="dialog"] button[aria-label="Previous photo"]').click();
    cy.get('[role="dialog"]').should("contain.text", "2 / ");
    cy.get('[role="dialog"] button[aria-label="Next photo"]').click();

    cy.focused().type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
    tiles().eq(2).should("be.focused");
  });

  it("announces current navigation and theme state", () => {
    cy.visit("/works");
    cy.get('nav[aria-label="Primary"] a[href="/works/"]').should(
      "have.attr",
      "aria-current",
      "page",
    );
    cy.get('button[aria-label^="Switch to"]').first().should("have.attr", "aria-pressed");
  });
});

describe("Photo gallery layout", () => {
  it("defaults to square tiles, switches to the bento grid, and remembers the choice", () => {
    cy.visit("/photos");
    const tile = () => cy.get('button[aria-label^="View photo"]').first();
    cy.get('[data-cy="photos-layout-square"]').should("have.attr", "data-state", "on");
    tile().should("have.class", "aspect-square");

    cy.get('[data-cy="photos-layout-masonry"]').click().should("have.attr", "data-state", "on");
    cy.get('[data-cy="photos-layout-square"]').should("have.attr", "data-state", "off");
    tile().should("have.class", "masonry-item");

    cy.reload();
    cy.get('[data-cy="photos-layout-masonry"]').should("have.attr", "data-state", "on");
    // Pressing the active layout again keeps it chosen.
    cy.get('[data-cy="photos-layout-masonry"]').click().should("have.attr", "data-state", "on");
  });
});
