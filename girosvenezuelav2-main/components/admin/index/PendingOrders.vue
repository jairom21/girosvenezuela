<template>
  <v-card class="pa-6 b-shadow">
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">ORDENES PENDIENTES</span>
    </div>

    <div v-if="!showOrders || showOrders.filter(e => e.status === 'pendiente').length === 0" class="border mt-6 h-full d-flex align-center justify-center py-10">
      <v-progress-circular v-if="!showOrders" color="grey" class="my-2" indeterminate size="34" />
      <span v-else class="body-2 text--lighten-1 grey--text text-uppercase">no tienes ordenes pendientes</span>
    </div>

    <!-- orders -->
    <div v-else class="pb-2 mt-7 h-full">
      <div
        v-for="(e,i) in showOrders.filter(e => e.status === 'pendiente')"
        :key="i"
        class="e-panel py-3 c-hover"
      >
        <div class="body-2 px-0">
          <div class="d-flex justify-space-between align-center _resumen">
            <div>
              <div>
                <strong class="text-capitalize">{{ findUserPoint(e.uid) }}</strong>
              </div>

              <div>
                <span class="c-chip primary">{{ e.destinatario.bank }}</span>
                <span class="c-chip purple">
                  {{ e.amount.pesos.format(0, 3, '.') }} $
                </span>
              </div>

              <div>
                <span class="c-chip grey">
                  {{ e.destinatario.account }}
                </span>
              </div>

              <div class="text-uppercase grey--text">
                <span>{{ $moment(e.timestamp).format('DD.MM.YYYY hh:mm a') }}</span> | <span>Orden ID-{{ e.id }}</span>
              </div>
            </div>
            <div>
              <v-btn
                title="copiar datos de la ordn"
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
                title="administrar orden pendiente"
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
  computed: {
    ...mapGetters('adminOrders', ['showOrders']),
    ...mapGetters('adminUsers', ['showUsers'])
  },
  methods: {
    async copyTextClipboard (o) {
      const a = this.$parseObject(o)
      const p = this.$parseObject(this.findUserPointComplete(a.uid))
      const r = a.remitente
      const d = a.destinatario
      const copy = `========================\nPUNTO DE VENTA\nNombre: ${p.company}\nCiudad: ${p.city}\nDireccion: ${p.address}\n\nREMITENTE\nNombre: ${r.name} ${r.nameSecond ? r.nameSecond : ''} ${r.surname} ${r.surnameSecond ? r.surnameSecond : ''}\nDocumento: ${this.$getId(r.tid)}${r.id}\nTelefono: ${r.phone}\n\nDESTINATARIO\nNombre: ${d.name}\nDocumento: ${this.$getId(d.tid)}${d.id}\nBanco: ${d.bank}\nCuenta: ${d.account}\n\nMONTOS\nTasa aplicada: ${a.amount.tasa}\nEnvio: ${Number(a.amount.pesos).format(0, 3, '.')} PESOS\nRecibe: ${Number(a.amount.bs).format(0, 3, '.')} BOLIVARES\nFecha creacion de la orden: ${this.$moment(a.timestamp).format('DD-MM-YYYY hh:mm a')}\n========================`

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
      this.$nuxt.$emit('ADMIN_ORDER_OPEN', order, true)
    },
    findUserPoint (uid) {
      if (this.showUsers) {
        return this.showUsers.filter(user => user.uid === uid)[0].company
      }
      return ''
    }
  }
}
</script>
<style lang="scss" scoped>
.e-panel {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
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
