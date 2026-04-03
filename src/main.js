import { createApp, nextTick } from 'vue'
import vuetify from '@/plugins/vuetify'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/i18n'

import counter from '@/helpers/counter.dev'
counter()

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.use(vuetify)

app.mount('#app')

const DEFAULT_TITLE = 'Barotrauma Save Editor'
router.afterEach(function (to) {
  nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE
    if (to.meta.desc) document.querySelector('meta[name="description"]').setAttribute('content', to.meta.desc)
    if (to.meta.keywords) document.querySelector('meta[name="keywords"]').setAttribute('content', to.meta.keywords)
  })
})
