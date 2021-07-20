<template>
  <v-card
    class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
    height="100%"
  >
    <div class="d-flex justify-space-between align-center">
      <span color="black" class="body-1 font-weight-bold p-color">MOVIMIENTOS</span>
      <div v-if="$vuetify.breakpoint.lgOnly && ordersLength > 0" style="width: 250px">
        <v-text-field
          v-model="searchId"
          type="number"
          label="Buscar por ID Detinatario"
        />
      </div>
    </div>
    <div v-if="!showOnOrders || showOrders.length === 0" class="border mt-6 h-full d-flex align-center justify-center h-min">
      <v-progress-circular v-if="!showOnOrders" color="grey" class="my-2" indeterminate size="34" />
      <span v-else class="body-2 text--lighten-1 grey--text text-uppercase">no tienes moviemientos</span>
    </div>
    <!-- orders -->
    <div v-else class="pb-2 mt-7 h-full">
      <div class="d-flex _resumen font-weight-thin caption">
        <v-col cols="1">
          <strong> FECHA </strong>
        </v-col>
        <v-col cols="3" class="text-capitalize">
          <span> REMITENTE </span>
        </v-col>
        <v-col cols="2" class="text-capitalize">
          <span> DESTINATARIO </span>
        </v-col>
        <v-col cols="2" class="text-lg-right">
          <span> MONTO </span>
        </v-col>
        <v-col cols="1" class="text-capitalize">
          <span> ESTADO </span>
        </v-col>
        <v-col cols="2" class="text-lg-right">
          <strong> GANANCIA</strong>
        </v-col>
        <v-col cols="1" class="text-lg-right">
          <strong />
        </v-col>
      </div>
      <div
        v-for="(e,i) in renderOrders"
        :key="i"
        class="e-panel py-3"
      >
        <div class="body-2 px-0">
          <div class="d-flex _resumen">
            <v-col cols="1">
              <strong> {{ $moment(e.timestamp).format('DD.MM') }} </strong>
            </v-col>
            <v-col cols="3" class="text-capitalize">
              <span> {{ `${e.remitente.name} ${e.remitente.nameSecond ? e.remitente.nameSecond : ''} ${e.remitente.surname} ${e.remitente.surnameSecond ? e.remitente.surnameSecond : ''}` }} </span>
            </v-col>
            <v-col cols="2" class="text-capitalize">
              <span> {{ e.destinatario.name }} </span>
            </v-col>
            <v-col cols="2" class="text-lg-right">
              <span> {{ e.amount.pesos.format(0, 3, '.') }} $ </span>
            </v-col>
            <v-col cols="1" class="text-capitalize pink--text">
              <strong
                :class="{
                  'text--darken-2 yellow--text ': e.status === 'pendiente',
                  'pink--text': e.status === 'cancelada',
                  'text--accent-3 green--text': e.status === 'completada'
                }"
              > {{ e.status }} </strong>
            </v-col>
            <v-col cols="2" class="text-lg-right">
              <strong> {{ calcPercentage(e.amount.pesos) }} $</strong>
            </v-col>
            <v-col cols="1" class="text-lg-right d-flex justify-end">
              <div class="mr-2">
                <v-icon small color="primary" title="copiar datos de la orden" class="c-pointer" @click="copyTextClipboard(e)">
                  mdi-clipboard-check-multiple
                </v-icon>
              </div>
              <v-icon small color="blue" title="ver detalles" class="c-pointer" @click="showDetailOrder(e)">
                mdi-order-bool-ascending-variant
              </v-icon>
            </v-col>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center my-5">
      <v-pagination
        v-if="perPage < ordersLength"
        v-model="page"
        :length="lengthPagination"
        :total-visible="3"
        color="secondary"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      />
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    page: 1,
    perPage: 10,
    searchId: ''
  }),
  computed: {
    ...mapGetters('user', ['showUser']),
    ...mapGetters('orders', ['showOrders', 'showOnOrders']),
    filterByIdDestinatario () {
      return this.showOrders.filter(o => o.destinatario.id.match(this.searchId))
    },
    renderOrders () {
      if (this.showOrders) {
        return this.paginate(this.filterByIdDestinatario)
      }
      return []
    },
    lengthPagination () {
      if (this.showOrders) {
        return Math.ceil(this.filterByIdDestinatario.length / this.perPage)
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
  methods: {
    ...mapActions('resumeOrder', ['setResumeOrder']),
    async copyTextClipboard (o) {
      const a = this.$parseObject(o)
      const r = a.remitente
      const d = a.destinatario
      const copy = `========================\nREMITENTE\nNombre: ${r.name} ${r.nameSecond ? r.nameSecond : ''} ${r.surname} ${r.surnameSecond ? r.surnameSecond : ''}\nDocumento: ${this.$getId(r.tid)}${r.id}\nTelefono: ${r.phone}
\nDESTINATARIO\nNombre: ${d.name}\nDocumento: ${this.$getId(d.tid)}${d.id}\nBanco: ${d.bank}\nCuenta: ${d.account}
\nMONTOS\nTasa aplicada: ${a.amount.tasa}\nEnvio: ${Number(a.amount.pesos).format(0, 3, '.')} PESOS\nRecibe: ${Number(a.amount.bs).format(0, 3, '.')} BOLIVARES\nFecha creacion de la orden: ${this.$moment(a.timestamp).format('DD-MM-YYYY hh:mm a')}\nDefinición de la orden: ${a.payout.timestamp ? this.$moment(a.payout.timestamp).format('DD-MM-YYYY hh:mm a') : 'PENDIENTE POR DEFINIR'}\n========================`

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
    paginate (orders) {
      const page = this.page
      const perPage = this.perPage
      const from = (page * perPage) - perPage
      const to = (page * perPage)
      return orders.slice(from, to)
    },
    showDetailOrder (order) {
      this.setResumeOrder(order)
      this.$router.push('/dashboard/resumen/orden')
    },
    calcPercentage (amount) {
      return ((amount * this.showUser.percentage) / 100).format(0, 3, '.')
    }
  }
}
</script>
<style lang="scss" scoped>
.e-panel {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
}
.h-min {
  min-height: 350px;
  height: 100%;
}
.v-expansion-panel-header > *:not(.v-expansion-panel-header__icon) {
  flex: initial;
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
</style>
