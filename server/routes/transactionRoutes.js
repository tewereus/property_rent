const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getUserTransactions,
  getTransaction,
  updateTransactionStatus,
  cancelTransaction,
} = require("../controllers/transactionCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware); // All transaction routes require authentication

router.post("/create", createTransaction);
router.get("/user-transactions", getUserTransactions);
router.get("/:id", getTransaction);
router.put("/:id/status", updateTransactionStatus);
router.put("/:id/cancel", cancelTransaction);

module.exports = router;
