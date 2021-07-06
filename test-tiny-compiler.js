const {
    tokenizer,
    parser,
    transformer,
    codeGenerator,
    compiler,
  } = require('./utils/the-super-tiny-compiler');
  
  const input  = '(add 2 (subtract 4 2))';
  const output = 'add(2, subtract(4, 2));';
  
  const tokens = [
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'add'      },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'subtract' },
    { type: 'number', value: '4'        },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: ')'        },
    { type: 'paren',  value: ')'        }
  ];
  
  const ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'add',
      params: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        name: 'subtract',
        params: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }]
  };
  
//   const newAst = {
//     type: 'Program',
//     body: [{
//       type: 'ExpressionStatement',
//       expression: {
//         type: 'CallExpression',
//         callee: {
//           type: 'Identifier',
//           name: 'add'
//         },
//         arguments: [{
//           type: 'NumberLiteral',
//           value: '2'
//         }, {
//           type: 'CallExpression',
//           callee: {
//             type: 'Identifier',
//             name: 'subtract'
//           },
//           arguments: [{
//             type: 'NumberLiteral',
//             value: '4'
//           }, {
//             type: 'NumberLiteral',
//             value: '2'
//           }]
//         }]
//       }
//     }]
//   };
  
// console.log('tokenizertokenizer',tokenizer(input))
// let tokens = tokenizer(input);
// console.log('parserparserparser',parser(tokens))
// let ast = parser(tokens);
console.log('transformertransformertransformer',transformer(ast))
// let newAst = transformer(ast);
// console.log('codeGeneratorcodeGeneratorcodeGenerator',codeGenerator(newAst))

// console.log('compilercompiler', compiler(input));