import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/App.jsx';

try {
  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log('Server Render SUCCESS! HTML length:', html.length);
} catch (err) {
  console.error('SERVER RENDER ERROR:', err);
}
