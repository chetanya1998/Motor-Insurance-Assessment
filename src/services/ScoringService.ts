export interface LeadData {
  id: string;
  registrationNumber?: string;
  vehicleDetails?: any;
  policyDetails?: any;
  quoteRange?: any;
  personalDetails?: any;
  exactQuotes?: any;
  selectedPlan?: any;
  selectedAddons?: string[];
  purchaseDetails?: any;
  validationErrorCount: number;
  isCompleted: boolean;
}

export function calculateLeadScore(lead: LeadData, totalTimeMs: number): { score: number, riskLevel: string, reasons: string[] } {
  let score = 100;
  const reasons: string[] = [];

  // Validation errors penalty
  if (lead.validationErrorCount > 0) {
    score -= Math.min(lead.validationErrorCount * 5, 20); // max 20 penalty for multiple validation errors
    if (lead.validationErrorCount >= 2) {
      reasons.push("Multiple validation errors (-10)");
    }
  }

  // Fast completion penalty
  if (totalTimeMs > 0 && totalTimeMs < 25000 && lead.isCompleted) { // under 25 seconds
    score -= 25;
    reasons.push("Form completed too fast under 25 seconds (-25)");
  }

  // Invalid vehicle number (if failed mock API or manual entry doesn't look like a real plate)
  if (lead.registrationNumber && lead.registrationNumber.length < 6) {
    score -= 20;
    reasons.push("Invalid vehicle number format (-20)");
  }

  // Disposable email check
  if (lead.personalDetails?.email) {
    const emailParts = lead.personalDetails.email.split('@');
    const domain = emailParts.length > 1 ? emailParts[1].toLowerCase() : '';
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'yopmail.com'];
    if (disposableDomains.includes(domain)) {
      score -= 15;
      reasons.push("Disposable email domain (-15)");
    }
  }

  // Same mobile used multiple times or registration conflicts would require cross-checking with other leads.
  // We'll mock that for now if phone starts with 999999
  if (lead.personalDetails?.mobile === "9999999999") {
    score -= 20;
    reasons.push("Same mobile used multiple times (-20)");
  }

  // Too many "Not sure" answers
  if (lead.policyDetails?.ncb === "Not sure") {
    score -= 10;
    reasons.push("Too many 'Not sure' answers (-10)");
  }

  // Floor at 0
  score = Math.max(0, score);

  let riskLevel = "Low Risk";
  if (score < 50) riskLevel = "High Risk";
  else if (score < 80) riskLevel = "Medium Risk";

  return { score, riskLevel, reasons };
}
