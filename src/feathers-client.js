import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
const enviroment = require('./../config/enviroment')
const socket = io(enviroment[enviroment.currentEnviroment].backend.urlBase, {transports: ['websocket']})
const feathersClient = feathers()
  .configure(socketio(socket, {timeout: 500000}))
  .configure(auth({
    storage: window.localStorage
  }))
export default feathersClient
