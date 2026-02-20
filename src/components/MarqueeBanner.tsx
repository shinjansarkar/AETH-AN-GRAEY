'use client';

const items = [
    'Oxford',
    '✦',
    'Monk Strap',
    '✦',
    'Chelsea Boot',
    '✦',
    'Pure Goat Leather',
    '✦',
    'Handmade in India',
    '✦',
    'Delivered DDP to Europe',
    '✦',
    'One Artisan',
    '✦',
    'Bespoke Craftsmanship',
    '✦',
    'Three Signatures',
    '✦',
    'No Assembly Lines',
    '✦',
];

export default function MarqueeBanner() {
    const doubled = [...items, ...items];

    return (
        <div className="marquee-track">
            {doubled.map((item, i) => (
                <span
                    key={i}
                    style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: item === '✦' ? '0.42rem' : '0.5rem',
                        fontWeight: 400,
                        letterSpacing: item === '✦' ? '0' : '0.3em',
                        textTransform: 'uppercase',
                        color: item === '✦'
                            ? '#A8925A'
                            : ['Oxford', 'Monk Strap', 'Chelsea Boot'].includes(item)
                                ? '#1A1916'
                                : '#7A7570',
                        marginRight: '2.2rem',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {item}
                </span>
            ))}
        </div>
    );
}
