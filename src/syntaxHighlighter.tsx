import React from 'react';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import vs2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';
import { Light } from 'react-syntax-highlighter';

Light.registerLanguage('javascript', js);

export const SyntaxHighlighter: React.FC = ({ children }) => (
  <Light language="javascript" style={vs2015}>
    {children}
  </Light>
);
