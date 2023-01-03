/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.{html,js}'],
  safelist: [
    'bg-[#ff3f3f]', 'bg-[#FFA500]', 'bg-[#FFFF00]', 'bg-[#99cc99]', 'bg-[#008000]', 'bg-[#0000FF]',
    'bg-[#4B0082]', 'bg-[#EE82EE]', 'bg-[#FF69B4]', 'bg-[#8B008B]', 'bg-[#FFD700]',
    'bg-[#FF00FF]', 'bg-[#00FFFF]','bg-[#ff9999]', 'bg-[#ffcc99]', 'bg-[#ffff99]', 'bg-[#99ccff]',
    'bg-[#9999e6]', 'bg-[#ffccff]', 'bg-[#ff99cc]', 'bg-[#ffffcc]', 'bg-[#ff99ff]', 'bg-[#99ffff]',
    'bg-[#FF4500]', 'bg-[#6495ED]', 'bg-[#7CFC00]', 'bg-[#FF1493]', 'bg-[#00BFFF]'
  ],
  theme: {
    extend: {
      boxShadow: {
        'card': '0 4px 6px 0px rgba(54, 78, 126, 0.1)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
