require('dotenv').config()

const init = process.env.INIT

const app = require(`./${init}`)

const options = {
}
console.log('')
console.log('*** ENVIRONMENTS ***')
console.log('')

console.log(
    Object
        .keys(process.env)
        .filter(key => key.startsWith('AMQP'))
        .map(key => `${key}: ${process.env[key]}`)
        .join('\n')
);
console.log('')
console.log('*** ENVIRONMENTS ***')
console.log('')

app(options)
    .catch(err => console.error(err))