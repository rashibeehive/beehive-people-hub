export type RAG = "green" | "amber" | "red";

export const PILLARS = [
  { id: "revenue", name: "Revenue & Loan Book", color: "#16a34a" },
  { id: "operational", name: "Operational Excellence", color: "#2563eb" },
  { id: "employee", name: "Employee Productivity", color: "#7c3aed" },
  { id: "governance", name: "Governance & Culture", color: "#d97706" },
  { id: "ai", name: "AI Adoption", color: "#0d9488" },
] as const;

export type PillarId = (typeof PILLARS)[number]["id"];

export const DEPARTMENTS = [
  "Technology",
  "Finance",
  "HR",
  "Credit",
  "Operations",
  "Business Development",
  "Compliance",
  "Marketing",
] as const;

export type DepartmentName = (typeof DEPARTMENTS)[number];

export interface Employee {
  name: string;
  department: DepartmentName | "Executive";
}

export const EMPLOYEES: Employee[] = [
  { name: "Rashed Al Blooshi", department: "Business Development" },
  { name: "Sara Al Mansoori", department: "Credit" },
  { name: "Khalid Bin Yousef", department: "Operations" },
  { name: "Layla Hassan", department: "Finance" },
  { name: "Omar Siddiqui", department: "HR" },
  { name: "Fatima Al Zaabi", department: "Compliance" },
  { name: "Yusuf Al Hammadi", department: "Marketing" },
  { name: "James Thornton", department: "Technology" },
  { name: "Rohan Verma", department: "Technology" },
  { name: "Priya Menon", department: "Technology" },
  { name: "Shaikha Al Maktoum", department: "Technology" },
  { name: "Sophie Laurent", department: "Technology" },
  { name: "Kevin Obi", department: "Technology" },
  { name: "Hessa Al Nuaimi", department: "Finance" },
  { name: "Carlos Mendez", department: "Finance" },
  { name: "Maitha Al Suwaidi", department: "Finance" },
  { name: "Aisha Noor", department: "HR" },
  { name: "Reem Jassim", department: "HR" },
  { name: "Ben Carter", department: "HR" },
  { name: "Lina Aziz", department: "HR" },
  { name: "Maryam Khalil", department: "HR" },
  { name: "Nadia Farouk", department: "HR" },
  { name: "Daniel Osei", department: "Credit" },
  { name: "Faisal Al Otaibi", department: "Credit" },
  { name: "Nour Badawi", department: "Credit" },
  { name: "Rashi Agarwal", department: "Credit" },
  { name: "Majid Al Khaili", department: "Credit" },
  { name: "Dana Al Mansoori", department: "Credit" },
  { name: "Noura Al Dhaheri", department: "Operations" },
  { name: "Hamad Al Farsi", department: "Operations" },
  { name: "Nada Khalifa", department: "Operations" },
  { name: "Zayed Al Falasi", department: "Business Development" },
  { name: "Tom Reeves", department: "Business Development" },
  { name: "Leila Chebli", department: "Business Development" },
  { name: "Patrick Nwosu", department: "Business Development" },
  { name: "Hind Al Qubaisi", department: "Business Development" },
  { name: "Ivan Petrov", department: "Compliance" },
  { name: "Mariam Al Rashdi", department: "Compliance" },
  { name: "Abdulla Al Zarouni", department: "Compliance" },
  { name: "Ines Moreau", department: "Marketing" },
  { name: "Saif Al Shamsi", department: "Marketing" },
];

export interface CompanyKR {
  id: string;
  text: string;
  owner: string;
  rag: RAG;
}

export interface CompanyPillarOKRs {
  pillarId: PillarId;
  krs: CompanyKR[];
}

const k = (text: string, owner: string, rag: RAG): CompanyKR => ({
  id: crypto.randomUUID(),
  text,
  owner,
  rag,
});

export const COMPANY_OKRS: CompanyPillarOKRs[] = [
  {
    pillarId: "revenue",
    krs: [
      k("Disburse AED 1B in total loan value by Q4 2026", "Rashed Al Blooshi", "amber"),
      k("Grow direct sales channel monthly disbursement by 30% YoY", "Zayed Al Falasi", "amber"),
      k("Launch WCF product to 50 new SME clients by Q3 2026", "Sara Al Mansoori", "red"),
      k("Reduce average deal cycle time to under 5 days", "Daniel Osei", "green"),
      k("Achieve 85% borrower retention rate", "Khalid Bin Yousef", "green"),
      k("Expand channel partner network to 25 active partners", "Tom Reeves", "red"),
      k("Increase average loan size by 15% through upsell strategy", "Priya Menon", "amber"),
    ],
  },
  {
    pillarId: "operational",
    krs: [
      k("Reduce loan processing time by 40% through automation", "Noura Al Dhaheri", "amber"),
      k("Achieve 99.5% platform uptime", "James Thornton", "green"),
      k("Reduce operational cost per loan by 20%", "Hamad Al Farsi", "amber"),
      k("Implement end-to-end digital onboarding", "Rohan Verma", "green"),
      k("Reduce manual intervention in credit decisions to under 10%", "Faisal Al Otaibi", "amber"),
      k("Launch internal ops dashboard for real-time pipeline visibility", "Lina Aziz", "red"),
    ],
  },
  {
    pillarId: "employee",
    krs: [
      k("Achieve 85% completion rate on Q2 2026 performance reviews", "Omar Siddiqui", "amber"),
      k("Launch career framework across all 13 levels", "Aisha Noor", "green"),
      k("Reduce average time-to-hire to under 21 days", "Reem Jassim", "amber"),
      k("Achieve 80% employee satisfaction score in Q2 survey", "Ben Carter", "amber"),
      k("Ensure 100% of managers complete 1-1 training by Q3", "Maryam Khalil", "red"),
      k("Launch goals module with OKR tracking for all departments", "Nadia Farouk", "green"),
      k("Reduce voluntary attrition to under 10% annually", "Omar Siddiqui", "green"),
    ],
  },
  {
    pillarId: "governance",
    krs: [
      k("Achieve full regulatory compliance across UAE, KSA and Oman", "Fatima Al Zaabi", "green"),
      k("Complete ISO 27001 certification process by Q4 2026", "Ivan Petrov", "amber"),
      k("Launch whistleblower and ethics reporting framework", "Mariam Al Rashdi", "amber"),
      k("Ensure 100% of employees complete compliance training", "Abdulla Al Zarouni", "amber"),
      k("Publish first Beehive ESG impact report by Q3 2026", "Layla Hassan", "green"),
      k("Reduce policy exception rate to under 5%", "Fatima Al Zaabi", "amber"),
    ],
  },
  {
    pillarId: "ai",
    krs: [
      k("Deploy AI-assisted credit scoring model", "Priya Menon", "amber"),
      k("Launch AI writing assistant for goals and review module", "James Thornton", "green"),
      k("Achieve 70% active AI tool usage among all employees", "Sophie Laurent", "red"),
      k("Build internal AI literacy programme for all 50 employees", "Shaikha Al Maktoum", "amber"),
      k("Integrate AI-driven anomaly detection in operations", "Rohan Verma", "amber"),
      k("Publish internal AI usage policy and governance framework", "Mariam Al Rashdi", "green"),
      k("Run 2 internal AI hackathons with cross-functional teams", "Kevin Obi", "green"),
    ],
  },
];

export interface DeptKR {
  id: string;
  text: string;
  project: string;
  lead: string;
  rag: RAG;
  blockers: string;
}

export interface DeptObjective {
  id: string;
  title: string;
  krs: DeptKR[];
}

export interface DepartmentOKRs {
  department: DepartmentName;
  head: string;
  pillars: PillarId[];
  objectives: DeptObjective[];
}

const dk = (text: string, project: string, lead: string, rag: RAG, blockers: string): DeptKR => ({
  id: crypto.randomUUID(),
  text,
  project,
  lead,
  rag,
  blockers,
});

const obj = (title: string, krs: DeptKR[]): DeptObjective => ({
  id: crypto.randomUUID(),
  title,
  krs,
});

export const DEPARTMENT_OKRS: DepartmentOKRs[] = [
  {
    department: "Technology",
    head: "James Thornton",
    pillars: ["operational", "ai"],
    objectives: [
      obj("Platform reliability and scale", [
        dk("Achieve 99.5% uptime Q2 2026", "Infrastructure Resilience Programme", "Rohan Verma", "green", ""),
        dk("Complete migration to microservices architecture", "Platform Rewrite Phase 2", "Priya Menon", "amber", "Delayed due to dependency on external vendor delivery"),
        dk("Reduce average API response time to under 200ms", "Performance Optimisation Sprint", "Shaikha Al Maktoum", "green", ""),
      ]),
      obj("AI and product development", [
        dk("Ship AI credit scoring v1 to production", "AI Credit Model", "Priya Menon", "amber", "Awaiting data labelling sign-off from Credit team"),
        dk("Launch developer sandbox for channel partners", "Partner API", "Rohan Verma", "red", "Resource constraint — engineer pulled to platform rewrite"),
        dk("Complete AI writing assistant for HR platform", "Beehive People Platform", "Sophie Laurent", "green", ""),
      ]),
      obj("Engineering team capability", [
        dk("100% of engineers complete AI literacy module", "AI Adoption Internal", "Kevin Obi", "amber", "3 engineers yet to complete — chasing"),
        dk("Implement code review standards and reduce bug rate by 25%", "Engineering Excellence", "Shaikha Al Maktoum", "green", ""),
        dk("Hire 2 senior engineers by Q3 2026", "Tech Hiring", "James Thornton", "red", "Pipeline thin — JD needs revision, working with HR"),
      ]),
    ],
  },
  {
    department: "Finance",
    head: "Layla Hassan",
    pillars: ["revenue", "governance"],
    objectives: [
      obj("Financial performance tracking", [
        dk("Deliver monthly P&L within 3 days of month close", "Finance Ops Streamlining", "Hessa Al Nuaimi", "green", ""),
        dk("Reduce cost per loan by 20%", "Cost Reduction Initiative", "Carlos Mendez", "amber", "Vendor contract renegotiation taking longer than expected"),
        dk("Complete Q2 board reporting pack by June 15", "Board Reporting", "Layla Hassan", "green", ""),
      ]),
      obj("Funding and treasury", [
        dk("Secure AED 500M in new funding lines by Q3", "Fundraising Round", "Layla Hassan", "amber", "Two term sheets in review — legal sign-off pending"),
        dk("Reduce FX exposure by hedging 80% of non-AED positions", "Treasury Management", "Hessa Al Nuaimi", "green", ""),
        dk("Implement automated treasury dashboard", "Finance Tech", "Carlos Mendez", "amber", "Tech dependency — waiting on Technology team"),
      ]),
      obj("Compliance and audit", [
        dk("Zero audit findings in Q2 internal audit", "Audit Readiness", "Maitha Al Suwaidi", "green", ""),
        dk("Complete IFRS 9 provisioning model update", "Credit Provisioning", "Carlos Mendez", "red", "Model assumptions disputed internally — needs CFO sign-off"),
        dk("Publish ESG report financial section", "ESG Report", "Maitha Al Suwaidi", "amber", "Waiting on data from Operations"),
      ]),
    ],
  },
  {
    department: "HR",
    head: "Omar Siddiqui",
    pillars: ["employee", "governance"],
    objectives: [
      obj("Performance and careers", [
        dk("Launch career framework across all levels by end of Q2", "Beehive People Platform", "Aisha Noor", "green", ""),
        dk("Complete Q2 review cycle with 85% participation", "Q2 Review Cycle", "Reem Jassim", "amber", "Manager training not yet completed — risk to timeline"),
        dk("Map all 50 employees to 9-box matrix", "Talent Calibration", "Ben Carter", "green", ""),
      ]),
      obj("Hiring and onboarding", [
        dk("Reduce time-to-hire to 21 days for IC1–IC3", "Hiring Process Redesign", "Reem Jassim", "amber", "ATS workflow needs update"),
        dk("Launch structured 30-60-90 onboarding plan", "Onboarding Redesign", "Lina Aziz", "green", ""),
        dk("Fill 5 open roles across Technology and Credit by Q3", "Q3 Hiring Plan", "Aisha Noor", "red", "Roles approved late — sourcing just started"),
      ]),
      obj("Culture and engagement", [
        dk("Achieve 80% score on Q2 engagement survey", "Engagement Survey Q2", "Ben Carter", "amber", "Survey not yet launched — due mid-May"),
        dk("Run quarterly all-hands with structured Q&A", "Internal Comms", "Omar Siddiqui", "green", ""),
        dk("Launch manager effectiveness survey", "Manager Feedback", "Lina Aziz", "amber", "Pending approval from leadership"),
      ]),
    ],
  },
  {
    department: "Credit",
    head: "Sara Al Mansoori",
    pillars: ["revenue", "operational"],
    objectives: [
      obj("Credit decisioning speed", [
        dk("Reduce average credit decision time to under 24 hours", "Credit Automation", "Daniel Osei", "amber", "Integration with new scoring model delayed"),
        dk("Reduce manual review rate to under 10%", "AI Credit Model", "Faisal Al Otaibi", "amber", "Dependent on Technology AI model delivery"),
        dk("Launch credit scorecard v3", "Scorecard Refresh", "Daniel Osei", "green", ""),
      ]),
      obj("Portfolio quality", [
        dk("Maintain NPL ratio below 3%", "Portfolio Monitoring", "Nour Badawi", "green", ""),
        dk("Complete quarterly portfolio stress test", "Risk Review Q2", "Rashi Agarwal", "green", ""),
        dk("Launch early warning system for at-risk borrowers", "EWS Build", "Faisal Al Otaibi", "red", "Engineering resource not yet allocated"),
      ]),
      obj("WCF product growth", [
        dk("Onboard 50 new WCF clients", "WCF Growth Drive", "Majid Al Khaili", "amber", "Sales pipeline building but below target pace"),
        dk("Reduce WCF approval time to 48 hours", "WCF Process", "Dana Al Mansoori", "green", ""),
        dk("Launch WCF product in KSA market", "KSA Expansion", "Majid Al Khaili", "red", "Regulatory approval still pending"),
      ]),
    ],
  },
  {
    department: "Operations",
    head: "Khalid Bin Yousef",
    pillars: ["operational"],
    objectives: [
      obj("Disbursement efficiency", [
        dk("Reduce disbursement time to under 2 hours post-approval", "Disbursement Automation", "Noura Al Dhaheri", "green", ""),
        dk("Achieve 99% disbursement accuracy rate", "Ops Quality Programme", "Hamad Al Farsi", "green", ""),
        dk("Launch real-time ops dashboard", "Ops Visibility", "Lina Aziz", "amber", "Dashboard design in progress — due end of May"),
      ]),
      obj("Process automation", [
        dk("Automate 5 manual ops workflows by Q3", "Ops Automation Sprint", "Noura Al Dhaheri", "amber", "2 of 5 workflows completed"),
        dk("Reduce cost per disbursement by 15%", "Cost Efficiency", "Hamad Al Farsi", "amber", "Tracking slightly behind — vendor costs higher than forecast"),
        dk("Implement SLA tracking across all ops processes", "SLA Framework", "Nada Khalifa", "red", "Tool selection not finalised"),
      ]),
      obj("KSA and Oman operations", [
        dk("Establish ops playbook for KSA market", "KSA Ops Setup", "Khalid Bin Yousef", "amber", "Draft in progress — needs legal review"),
        dk("Complete Oman regulatory ops requirements", "Oman Compliance Ops", "Hamad Al Farsi", "red", "Regulatory guidance still awaited from CBFS"),
        dk("Hire ops lead for KSA by Q3 2026", "KSA Hiring", "Khalid Bin Yousef", "amber", "2 candidates in final round"),
      ]),
    ],
  },
  {
    department: "Business Development",
    head: "Rashed Al Blooshi",
    pillars: ["revenue"],
    objectives: [
      obj("Direct sales growth", [
        dk("Close AED 450M in direct sales disbursements", "Direct Sales Drive", "Zayed Al Falasi", "amber", "Pace at 60% of target — accelerating in May"),
        dk("Grow active borrower base by 25%", "Borrower Growth", "Leila Chebli", "green", ""),
        dk("Launch referral programme for existing borrowers", "Referral Programme", "Patrick Nwosu", "amber", "Programme designed — pending marketing sign-off"),
      ]),
      obj("Channel partnerships", [
        dk("Sign 10 new channel partners by Q3", "Partner Acquisition", "Hind Al Qubaisi", "red", "Only 2 signed so far — outreach needs to accelerate"),
        dk("Achieve AED 350M through channel by Q4", "Channel Sales Drive", "Rashed Al Blooshi", "amber", "On track if partner pipeline converts"),
        dk("Launch partner portal for deal tracking", "Partner Portal", "Patrick Nwosu", "red", "Tech dependency — portal build not yet started"),
      ]),
      obj("Market expansion", [
        dk("Generate AED 50M pipeline from KSA market", "KSA Sales", "Zayed Al Falasi", "amber", "Early conversations underway — 3 warm leads"),
        dk("Complete Oman market entry assessment", "Oman Market Study", "Leila Chebli", "green", "Report due end of May — on track"),
        dk("Attend 4 regional SME finance conferences", "BD Events", "Rashed Al Blooshi", "green", "2 attended, 2 confirmed for Q3"),
      ]),
    ],
  },
  {
    department: "Compliance",
    head: "Fatima Al Zaabi",
    pillars: ["governance"],
    objectives: [
      obj("Regulatory compliance", [
        dk("Zero regulatory breaches across UAE, KSA, Oman in Q2", "Compliance Monitoring", "Abdulla Al Zarouni", "green", ""),
        dk("Complete CBUAE reporting submissions on time", "Regulatory Reporting", "Mariam Al Rashdi", "green", ""),
        dk("Submit KSA SAMA compliance framework by Q3", "KSA Compliance", "Fatima Al Zaabi", "amber", "Framework drafted — legal review in progress"),
      ]),
      obj("Policy and training", [
        dk("100% staff complete AML/CFT training by end of Q2", "Compliance Training", "Abdulla Al Zarouni", "amber", "72% completed — reminder campaign launched"),
        dk("Publish updated data privacy policy", "Privacy Framework", "Mariam Al Rashdi", "green", ""),
        dk("Launch whistleblower reporting channel", "Ethics Programme", "Fatima Al Zaabi", "amber", "Vendor selected — implementation in progress"),
      ]),
      obj("Risk framework", [
        dk("Complete enterprise risk register update", "Risk Register", "Abdulla Al Zarouni", "green", ""),
        dk("Reduce policy exception rate to under 5%", "Policy Governance", "Mariam Al Rashdi", "amber", "Currently at 8% — improvement plan in place"),
        dk("Complete ISO 27001 gap assessment", "ISO 27001", "Fatima Al Zaabi", "red", "External assessor not yet engaged"),
      ]),
    ],
  },
  {
    department: "Marketing",
    head: "Yusuf Al Hammadi",
    pillars: ["revenue", "ai"],
    objectives: [
      obj("Brand and awareness", [
        dk("Achieve 2M impressions across digital channels in Q2", "Digital Campaign Q2", "Ines Moreau", "green", ""),
        dk("Launch refreshed Beehive brand identity", "Brand Refresh", "Saif Al Shamsi", "amber", "Design agency feedback round 2 in progress"),
        dk("Publish 12 thought leadership pieces in Q2", "Content Programme", "Ines Moreau", "green", ""),
      ]),
      obj("Lead generation", [
        dk("Generate 500 qualified SME leads in Q2", "Lead Gen Campaign", "Saif Al Shamsi", "amber", "At 210 leads mid-quarter — need to double pace"),
        dk("Reduce cost per lead by 20% vs Q1", "Performance Marketing", "Yusuf Al Hammadi", "amber", "Optimisation underway — too early to call"),
        dk("Launch email nurture programme for warm leads", "CRM Programme", "Ines Moreau", "red", "CRM integration delayed by Technology dependency"),
      ]),
      obj("Market expansion support", [
        dk("Launch KSA-specific marketing campaign", "KSA Marketing", "Saif Al Shamsi", "amber", "Brief approved — creative in production"),
        dk("Produce Arabic-language content suite", "Arabic Content", "Yusuf Al Hammadi", "green", ""),
        dk("Support 4 BD events with marketing collateral", "Events Support", "Ines Moreau", "green", ""),
      ]),
    ],
  },
];

export function rollupRag(rags: RAG[]): RAG {
  if (rags.length === 0) return "amber";
  if (rags.includes("red")) return "red";
  const greens = rags.filter((r) => r === "green").length;
  if (greens > rags.length / 2) return "green";
  return "amber";
}

export const RAG_META: Record<RAG, { label: string; dot: string; chip: string }> = {
  green: { label: "On Track", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  amber: { label: "At Risk", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  red: { label: "Off Track", dot: "bg-red-500", chip: "bg-red-50 text-red-700 border-red-200" },
};

export const nextRag = (r: RAG): RAG => (r === "green" ? "amber" : r === "amber" ? "red" : "green");

export const newId = () => crypto.randomUUID();
