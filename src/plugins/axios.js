import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8013/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default instance
