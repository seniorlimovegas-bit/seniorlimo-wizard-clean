// pages/api/config.js
import { MWAI_CONFIG } from "../mwai-config";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // Only expose what the UI needs (keep it clean and safe)
  const uiConfig = {
    template: MWAI_CONFIG.template,
    platformName: MWAI_CONFIG.platformName,
    businessName: MWAI_CONFIG.businessName,
    tagline: MWAI_CONFIG.tagline
  };

  return res.status(200).json(uiConfig);
}
