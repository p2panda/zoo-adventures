import React from 'react';
import ReactDOM from 'react-dom/client';

import { ZooAdventures } from './';

const ENDPOINT = 'http://localhost:2020/graphql';
const SCHEMA_ID =
  'zoo_adventures_00209403784eea2ba5236f9083472f040a90babf4df1b64efbbaae58eb51aa67fd4d';
const DOCUMENT_ID =
  '0020c301d6595e12cbd472d21ac4c1bdfde02ec4e8d7ea299f723130d64eb65e500d';

const rootElem = document.createElement('div');
document.body.appendChild(rootElem);

const root = ReactDOM.createRoot(rootElem);
root.render(
  <ZooAdventures
    endpoint={ENDPOINT}
    schemaId={SCHEMA_ID}
    documentId={DOCUMENT_ID}
  />,
);
