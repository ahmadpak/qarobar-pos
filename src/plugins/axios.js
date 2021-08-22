import axios from 'axios'
import config from '../electronStoreConfig'

const instance = axios.create({
  baseURL: config.get('frappeSiteURL'),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default instance
