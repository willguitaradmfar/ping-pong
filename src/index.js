require('dotenv').config()

const init = process.env.INIT

const app = require(`./${init}`)

const options = {
}

app(options)
    .catch(err => console.error(err))