// Default Vercel function entry that wraps the Express app
// This allows Vercel to auto-detect the API without custom builds.
const app = require("../backend/index");

module.exports = app;
