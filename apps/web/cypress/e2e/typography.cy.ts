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
  { name: "mobile", width: 375, height: 812, headingSize: "24px" },
  { name: "tablet", width: 768, height: 1024, headingSize: "30px" },
  { name: "desktop", width: 1280, height: 900, headingSize: "30px" },
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
          const loaded = (family: string) =>
            Array.from(document.fonts).some(
              (font) => font.family.includes(family) && font.status === "loaded",
            );

          expect(fontFamily).to.contain("Inter");
          expect(loaded("Inter")).to.eq(true);
          expect(getComputedStyle(document.querySelector("h1")!).fontFamily).to.contain("Lora");
          expect(getComputedStyle(document.body).fontSize).to.eq("16px");
          expect(getComputedStyle(document.body).lineHeight).to.eq("26px");
          if (page.prose) {
            expect(getComputedStyle(document.querySelector("h1")!).fontSize).to.eq(
              viewport.headingSize,
            );
          }
          expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);

          if (page.prose) {
            const prose = document.querySelector(".prose");

            expect(prose).not.to.be.null;
            expect(getComputedStyle(prose!).fontSize).to.eq("16px");
            expect(getComputedStyle(prose!).lineHeight).to.eq("28.8px");
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
