import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'

const routes = [
  {
    path: '/',
    alias: '/index.html',
    name: 'SaveTools',
    component: () => import('../views/SaveTools.vue'),
    meta: {
      title: i18n.global.t('router.saveTools'),
      keywords: 'barotrauma, save editor, save, editor, submarine, decompressor',
      desc: i18n.global.t('aboutSaveEditor.description'),
      beforeEnter: (to, from, next) => {
        // handle redirect from 404.html
        var redirect = sessionStorage.redirect
        if (redirect) {
          console.log(`Detected redirect to ${redirect}`)
          if (redirect.endsWith('/')) redirect = redirect.slice(0, -1)
          delete sessionStorage.redirect
          next(redirect)
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/SubTools',
    name: 'SubTools',
    component: () => import('../views/SubTools.vue'),
    meta: {
      title: i18n.global.t('router.subTools'),
      keywords: 'barotrauma, submarine editor, submarine, editor, tools',
      desc: i18n.global.t('aboutSubEditor.description'),
    },
  },
  {
    path: '/Decompressor',
    name: 'Decompressor',
    component: () => import('../views/Decompressor.vue'),
    meta: {
      title: i18n.global.t('router.decompressor'),
      keywords: 'barotrauma, save, decompressor, compressor',
      desc: i18n.global.t('decompressor.description'),
    },
  },
  {
    path: '/About',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: i18n.global.t('router.about'),
      keywords: 'barotrauma, save editor, save, editor, submarine, decompressor',
      desc: i18n.global.t('aboutSaveEditor.description'),
    },
  },
]

const router = createRouter({
  history: createWebHistory('/baro-save-editor/'),
  routes,
})

export default router
