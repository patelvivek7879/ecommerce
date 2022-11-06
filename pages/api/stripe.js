import { webpack } from '../../next.config';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body);
        try {

            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    {
                        shipping_rate: 'shr_1M1AJdSH3F8k95l8mgrW1jyQ',
                        shipping_rate: 'shr_1M1ALBSH3F8k95l8ellGxNzx',
                    }
                ],
                line_items: req.body.map((item)=>{
                    const img = item.image[0].asset._ref;
                    const newImg = img.replace('image-', 'https://cdn.sanity.io/images/0vwwwa94/production/').replace('-webpack','.webp')
                    
                    return{
                        price_data:{
                            currency: 'INR',
                            product_data:{
                                name: item.name,
                                images: [newImg],
                            },
                            unit_amount: item.price * 100,
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity
                    }
                  }),
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/canceled`,
            }

            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create(params);
            // res.redirect(303, session.url);
            res.status(200).json(session);
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}