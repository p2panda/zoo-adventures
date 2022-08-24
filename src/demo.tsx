// See the demo in your browser under `http://localhost:3000` by running `npm
// run build` or `npm run watch` and then `npm run serve`.
import React from 'react';
import ReactDOM from 'react-dom/client';

import { ZooAdventures } from './';

const rootElem = document.createElement('div');
document.body.appendChild(rootElem);

const root = ReactDOM.createRoot(rootElem);
root.render(<ZooAdventures />);
