FROM node:14.11.0-alpine

RUN apk add --update \
    python make g++

ARG ORKI_ANONYMOUS

ENV ORKI_ANONYMOUS=$ORKI_ANONYMOUS

WORKDIR /app

ADD ./ /app

RUN rm -Rf .git

RUN rm -Rf node_modules

RUN npx yarn install --frozen-lockfile

FROM node:14.11.0-alpine
RUN mkdir -p /app
COPY --from=0 /app /app
WORKDIR /app

ARG ORKI_ANONYMOUS

ENV ORKI_ANONYMOUS=$ORKI_ANONYMOUS

ENV ENV=production
ENV NODE_ENV=production

ENTRYPOINT [ "node", "src/index.js" ]
