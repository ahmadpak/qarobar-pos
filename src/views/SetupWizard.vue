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
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mx-auto mb-12 mt-12" flat width="600px" height="300px">
            <v-card-text>
              <!-- Frappe Site -->
              <v-text-field
                prepend-inner-icon="mdi-web"
                name="baseURL"
                id="baseURL"
                placeholder="http://ERPNextSite"
                v-model="auth.baseURL"
                single-line
                filled
                solo
                class="rounded-lg"
                color="green darken-4"
                background-color="secondary"
                dark
              ></v-text-field>
              <!-- User -->
              <v-text-field
                prepend-inner-icon="mdi-account"
                name="api_key"
                id="api_key"
                placeholder="API KEY"
                v-model="auth.api_key"
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
                :append-icon="hideApiSecret ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="toggelApiSecret"
                name="api_secret"
                id="api_secret"
                placeholder="API SECRET"
                v-model="auth.api_secret"
                :type="hideApiSecret ? 'password' : 'text'"
                single-line
                filled
                solo
                class="rounded-lg"
                color="red"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="completeSiteInformation">
            Continue
          </v-btn>
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

          <v-btn color="primary" @click="completeDatabaseInformation">
            Complete
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { ipcRenderer } from 'electron'
import {
  LOGIN,
  LOGIN_RESPONSE,
  SELECTED_DIRECTORY,
  SELECTED_FILE,
  OPEN_DIRECTORY_SELECTOR,
  OPEN_FILE_SELECTOR
} from '../electron/ipcEvents'
import config from '../electronStoreConfig'
import router from '../router/index'
import { SET_CONNECTIVITY } from '../store/mutationTypes'
import { SET_ALERT, SET_ERROR } from '../store/actionTypes'

export default {
  data() {
    return {
      e1: 1,
      hideApiSecret: true,
      auth: {
        baseURL: null,
        api_key: '',
        api_secret: ''
      },
      dbDirectory: null,
      resotreDB: 0
    }
  },
  methods: {
    toggelApiSecret() {
      this.hideApiSecret = !this.hideApiSecret
    },
    selectDirectory() {
      ipcRenderer.send(OPEN_DIRECTORY_SELECTOR)
    },
    selectDataBase() {
      this.dbDirectory = ''
      ipcRenderer.send(OPEN_FILE_SELECTOR)
    },
    verifySite() {
      if (this.auth.baseURL && !this.auth.baseURL.includes('http')) {
        this.auth.baseURL = 'http://' + this.auth.baseURL
      }
      return this.auth.baseURL ? true : false
    },
    verifyUser() {
      return this.auth.api_key ? true : false
    },
    verifyPassword() {
      return this.auth.api_secret ? true : false
    },
    // Complete Site Information
    completeSiteInformation() {
      if (!this.verifySite()) {
        this.$store.dispatch(SET_ALERT, {
          message: 'Site Missing',
          type: 'error'
        })
      }

      if (!this.verifyUser()) {
        this.$store.dispatch(SET_ALERT, {
          message: 'User Missing',
          type: 'error'
        })
      }

      if (!this.verifyPassword()) {
        this.alertMessage = 'Passwords Missing!'
        this.alert = true
        this.$store.dispatch(SET_ALERT, {
          message: 'Password Missing',
          type: 'error'
        })
      }

      if (this.verifySite() && this.verifyUser() && this.verifyPassword()) {
        ipcRenderer.send(LOGIN, this.auth)
      }
    },
    // Complete Database Information
    completeDatabaseInformation() {
      if (!this.dbDirectory && !this.resotreDB) {
        this.$store.dispatch(SET_ERROR, 'Select database directory')
      } else if (!this.dbDirectory && this.resotreDB) {
        this.$store.dispatch(SET_ERROR, 'Select database')
      } else {
        this.configureDatabase()
      }
    },
    async configureDatabase() {
      const sqlite3 = require('sqlite3')
      let db = new sqlite3.Database(
        this.dbDirectory,
        sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
        (err) => {
          if (err) {
            this.$store.dispatch(SET_ERROR, 'Database setup failed.')
          }
        }
      )

      db.serialize(() => {
        db.run(
          'CREATE TABLE tabSiteSettings(key TEXT PRIMARY KEY, value TEXT NOT NULL)'
        )
          .run(
            `INSERT INTO tabSiteSettings(key, value) VALUES("baseURL","${this.auth.baseURL}")`
          )
          .run(
            `INSERT INTO tabSiteSettings(key, value) VALUES("api_key","${this.auth.api_key}")`
          )
          .run(
            `INSERT INTO tabSiteSettings(key, value) VALUES("api_secret","${this.auth.api_secret}")`
          )
          .close((err) => {
            if (err) {
              this.$store.dispatch(SET_ERROR, 'Database setup failed.')
            } else {
              this.$store.dispatch(SET_ALERT, 'Database setup successfull.')
              config.set('dbFilePath', this.dbDirectory)
              router.push({ name: 'home' })
            }
          })
      })
    }
  },
  mounted() {
    ipcRenderer.on(SELECTED_DIRECTORY, (event, r) => {
      this.dbDirectory = r + '/qpos.db'
    })
    ipcRenderer.on(SELECTED_FILE, (event, r) => {
      this.dbDirectory = r
    })
    ipcRenderer.on(LOGIN_RESPONSE, (event, r) => {
      if (r.message) {
        this.$store.commit(SET_CONNECTIVITY, true)
        this.$store.dispatch(
          SET_ALERT,
          `Connevtivity Successfull. Welcome ${r.message}`
        )
        this.e1 = 2
      } else {
        this.$store.commit(SET_CONNECTIVITY, false)
        this.$store.dispatch(SET_ALERT, {
          message: 'Connectivity Failed',
          type: 'error'
        })
      }
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
