describe("SEO metadata", () => {
  it("publishes canonical social and profile metadata on the homepage", () => {
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

  it("prevents error pages from being indexed", () => {
    cy.visit({ url: "/404", failOnStatusCode: false });
    cy.get('meta[name="robots"]').should("have.attr", "content", "noindex, nofollow");
  });
});
