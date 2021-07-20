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
      .limit(5)
      .onSnapshot((query) => {
        const tasas = []
        dispatch('updateOnTasas', true)
        query.forEach(doc => tasas.push(doc.data()))
        dispatch('updateTasas', tasas)
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
