# StyleUp — Business Plan

## The Idea

StyleUp is an Uber-for-stylists marketplace. Clients book personal stylists for:
- **Shop Together** — Stylist accompanies you to your favourite stores
- **Home Wardrobe Edit** — Stylist comes to you, edits what you own
- **Virtual Session** — Live video consultation
- **Online Styling** — Async mood board + shopping list

The core insight: great personal styling used to require knowing someone, or paying a PR-agency rate. StyleUp makes it bookable in 60 seconds, transparent on price, and available everywhere.

---

## The Market

- Global personal styling market: **$1.4B** (2025), growing 8% YoY
- Adjacent market (fashion subscription, personal shopping): **$9.2B**
- Underserved: working professionals who know they should dress better but don't know how
- Underserved: people navigating wardrobe transitions (new job, new city, post-baby, weight change)
- Underserved: men — dramatically underserved by fashion advice industry

**Target customer profiles:**
1. The Promoted Professional — just got a senior role, needs to dress the part
2. The Life Transitioner — big life change, wardrobe is out of sync
3. The Overwhelmed Shopper — buys too much, wears too little, feels worse every time
4. The Occasion Dresser — wedding, gala, big event, one shot to get it right

---

## Business Model

### Revenue streams

| Stream | Unit Economics |
|--------|---------------|
| Marketplace commission | 20% of each booking |
| Premium stylist badge | $29/month per stylist |
| Virtual fitting room (Pro) | $9.99/month for clients |
| Corporate packages | $5,000–$50,000/year |

### Unit economics (marketplace commission)
- Average booking value: £250 / session
- Commission: 20% = £50 per booking
- To reach £1M ARR: 20,000 bookings/year = ~1,700/month = ~55/day

### Stylist economics
- Stylists keep 80% of each booking
- Average stylist: 8–12 sessions/month = £2,000–£3,000/month from StyleUp
- Top stylists: 25+ sessions/month = £5,000–£7,500/month
- Premium badge: verified trust signal, worth far more than $29 in booking conversion

---

## The Virtual Fitting Room

**Why it exists:** Most people pick the wrong colours for their natural colouring. A stylist who knows colour season theory is dramatically more effective. The fitting room gives clients a head start — and gives stylists a data-rich brief before the session.

**What it does:**
1. 3-question colour season quiz → determines Spring / Summer / Autumn / Winter palette
2. Interactive outfit builder — pick colours per zone (top, jacket, bottom, accessory)
3. Real-time colour harmony analysis (tonal, complementary, triadic, contrasting)
4. "Share with stylist" — exports a text summary of the client's palette preferences

**Why it drives retention:** Clients who know their season become invested in the system. They reference it when shopping, share it with friends, and return to the app to try new combinations. It's a free tool that creates a sticky habit.

---

## Growth Strategy

### Phase 1: Launch (0–6 months)
- Curate 50 stylists in 3 cities (London, New York, Sydney)
- Target: 500 bookings in month 6
- Marketing: Instagram + TikTok content from stylists' sessions (with permission)
- No paid ads — stylists are the sales channel

### Phase 2: Scale (6–18 months)
- Expand to 10 cities
- Launch corporate offering (firm-wide style programmes)
- StyleUp for Men — dedicated marketing push
- Partner with 3 luxury hotel groups for concierge integration
- Target: 5,000 bookings/month

### Phase 3: Platform (18–36 months)
- Stylist training programme + StyleUp certification
- API integration with retailers (share client palettes with brands)
- Virtual styling AI — trained on StyleUp's anonymised session data
- Target: 25,000 bookings/month, £37.5M GMV, £7.5M revenue

---

## Competitive Advantage

| Factor | StyleUp | Traditional styling | Fashion subscriptions |
|--------|---------|--------------------|-----------------------|
| Price transparency | ✓ | ✗ | ✓ |
| In-person available | ✓ | ✓ | ✗ |
| Virtual available | ✓ | Sometimes | ✓ |
| Colour analysis tool | ✓ | Sometimes | ✗ |
| No subscription required | ✓ | N/A | ✗ |
| Global stylists | ✓ | Limited | ✗ |

**Defensible moat:** The stylists. Once a stylist has 40+ reviews on StyleUp, they have no incentive to leave. Their reputation lives on the platform.

---

## Retention Psychology

Drawing on the same behavioural principles as leading consumer apps:

1. **Colour season identity** — Once users know they're a "Winter", it's a permanent piece of self-knowledge. They return to reference it, share it, and deepen it.

2. **Stylist relationships** — Repeat bookings with the same stylist create a relationship that's hard to replicate elsewhere. The stylist builds context; the client builds trust.

3. **Style history** — Over time, the dashboard shows the client's style evolution. This is intrinsically motivating and nearly impossible to export to a competitor.

4. **Variable reward** — Sessions are inherently variable-reward: sometimes you find one perfect piece, sometimes you transform your whole wardrobe. This variability is psychologically compelling.

5. **Social proof accumulation** — Reviews, booking counts, and stylist ratings are visible and growing. Clients feel part of a community with clear quality signals.

---

## Financial Projections

| Year | Bookings | GMV | Revenue (20%) | Costs | EBITDA |
|------|----------|-----|---------------|-------|--------|
| Y1 | 8,400 | £2.1M | £420K | £600K | -£180K |
| Y2 | 36,000 | £9M | £1.8M | £1.4M | £400K |
| Y3 | 120,000 | £30M | £6M | £3.5M | £2.5M |

**Funding need:** £800K seed to reach profitability in month 22.

**Use of funds:**
- Engineering (40%) — build real-time booking, payments, video integration
- Marketing (30%) — stylist acquisition, content, SEO
- Operations (20%) — customer success, stylist onboarding, quality control
- Legal/Admin (10%)

---

## The Team You Need

- **CEO** — consumer marketplace or luxury experience background
- **CTO** — marketplace/two-sided platform experience
- **Head of Stylist Experience** — someone who knows the industry from inside
- **Head of Growth** — performance + content marketing

---

## What's Built (MVP)

The prototype in this repository includes:
- Landing page with full value proposition
- Stylist browser with 10 global profiles (search + filter)
- Full booking flow (service → date/time → notes → confirmation)
- Virtual colour fitting room (season quiz + outfit builder + harmony check)
- Style quiz (6 questions → 6 archetypes)
- Client dashboard (upcoming/past bookings, colour season, stats)
- All data stored in localStorage (no backend required for demo)

**Next build priorities:**
1. Stripe payment integration
2. Stylist-side dashboard (manage availability, see bookings, message clients)
3. Real-time video (Daily.co or Whereby embed) for virtual sessions
4. Node backend (same pattern as ONE's server/) for real data persistence
5. Email notifications (Resend API)
6. Stylist onboarding flow
