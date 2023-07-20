# Pixijack

# Prerequisites
To run this project, you need to have `Node.js` and `npm` installed on your system.

# Setup and run the game
```sh
# Install dependencies
npm install

# Start the project
npm run start
```

# Building the game
```sh
# Compile the game into a bundle, which can be found in `dist/`
npm run build`
```
# Known issues
- Asset bundles aren't currently watched, so any assets being added or removed would mean you have to run `npm run build-assets` again
- It may take a while for vite to launch the game on localhost
