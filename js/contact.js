/**
 * ServeLinkAI - Contact Form Controller & Lead Handler
 * Connects directly to Supabase via js/supabase.js, supports Make.com webhook,
 * and handles client-side validation and feedback states.
 */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("lead-contact-form");
  const formStatus = document.getElementById("form-status-alert");
  const submitButton = document.getElementById("contact-submit-btn");

  if (!contactForm) return;

  // Auto-select package or service from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const packageParam = urlParams.get("package");
  const serviceParam = urlParams.get("service");
  const industryParam = urlParams.get("industry");

  const serviceSelect = document.getElementById("service-select");
  const industrySelect = document.getElementById("industry-select");
  const challengeTextarea = document.getElementById("challenge-input");

  if (packageParam && serviceSelect) {
    const formatted = packageParam.charAt(0).toUpperCase() + packageParam.slice(1);
    const match = Array.from(serviceSelect.options).find(opt => opt.value.toLowerCase().includes(packageParam.toLowerCase()));
    if (match) {
      serviceSelect.value = match.value;
    } else {
      serviceSelect.value = `Package: ${formatted}`;
    }
  } else if (serviceParam && serviceSelect) {
    const match = Array.from(serviceSelect.options).find(opt => opt.value.toLowerCase().includes(serviceParam.toLowerCase()));
    if (match) serviceSelect.value = match.value;
  }

  if (industryParam && industrySelect) {
    const match = Array.from(industrySelect.options).find(opt => opt.value.toLowerCase().includes(industryParam.toLowerCase()));
    if (match) industrySelect.value = match.value;
  }

  // Clear specific field errors on input
  contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      field.classList.remove("field-error");
      const errSpan = document.getElementById(`${field.id}-error`);
      if (errSpan) errSpan.textContent = "";
      if (formStatus) formStatus.className = "status-alert hidden";
    });
  });

  // Client-side validation
  function validateForm(formData) {
    let isValid = true;

    // Name validation
    const name = formData.get("name")?.trim();
    if (!name || name.length < 2) {
      showFieldError("name-input", "Please enter your full name.");
      isValid = false;
    }

    // Business Name validation
    const business = formData.get("business_name")?.trim();
    if (!business || business.length < 2) {
      showFieldError("business-input", "Please enter your company or trade name.");
      isValid = false;
    }

    // Email validation
    const email = formData.get("email")?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFieldError("email-input", "Please provide a valid business email address.");
      isValid = false;
    }

    // Phone validation
    const phone = formData.get("phone")?.trim();
    if (!phone || phone.length < 7) {
      showFieldError("phone-input", "Please provide a contact phone number or WhatsApp.");
      isValid = false;
    }

    // Industry validation
    const industry = formData.get("industry");
    if (!industry || industry === "") {
      showFieldError("industry-select", "Please select your primary trade or service.");
      isValid = false;
    }

    return isValid;
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("field-error");
      const errSpan = document.getElementById(`${fieldId}-error`);
      if (errSpan) {
        errSpan.textContent = message;
      }
    }
  }

  function setStatus(type, message) {
    if (!formStatus) return;
    formStatus.className = `status-alert status-${type}`;
    formStatus.innerHTML = `
      <div class="status-content">
        <span class="status-icon">${type === "success" ? "✓" : "!"}</span>
        <div class="status-message">${message}</div>
      </div>
    `;
    formStatus.classList.remove("hidden");
    formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Handle Submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    if (!validateForm(formData)) {
      setStatus("error", "Please complete all required fields correctly before submitting.");
      return;
    }

    // Set loading state on button
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = `<span class="spinner"></span> Submitting Enquiry...`;
    }

    const leadPayload = {
      name: formData.get("name"),
      business_name: formData.get("business_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      website: formData.get("website") || "",
      industry: formData.get("industry"),
      service: formData.get("service") || "AI Website Receptionist",
      contact_method: formData.get("contact_method") || "Email",
      challenge: formData.get("challenge") || "",
      message: formData.get("message") || ""
    };

    try {
      const response = await SupabaseService.submitLead(leadPayload);

      if (response && response.success) {
        setStatus("success", response.message || "Thank you! Your enquiry has been received.");
        contactForm.reset();

        // Optional post-submit confirmation banner
        const cardBody = document.querySelector(".contact-form-wrapper");
        if (cardBody && response.isSimulated) {
          console.info("[ServeLinkAI] Enquiry captured in offline/preview mode. Supabase can be activated anytime in js/config.js.");
        }
      } else {
        setStatus("error", "There was an issue processing your request. Please email us directly at " + (CONFIG.agency.contactEmail || "hello@servelinkai.com"));
      }
    } catch (err) {
      console.error("[ServeLinkAI] Submission handler exception:", err);
      setStatus("error", "Unable to send enquiry right now. Please verify your connection or reach us via email.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = `Submit Inbound Enquiry <span class="btn-arrow" aria-hidden="true">→</span>`;
      }
    }
  });
});
