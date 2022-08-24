# zoo-adventures

Play with the other animals in the zoo.

<img src="https://raw.githubusercontent.com/p2panda/zoo-adventures/main/screenshot.png" width="350" />

This is a React component you can embed in your website. It will connect to a [p2panda](https://github.com/p2panda/handbook) node and allow you to collaboratively play the game in the p2panda network.

## Installation

```bash
npm i zoo-adventures
```

## Usage

```js
import ZooAdventures from 'zoo-adventures';

const App = () => {
  return (
    <ZooAdventures />
  );
}
```

To configure the component you can pass in the following arguments:


* `boardSize: number` Dimensions of the board, set to 4 when it is a 4x4 board (defaults to `4`)
* `winSize: number` Required number of pieces in horizontal, vertical, diagonal row to win (defaults to `3`)
* `documentId: string` All players play on the same board, this is the document id of it (defaults to `0020c301d659...`)
* `endpoint: string` URL of the p2panda node (defaults to `http://localhost:2020/graphql`)
* `schemaId: string` ID of the game board schema, make sure the board size matches the fields (defaults to `zoo_adventures_002094037...`)
* `updateIntervalMs: number` Interval to fetch latest board game state from node in milliseconds (defaults to `2000`)

## Development

### Setup

```bash
# Install NodeJS dependencies
npm install
```

### Register schema

The used schema for this game is already deployed in the p2panda network. If you want to to deploy it on your [local node](https://github.com/p2panda/aquadoggo), you can run:

```bash
node register-schema.js
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
