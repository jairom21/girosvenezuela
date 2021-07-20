<template>
  <v-card class="pa-6 b-shadow">
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">HISTORIAL DE ORDENES</span>
    </div>

    <div v-if="$vuetify.breakpoint.lgOnly" class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <div style="width: 250px; margin-top: -5px">
          <v-select
            v-model="select"
            :items="search"
            label="Buscar por"
            dense
            hide-details
          />
        </div>
        <div v-if="select && select !== 'Fecha' && select !== 'Mostrar Todas' && select !== 'Punto de Venta'" style="width: 250px">
          <v-text-field
            v-model="searchParam"
            type="text"
            :label="`Escriba el ${select}`"
          />
        </div>

        <div v-if="select === 'Punto de Venta'" style="width: 250px; margin-top: -5px">
          <v-select
            v-model="selectPunto"
            :items="showPuntosVentas"
            label="Seleccione el punto de Venta"
            dense
            hide-details
          />
        </div>

        <!-- data picker -->
        <div v-if="select === 'Fecha' || selectPunto" style="width: 250px">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="showDates"
                label="Rango de fechas"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" scrollable range locale="es-es">
              <v-spacer />
              <v-btn text color="primary" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <v-chip
        v-if="filterByQuery"
        color="indigo"
        label
        text-color="white"
      >
        <v-icon left>
          mdi-label
        </v-icon>
        Total de ordenes: {{ filterByQuery.length }}
      </v-chip>
    </div>

    <div v-if="!showOrders || showOrders.length === 0" class="border mt-6 h-full d-flex align-center justify-center py-10">
      <v-progress-circular v-if="!showOrders" color="grey" class="my-2" indeterminate size="34" />
      <span v-else class="body-2 text--lighten-1 grey--text text-uppercase">no tienes ordenes pendientes</span>
    </div>

    <!-- orders -->
    <div v-else class="pb-2 mt-7 h-full">
      <div
        v-for="(e,i) in renderOrders"
        :key="i"
        class="e-panel py-3 c-hover"
        :class="colorStatus(e.status)"
      >
        <div class="body-2 px-3">
          <div class="d-flex justify-space-between align-center _resumen">
            <div>
              <div>
                <strong class="text-capitalize">{{ findUserPoint(e.uid) }}</strong>
              </div>

              <div>
                <small class="c-chip mr-1" :class="colorStatusBg(e.status)">{{ e.status }}</small>
                <small class="c-chip purple mr-2">
                  {{ e.amount.pesos.format(0, 3, '.') }} $
                </small>
                <small class="c-chip primary">
                  {{ e.destinatario.bank }}
                </small>
              </div>

              <div>
                <span class="text-uppercase grey--text">
                  {{ e.destinatario.account }}
                </span>
              </div>

              <div class="text-uppercase grey--text">
                <span>{{ $moment(e.timestamp).format('DD.MM.YYYY hh:mm a') }}</span> | <span>Orden ID-{{ e.id }}</span>
              </div>
            </div>
            <div>
              <v-btn
                title="descargar PDF"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="downloadTxt(e)"
              >
                <v-icon small color="primary">
                  mdi-file-pdf
                </v-icon>
              </v-btn>
              <v-btn
                title="copiar datos de la orden"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="copyTextClipboard(e)"
              >
                <v-icon small color="primary">
                  mdi-clipboard-check-multiple
                </v-icon>
              </v-btn>
              <v-btn
                title="ver resumen de orden"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="showDetailOrder(e)"
              >
                <v-icon small color="primary">
                  mdi-feature-search
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-pagination
      v-if="perPage < ordersLength"
      v-model="page"
      :length="lengthPagination"
      :total-visible="7"
      color="secondary"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
    />
    <modalAdminOrder />
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import modalAdminOrder from '~/components/admin/modalAdminOrder'
export default {
  components: {
    modalAdminOrder
  },
  data: () => ({
    page: 1,
    perPage: 10,
    searchParam: '',
    select: null,
    selectPunto: null,
    search: [
      'Mostrar Todas',
      'Fecha',
      'Punto de Venta',
      'Remitente',
      'Destinatario',
      'Monto',
      'Banco',
      'ID Orden'
    ],
    // date
    date: [],
    menu: false,
    modal: false,
    menu2: false
  }),
  computed: {
    ...mapGetters('adminOrders', ['showOrders']),
    ...mapGetters('adminUsers', ['showUsers']),
    showPuntosVentas () {
      if (this.showUsers) {
        return this.showUsers.map(({ company }) => company)
      }
      return []
    },
    showDates () {
      return this.date.join(' ~ ')
    },
    filterByQuery () {
      if (this.select === 'ID Orden') {
        return this.showOrders.filter(o => o.id.match(this.searchParam))
      }
      if (this.select === 'Banco') {
        return this.showOrders.filter(o => o.destinatario.bank.toLocaleLowerCase().match(this.searchParam.toLocaleLowerCase()))
      }
      if (this.select === 'Monto') {
        return this.showOrders.filter(o => (o.amount.pesos).toString().match(this.searchParam))
      }
      if (this.select === 'Punto de Venta') {
        if (this.selectPunto) {
          const orders = [...this.showOrders]
          orders.forEach((o, i) => {
            const name = this.showUsers.filter(({ uid }) => uid === o.uid)[0].company
            orders[i].point = name
          })

          const result = orders.filter(({ point }) => point.toLocaleLowerCase() === this.selectPunto.toLocaleLowerCase())

          if (this.date.length === 2) {
            const [start, end] = this.date
            return result.filter(({ timestamp }) => timestamp >= new Date(start).getTime() && timestamp <= new Date(end).getTime() + 86400000)
          }
          return result
        }
        return this.showOrders
      }
      if (this.select === 'Remitente') {
        const query = this.searchParam.split(' ')
        return this.showOrders.filter(({ remitente }) => {
          const name = `${remitente.name} ${remitente.nameSecond ? remitente.nameSecond : ''} ${remitente.surname} ${remitente.surnameSecond ? remitente.surnameSecond : ''}`.toLocaleLowerCase()

          return query.every(n => name.includes(n.toLocaleLowerCase()))
        })
      }
      if (this.select === 'Destinatario') {
        const query = this.searchParam.split(' ')
        return this.showOrders.filter(({ destinatario }) => {
          return query.every(n => destinatario.name.toLocaleLowerCase().includes(n.toLocaleLowerCase()))
        })
      }
      if (this.select === 'Fecha') {
        if (this.date.length === 2) {
          const [start, end] = this.date

          const f = this.showOrders.filter(({ timestamp }) => timestamp >= new Date(start).getTime() && timestamp <= new Date(end).getTime() + 86400000)

          const reducer = (accumulator, currentValue) => accumulator + currentValue.amount.pesos

          const _a = f.filter(({ status }, i) => status === 'completada').reduce(reducer, 0)

          console.log(_a)

          return f
        }
        return this.showOrders
      }
      return this.showOrders
    },
    renderOrders () {
      if (this.showOrders) {
        return this.paginate(this.filterByQuery)
      }
      return []
    },
    lengthPagination () {
      if (this.showOrders) {
        return Math.ceil(this.filterByQuery.length / this.perPage)
      }
      return 0
    },
    ordersLength () {
      if (this.showOrders) {
        return this.showOrders.length
      }
      return 0
    }
  },
  watch: {
    select (nw) {
      this.selectPunto = null
      this.searchParam = ''
      this.date = []
    }
  },
  methods: {
    paginate (orders) {
      const page = this.page
      const perPage = this.perPage
      const from = (page * perPage) - perPage
      const to = (page * perPage)
      return orders.slice(from, to)
    },
    downloadTxt (e) {
      const a = this.$parseObject(e)
      const p = this.$parseObject(this.findUserPointComplete(a.uid))
      const r = a.remitente
      const d = a.destinatario
      const copy = `========================\nPUNTO DE VENTA\nNombre: ${p.company}\nCiudad: ${p.city}\nDireccion: ${p.address}
\nREMITENTE\nNombre: ${r.name} ${r.nameSecond ? r.nameSecond : ''} ${r.surname} ${r.surnameSecond ? r.surnameSecond : ''}\nDocumento: ${this.$getId(r.tid)}${r.id}\nTelefono: ${r.phone}
\nDESTINATARIO\nNombre: ${d.name}\nDocumento: ${this.$getId(d.tid)}${d.id}\nBanco: ${d.bank}\nCuenta: ${d.account}
\nMONTOS\nTasa aplicada: ${a.amount.tasa}\nEnvio: ${a.amount.pesos.format(0, 3, '.')} PESOS\nRecibe: ${Number(a.amount.bs).format(0, 3, '.')} BOLIVARES\nFecha creacion de la orden: ${this.$moment(a.timestamp).format('DD-MM-YYYY hh:mm a')}\nDefinición de la orden: ${a.payout.timestamp ? this.$moment(a.payout.timestamp).format('DD-MM-YYYY hh:mm a') : 'PENDIENTE POR DEFINIR'}\n========================`

      if (process.browser) {
        const JSPDF = require('jspdf')

        const doc = new JSPDF()
        doc.text(copy, 15, 20)
        doc.save(`${a.id.toUpperCase()}.pdf`)
      }
    },
    async copyTextClipboard (o) {
      const a = this.$parseObject(o)
      const p = this.$parseObject(this.findUserPointComplete(a.uid))
      const r = a.remitente
      const d = a.destinatario
      const copy = `========================\nPUNTO DE VENTA\nNombre: ${p.company}\nCiudad: ${p.city}\nDireccion: ${p.address}
\nREMITENTE\nNombre: ${r.name} ${r.nameSecond ? r.nameSecond : ''} ${r.surname} ${r.surnameSecond ? r.surnameSecond : ''}\nDocumento: ${this.$getId(r.tid)}${r.id}\nTelefono: ${r.phone}
\nDESTINATARIO\nNombre: ${d.name}\nDocumento: ${this.$getId(d.tid)}${d.id}\nBanco: ${d.bank}\nCuenta: ${d.account}
\nMONTOS\nTasa aplicada: ${a.amount.tasa}\nEnvio: ${a.amount.pesos.format(0, 3, '.')} PESOS\nRecibe: ${Number(a.amount.bs).format(0, 3, '.')} BOLIVARES\nFecha creacion de la orden: ${this.$moment(a.timestamp).format('DD-MM-YYYY hh:mm a')}\nDefinición de la orden: ${a.payout.timestamp ? this.$moment(a.payout.timestamp).format('DD-MM-YYYY hh:mm a') : 'PENDIENTE POR DEFINIR'}\n========================`

      try {
        await this.$copyText(copy)
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Datos copiados al portapapeles',
          color: 'success'
        })
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'No se puedieron copiar los datos',
          color: 'pink'
        })
      }
    },
    findUserPointComplete (uid) {
      if (this.showUsers) {
        return this.showUsers.filter(user => user.uid === uid)[0]
      }
      return ''
    },
    showDetailOrder (order) {
      this.$nuxt.$emit('ADMIN_ORDER_OPEN', order, false)
    },
    findUserPoint (uid) {
      if (this.showUsers) {
        return this.showUsers.filter(user => user.uid === uid)[0].company
      }
      return ''
    },
    colorStatus (status) {
      return {
        'b-pendiente': status === 'pendiente',
        'b-completada': status === 'completada',
        'b-cancelada': status === 'cancelada'
      }
    },
    colorStatusBg (status) {
      return {
        'bg-pendiente': status === 'pendiente',
        'bg-completada': status === 'completada',
        'bg-cancelada': status === 'cancelada'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.e-panel {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
}
.b-pendiente {
  border-left: 3px solid #fbc02d;
}
.b-completada {
  border-left: 3px solid #00E676;
}
.b-cancelada {
  border-left: 3px solid #e91e63;
}
.bg-pendiente {
  background: #fbc02d;
}
.bg-completada {
  background: #00E676;
}
.bg-cancelada {
  background: #e91e63;
}
._resumen {
  width: 100%;
}
._resumen .col {
  padding-left: 5px;
  padding-right: 5px;
  padding: 4px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.c-chip {
  border-radius: 7px;
  padding: 0 14px;
  color: #fff;
  font-size: 9px;
}
</style>
