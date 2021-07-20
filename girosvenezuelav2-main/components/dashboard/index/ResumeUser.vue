<template>
  <v-col cols="12" lg="7" class="pr-lg-2 py-0">
    <v-card
      class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
      height="100%"
    >
      <div>
        <div class="d-flex justify-space-between">
          <span class="caption font-weight-bold text--lighten-1 grey--text">Nombre Punto de Venta</span>
          <span class="caption font-weight-bold text--lighten-1 grey--text">Ganancias estimadas</span>
        </div>
        <div class="d-flex justify-space-between title font-weight-bold mt-4">
          <v-col cols="8" class="pa-0">
            <div class="d-flex flex-column">
              <v-skeleton-loader
                v-if="!showUser"
                width="100%"
                height="50"
                type="list-item-two-line"
              />
              <div v-else>
                <p color="black" class="mr-5 text-capitalize p-color">
                  {{ showUser.company }}
                </p>
                <p class="caption font-weight-bold text--lighten-1 grey--text text-capitalize">
                  {{ showUser.name }}
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="4" class="pa-0">
            <v-skeleton-loader
              v-if="!showOnOrders"
              width="100%"
              height="50"
              type="list-item"
            />
            <span v-else class="headline font-weight-bold d-flex w-full justify-end p-color">
              {{ calPercentageWin() }} <span
                class="text--lighten-1 grey--text"
              >$</span>
            </span>
          </v-col>
        </div>
      </div>
      <div>
        <v-btn class="primary mr-2" depressed to="/dashboard/cuenta">
          ver mi cuenta
        </v-btn>
        <v-btn href="https://wa.me/573137082046" target="_blank" color="#23D160" class="white--text" depressed>
          soporte
          <v-icon small right color="white">
            mdi-whatsapp
          </v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    win: 0
  }),
  computed: {
    ...mapGetters('user', ['showUser']),
    ...mapGetters('orders', ['showOrders', 'showOnOrders'])
  },
  methods: {
    calPercentageWin () {
      let win = 0
      const complete = this.showOrders.filter(e => e.status === 'completada')

      complete.forEach((e) => {
        win += this.calcPercentage(e.amount.pesos)
      })
      return win.format(0, 3, '.')
    },
    calcPercentage (amount) {
      return ((amount * this.showUser.percentage) / 100)
    }
  }
}
</script>
