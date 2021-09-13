import Vue from 'vue'
import Vuex from 'vuex'
import { SET_CONNECTIVITY, SET_SNACKBAR } from './mutationTypes'
import { SET_ALERT, SET_ERROR } from './actionTypes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connectivity: false,
    dbFilePath: '',
    alert: [],
    snackbar: {
      message: 'snackBar',
      color: 'primary',
      timeout: 3000,
      show: false
    }
  },
  // sync calls
  mutations: {
    [SET_ALERT](state, payload) {
      /*
      In string form
      payload = 'Some message'

      As an object
      payload = {
        message : 'Some Message',
        type: 'error',
      }
       */
      if (typeof payload === 'string') {
        state.alert.push({
          message: payload,
          type: 'success',
          showAlert: true
        })
      } else {
        state.alert.push({
          message: payload.message ? payload.message : 'Invalid Format',
          type: payload.type ? payload.type : 'success',
          showAlert: true
        })
      }
    },
    [SET_SNACKBAR](state, payload) {
      /*
    As String
    payload = 'some message'
    As an object
    payload = {
      message: "some message",
      color: "#hexCode" or primary|secondary
      }
    */
      state.snackbar = {
        message: payload.message ? payload.message : payload,
        timeout: payload.timeout ? payload.timeout : 3000,
        color: payload.color ? payload.color : 'primary',
        show: true
      }
    },
    [SET_CONNECTIVITY](state, payload) {
      state.connectivity = payload ? true : false
    }
  },
  // async calls
  actions: {
    [SET_ALERT](context, payload) {
      /**
       * In string form
       * payload = 'hello world'
       *
       * In Object form
       * payload = {
       *  message: 'Some message',
       *  type: 'success'
       * }
       *
       * removes the element in the first position after the set timeout
       */
      context.commit(SET_ALERT, payload)

      setTimeout(
        () => {
          context.state.alert.shift()
        },
        payload.timeout ? payload.timeout : 3000
      )
    },
    [SET_ERROR](context, payload) {
      context.commit(SET_ALERT, {
        message: payload,
        type: 'error'
      })

      setTimeout(
        () => {
          context.state.alert.shift()
        },
        payload.timeout ? payload.timeout : 3000
      )
    }
  },
  getters: {
    getLoggedInStatus(state) {
      return state.loggedIn
    }
  },
  modules: {}
})
