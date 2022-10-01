const express = require('express');
const app = express();
const Stripe = require('stripe')
const stripe=Stripe("sk_test_51Ladv0AZGr8G8sZORCE2xS8weJsdWKaFUmTdSY6rcp5eBF5Wh52ZnCHKQKylRlXhaj5MQnTvvSnECwYISNpLM1AA00j6nat2of")


app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
    });

    res.redirect(303, session.url);
});
