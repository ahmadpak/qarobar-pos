import { ipcMain } from 'electron'
import axios from '../../plugins/axios'

ipcMain.on('login', (event, args) => {
  console.log('Args: ', JSON.stringify(args))
  axios
    .post('/method/login', JSON.stringify(args))
    .then(function (response) {
      const [cookie] = response.headers['set-cookie'] // get cookie from request
      axios.defaults.headers.Cookie = cookie // attach cookie to axiosInstance for future requests
      event.reply('auth-reply', response.data)
    })
    .catch((error) => {
      event.reply('auth-reply', {
        error: error.response.data.message,
        msg: 'msg'
      })
    })
})
