let unsubscribe = null

export const state = () => ({
  tasas: null,
  onTasas: false
})

export const getters = {
  showTasas (state) {
    return state.tasas
  },
  showOnTasas (state) {
    return state.onTasas
  }
}

export const actions = {
  async getTasas ({ dispatch }) {
    unsubscribe = await this.$fireStore
      .collection('tasa')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot((query) => {
        dispatch('updateOnTasas', true)
        query.forEach(doc => dispatch('updateTasas', doc.data()))
      })
  },
  updateTasas ({ commit }, tasas) {
    return commit('SET_TASAS', tasas)
  },
  updateOnTasas ({ commit }, boolean) {
    return commit('SET_ON_TASAS', boolean)
  },
  stopTasas () {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }
}

export const mutations = {
  SET_TASAS (state, tasas) {
    return (state.tasas = tasas)
  },
  SET_ON_TASAS (state, boolean) {
    return (state.onTasas = boolean)
  }
}
