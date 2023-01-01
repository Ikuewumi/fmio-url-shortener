/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./index.html"
   ],
   theme: {
      screens: {
         sm: '470px',
         md: '708px',
         lg: '804px',
         xl: '1240px'
      },
      extend: {
         colors: {
            cyan: 'hsl(180, 66%, 49%)',
            darkViolet: 'hsl(257, 27%, 26%)',
            red: 'hsl(0, 87%, 67%)',
            gray: 'hsl(0, 0%, 75%)',
            darkGray: 'hsl(0, 0%, 45%)',
            grayishViolet: 'hsl(257, 7%, 63%)',
            veryDarkBlue: 'hsl(255, 11%, 22%)',
            veryDarkViolet: 'hsl(260, 8%, 14%)'
         },

         // fontSize: '18px'
      },
   },
   plugins: [],
}
