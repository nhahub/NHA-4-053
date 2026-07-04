import React, { useMemo, useRef, useState } from 'react';
import { Bot, Send, Sparkles, X, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/AuthContext';
import WasteToValueLogo from '@/components/brand/WasteToValueLogo';

// ─────────────────────────────────────────────────────────────────────────────
// OFFLINE KNOWLEDGE ENGINE — Full KB + Smart Matching
// ─────────────────────────────────────────────────────────────────────────────

const KB = [

  // ── GREETINGS & SOCIAL ───────────────────────────────────────────────────
  {
    keys: ['hi', 'hello', 'hey', 'hii', 'helo', 'salam', 'السلام', 'مرحبا', 'اهلا', 'هاي', 'howdy', 'good morning', 'good evening', 'good afternoon', 'sup', 'what\'s up', 'whats up'],
    answer: `Hello! I'm the Waste-to-Value AI assistant.

I'm fully briefed on everything about this platform — operations, pricing, quality control, ESG, financials, user roles, and more.

What would you like to know?`,
  },

  {
    keys: ['thank', 'thanks', 'شكرا', 'شكراً', 'تسلم', 'جزاك', 'appreciated', 'thx', 'ty', 'thank you', 'تمام شكرا', 'شكرا جزيلا'],
    answer: `You're welcome. If you have more questions about Waste-to-Value — operations, pricing, ESG, financials, or your defense prep — just ask.`,
  },

  {
    keys: ['how are you', 'كيف حالك', 'ازيك', 'عامل ايه', 'how r u', 'how do you do', 'you ok', 'are you ok'],
    answer: `I'm running at full capacity and ready to help.

Ask me anything about Waste-to-Value — I know the entire platform inside out.`,
  },

  {
    keys: ['who are you', 'what are you', 'introduce yourself', 'انت مين', 'عرف بنفسك', 'tell me about yourself', 'what can you do', 'ايه اللي تعرفه', 'what do you know'],
    answer: `I'm the Waste-to-Value AI assistant — an offline knowledge engine built into the platform.

I know everything about:
- The full operations pipeline (4 stages)
- Pricing engine and margin calculations
- Quality control and contamination logic
- All 5 user roles and their permissions
- Year 1 financial targets
- ESG compliance and regulatory framework
- Suppliers, factories, logistics
- SWOT and competitive positioning
- Graduation defense preparation

No internet connection needed — all knowledge is built in. Ask me anything.`,
  },

  {
    keys: ['ok', 'okay', 'got it', 'understood', 'clear', 'i see', 'makes sense', 'great', 'perfect', 'awesome', 'nice', 'good', 'cool', 'wow', 'interesting', 'تمام', 'ماشي', 'اوكي', 'حلو', 'كويس', 'ممتاز', 'عظيم', 'جميل'],
    answer: `Glad that's clear. What else would you like to know about Waste-to-Value?`,
  },

  {
    keys: ['bye', 'goodbye', 'see you', 'later', 'cya', 'مع السلامة', 'باي', 'وداعا', 'تصبح على خير', 'good night', 'goodnight'],
    answer: `Take care. The platform knowledge is here whenever you need it.`,
  },

  {
    keys: ['help', 'مساعده', 'مساعدة', 'ساعدني', 'i need help', 'what can i ask', 'what should i ask', 'guide me', 'menu', 'options', 'topics'],
    answer: `Here's everything I can help you with:

**Platform Knowledge:**
- Operations pipeline (4 stages)
- Pricing engine and margin formulas
- Quality control and contamination logic
- Suppliers and target segments
- Factory buyers and offtake
- User roles and permissions
- Payment terms and penalties
- Infrastructure and logistics
- Materials handled
- ESG and regulatory compliance
- Financial targets (Year 1)
- SWOT and competitive positioning
- Tech stack

**Graduation Defense:**
- One-sentence pitch
- How to answer committee questions
- Key angles to emphasize

Just ask naturally — I'll understand.`,
  },

  // ── IDENTITY / OVERVIEW ──────────────────────────────────────────────────
  {
    keys: ['what is waste to value', 'about the platform', 'overview', 'explain the platform', 'what does the platform do', 'company', 'tell me about waste', 'describe the platform', 'what is this', 'ايه المشروع', 'عن المشروع', 'شرح المشروع'],
    answer: `Waste-to-Value is Egypt's first B2B contract-based waste logistics and commodity trading platform, based in Greater Cairo.

**What it does:**
- Collects recyclable waste from corporate clients (malls, hotels, universities, HQs, sports clubs)
- Processes and bales the material at a dedicated 500 sqm hub
- Sells factory-ready bales to industrial recycling factories (BariQ, MEPCO, metal smelters)

**Revenue model:** Pure commodity arbitrage — buy at 70% of market price, sell at 110%. No subscriptions, no commissions.

**Mission:** Build Egypt's most traceable, ESG-compliant B2B recycling supply chain.

**Legal form:** LLC | **Location:** Greater Cairo, Egypt`,
  },

  // ── BUSINESS MODEL ───────────────────────────────────────────────────────
  {
    keys: ['business model', 'revenue model', 'how does it make money', 'how do you make money', 'profit model', 'arbitrage', 'commodity', 'how does the business work', 'monetize', 'make revenue', 'بيزنس موديل', 'موديل الاعمال', 'كيف بيكسب'],
    answer: `Waste-to-Value runs on **Commodity Arbitrage** — the simplest and most scalable model in recycling:

1. **Buy** recyclables from corporations at **70% of market price**
2. **Process** at the hub (sort, decontaminate, bale)
3. **Sell** factory-ready bales at **110% of market price**
4. **Gross margin = 40 percentage points** on every ton processed

**Example (market price = EGP 9,000/ton):**
- Buy price  → EGP 6,300/ton
- Sell price → EGP 9,900/ton
- Gross margin → EGP 3,600/ton

The platform does NOT earn from subscriptions, memberships, commissions, or ads. Revenue is purely transactional — volume × margin.`,
  },

  // ── PRICING ENGINE ───────────────────────────────────────────────────────
  {
    keys: ['pric', 'buy price', 'sell price', 'margin', 'formula', 'market price', 'admin set price', 'algorithmic pricing', 'how is price calculated', 'pricing engine', 'price formula', 'سعر', 'تسعير', 'هامش الربح', 'حساب السعر'],
    answer: `The pricing engine is **fully algorithmic and admin-controlled**:

- Market reference price → set manually by the Super Admin
- Buy price  = market_price × 0.70  (platform pays supplier)
- Sell price = market_price × 1.10  (factory pays platform)
- Gross margin per ton = sell_price − buy_price

**No bidding. No negotiation.** Prices are fixed and recalculate automatically when the admin updates the market reference.

**Numeric example:**

| Field | Value |
|---|---|
| Market price | EGP 9,000/ton |
| Buy price (70%) | EGP 6,300/ton |
| Sell price (110%) | EGP 9,900/ton |
| Gross margin | EGP 3,600/ton |

The Super Admin is the only person who can change pricing — no user can negotiate or override it.`,
  },

  // ── OPERATIONS PIPELINE ──────────────────────────────────────────────────
  {
    keys: ['pipeline', 'workflow', 'operations', 'stages', 'full process', 'how does it work', 'step by step', 'flow', 'full workflow', 'walk me through', '4 stages', 'four stages', 'المراحل', 'العمليات', 'خطوات', 'شرح العمليات'],
    answer: `The platform runs a **4-stage operations pipeline**:

**Stage 1 — Source Extraction**
- Schedule and execute waste collection from the corporate supplier
- Transport to the processing hub via inbound fleet (jumbo truck + 2 dababa trucks)

**Stage 2 — Hub QA**
- Tier 1 Weighing: gross weight on arrival
- Sorting: separate by material type (paper, PET, HDPE, metals, glass)
- Decontamination: remove non-recyclable waste
- Tier 2 Weighing: net clean weight
- Contamination check: if ratio > 5% → deduct weight or reject load

**Stage 3 — Densification**
- Bale material (400–500 kg/bale) using hydraulic baler
- Assign unique bale ID for full traceability
- Register bales in platform inventory

**Stage 4 — Factory Offtake**
- Create outbound shipment (minimum 24 tons)
- Deliver via 3PL (Trella or Trukker)
- Auto-generate factory invoice
- Collect payment on Net 14 terms`,
  },

  // ── QUALITY CONTROL ──────────────────────────────────────────────────────
  {
    keys: ['quality', 'contamination', 'qa', 'weighing', 'tier 1', 'tier 2', 'decontamin', 'threshold', 'reject load', 'payout affect', 'weight deduct', 'clean weight', 'gross weight', 'جودة', 'تلوث', 'وزن', 'رفض الشحنة', 'خصم الوزن'],
    answer: `Quality control runs at **Stage 2 (Hub QA)**:

**Step-by-step:**
1. Tier 1 Weighing → record gross weight on arrival
2. Sort and decontaminate the material
3. Tier 2 Weighing → record net clean weight

**Contamination formula:**
contamination_ratio = (Tier1 − Tier2) / Tier1 × 100%

**Threshold = 5%**
- Contamination ≤ 5% → payout on Tier 2 weight (normal)
- Contamination > 5% → additional weight deducted from payout
- Severe contamination → entire load rejected, no payout

**Why it matters:** Protects the platform's margin and ensures factories receive consistent, high-quality material. Suppliers who repeatedly exceed the threshold risk contract review.`,
  },

  // ── AFTER CONTRACT ───────────────────────────────────────────────────────
  {
    keys: ['after contract', 'what happens after', 'contract accepted', 'onboard supplier', 'supplier sign', 'next step after', 'contract activated', 'بعد العقد', 'بعد القبول', 'خطوات بعد'],
    answer: `After a supplier contract is accepted, here's the exact sequence:

1. **Contract activation** — Super Admin activates the contract in the platform
2. **Pickup scheduling** — first collection scheduled with the supplier
3. **Collection** — driver picks up waste and transports to the hub
4. **Tier 1 Weighing** — Hub Manager records gross weight on arrival
5. **Sorting & Decontamination** — material cleaned and separated by type
6. **Tier 2 Weighing** — net clean weight recorded; contamination ratio calculated
7. **Baling** — material compressed into 400–500 kg bales, each tagged with a unique ID
8. **Inventory registration** — bales logged in the platform
9. **Payout calculation** — supplier payout = Tier 2 weight × buy price (EGP 6,300/ton)
10. **Payment release** — Net 14 (small contracts) or Net 30 (large contracts)`,
  },

  // ── SUPPLIERS ────────────────────────────────────────────────────────────
  {
    keys: ['supplier', 'client', 'who supplies', 'corporate clients', 'mall', 'hotel', 'university', 'sports club', 'corporate hq', 'who sells to platform', 'supply side', 'مورد', 'موردين', 'عملاء', 'مراكز تجارية', 'فنادق', 'جامعات'],
    answer: `Waste-to-Value targets **corporate waste generators only** — no households, no individuals.

**Year 1 target segments (5 tons/day total):**

| Segment | Share | Tons/day |
|---|---|---|
| Shopping malls | 35% | 1.75 |
| Corporate HQs | 25% | 1.25 |
| Hotels | 20% | 1.00 |
| Universities | 10% | 0.50 |
| Sports clubs | 10% | 0.50 |

**Why B2B only?** One mall contract generates more consistent, high-volume waste than hundreds of households — making operations scalable and predictable.

**Sales approach:** Direct corporate visits targeting sustainability managers + LinkedIn ABM + SEO targeting "Corporate Waste Compliance Egypt".`,
  },

  // ── FACTORIES / BUYERS ───────────────────────────────────────────────────
  {
    keys: ['factory', 'factories', 'buyer', 'who buys', 'bariq', 'mepco', 'smelter', 'demand side', 'offtake', 'industrial buyer', 'factory partner', 'مصنع', 'مصانع', 'مشترين', 'جانب الطلب'],
    answer: `The demand side consists of **industrial recycling factories** that purchase processed bales.

**Current factory partners:**
- BariQ (plastic recycling)
- MEPCO (metals and composites)
- Metal Smelters

**Materials they accept:** Paper, PET, HDPE, Metals, Glass

**How they're acquired:** Long-term offtake agreements — factories commit to buying minimum volumes at the agreed sell price (110% of market rate).

**Outbound logistics:** Shipments via Trella or Trukker (3PL), minimum 24 tons per trip.

**Payment terms:** Net 14 from invoice date.
- Month 1 overdue → +5% penalty
- Month 2+ overdue → +10% penalty
- Month 3 overdue → Legal escalation`,
  },

  // ── USERS & ROLES ────────────────────────────────────────────────────────
  {
    keys: ['user role', 'roles', 'permissions', 'who can do', 'user type', 'portal access', 'role based', 'hub manager', 'driver role', 'factory user', 'supplier user', 'ادوار المستخدمين', 'صلاحيات', 'مستخدمين'],
    answer: `The platform has **5 user roles**, each with distinct permissions:

**Supplier** (corporate client)
- View Pickups, Receipts, Payouts
- Chat with AI assistant

**Factory** (industrial buyer)
- Confirm Deliveries
- View Invoices
- Track Shipments

**Driver** (logistics)
- View Routes
- Upload Photos (proof of collection/delivery)
- Update Status

**Hub Manager** (operations)
- Weigh Loads (Tier 1 & Tier 2)
- Manage Inventory & Bales
- Monitor QA

**Super Admin** (platform owner)
- Manage Contracts & Users
- Set Market Prices (triggers repricing engine)
- View full Analytics dashboard`,
  },

  // ── SUPER ADMIN ──────────────────────────────────────────────────────────
  {
    keys: ['super admin', 'what does admin do', 'admin role', 'admin control', 'admin permissions', 'admin set price', 'admin manage', 'ادمن', 'المدير', 'صلاحيات الادمن'],
    answer: `The Super Admin has **full platform authority** across all functions:

1. **Set Market Prices** — updates the reference price, automatically recalculating all buy/sell prices platform-wide
2. **Manage Contracts** — approve, activate, suspend, or terminate supplier and factory contracts
3. **Manage Users** — create, edit, and deactivate any user account across all 5 roles
4. **View Analytics** — full dashboard: tonnage, revenue, margins, QA rates, payment status

The Super Admin is the **only role** that can change pricing. No other user can negotiate or override prices. This is the core of the algorithmic pricing model — one point of control, zero negotiation.`,
  },

  // ── PAYMENTS ────────────────────────────────────────────────────────────
  {
    keys: ['payment', 'pay supplier', 'pay factory', 'invoice', 'net 14', 'net 30', 'penalty', 'late payment', 'payment terms', 'overdue', 'مدفوعات', 'دفع', 'فاتورة', 'تأخير الدفع', 'غرامات'],
    answer: `**Supplier payments (platform → supplier):**
- Small contracts → Net 14 days from delivery confirmation
- Large contracts → Net 30 days from delivery confirmation

**Factory payments (factory → platform):**
- Standard terms → Net 14 days from invoice date
- Month 1 overdue → +5% penalty added
- Month 2+ overdue → +10% penalty added
- Month 3 overdue → Legal escalation initiated

The penalty structure protects the platform's cash flow while maintaining factory relationships through a structured escalation path rather than immediate legal action.`,
  },

  // ── LOGISTICS ────────────────────────────────────────────────────────────
  {
    keys: ['logistics', 'truck', 'fleet', 'inbound logistics', 'outbound logistics', 'trella', 'trukker', 'transport', 'delivery truck', 'shipment', '3pl', 'dababa', 'jumbo truck', 'لوجستيك', 'شحن', 'توصيل', 'سيارات نقل', 'ترلا', 'تراكر'],
    answer: `**Inbound logistics (supplier → hub):**
- Model: Dry lease (platform owns/leases the vehicles)
- Fleet: 1 jumbo truck + 2 dababa trucks
- Operated by platform drivers
- Full control over collection scheduling

**Outbound logistics (hub → factory):**
- Model: Third-party logistics (3PL) — asset-light, no owned vehicles
- Providers: Trella and Trukker
- Minimum shipment: 24 tons per trip (optimizes per-ton delivery cost)

The asset-light outbound model keeps fixed costs low. The owned inbound fleet gives full control over collection timing and quality — critical for maintaining the Hub QA pipeline.`,
  },

  // ── INFRASTRUCTURE ───────────────────────────────────────────────────────
  {
    keys: ['hub', 'infrastructure', 'equipment', 'baler', 'hydraulic', 'scale', 'sqm', 'bale weight', 'facility', 'processing hub', 'hub size', 'المستودع', 'المنشأة', 'المعدات', 'الباليه', 'الميزان'],
    answer: `**Processing Hub:**
- Size: 500 sqm dedicated facility

**Equipment:**
- Digital scale — 1 ton capacity (used for Tier 1 & Tier 2 weighing)
- Hydraulic baler — 50 ton capacity (compresses sorted material into bales)

**Bale specifications:** 400–500 kg per bale

Each bale gets a **unique ID** for full traceability — from the hub all the way to factory delivery confirmation. This traceability is a core part of the ESG value proposition.`,
  },

  // ── MATERIALS ────────────────────────────────────────────────────────────
  {
    keys: ['material', 'recyclable', 'paper', 'pet plastic', 'hdpe', 'plastic type', 'metal', 'glass', 'what types', 'what materials', 'cardboard', 'مواد', 'مواد قابلة للتدوير', 'بلاستيك', 'معادن', 'زجاج', 'ورق'],
    answer: `Waste-to-Value currently handles **5 material streams:**

| Material | Common sources |
|---|---|
| Paper & Cardboard | Malls, corporate offices, hotels |
| PET (plastic bottles) | Malls, sports clubs, hotels |
| HDPE (rigid plastic) | Corporate HQs, universities |
| Metals | Corporate HQs, facilities |
| Glass | Hotels, restaurants |

Each material is sorted separately during Hub QA, baled individually by type, and sold to the appropriate factory buyer. Mixing materials reduces quality and can trigger contamination penalties.`,
  },

  // ── FINANCIALS ───────────────────────────────────────────────────────────
  {
    keys: ['financial', 'revenue target', 'monthly revenue', 'year 1', 'financial target', 'tonnage target', 'egp', '130 tons', 'monthly margin', 'how much does it earn', 'gross margin monthly', 'ماليات', 'الايرادات', 'الهدف المالي', 'ارباح', 'ارباح شهريه'],
    answer: `**Year 1 monthly financial targets:**

| Metric | Value |
|---|---|
| Daily throughput | 5 tons/day |
| Working days/month | 26 |
| Monthly tonnage | 130 tons |
| Market price | EGP 9,000/ton |
| Monthly Revenue | EGP 1,287,000 |
| Monthly COGS | EGP 819,000 |
| **Gross Margin** | **EGP 468,000** |
| Gross Margin % | ~36.4% |

**How it's calculated:**
- Revenue = 130 tons × EGP 9,900 (sell price at 110%)
- COGS = 130 tons × EGP 6,300 (buy price at 70%)
- Gross Margin = EGP 1,287,000 − EGP 819,000`,
  },

  // ── ESG ──────────────────────────────────────────────────────────────────
  {
    keys: ['esg', 'sustainability', 'compliance', 'esg reporting', 'vision 2030', 'sdg 12', 'traceability', 'regulatory', 'waste law', '202/2020', 'environment', 'green', 'استدامة', 'تقارير بيئية', 'امتثال', 'قانون النفايات'],
    answer: `ESG is a **core differentiator and mandatory sales driver** for Waste-to-Value:

**What the platform provides to suppliers:**
- Automated ESG reporting with quantified sustainability metrics
- Full waste traceability (bale-level chain of custody)
- Regulatory compliance documentation

**Regulatory tailwind:**
Egypt's **Waste Law 202/2020** mandates that corporations manage their waste responsibly — creating a legal obligation that turns Waste-to-Value from a "nice to have" into a compliance necessity.

**Strategic alignment:**
- Egypt Vision 2030 (green economy pillar)
- UN SDG 12 — Responsible Consumption & Production

For multinational corporations and large enterprises operating in Egypt, the ESG reporting alone can justify signing the contract — regardless of the financial incentive.`,
  },

  // ── SWOT ─────────────────────────────────────────────────────────────────
  {
    keys: ['swot', 'strengths', 'weaknesses', 'opportunities', 'threats', 'competitive advantage', 'risks', 'challenges', 'first mover', 'moat', 'تحليل سوات', 'نقاط قوة', 'نقاط ضعف', 'فرص', 'تهديدات', 'مخاطر'],
    answer: `**SWOT Analysis — Waste-to-Value**

**Strengths:**
- First B2B waste logistics platform in Egypt (first-mover advantage)
- Algorithmic pricing — no negotiation, no manual errors
- Own processing hub with full QA control
- ESG reporting as a built-in differentiator
- Asset-light outbound logistics (3PL keeps fixed costs low)

**Weaknesses:**
- High startup cost (hub lease, equipment, fleet)
- Single hub dependency — operational bottleneck if hub goes down
- Small founding team

**Opportunities:**
- Egypt Waste Law 202/2020 creates mandatory corporate demand
- Growing ESG requirements from multinationals in Egypt
- Egypt Vision 2030 green economy alignment
- Potential government partnerships and grants

**Threats:**
- Factory payment delays (mitigated by penalty clause structure)
- Informal sector competitors (cheaper but no ESG, no contracts)
- Commodity price volatility affecting margins
- Future regulatory changes`,
  },

  // ── COMPETITIVE POSITIONING ──────────────────────────────────────────────
  {
    keys: ['competi', 'informal collector', 'market position', 'differentiat', 'unique value', 'first in egypt', 'moat', 'vs informal', 'why better', 'compare', 'منافسين', 'تميز', 'لماذا افضل', 'ميزة تنافسية'],
    answer: `**Competitive Landscape:**

No direct B2B competitor exists in Egypt. Waste-to-Value competes against:

1. **Informal waste collectors** — no contracts, no ESG reporting, no traceability, inconsistent pricing
2. **General logistics companies** — don't specialize in recyclables, no hub processing, no ESG value
3. **Direct factory-to-corporate deals** — unstructured, manual, no platform infrastructure

**Waste-to-Value's moat — a bundle no informal player can replicate:**
- Algorithmic pricing engine (one price, no negotiation)
- Own processing hub with certified QA
- Automated ESG compliance reporting
- Full bale-level traceability
- Digital platform with 5 role-based user types

An informal collector can temporarily undercut on price, but **cannot offer ESG compliance documentation** — which is increasingly mandatory under Egyptian law. That's the sustainable competitive advantage.`,
  },

  // ── TECH STACK ───────────────────────────────────────────────────────────
  {
    keys: ['tech stack', 'technology', 'react', 'laravel', 'mysql', 'aws', 'frontend', 'backend', 'database', 'hosting', 'built with', 'gemini', 'tech used', 'تقنيات', 'تكنولوجيا', 'برمجة', 'قاعدة البيانات'],
    answer: `**Technology Stack:**

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Laravel (PHP) |
| Database | MySQL |
| AI Assistant | Gemini (Google) |
| Hosting | AWS |

**Architecture:** Single web application with role-based access control serving 5 user types simultaneously. Drivers use a mobile-optimized view for route management and photo uploads. The AI assistant is embedded directly in the supplier portal.`,
  },

  // ── AI FEATURE ───────────────────────────────────────────────────────────
  {
    keys: ['ai feature', 'ai assistant', 'ai chat', 'this ai', 'chatbot', 'gemini ai', 'explain the ai', 'about this chat', 'how does ai work', 'الذكاء الاصطناعي', 'مساعد الذكاء', 'شات بوت'],
    answer: `The AI assistant is an embedded knowledge layer within the Waste-to-Value platform.

**What it does:**
- Answers any question about platform workflows, pricing, QA, ESG, user roles, and financials
- Available in the supplier portal — no support ticket needed
- Reduces onboarding time for new corporate clients
- Works fully offline — no external API calls

**Value for the platform:**
It turns a logistics platform into a self-explaining, intelligent infrastructure product. Any supplier can get instant, accurate answers 24/7 without waiting for support.

**Value for a graduation defense:**
The AI feature demonstrates intelligent automation as a differentiator — not just a logistics company, but a smart platform.`,
  },

  // ── GRADUATION DEFENSE ───────────────────────────────────────────────────
  {
    keys: ['defense', 'graduation', 'thesis', 'committee', 'present', 'how to explain', 'defense prep', 'explain to committee', 'pitch', 'one sentence', 'مناقشة', 'تخرج', 'مشروع تخرج', 'دفاع', 'كيف اشرح', 'لجنة'],
    answer: `Here's how to frame Waste-to-Value for a graduation committee:

**One-sentence pitch:**
"Waste-to-Value is Egypt's first B2B digital platform that buys recyclable waste from corporations, processes it at a dedicated hub, and sells factory-ready bales to industrial recyclers — generating margin through commodity arbitrage while providing ESG compliance reporting."

**Three angles to emphasize:**

1. **Problem:** Egyptian corporations generate massive recyclable waste but lack a structured, traceable, compliant way to monetize it.

2. **Solution:** A full-stack platform covering collection, QA, processing, logistics, and ESG reporting — with algorithmic pricing that eliminates negotiation.

3. **Business viability:** EGP 468,000 gross margin per month at 130 tons, with a clear path to scale by adding supplier segments and hubs.

**Likely committee questions:**
- "How is this different from existing waste collectors?" → ESG reporting, digital traceability, and contractual framework — things the informal market cannot offer.
- "Why B2B only?" → Volume, consistency, and contract predictability. One mall = more than 100 households.
- "What's the risk?" → Commodity price volatility and factory payment delays — both mitigated through algorithmic repricing and penalty clauses.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SMART MATCHING ENGINE — multi-signal scoring
// ─────────────────────────────────────────────────────────────────────────────
function findAnswer(question) {
  const q = question.toLowerCase().trim();

  // Score each KB entry
  let bestScore = 0;
  let bestAnswer = null;

  for (const entry of KB) {
    let score = 0;
    for (const key of entry.keys) {
      const k = key.toLowerCase();
      if (q.includes(k)) {
        // Exact phrase match — weight by length (more specific = higher score)
        score += k.length * 2;
      } else {
        // Partial word overlap
        const keyWords = k.split(/\s+/);
        for (const kw of keyWords) {
          if (kw.length > 2 && q.includes(kw)) score += kw.length;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  if (bestScore >= 4) return bestAnswer;

  // Word-level fuzzy fallback
  const qWords = q.split(/\s+/).filter((w) => w.length > 3);
  for (const entry of KB) {
    for (const key of entry.keys) {
      for (const word of qWords) {
        if (key.toLowerCase().includes(word)) return entry.answer;
      }
    }
  }

  return `I don't have a specific answer for that, but here's what I can help with:

- **Operations pipeline** — "walk me through the 4 stages"
- **Pricing & margins** — "how does the pricing engine work"
- **Quality control** — "how does contamination affect payouts"
- **User roles** — "what can the super admin do"
- **Financials** — "what are the year 1 targets"
- **ESG & compliance** — "what ESG value does the platform offer"
- **Defense prep** — "help me explain this for my graduation defense"

Try rephrasing or pick one of the topics above.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN RENDERER
// ─────────────────────────────────────────────────────────────────────────────
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table
    if (line.includes('|') && lines[i + 1]?.includes('---')) {
      const headers = line.split('|').filter(Boolean).map((h) => h.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').filter(Boolean).map((c) => c.trim()));
        i++;
      }
      elements.push(
        <table key={i} style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 8 }}>
          <thead>
            <tr>
              {headers.map((h, hi) => (
                <th key={hi} style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid rgba(0,0,0,0.15)', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: '4px 8px', borderBottom: '1px solid rgba(0,0,0,0.08)', verticalAlign: 'top' }}>{inlineFormat(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
      continue;
    }

    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      elements.push(<p key={i} style={{ fontWeight: 600, margin: '10px 0 4px', fontSize: 13 }}>{line.slice(2, -2)}</p>);
      i++; continue;
    }

    if (line.startsWith('- ')) {
      elements.push(
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
          <span style={{ color: 'var(--color-text-secondary)', flexShrink: 0, marginTop: 1 }}>•</span>
          <span style={{ fontSize: 13 }}>{inlineFormat(line.slice(2))}</span>
        </div>
      );
      i++; continue;
    }

    const numMatch = line.match(/^(\d+)\. (.+)/);
    if (numMatch) {
      elements.push(
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
          <span style={{ color: 'var(--color-text-secondary)', flexShrink: 0, minWidth: 16, fontWeight: 600, fontSize: 13 }}>{numMatch[1]}.</span>
          <span style={{ fontSize: 13 }}>{inlineFormat(numMatch[2])}</span>
        </div>
      );
      i++; continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 6 }} />);
      i++; continue;
    }

    elements.push(<p key={i} style={{ margin: '0 0 4px', fontSize: 13, lineHeight: 1.6 }}>{inlineFormat(line)}</p>);
    i++;
  }

  return elements;
}

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>{p.slice(1, -1)}</code>;
    return p;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STARTER QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const STARTERS = [
  'Walk me through the full pipeline',
  'How does the pricing engine work?',
  'Quality control & payouts',
  'Year 1 financial targets',
  'What does the Super Admin control?',
  'Help me prepare for my defense',
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function FloatingAiChat() {
  const { currentUser } = useAuth();
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi — I'm the Waste-to-Value AI assistant.\n\nI know everything about this platform: operations, pricing, quality control, ESG, financials, and user roles.\n\nWhat would you like to know?",
    },
  ]);
  const scrollRef = useRef(null);

  const visibleMessages = useMemo(() => messages.slice(-12), [messages]);

  const scrollToBottom = () =>
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);

  const ask = (text = input) => {
    const question = (typeof text === 'string' ? text : input).trim();
    if (!question || loading) return;
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    scrollToBottom();

    setTimeout(() => {
      const answer = findAnswer(question);
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
      setLoading(false);
      scrollToBottom();
    }, 380);
  };

  const reset = () =>
    setMessages([
      {
        role: 'assistant',
        text: "Conversation cleared. Still fully briefed on Waste-to-Value — ask anything.",
      },
    ]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] h-14 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 px-5 text-white shadow-2xl shadow-emerald-700/30"
      >
        <Bot className="mr-2 h-5 w-5" /> Ask AI
      </Button>

      {open && (
        <div
          className={`fixed z-[70] ${
            expanded ? 'inset-4' : 'bottom-24 right-5 w-[calc(100vw-2.5rem)] max-w-md'
          } overflow-hidden rounded-3xl border border-emerald-500/20 bg-background shadow-2xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:from-emerald-950/50 dark:to-teal-950/30">
            <WasteToValueLogo />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={reset} title="Clear conversation">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className={`${expanded ? 'h-[calc(100vh-228px)]' : 'h-80'} space-y-3 overflow-y-auto p-4`}>
            {visibleMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'border border-border/70 bg-muted/50 text-main'
                  }`}
                >
                  {m.role === 'assistant' ? renderMarkdown(m.text) : m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 animate-pulse" /> Thinking...
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border/70 p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  disabled={loading}
                  className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-secondary-text hover:bg-emerald-50 disabled:opacity-40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
                }}
                rows={2}
                placeholder="Ask anything about Waste-to-Value…"
                className="rounded-2xl"
              />
              <Button
                onClick={() => ask()}
                disabled={loading || !input.trim()}
                className="rounded-2xl bg-emerald-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
