<template>
  <div class="d-flex justify-center">
    <v-card
      class="pa-5"
      max-width="400px"
      width="100%"
    >
      <v-form
        ref="formLogin"
        v-model="valid"
        lazy-validation
      >
        <v-img
          src="/3.png"
          max-width="150px"
          class="mx-auto mb-10"
        />

        <p class="font-weight-bold text-center mb-10 title">
          Ingrese a su cuenta
        </p>

        <v-text-field
          v-model="email"
          label="Email"
          placeholder="Escriba su email"
          type="email"
          :rules="rul.email"
          outlined
        />

        <v-text-field
          v-model="password"
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          type="password"
          :rules="rul.password"
          outlined
        />

        <v-btn
          block

          color="primary"
          class="mr-4"
          depressed
          @click="emailLogin"
        >
          entrar
        </v-btn>
        <p class="mt-10 body-2">
          - Olvido su contraseña? <nuxt-link class="text--primary" to="/recuperar">
            Recuperarla
          </nuxt-link>
        </p>
        <p class="mt-2 body-2">
          - No tiene una cuenta? <a class="text--primary" href="https://wa.me/573137082046" target="_blank">
            Solicite una aqui!
          </a>
        </p>
      </v-form>
    </v-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data: () => ({
    email: null,
    password: null,
    valid: false,
    rul: {
      password: [
        v => !!v || 'La contraseña es requerida',
        v => (v && v.length > 5) || 'La contraseña es muy corta'
      ],
      email: [
        v => !!v || 'El email es requerido',
        v => /.+@.+\..+/.test(v) || 'Escriba un email valido'
      ]
    }
  }),
  methods: {
    ...mapActions('user', ['setUser']),
    async emailLogin () {
      if (this.$refs.formLogin.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        try {
          await this.$fireAuth.signInWithEmailAndPassword(this.email, this.password)

          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Login correctamente, redirigiendo...',
            color: 'success'
          })

          const token = await this.$fireAuth.currentUser.getIdTokenResult()
          const uid = token.claims.user_id

          // admin -
          if (token.claims.admin) {
            this.$router.push({ path: '/admin' })
            this.$nuxt.$emit('LOADING_CLOSE')
            return
          }

          await this.setUser(uid)
          this.$router.push({ path: '/dashboard' })

          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          let error

          if (e.code === 'auth/user-not-found') {
            error = 'Email no encontrado'
          }

          if (e.code === 'auth/wrong-password') {
            error = 'Su contraseña es incorrecta'
          }

          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: error,
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    }
  }
}
</script>
