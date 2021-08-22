<template>
  <v-container>
    <v-stepper rounded="lg" outlined v-model="e1" class="mx-auto mb-12 mt-12">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Setting super user
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          Setting database path
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> Setting Frappe Site </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mx-auto mb-12 mt-12" flat width="600px" height="300px">
            <v-card-text>
              <!-- User -->
              <v-text-field
                prepend-inner-icon="mdi-account"
                name="username"
                id="username"
                placeholder="yourSuperUser"
                v-model="auth.usr"
                single-line
                filled
                solo
                class="rounded-lg"
                color="green darken-4"
                background-color="secondary"
                dark
              ></v-text-field>
              <!-- Password -->
              <v-text-field
                prepend-inner-icon="mdi-lock"
                :append-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="togglePassword"
                name="password"
                id="password"
                placeholder="yourSecretPassword"
                v-model="auth.pwd"
                :type="hidePassword ? 'password' : 'text'"
                single-line
                filled
                solo
                class="rounded-lg"
                color="red"
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-lock"
                :append-icon="hideConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="toggleConfirmPassword"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="confirmYourSecretPassword"
                v-model="auth.confirmPassword"
                :type="hideConfirmPassword ? 'password' : 'text'"
                single-line
                filled
                solo
                class="rounded-lg"
                color="red"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="completeStepOne"> Continue </v-btn>

          <v-btn text> Cancel </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mx-auto mb-12 mt-12" flat width="300px" height="300px">
            <v-card-text v-if="!resotreDB">
              <v-btn text fab @click="selectDirectory">
                <v-icon large color="primary"> mdi-folder </v-icon>
              </v-btn>
              {{ dbDirectory }}
            </v-card-text>
            <v-card-text v-if="resotreDB">
              <v-btn text fab @click="selectDataBase">
                <v-icon large color="primary"> mdi-paperclip </v-icon>
              </v-btn>
              {{ dbDirectory }}
            </v-card-text>
            <v-card-text>
              <v-checkbox v-model="resotreDB">
                <template v-slot:label>
                  <div>Restore existing database</div>
                </template>
              </v-checkbox>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="completeStepTwo"> Continue </v-btn>

          <v-btn text> Cancel </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mx-auto mb-12 mt-12" flat width="600px" height="300px">
            <v-card-text>
              <!-- Frappe Site -->
              <v-text-field
                prepend-inner-icon="mdi-web"
                name="frappeSiteURL"
                id="frappeSiteURL"
                placeholder="http://frappeSiteURL"
                v-model="auth.frappeSiteURL"
                single-line
                filled
                solo
                class="rounded-lg"
                color="green darken-4"
                background-color="secondary"
                dark
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="completeStepThree"> Finish </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { ipcRenderer } from 'electron'
import config from '../electronStoreConfig'
import router from '../router/index'

export default {
  data() {
    return {
      e1: 1,
      hidePassword: true,
      hideConfirmPassword: true,
      auth: {
        frappeSiteURL: null,
        usr: '',
        pwd: '',
        confirmPassword: ''
      },
      dbDirectory: null,
      resotreDB: 0
    }
  },
  methods: {
    togglePassword() {
      this.hidePassword = !this.hidePassword
    },
    toggleConfirmPassword() {
      this.hideConfirmPassword = !this.hideConfirmPassword
    },
    selectDirectory() {
      ipcRenderer.send('openDirectorySelector')
    },
    selectDataBase() {
      this.dbDirectory = ''
      ipcRenderer.send('openFileSelector')
    },
    verifyUser() {
      if (!this.auth.usr) {
        return false
      } else {
        return true
      }
    },
    verifyPassword() {
      if (this.auth.pwd !== this.auth.confirmPassword) {
        return false
      } else {
        return true
      }
    },
    // Super User
    completeStepOne() {
      if (!this.verifyUser()) {
        alert('User Missing!')
        return
      }

      if (!this.verifyPassword()) {
        alert('Passwords Donot Match')
        return
      }

      if (this.verifyUser() && this.verifyPassword()) {
        this.e1 = 2
      }
    },
    // Database Setup
    completeStepTwo() {
      if (!this.dbDirectory && !this.resotreDB) {
        alert('Select database directory!')
      } else if (!this.dbDirectory && this.resotreDB) {
        alert('Select database!')
      } else {
        this.e1 = 3
      }
    },
    // Site Setup
    async completeStepThree() {
      if (!this.auth.frappeSiteURL) {
        alert('Set Frappe Site!')
      } else {
        await this.setElectronConfig()

        const sqlite3 = require('sqlite3')
        new sqlite3.Database(
          this.dbDirectory,
          sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
          (err) => {
            if (err) {
              console.error(err.message)
            } else {
              console.log('Connected to the database.')
            }
          }
        ).close((err) => {
          if (err) {
            console.error(err.message)
          } else {
            console.log('Close the database connection.')
          }
          router.push({ name: 'login' })
        })
      }
    },
    async setElectronConfig() {
      config.set('masterUser', this.auth.usr)
      config.set('masterPassword', this.auth.pwd)
      config.set('dbFilePath', this.dbDirectory)
      config.set('frappeSiteURL', this.auth.frappeSiteURL)
    }
  },
  mounted() {
    ipcRenderer.on('selectedDirectory', (event, args) => {
      this.dbDirectory = args + '/qpos.db'
    })
    ipcRenderer.on('selectedFile', (event, args) => {
      this.dbDirectory = args
    })
  },
  watch: {
    resotreDB: function () {
      this.dbDirectory = ''
    }
  }
}
</script>

<style></style>
