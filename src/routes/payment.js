const express = require("express");
const paymentRouter = express.Router();
const Stripe = require("stripe");
const Payment = require("../Models/Payment");
const { userAuth } = require("../Middleware/auth");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Replace this

paymentRouter.post("/create-payment", userAuth, async (req, res) => {
  try {
    const { user } = req;
    const { plan } = req.body; // amount in paise (for INR)

    if (!plan || !plan.type || !plan.amount) {
      return res.status(400).json({ error: "Invalid plan details" });
    }

    const stripeItem = [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: plan.type,
          },
          unit_amount: Math.round(plan.amount * 100),
        },
        quantity: 1,
      },
    ];

    const result = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.firstName + " " + user.lastName,
        planType: plan.type,
      },
      line_items: stripeItem,
      success_url: "http://localhost:5173/payment-status",
      cancel_url: "http://localhost:5173/payment-status",
      customer_email: user.email,
    });

    const payment = new Payment({
      userId: user._id.toString(),
      amount: plan.amount,
      paymentType: "subscription",
      status: "pending",
      stripeSessionId: result.id,
      subscriptionPlanType: plan.type,
    });
    await payment.save();

    res.json({ url: result.url, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

paymentRouter.get("/membership/payment-status", userAuth, async (req, res) => {
  try {
    const { user } = req;

    // Fetch the latest payment info for the user
    const paymentInfo = await Payment.findOne({ userId: user._id }).sort({
      purchasedAt: -1,
    });

    if (!paymentInfo) {
      return res.status(404).json({ error: "No payment information found for the user." });
    }

    // Retrieve the Stripe session and payment intent
    const session = await stripe.checkout.sessions.retrieve(paymentInfo.stripeSessionId);
    if (!session || !session.payment_intent) {
      return res.status(404).json({ error: "Stripe session or payment intent not found." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    if (!paymentIntent) {
      return res.status(404).json({ error: "Stripe payment intent not found." });
    }

    // Update payment info only if the status has changed
    if (paymentInfo.status !== paymentIntent.status) {
      paymentInfo.status = paymentIntent.status;
      paymentInfo.stripe_payment_intent_id = paymentIntent.id;
      paymentInfo.purchasedAt = new Date(paymentIntent.created * 1000);
      await paymentInfo.save();
    }

    // Update user premium status if payment succeeded
    if (paymentIntent.status === "succeeded" && !user.isPremium) {
      user.isPremium = true;
      user.planType = paymentInfo.subscriptionPlanType;
      await user.save();
    }

    // Respond with the updated payment info
    res.json(paymentInfo);
  } catch (err) {
    console.error("Error in payment status route:", err);
    res.status(500).json({ error: "An error occurred while fetching payment status." });
  }
});

module.exports = paymentRouter;
