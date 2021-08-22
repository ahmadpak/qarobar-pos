<template>
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
    <!-- DB File Path -->
    <v-card-text>
      <v-btn text fab @click="selectDataBase">
        <v-icon large color="primary"> mdi-paperclip </v-icon>
      </v-btn>
      {{ dbDirectory }}
    </v-card-text>
    <v-card-actions>
      <!-- Submit Button -->
      <v-btn
        :block="saveBtnBlock"
        :loading="loading"
        depressed
        :class="saveBtnCLass"
        color="primary"
        large
        @click="validateSettings"
        >Save</v-btn
      >
    </v-card-actions>
    <v-card-actions>
      <v-btn
        block
        depressed
        class="rounded-lg mx-auto"
        color="secondary"
        large
        @click="resetConfig"
        >Reset</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron'
import config from '../electronStoreConfig'
import router from '../router/index.js'

export default {
  data() {
    return {
      loading: false,
      hidePassword: true,
      auth: {
        frappeSiteURL: null,
        frappeUser: null,
        frappeUserPassword: null
      },
      dbDirectory: null
    }
  },
  methods: {
    togglePassword() {
      this.hidePassword = !this.hidePassword
    },
    selectDataBase() {
      this.dbDirectory = ''
      ipcRenderer.send('openFileSelector')
    },
    validateSettings() {
      this.loading = true
      config.set('frappeSiteURL', this.auth.frappeSiteURL)
      config.set('dbFilePath', this.dbDirectory)
      console.log(config.get('dbFilePath'))

      // Create/Load Database
      const sqlite3 = require('sqlite3')
      let db = new sqlite3.Database(
        this.dbDirectory,
        sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
        (err) => {
          if (err) {
            console.error(err.message)
          } else {
            console.log('Connected to the database.')
          }
        }
      )

      // Close the connection
      db.close((err) => {
        if (err) {
          console.error(err.message)
        } else {
          console.log('Close the database connection.')
        }
      })

      setTimeout(() => {
        this.loading = false
        router.push({ name: 'login' })
      }, 1000)
    },
    resetConfig() {
      config.clear()
      router.push({ name: 'setupWizard' })
    }
  },
  mounted() {
    this.dbDirectory = config.get('dbFilePath')
    this.auth.frappeSiteURL = config.get('frappeSiteURL')
    ipcRenderer.on('selectedFile', (event, args) => {
      this.dbDirectory = args
    })
  },
  computed: {
    saveBtnCLass() {
      return this.loading ? 'rounded-pill mx-auto' : 'rounded-lg mx-auto'
    },
    saveBtnBlock() {
      return this.loading ? false : true
    }
  }
}
</script>

<style></style>
