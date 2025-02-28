require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
app.use(express.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	})
);

app.post("/create-checkout-session", async (req, res) => {
	const { products } = req.body;

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			success_url: "https://westafricanchow.shop/payment-success",
			cancel_url: "https://westafricanchow.shop/cart",
			line_items: products.map((item) => ({
				price_data: {
					currency: item.currency,
					product_data: { name: item.name },
					unit_amount: item.amount,
				},
				quantity: item.quantity,
			})),
		});

		res.json({ url: session.url });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(5000, () => console.log("Server running on port 5000"));
