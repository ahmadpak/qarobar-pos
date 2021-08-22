import Store from 'electron-store'

// Passing default keys and Values
const schema = {
  frappeSiteURL: {
    // type: 'string',
    default: null
  },
  lastUser: {
    // type: 'string',
    default: null
  },
  lastPassword: {
    // type: 'string',
    default: null
  },
  rememberMe: {
    type: 'boolean',
    default: true
  },
  masterUser: {
    // type: 'string',
    default: null
  },
  masterPassword: {
    // type: 'string',
    default: null
  },
  dbFilePath: {
    // type: 'string',
    default: null
  }
}

let config = new Store({ schema })
export default config
