[![Build Status](https://travis-ci.org/JetJet13/mathbook.svg?branch=develop)](https://travis-ci.org/JetJet13/mathbook)
[![Greenkeeper badge](https://badges.greenkeeper.io/JetJet13/mathbook.svg)](https://greenkeeper.io/)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/mathbook-chat/Lobby)

![mathbook-logo](./src/front-end/public/images/mathbook_indigo_white_v5.png)

Mathbook is an online repository of peer-reviewed tutorials on topics covering a wide range of subjects in Mathematics.
It's open source and open to anyone who is interested in creating or reviewing a tutorial. The project itself is written
in JavaScript and built using NodeJS, ExpressJS, Riot and Pug.

## Requirements

* Node 8.x
* Redis 4.x

## Up and Running with Docker

Please refer to the wiki to get
[up and running with Docker](https://github.com/JetJet13/mathbook/wiki/Up-and-Running-with-Docker).

## Local Installation & Setup

### Download/Clone Mathbook Repo & Install Dependencies

```bash
git clone https://github.com/JetJet13/mathbook.git

cd ./mathbook

# install dependencies
npm i
```

### Additional Steps

**[required]** - You will need a custom configuration file tailored to your local setup so go ahead and create a file in
the `config` folder called `local.json`. You can grab a sample local config file
[from the wiki here](<https://github.com/JetJet13/mathbook/wiki/Sample-Local-Configuration-File-(local.json)>)

**[optional]** - This step if only needed if you want to get the authentication functionality of Mathbook to work. There
is a [wiki page](<(https://github.com/JetJet13/mathbook/wiki/Setup-Your-GitHub-OAuth-Application)>) to get that up and
running since its not required for a local setup.

### Downloading & Installing Redis

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
```

### Starting Up A Redis Server

```bash
redis-server
```

### Starting Up Mathbook

**Note**: You might need to install gulp and bunyan globally first

```bash
npm i -g gulp-cli bunyan
```

```bash
cd ./mathbook

# bundle the js and css files
gulp bundle

# start up the server
gulp serve

# if you want pretty log formatting
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

If you are looking for the list of Contributors of Mathbook, please refer to [contributors.md](./contributors.md)

## License

Mathbook is Open Source and Licensed under MPL-2.0 Please refer to [LICENSE](./LICENSE) for more info.
