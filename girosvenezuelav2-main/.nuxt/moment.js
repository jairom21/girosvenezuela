import moment from 'moment'

import 'moment/locale/es'

import 'moment-timezone'

moment.locale('es')

export default (ctx, inject) => {
  ctx.$moment = moment
  inject('moment', moment)
}
