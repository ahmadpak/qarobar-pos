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
        ><v-icon :color="connectivity ? 'green' : 'red'"
          >mdi-checkbox-marked-circle</v-icon
        ></v-btn
      >
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      :timeout="snackbar.timeout"
      v-model="snackbar.show"
      app
      absolute
      center
      :color="snackbar.color"
      elevation="24"
    >
      {{ snackbar.message }}
    </v-snackbar>
    <div class="alert">
      <v-alert
        v-for="(row, idx) in alert"
        max-width="300px"
        min-width="300px"
        :key="idx"
        :type="row.type"
        :value="row.showAlert"
        >{{ row.message }}</v-alert
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
  computed: {
    ...mapState({
      alert: 'alert',
      snackbar: 'snackbar',
      connectivity: 'connectivity'
    })
  }
}
</script>
<style scoped>
.alert {
  /* d-flex align-end flex-column */
  position: absolute;
  right: 5px;
  bottom: 0;
  max-height: 90vh;
  overflow-y: scroll;
}
</style>
