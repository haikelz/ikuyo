module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: "bun run preview -- --host 0.0.0.0",
      startServerReadyPattern: "Local",
      url: ["http://localhost:4321/"],
    },
  },
};
