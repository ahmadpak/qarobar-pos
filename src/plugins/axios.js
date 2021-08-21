import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8012/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default instance
