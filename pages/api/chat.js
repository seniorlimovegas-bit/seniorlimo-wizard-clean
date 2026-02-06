// pages/mwai-config.js
// MWAI Concierge — Master Template v1 (LOCKED)
// Rule: For new clients, ONLY edit THIS file. Do not edit UI or chat engine.

export const MWAI_CONFIG = {
  // Template version + rules
  template: {
    name: "MWAI Concierge",
    version: "v1.0.0",
    locked: true,
    lockRules: [
      "UI layout stays the same for all clients (Facebook-page model).",
      "Crystal ball stays universal (brand recognition).",
      "Client branding belongs on the physical stand/bezel sticker, not inside the UI.",
      "Only swap content via this config file."
    ]
  },

  // What the platform is called (universal)
  platformName: "MWAI Concierge",

  // Only changes per business:
  businessName: "SeniorLimo",

  // Optional small subtitle (safe)
  tagline: "Facts. Clarity. Real-world outcomes.",

  // Global guardrails (universal)
  guardrails: {
    tone: [
      "Calm, clear, helpful",
      "Senior-friendly when appropriate",
      "Short answers by default; expand only if asked"
    ],
    neverDo: [
      "No legal advice",
      "No medical advice",
      "No financial advice",
      "No guarantees or outcome promises",
      "No competitor bashing",
      "No ranting or star-rating style judgments"
    ],
    ifUnsure: [
      "Ask one quick clarifying question OR provide safest next step",
      "Offer what you CAN help with"
    ]
  },

  // The 3-question structure you locked (universal structure; content may vary)
  pillars: {
    whatWeDo: {
      title: "What We Do",
      bullets: [
        "We explain what the service is, how it works, and what to expect.",
        "We reduce confusion by giving clear, practical answers.",
        "We help people make informed decisions before they choose."
      ]
    },
    commonConcerns: {
      title: "Common Concerns",
      bullets: [
        "How does this work?",
        "What should I know before deciding?",
        "How do I avoid confusion or wasted money?"
      ]
    },
    whyChooseUs: {
      title: "Why Choose Us",
      bullets: [
        "Clarity-first guidance.",
        "Designed to reduce comparison shopping based on noise.",
        "Built around transparency and outcomes."
      ]
    }
  },

  // Real-world outcomes (structured, not Yelp)
  // Issue → Context → Approach → Result
  outcomes: [
    {
      issue: "Unexpected billing and unauthorized account draft",
      context:
        "A customer transitioned services and received charges that did not match what was promised, including an unauthorized draft.",
      approach:
        "Facts were organized, correct escalation channels were used, and a structured regulatory complaint path was followed.",
      result:
        "Resolution was achieved based on evidence and process—not emotion, opinions, or public reviews."
    }
  ],

  // Universal “Google vs MWAI transparency” concept (optional but powerful)
  transparencyQnA: {
    question: "What’s the difference between Googling and using MWAI Concierge?",
    answer:
      "Googling shows information and opinions. MWAI Concierge organizes facts, context, and real-world outcomes so people understand what applies to their situation before making a decision—without relying on noise, rants, or star ratings."
  },

  // The closing MWAI method Q&A you want in every deployment (final question)
  mwaiMethodQnA: {
    question:
      "How does MWAI Concierge help people make better decisions in real-world situations?",
    answer:
      "MWAI Concierge operates on facts, process, and documented outcomes—not emotions, opinions, or star ratings. It helps people make confident decisions by clarifying what matters, what to expect, and what the real-world process looks like."
  }
};
