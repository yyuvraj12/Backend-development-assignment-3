const router = require("express").Router();
const c = require("../controllers/productController");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/low-stock", c.getLowStock);
router.get("/summary", c.getSummary);

router.route("/").post(c.createProduct).get(c.getProducts);
router.route("/:id").all(validateObjectId).get(c.getProduct).put(c.updateProduct).delete(c.deleteProduct);
router.patch("/:id/stock", validateObjectId, c.adjustStock);

module.exports = router;