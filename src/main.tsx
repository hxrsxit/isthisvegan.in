import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Give priority to the PWA registration
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);


//TODO: start blogging in the site, discover audience. setup instagram(maybe change the page's name to isthisvegan if I get good response).
//      try to maybe automate the blogging thing.
//TODO: Maybe keep the logo text from 'Is This Vegan?' to be 'Is This \n Vegan?'
//TODO: Improve the other pages design and make it similar to landing page UI.
       // applicabl for both text and colors and fonts.
//TODO: Amazon affiliate link should be added to the product page.
//TODO: Add more products to the database. and improve existing products data.
//TODO: Add Smriti's column. A proper website of her own with subpages in IsThisVegan.in/Smriti
//TODO: Sort product caraousal (coming down to search bar) by number of available products in Database.


//TODO: Buy me a Black Tea (or something funky) page so that people can buy me a tea and
//TODO: suppose if burger is there We can categorize which vendor's burger is vegan and which is not.
//      support my work and also have a way to contact me. Google response below :


/*
The Amazon Associates Loop (Your hidden goldmine):
You already have an amazon_search_url column in your Supabase database! This is your biggest immediate earner.
Sign up for the Amazon Associates India program (it’s free). They will give you a special tracking ID.
You update your Supabase links to include that ID. Whenever someone searches for a snack, clicks your "Check Price / Buy on Amazon" button,
and buys anything on Amazon within the next 24 hours, you get a 2% to 9% commission on their entire cart.

Direct Community Support (The "Tip Jar"):
People in niche communities love supporting independent developers who build tools that solve their daily headaches.
Set up a Buy Me a Coffee page or just generate a sleek UPI QR code.
Place a very clean, unobtrusive button in your footer or on the "Join Us" page that says,
"If this tool saved you from reading a tiny label today, consider buying the developer a chai to keep the servers running."

Monetizing the "Our Work" Gallery:
You are already setting up a gallery to showcase your posters, bookmarks, and visual designs for vegan spaces.
Don't just show them—sell them. You can add a simple "Hire Me for Campaign Art" button, or use a print-on-demand service in India
(like Blinkstore or Printo) to let people buy your posters directly from the site.

Ethical Brand Sponsorships:
Once your Google Search Console is set up and you start getting a few hundred regular users,
completely bypass AdSense. Reach out to Indian vegan brands directly (like Epigamia, GoodDot, or local cloud kitchens).
Offer them a flat-rate "Featured Placement" at the very top of your search results for a monthly fee.
It keeps the UI clean, the ads relevant, and the money direct.
*/