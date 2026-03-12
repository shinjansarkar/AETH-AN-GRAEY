'use client';

const certifications = [
  {
    title: 'Certified Pure',
    body: 'Our leathers undergo independent laboratory testing to ensure they are free from harmful restricted substances like Chromium VI and Azo dyes.',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" className="quality-icon">
        <circle cx="18" cy="18" r="14" />
        <path d="M11 18l5 5 9-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Artisanal Integrity',
    body: 'By focusing on the purity of our primary material—goat leather—we ensure a hypoallergenic, breathable, and safe experience for the modern professional.',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" className="quality-icon">
        <path d="M18 4l3 9h9l-7.5 5.5 3 9L18 22l-7.5 5.5 3-9L6 13h9z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "The Founder's Guarantee",
    body: "Every pair is a result of our uncompromising discipline—merging traditional hand-welting techniques with a modern commitment to chemical safety and transparency.",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" className="quality-icon">
        <rect x="6" y="4" width="24" height="28" rx="1" />
        <path d="M12 12h12M12 17h12M12 22h7" strokeLinecap="round" />
      </svg>
    ),
  },
];

const deliveryRegions = [
  { region: 'Europe', time: '5–7 Business Days', icon: '✦' },
  { region: 'India', time: '3–5 Business Days', icon: '✦' },
];

const careSteps = [
  {
    num: '01',
    title: 'The Break-In Period',
    body: 'Goat leather is naturally supple, but our hand-welted construction is sturdy. Wear your shoes for 2–3 hours at a time for the first few days. The leather will quickly "memory-mold" to the unique contours of your feet.',
  },
  {
    num: '02',
    title: 'Daily Maintenance',
    body: 'Never wear your shoes two days in a row — leather needs 24 hours to breathe. Always insert Cedar Shoe Trees immediately after each wear. This maintains the hand-welted shape and pulls moisture out of the lining.',
  },
  {
    num: '03',
    title: 'Cleaning & Conditioning',
    body: 'Use a Horsehair Brush to remove surface dust from the grain after every wear. Every 10–15 wears, apply a high-quality neutral leather cream or matching colour wax. Avoid heavy oils — goat leather has a natural oil content that should not be oversaturated.',
  },
  {
    num: '04',
    title: 'Weather Protection',
    body: 'Goat leather is naturally more water-resistant than other hides. If soaked, do not use a hairdryer or heater. Let them air-dry naturally with shoe trees inserted. High heat can cause the leather to crack and damage the hand-welted seams.',
  },
];

export default function QualitySection() {
  return (
    <section id="quality" className="quality-section-wrapper">

      {/* ── SAFETY & SUSTAINABILITY ──────────────────────── */}
      <div className="quality-safety-grid">
        <div className="quality-safety-img reveal-fade">
          <img
            src="/handcrafted-boot.png"
            alt="AETH AN GRAEY handcrafted goat leather boot"
            loading="lazy"
          />
          <div className="quality-safety-img-badge">
            <span className="quality-badge-label">Artisanal Tanneries</span>
            <span className="quality-badge-sub">India · Hand-Selected</span>
          </div>
        </div>

        <div className="quality-safety-text">
          <span className="section-label reveal-up">Safety &amp; Sustainability</span>
          <div className="gold-rule reveal-up stagger-1" />
          <h2 className="quality-headline reveal-up stagger-1">
            Hand-Selected.<br /><em>Lab-Verified.</em><br />Founder-Approved.
          </h2>
          <p className="quality-body reveal-up stagger-2">
            At AETH AN GRAEY, we believe that luxury is as much about what you don&apos;t see
            as what you do. Our pure goat leather is sourced from artisanal Indian tanneries,
            chosen for their superior grain density and natural suppleness.
          </p>

          <div className="quality-cert-list reveal-up stagger-3">
            {certifications.map((c) => (
              <div key={c.title} className="quality-cert-card">
                <div className="quality-cert-icon">{c.icon}</div>
                <div>
                  <div className="quality-cert-title">{c.title}</div>
                  <p className="quality-cert-body">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SHIPPING & CRAFTSMANSHIP ─────────────────────── */}
      <div className="quality-shipping-dark">
        <div className="quality-shipping-inner">
          <div className="quality-shipping-header">
            <div>
              <span className="section-label reveal-up" style={{ color: 'rgba(196,171,120,0.7)' }}>
                Shipping &amp; Craftsmanship Policy
              </span>
              <div className="gold-rule reveal-up stagger-1" />
              <h2 className="quality-shipping-headline reveal-up stagger-1">
                The Art of<br /><em>the Wait.</em>
              </h2>
            </div>
            <p className="quality-shipping-intro reveal-up stagger-2">
              At AETH AN GRAEY, we don&apos;t believe in mass production. Each pair is a unique
              project, hand-welted from premium goat leather specifically for its future owner.
            </p>
          </div>

          {/* Crafting period callout */}
          <div className="quality-crafting-bar reveal-up stagger-2">
            <div className="quality-crafting-num">4–6</div>
            <div className="quality-crafting-label">
              <span className="quality-crafting-title">Weeks Crafting Period</span>
              <span className="quality-crafting-sub">
                Hand-cutting the leather · Lasting · Meticulous hand-welting
              </span>
            </div>
          </div>

          {/* Delivery grid */}
          <div className="quality-delivery-grid reveal-up stagger-3">
            <div className="quality-delivery-intro">
              <div className="quality-delivery-eyebrow">Worldwide Express Delivery</div>
              <p className="quality-delivery-body">
                Once your pair passes our final quality inspection, we ship via
                DHL / FedEx / Partnered Express — fully tracked from our workshop to your door.
              </p>
            </div>

            <div className="quality-delivery-regions">
              {deliveryRegions.map((r) => (
                <div key={r.region} className="quality-region-card">
                  <div className="quality-region-mark">{r.icon}</div>
                  <div className="quality-region-name">{r.region}</div>
                  <div className="quality-region-time">{r.time}</div>
                </div>
              ))}

              <div className="quality-tracking-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="14" height="14" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" strokeLinecap="round" />
                </svg>
                Tracking number &amp; personalized production update included
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARE GUIDE ───────────────────────────────────── */}
      <div className="quality-care-section">
        <div className="quality-care-inner">
          <div className="quality-care-header">
            <div>
              <span className="section-label reveal-up">The AETH AN GRAEY Care Guide</span>
              <div className="gold-rule reveal-up stagger-1" />
              <h2 className="quality-care-headline reveal-up stagger-1">
                Preserving the<br /><em>Goat Leather.</em>
              </h2>
            </div>
            <p className="quality-care-intro reveal-up stagger-2">
              Your shoes are crafted from pure goat leather, known for its unique grain and
              exceptional strength-to-weight ratio. Because they are hand-welted, they are
              designed to last decades — provided they are cared for with discipline.
            </p>
          </div>

          <div className="quality-care-steps">
            {careSteps.map((step, i) => (
              <div
                key={step.num}
                className="quality-care-step reveal-up"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="quality-step-num">{step.num}</div>
                <div className="quality-step-content">
                  <div className="quality-step-title">{step.title}</div>
                  <p className="quality-step-body">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="quality-care-footer reveal-up">
            <div className="quality-care-footer-rule" />
            <p className="quality-care-footer-text">
              Goat leather shoes, when properly maintained, develop a rich and deeply personal
              patina over years of wear — becoming irreversibly yours.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
