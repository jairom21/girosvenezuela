export const state = () => ({
  user: null,
  uid: null,
  admin: null
})

export const getters = {
  showUser (state) {
    return state.user
  },
  isLogin (state) {
    if (state.uid) {
      return true
    }
    return false
  },
  isAdmin (state) {
    return state.admin
  }
}

export const actions = {
  async setUser ({ dispatch }, uid) {
    try {
      const user = await this.$fireStore
        .collection('users')
        .where('uid', '==', uid)
        .get()

      dispatch('updateUser', user.docs[0].data())
      dispatch('setUid', user.docs[0].data().uid)
      dispatch('tasas/getTasas', null, { root: true })
      dispatch('orders/getOrders', uid, { root: true })
      dispatch('remitentes/getRemitentes', null, { root: true })
    } catch (e) {}
  },
  setUid ({ commit }, uid) {
    return commit('SET_UID', uid)
  },
  updateUser ({ commit }, user) {
    return commit('SET_USER', user)
  },
  setAdmin ({ commit }, boolean) {
    return commit('SET_ADMIN', boolean)
  },
  async closeSesion ({ dispatch }) {
    await this.app.router.push('/login')
    await this.$fireAuth.signOut()

    // user
    dispatch('updateUser', null)
    dispatch('setUid', null)

    // tasas
    dispatch('tasas/updateTasas', null, { root: true })
    dispatch('tasas/updateOnTasas', false, { root: true })
    dispatch('tasas/stopTasas', null, { root: true })

    // orders
    dispatch('orders/updateOrders', null, { root: true })
    dispatch('orders/updateOnOrders', false, { root: true })
    dispatch('orders/stopOrders', null, { root: true })

    // remitentes
    dispatch('remitentes/updateRemitentes', null, { root: true })
    dispatch('remitentes/updateOnRemitentes', false, { root: true })
    dispatch('remitentes/stopRemitentes', null, { root: true })

    // message
    dispatch('message/updateMessage', null, { root: true })
    dispatch('message/updateOnMessage', false, { root: true })
    dispatch('message/stopMessage', null, { root: true })

    // notifications
    dispatch('notifications/updateNotifications', null, { root: true })
    dispatch('notifications/updateOnNotifications', false, { root: true })
    dispatch('notifications/stopNotifications', null, { root: true })
  },
  async closeSesionAdmin ({ dispatch, commit }) {
    await this.app.router.push('/login')
    await this.$fireAuth.signOut()

    // admin
    dispatch('setAdmin', null)

    // tasas
    dispatch('adminTasas/updateTasas', null, { root: true })
    dispatch('adminTasas/updateOnTasas', false, { root: true })
    dispatch('adminTasas/stopTasas', null, { root: true })

    // users
    dispatch('adminUsers/updateUsers', null, { root: true })
    dispatch('adminUsers/updateOnUsers', false, { root: true })
    dispatch('adminUsers/stopUsers', null, { root: true })

    // orders
    dispatch('adminOrders/updateOrders', null, { root: true })
    dispatch('adminOrders/updateOnOrders', false, { root: true })
    dispatch('adminOrders/stopOrders', null, { root: true })

    // remitentes
    dispatch('remitentes/updateRemitentes', null, { root: true })
    dispatch('remitentes/updateOnRemitentes', false, { root: true })
    dispatch('remitentes/stopRemitentes', null, { root: true })

    // message
    dispatch('message/updateMessage', null, { root: true })
    dispatch('message/updateOnMessage', false, { root: true })
    dispatch('message/stopMessage', null, { root: true })
  }
}

export const mutations = {
  SET_USER (state, user) {
    return (state.user = user)
  },
  SET_UID (state, uid) {
    return (state.uid = uid)
  },
  SET_ADMIN (state, boolean) {
    return (state.admin = boolean)
  }
}
