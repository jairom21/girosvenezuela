let unsubscribe = null

export const state = () => ({
  users: null,
  onUsers: false
})

export const getters = {
  showUsers (state) {
    return state.users
  },
  showOnUsers (state) {
    return state.onTasas
  }
}

export const actions = {
  async getUsers ({ dispatch }) {
    unsubscribe = await this.$fireStore
      .collection('users')
      .orderBy('name')
      .onSnapshot((query) => {
        const users = []
        dispatch('updateOnUsers', true)
        query.forEach(doc => users.push(doc.data()))

        if (users.length > 0) {
          dispatch('updateUsers', users)
          return
        }
        dispatch('updateUsers', [])
      })
  },
  updateUsers ({ commit }, users) {
    return commit('SET_USERS', users)
  },
  updateOnUsers ({ commit }, boolean) {
    return commit('SET_ON_USERS', boolean)
  },
  stopUsers () {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }
}

export const mutations = {
  SET_USERS (state, users) {
    return (state.users = users)
  },
  SET_ON_USERS (state, boolean) {
    return (state.onUsers = boolean)
  }
}
