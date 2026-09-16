const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {

    const account = await Account.findOne({
        userId: req.userId
    });

    if (!account) {
        return res.status(400).json({
            message: "Account not found"
        });
    }

    res.json({
        balance: account.balance
    });
});


router.post("/transfer", authMiddleware, async (req, res) => {

    const { amount, to } = req.body;

    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
        return res.status(400).json({
            message: "Invalid amount"
        });
    }

    const account = await Account.findOne({
        userId: req.userId
    });

    if (!account) {
        return res.status(400).json({
            message: "Sender account not found"
        });
    }

    if (account.balance < transferAmount) {
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({
        userId: to
    });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    account.balance = account.balance - transferAmount;
    toAccount.balance = toAccount.balance + transferAmount;

    await account.save();
    await toAccount.save();

    res.json({
        message: "Transfer successful"
    });
});


module.exports = router;