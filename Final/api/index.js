// Default Vercel function entry that wraps the Express app
// Export a handler to ensure compatibility with Vercel's Node runtime
const app = require("../backend/index");

module.exports = (req, res) => app(req, res);
