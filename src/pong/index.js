const { getChannel } = require('../amqp')


module.exports = async ({ exchangePing = process.env.AMQP_EXCHANGE_PING, exchangePong = process.env.AMQP_EXCHANGE_PONG }) => {
    const ch = await getChannel()
    await ch.assertExchange(exchangePong, process.env.AMQP_DEFAULT_TYPE_EXCHANGE)
    setChannel(ch)
        .sendMessagesToExchange(exchangePing, exchangePong)
}


const setChannel = ch => ({ 
    sendMessagesToExchange: async (exchangePing, exchangePong) => {
        const queue = 'q-ping'

        await ch.assertQueue(queue)
        await ch.assertExchange(exchangePing, process.env.AMQP_DEFAULT_TYPE_EXCHANGE)
        await ch.bindQueue(queue, exchangePing)

        ch.prefetch(1)
    
        const consumer = new Consumer()
        consumer.setChannel(ch)
        consumer.setExchangePong(exchangePong)
        ch.consume(queue, consumer.process.bind(consumer))
    }
})

const pong = async (ch, exchange, msg) => {
    const message = `...P O N G... (${msg.content.toString()})`
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

    setExchangePong (exchangePong) {
        this.exchangePong = exchangePong
    }

    async process (msg) {
        console.log(`Respondendo soliciação ....`)
        // await this.sleep(1000)
        await this.ch.ack(msg)

        await pong(this.ch, this.exchangePong, msg)
    }
}


