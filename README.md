# zoo-adventures

Play with the other animals in the zoo.

<img src="https://raw.githubusercontent.com/p2panda/zoo-adventures/main/screenshot.png" width="350" />

There is no real winner, but you get some extra attention in the zoo when finishing a complete line! You can make one move, then you have to wait for someone else to go ahead before you can make another one.

> The game is an experimental demo of p2panda showing how you can build collaborative applications with custom schemas on the network. You can play with it on our [website](https://aquadoggo.p2panda.org/)!

## Installation

```bash
npm i zoo-adventures
```

## Usage

Zoo Adventures is a React component you can embed in your website. It will connect to a [p2panda](https://aquadoggo.p2panda.org/) node and allow you to collaboratively play the game in the p2panda network.

```js
import { ZooAdventures } from 'zoo-adventures';

const App = () => {
  return (
    <ZooAdventures />
  );
}
```

To configure the component you can pass in the following arguments:


* `boardSize: number` Dimensions of the board, set to 4 when it is a 4x4 board (defaults to `4`)
* `winSize: number` Required number of pieces in horizontal, vertical, diagonal row to win (defaults to `3`)
* `documentId: string` All players play on the same board, this is the document id of it (defaults to `0020823a...`)
* `endpoint: string` URL of the p2panda node (defaults to `http://localhost:2020/graphql`)
* `schemaId: string` ID of the game board schema, make sure the board size matches the fields (defaults to `zoo_adventures_0020da64...`)
* `updateIntervalMs: number` Interval to fetch latest board game state from node in milliseconds (defaults to `2000`)

## Development

### Setup

```bash
# Install NodeJS dependencies
npm install
```

### Register schema

The used schema for this game is already deployed in the p2panda network. If you want to to deploy it on your [local node](https://github.com/p2panda/aquadoggo), you can run:

```
$ npm run schema

Usage: --privateKey [path] --boardSize [num] --endpoint [url]

Options:
      --help        Show help
      --version     Show version number
  -k, --privateKey  Path to file holding private key [default: Demo key]
  -s, --boardSize   Size of the game board, use 4 for "4x4" for example [default: 4]
  -e, --endpoint    Endpoint of p2panda node [default: "http://localhost:2020/graphql"]
```

It will deploy the schema and create the game board document on your node hosted at `http://localhost:2020`.

### Component

```bash
# Check linter errors
npm run lint

# Build library and demo
npm run build

# Watch for changes and automatically run `build`
npm run watch

# Start server to host demo (needs building first)
npm run serve
```

## License

[`MIT`](LICENSE)

## Supported by

<img src="https://raw.githubusercontent.com/p2panda/.github/main/assets/ngi-logo.png" width="auto" height="80px"><br />
<img src="https://raw.githubusercontent.com/p2panda/.github/main/assets/nlnet-logo.svg" width="auto" height="80px"><br />
<img src="https://raw.githubusercontent.com/p2panda/.github/main/assets/eu-flag-logo.png" width="auto" height="80px">

*This project has received funding from the European Union’s Horizon 2020
research and innovation programme within the framework of the NGI-POINTER
Project funded under grant agreement No 871528 and NGI-ASSURE No 957073*
