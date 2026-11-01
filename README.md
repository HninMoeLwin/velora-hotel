# Velora Hotel Booking — React Project

## Technology
- React 18 + Vite
- Tailwind CSS
- lucide-react icons
- Browser localStorage (no backend/database)

## Features
- Admin overview dashboard
- Booking requests, status filters, search, confirm/cancel
- Room categories: Single, Double, Twin, Family, VIP, Deluxe
- Add/edit/delete room categories, price, capacity, bed setup, image, amenities, status
- Room-level discount percentages
- Promo code creation, activation/pause and deletion
- Guest directory and hotel settings
- Separate admin and guest accounts, with admin account management and confirmed-booking guest registration
- Booking date-overlap validation for the same room category
- Responsive layout and mobile sidebar

## Run
1. Extract the ZIP and open the folder in VS Code.
2. Open the terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the URL printed by Vite.

## Notes
This is a front-end learning/demo project with no backend, payment processing, or email service. Account and demo data persist in the same browser's localStorage, so accounts are not shared across browsers or devices and this authentication is not suitable for production.

- Admin demo login: `admin@velorahotel.com` / `demo123`
- The demo admin is seeded into **User Management** on first load. Admins can create, edit, activate/deactivate, and delete admin accounts there; at least one active admin is required.
- Guests can create their own account from **Guest sign in** only with an email that has a confirmed booking, then choose a password. Guests can access only their guest dashboard.
