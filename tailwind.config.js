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
                'fade-in': 'fade-in 1s ease-out',
                'fade-in-up': 'fade-in-up 1s ease-out',
            },
        },
    },

    plugins: [forms, flowbite.plugin()],
};
