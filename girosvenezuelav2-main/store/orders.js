let unsubscribe = null

export const state = () => ({
  orders: null,
  onOrders: false
})

export const getters = {
  showOrders (state) {
    return state.orders
  },
  showOnOrders (state) {
    return state.onOrders
  }
}

export const actions = {
  async getOrders ({ dispatch }, uid) {
    unsubscribe = await this.$fireStore
      .collection('orders')
      .where('uid', '==', uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot((query) => {
        const data = []

        dispatch('updateOnOrders', true)

        query.forEach(e => data.push(e.data()))

        if (data.length > 0) {
          dispatch('updateOrders', data)
          return
        }

        dispatch('updateOrders', [])
      })
  },
  updateOrders ({ commit }, orders) {
    return commit('SET_ORDERS', orders)
  },
  updateOnOrders ({ commit }, boolean) {
    return commit('SET_ON_ORDERS', boolean)
  },
  stopOrders () {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }
}

export const mutations = {
  SET_ORDERS (state, orders) {
    return (state.orders = orders)
  },
  SET_ON_ORDERS (state, boolean) {
    return (state.onOrders = boolean)
  }
}
