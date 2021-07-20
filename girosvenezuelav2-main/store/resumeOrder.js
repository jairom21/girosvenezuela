export const state = () => ({
  order: null
})

export const getters = {
  showOrder (state) {
    if (state.order) {
      return state.order
    }
    return false
  }
}

export const actions = {
  async setResumeOrder ({ commit }, order) {
    await commit('SET_RESUME_ORDER', order)
  }
}

export const mutations = {
  SET_RESUME_ORDER (state, order) {
    return (state.order = order)
  }
}
