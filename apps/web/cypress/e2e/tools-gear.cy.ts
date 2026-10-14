function renderedModel(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("webgl2");
  if (!context) throw new Error("The model must render in a real WebGL context.");
  const pixels = new Uint8Array(canvas.width * canvas.height * 4);
  context.readPixels(
    0,
    0,
    canvas.width,
    canvas.height,
    context.RGBA,
    context.UNSIGNED_BYTE,
    pixels,
  );
  let opaque = 0;
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] > 128) opaque++;
  }
  return { opaque, image: canvas.toDataURL() };
}

describe("Tools 3D desk gear", () => {
  for (const name of ["FiiO SNOWSKY ECHO MINI", "NOIR Timeless82 V1"]) {
    it(`renders ${name} and changes the actual image through its controls`, () => {
      cy.viewport(1280, 900);
      cy.visit("/tools");
      const figure = `figure[aria-label="${name} 3D viewer"]`;
      const canvas = `${figure} canvas`;
      cy.document().then((document) => {
        document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
      });
      cy.get(figure).scrollIntoView({ duration: 0 });
      cy.get(`${figure}[data-status="ready"]`, { timeout: 20000 });
      cy.get(`${figure} button`).first().should("not.be.disabled");
      cy.get<HTMLCanvasElement>(canvas)
        .should(([element]) => {
          expect(renderedModel(element).opaque, "visible model pixels").to.be.greaterThan(0);
        })
        .then(([element]) => {
          const initial = renderedModel(element);

          cy.get(`button[aria-label="Zoom in: ${name}"]`).focus().should("be.focused").click();
          cy.get<HTMLCanvasElement>(canvas).should(([current]) => {
            expect(renderedModel(current).opaque, "zoom in enlarges the model").to.be.greaterThan(
              initial.opaque,
            );
          });
          cy.get(`button[aria-label="Reset ${name} view"]`).click();
          cy.get<HTMLCanvasElement>(canvas).should(([current]) => {
            expect(renderedModel(current).image, "reset restores the original view").to.eq(
              initial.image,
            );
          });

          cy.get(`button[aria-label="Zoom out: ${name}"]`).click();
          let beforeRotation = "";
          cy.get<HTMLCanvasElement>(canvas)
            .should(([current]) => {
              expect(renderedModel(current).opaque, "zoom out shrinks the model").to.be.lessThan(
                initial.opaque,
              );
            })
            .then(([current]) => {
              beforeRotation = renderedModel(current).image;
            });
          cy.get(`button[aria-label="Rotate left: ${name}"]`).click();
          cy.get<HTMLCanvasElement>(canvas)
            .should(([current]) => {
              expect(renderedModel(current).image, "rotation changes the rendered model").not.to.eq(
                beforeRotation,
              );
            })
            .then(([current]) => {
              const rotated = renderedModel(current).image;
              cy.get(`button[aria-label="Show ${name} from above"]`)
                .click()
                .should("have.attr", "aria-pressed", "true");
              cy.get<HTMLCanvasElement>(canvas).should(([top]) => {
                expect(
                  renderedModel(top).image,
                  "top view changes the rendered camera angle",
                ).not.to.eq(rotated);
              });
            });

          cy.get(`button[aria-label="Reset ${name} view"]`).click();
          cy.get<HTMLCanvasElement>(canvas).should(([current]) => {
            expect(renderedModel(current).image).to.eq(initial.image);
          });
        });
      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
      });
      cy.get("#built-apps-title").should("contain.text", "Apps I've built");
      cy.get('a[href="https://transit.ekel.dev"]').should("exist");
    });
  }

  it("keeps device descriptions and app links readable without JavaScript or WebGL", () => {
    cy.request("/tools")
      .its("body")
      .should("contain", "Enable JavaScript to explore this 3D model.")
      .and("not.contain", "Loading 3D model");

    cy.visit("/tools", {
      onBeforeLoad(window) {
        const context = cy.stub(window.HTMLCanvasElement.prototype, "getContext").callThrough();
        context.withArgs("webgl2").returns(null);
        context.withArgs("webgl").returns(null);
      },
    });
    cy.document().then((document) => {
      document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
    });
    for (const kind of ["player", "keyboard"]) {
      cy.get(`[data-gear-model="${kind}"]`).scrollIntoView({ duration: 0 });
      cy.get(`[data-gear-model="${kind}"][data-status="unavailable"]`, { timeout: 20000 }).within(
        () => {
          cy.contains("3D is unavailable in this browser.").should("be.visible");
          cy.get("button").should("be.disabled");
        },
      );
    }
    cy.contains("FiiO SNOWSKY ECHO MINI").should("exist");
    cy.contains("NOIR Timeless82 V1").should("exist");
    cy.get('a[href="https://rata.ekel.dev"]').should("exist");
  });
});
