const { getChannel } = require('../amqp')


module.exports = async ({ exchangeConsumer = process.env.AMQP_EXCHANGE_CONSUMER }) => {
    const ch = await getChannel()
    setChannel(ch)
        .setupConsumer(exchangeConsumer)
}


const setChannel = ch => ({ 
    setupConsumer: async (exchangeConsumer) => {
        const queue = 'q-ping'

        await ch.assertQueue(queue)
        await ch.assertExchange(exchangeConsumer, process.env.AMQP_DEFAULT_TYPE_EXCHANGE)
        await ch.bindQueue(queue, exchangeConsumer)

        ch.prefetch(10)
    
        const consumer = new Consumer()
        consumer.setChannel(ch)
        consumer.setExchange(exchangeConsumer)
        ch.consume(queue, consumer.process.bind(consumer))
    }
})

class Consumer {
    setChannel (ch) {
        this.ch = ch
    }

    setExchange (exchangePong) {
        this.exchangePong = exchangePong
    }

    async process (msg) {
        await this.ch.ack(msg)
        const message = `Message::::(${msg.content.toString()})`
        console.log(message);
    }
}


