<template>
  <v-card class="_card pa-6 pb-4 b-shadow">
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">CANTIDAD A ENVIAR</span>
    </div>
    <v-alert
      class="primary-text mb-10 b-shadow"
      color="white"
    >
      <p class="text-center font-weight-light select-none">
        🎉 La tasa aplicar es: <strong ref="tasa"> {{ showTasas.tasas.a }}  </strong>
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
          <span v-if="!showOnTasas">cargando</span>
          <div v-else>
            <p>{{ showTasas.tasas.a }} -> 10.000 - 100.000</p>
            <p>{{ showTasas.tasas.b }} -> 101.000 - 150.000</p>
            <p>{{ showTasas.tasas.c }} -> 151.000 - 200.000</p>
            <p>{{ showTasas.tasas.d }} -> mas de 201.000</p>
          </div>
        </v-tooltip>
      </p>
    </v-alert>
    <div class="d-flex flex-wrap mb-5">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="pesos"
          class="centered-input"
          label="Pesos"
          hide-details
          :disabled="disabled"
          @keypress="limitChartInput($event)"
          @keyup="calcChange(true)"
        />
        <p class="mt-1">
          <small class="primary--text">Cantidad que envian</small>
        </p>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="bs"
          class="centered-input"
          label="Bolivares"
          hide-details
          :disabled="disabled"
          @keypress="limitChartInput($event)"
          @keyup="calcChange(false)"
        />
        <p class="mt-1">
          <small class="primary--text">Cantidad que reciben</small>
        </p>
      </v-col>
    </div>
    <div class="mb-5 text-center">
      <span
        class="caption text-uppercase pink--text"
        :class="{'opacity-0': minimo}"
      >
        cantidad minima de 10.000 Pesos
      </span>
    </div>
    <div
      class="_chip grey white--text d-flex justify-space-between pa-2 rounded"
      :class="{'orange': percentage }"
      label
    >
      <span class="pr-4">Ganancias</span>
      <div>
        {{ percentage }} $
        <v-icon class="_chip-icon ml-3" color="white">
          mdi-label
        </v-icon>
      </div>
    </div>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    pesos: null,
    bs: null,
    percentage: null,
    disabled: true,
    minimo: true
  }),
  computed: {
    ...mapGetters('user', ['showUser']),
    ...mapGetters('tasas', ['showTasas', 'showOnTasas'])
  },
  mounted () {
    this.$nuxt.$on('DESTINATARIO_SET_TO_CALC', (d) => {
      if (d) {
        this.disabled = false
        return
      }
      // if (this.$refs.tasa) {
      // this.$refs.tasa.textContent = this.showTasas.tasas.a
      // }
      this.percentage = 0
      this.pesos = ''
      this.bs = ''
      this.disabled = true
    })
    this.$nuxt.$on('ORDER_APROVE', (d) => {
      if (d) {
        this.disabled = true
        return
      }
      this.disabled = false
    })
  },
  methods: {
    calcChange (z) {
      const t = this.showTasas.tasas
      let tasa = t.a

      if (z) {
        this.calcPErcentage()

        if (this.pesos.split('.').join('') >= 10000) {
          this.minimo = true
          this.$nuxt.$emit('AMOUNT_APPROVE_ORDER', 1)
        } else {
          this.percentage = null
          this.minimo = false
          this.$nuxt.$emit('AMOUNT_APPROVE_ORDER', null)
        }
        if (!this.pesos || this.pesos === '' || this.pesos === '0') {
          this.bs = ''
          this.$nuxt.$emit('AMOUNT_SET_DETAILS_ORDER', null)
          return
        }

        const pesos = this.pesos.split('.').join('')
        if (pesos <= 100000) {
          tasa = t.a
          this.$refs.tasa.textContent = t.a
        }
        if (pesos >= 101000) {
          tasa = t.b
          this.$refs.tasa.textContent = t.b
        }
        if (pesos >= 151000) {
          tasa = t.c
          this.$refs.tasa.textContent = t.c
        }
        if (pesos >= 201000) {
          tasa = t.d
          this.$refs.tasa.textContent = t.d
        }

        const send = {
          tasa,
          pesos: this.pesos,
          bs: this.$calcAmount(pesos, tasa, true)
        }
        this.$nuxt.$emit('AMOUNT_SET_DETAILS_ORDER', send)

        this.bs = this.$calcAmount(pesos, tasa, true).format(0, 3, '.')
        return
      }

      if (!this.bs || this.bs === '' || this.bs === '0') {
        this.pesos = ''
        this.$nuxt.$emit('AMOUNT_SET_DETAILS_ORDER', null)
        return
      }

      const bs = this.bs.split('.').join('')
      let a = Number(this.$calcAmount(bs, tasa, false))

      if (a <= 100000) {
        tasa = t.a
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.a
      }
      if (a >= 101000) {
        tasa = t.b
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.b
      }
      if (a >= 151000) {
        tasa = t.c
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.c
      }
      if (a >= 201000) {
        tasa = t.d
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.d
      }

      const send = {
        tasa,
        pesos: a,
        bs: this.bs
      }
      this.$nuxt.$emit('AMOUNT_SET_DETAILS_ORDER', send)

      this.pesos = a.format(0, 3, '.')
      this.calcPErcentage()
      if (this.pesos.split('.').join('') >= 10000) {
        this.minimo = true
        this.$nuxt.$emit('AMOUNT_APPROVE_ORDER', 1)
      } else {
        this.percentage = null
        this.minimo = false
        this.$nuxt.$emit('AMOUNT_APPROVE_ORDER', null)
      }
    },
    calcPErcentage () {
      return (this.percentage = ((this.pesos.split('.').join('') * this.showUser.percentage) / 100).format(0, 3, '.'))
    },
    limitChartInput (evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.orange {
  background: #fd9e30 !important;
}
.opacity-0 {
  opacity: 0 !important;
}
</style>
