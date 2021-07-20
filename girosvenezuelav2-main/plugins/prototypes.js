/* eslint-disable */
import Vue from 'vue'

Vue.prototype.$formatObject = (object) => {
  return Object.keys(object).forEach((key) => {
    object[key] = null
  })
}

Vue.prototype.$generateToken = (length) => {
  const rand = () => Math.random(0).toString(36).substr(2)
  return (rand() + rand() + rand() + rand()).substr(0, length)
}

Vue.prototype.$parseObject = (object) => {
  return JSON.parse(JSON.stringify(object))
}

Vue.prototype.$calcAmount = (amount, tasa, cove) => {
  if (cove) {
    return Math.floor(Number(amount / tasa))
  }
  return Math.ceil(Number(amount * tasa))
}

Vue.prototype.$formatNumber = Number.prototype.format = function (n, x, s, c) {
  const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')'
  const num = this.toFixed(Math.max(0, ~~n))

  return (c ? num.replace('.', c) : num).replace(
    new RegExp(re, 'g'),
    '$&' + (s || ',')
  )
}

Vue.prototype.$getId = (id) => {
  if (id === 'Cedula Colombiana') { return 'CC-' }
  if (id === 'Cedula Venezolana') { return 'V-' }
  if (id === 'Pasaporte') { return 'P-' }
  if (id === 'Extranjero') { return 'E-' }
  if (id === 'Juridico') { return 'J-' }
}
