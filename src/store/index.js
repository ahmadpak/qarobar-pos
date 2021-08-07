import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    lastErrorMsg: '',
    lastMsg: ''
  },
  // sync calls
  mutations: {
    setLoggedIn(state, payload) {
      state.loggedIn = payload
    },
    setLastErrorMsg(state, payload) {
      state.lastErrorMsg = payload
    },
    setLastMsg(state, payload) {
      state.lastMsg = payload
    }
  },
  // async calls
  actions: {
    setLoggedIn(context, payload) {
      context.loggedIn = payload
    },
    setLastErrorMsg(context, payload) {
      context.lastErrorMsg = payload
    },
    setLastMsg(context, payload) {
      context.lastMsg = payload
    }
  },
  getters: {
    getLoggedInStatus(state) {
      return state.loggedIn
    },
    getLastErrorMsg(state) {
      return state.lastErrorMsg
    },
    getLastMsg(state) {
      return state.lastMsg
    }
  },
  modules: {}
})
