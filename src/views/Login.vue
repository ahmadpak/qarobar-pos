<template>
  <v-container>
    <div style="position: fixed; bottom: 10px; right: 100px">
      Configuration
      <v-btn text icon color="primary" class="ma-2">
        <v-icon>mdi-cog</v-icon></v-btn
      >
    </div>
    <v-row class="d-flex mt-5">
      <!-- Branding -->
      <v-col cols="6" class="align-self-center">
        <v-img
          contain
          height="300"
          :src="require('../assets/Q_Logo1.png')"
        ></v-img>
      </v-col>
      <v-divider vertical></v-divider>
      <!-- Login Fields -->
      <v-col cols="6" class="align-self-center">
        <v-form @submit.prevent="login">
          <v-card flat max-width="450" class="mx-auto my-12">
            <v-card-title>Login</v-card-title>
            <v-card-text>
              <v-text-field
                prepend-inner-icon="mdi-account"
                name="username"
                id="username"
                placeholder="user@company.com"
                v-model="auth.usr"
                single-line
                filled
                solo
                class="rounded-lg"
                color="green darken-4"
                background-color="secondary"
                dark
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="togglePassword"
                name="password"
                id="password"
                placeholder="yourSecretPassword"
                v-model="auth.pwd"
                :type="showPassword ? 'password' : 'text'"
                single-line
                filled
                solo
                class="rounded-lg"
                color="red"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :block="loginBtnBlock"
                :loading="loading"
                depressed
                :class="loginBtnCLass"
                color="primary"
                large
                @click="login"
                type="submit"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
    <v-snackbar
      :timeout="2000"
      :value="loggedIn"
      app
      absolute
      center
      color="secondary"
      elevation="24"
    >
      Login Successful
    </v-snackbar>
  </v-container>
</template>

<script>
import { ipcRenderer } from 'electron'
import config from '../config'
export default {
  data() {
    return {
      loading: false,
      loggedIn: false,
      showPassword: true,
      auth: {
        usr: '',
        pwd: ''
      }
    }
  },
  mounted: function () {},
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    login() {
      this.loading = true
      config.set('lastPassword', this.auth.pwd)
      console.log(this.auth)
      ipcRenderer.send('login', this.auth)
      setTimeout(() => {
        this.loading = false
      }, 3000)
    }
  },
  computed: {
    loginBtnCLass() {
      return this.loading ? 'rounded-pill mx-auto' : 'rounded-lg mx-auto'
    },
    loginBtnBlock() {
      return this.loading ? false : true
    }
  }
}
</script>

<style lang="scss" scoped></style>
