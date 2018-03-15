[![Build Status](https://travis-ci.org/JetJet13/mathbook.svg?branch=develop)](https://travis-ci.org/JetJet13/mathbook)
[![Greenkeeper badge](https://badges.greenkeeper.io/JetJet13/mathbook.svg)](https://greenkeeper.io/)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/mathbook-chat/Lobby)

![mathbook-logo](./src/front-end/public/images/mathbook_indigo_white_v5.png)

Mathbook is an online repository of peer-reviewed tutorials on topics covering a wide range of subjects in Mathematics.
It's open source and open to anyone who is interested in creating or reviewing a tutorial. The project itself is written
in JavaScript and built using NodeJS, ExpressJS, Riot and Pug (formerly known as Jade)

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
make test
make install

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
cd ./mathbook

# bundle the js and css files
gulp bundle:js
gulp bundle:css

# start up the server
gulp serve

# if you want pretty log formatting
gulp serve | bunyan
```

If you want to get the GitHub OAuth Login functionality working, you will need to do the following,

1. Visit github.com and Sign In
2. Navigate to your profile settings page
3. In the side bar, find and click on `Developer Settings`
4. Then click on `New OAuth App`
5. You will then be navigated to a page that looks similar to this,

![screenshot](./setting-up-mathbook-app.png)

6. Confirm that the `Homepage URL` and `Authorization callback URL` you entered match what you see in the screenshot
   above.
7. Click `Update Application`
8. Now, copy the `clientId` and `clientSecret` for your newly created Application into your `config/local.json` file.

Your `local.json` file should look something like the following,

```json
{
  "bin": {
    "protocol": "http",
    "host": "127.0.0.1",
    "port": 4000,
    "domain": "localhost",
    "proxyPort": 4001
  },

  "github": {
    "clientId": "<CLIENT_ID>",
    "clientSecret": "<CLIENT_SECRET>"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379,
    "password": "<REDIS_PASSWORD>"
  }
}
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

If you are looking for the list of Contributors of Mathbook, please refer to [contributors.md](./contributors.md)

## License

Mathbook is Open Source and Licensed under MPL-2.0 Please refer to [LICENSE](./LICENSE) for more info.
