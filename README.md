# SAAS to implement the OpenAi api into a Next.js application
![Screenshot 2024-06-02 at 21 23 43](https://github.com/raulcanodev/openai-api-nextjs-to-generate-blogs/assets/118123543/8b23713d-c9ce-4016-bf8e-d744c4e066e2)


## Testing Payment Process with Stripe ##
To test the payment process using Stripe, follow these steps:

Install Stripe CLI:

Follow the Stripe CLI installation guide.
Start Webhook Listener:

Run the following command in your terminal to forward webhooks to your local server:

```sh
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Configure Your Application: ##

Ensure your application is set up to handle webhooks at /api/webhooks/stripe.

## Test the Setup: ##

Perform a test transaction and verify that Stripe events are received and processed correctly.
