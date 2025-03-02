import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'

const vuetify = createVuetify({
  defaults: {
    VBtn: {
      rounded: false,
      elevation: 10,
      
      style: {
        boxShadow: '10px 10px 0 0 #000',
        border: '2px solid #000',
      },
    },
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#ffcc00',
          secondary: '#ff9900',
          accent: '#000000',
          error: '#ff0000',
          info: '#00ff00',
          success: '#0000ff',
          warning: '#ffff00',
        },
      },
    },
  },
})

export default vuetify
