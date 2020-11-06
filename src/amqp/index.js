 
  const amqp = require('amqplib')
  
  let connection

  const getClient = () => {
    return new Promise((resolve, reject) => {
      if (connection) return resolve(connection)
      return amqp.connect(getCredencialsAMQP())
        .then(async conn => {
          connection = conn
  
          conn.on('close', (err) => {
            connection = undefined
            console.error(`[Integration] -> ${err}`)
          })
  
          conn.on('error', (err) => {
            console.error(`[Integration] -> ${err}`)
          })
  
          return resolve(connection)
        })
        .catch(err => reject(err))
    })
  }
  
  const getChannel = async () => {
    const client = await getClient()
  
    return client.createConfirmChannel()
  }
  
  const getCredencialsAMQP = () => {
    return {
      hostname: process.env.AMQP_HOST,
      port: process.env.AMQP_PORT,
      username: process.env.AMQP_USER,
      password: process.env.AMQP_PASS,
      vhost: process.env.AMQP_VHOST
    }
  }
  
  module.exports = {
    getClient,
    getChannel
  }
  