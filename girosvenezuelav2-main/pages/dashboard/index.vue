<template>
  <div>
    <!-- ALERT -->
    <v-alert v-if="showOnMessage" type="info" color="primary" class="body-1">
      {{ showMessage.message }}  <small>{{ $moment(showMessage.timestamp).format('DD.MM.YYYY hh:mm a') }} </small>
    </v-alert>

    <!-- one section -->
    <v-row class="mb-4 d-flex flex-wrap" no-gutters>
      <!-- left section resume -->
      <box-resume-user />

      <!-- right section report -->
      <v-col cols="12" lg="5" class="pl-lg-2 mt-4 mt-lg-0 py-0">
        <v-card
          class="pa-6 pb-4 b-shadow card-report"
          outlined
          color=""
        >
          <h3 class="white--text">
            Reportar nueva orden
          </h3>
          <p class="mt-5 body-2 text--lighten-3 grey--text" style="width: 75%">
            Reporte una nueva orden, esta sera pagada a la brevedad y notificado al liquidarse la misma
          </p>
          <!-- <v-img
            src="/icons/shop.png"
            class="icon-shop"
          /> -->
          <v-btn to="/dashboard/reportar" class="blue-grey lighten-5" depressed>
            reportar nueva orden
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- two section -->
    <v-row class="mb-4 d-flex flex-wrap" no-gutters>
      <!-- left - tasa -->
      <box-calculator />

      <!-- right - resume orders -->
      <box-resume-orders />
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import BoxResumeUser from '~/components/dashboard/index/ResumeUser'
import BoxCalculator from '~/components/dashboard/index/Calculator'
import BoxResumeOrders from '~/components/dashboard/index/ResumeOrders'
export default {
  components: {
    BoxResumeUser, BoxCalculator, BoxResumeOrders
  },
  computed: {
    ...mapGetters('message', ['showMessage', 'showOnMessage'])
  }
}
</script>
<style lang="scss" scoped>
.card-report {
  background-image: url(/bg-report.jpg);
  background-position: bottom right;
  background-size: cover;
}
.icon-shop {
position: absolute;
  right: 10px;
  bottom: 40px;
  transform: rotate(15deg);
}
</style>
