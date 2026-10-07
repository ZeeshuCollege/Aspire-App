const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const srcDir = path.resolve(__dirname, '..', 'src');

function getAllFiles(dir, exts = ['.js', '.jsx']) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllFiles(srcDir);
console.log(`Found ${files.length} files in src/ to scan for undeclared variables...`);

const GLOBALS = new Set([
  'window', 'document', 'navigator', 'localStorage', 'sessionStorage',
  'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'fetch', 'alert', 'confirm', 'prompt', 'process', 'global', 'URL', 'URLSearchParams',
  'Blob', 'File', 'FormData', 'FileReader', 'Event', 'CustomEvent',
  'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'RegExp',
  'Error', 'TypeError', 'ReferenceError', 'RangeError', 'SyntaxError',
  'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect',
  'Intl', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'encodeURI', 'encodeURIComponent',
  'decodeURI', 'decodeURIComponent', 'import', 'undefined', 'NaN', 'Infinity',
  'BroadcastChannel', 'Notification', 'crypto'
]);

let totalIssues = 0;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf-8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  } catch (err) {
    console.error(`[PARSE ERROR] ${path.relative(srcDir, file)}: ${err.message}`);
    totalIssues++;
    continue;
  }

  const undeclared = [];

  traverse(ast, {
    ReferencedIdentifier(identPath) {
      const name = identPath.node.name;
      if (GLOBALS.has(name)) return;
      if (identPath.scope.hasBinding(name)) return;

      // Ignore JSX tags or types that might be ambient
      if (identPath.parentPath.isJSXMemberExpression()) return;
      if (identPath.parentPath.isTSTypeReference()) return;

      const loc = identPath.node.loc?.start;
      undeclared.push({ name, line: loc?.line || 0, col: loc?.column || 0 });
    }
  });

  if (undeclared.length > 0) {
    console.log(`\n🚨 Issues in ${path.relative(srcDir, file)}:`);
    for (const u of undeclared) {
      console.log(`   Line ${u.line}:${u.col} -> Undeclared variable: "${u.name}"`);
    }
    totalIssues += undeclared.length;
  }
}

console.log(`\nTotal undeclared variable issues found: ${totalIssues}`);
