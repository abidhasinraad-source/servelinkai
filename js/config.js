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
        badge: "AI Website Receptionist",
        setupPrice: "€249",
        setupDescription: "One-time setup fee",
        maintenancePrice: "€49 / mo",
        maintenanceNote: "Optional monitoring, minor updates & AI optimization",
        description: "For businesses that want to answer customer questions and capture new enquiries automatically.",
        popular: false,
        features: [
          "24/7 AI website assistant",
          "Business & service information",
          "FAQs & common customer questions",
          "Trained on your services, policies & service area",
          "Customer enquiry & lead capture",
          "Name, phone, email & location collection",
          "Lead storage & organization",
          "Google Sheets integration",
          "Human handoff to your team",
          "Basic conversation customization",
          "Website deployment",
          "14-day post-launch support"
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
        maintenancePrice: "€79 / mo",
        maintenanceNote: "Optional voice AI monitoring, optimization & workflow updates",
        description: "For businesses that want to handle both website and phone enquiries and turn them into qualified leads.",
        popular: true,
        features: [
          "Everything in Starter, plus:",
          "AI Voice Receptionist",
          "24/7 AI phone answering",
          "Customer call handling",
          "Voice-based lead capture",
          "Lead qualification",
          "Service / job categorization",
          "Job-specific questions",
          "Customer need & project detail collection",
          "Urgency / emergency detection",
          "Service-area qualification",
          "Appointment / booking requests",
          "Automated follow-ups",
          "Instant team lead notifications",
          "Advanced conversation flows",
          "Google Sheets / lead management integration",
          "Custom business rules",
          "30-day dedicated post-launch support"
        ],
        ctaText: "Choose Growth",
        ctaHref: "contact.html?package=growth"
      },
      {
        id: "pro",
        name: "Pro",
        badge: "AI Front Desk & Business Automation",
        setupPrice: "€699",
        setupDescription: "One-time setup fee",
        maintenancePrice: "€129 / mo",
        maintenanceNote: "Optional priority support, voice AI optimization & continuous enhancements",
        description: "For established home-service companies that need a complete AI customer communication system.",
        popular: false,
        features: [
          "Everything in Growth, plus:",
          "Advanced AI Voice Receptionist",
          "Advanced multi-service voice conversations",
          "Multiple service-area / location handling",
          "Advanced routing to the right team/person",
          "Custom business-specific workflows",
          "Booking workflow automation",
          "CRM integration",
          "Team SMS / WhatsApp alerts",
          "Advanced lead management",
          "Automated customer follow-ups",
          "Conversation analytics & reporting",
          "Advanced voice & chat customization",
          "Custom automation requirements",
          "Priority support",
          "60-day post-launch support"
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
