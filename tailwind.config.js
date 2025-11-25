/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bgDark: '#09090b',
                bgCard: '#18181b',
                primary: '#2bd3e0',
                secondary: '#611b93',
                muted: '#a1a1aa',
            },
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
