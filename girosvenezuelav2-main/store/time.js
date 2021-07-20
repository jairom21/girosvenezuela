export const state = () => ({
  time: null
})

export const getters = {
  showTime (state) {
    if (state.time) {
      return state.time
    } else {
      return null
    }
  }
}

export const mutations = {
  SET_TIME (state, time) {
    return (state.time = time)
  }
}
