import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5969a701 = () => interopDefault(import('..\\pages\\admin\\index.vue' /* webpackChunkName: "pages_admin_index" */))
const _2446e660 = () => interopDefault(import('..\\pages\\calculador.vue' /* webpackChunkName: "pages_calculador" */))
const _16991f9c = () => interopDefault(import('..\\pages\\dashboard\\index.vue' /* webpackChunkName: "pages_dashboard_index" */))
const _28eb3d7b = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _0cc7c85b = () => interopDefault(import('..\\pages\\recuperar.vue' /* webpackChunkName: "pages_recuperar" */))
const _2fea8e63 = () => interopDefault(import('..\\pages\\admin\\calculator.vue' /* webpackChunkName: "pages_admin_calculator" */))
const _40afdae7 = () => interopDefault(import('..\\pages\\admin\\ordenes.vue' /* webpackChunkName: "pages_admin_ordenes" */))
const _a774d1e0 = () => interopDefault(import('..\\pages\\admin\\puntos.vue' /* webpackChunkName: "pages_admin_puntos" */))
const _437085d6 = () => interopDefault(import('..\\pages\\admin\\remitentes.vue' /* webpackChunkName: "pages_admin_remitentes" */))
const _50850fee = () => interopDefault(import('..\\pages\\dashboard\\cuenta.vue' /* webpackChunkName: "pages_dashboard_cuenta" */))
const _5f52e9c8 = () => interopDefault(import('..\\pages\\dashboard\\movimientos.vue' /* webpackChunkName: "pages_dashboard_movimientos" */))
const _1d2c4620 = () => interopDefault(import('..\\pages\\dashboard\\notificaciones.vue' /* webpackChunkName: "pages_dashboard_notificaciones" */))
const _1fe50bea = () => interopDefault(import('..\\pages\\dashboard\\reportar.vue' /* webpackChunkName: "pages_dashboard_reportar" */))
const _02ec1fef = () => interopDefault(import('..\\pages\\dashboard\\resumen\\orden.vue' /* webpackChunkName: "pages_dashboard_resumen_orden" */))
const _5f439a64 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

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
    component: _5969a701,
    name: "admin"
  }, {
    path: "/calculador",
    component: _2446e660,
    name: "calculador"
  }, {
    path: "/dashboard",
    component: _16991f9c,
    name: "dashboard"
  }, {
    path: "/login",
    component: _28eb3d7b,
    name: "login"
  }, {
    path: "/recuperar",
    component: _0cc7c85b,
    name: "recuperar"
  }, {
    path: "/admin/calculator",
    component: _2fea8e63,
    name: "admin-calculator"
  }, {
    path: "/admin/ordenes",
    component: _40afdae7,
    name: "admin-ordenes"
  }, {
    path: "/admin/puntos",
    component: _a774d1e0,
    name: "admin-puntos"
  }, {
    path: "/admin/remitentes",
    component: _437085d6,
    name: "admin-remitentes"
  }, {
    path: "/dashboard/cuenta",
    component: _50850fee,
    name: "dashboard-cuenta"
  }, {
    path: "/dashboard/movimientos",
    component: _5f52e9c8,
    name: "dashboard-movimientos"
  }, {
    path: "/dashboard/notificaciones",
    component: _1d2c4620,
    name: "dashboard-notificaciones"
  }, {
    path: "/dashboard/reportar",
    component: _1fe50bea,
    name: "dashboard-reportar"
  }, {
    path: "/dashboard/resumen/orden",
    component: _02ec1fef,
    name: "dashboard-resumen-orden"
  }, {
    path: "/",
    component: _5f439a64,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
