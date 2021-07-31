<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"
        ><v-img :src="require('../src/assets/Q_Logo.png')" contain height="60"
      /></v-app-bar-nav-icon>

      <v-toolbar-title>QPOS</v-toolbar-title>
      <v-spacer></v-spacer>
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
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    drawer: false,
    snackbar: {
      message: "",
      color: "",
      show: false,
    },
  }),
  mounted: function () {
    ipcRenderer.on("auth-reply", (event, args) => {
      console.log(args);
    });
  },
};
</script>
