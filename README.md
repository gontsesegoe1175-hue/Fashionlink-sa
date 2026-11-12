# FashionLink SA — starter marketplace

A responsive, installable-web-app starter for a South African fashion freelance marketplace.

## Included
- Responsive landing page and designer directory with search/category/city filters
- Supabase email/password sign-up and login UI
- Supabase profile directory read integration
- SQL starter schema for profiles, portfolio, projects, proposals and reviews
- Initial Row Level Security policies and a public portfolio image bucket
- PWA manifest and service worker shell cache

## 1. Configure Supabase
1. Open `config.js`.
2. Paste your Supabase project URL and **publishable** key into the two fields.
3. Never put a `service_role` or secret key in `config.js` or any browser code.
4. In Supabase Dashboard → SQL Editor, review and run `supabase/schema.sql`.
5. In Authentication → URL Configuration, add your local/deployed site URL to Site URL and Redirect URLs.
6. In Authentication settings, decide whether email confirmation is required and configure SMTP before launch.

## 2. Run locally
Serve this folder from a local web server (not `file://`). For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## 3. Important production work still required
This is a working frontend starter, not yet a complete production marketplace. Before public launch, implement and test: profile editing, portfolio upload UI, project CRUD, proposal acceptance, messaging, notifications, admin moderation, payment webhooks/escrow rules, KYC provider server-side integration, rate limiting, abuse reporting, privacy/terms, POPIA compliance review, backups and end-to-end tests.

KYC documents and identity data must not be stored in public profile rows or a public storage bucket. Store only a minimal verification status/reference and keep provider secrets on a trusted server. Verify webhook signatures.

The included RLS is a starting point and must be reviewed against the final product rules. In particular, add stronger state-transition rules and tests before handling real money or identity verification.
