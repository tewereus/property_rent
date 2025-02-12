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
const {
  getSaleTransaction,
  getRentTransaction,
} = require("../controllers/adminCtrl");

router.get("/sale-transaction", getSaleTransaction);
router.get("/rent-transaction", getRentTransaction);
router.use(authMiddleware); // All transaction routes require authentication

router.post("/create", createTransaction);
router.get("/user-transactions", getUserTransactions);
router.get("/:id", getTransaction);
router.put("/:id/status", updateTransactionStatus);
router.put("/:id/cancel", cancelTransaction);

module.exports = router;
