const { getChannel } = require('../amqp')


module.exports = async ({ exchangePing = process.env.AMQP_EXCHANGE_PING, exchangePong = process.env.AMQP_EXCHANGE_PONG }) => {
    const ch = await getChannel()
    await ch.assertExchange(exchangePing, process.env.AMQP_DEFAULT_TYPE_EXCHANGE)
    setChannel(ch)
        .sendMessagesToExchange(exchangePing, exchangePong)
}


const setChannel = ch => ({ 
    sendMessagesToExchange: async (exchangePing, exchangePong) => {

        setInterval(() => {
            ping(ch, exchangePing)
        }, 1000)

        const queue = 'q-pong'

        await ch.assertQueue(queue)
        await ch.assertExchange(exchangePong, process.env.AMQP_DEFAULT_TYPE_EXCHANGE)
        await ch.bindQueue(queue, exchangePong)

        ch.prefetch(1000)
    
        const consumer = new Consumer()
        consumer.setChannel(ch)
        consumer.setExchangePing(exchangePing)
        ch.consume(queue, consumer.process.bind(consumer))
    }
})
let count = 0
const ping = async (ch, exchange) => {
    count++
    const message = `...P I N G... => ${count}`
    console.log()
    console.log(`Enviando : ${message}....`)
    await ch.publish(exchange, '', Buffer.from(message))
    await ch.waitForConfirms()
}


class Consumer {
    sleep (time) {
        return new Promise(resolve => setTimeout(resolve, time))
    }
    setChannel (ch) {
        this.ch = ch
    }

    setExchangePing (exchangePing) {
        this.exchangePing = exchangePing
    }

    async process (msg) {
        console.log(`Recebendo: ${msg.content.toString()}.... <<<<<<<<<<<`)
        await this.sleep(1000)
        await this.ch.ack(msg)

        // await ping(this.ch, this.exchangePing)
    }
}


