'use client';

import { worldLandPath } from './mapPath';

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
                        India  Europe
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '3rem' }}>
                    {[['714', 'Crafting Days'], ['DDP', 'Duty Free'], ['30+', 'EU Countries']].map(([val, label]) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '1rem', fontWeight: 400, color: '#1A1916', letterSpacing: '-0.01em' }}>{val}</div>
                            <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.42rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9A9590', marginTop: '0.2rem' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated SVG Map */}
            <svg
                viewBox="380 40 450 280"
                style={{ width: '100%', height: 'auto', display: 'block', background: '#EDEAE4', border: '1px solid #D8D5D0', overflow: 'hidden' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Subtle grid */}
                <g stroke="#D5D2CB" strokeWidth="0.5" opacity="0.55">
                    {[400, 450, 500, 550, 600, 650, 700, 750, 800].map((x) => (
                        <line key={"v" + x} x1={x} y1="0" x2={x} y2="360" />
                    ))}
                    {[50, 100, 150, 200, 250, 300].map((y) => (
                        <line key={"h" + y} x1="300" y1={y} x2="900" y2={y} />
                    ))}
                </g>

                {/* 
                    REAL WORLD LANDMASS SILHOUETTES
                 */}
                <path
                    d={worldLandPath}
                    fill="#C8C4BC"
                    stroke="#A8A49C"
                    strokeWidth="0.7"
                    strokeLinejoin="round"
                    // Add subtle shadow to the map for better luxury feel
                    style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}
                />

                {/* EUROPE & INDIA labels over land */}
                <text
                    x="480" y="80"
                    fontFamily="Jost, sans-serif" fontSize="10"
                    fill="#7A7570" fontWeight="500" letterSpacing="3.5"
                    textAnchor="middle" opacity="0.8"
                >
                    EUROPE
                </text>

                <text
                    x="756" y="240"
                    fontFamily="Jost, sans-serif" fontSize="10"
                    fill="#7A7570" fontWeight="500" letterSpacing="3.5"
                    textAnchor="middle" opacity="0.8"
                >
                    INDIA
                </text>


                {/* 
                    FLIGHT PATH  golden dashed arc
                 */}
                <path
                    id="planePath"
                    d="M 756.1,265 C 650,50 500,0 444.9,110"
                    stroke="#A8925A"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="7 5"
                    opacity="0.8"
                />

                {/* 
                    PULSING MARKERS
                 */}

                {/* India (Mumbai)  origin dot */}
                <circle cx="756.1" cy="265" r="4" fill="#1A1916" />
                <circle cx="756.1" cy="265" r="4" fill="none" stroke="#1A1916" strokeWidth="1">
                    <animate attributeName="r" from="4" to="16" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* Europe (Milano)  destination dot */}
                <circle cx="444.9" cy="110" r="4" fill="#A8925A" />
                <circle cx="444.9" cy="110" r="4" fill="none" stroke="#A8925A" strokeWidth="1">
                    <animate attributeName="r" from="4" to="16" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" begin="1.25s" />
                </circle>

                {/* City micro-labels removed for general India/Europe pointing */}

                {/* 
                    DDP badge midway on arc
                 */}
                <rect x="555" y="60" width="56" height="18" fill="#1A1916" rx="1" />
                <text
                    x="583" y="72.5"
                    fontFamily="Jost, sans-serif" fontSize="5.5"
                    fill="#A8925A" letterSpacing="1.5"
                    textAnchor="middle" fontWeight="500"
                >
                    DDP FREE
                </text>

                {/* 
                    ANIMATED AIRPLANE
                 */}
                <g>
                    <animateMotion
                        dur="6s"
                        repeatCount="indefinite"
                        rotate="auto"
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.4 0 0.6 1"
                    >
                        <mpath href="#planePath" />
                    </animateMotion>

                    {/* Airplane  nose points +x (right). rotate=auto handles direction. */}
                    <g fill="#A8925A">
                        <path d="M 12,0 L -6,-2.8 L -4,0 L -6,2.8 Z" />
                        <path d="M 2,-2.5 L -1.5,-11 L -6.5,-3.5 Z" />
                        <path d="M 2,2.5 L -1.5,11 L -6.5,3.5 Z" />
                        <path d="M -3.5,-2.8 L -3,-6 L -7,-3.2 Z" />
                        <path d="M -3.5,2.8 L -3,6 L -7,3.2 Z" />
                    </g>
                </g>
            </svg>
        </div>
    );
}
