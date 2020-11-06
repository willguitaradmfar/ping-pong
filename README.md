# Promise no consumo de mensagens

## About

* Validação de promise no consumo de mensagens amqplib

## Requirement

* Node.js v8 ou superior


## RabbitMQ UP

```
docker-compose -f docker/docker-compose.yml up -d 
```

## Install

```
$ npm install
```

## Usage

```
// Produzindo mensagens
npm run producer

// Consumindo mensagens
npm run consumer

```

## Results

Na validação deve se observar o consumo controlado das mensagens enviadas a exchange

## License

[MIT](LICENSE).