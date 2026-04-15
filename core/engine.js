const { getDiff } = require("./git");
const { runRules } = require("./rules");

async function analyzeRepo(repoPath, fullScan = false) {
  const data = await getDiff(repoPath, fullScan);

  const result = runRules(data);

  return {
    ...result,
    metadata: {
      files: data.files,
    },
  };
}

module.exports = { analyzeRepo };