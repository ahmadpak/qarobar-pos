import { ipcMain } from 'electron'
import axios from '../../plugins/axios'
import { LOGIN, LOGIN_RESPONSE } from '../ipcEvents'

ipcMain.on(LOGIN, (event, r) => {
  axios
    .post(
      '/api/method/frappe.auth.get_logged_user',
      {},
      {
        baseURL: r.baseURL,
        headers: {
          Authorization: `token ${r.api_key}:${r.api_secret}`
        }
      }
    )
    .then(function (r) {
      event.reply(LOGIN_RESPONSE, r.data)
    })
    .catch(() => {
      event.reply(LOGIN_RESPONSE, 'Incorrect API KEY/SECRET')
    })
})
