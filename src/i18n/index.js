import { createI18n } from 'vue-i18n'
import enUS from './en-US.js'
import zhCN from './zh-CN.js'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
  },
})

export default i18n
