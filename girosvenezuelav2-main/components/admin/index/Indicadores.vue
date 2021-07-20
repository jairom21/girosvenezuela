<template>
  <v-row>
    <v-col cols="12" lg="3">
      <v-card class="pa-6 b-shadow">
        <p class="overline">
          ordenes del dia
        </p>
        <v-btn
          color="indigo"
          class="c-vertical"
          dark
          small
          absolute
          bottom
          right
          fab
        >
          <v-icon small>
            mdi-account-multiple-check-outline
          </v-icon>
        </v-btn>
        <p class="mt-2 font-weight-medium">
          {{ ordersDay }}
        </p>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card class="pa-6 b-shadow">
        <p class="overline">
          ordenes pendientes
        </p>
        <v-btn
          color="pink"
          class="c-vertical"
          dark
          small
          absolute
          bottom
          right
          fab
        >
          <v-icon small>
            mdi-order-bool-ascending-variant
          </v-icon>
        </v-btn>
        <p class="mt-2 font-weight-medium">
          {{ ordersPending }}
        </p>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card class="pa-6 b-shadow">
        <p class="overline">
          Bolivares por pagar
        </p>
        <v-btn
          color="lime"
          class="c-vertical"
          dark
          small
          absolute
          bottom
          right
          fab
        >
          <v-icon small>
            mdi-cash-plus
          </v-icon>
        </v-btn>
        <p class="mt-2 font-weight-medium">
          {{ ordersBsPay }} Bs
        </p>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card class="pa-6 b-shadow">
        <p class="overline">
          tasa del dia
        </p>
        <v-btn
          color="teal"
          class="c-vertical"
          dark
          small
          absolute
          bottom
          right
          fab
        >
          <v-icon small>
            mdi-firework
          </v-icon>
        </v-btn>
        <p class="mt-2 font-weight-medium">
          {{ currentTasa.a }}
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                dark
                color="grey"
                class="pl-1"
                v-bind="attrs"
                v-on="on"
              >
                mdi-information
              </v-icon>
            </template>
            <div v-if="showTasas">
              <p>{{ currentTasa.a }} -> 10.000 - 100.000</p>
              <p>{{ currentTasa.b }} -> 101.000 - 150.000</p>
              <p>{{ currentTasa.c }} -> 151.000 - 200.000</p>
              <p>{{ currentTasa.d }} -> mas de 201.000</p>
            </div>
          </v-tooltip>
        </p>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('adminOrders', ['showOrders']),
    ...mapGetters('adminTasas', ['showTasas']),
    ordersDay () {
      if (this.showOrders) {
        const dayStart = Number(this.$moment.tz('America/Bogota').startOf('day').utc()._d)
        const dayEnd = Number(this.$moment.tz('America/Bogota').endOf('day').utc()._d)

        const filterAccounts = this.showOrders.filter(order => order.timestamp >= dayStart && order.timestamp <= dayEnd && order.status !== 'cancelado')
        return filterAccounts.length
      }
      return '-'
    },
    ordersPending () {
      if (this.showOrders) {
        return this.showOrders.filter(order => order.status === 'pendiente').length
      }
      return '-'
    },
    ordersBsPay () {
      const reducer = (acc, curr) => acc + Number(curr.amount.bs)

      if (this.showOrders) {
        return this.showOrders.filter(e => e.status === 'pendiente').reduce(reducer, 0).format(0, 3, '.')
      }
      return '-'
    },
    currentTasa () {
      if (this.showTasas) {
        return this.showTasas[0].tasas
      }
      return '-'
    }
  }
}
</script>
<style lang="scss" scoped>
.c-vertical {
  top: 50%;
  transform: translateY(-50%);
}
</style>
