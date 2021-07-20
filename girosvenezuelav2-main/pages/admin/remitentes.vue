<template>
  <v-card class="pa-6 b-shadow">
    <div
      class="d-flex flex-column flex-lg-row justify-space-between align-center mb-4"
    >
      <span color="black" class="body-1 font-weight-bold p-color"
        >REMITENTES</span
      >
      <v-btn small color="primary" depressed @click="openModalRemitente(null)">
        agregar remitente
      </v-btn>
    </div>
    <div v-if="$vuetify.breakpoint.lgOnly" class="d-flex justify-end">
      <form @submit.prevent="searchById">
        <div class="d-flex">
          <div style="width: 250px">
            <v-text-field
              v-model="searchId"
              type="number"
              label="Buscar por ID Detinatario"
            />
          </div>

          <button class="ml-2" type="submit">
            <v-icon  color="primary"> mdi-magnify </v-icon>
          </button>
        </div>
      </form>
      <button v-if="showSearchResults" class="ml-2" @click="hiddeSearchResults">
        <v-icon color="primary"> mdi-close-circle </v-icon>
      </button>
    </div>

    <div
      v-if="
        !showRemitentes ||
        showRemitentes.length === 0 ||
        searchResults.length === 0
      "
      class="border mt-6 h-full d-flex align-center justify-center py-10"
    >
      <v-progress-circular
        v-if="!showRemitentes"
        color="grey"
        class="my-2"
        indeterminate
        size="34"
      />
      <span v-else class="body-2 text--lighten-1 grey--text text-uppercase"
        >no hay remitentes actualmente</span
      >
    </div>
    <div v-if="showSearchResults" class="pb-2 mt h-full">
      <div
        v-for="(e, i) in searchResults"
        :key="i"
        class="e-panel py-3 c-hover"
      >
        <div class="body-2 px-3">
          <div class="d-flex justify-space-between align-center _resumen">
            <div>
              <div>
                <strong class="text-capitalize">{{
                  `${e.name} ${e.nameSecond ? e.nameSecond : ''} ${e.surname} ${
                    e.surnameSecond ? e.surnameSecond : ''
                  }`
                }}</strong>
              </div>

              <div>
                <span class="c-chip purple">{{
                  `${$getId(e.tid)}${e.id}`
                }}</span>
                <span class="text-capitalize grey--text"> {{ e.phone }} </span>
              </div>

              <div class="text-capitalize grey--text">
                <span> {{ e.city }} </span>
                |
                <span
                  >agregado el
                  {{ $moment(e.timestamp).format('DD.MM.YYYY hh:mm A') }}</span
                >
              </div>
            </div>
            <div>
              <v-btn
                title="ver remitent"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="openModalRemitente(e)"
              >
                <v-icon color="primary"> mdi-account </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- remitentes -->
    <div v-if="showRemitentes && !showSearchResults" class="pb-2 mt h-full">
      <div
        v-for="(e, i) in renderRemitentes"
        :key="i"
        class="e-panel py-3 c-hover"
      >
        <div class="body-2 px-3">
          <div class="d-flex justify-space-between align-center _resumen">
            <div>
              <div>
                <strong class="text-capitalize">{{
                  `${e.name} ${e.nameSecond ? e.nameSecond : ''} ${e.surname} ${
                    e.surnameSecond ? e.surnameSecond : ''
                  }`
                }}</strong>
              </div>

              <div>
                <span class="c-chip purple">{{
                  `${$getId(e.tid)}${e.id}`
                }}</span>
                <span class="text-capitalize grey--text"> {{ e.phone }} </span>
              </div>

              <div class="text-capitalize grey--text">
                <span> {{ e.city }} </span>
                |
                <span
                  >agregado el
                  {{ $moment(e.timestamp).format('DD.MM.YYYY hh:mm A') }}</span
                >
              </div>
            </div>
            <div>
              <v-btn
                title="ver remitent"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="openModalRemitente(e)"
              >
                <v-icon color="primary"> mdi-account </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-pagination
      v-if="perPage <= remitentesLength"
      v-model="page"
      :length="this.lengthPagination"
      :total-visible="7"
      color="secondary"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      @input="changePage"
    />
    <ModalRemitentes />
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ModalRemitentes from '~/components/admin/modalRemitente'
import { state } from '~/store/remitentes'
export default {
  components: { ModalRemitentes },
  data: () => ({
    page: 1,
    perPage: 10,
    searchId: '',
    numberOfDocuments: 0,
    searchResults: [],
    showSearchResults: false,
  }),
  computed: {
    ...mapGetters('remitentes', ['showRemitentes']),
    ...mapGetters('remitentes', ['showRemitentesLength']),
    ...mapGetters('remitentes', ['showRemitentesObject']),
    remitentes() {
      let objectString = JSON.stringify(this.showRemitentesObject)
      let objectParsed = JSON.parse(objectString)

      let keys = Object.keys(objectParsed)
      let newArray = keys.map((key) => {
        return objectParsed[key].array
      })
      if (!newArray) {
        return []
      }
      let flatArray = newArray.reduce((a, b) => [...a, ...b])
      return flatArray
    },
    filterByIdRemitentes() {
      return this.remitentes
    },
    renderRemitentes() {
      if (this.remitentes) {
        return this.paginate(this.filterByIdRemitentes)
      }
      return []
    },
    lengthPagination() {
      let length = this.remitentesLength

      if (length > 0) {
        return Math.ceil(
          (this.searchId.length > 0
            ? this.filterByIdRemitentes.length
            : length) / this.perPage
        )
      }
      return 0
    },
    remitentesLength() {
      if (this.showRemitentesLength) {
        return this.showRemitentesLength
      }
      return 0
    },
  },
  methods: {
    ...mapActions('remitentes', ['getRemitentes']),
    paginate(orders) {
      const page = this.page
      const perPage = this.perPage
      const from = page * perPage - perPage
      const to = page * perPage
      return orders.slice(from, to)
    },
    openModalRemitente(remitente) {
      this.$nuxt.$emit('MODAL_REMITENTE_OPEN', remitente)
    },
    changePage() {
      this.getRemitentes(this.page)
    },
    hiddeSearchResults() {
      this.showSearchResults = false
    },
    searchById() {
      this.$fireStore
        .collection('remitentes')
        .where('id', '==', this.searchId)
        .get()
        .then((res) => {
          console.log('res', res)
          console.log('docs', res.docs[0].data())
          let searchResults = []
          searchResults.push(res.docs[0].data())
          this.searchResults = searchResults
          this.showSearchResults = true
        })
    },
  },
  mounted() {
    /*this.$fireStore
      .collection('remitentes')
      .orderBy('timestamp')
      .get()
      .then((query) => {
        console.log('size: ', query)
        query.docs.map((doc, index) => {
          console.log('index: ', index)

          let docId = doc.id
          let docRef = this.$fireStore.collection('remitentes').doc(docId)
          docRef
            .update({
              index: index,
            })
            .then((res) => console.log('hecho'))
        })
      })*/
    /* let docId = doc.id
           let docRef = this.$fireStore.collection('remitentes').doc(docId)
           docRef
           .update({
           index: index,
           })
           .then((res) => console.log(res))
      })*/
  },
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
