import React from 'react';
import ReactDOM from 'react-dom/client';

import { Test } from './';

const rootElem = document.createElement('div');
document.body.appendChild(rootElem);

const root = ReactDOM.createRoot(rootElem);
root.render(<Test />);
