module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        heading: ['Open Sans', 'sans-serif']
      },
      keyframes: {
        heart: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        heart: 'heart 2s linear infinite'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [],
  mode: 'jit'
}
