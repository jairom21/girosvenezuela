<template>
  <v-row>
    <v-col cols="12" lg="6" class="py-0 pr-lg-2 mb-4 mb-lg-0">
      <v-card
        class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
      >
        <div class="d-flex justify-space-between align-center">
          <span color="black" class="body-1 font-weight-bold p-color">DATOS DE MI CUENTA</span>
        </div>

        <div v-if="!showUser" :class="{'_h-dynamic': !showUser}">
          <v-progress-circular color="grey" class="my-2" indeterminate size="34" />
        </div>

        <div v-else>
          <div class="text-capitalize d-flex flex-column mt-10 pl-6">
            <strong class="p-color">{{ showUser.company }}</strong>
            <span class="text--lighten-1 grey--text"> {{ `${showUser.name} | ${$getId(showUser.tid)}${showUser.id}` }} </span>
            <span class="text--lighten-1 grey--text"> {{ `${showUser.address}, ${showUser.city}` }} </span>
          </div>

          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">
                  mdi-sack-percent
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> {{ showUser.percentage }}% </v-list-item-title>
                <v-list-item-subtitle>Porcetaje de Ganancias</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">
                  mdi-email
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> {{ showUser.email }} </v-list-item-title>
                <v-list-item-subtitle>Email</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">
                  mdi-phone
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> {{ showUser.phone }} </v-list-item-title>
                <v-list-item-subtitle>Celular</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">
                  mdi-phone
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> {{ showUser.companyPhone }} </v-list-item-title>
                <v-list-item-subtitle>Oficina</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="body-2 grey--text _footer">
            <p>Si desea actualizar alguno de sus datos por favor contactenos via Whatsapp haciendo click <strong class="primary--text"><a href="https://wa.me/573137082046" target="_blank">AQUI</a></strong></p>
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="6" class="pl-lg-2 py-0">
      <v-card
        class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
      >
        <div class="d-flex justify-space-between align-center">
          <span color="black" class="body-1 font-weight-bold p-color">SEGURIDAD</span>
        </div>
        <div class="mt-10">
          <v-row>
            <v-col cols="12" sm="6" class="">
              <v-text-field
                v-model="one"
                label="Nueva Contraseña"
                placeholder="Minimo 6 caracteres"
                type="password"
                hide-details
                outlined
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="two"
                label="Repetir Contraseña"
                placeholder="Escriba la misma contraseña"
                type="password"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <v-row class="mt-4 body-2 d-flex flex-column">
            <div class="pl-3 d-flex align-center">
              <v-icon v-if="v.length" small color="green">
                mdi-lock-check
              </v-icon>
              <v-icon v-else small color="red">
                mdi-alert-circle
              </v-icon>

              <span class="pl-1">Minimo 6 caracteres</span>
            </div>
            <div class="pl-3 d-flex align-center">
              <v-icon v-if="v.same" small color="green">
                mdi-lock-check
              </v-icon>
              <v-icon v-else small color="red">
                mdi-alert-circle
              </v-icon>

              <span class="pl-1">Contraseñas iguales</span>
            </div>
          </v-row>
          <v-row class="d-flex justify-end justigy pr-3 mt-3">
            <v-btn depressed color="primary" :disabled="!v.same || !v.length" @click="updatePassword">
              cambiar contraseña
            </v-btn>
          </v-row>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    one: '',
    two: '',
    v: {
      same: false,
      length: false
    }
  }),
  computed: {
    ...mapGetters('user', ['showUser'])
  },
  watch: {
    one (v) {
      if (v) {
        this.checkProps()
      }
    },
    two (v) {
      if (v) {
        this.checkProps()
      }
    }
  },
  methods: {
    ...mapActions('user', ['closeSesion']),
    checkProps () {
      if (this.one === this.two) { this.v.same = true } else { this.v.same = false }
      if (this.one.length >= 6) { this.v.length = true } else { this.v.length = false }
    },
    async updatePassword () {
      this.$nuxt.$emit('LOADING_OPEN')
      try {
        await this.$fireAuth.currentUser.updatePassword(this.one)
        this.one = this.two = this.v.same = this.v.length = null
        this.$nuxt.$emit('LOADING_CLOSE')
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Contraseña cambiada correctamente',
          color: 'success'
        })
      } catch (e) {
        this.$nuxt.$emit('LOADING_CLOSE')
        if (e.code === 'auth/requires-recent-login') {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Inicie sesion nuevamente para poder cambiar su contraseña',
            color: 'success'
          })
          await this.closeSesion()
        } else {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Order Creada Satisfactoriamente',
            color: 'Error, intente nuevamente'
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
._footer {
  padding-top: 10px;
  border-top: 1px dashed rgba($color: #000000, $alpha: 0.1);
}
._h-dynamic {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px;
}
</style>
