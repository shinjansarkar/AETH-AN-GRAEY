'use client';

import { useState } from 'react';

export default function WhatsAppToggle() {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="wa-toggle-container"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Tooltip */}
            <div className={`wa-tooltip ${hovered ? 'wa-tooltip-visible' : 'wa-tooltip-hidden'}`}>
                <span className="wa-tooltip-dot" />
                Chat on WhatsApp
            </div>

            {/* Circular floating button */}
            <a
                href="https://wa.me/917501220032"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="wa-button-wrapper"
            >
                {/* Pulse rings */}
                <span className="wa-pulse wa-pulse-1" />
                <span className="wa-pulse wa-pulse-2" />

                {/* Circle button with B/W WA logo inside */}
                <span className={`wa-button ${hovered ? 'wa-button-hover' : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        width="22"
                        height="22"
                        className="wa-icon"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </span>
            </a>

            <style jsx global>{`
                .wa-toggle-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 600;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 12px;
                }
                @media (max-width: 768px) {
                    .wa-toggle-container {
                        bottom: 64px;
                        right: 16px;
                    }
                }
                .wa-tooltip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                    border-radius: 9999px;
                    background-color: #1A1916;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 500;
                    color: white;
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
                    border: 1px solid #333;
                    transition: all 0.3s ease-out;
                }
                .wa-tooltip-visible {
                    opacity: 1;
                    transform: translateX(0);
                    pointer-events: auto;
                }
                .wa-tooltip-hidden {
                    opacity: 0;
                    transform: translateX(12px);
                    pointer-events: none;
                }
                .wa-tooltip-dot {
                    height: 6px;
                    width: 6px;
                    border-radius: 9999px;
                    background-color: white;
                    animation: wa-pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .wa-button-wrapper {
                    position: relative;
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    -webkit-tap-highlight-color: transparent;
                    animation: wa-float 3s ease-in-out infinite;
                }
                .wa-pulse {
                    position: absolute;
                    inset: 0;
                    border-radius: 9999px;
                    background-color: #1A1916;
                }
                .wa-pulse-1 {
                    animation: wa-ping-black 2s ease-out infinite;
                }
                .wa-pulse-2 {
                    animation: wa-ping-black 2s ease-out 0.7s infinite;
                }
                .wa-button {
                    position: relative;
                    display: flex;
                    height: 44px;
                    width: 44px;
                    background-color: #1A1916;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    border-radius: 9999px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
                    transition: transform 0.2s;
                    transform: scale(1);
                }
                .wa-button.wa-button-hover {
                    transform: scale(1.1);
                }
                .wa-button:active {
                    transform: scale(0.95);
                }
                .wa-icon {
                    display: block;
                }
                @keyframes wa-pulse-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .3; }
                }
                @keyframes wa-ping-black {
                    0%   { opacity: 0.3;  transform: scale(1); }
                    80%  { opacity: 0;    transform: scale(1.8); }
                    100% { opacity: 0;    transform: scale(1.8); }
                }
                @keyframes wa-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-7px); }
                }
            `}</style>
        </div>
    );
}
