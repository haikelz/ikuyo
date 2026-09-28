export {};

const pages = [
  { name: "home", path: "/", prose: false },
  {
    name: "notes-detail",
    path: "/notes/dari-zsh-ke-fish",
    prose: true,
  },
  {
    name: "works-detail",
    path: "/works/spmb-universitas-cakrawala",
    prose: true,
  },
  {
    name: "experience-detail",
    path: "/experiences/pt-shidiq-membangun-indonesia",
    prose: true,
  },
];

const viewports = [
  { name: "mobile", width: 375, height: 812, headingSize: "32px" },
  { name: "tablet", width: 768, height: 1024, headingSize: "48px" },
  { name: "desktop", width: 1280, height: 900, headingSize: "48px" },
];

describe("Site typography", () => {
  for (const viewport of viewports) {
    it(`keeps the type system legible at ${viewport.name} width`, () => {
      cy.viewport(viewport.width, viewport.height);

      for (const page of pages) {
        cy.visit(page.path);
        cy.get("h1").should("be.visible");
        cy.document().then(async (document) => {
          await document.fonts.ready;

          const fontFamily = getComputedStyle(document.documentElement).fontFamily;
          const plusJakartaFace = Array.from(document.fonts).find((font) =>
            font.family.includes("Plus Jakarta Sans"),
          );

          expect(fontFamily).to.contain("Plus Jakarta Sans");
          expect(plusJakartaFace?.status).to.eq("loaded");
          expect(getComputedStyle(document.body).fontSize).to.eq("17px");
          expect(getComputedStyle(document.body).lineHeight).to.eq("29.75px");
          if (page.prose) {
            expect(getComputedStyle(document.querySelector("h1")!).fontSize).to.eq(
              page.name === "experience-detail"
                ? viewport.name === "mobile"
                  ? "32px"
                  : "40px"
                : viewport.headingSize,
            );
          }
          expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);

          if (page.prose) {
            const prose = document.querySelector(".prose");

            expect(prose).not.to.be.null;
            expect(getComputedStyle(prose!).fontSize).to.eq("17px");
            expect(getComputedStyle(prose!).lineHeight).to.eq("32px");
          }

          if (page.name === "experience-detail") {
            for (const item of document.querySelectorAll('[data-cy="experience-highlights"] li')) {
              const index = item.children.item(0);
              const copy = item.children.item(1);

              expect(index).not.to.be.null;
              expect(copy).not.to.be.null;
              if (index && copy) {
                expect(index.getBoundingClientRect().right).to.be.lessThan(
                  copy.getBoundingClientRect().left,
                );
              }
            }
          }
        });

        cy.screenshot(`typography/${page.name}-${viewport.name}`, {
          capture: "viewport",
        });
      }
    });
  }
});
