# GoCart 🛒

**GoCart** is a full-stack, multi-vendor e-commerce platform built with Next.js. Customers can browse products, add them to a cart, and check out securely with Stripe. Sellers get their own dashboard to add products — with AI-assisted listing generation — and manage stock. Admins approve new stores and manage coupons.

🔗 **Live Demo:** [ecommerce-omega-seven-24.vercel.app](https://ecommerce-omega-seven-24.vercel.app)

---

## ✨ Features

- 🔐 Authentication with subscription plans (Clerk) — including a "Plus" membership tier
- 🛍️ Product browsing, search, and multi-vendor storefronts
- 🛒 Persistent shopping cart synced between Redux (instant UI) and the database (source of truth)
- 💳 Secure checkout via Stripe (hosted checkout, webhook-verified payment confirmation)
- 🏪 Seller dashboard to create a store, add products, and manage stock
- 🤖 AI-assisted product listings — upload a photo and auto-generate a name & description (Google Gemini via the OpenAI SDK)
- 🖼️ Optimized image hosting and on-the-fly transformations via ImageKit
- 🎟️ Coupon system with automatic expiry (event-driven background jobs)
- 🧑‍🤝‍🧑 Multi-session support — safely switch between multiple logged-in accounts in one browser
- 📱 Fully responsive design (mobile + desktop)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) | Frontend pages **and** backend API routes in one project |
| Database | PostgreSQL, hosted on [Neon](https://neon.tech/) | Stores users, products, orders, stores, coupons, etc. |
| ORM | [Prisma](https://www.prisma.io/) | Type-safe database queries from JavaScript instead of raw SQL |
| Auth | [Clerk](https://clerk.com/) | Sign-up, login, sessions, and subscription/billing plans |
| Client State | Redux Toolkit | Global cart, address, and product state across components |
| Background Jobs | [Inngest](https://www.inngest.com/) | Event-driven jobs — user sync from Clerk, delayed coupon expiry |
| Payments | [Stripe](https://stripe.com/) | Hosted checkout + webhook-verified payment confirmation |
| Images | [ImageKit](https://imagekit.io/) | Image CDN with automatic compression/format optimization |
| AI | OpenAI SDK pointed at Google Gemini | Multimodal (image + text) product listing generation |
| Hosting | [Vercel](https://vercel.com/) | Auto-deploys on every push to `main` |

---

## 🧠 How a Request Flows (example: adding an address)

```
Browser (Client Component)
  └─ User submits a form
       └─ axios.post('/api/address', { address }, { headers: { Authorization: `Bearer <token>` } })
            └─ app/api/address/route.js → export async function POST(request)
                 ├─ getAuth(request)              → identify the logged-in user (Clerk)
                 ├─ await request.json()          → parse the request body
                 ├─ prisma.address.create({...})  → persist to Neon Postgres
                 └─ NextResponse.json({ ... })     → send the result back
       └─ dispatch(addAddress(data.newAddress))   → Redux updates the UI instantly
```

Next.js App Router lets a single project act as both frontend and backend — every `route.js` inside `app/api/...` is effectively its own API endpoint, no separate server needed.

---

## 📂 Project Structure

```
gocart/
├── app/
│   ├── api/                 # Backend API routes
│   │   ├── address/          # Address CRUD
│   │   ├── store/ai/         # AI-assisted product listing generation
│   │   ├── stripe/           # Stripe webhook handler
│   │   └── inngest/          # Inngest event handler
│   ├── store/                # Seller dashboard pages (protected)
│   └── ...                    # Public pages: home, shop, cart, orders, product/[productId]
├── components/               # Reusable UI components (Navbar, etc.)
├── inngest/functions.js      # Background job definitions
├── lib/
│   ├── prisma.js              # Shared Prisma Client instance
│   └── store.js               # Redux store configuration
├── prisma/schema.prisma      # Database schema (source of truth)
└── public/                    # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Accounts/API keys for: [Clerk](https://clerk.com/), [Neon](https://neon.tech/), [Stripe](https://stripe.com/), [ImageKit](https://imagekit.io/), [Inngest](https://www.inngest.com/), and Google Gemini

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Neharika-2310/ecommerce.git
   cd ecommerce/gocart
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env` file in the `gocart` directory:
   ```env
   # Database
   DATABASE_URL=your_neon_postgres_connection_string

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
   CLERK_SECRET_KEY=your_secret_here

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_key
   IMAGEKIT_PRIVATE_KEY=your_key
   IMAGEKIT_URL_ENDPOINT=your_url_endpoint

   # AI (Gemini via OpenAI-compatible endpoint)
   OPENAI_API_KEY=your_gemini_api_key
   OPENAI_BASE_URL=your_gemini_openai_compatible_base_url

   # Inngest
   INNGEST_EVENT_KEY=your_key
   INNGEST_SIGNING_KEY=your_key
   ```

4. Push the database schema
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

Deployed on [Vercel](https://vercel.com/), auto-deploying on every push to `main`. Since the Next.js app lives inside the `gocart` subfolder rather than the repo root, Vercel's **Root Directory** setting is configured to `gocart`. Environment variables are set directly in the Vercel dashboard rather than committed to the repo.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or an issue.

---

## 📄 License

This project is currently unlicensed. Add a license of your choice if you plan to open-source it (e.g. MIT).