<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app disable-resize-watcher>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"
        ><v-img :src="require('../src/assets/Q_Logo.png')" contain height="60"
      /></v-app-bar-nav-icon>

      <v-toolbar-title>QPOS</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text icon color="primary" class="ma-2">
        <v-icon>mdi-logout</v-icon></v-btn
      >
      <v-btn icon text
        ><v-icon color="green">mdi-checkbox-marked-circle</v-icon></v-btn
      >
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      :timeout="2000"
      v-model="snackbar.show"
      app
      absolute
      center
      color="secondary"
      elevation="24"
    >
      {{ snackbar.message }}
    </v-snackbar>
    <div class="d-flex align-end flex-column">
      <v-alert
        v-for="(message, idx) in alert.messages"
        :key="idx"
        dense
        dismissible
        text
        max-width="300px"
        min-width="300px"
        transition="scroll-x-transition"
        :type="alert.type"
        :value="alert.showAlert"
        >{{ message }}</v-alert
      >
    </div>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    drawer: false
  }),
  mounted: function () {},
  computed: mapState({
    alert: 'alert',
    snackbar: 'snackbar'
  })
}
</script>
