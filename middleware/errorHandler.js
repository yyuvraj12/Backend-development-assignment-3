exports.notFound = (req, res) =>
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });

exports.errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Validation failed", details: Object.values(err.errors).map((e) => e.message) });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: `Duplicate value for: ${Object.keys(err.keyValue).join(", ")}` });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid value for ${err.path}` });
  }
  res.status(err.status || 500).json({ error: err.message || "Server error" });
};