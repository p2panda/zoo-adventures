# beep-boop

[p2panda](https://github.com/p2panda/handbook) demo chat client running as a statically hosted web or native [Tauri](https://tauri.studio/) desktop application. See it live [here](https://p2panda.org/demo/). ⬅️

## Requirements

* Node.js
* Rust

## Development

```bash
# Install Node dependencies
npm install

# Run development server (via http://localhost:4000)
npm run start

# Start native application in development mode (make sure the development
# server runs simultaneously)
npm run tauri:start

# Check linter errors
npm run lint

# Build static files for web hosting
npm run build

# Build native desktop application
npm run tauri:build
```

## License

[`MIT`](LICENSE)
