const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function analyzeCode(code) {
  const issues = [];

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    // 🔐 Detect insecure password handling
    Identifier(path) {
      if (path.node.name.toLowerCase().includes("password")) {
        issues.push({
          id: "POSSIBLE_PASSWORD_USAGE",
          message: "Password variable detected (check secure handling)",
          score: 10,
        });
      }
    },

    // 🧪 Detect unsafe function calls
    CallExpression(path) {
      const name = path.node.callee.name;

      if (name === "eval") {
        issues.push({
          id: "EVAL_USAGE",
          message: "Usage of eval() is dangerous",
          score: 50,
        });
      }

      if (name === "setTimeout" || name === "setInterval") {
        const arg = path.node.arguments[0];
        if (arg && arg.type === "StringLiteral") {
          issues.push({
            id: "STRING_TIMEOUT",
            message: "String-based timeout execution detected",
            score: 25,
          });
        }
      }
    },

    // 🧨 Detect try/catch absence in async functions (basic heuristic)
    FunctionDeclaration(path) {
      const body = path.node.body.body;

      const hasTryCatch = body.some(
        (node) => node.type === "TryStatement"
      );

      if (!hasTryCatch) {
        issues.push({
          id: "NO_ERROR_HANDLING",
          message: "Function missing error handling (try/catch)",
          score: 15,
        });
      }
    },
  });

  return issues;
}

module.exports = { analyzeCode };