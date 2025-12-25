// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      hero: {
        titlePrefix: "Book Your Perfect",
        titleHighlight: "Football Field",
        subtitle: "Reserve top-quality football fields in minutes. Play anytime, anywhere.",
        browseFields: "Browse Fields",
        getStarted: "Get Started",
        hire: "Hire Referees & Volunteers"
      },
      stats: {
        fieldsAvailable: "Fields Available",
        happyPlayers: "Happy Players",
        bookingSupport: "Booking Support"
      },
      features: {
        title: "Why Choose Us?",
        subtitle: "Everything you need for a perfect game",
        premiumFields: { title: "Premium Fields", desc: "Top-quality grass and turf fields maintained to professional standards for the best playing experience." },
        easyBooking: { title: "Easy Booking", desc: "Book in seconds with our intuitive platform. Real-time availability and instant confirmation." },
        flexiblePricing: { title: "Flexible Pricing", desc: "Competitive rates with hourly and package options. No hidden fees, transparent pricing." }
      },
      howItWorks: {
        title: "How It Works",
        subtitle: "Book your field in 3 simple steps",
        step1: { title: "Choose Your Field", desc: "Browse available fields in your area and select your preferred location" },
        step2: { title: "Pick Date & Time", desc: "Select your preferred date and time slot from available options" },
        step3: { title: "Confirm & Play", desc: "Complete your booking and get instant confirmation. Ready to play!" }
      },
      cta: {
        title: "Ready to Play?",
        subtitle: "Join thousands of players who trust us for their football field bookings",
        button: "Create Free Account"
      },
      search: {
        searchFootballFields: "Search Football Fields",
        findAndBook: "Find and book the perfect field for your game",
        searchFilters: "Search Filters",
        location: "Location",
        locationPlaceholder: "e.g., Dhaka, Gulshan",
        minPrice: "Min Price (BDT/hour)",
        minPricePlaceholder: "e.g., 1000",
        maxPrice: "Max Price (BDT/hour)",
        maxPricePlaceholder: "e.g., 3000",
        timeSlot: "Time Slot",
        anyTime: "Any Time",
        hasSwimmingPool: "Has Swimming Pool",
        sortBy: "Sort By",
        default: "Default",
        priceLowHigh: "Price: Low to High",
        priceHighLow: "Price: High to Low",
        highestRated: "Highest Rated",
        searchFields: "Search Fields",
        searching: "Searching...",
        resetFilters: "Reset Filters",
        found: "Found",
        fields: "fields",
        failedToLoad: "Failed to load fields",
        failedToConnect: "Failed to connect to server",
        searchFailed: "Search failed",
        searchFailedTryAgain: "Failed to search fields. Please try again."
      },
      weather: {
        title: "Weather Update",
        warning: "Bad weather is expected. Please be careful."
      },
      staffHiring: {
        title: "Hire Referees / Volunteers",
        role: "Role",
        location: "Location",
        availability: "Availability",
        available: "Available",
        notAvailable: "Not Available",
        hireButton: "Hire",
        releaseButton: "Release",
        hiredSuccess: "Staff hired successfully!",
        hiredFailed: "Failed to hire staff. Try again.",
        releasedSuccess: "Staff released successfully!",
        releasedFailed: "Failed to release staff. Try again.",
        loading: "Loading staff...",
        noStaff: "No staff available at the moment."
      },
      ai: {
        title: "AI Assistant",
        welcome: "Hello! How can I help you today?",
        placeholder: "Ask something...",
        send: "Send",
        book: "You can book football fields from the Fields page.",
        price: "Prices depend on field and time slot.",
        staff: "You can hire referees and volunteers from the Staff Hiring page.",
        weather: "Weather updates are shown before booking.",
        help: "I can help you with booking, prices, staff, and weather.",
        default: "Sorry, I didn’t understand that. Please try again."
      }   
    }
  },
  bn: {
    translation: {
      hero: {
        titlePrefix: "আপনার পছন্দের",
        titleHighlight: "ফুটবল মাঠ বুক করুন",
        subtitle: "মিনিটে শীর্ষমানের ফুটবল মাঠ বুক করুন। যেকোনো সময় খেলুন।",
        browseFields: "মাঠ দেখুন",
        getStarted: "শুরু করুন",
        hire: "রেফারি ও ভলান্টিয়ার নিয়োগ করুন"
      },
      stats: {
        fieldsAvailable: "প্রাপ্য মাঠ",
        happyPlayers: "সন্তুষ্ট খেলোয়াড়",
        bookingSupport: "২৪/৭ বুকিং সাপোর্ট"
      },
      features: {
        title: "কেন আমাদের বেছে নেবেন?",
        subtitle: "একটি নিখুঁত খেলার জন্য যা যা প্রয়োজন",
        premiumFields: { title: "প্রিমিয়াম মাঠ", desc: "শীর্ষমানের ঘাস ও টার্ফ মাঠ, পেশাদার মান অনুযায়ী রক্ষণাবেক্ষণ।" },
        easyBooking: { title: "সহজ বুকিং", desc: "আমাদের সহজ প্ল্যাটফর্ম দিয়ে কয়েক সেকেন্ডে বুক করুন। বাস্তব সময়ে উপলব্ধতা ও নিশ্চিতকরণ।" },
        flexiblePricing: { title: "নমনীয় মূল্য", desc: "ঘণ্টা ভিত্তিক এবং প্যাকেজ অপশনসহ প্রতিযোগিতামূলক হার। কোনো গোপন ফি নেই।" }
      },
      howItWorks: {
        title: "কীভাবে কাজ করে",
        subtitle: "৩ সহজ ধাপে আপনার মাঠ বুক করুন",
        step1: { title: "আপনার মাঠ নির্বাচন করুন", desc: "আপনার এলাকার উপলব্ধ মাঠ ব্রাউজ করুন এবং পছন্দসই মাঠ নির্বাচন করুন" },
        step2: { title: "তারিখ ও সময় নির্বাচন করুন", desc: "উপলব্ধ বিকল্প থেকে আপনার পছন্দসই সময় নির্বাচন করুন" },
        step3: { title: "নিশ্চিত করুন ও খেলুন", desc: "আপনার বুকিং সম্পন্ন করুন এবং তাৎক্ষণিক নিশ্চিতকরণ পান। খেলার জন্য প্রস্তুত!" }
      },
      cta: {
        title: "খেলার জন্য প্রস্তুত?",
        subtitle: "হাজারো খেলোয়াড় যারা আমাদের উপর বিশ্বাস রাখে তাদের সাথে যোগ দিন",
        button: "বিনামূল্যে অ্যাকাউন্ট তৈরি করুন"
      },
      search: {
        searchFootballFields: "ফুটবল মাঠ অনুসন্ধান করুন",
        findAndBook: "আপনার খেলার জন্য নিখুঁত মাঠ খুঁজুন এবং বুক করুন",
        searchFilters: "অনুসন্ধান ফিল্টার",
        location: "অবস্থান",
        locationPlaceholder: "যেমন, ঢাকা, গুলশান",
        minPrice: "ন্যূনতম মূল্য (BDT/ঘণ্টা)",
        minPricePlaceholder: "যেমন, 1000",
        maxPrice: "সর্বোচ্চ মূল্য (BDT/ঘণ্টা)",
        maxPricePlaceholder: "যেমন, 3000",
        timeSlot: "সময়ের ফাঁক",
        anyTime: "যেকোনো সময়",
        hasSwimmingPool: "সুইমিং পুল আছে",
        sortBy: "সাজানোর ধরন",
        default: "ডিফল্ট",
        priceLowHigh: "মূল্য: কম থেকে বেশি",
        priceHighLow: "মূল্য: বেশি থেকে কম",
        highestRated: "সর্বোচ্চ রেটযুক্ত",
        searchFields: "মাঠ অনুসন্ধান করুন",
        searching: "অনুসন্ধান চলছে...",
        resetFilters: "ফিল্টার রিসেট করুন",
        found: "মিলেছে",
        fields: "মাঠ",
        failedToLoad: "মাঠ লোড করতে ব্যর্থ",
        failedToConnect: "সার্ভারের সাথে সংযোগ ব্যর্থ",
        searchFailed: "অনুসন্ধান ব্যর্থ",
        searchFailedTryAgain: "মাঠ খুঁজতে ব্যর্থ। পুনরায় চেষ্টা করুন।"
      },
      weather: {
        title: "আবহাওয়ার তথ্য",
        warning: "খারাপ আবহাওয়ার সম্ভাবনা রয়েছে। সতর্ক থাকুন।"
      },
      staffHiring: {
        title: "রেফারি / ভলান্টিয়ার নিয়োগ",
        role: "পদ",
        location: "অবস্থান",
        availability: "উপলব্ধতা",
        available: "উপলব্ধ",
        notAvailable: "উপলব্ধ নয়",
        hireButton: "নিয়োগ করুন",
        releaseButton: "মুক্ত করুন",
        hiredSuccess: "স্টাফ সফলভাবে নিয়োগ করা হয়েছে!",
        hiredFailed: "স্টাফ নিয়োগ করতে ব্যর্থ। পুনরায় চেষ্টা করুন।",
        releasedSuccess: "স্টাফ সফলভাবে মুক্ত করা হয়েছে!",
        releasedFailed: "স্টাফ মুক্ত করতে ব্যর্থ। পুনরায় চেষ্টা করুন।",
        loading: "স্টাফ লোড হচ্ছে...",
        noStaff: "এই মুহূর্তে কোনো স্টাফ নেই।"
      },
      ai: {
        title: "এআই সহকারী",
        welcome: "হ্যালো! আমি কীভাবে সাহায্য করতে পারি?",
        placeholder: "প্রশ্ন লিখুন...",
        send: "পাঠান",
        book: "মাঠ বুক করতে Fields পেজে যান।",
        price: "মূল্য মাঠ ও সময়ের উপর নির্ভর করে।",
        staff: "রেফারি ও ভলান্টিয়ার নিয়োগ Staff Hiring পেজ থেকে করা যাবে।",
        weather: "বুকিংয়ের আগে আবহাওয়ার তথ্য দেখানো হয়।",
        help: "আমি বুকিং, মূল্য, স্টাফ ও আবহাওয়া নিয়ে সাহায্য করতে পারি।",
        default: "দুঃখিত, আমি বুঝতে পারিনি। আবার চেষ্টা করুন।"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;


