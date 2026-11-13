NEPLORA ELECTRONICS - React (Vite) site

Windows CMD:
  cd neplora-electronics
  npm install
  npm run dev        (opens http://localhost:5173)
  npm run build      (creates ONE file: dist\index.html, upload it anywhere)

Edit products/prices in src\products.js. Product photos live in src\assets\products\<id>.webp
Change the WhatsApp number at the top of src\App.jsx (const WA).


NEPLORA UPDATE NOTES
- Mobile hero has a dedicated vertical layout; desktop keeps the two-column composition.
- Mobile navigation includes a menu button and category links.
- Added a compact three-step ordering strip between the hero and catalogue.
- Catalogue initially displays 8 products on mobile and 12 on desktop.
- Customers can load more products in batches or reveal the complete filtered catalogue.
- Detailed How to Order section remains below the catalogue.
- Existing products, product images, prices, size options, cart and WhatsApp checkout are preserved.

Run locally:
1. Open this folder in CMD.
2. Run: npm install
3. Run: npm run dev
4. Open the localhost URL printed by Vite.
