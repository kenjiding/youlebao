const modules = {};

function requireAll(context) {
  context.keys().forEach((path) => {
    if (path === './index.js') return;
    const key = path.match(/\/(\S+)\.js$/)[1];
    modules[key] = context(path).default;
  });
}

requireAll(require.context('./', true, /\.js$/));

export default modules;
