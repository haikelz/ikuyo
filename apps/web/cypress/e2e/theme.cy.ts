describe("Theme toggle", () => {
  function visitWithSystemTheme(matchesDark: boolean) {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.removeItem("theme");
        Object.defineProperty(win, "matchMedia", {
          writable: true,
          value: (query: string) => ({
            matches: query === "(prefers-color-scheme: dark)" ? matchesDark : false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          }),
        });
      },
    });
  }

  it("uses system light mode when no saved theme exists", () => {
    visitWithSystemTheme(false);
    cy.get("html").should("not.have.class", "dark");
    cy.window().its("localStorage.theme").should("eq", "system");
  });

  it("uses system dark mode when the OS prefers dark", () => {
    visitWithSystemTheme(true);
    cy.get("html").should("have.class", "dark");
    cy.window().its("localStorage.theme").should("eq", "system");
  });

  it("switches to light mode explicitly", () => {
    visitWithSystemTheme(true);
    cy.get('[data-cy="theme-toggle"]:visible').first().click();
    cy.get('[data-cy="theme-light"]').click();
    cy.get("html").should("not.have.class", "dark");
    cy.window().its("localStorage.theme").should("eq", "light");
  });

  it("switches to dark mode explicitly", () => {
    visitWithSystemTheme(false);
    cy.get('[data-cy="theme-toggle"]:visible').first().click();
    cy.get('[data-cy="theme-dark"]').click();
    cy.get("html").should("have.class", "dark");
    cy.window().its("localStorage.theme").should("eq", "dark");
  });

  it("persists the selected theme across page navigation", () => {
    visitWithSystemTheme(true);
    cy.get('[data-cy="theme-toggle"]:visible').first().click();
    cy.get('[data-cy="theme-light"]').click();
    cy.visit("/notes");
    cy.get("html").should("not.have.class", "dark");
    cy.window().its("localStorage.theme").should("eq", "light");
  });

  it("returns to system mode explicitly", () => {
    visitWithSystemTheme(true);
    cy.get('[data-cy="theme-toggle"]:visible').first().click();
    cy.get('[data-cy="theme-light"]').click();
    cy.get('[data-cy="theme-toggle"]').first().click({ force: true });
    cy.get('[data-cy="theme-system"]').click();
    cy.get("html").should("have.class", "dark");
    cy.window().its("localStorage.theme").should("eq", "system");
  });
});
