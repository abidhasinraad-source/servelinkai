/**
 * ServeLinkAI - Central Configuration File
 * 
 * Edit this file to update agency details, pricing, social media links,
 * and integration credentials (Supabase, Voiceflow, Make.com).
 * 
 * IMPORTANT SECURITY NOTE:
 * Only use public/publishable API keys here (e.g. Supabase anon/publishable key).
 * NEVER expose secret keys, service_role keys, or private webhook tokens in client-side code.
 */

const CONFIG = {
  // Agency & Brand Details
  agency: {
    name: "ServeLinkAI",
    tagline: "AI Automation for Home-Service Businesses",
    positioning: "Capture, qualify, and manage customer enquiries automatically.",
    primaryService: "AI Website Receptionist",
    canonicalDomain: "https://www.servelinkai.com",
    contactEmail: "servelinkai@gmail.com", // [Editable Placeholder]
    phonePlaceholder: "+880 1783-889722", // [Editable Placeholder]
    operatingHours: "24/7 Automation Support",
    logoPath: "assets/images/servelinkai-logo.png",
    socialLinks: {
      linkedin: "https://linkedin.com/company/servelinkai", // [Editable Placeholder]
      twitter: "https://x.com/servelinkai",                 // [Editable Placeholder]
      github: "",
      facebook: "https://www.facebook.com/profile.php?id=61577540101651"
    }
  },

  // Pricing Packages (One-Time Setup + Optional Monthly Maintenance)
  pricing: {
    currencySymbol: "€",
    packages: [
      {
        id: "starter",
        name: "Starter",
        badge: "Essential Launch",
        setupPrice: "€249",
        setupDescription: "One-time setup fee",
        maintenancePrice: "€99 / mo",
        maintenanceNote: "Optional monthly maintenance & hosting",
        description: "Ideal for solo operators and small trade businesses wanting 24/7 automated enquiry capture.",
        popular: false,
        features: [
          "24/7 AI customer assistance",
          "Answers common customer questions",
          "Provides service and business information",
          "Collects customer contact details",
          "Captures new inquiries automatically",
          "Website chat assistant",
          "Human support when needed",
          "Google Sheets lead management",
          "Basic customization",
          "Basic Launch Support (14 Days)"
        ],
        ctaText: "Choose Starter",
        ctaHref: "contact.html?package=starter"
      },
      {
        id: "growth",
        name: "Growth",
        badge: "MOST POPULAR",
        setupPrice: "€399",
        setupDescription: "One-time setup fee",
        maintenancePrice: "€189 / mo",
        maintenanceNote: "Optional monthly optimization & maintenance",
        description: "Built for busy home-service contractors needing smart triage, urgency detection, and job routing.",
        popular: true,
        features: [
          "Everything in Starter",
          "Understands what the customer needs",
          "Asks the right questions before collecting a lead",
          "Identifies serious potential customers",
          "Collects service and project details",
          "Takes appointment or booking requests",
          "Sends new lead alerts",
          "Keeps customer information organized",
          "Automated customer follow-ups",
          "Dedicated 30-Day Launch Support"
        ],
        ctaText: "Choose Growth",
        ctaHref: "contact.html?package=growth"
      },
      {
        id: "pro",
        name: "Pro",
        badge: "Enterprise & Multi-Crew",
        setupPrice: "Custom Quote",
        setupDescription: "Custom scope & multi-territory setup",
        maintenancePrice: "Tailored",
        maintenanceNote: "Optional SLA maintenance & ongoing enhancements",
        description: "Engineered for established multi-van companies wanting end-to-end CRM synchronization and follow-up.",
        popular: false,
        features: [
          "Everything in Growth",
          "Handles different services separately",
          "Guides customers through complete conversations",
          "Handles booking-related questions",
          "Automatically follows up with potential customers",
          "Sends customers to the right person or team",
          "Handles multiple locations or service areas",
          "Custom business-specific automations",
          "Advanced customer support",
          "Dedicated Priority Support & SLA"
          "60 days support"
        ],
        ctaText: "Request Custom Quote",
        ctaHref: "contact.html?package=pro"
      }
    ]
  },

  // Supabase Configuration
  // Fill in your project URL and publishable anon key when ready.
  // The website functions fully as a static site if these are empty.
  supabase: {
    enabled: true, // Set to true after adding valid credentials
    url: "https://jmzgjkcslppynudfkbsl.supabase.co",
    anonKey: "sb_publishable_jbJIqZyVD7WYAQSxSyzZ0A_uCVf4Gs2",
    tableName: "leads",
    storage: {
      enabled: false,
      bucketName: "website-images",
      publicUrlBase: "" // e.g. "https://your-project.supabase.co/storage/v1/object/public/website-images"
    }
  },

  // Voiceflow Configuration
  // When ready to embed your live Voiceflow assistant on demo.html or globally,
  // set enabled to true and insert your Voiceflow project ID.
  voiceflow: {
    enabled: false, // Set to true when ready to load real Voiceflow widget
    projectID: "",  // Insert your Voiceflow Project ID here
    versionID: "production"
  },

  // Make.com Automation Configuration
  // Optional webhook URL to send incoming website enquiries for automated routing.
  make: {
    enabled: false, // Set to true after pasting your Make webhook URL
    webhookUrl: ""  // e.g. "https://hook.eu1.make.com/your-custom-webhook-id"
  }
};

// Freeze configuration in non-development environments to prevent accidental tampering
if (typeof Object.freeze === "function") {
  Object.freeze(CONFIG.pricing);
}
