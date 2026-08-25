const availableMarket = {
  code: "US",
  label: "America",
  title: "S&P 500",
  symbol: "GSPC",
  source: "Test market source",
  fetchedAt: "2026-08-23T00:00:00Z",
  data: [
    {
      date: "2026-08-20",
      open: 7900,
      high: 7950,
      low: 7880,
      close: 7930,
      volume: 1_000_000,
    },
    {
      date: "2026-08-21",
      open: 7930,
      high: 8010,
      low: 7910,
      close: 7990,
      volume: 1_200_000,
    },
  ],
};

const marketResponse = {
  code: 200,
  message: "market data retrieved successfully",
  data: [
    {
      code: "ID",
      label: "Indonesia",
      title: "IDX Composite (IHSG)",
      symbol: "IHSG",
      source: "Test market source",
      fetchedAt: "2026-08-23T00:00:00Z",
      data: [],
      errorMessage: "Data Indonesia belum tersedia dari penyedia data.",
    },
    availableMarket,
  ],
};

function visitIHSG() {
  cy.visit("/ihsg", {
    onBeforeLoad(window) {
      window.addEventListener("astro:hydration-error", (event) => {
        throw (event as CustomEvent<{ error: unknown }>).detail.error;
      });
    },
  });
}

describe("IHSG market data", () => {
  it("falls back to an available market after a successful response", () => {
    cy.intercept("GET", "**/api/v1/ihsg/markets", marketResponse).as("markets");

    visitIHSG();
    cy.wait("@markets");

    cy.contains("S&P 500").should("be.visible");
    cy.contains("7.990,00").should("be.visible");
    cy.contains("Gagal Memuat Data Market").should("not.exist");
  });

  it("distinguishes unavailable provider data from a failed request", () => {
    cy.intercept("GET", "**/api/v1/ihsg/markets", {
      ...marketResponse,
      data: [marketResponse.data[0]],
    }).as("markets");

    visitIHSG();
    cy.wait("@markets");

    cy.contains("Data Market Belum Tersedia").should("be.visible");
    cy.contains("Data Indonesia belum tersedia dari penyedia data.").should("be.visible");
    cy.contains("Gagal Memuat Data Market").should("not.exist");
  });
});
