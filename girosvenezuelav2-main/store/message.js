let unsubscribe = null

export const state = () => ({
  message: null,
  onMessage: false
})
export const getters = {
  showMessage (state) {
    if (state.message) {
      return state.message[0]
    }
    return null
  },
  showOnMessage (state) {
    return state.onMessage
  }
}

export const actions = {
  async getMessage ({ dispatch }) {
    unsubscribe = await this.$fireStore
      .collection('message')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot((query) => {
        const data = []

        dispatch('updateOnMessage', true)
        query.forEach(e => data.push(e.data()))

        if (data.length > 0) {
          dispatch('updateMessage', data)
          return
        }

        dispatch('updateMessage', [])
      })
  },
  updateMessage ({ commit }, message) {
    return commit('SET_MESSAGE', message)
  },
  updateOnMessage ({ commit }, boolean) {
    return commit('SET_ON_MESSAGE', boolean)
  },
  stopMessage () {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }
}

export const mutations = {
  SET_MESSAGE (state, message) {
    return (state.message = message)
  },
  SET_ON_MESSAGE (state, boolean) {
    return (state.onMessage = boolean)
  }
}
