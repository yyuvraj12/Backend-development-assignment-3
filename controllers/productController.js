const Product = require("../models/Product");

const httpError = (status, message) => Object.assign(new Error(message), { status });
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const escape = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.createProduct = wrap(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

exports.getProducts = wrap(async (req, res) => {
  const { category, supplier, search, minPrice, maxPrice, inStock, sort } = req.query;
  const filter = {};
  if (category) filter.category = new RegExp(`^${escape(category)}$`, "i");
  if (supplier) filter.supplier = new RegExp(escape(supplier), "i");
  if (search) filter.name = new RegExp(escape(search), "i");
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (inStock === "true") filter.quantity = { $gt: 0 };

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const sortBy = sort ? sort.split(",").join(" ") : "-createdAt";

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit),
  ]);
  res.json({ total, page, totalPages: Math.ceil(total / limit), count: products.length, products });
});

exports.getProduct = wrap(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json(product);
});

exports.updateProduct = wrap(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!product) throw httpError(404, "Product not found");
  res.json(product);
});

exports.adjustStock = wrap(async (req, res) => {
  const { change } = req.body;
  if (!Number.isInteger(change) || change === 0) throw httpError(400, "'change' must be a non-zero integer");

  const filter = { _id: req.params.id };
  if (change < 0) filter.quantity = { $gte: -change };

  const product = await Product.findOneAndUpdate(filter, { $inc: { quantity: change } }, { returnDocument: "after" });
  if (!product) {
    const exists = await Product.exists({ _id: req.params.id });
    throw exists ? httpError(400, "Insufficient stock") : httpError(404, "Product not found");
  }
  res.json({ message: "Stock updated", product });
});

exports.deleteProduct = wrap(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json({ message: "Product deleted", id: product.id });
});

exports.getLowStock = wrap(async (req, res) => {
  const lowStockItems = await Product.find({ $expr: { $lte: ["$quantity", "$reorderLevel"] } }).sort("quantity");
  res.json({ count: lowStockItems.length, lowStockItems });
});

exports.getSummary = wrap(async (req, res) => {
  const summary = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        avgPrice: { $avg: "$price" },
      },
    },
    { $sort: { totalStockValue: -1 } },
  ]);
  res.json({ categories: summary.length, summary });
});