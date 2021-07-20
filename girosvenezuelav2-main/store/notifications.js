let unsubscribe = null

export const state = () => ({
  notifications: null,
  onNotifications: false
})

export const getters = {
  showNotifications (state) {
    if (state.notifications) {
      return state.notifications
    }
    return null
  },
  showOnNotifications (state) {
    return state.onNotifications
  }
}

export const actions = {
  async getNotifications ({ dispatch }, uid) {
    unsubscribe = await this.$fireStore
      .collection('notifications')
      .where('uid', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .onSnapshot((query) => {
        const data = []

        dispatch('updateOnNotifications', true)
        query.forEach(e => data.push(e.data()))

        if (data.length > 0) {
          dispatch('updateNotifications', data)
          return
        }

        dispatch('updateNotifications', [])
      })
  },
  updateNotifications ({ commit }, notifications) {
    return commit('SET_NOTIFICATIONS', notifications)
  },
  updateOnNotifications ({ commit }, boolean) {
    return commit('SET_ON_NOTIFICATIONS', boolean)
  },
  stopNotifications () {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }
}

export const mutations = {
  SET_NOTIFICATIONS (state, notifications) {
    return (state.notifications = notifications)
  },
  SET_ON_NOTIFICATIONS (state, boolean) {
    return (state.onNotifications = boolean)
  }
}
