describe("SEO metadata", () => {
  it("publishes canonical social and profile metadata on the homepage", () => {
    cy.request("/")
      .its("body")
      .should("match", /<head>\s*<meta charset=/);
    cy.visit("/");

    cy.get('link[rel="canonical"]').should("have.attr", "href", "https://ekel.dev/");
    cy.get('meta[name="robots"]').should(
      "have.attr",
      "content",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );
    cy.get('meta[property="og:site_name"]').should("have.attr", "content", "ekel.dev");
    cy.get('meta[name="twitter:card"]').should("have.attr", "content", "summary_large_image");
    cy.get('script[type="application/ld+json"]')
      .invoke("text")
      .then((value) => {
        const graph = JSON.parse(value)["@graph"];
        expect(graph.some((entry: { "@type": string }) => entry["@type"] === "Person")).to.eq(true);
        expect(graph.some((entry: { "@type": string }) => entry["@type"] === "ProfilePage")).to.eq(
          true,
        );
      });
  });

  it("publishes article metadata for notes", () => {
    cy.visit("/notes/mengapa-saya-menggunakan-linux");

    cy.get('meta[property="og:type"]').should("have.attr", "content", "article");
    cy.get('meta[property="article:published_time"]').should("have.attr", "content");
    cy.get('link[rel="canonical"]')
      .invoke("attr", "href")
      .should("match", /^https:\/\/ekel\.dev\/notes\//);
  });

  it("publishes an installable web app manifest", () => {
    cy.visit("/");
    cy.get('link[rel="apple-touch-icon"]').should("have.attr", "href", "/icon-192.png");
    cy.get('link[rel="manifest"]')
      .invoke("attr", "href")
      .then((href) => cy.request(String(href)))
      .its("body")
      .then((body) => {
        const manifest = typeof body === "string" ? JSON.parse(body) : body;
        expect(manifest).to.include({ start_url: "/", display: "standalone" });
        const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
        expect(sizes).to.include.members(["192x192", "512x512"]);
        for (const icon of manifest.icons) {
          cy.request(icon.src).its("headers.content-type").should("eq", "image/png");
        }
      });
  });

  it("prevents error pages from being indexed", () => {
    cy.visit({ url: "/404", failOnStatusCode: false });
    cy.get('meta[name="robots"]').should("have.attr", "content", "noindex, nofollow");
  });
});
