'use client';

const sizeData = [
  { eu: '39', uk: '5.5', length: '24.5 cm' },
  { eu: '39.5', uk: '6', length: '25.0 cm' },
  { eu: '40', uk: '6.5', length: '25.5 cm' },
  { eu: '40.5', uk: '7', length: '26.0 cm' },
  { eu: '41', uk: '7.5', length: '26.5 cm' },
  { eu: '42', uk: '8', length: '27.0 cm' },
  { eu: '42.5', uk: '8.5', length: '27.5 cm' },
  { eu: '43', uk: '9', length: '27.8 cm' },
  { eu: '43.5', uk: '9.5', length: '28.2 cm' },
  { eu: '44', uk: '10', length: '28.5 cm' },
  { eu: '44.5', uk: '10.5', length: '29.0 cm' },
  { eu: '45', uk: '11', length: '29.5 cm' },
  { eu: '46', uk: '12', length: '30.0 cm' },
];

export default function SizingGuide() {
  return (
    <section id="sizing" style={{ background: '#fff' }}>
      <div className="section-pad" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-label reveal-up">Size Section</span>
          <div className="gold-rule reveal-up stagger-1" style={{ margin: '1rem auto' }} />
          <h2 className="reveal-up stagger-1" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300,
            lineHeight: 1,
            color: '#1A1916',
            letterSpacing: '-0.01em',
            marginBottom: '1.5rem'
          }}>
            Sizing <em>Guide</em>
          </h2>
          <p className="reveal-up stagger-2" style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 300,
            color: '#4A4642',
            lineHeight: 2,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Every pair of Aeth an Graey is crafted to order. Getting the right fit matters — take a moment to find yours.
          </p>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          
          {/* Size Chart */}
          <div className="reveal-up stagger-3">
            <h3 style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#A8925A',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #E8E6E1',
              paddingBottom: '0.8rem'
            }}>Size Chart</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1A1916' }}>
                    <th style={{ padding: '0.8rem 0', fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', fontWeight: 500, color: '#1A1916' }}>EU</th>
                    <th style={{ padding: '0.8rem 0', fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', fontWeight: 500, color: '#1A1916' }}>UK</th>
                    <th style={{ padding: '0.8rem 0', fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', fontWeight: 500, color: '#1A1916' }}>Foot Length</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E8E6E1' }}>
                      <td style={{ padding: '0.8rem 0', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#4A4642' }}>{row.eu}</td>
                      <td style={{ padding: '0.8rem 0', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#4A4642' }}>{row.uk}</td>
                      <td style={{ padding: '0.8rem 0', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#4A4642' }}>{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guide Details */}
          <div className="reveal-up stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* How to Measure */}
            <div>
              <h3 style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#A8925A',
                marginBottom: '1.5rem'
              }}>How to Measure</h3>
              <ol style={{
                margin: 0,
                paddingLeft: '1.2rem',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 300,
                color: '#4A4642',
                lineHeight: 1.8
              }}>
                <li style={{ paddingLeft: '0.5rem', marginBottom: '0.8rem' }}>Place your foot on a sheet of paper against a wall</li>
                <li style={{ paddingLeft: '0.5rem', marginBottom: '0.8rem' }}>Mark the tip of your longest toe</li>
                <li style={{ paddingLeft: '0.5rem', marginBottom: '0.8rem' }}>Measure the distance from the wall to the mark in centimetres</li>
                <li style={{ paddingLeft: '0.5rem', marginBottom: '0.8rem' }}>Match to the chart — if between sizes, go up half a size</li>
              </ol>
            </div>

            {/* Fit Notes */}
            <div>
              <h3 style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#A8925A',
                marginBottom: '1.2rem'
              }}>Fit Notes</h3>
              <p style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 300,
                color: '#4A4642',
                lineHeight: 1.8
              }}>
                Our shoes are crafted on a medium-width last and run true to size. If you typically wear wide-fitting shoes, we recommend going up half a size.
              </p>
            </div>

            {/* Special Sizes */}
            <div style={{ background: '#F8F7F5', padding: '2rem', border: '1px solid #E8E6E1' }}>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.6rem',
                fontWeight: 300,
                color: '#1A1916',
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>Special Sizes &amp; Widths</h3>
              <p style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 300,
                color: '#4A4642',
                lineHeight: 1.8,
                marginBottom: '1.5rem'
              }}>
                Sizes outside EU 39–46, wide fits, or narrow fits are available on request. Each pair is made by hand — we can accommodate you.
              </p>
              <a href="mailto:contact@aethangraey.com?subject=Special%20Size%20Request" style={{
                display: 'inline-block',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#1A1916',
                textDecoration: 'none',
                borderBottom: '1px solid #1A1916',
                paddingBottom: '0.2rem',
                fontWeight: 500
              }}>
                Contact Us
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
