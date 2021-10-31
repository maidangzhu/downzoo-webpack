const fs = require('fs');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;

// let source = fs.readFileSync('./source.js');
const source = require('./source.js');

babel.parse(source, (err, ast) => {
	console.log('ast', ast)
  // console.log(ast)
  let indent = '';
  traverse(ast, {
    // 进入节点
    enter(path) {
      console.log(indent + '<' + path.node.type + '>');
      indent += '  ';
    },
    // 退出节点
    exit(path) {
      indent = indent.slice(0, -2);
      console.log(indent + '<' + '/' + path.node.type + '>');
    },
  });
});
