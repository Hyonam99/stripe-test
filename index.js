require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to connect

app.post("/create-checkout-session", async (req, res) => {
	const { lineItems } = req.body;

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			success_url: "https://westafricanchow.shop/",
			cancel_url: "https://westafricanchow.shop/cart",
			line_items: lineItems.map((item) => ({
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
