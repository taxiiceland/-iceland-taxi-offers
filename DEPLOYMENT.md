# Iceland Taxi Offers Launch Notes

## Recommended Hosting

Use Vercel for the public launch. This website now uses Next.js API routes for booking email and saved availability, so it should be deployed as a normal Next.js app, not as a static-only export.

## Build Settings

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output folder: leave blank on Vercel. Vercel handles the `.next` output automatically.
- Start command: Vercel handles this automatically.

For local visual-only static preview, `STATIC_EXPORT=1 npm run build` still creates the `out` folder, but that mode does not run the public booking/email API.

## Required Environment Variables

Add these in Vercel Project Settings > Environment Variables:

```bash
NEXT_PUBLIC_SITE_URL=https://icelandtaxioffers.is
NEXT_PUBLIC_GA_ID=

ADMIN_USERNAME=choose_admin_username
ADMIN_PASSWORD=choose_strong_admin_password

BOOKING_EMAIL_TO=icelandtaxioffers@gmail.com
BOOKING_EMAIL_FROM=bookings@icelandtaxioffers.is
RESEND_API_KEY=your_resend_api_key

UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

`NEXT_PUBLIC_GA_ID` should stay empty until the real Google Analytics Measurement ID is created.

## Booking Email Setup

1. Create a Resend account.
2. Verify the sending domain you will use for the website.
3. Create an API key in Resend.
4. Add `RESEND_API_KEY` to Vercel.
5. Add `BOOKING_EMAIL_FROM`, for example `bookings@icelandtaxioffers.is`.
6. Keep `BOOKING_EMAIL_TO=icelandtaxioffers@gmail.com`.

After this is configured, every reserved booking sends an email to `icelandtaxioffers@gmail.com`.

## Booking Storage and Availability

Use Upstash Redis through the Vercel Marketplace or directly from Upstash.

1. Create an Upstash Redis database.
2. Copy the REST URL and REST token.
3. Add them to Vercel as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Saved bookings are used to block unavailable times after refresh. Manual unavailable times remain editable in `lib/availability.ts`.

## Admin Dashboard

The admin dashboard is available at `/admin` after deployment. It is protected by browser username/password login.

Add these variables in Vercel:

```bash
ADMIN_USERNAME=choose_admin_username
ADMIN_PASSWORD=choose_strong_admin_password
```

Use a strong password and keep it private.

## Custom Domain

Preferred public domain: `icelandtaxioffers.is`.

1. Buy or connect `icelandtaxioffers.is` in Vercel Project Settings > Domains.
2. Add both `icelandtaxioffers.is` and `www.icelandtaxioffers.is`.
3. Follow Vercel's DNS instructions for the root domain and `www` subdomain.
4. Keep `icelandtaxioffers.is` as the canonical domain. The site redirects `www.icelandtaxioffers.is` to `icelandtaxioffers.is`.
5. Set `NEXT_PUBLIC_SITE_URL=https://icelandtaxioffers.is` in Vercel after the domain is connected.
6. Redeploy the site.
7. Submit `https://icelandtaxioffers.is/sitemap.xml` in Google Search Console.

## Google Search Console

After deployment:

1. Open Google Search Console.
2. Add the public domain property.
3. Verify ownership using the DNS record Google provides.
4. Submit `/sitemap.xml`.
5. Check that `/robots.txt` is accessible.

## Google Analytics

After creating a Google Analytics property:

1. Copy the Measurement ID, for example `G-XXXXXXXXXX`.
2. Add it to Vercel as `NEXT_PUBLIC_GA_ID`.
3. Redeploy.

## Payment

No online payment is included. Payment is made after the ride by card using the taxi payment terminal or by cash.
