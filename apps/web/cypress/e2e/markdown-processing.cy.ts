describe("MDX processing", () => {
  it("renders configured code-block wrappers and filenames", () => {
    cy.visit("/notes/dari-zsh-ke-fish");

    cy.get(".code-block-wrapper [data-copy-button]").should("exist");
    cy.get(".code-block-filename").should("contain.text", "config.fish");
  });

  it("copies the full source and toggles wrap and long code expansion", () => {
    const clipboard = cy.stub().resolves();
    cy.visit("/notes/dari-zsh-ke-fish", {
      onBeforeLoad(window) {
        Object.defineProperty(window.navigator, "clipboard", { value: { writeText: clipboard }, configurable: true });
      },
    });
    cy.get("html").should("have.attr", "data-code-toolbar-ready");
    cy.document().then((document) => { document.documentElement.style.scrollBehavior = "auto"; });
    cy.contains(".code-block-filename", "config.fish").closest(".code-block-wrapper").as("code");
    cy.get("@code").find("pre code").invoke("text").then((text) => {
      expect(text).to.contain("set");
      cy.get("@code").find("[data-copy-button]").click();
      cy.wrap(clipboard).should("have.been.calledWithExactly", text);
    });
    cy.get("@code").find("[data-wrap-button]").click().should("have.attr", "aria-pressed", "true");
    cy.get("@code").find("pre code").should("have.css", "white-space", "pre-wrap");
    cy.get("@code").find("[data-expand-button]").click().should("have.attr", "aria-expanded", "true");
    cy.get("@code").find(".code-block-content").should("have.css", "max-height", "none");
    cy.get("@code").then(($code) => {
      cy.window().then((window) => window.scrollTo(0, $code[0].getBoundingClientRect().top + window.scrollY - 100));
    });
    cy.screenshot("reui-patterns/code-expanded", { capture: "viewport" });
    cy.get("@code").find("[data-expand-button]").click().should("have.attr", "aria-expanded", "false");
    cy.get("@code").find(".code-block-content").should("have.css", "max-height", "384px");
    for (const width of [1536, 375]) {
      cy.viewport(width, 900);
      cy.get("@code").then(($code) => {
        cy.window().then((window) => window.scrollTo(0, $code[0].getBoundingClientRect().top + window.scrollY - 100));
      });
      cy.screenshot(`reui-patterns/code-${width}`, { capture: "viewport" });
    }
  });

  it("marks the section being read in the existing table of contents", () => {
    cy.viewport(1536, 900);
    cy.visit("/notes/dari-zsh-ke-fish");
    cy.get('nav[aria-label="On this page"] [data-scrollspy-anchor]').should("have.length.greaterThan", 1);
    cy.get('nav[aria-label="On this page"] [data-scrollspy-anchor]').eq(1).invoke("attr", "data-scrollspy-anchor").then((slug) => {
      cy.get(`[id="${slug}"]`).then(($heading) => {
        cy.window().then((window) => {
          window.document.documentElement.style.scrollBehavior = "auto";
          window.scrollTo(0, $heading[0].getBoundingClientRect().top + window.scrollY - 100);
        });
      });
      cy.get(`nav[aria-label="On this page"] [data-scrollspy-anchor="${slug}"]`).should("have.attr", "aria-current", "location");
    });
    cy.screenshot("reui-patterns/scrollspy-desktop", { capture: "viewport" });
    cy.viewport(375, 812);
    cy.get('button[aria-label="Open table of contents"]').click();
    cy.get('[role="dialog"] [aria-current="location"]').should("be.visible");
    cy.screenshot("reui-patterns/scrollspy-mobile", { capture: "viewport" });
    cy.get('[role="dialog"] [aria-current="location"]').click();
    cy.get('[role="dialog"]').should("not.exist");
  });
});
