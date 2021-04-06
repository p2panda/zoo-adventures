import React from 'react';
import { Light } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import vs2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';

Light.registerLanguage('javascript', js);

export const SyntaxHighlighter: React.FC = ({ children }) => (
  <Light language="javascript" style={vs2015}>
    {children}
  </Light>
);
