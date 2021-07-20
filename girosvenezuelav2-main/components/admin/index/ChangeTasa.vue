<template>
  <div>
    <v-fade-transition>
      <v-overlay
        v-if="overlay"
        absolute
        color="grey"
      >
        <v-btn color="primary" @click="overlay = false">
          cambiar tasas
        </v-btn>
      </v-overlay>
    </v-fade-transition>
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">TASA DE CAMBIO</span>
    </div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="t.a"
        label="10.000 - 100.000"
        type="number"
        dense
        outlined
        :rules="rul.t"
      />
      <v-text-field
        v-model="t.b"
        label="101.000 - 150.000"
        type="number"
        dense
        outlined
        :rules="rul.t"
      />
      <v-text-field
        v-model="t.c"
        label="151.000 - 200.000"
        type="number"
        dense
        outlined
        :rules="rul.t"
      />
      <v-text-field
        v-model="t.d"
        label="mas de 201.000"
        type="number"
        dense
        outlined
        :rules="rul.t"
      />
      <v-btn block depressed color="primary" class="white--text" @click="setNewTasas">
        cambiar tasas
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    overlay: true,
    t: {
      a: null,
      b: null,
      c: null,
      d: null
    },
    rul: {
      t: [
        v => !!v || 'La tasa es requerida'
      ]
    }
  }),
  methods: {
    async setNewTasas () {
      if (this.$refs.form.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        const send = {
          tasas: this.t,
          timestamp: Number(new Date())
        }

        try {
          await this.$fireStore.collection('tasa').add(send)
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Tasas cambiadas correctamente',
            color: 'success'
          })
          this.overlay = true
          this.$refs.form.reset()
          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al setear tasas nuevas',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    }
  }
}
</script>
