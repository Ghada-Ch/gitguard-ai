const simpleGit = require("simple-git");

async function getDiff(repoPath, fullScan = false) {
  const git = simpleGit(repoPath);

  try {
    let files = [];
    let diff = "";

    if (fullScan) {
      console.log("🌍 Full scan mode enabled");

      const filesRaw = await git.raw(["ls-files"]);
      files = filesRaw.split("\n").filter(Boolean);

      // diff against main branch for risk rules
      diff = await git.diff(["origin/main"]);
    } else {
      const filesRaw = await git.diff(["--name-only", "HEAD"]);
      files = filesRaw.split("\n").filter(Boolean);

      diff = await git.diff(["HEAD"]);
    }

    
    console.log("👉 Use --full to analyze entire codebase");

    return { diff, files };
  } catch (err) {
    console.error("Git error:", err.message);
    return { diff: "", files: [] };
  }
}

module.exports = { getDiff };