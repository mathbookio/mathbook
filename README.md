# Mathbook

Mathbook is a website that provides peer-reviewed tutorials on topics covering most subjects in mathematics.

Mathbook is written in JavaScript and built using NodeJS, ExpressJS, Riot and Pug (formerly known as Jade)

## Requirements

* Node 8.x

## Installation & Setup

```bash
git clone https://github.com/JetJet13/mathbook.git

cd ./mathbook

npm i
```

## Run Locally

```bash
gulp serve

# if you want pretty log formatting (linux/macOS users only)
gulp serve | bunyan
```

**Note**: if the above commands fail, you might need to install gulp and bunyan globally

```bash
npm i -g gulp bunyan
```

## Testing

```bash
# run all tests
gulp test

# run functional tests
gulp test:func

# run feature tests
gulp test:feature

# run component tests
gulp test:component


# To do some TDD, you can use
gulp tdd
```

**Note**: if the above test commands fail, you might need to install gulp and bunyan globally

## Contributing

If you are interested in contributing please refer to [CONTRIBUTING.md](./CONTRIBUTING.md)

## Contributors

If you are looking for the list of Contributors of Mathbook, please refer to [CONTRIBUTORS.md](./CONTRIBUTORS.md)

## License

Mathbook is Open Source and Licensed under ... Please refer to [LICENSE.md](./LICENSE.md) for more info.
