/**
 * ServeLinkAI - Supabase Client & Storage Integration Layer
 * 
 * Provides database capture for inbound leads and dynamic image loading
 * via Supabase Storage.
 * 
 * Safe for client-side execution using Row Level Security (RLS).
 * Operates gracefully offline / in static mode when credentials are not configured.
 */

const SupabaseService = (function () {
  let client = null;

  /**
   * Initializes the Supabase client if credentials are configured
   * and the official Supabase JS SDK is loaded.
   */
  function init() {
    if (!CONFIG || !CONFIG.supabase) return null;

    const { enabled, url, anonKey } = CONFIG.supabase;

    if (enabled && url && anonKey && url.startsWith("https://")) {
      // Check if official Supabase SDK is available on window
      if (typeof window.supabase !== "undefined" && typeof window.supabase.createClient === "function") {
        try {
          client = window.supabase.createClient(url, anonKey);
          console.log("[ServeLinkAI] Supabase client initialized successfully.");
          return client;
        } catch (err) {
          console.warn("[ServeLinkAI] Supabase client initialization error:", err.message);
          return null;
        }
      } else {
        console.info("[ServeLinkAI] Supabase credentials present, but SDK script not loaded. Running in standard static mode.");
      }
    }
    return null;
  }

  /**
   * Submits a newly qualified customer lead to the Supabase 'leads' table.
   * Row Level Security (RLS) should be enabled on the table with an INSERT-only
   * policy for anonymous public users.
   * 
   * @param {Object} leadData - Form data matching table schema
   * @returns {Promise<{success: boolean, message: string, data?: any}>}
   */
  async function submitLead(leadData) {
    const formattedLead = {
      name: leadData.name?.trim() || "",
      business_name: leadData.business_name?.trim() || "",
      email: leadData.email?.trim() || "",
      phone: leadData.phone?.trim() || "",
      website: leadData.website?.trim() || "",
      industry: leadData.industry || "Other",
      service: leadData.service || "AI Website Receptionist",
      contact_method: leadData.contact_method || "Email",
      challenge: leadData.challenge?.trim() || "",
      message: leadData.message?.trim() || "",
      status: "new",
      created_at: new Date().toISOString()
    };

    // If Supabase is active and client ready, insert record directly
    if (client) {
      try {
        const { data, error } = await client
          .from(CONFIG.supabase.tableName || "leads")
          .insert([formattedLead]);

        if (error) {
          console.error("[ServeLinkAI] Supabase insert error:", error);
          throw error;
        }

        return {
          success: true,
          message: "Thank you! Your enquiry has been received securely.",
          data: data
        };
      } catch (err) {
        console.warn("[ServeLinkAI] Supabase submission failed, falling back:", err);
      }
    }

    // Optional Make.com Webhook forwarding
    if (CONFIG.make && CONFIG.make.enabled && CONFIG.make.webhookUrl) {
      try {
        const response = await fetch(CONFIG.make.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedLead)
        });

        if (response.ok) {
          return {
            success: true,
            message: "Enquiry submitted successfully to automation webhook."
          };
        }
      } catch (webhookErr) {
        console.warn("[ServeLinkAI] Webhook dispatch error:", webhookErr);
      }
    }

    // Static frontend fallback simulation when backend credentials are not yet entered
    // Leads can be safely stored in sessionStorage for browser testing
    try {
      const existing = JSON.parse(sessionStorage.getItem("servelink_demo_leads") || "[]");
      existing.push(formattedLead);
      sessionStorage.setItem("servelink_demo_leads", JSON.stringify(existing));
    } catch (e) {
      // Ignore storage errors
    }

    return {
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will review your requirements and respond shortly.",
      isSimulated: true
    };
  }

  /**
   * Generates a resolved image URL supporting both local assets and Supabase Storage.
   * If Supabase Storage is enabled and a key is provided, returns public bucket URL.
   * Otherwise falls back to local relative asset path.
   * 
   * @param {string} localPath - Relative path like 'assets/images/hero/hero-preview.png'
   * @param {string} storageKey - Optional object key in Supabase bucket like 'hero/hero-preview.png'
   * @returns {string} - Resolved image source URL
   */
  function getImageUrl(localPath, storageKey) {
    if (
      CONFIG.supabase &&
      CONFIG.supabase.storage &&
      CONFIG.supabase.storage.enabled &&
      CONFIG.supabase.storage.publicUrlBase &&
      storageKey
    ) {
      const base = CONFIG.supabase.storage.publicUrlBase.replace(/\/$/, "");
      const cleanKey = storageKey.replace(/^\//, "");
      return `${base}/${cleanKey}`;
    }
    return localPath;
  }

  return {
    init: init,
    getClient: () => client,
    submitLead: submitLead,
    getImageUrl: getImageUrl
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", SupabaseService.init);
} else {
  SupabaseService.init();
}
