import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
        flowbite.content(),
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                summer: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                beach: {
                    sand: '#fef3c7',
                    'sand-light': '#fef9e7',
                    water: '#38bdf8',
                    'water-light': '#7dd3fc',
                    sky: '#0ea5e9',
                    'sky-light': '#38bdf8',
                    coral: '#fb7185',
                    'coral-light': '#fda4af',
                    shell: '#f472b6',
                    'shell-light': '#f9a8d4',
                },
                tropical: {
                    leaf: '#22c55e',
                    'leaf-light': '#86efac',
                    flower: '#e879f9',
                    'flower-light': '#f0abfc',
                    fruit: '#fbbf24',
                    'fruit-light': '#fcd34d',
                },
            },
            boxShadow: {
                'summer': '0 0 50px -12px rgba(249, 115, 22, 0.25)',
                'summer-lg': '0 0 60px -12px rgba(249, 115, 22, 0.35)',
                'glow': '0 0 15px -3px rgba(249, 115, 22, 0.1)',
                'glow-blue': '0 0 20px -5px rgba(56, 189, 248, 0.3)',
                'glow-pink': '0 0 20px -5px rgba(244, 114, 182, 0.3)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
            },
            keyframes: {
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'float-slower': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                'float-slowest': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'sway': {
                    '0%, 100%': { transform: 'rotate(-15deg)' },
                    '50%': { transform: 'rotate(-10deg)' },
                },
                'sway-reverse': {
                    '0%, 100%': { transform: 'rotate(15deg)' },
                    '50%': { transform: 'rotate(10deg)' },
                },
                'palm-wave': {
                    '0%, 100%': { transform: 'skew-x-12 rotate(-5deg)' },
                    '50%': { transform: 'skew-x-12 rotate(5deg)' },
                },
                'palm-wave-reverse': {
                    '0%, 100%': { transform: '-skew-x-12 rotate(5deg)' },
                    '50%': { transform: '-skew-x-12 rotate(-5deg)' },
                },
                'spin-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'wave': {
                    '0%, 100%': { transform: 'translateX(0) skew-x-12' },
                    '50%': { transform: 'translateX(-25%) skew-x-12' },
                },
                'wave-slow': {
                    '0%, 100%': { transform: 'translateX(0) skew-x-12' },
                    '50%': { transform: 'translateX(25%) skew-x-12' },
                },
                'bird-flight': {
                    '0%': { transform: 'translate(0, 0)' },
                    '50%': { transform: 'translate(100vw, -30px)' },
                    '50.001%': { transform: 'translate(-100vw, -30px)' },
                    '100%': { transform: 'translate(0, 0)' },
                },
                'bird-flight-slow': {
                    '0%': { transform: 'translate(-25%, 0)' },
                    '50%': { transform: 'translate(100vw, -20px)' },
                    '50.001%': { transform: 'translate(-100vw, -20px)' },
                    '100%': { transform: 'translate(-25%, 0)' },
                },
                'wing': {
                    '0%, 100%': { transform: 'rotate(30deg)' },
                    '50%': { transform: 'rotate(-10deg)' },
                },
                'wing-reverse': {
                    '0%, 100%': { transform: 'rotate(-30deg)' },
                    '50%': { transform: 'rotate(10deg)' },
                },
                'wing-slow': {
                    '0%, 100%': { transform: 'rotate(35deg)' },
                    '50%': { transform: 'rotate(-15deg)' },
                },
                'wing-reverse-slow': {
                    '0%, 100%': { transform: 'rotate(-35deg)' },
                    '50%': { transform: 'rotate(15deg)' },
                },
                'gradient': {
                    '0%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                    '100%': { 'background-position': '0% 50%' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                'sparkle': {
                    '0%, 100%': {
                        'transform': 'scale(0) rotate(0deg)',
                        'opacity': '0',
                    },
                    '50%': {
                        'transform': 'scale(1) rotate(180deg)',
                        'opacity': '0.8',
                    }
                },
                'float-gentle': {
                    '0%, 100%': {
                        'transform': 'translate(0, 0) rotate(0deg)',
                    },
                    '50%': {
                        'transform': 'translate(5px, -5px) rotate(2deg)',
                    }
                },
                'ripple': {
                    '0%': {
                        'transform': 'scale(0)',
                        'opacity': '1',
                    },
                    '100%': {
                        'transform': 'scale(4)',
                        'opacity': '0',
                    }
                },
                'bounce-gentle': {
                    '0%, 100%': {
                        'transform': 'translateY(0)',
                        'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        'transform': 'translateY(-5%)',
                        'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
                    }
                },
            },
            animation: {
                'float-slow': 'float-slow 4s ease-in-out infinite',
                'float-slower': 'float-slower 6s ease-in-out infinite',
                'float-slowest': 'float-slowest 8s ease-in-out infinite',
                'sway': 'sway 6s ease-in-out infinite',
                'sway-reverse': 'sway-reverse 6s ease-in-out infinite',
                'palm-wave': 'palm-wave 4s ease-in-out infinite',
                'palm-wave-reverse': 'palm-wave-reverse 4s ease-in-out infinite',
                'spin-slow': 'spin-slow 20s linear infinite',
                'wave': 'wave 8s ease-in-out infinite',
                'wave-slow': 'wave-slow 10s ease-in-out infinite',
                'bird-flight': 'bird-flight 20s linear infinite',
                'bird-flight-slow': 'bird-flight-slow 25s linear infinite',
                'wing': 'wing 1s ease-in-out infinite',
                'wing-reverse': 'wing-reverse 1s ease-in-out infinite',
                'wing-slow': 'wing-slow 1.2s ease-in-out infinite',
                'wing-reverse-slow': 'wing-reverse-slow 1.2s ease-in-out infinite',
                'gradient': 'gradient 6s ease infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'fade-in': 'fade-in 0.5s ease-out',
                'fade-in-up': 'fade-in-up 0.5s ease-out',
                'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
                'sparkle': 'sparkle 2s ease-in-out infinite',
                'float-gentle': 'float-gentle 3s ease-in-out infinite',
                'ripple': 'ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                'bounce-gentle': 'bounce-gentle 2s infinite',
            },
            backgroundImage: {
                'summer-gradient': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
                'beach-pattern': 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17.5c4.142 0 7.5-3.358 7.5-7.5S14.142 2.5 10 2.5 2.5 5.858 2.5 10s3.358 7.5 7.5 7.5z\' fill=\'%23fff\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
                'wave-pattern': 'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 15c5.523 0 10-4.477 10-10S5.523-5 0-5v20zm20 0c-5.523 0-10-4.477-10-10S14.477-5 20-5v20z\' fill=\'%23fff\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },

    plugins: [
        forms,
        flowbite.plugin(),
        function({ addUtilities }) {
            const newUtilities = {
                '.text-shadow-sm': {
                    'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.05)',
                },
                '.text-shadow': {
                    'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
                '.text-shadow-md': {
                    'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.12)',
                },
                '.text-shadow-lg': {
                    'text-shadow': '0 8px 16px rgba(0, 0, 0, 0.15)',
                },
                '.text-shadow-none': {
                    'text-shadow': 'none',
                },
            };
            addUtilities(newUtilities, ['hover', 'focus']);
        },
    ],
};
