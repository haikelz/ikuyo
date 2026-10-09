function createYear(year: number) {
  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(Date.UTC(year, 0, 1 + index));
    return {
      date: date.toISOString().slice(0, 10),
      count: index % 5,
      level: index % 5,
    };
  });
}

const contributionResponse = {
  total: { "2025": 730, "2026": 730 },
  contributions: [...createYear(2026), ...createYear(2025)],
};

function interceptContributions(response: unknown = contributionResponse) {
  cy.intercept("GET", "https://github-contributions-api.jogruber.de/v4/haikelz?y=all", {
    statusCode: 200,
    body: response,
  }).as("contributions");
}

describe("Homepage GitHub contributions", () => {
  it("shows a calendar skeleton while contribution data loads", () => {
    cy.intercept("GET", "https://github-contributions-api.jogruber.de/v4/haikelz?y=all", {
      statusCode: 200,
      body: contributionResponse,
      delay: 5000,
    }).as("contributions");

    cy.visit("/");

    for (const width of [375, 768, 1280]) {
      cy.viewport(width, 900);
      cy.get('[data-cy="contribution-loading"]')
        .should("be.visible")
        .and("have.attr", "aria-label", "Loading activity calendar");
      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
      });
      cy.screenshot(`github-activity/home-loading-${width}`, { capture: "viewport" });
    }
    cy.contains("Loading activity…").should("not.exist");
    cy.wait("@contributions");
    cy.get('[data-cy="contribution-loading"]').should("not.exist");
  });

  it("replaces the hero statement with the parsed contribution calendar", () => {
    interceptContributions();
    cy.viewport(1280, 900);

    cy.visit("/");
    cy.wait("@contributions");

    cy.get("h1").should("have.text", "Haikel Ilham Hakim");
    cy.contains("I Build Systems That Move Products and Businesses Forward.").should("not.exist");
    cy.get('[data-cy="github-contributions"]')
      .should("not.contain.text", "GitHub Contributions")
      .and("not.contain.text", "@haikelz");
    cy.get('[data-cy="contribution-day"]').should("have.length", 365);
    cy.get('[data-cy="contribution-graph"]').then(($graph) => {
      cy.get('[data-cy="contribution-day"]')
        .last()
        .then(($lastDay) => {
          const graphRect = $graph[0].getBoundingClientRect();
          const lastDayRect = $lastDay[0].getBoundingClientRect();
          expect(graphRect.right - lastDayRect.right).to.be.lessThan(2);
        });
    });
    cy.get('[data-cy="github-contributions"]').scrollIntoView();
    cy.screenshot("github-activity/home-desktop", { capture: "viewport" });
    cy.get('[data-cy="contribution-day"]').first().trigger("mouseenter");
    cy.get('[data-cy="contribution-tooltip"]')
      .should("be.visible")
      .and("contain.text", "contribution")
      .and("contain.text", "2026");
    cy.screenshot("github-activity/home-desktop-tooltip", { capture: "viewport" });
  });

  it("switches the calendar data by year", () => {
    interceptContributions();

    cy.visit("/");
    cy.wait("@contributions");

    cy.get('[data-cy="activity-year-select"]').click();
    cy.get('[role="option"]').contains("2025").click();
    cy.get('[data-cy="activity-year-select"]').should("contain.text", "2025");
    cy.get('[data-cy="contribution-day"]').should("have.length", 365).first().trigger("mouseenter");
    cy.get('[data-cy="contribution-tooltip"]').should("contain.text", "2025");
  });

  it("aligns the year select with the open-to-work badge", () => {
    interceptContributions();

    cy.visit("/");
    cy.wait("@contributions");

    cy.get('[data-cy="open-to-work-badge"]')
      .should("be.visible")
      .and("contain.text", "#opentowork")
      .parent()
      .should("have.class", "flex")
      .and("have.class", "items-center")
      .find('[data-cy="activity-year-select"]')
      .should("be.visible");
  });

  it("contains horizontal graph overflow without overflowing the mobile page", () => {
    interceptContributions();
    cy.viewport(375, 812);

    cy.visit("/");
    cy.wait("@contributions");

    cy.get('[data-cy="contribution-scroll"]').then(($scroller) => {
      expect($scroller[0].scrollWidth).to.be.greaterThan($scroller[0].clientWidth);
    });
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.eq(document.documentElement.clientWidth);
    });
    cy.screenshot("github-activity/home-mobile", { capture: "viewport" });
  });

  it("shows an unavailable state for an invalid provider response", () => {
    interceptContributions({ total: { "2026": 42 }, contributions: "invalid" });

    cy.visit("/");
    cy.wait("@contributions");

    cy.contains("Activity is temporarily unavailable.").should("be.visible");
    cy.get('[data-cy="contribution-graph"]').should("not.exist");
  });

  it("opens job preferences with keyboard even when activity is unavailable", () => {
    interceptContributions({ contributions: "invalid" });
    cy.visit("/");
    cy.wait("@contributions");
    cy.get('[data-cy="open-to-work-badge"]').focus().type("{enter}");
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("Open to work").should("be.visible");
      for (const role of ["Fullstack Developer", "Backend Developer", "Frontend Developer", "Devops Engineer", "Software Engineer", "AI Engineer"]) {
        cy.contains("li", role).should("be.visible");
      }
      for (const stack of ["Next JS", "Javascript", "Typescript", "Golang", "Echo", "Fiber", "Gorm", "PostgreSQL", "MySQL", "Node JS", "Express JS", "Nest JS", "Hono JS", "Astro", "Svelte", "React", "CI/CD", "Docker", "Linux", "Kubernetes"]) {
        cy.contains("li", stack).should("exist");
      }
    });
    for (const width of [1280, 768, 375]) {
      const height = width === 375 ? 640 : 720;
      cy.viewport(width, height);
      cy.get('[role="dialog"]').should(($dialog) => {
        const rect = $dialog[0].getBoundingClientRect();
        expect(rect.left).to.be.at.least(0);
        expect(rect.right).to.be.at.most(width);
        expect(rect.top).to.be.at.least(0);
        expect(rect.bottom).to.be.at.most(height);
        expect($dialog[0].scrollWidth).to.eq($dialog[0].clientWidth);
      });
      cy.screenshot(`job-preferences/dialog-${width}`, { capture: "viewport" });
    }
    cy.viewport(375, 480);
    cy.get('[role="dialog"]').contains("button", "Close").click();
    cy.get('[role="dialog"]').should("not.exist");
    cy.get('[data-cy="open-to-work-badge"]').click();
    cy.get('[role="dialog"]').should(($dialog) => {
      expect($dialog[0].getBoundingClientRect().bottom).to.be.at.most(480);
    });
    cy.get('[data-cy="job-preferences-body"]').should(($body) => {
      expect($body[0].scrollHeight).to.be.greaterThan($body[0].clientHeight);
    });
    cy.get('[data-cy="job-preferences-body"]').invoke("css", "scroll-behavior", "auto").scrollTo("bottom");
    cy.get('[role="dialog"]').contains("li", "Kubernetes").should(($item) => {
      const item = $item[0].getBoundingClientRect();
      const body = $item[0].closest('[data-cy="job-preferences-body"]')!.getBoundingClientRect();
      expect(item.top).to.be.at.least(body.top);
      expect(item.bottom).to.be.at.most(body.bottom);
    });
    cy.get('[role="dialog"]').contains("button", "Close").should("be.visible");
    cy.screenshot("job-preferences/dialog-mobile-scrolled", { capture: "viewport" });
    cy.get('[role="dialog"] button').filter(':contains("Close")').focus().type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
    cy.get('[data-cy="open-to-work-badge"]').should("be.focused").click();
    cy.get('[role="dialog"]').contains("button", "Close").click();
    cy.get('[role="dialog"]').should("not.exist");
  });
});
