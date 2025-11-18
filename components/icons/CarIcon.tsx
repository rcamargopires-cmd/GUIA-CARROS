
import React from 'react';

export const CarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14 16.5V15a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.5"></path>
        <path d="M2 10h20"></path>
        <path d="M6 11v-2.5c0-1.8.8-3.5 2.1-4.5C9.4 3.2 10.7 2.6 12 2.5s2.6.1 3.9.9c1.3.8 2.1 2.5 2.1 4.5V11"></path>
        <circle cx="6.5" cy="16.5" r="2.5"></circle>
        <circle cx="17.5" cy="16.5" r="2.5"></circle>
    </svg>
);
