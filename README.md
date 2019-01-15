# nyan asd

Another fastify + redis boilerplate.
The scope of this project is to offer a real fastify + redis use case
*(Redis it is used as main database)*.

* * *

#### npm nstall

```sh
npm i fastify-redis-boilerplate
./node_modules/.bin/build
npm install
```

![myan asd](logo/nyan.gif)

#### Requirements

- nodejs lts
- docker
- fastify
- redis

#### Preliminary step

* fork the repo

#### Usage with Docker

##### Start

```sh
docker-compose -f docker-compose.debug.yml build
docker-compose -f docker-compose.debug.yml up
```

* Builds, (re)creates, starts, and attaches to containers for a service.

##### Stop

```sh
docker-compose -f docker-compose.debug.yml down
```

* Stops containers and removes containers, networks, volumes, and images created by up.

##### Tests

```sh
docker-compose -f docker-compose.tests.yml build
docker-compose -f docker-compose.tests.yml up --abort-on-container-exit --exit-code-from tests
```

##### Prod

```sh
docker build -t nyan-asd:latest .
```

##### Benchmark

```sh
docker-compose -f docker-compose.benchmarks.yml build
docker-compose -f docker-compose.benchmarks.yml up --abort-on-container-exit --exit-code-from benchmarks
```

* by default benchmarks point to '0.0.0.0:3001'

##### Note on benchmarking

The configuration (tests/benchmarks/config.json)

```json
{
  "tests" : [
    {
      "server" : "http://0.0.0.0:3001",
      "threads": 100,
      "duration": "10s",
      "connections": 100,
      "paths": [
        "/v1/reviews?accomodation=96e83a90-48da-4e81-9d06-7f1b76e5364e",
        ...
      ],
      "requirements": {
        "latencyAvg": 130,
        ...
        "latency99": 150
      }
    }
  ]
}
```

requirements:

* latencyAvg
* latencyStdev
* latencyMax
* latency50
* latency75
* latency90
* latency99
* requestsPerSec
* non2xx3xx

##### Delete all containers

```sh
docker rm $(docker ps -a -q)
```

##### Delete all images

```sh
docker rmi $(docker images -q)
```

##### Delete all the volumes

```sh
docker volumes prune
```

#### Local Usage

##### Install

```sh
npm install
```

##### Debug

Run in debug mode with watch and debug capabilities

```sh
npm run debug
```

##### Start

Run in server mode without any extra tool or capability

```sh
npm start
```

##### Benchmark

```sh
npm run benchmark
```

##### Test

Run all the tests suite and the linter

```sh
npm test
```

alternatively you may want yo tag your test

```javascript
it('Return status 404 @asd-307', (done) => {
  ...
```

and then use the `--grep` option

```sh
npm test -- --grep="asd-307"
```

also

```sh
npm test -- --grep="asd-307|unit"
```

### Endpoints

#### Reviews

```
curl http://0.0.0.0:3001/v1/reviews\?accomodation=96e83a90-48da-4e81-9d06-7f1b76e5364e&limit=1
```

Result

```json
{
   "collection":[
      {
         "key":"e54b1d94-5590-4410-9d4e-76b3ea1f2ce5",
         "accomodation":"96e83a90-48da-4e81-9d06-7f1b76e5364e",
         "along":"COUPLE",
         "travel":1470009600000,
         "submission":1472550180580,
         "general":10,
         "user":"Claus Duus Pedersen",
         "locale":"en",
         "texts":{
            "en":"Friendly staff - nice restaurants and Sporting Bar"
         },
         "titles":{
            "en":"Great camping site"
         },
         "aspects":{
            "location":10,
            "service":0,
            "priceQuality":9,
            "food":0,
            "room":0,
            "childFriendly":9,
            "interior":0,
            "size":0,
            "activities":0,
            "restaurants":0,
            "sanitaryState":0,
            "accessibility":0,
            "nightlife":0,
            "culture":0,
            "surrounding":0,
            "atmosphere":0,
            "noviceSkiArea":0,
            "advancedSkiArea":0,
            "apresSki":0,
            "beach":0,
            "entertainment":0,
            "environmental":0,
            "pool":10,
            "terrace":0
         },
         "scores":{
            "weight":0.7,
            "general":7,
            "aspects":{
               "location":7,
               "service":0,
               "priceQuality":6.3,
               "food":0,
               "room":0,
               "childFriendly":6.3,
               "interior":0,
               "size":0,
               "activities":0,
               "restaurants":0,
               "sanitaryState":0,
               "accessibility":0,
               "nightlife":0,
               "culture":0,
               "surrounding":0,
               "atmosphere":0,
               "noviceSkiArea":0,
               "advancedSkiArea":0,
               "apresSki":0,
               "beach":0,
               "entertainment":0,
               "environmental":0,
               "pool":7,
               "terrace":0
            }
         }
      }
   ],
   "scores":{
      "general":10,
      "aspects":{
         "location":{
            "general":10,
            "COUPLE":10
         },
         "service":{
            "general":0,
            "COUPLE":0
         },
         "priceQuality":{
            "general":9,
            "COUPLE":9
         },
         "food":{
            "general":0,
            "COUPLE":0
         },
         "room":{
            "general":0,
            "COUPLE":0
         },
         "childFriendly":{
            "general":9,
            "COUPLE":9
         },
         "interior":{
            "general":0,
            "COUPLE":0
         },
         "size":{
            "general":0,
            "COUPLE":0
         },
         "activities":{
            "general":0,
            "COUPLE":0
         },
         "restaurants":{
            "general":0,
            "COUPLE":0
         },
         "sanitaryState":{
            "general":0,
            "COUPLE":0
         },
         "accessibility":{
            "general":0,
            "COUPLE":0
         },
         "nightlife":{
            "general":0,
            "COUPLE":0
         },
         "culture":{
            "general":0,
            "COUPLE":0
         },
         "surrounding":{
            "general":0,
            "COUPLE":0
         },
         "atmosphere":{
            "general":0,
            "COUPLE":0
         },
         "noviceSkiArea":{
            "general":0,
            "COUPLE":0
         },
         "advancedSkiArea":{
            "general":0,
            "COUPLE":0
         },
         "apresSki":{
            "general":0,
            "COUPLE":0
         },
         "beach":{
            "general":0,
            "COUPLE":0
         },
         "entertainment":{
            "general":0,
            "COUPLE":0
         },
         "environmental":{
            "general":0,
            "COUPLE":0
         },
         "pool":{
            "general":10,
            "COUPLE":10
         },
         "terrace":{
            "general":0,
            "COUPLE":0
         }
      },
      "COUPLE":10
   }
}
```


### Documentation

Check `swagger.yml`
