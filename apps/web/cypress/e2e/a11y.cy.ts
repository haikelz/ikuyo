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
      cy.get('img:not([alt])').should("not.exist");
    });
  }
});

describe("Keyboard interactions", () => {
  it("opens and closes the photo dialog while restoring focus", () => {
    cy.visit("/photos");
    cy.get('button[aria-label^="View photo"]').first().as("photoTrigger").focus().click();
    cy.get('dialog[open][aria-label="Photo viewer"]').should("be.visible");
    cy.focused().should("have.attr", "aria-label", "Close lightbox");
    cy.focused().type("{esc}");
    cy.get('dialog[open][aria-label="Photo viewer"]').should("not.exist");
    cy.get("@photoTrigger").should("be.focused");
  });

  it("announces current navigation and theme state", () => {
    cy.visit("/works");
    cy.get('a[href="/works"]').filter(':visible').should("have.attr", "aria-current", "page");
    cy.get('button[aria-label^="Switch to"]').first().should("have.attr", "aria-pressed");
  });
});
