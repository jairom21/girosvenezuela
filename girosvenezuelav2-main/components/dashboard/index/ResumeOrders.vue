<template>
  <v-col cols="12" lg="7" class="pl-lg-2 mt-4 mt-lg-0 py-0">
    <v-card
      class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
      height="100%"
    >
      <div class="d-flex justify-space-between align-center">
        <span color="black" class="body-1 font-weight-bold p-color">ULTIMOS MOVIMIENTOS</span>
        <v-btn depressed color="#133d63" small title="ver todos los movimientos" to="/dashboard/movimientos">
          <v-icon size="large" class="white--text">
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </div>
      <div v-if="!showOnOrders || showOrders.length === 0" class="border mt-6 h-full d-flex align-center justify-center">
        <v-progress-circular v-if="!showOnOrders" color="grey" class="my-2" indeterminate size="34" />
        <span v-else class="body-2 text--lighten-1 grey--text text-uppercase">no tienes moviemientos</span>
      </div>
      <!-- orders -->
      <div v-else class="pb-2 mt-7 h-full">
        <div class="d-flex _resumen font-weight-thin caption">
          <v-col cols="1">
            <strong> FECHA </strong>
          </v-col>
          <v-col cols="4" class="text-capitalize">
            <span> DESTINATARIO </span>
          </v-col>
          <v-col cols="2" class="text-lg-right">
            <span> MONTO </span>
          </v-col>
          <v-col cols="2" class="text-capitalize">
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
          v-for="(e,i) in showOrders.slice(0,5)"
          :key="i"
          class="e-panel py-3 c-hover"
        >
          <div class="body-2 px-0">
            <div class="d-flex _resumen">
              <v-col cols="1">
                <strong> {{ $moment(e.timestamp).format('DD.MM') }} </strong>
              </v-col>
              <v-col cols="4" class="text-capitalize">
                <span> {{ e.destinatario.name }} </span>
              </v-col>
              <v-col cols="2" class="text-lg-right">
                <span> {{ e.amount.pesos.format(0, 3, '.') }} $ </span>
              </v-col>
              <v-col cols="2" class="text-capitalize pink--text">
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
              <v-col cols="1" class="text-lg-right">
                <v-icon small title="ver detalles" class="c-pointer" @click="showDetailOrder(e)">
                  mdi-order-bool-ascending-variant
                </v-icon>
              </v-col>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-col>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('user', ['showUser']),
    ...mapGetters('orders', ['showOrders', 'showOnOrders'])
  },
  methods: {
    ...mapActions('resumeOrder', ['setResumeOrder']),
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
