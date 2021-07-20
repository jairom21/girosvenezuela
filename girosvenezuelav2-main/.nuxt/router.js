import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _485185d2 = () => interopDefault(import('..\\pages\\admin\\index.vue' /* webpackChunkName: "pages_admin_index" */))
const _6c769f34 = () => interopDefault(import('..\\pages\\calculador.vue' /* webpackChunkName: "pages_calculador" */))
const _44fc8a9c = () => interopDefault(import('..\\pages\\dashboard\\index.vue' /* webpackChunkName: "pages_dashboard_index" */))
const _a6d697b6 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _1c21da05 = () => interopDefault(import('..\\pages\\recuperar.vue' /* webpackChunkName: "pages_recuperar" */))
const _4615560d = () => interopDefault(import('..\\pages\\admin\\calculator.vue' /* webpackChunkName: "pages_admin_calculator" */))
const _43df7906 = () => interopDefault(import('..\\pages\\admin\\ordenes.vue' /* webpackChunkName: "pages_admin_ordenes" */))
const _778ac3ba = () => interopDefault(import('..\\pages\\admin\\puntos.vue' /* webpackChunkName: "pages_admin_puntos" */))
const _171af682 = () => interopDefault(import('..\\pages\\admin\\remitentes.vue' /* webpackChunkName: "pages_admin_remitentes" */))
const _66afd798 = () => interopDefault(import('..\\pages\\dashboard\\cuenta.vue' /* webpackChunkName: "pages_dashboard_cuenta" */))
const _49e45c5e = () => interopDefault(import('..\\pages\\dashboard\\movimientos.vue' /* webpackChunkName: "pages_dashboard_movimientos" */))
const _35614acc = () => interopDefault(import('..\\pages\\dashboard\\notificaciones.vue' /* webpackChunkName: "pages_dashboard_notificaciones" */))
const _26a4ff35 = () => interopDefault(import('..\\pages\\dashboard\\reportar.vue' /* webpackChunkName: "pages_dashboard_reportar" */))
const _125cc4ce = () => interopDefault(import('..\\pages\\dashboard\\resumen\\orden.vue' /* webpackChunkName: "pages_dashboard_resumen_orden" */))
const _3a25dde4 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _485185d2,
    name: "admin"
  }, {
    path: "/calculador",
    component: _6c769f34,
    name: "calculador"
  }, {
    path: "/dashboard",
    component: _44fc8a9c,
    name: "dashboard"
  }, {
    path: "/login",
    component: _a6d697b6,
    name: "login"
  }, {
    path: "/recuperar",
    component: _1c21da05,
    name: "recuperar"
  }, {
    path: "/admin/calculator",
    component: _4615560d,
    name: "admin-calculator"
  }, {
    path: "/admin/ordenes",
    component: _43df7906,
    name: "admin-ordenes"
  }, {
    path: "/admin/puntos",
    component: _778ac3ba,
    name: "admin-puntos"
  }, {
    path: "/admin/remitentes",
    component: _171af682,
    name: "admin-remitentes"
  }, {
    path: "/dashboard/cuenta",
    component: _66afd798,
    name: "dashboard-cuenta"
  }, {
    path: "/dashboard/movimientos",
    component: _49e45c5e,
    name: "dashboard-movimientos"
  }, {
    path: "/dashboard/notificaciones",
    component: _35614acc,
    name: "dashboard-notificaciones"
  }, {
    path: "/dashboard/reportar",
    component: _26a4ff35,
    name: "dashboard-reportar"
  }, {
    path: "/dashboard/resumen/orden",
    component: _125cc4ce,
    name: "dashboard-resumen-orden"
  }, {
    path: "/",
    component: _3a25dde4,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
