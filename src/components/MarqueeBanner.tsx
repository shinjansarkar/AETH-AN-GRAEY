'use client';

const items = [
    'Pure Goat Leather',
    '✦',
    'Handmade in India',
    '✦',
    'Delivered to Europe DDP',
    '✦',
    'One Artisan',
    '✦',
    'Bespoke Craftsmanship',
    '✦',
    'The Architecture of Elegance',
    '✦',
];

export default function MarqueeBanner() {
    const doubled = [...items, ...items];

    return (
        <div
            style={{
                background: 'var(--mid-surface)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                padding: '0.85rem 0',
                overflow: 'hidden',
            }}
        >
            <div className="marquee-track">
                {doubled.map((item, i) => (
                    <span
                        key={i}
                        style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '0.6rem',
                            fontWeight: 400,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: item === '✦' ? 'var(--gold)' : 'var(--stone)',
                            marginRight: '2.5rem',
                        }}
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
