// Minimal mock DOM to test running the bundle in Node
global.window = global;
global.document = {
  createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {} }),
  getElementById: (id) => {
    if (id === 'root') {
      return {
        appendChild: (child) => console.log('Child appended to root:', child),
        innerHTML: ''
      };
    }
    return null;
  },
  head: { appendChild: () => {} },
  querySelectorAll: () => [],
  querySelector: () => null,
  body: { appendChild: () => {} },
  addEventListener: () => {}
};
// global.navigator is read-only in Node 24
global.location = { origin: 'http://localhost:5173', href: 'http://localhost:5173' };
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

try {
  await import('./dist/assets/index-CzcUQRmo.js');
  console.log('BUNDLE EXECUTED WITH NO ERRORS!');
} catch (err) {
  console.error('BUNDLE EXECUTION ERROR:', err);
}
