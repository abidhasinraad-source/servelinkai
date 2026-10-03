/**
 * ServeLinkAI - Interactive Demo Controller
 * Powers the interactive conversational simulations for Plumbing, Electrical, and HVAC,
 * demonstrating instant enquiry qualification, urgency detection, and lead capture.
 * Also handles real Voiceflow widget embedding when configured.
 */

const DemoScenarios = {
  plumbing: {
    title: "Roofing Service Demonstration",
    subtitle: "Storm Damage & Leak Qualification",
    initialMessage: "Hello! Welcome to Apex Roofing Solutions. How can we help you today?",
    steps: [
      {
        userText: "I have a leak in my roof after last night's storm.",
        aiResponse: "Sorry to hear that. Is water currently coming through into your ceiling or attic right now?",
        options: ["Yes, water is actively coming through", "No, but I can see damage from outside", "Not sure, need an inspection"]
      },
      {
        userText: "Yes, water is actively coming through the ceiling.",
        aiResponse: "That needs priority attention. What postcode or town are you located in?",
        options: ["North London (N1)", "Central Manchester (M1)", "South Birmingham (B15)", "Other Area"]
      },
      {
        userText: "North London (N1 area)",
        aiResponse: "We have roofing engineers active in that area today. When would you prefer someone to arrive?",
        options: ["Immediate emergency callout (within 2 hours)", "This afternoon between 2pm-5pm", "Tomorrow morning"]
      },
      {
        userText: "Immediate emergency callout if possible.",
        aiResponse: "Understood. Please confirm your name and best phone number so our on-call technician can confirm arrival time with you immediately.",
        options: ["Sarah Jenkins — 07700 900123", "Provide my contact details"]
      },
      {
        userText: "Sarah Jenkins, 07700 900123, sarah.j@example.com",
        aiResponse: "Thank you, Sarah. Your emergency enquiry is registered. A priority technician notification has been dispatched to our on-call roofer, and you'll receive a direct confirmation call within 10 minutes.",
        isFinal: true,
        extractedLead: {
          customerName: "Sarah Jenkins",
          phone: "07700 900123",
          email: "sarah.j@example.com",
          service: "Emergency Roofing / Storm Damage Leak",
          location: "North London (N1)",
          urgency: "HIGH — Active Water Ingress",
          status: "Qualified & Dispatched to On-Call Roofer"
        }
      }
    ]
  },
    
  electrical: {
    title: "Electrical Service Demonstration",
    subtitle: "Tripping Fuse Board Triage",
    initialMessage: "Hi there! Thanks for reaching BrightSpark Electrical. How can we assist with your electrical project or issue?",
    steps: [
      {
        userText: "My fuse board keeps tripping every time we turn on the oven or heating.",
        aiResponse: "That sounds like an overloaded circuit or an earth fault. Is the main power currently staying on for the rest of your home?",
        options: ["Main power is on, only the kitchen circuit trips", "The entire house has lost power", "Smoke or burning smell noticed"]
      },
      {
        userText: "Main power is on, only the kitchen circuit trips repeatedly.",
        aiResponse: "Thank you for clarifying. Is this for a residential home or a commercial property, and what is your location?",
        options: ["Residential 3-bed home (Leeds LS6)", "Commercial property", "Rental property with tenants"]
      },
      {
        userText: "Residential home in Leeds (LS6).",
        aiResponse: "Understood. Would you like an electrician to inspect and fault-find this week?",
        options: ["Tomorrow morning (9am - 12pm)", "Today if any cancellation opens", "Flexible later this week"]
      },
      {
        userText: "Tomorrow morning works best.",
        aiResponse: "Great. Please provide your contact details (Name, Phone & Email) so we can reserve that inspection slot for you.",
        options: ["David Miller — 07890 123456", "Provide custom details"]
      },
      {
        userText: "David Miller, 07890 123456, david.m@example.com",
        aiResponse: "All set, David! Your request has been logged with our diagnostic team. You will receive an SMS confirmation with your scheduled appointment window shortly.",
        isFinal: true,
        extractedLead: {
          customerName: "David Miller",
          phone: "07890 123456",
          email: "david.m@example.com",
          service: "Electrical Fault Diagnosis & Consumer Unit",
          location: "Leeds (LS6)",
          urgency: "MEDIUM — Intermittent Trip / Power Partial",
          status: "Qualified & Scheduled Inspection"
        }
      }
    ]
  },

  hvac: {
    title: "HVAC Service Demonstration",
    subtitle: "Heat Pump & Cooling Breakdown",
    initialMessage: "Welcome to ClimateTech Heating & Air. Need urgent repair, routine servicing, or a new system quote?",
    steps: [
      {
        userText: "Our central heating boiler is showing an error code and isn't firing up.",
        aiResponse: "We can help diagnose that. What brand and error code is showing on the front display if visible?",
        options: ["Worcester Bosch error EA / no flame", "Vaillant F22 / low pressure", "Not sure, screen is blank"]
      },
      {
        userText: "Worcester Bosch showing error code EA.",
        aiResponse: "Code EA indicates a flame detection fault. Are you currently without hot water and heating?",
        options: ["Yes, completely without heating and hot water", "Heating is down, but hot water works", "Routine quote request"]
      },
      {
        userText: "Yes, completely without heating and hot water in cold weather.",
        aiResponse: "Understood. That qualifies for our priority cold-weather dispatch. What is your address or postcode?",
        options: ["Bristol area (BS8)", "Bath area (BA1)", "Gloucester area (GL1)"]
      },
      {
        userText: "Bristol area (BS8).",
        aiResponse: "We have Gas Safe heating engineers in Bristol today. Please provide your name and phone number to arrange immediate engineer routing.",
        options: ["Emma Watson — 07911 234567", "Send my details"]
      },
      {
        userText: "Emma Watson, 07911 234567, emma.w@example.com",
        aiResponse: "Thank you, Emma. Your priority ticket has been pushed directly to our local Bristol heating technician with the Worcester Bosch error EA diagnostic notes attached. We will call you within 15 minutes.",
        isFinal: true,
        extractedLead: {
          customerName: "Emma Watson",
          phone: "07911 234567",
          email: "emma.w@example.com",
          service: "HVAC / Boiler Breakdown (Worcester EA)",
          location: "Bristol (BS8)",
          urgency: "HIGH — Priority No Heat / Cold Weather",
          status: "Qualified & Dispatched to Gas Safe Engineer"
        }
      }
    ]
  }
};

class InteractiveDemo {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentScenarioKey = "roofing";
    this.currentStepIndex = 0;
    this.chatBody = this.container.querySelector(".demo-messages");
    this.chipContainer = this.container.querySelector(".demo-chips");
    this.leadPreview = document.getElementById("demo-lead-card");
    this.tabButtons = document.querySelectorAll(".demo-tab-btn");

    this.init();
  }

  init() {
    this.bindTabs();
    this.loadScenario(this.currentScenarioKey);
  }

  bindTabs() {
    this.tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const scenario = btn.getAttribute("data-scenario");
        if (scenario && DemoScenarios[scenario]) {
          this.tabButtons.forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
          this.loadScenario(scenario);
        }
      });
    });
  }

  loadScenario(scenarioKey) {
    this.currentScenarioKey = scenarioKey;
    this.currentStepIndex = 0;
    const scenario = DemoScenarios[scenarioKey];

    if (!scenario || !this.chatBody) return;

    // Reset chat messages
    this.chatBody.innerHTML = `
      <div class="chat-bubble chat-ai">
        <div class="bubble-avatar" aria-hidden="true">AI</div>
        <div class="bubble-text">
          <p>${scenario.initialMessage}</p>
          <span class="bubble-time">Just now</span>
        </div>
      </div>
    `;

    // Reset lead preview card to pending
    this.updateLeadCard(null, scenario.title);

    // Render first prompt options
    this.renderStepOptions(0);
  }

  renderStepOptions(stepIdx) {
    if (!this.chipContainer) return;
    const scenario = DemoScenarios[this.currentScenarioKey];
    const step = scenario.steps[stepIdx];

    this.chipContainer.innerHTML = "";

    if (!step) {
      // Completed scenario: show reset button
      const resetBtn = document.createElement("button");
      resetBtn.className = "demo-chip reset-chip";
      resetBtn.innerHTML = `↺ Restart this simulation`;
      resetBtn.addEventListener("click", () => this.loadScenario(this.currentScenarioKey));
      this.chipContainer.appendChild(resetBtn);
      return;
    }

    step.options.forEach((optText) => {
      const chip = document.createElement("button");
      chip.className = "demo-chip";
      chip.textContent = optText;
      chip.addEventListener("click", () => this.handleUserChoice(optText, stepIdx));
      this.chipContainer.appendChild(chip);
    });
  }

  handleUserChoice(chosenText, stepIdx) {
    const scenario = DemoScenarios[this.currentScenarioKey];
    const step = scenario.steps[stepIdx];

    // Disable chips while processing
    if (this.chipContainer) {
      this.chipContainer.innerHTML = `<span class="demo-typing-notice">AI Receptionist is qualifying enquiry...</span>`;
    }

    // Add user bubble
    this.appendMessage("user", chosenText);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      this.appendMessage("ai", step.aiResponse);

      if (step.isFinal && step.extractedLead) {
        this.updateLeadCard(step.extractedLead, scenario.title);
      }

      this.currentStepIndex = stepIdx + 1;
      this.renderStepOptions(this.currentStepIndex);
    }, 600);
  }

  appendMessage(sender, text) {
    if (!this.chatBody) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-${sender}`;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (sender === "ai") {
      bubble.innerHTML = `
        <div class="bubble-avatar" aria-hidden="true">AI</div>
        <div class="bubble-text">
          <p>${text}</p>
          <span class="bubble-time">${now}</span>
        </div>
      `;
    } else {
      bubble.innerHTML = `
        <div class="bubble-text">
          <p>${text}</p>
          <span class="bubble-time">${now}</span>
        </div>
      `;
    }

    this.chatBody.appendChild(bubble);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  updateLeadCard(leadData, scenarioTitle) {
    if (!this.leadPreview) return;

    if (!leadData) {
      this.leadPreview.innerHTML = `
        <div class="lead-card-header">
          <div class="lead-badge badge-pending">Awaiting Inbound Enquiry</div>
          <span class="lead-source">${scenarioTitle}</span>
        </div>
        <div class="lead-card-body">
          <p class="lead-placeholder-text">
            As the customer answers questions, ServeLinkAI automatically extracts and qualifies details into a clean dispatch record.
          </p>
          <div class="lead-skeleton-row"></div>
          <div class="lead-skeleton-row short"></div>
          <div class="lead-skeleton-row"></div>
        </div>
      `;
      return;
    }

    this.leadPreview.innerHTML = `
      <div class="lead-card-header">
        <div class="lead-badge badge-success">✓ Lead Qualified & Ready</div>
        <span class="lead-source">${scenarioTitle}</span>
      </div>
      <div class="lead-card-body">
        <div class="lead-field">
          <span class="lead-label">Customer Name</span>
          <span class="lead-val font-semibold">${leadData.customerName}</span>
        </div>
        <div class="lead-field">
          <span class="lead-label">Contact Details</span>
          <span class="lead-val">${leadData.phone} • ${leadData.email}</span>
        </div>
        <div class="lead-field">
          <span class="lead-label">Service Required</span>
          <span class="lead-val highlight">${leadData.service}</span>
        </div>
        <div class="lead-field">
          <span class="lead-label">Location</span>
          <span class="lead-val">${leadData.location}</span>
        </div>
        <div class="lead-field">
          <span class="lead-label">Triage & Urgency</span>
          <span class="lead-val urgency-val">${leadData.urgency}</span>
        </div>
        <div class="lead-field">
          <span class="lead-label">Routing Status</span>
          <span class="lead-val text-success">${leadData.status}</span>
        </div>
        <div class="lead-card-actions">
          <a href="contact.html?service=${encodeURIComponent(leadData.service)}" class="btn btn-sm btn-primary">
            Deploy This Workflow For Your Trade →
          </a>
        </div>
      </div>
    `;
  }
}

// Voiceflow Embed Loader Helper
function initVoiceflowWidget() {
  if (!CONFIG || !CONFIG.voiceflow || !CONFIG.voiceflow.enabled || !CONFIG.voiceflow.projectID) {
    const vfPlaceholder = document.getElementById("voiceflow-embed-container");
    if (vfPlaceholder) {
      vfPlaceholder.innerHTML = `
        <div class="vf-embed-notice">
          <div class="vf-icon" aria-hidden="true">⚡</div>
          <h3>Voiceflow Widget Ready</h3>
          <p>Voiceflow integration is enabled in architecture. Insert your Voiceflow Project ID into <code>js/config.js</code> to load your customized Voiceflow agent.</p>
        </div>
      `;
    }
    return;
  }

  // Load official Voiceflow Web Chat script when configured
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
  script.onload = function () {
    window.voiceflow?.chat?.load({
      verify: { projectID: CONFIG.voiceflow.projectID },
      url: "https://general-runtime.voiceflow.com",
      versionID: CONFIG.voiceflow.versionID || "production"
    });
  };
  document.body.appendChild(script);
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("interactive-demo-widget")) {
    new InteractiveDemo("interactive-demo-widget");
  }
  initVoiceflowWidget();
});
