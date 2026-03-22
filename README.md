# ChopEasy 🍛

> Food Vendor Order & Business Manager for Nigerian food sellers

Nigeria's informal food economy is massive — mama put restaurants, caterers, small chops vendors, and home chefs run billion-naira businesses entirely on WhatsApp voice notes and paper receipts. ChopEasy brings it all into one clean dashboard.

## Real Problem Solved
- Food vendors lose track of orders during busy periods
- No way to know which items sell most (guesswork buying)
- Revenue tracking is manual or nonexistent
- WhatsApp orders get missed or duplicated

## Features
- 🛒 **New Order Modal**: Add customer name, channel (walk-in/WhatsApp/call), pick items from menu, see running total
- 📋 **Order Board**: Kanban-style status flow — Pending → Preparing → Ready → Delivered
- 🍽️ **Menu Manager**: Toggle item availability on/off, add new items, mark bestsellers
- 📊 **Analytics Dashboard**:
  - Today's revenue
  - Average order value
  - Top selling items (bar chart)
  - Orders by channel (Walk-in vs WhatsApp vs Call)
  - Revenue breakdown by status
- 🔔 Active order count badge in header
- 🟢 Open/Closed status toggle

## Sample Menu Included
Jollof Rice, Fried Rice, Egusi, Pounded Yam, Small Chops, Chicken, Fish, Zobo, and more — all pre-loaded with realistic Naira prices.

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **Fraunces + Manrope** fonts (bold food brand aesthetic)

## Getting Started
```bash
npm install
npm run dev
```

## Deploy on Vercel
1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Deploy — no environment variables needed!

## Extend It
- Add localStorage / Supabase for persistent orders
- WhatsApp order intake via Twilio or WA Business API
- Daily/weekly sales summary sent via email
- Print receipt as PDF
- Table/seat number tracking for dine-in
- Loyalty points for repeat customers
