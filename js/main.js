/**
 * ServeLinkAI - Main Application Controller
 * Handles FAQ accordions, pricing card synchronization, Supabase Storage image
 * mapping, and general utility behaviors.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Year in Footer
  const yearSpans = document.querySelectorAll(".current-year");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => {
    span.textContent = currentYear;
  });

  // 2. Accessible FAQ Accordions
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (questionBtn && answer) {
      questionBtn.addEventListener("click", () => {
        const isExpanded = questionBtn.getAttribute("aria-expanded") === "true";

        // Optional: close other open items in the same container for clean accordion feel
        const parentAccordion = item.closest(".faq-accordion");
        if (parentAccordion && !isExpanded) {
          parentAccordion.querySelectorAll(".faq-item").forEach((otherItem) => {
            if (otherItem !== item) {
              const otherBtn = otherItem.querySelector(".faq-question");
              const otherAnswer = otherItem.querySelector(".faq-answer");
              if (otherBtn && otherAnswer) {
                otherBtn.setAttribute("aria-expanded", "false");
                otherAnswer.style.maxHeight = null;
                otherItem.classList.remove("active");
              }
            }
          });
        }

        // Toggle current item
        if (isExpanded) {
          questionBtn.setAttribute("aria-expanded", "false");
          answer.style.maxHeight = null;
          item.classList.remove("active");
        } else {
          questionBtn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
          item.classList.add("active");
        }
      });
    }
  });

  // 3. Render Pricing Packages from Central CONFIG (ensures single source of truth)
  function renderPricingCards() {
    const containers = document.querySelectorAll(".dynamic-pricing-container");
    if (!containers.length || !CONFIG || !CONFIG.pricing || !CONFIG.pricing.packages) return;

    containers.forEach((container) => {
      container.innerHTML = "";
      CONFIG.pricing.packages.forEach((pkg) => {
        const isPopular = pkg.popular ? "popular-card" : "";
        const badgeHtml = pkg.popular
          ? `<span class="badge badge-popular">${pkg.badge}</span>`
          : pkg.badge
          ? `<span class="badge badge-standard">${pkg.badge}</span>`
          : "";

        const card = document.createElement("div");
        card.className = `pricing-card ${isPopular}`;
        card.innerHTML = `
          <div class="pricing-header">
            ${badgeHtml}
            <h3 class="package-name">${pkg.name}</h3>
            <p class="package-desc">${pkg.description}</p>
          </div>

          <div class="pricing-setup-block">
            <div class="pricing-label">Setup Investment</div>
            <div class="price-value">${pkg.setupPrice}</div>
            <div class="price-type">${pkg.setupDescription}</div>
          </div>

          <div class="pricing-maintenance-block">
            <div class="maintenance-label">Optional Monthly Maintenance</div>
            <div class="maintenance-val">${pkg.maintenancePrice}</div>
            <div class="maintenance-subtext">${pkg.maintenanceNote}</div>
          </div>

          <div class="pricing-features">
            <div class="features-heading">What's Included:</div>
            <ul class="feature-list">
              ${pkg.features.map((f) => `<li><span class="check-icon" aria-hidden="true">✓</span> <span>${f}</span></li>`).join("")}
            </ul>
          </div>

          <div class="pricing-footer">
            <a href="${pkg.ctaHref}" class="btn ${pkg.popular ? "btn-primary" : "btn-secondary"} btn-block">
              ${pkg.ctaText}
            </a>
          </div>
        `;
        container.appendChild(card);
      });
    });
  }

  renderPricingCards();

  // 4. Resolve Dynamic Supabase Storage Images if configured
  function resolveStorageImages() {
    if (typeof SupabaseService === "undefined" || !SupabaseService.getImageUrl) return;

    const storageImgs = document.querySelectorAll("img[data-storage-key]");
    storageImgs.forEach((img) => {
      const storageKey = img.getAttribute("data-storage-key");
      const fallbackSrc = img.getAttribute("src");
      if (storageKey) {
        const resolved = SupabaseService.getImageUrl(fallbackSrc, storageKey);
        if (resolved !== fallbackSrc) {
          img.src = resolved;
        }
      }
    });
  }

  resolveStorageImages();
});
