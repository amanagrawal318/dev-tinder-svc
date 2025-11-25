const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["subscription"],
      required: true,
      default: "subscription",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "succeeded",
        "canceled",
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
        "processing",
        "requires_capture",
      ],
      required: true,
      default: "pending",
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    stripe_payment_intent_id: {
      type: String,
    },
    subscriptionPlanType: {
      type: String,
      enum: ["SILVER", "GOLD"],
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
