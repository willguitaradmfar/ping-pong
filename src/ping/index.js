const { getChannel } = require('../amqp')


module.exports = async ({ exchangePing = `ex-ping`, exchangePong = `ex-pong` }) => {
    const ch = await getChannel()
    await ch.assertExchange(exchangePing, 'topic')
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
        await ch.assertExchange(exchangePong, 'topic')
        await ch.bindQueue(queue, exchangePong)

        ch.prefetch(1)
    
        const consumer = new Consumer()
        consumer.setChannel(ch)
        consumer.setExchangePing(exchangePing)
        ch.consume(queue, consumer.process.bind(consumer))
    }
})

const ping = async (ch, exchange) => {
    const message = `...P I N G...`
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
        console.log(`Recebendo: ${msg.content.toString()}....`)
        await this.sleep(1000)
        await this.ch.ack(msg)

        // await ping(this.ch, this.exchangePing)
    }
}


