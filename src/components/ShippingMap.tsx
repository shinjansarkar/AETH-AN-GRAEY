'use client';

export default function ShippingMap() {
    return (
        <div>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.48rem', fontWeight: 500, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#9A9590', marginBottom: '0.4rem' }}>
                        Atelier to Door
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 300, color: '#1A1916' }}>
                        India → Europe
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '3rem' }}>
                    {[['7–14', 'Crafting Days'], ['DDP', 'Duty Free'], ['30+', 'EU Countries']].map(([val, label]) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '1rem', fontWeight: 400, color: '#1A1916', letterSpacing: '-0.01em' }}>{val}</div>
                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.42rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9A9590', marginTop: '0.2rem' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated SVG Map */}
            <svg
                viewBox="0 0 900 360"
                style={{ width: '100%', height: 'auto', display: 'block', background: '#EDEAE4', border: '1px solid #D8D5D0' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Subtle grid */}
                <g stroke="#D5D2CB" strokeWidth="0.5" opacity="0.55">
                    {[90, 180, 270, 360, 450, 540, 630, 720, 810].map((x) => (
                        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="360" />
                    ))}
                    {[72, 144, 216, 288].map((y) => (
                        <line key={`h${y}`} x1="0" y1={y} x2="900" y2={y} />
                    ))}
                </g>

                {/* ══════════════════════════════════════
            EUROPE silhouette
        ══════════════════════════════════════ */}

                {/* Main continental body */}
                <path
                    d="M 175,210 L 150,194 L 145,172 L 154,151 L 168,139 L 184,129 L 200,121 L 216,114 L 233,106 L 248,97 L 258,85 L 268,75 L 281,66 L 295,62 L 311,65 L 325,74 L 337,87 L 345,103 L 348,120 L 340,136 L 347,153 L 334,168 L 321,181 L 307,192 L 293,202 L 279,212 L 267,221 L 257,212 L 247,200 L 239,214 L 229,229 L 217,232 L 205,223 L 197,212 L 187,218 L 175,222 L 163,215 L 159,204 L 167,197 Z"
                    fill="#C8C4BC"
                    stroke="#A8A49C"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />

                {/* Scandinavia */}
                <path
                    d="M 268,75 L 272,58 L 281,48 L 295,43 L 309,47 L 317,58 L 320,68 L 311,65 L 295,62 L 281,66 Z"
                    fill="#C8C4BC"
                    stroke="#A8A49C"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />

                {/* Italian boot */}
                <path
                    d="M 237,188 L 243,203 L 247,217 L 243,232 L 237,242 L 229,245 L 221,240 L 220,228 L 225,215 L 231,202 Z"
                    fill="#C8C4BC"
                    stroke="#A8A49C"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />

                {/* Iberian peninsula */}
                <path
                    d="M 167,197 L 159,204 L 153,218 L 155,233 L 165,242 L 180,246 L 194,240 L 200,228 L 196,218 L 184,218 L 174,222 L 163,215 Z"
                    fill="#C8C4BC"
                    stroke="#A8A49C"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />

                {/* Great Britain */}
                <path
                    d="M 193,123 L 189,110 L 196,100 L 207,97 L 215,105 L 212,118 L 200,124 Z"
                    fill="#C8C4BC"
                    stroke="#A8A49C"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />

                {/* EUROPE label */}
                <text
                    x="252" y="155"
                    fontFamily="Jost, sans-serif" fontSize="8"
                    fill="#7A7570" fontWeight="500" letterSpacing="2.5"
                    textAnchor="middle" opacity="0.9"
                >
                    EUROPE
                </text>

                {/* ══════════════════════════════════════
            INDIA silhouette
        ══════════════════════════════════════ */}
                <path
                    d="M 592,187 L 611,175 L 631,169 L 651,169 L 668,177 L 679,194 L 683,213 L 681,233 L 674,251 L 662,267 L 648,281 L 634,292 L 621,300 L 613,306 L 608,301 L 611,288 L 617,274 L 613,260 L 601,248 L 589,233 L 581,216 L 581,200 Z"
                    fill="#C8C4BC"
                    stroke="#A8A49C"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />

                {/* INDIA label */}
                <text
                    x="636" y="244"
                    fontFamily="Jost, sans-serif" fontSize="8"
                    fill="#7A7570" fontWeight="500" letterSpacing="2.5"
                    textAnchor="middle" opacity="0.9"
                >
                    INDIA
                </text>

                {/* ══════════════════════════════════════
            FLIGHT PATH — golden dashed arc
        ══════════════════════════════════════ */}
                <path
                    id="planePath"
                    d="M 636,244 C 600,55 372,44 258,174"
                    stroke="#A8925A"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="7 5"
                    opacity="0.8"
                />

                {/* ══════════════════════════════════════
            PULSING MARKERS
        ══════════════════════════════════════ */}

                {/* India — origin dot */}
                <circle cx="636" cy="244" r="5" fill="#1A1916" />
                <circle cx="636" cy="244" r="5" fill="none" stroke="#1A1916" strokeWidth="1">
                    <animate attributeName="r" from="6" to="22" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* Europe — destination dot */}
                <circle cx="258" cy="174" r="5" fill="#A8925A" />
                <circle cx="258" cy="174" r="5" fill="none" stroke="#A8925A" strokeWidth="1">
                    <animate attributeName="r" from="6" to="22" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
                </circle>

                {/* ══════════════════════════════════════
            ANIMATED AIRPLANE
        ══════════════════════════════════════ */}
                <g>
                    <animateMotion
                        dur="5s"
                        repeatCount="indefinite"
                        rotate="auto"
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.38 0 0.62 1"
                    >
                        <mpath href="#planePath" />
                    </animateMotion>

                    {/* Airplane — nose points +x (right). rotate=auto handles direction. */}
                    <g fill="#A8925A">
                        {/* Fuselage */}
                        <path d="M 12,0 L -6,-2.8 L -4,0 L -6,2.8 Z" />
                        {/* Main wings */}
                        <path d="M 2,-2.5 L -1.5,-11 L -6.5,-3.5 Z" />
                        <path d="M 2,2.5 L -1.5,11 L -6.5,3.5 Z" />
                        {/* Tail fins */}
                        <path d="M -3.5,-2.8 L -3,-6 L -7,-3.2 Z" />
                        <path d="M -3.5,2.8 L -3,6 L -7,3.2 Z" />
                    </g>
                </g>

                {/* ══════════════════════════════════════
            DDP badge midway on arc
        ══════════════════════════════════════ */}
                <rect x="414" y="84" width="60" height="20" fill="#1A1916" rx="1" />
                <text
                    x="444" y="97.5"
                    fontFamily="Jost, sans-serif" fontSize="5.5"
                    fill="#A8925A" letterSpacing="1.5"
                    textAnchor="middle" fontWeight="500"
                >
                    DDP FREE
                </text>

                {/* City micro-labels */}
                <text x="648" y="264" fontFamily="Jost, sans-serif" fontSize="6" fill="#9A9590" letterSpacing="0.8">Mumbai</text>
                <text x="234" y="192" fontFamily="Jost, sans-serif" fontSize="6" fill="#9A9590" letterSpacing="0.8">Milano</text>
            </svg>
        </div>
    );
}
