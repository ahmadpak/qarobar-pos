import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    lastErrorMsg: "",
    lastMsg: "",
  },
  mutations: {},
  actions: {},
  modules: {},
});
