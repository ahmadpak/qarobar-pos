import Store from 'electron-store'

// Passing default keys and Values
const schema = {
  dbFilePath: {
    // type: 'string',
    default: null
  }
}

let config = new Store({ schema })
export default config
