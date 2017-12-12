# Mathbook [![Build Status](https://travis-ci.org/JetJet13/mathbook.svg?branch=develop)](https://travis-ci.org/JetJet13/mathbook)

Mathbook is a website that provides peer-reviewed tutorials on topics covering most subjects in mathematics.

Mathbook is written in JavaScript and built using NodeJS, ExpressJS, Riot and Pug (formerly known as Jade)

## Requirements

* Node 8.x
* Redis 4.x

## Installation & Setup

```bash
git clone https://github.com/JetJet13/mathbook.git

cd ./mathbook

npm i
```

To install and start up a Redis Server

```bash
# linux users
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make

# mac osx users
brew install redis


# to startup redis server
redis-server
```

## Run Locally

**Note**: You might need to install gulp and bunyan globally first

```bash
npm i -g gulp-cli bunyan
```

```bash
gulp serve

# if you want pretty log formatting (linux/macOS users only)
gulp serve | bunyan
```

## Testing

```bash
# run all tests
gulp test
```

**Note**: if the above test commands fail, you might need to install gulp and bunyan globally

## Contributing

If you are interested in contributing please refer to [CONTRIBUTING.md](./CONTRIBUTING.md)

## Contributors

If you are looking for the list of Contributors of Mathbook, please refer to [CONTRIBUTORS.md](./CONTRIBUTORS.md)

## License

Mathbook is Open Source and Licensed under MPL-2.0 Please refer to [LICENSE](./LICENSE) for more info.
