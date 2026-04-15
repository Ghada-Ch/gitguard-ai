const { Octokit } = require("@octokit/rest");

async function commentOnPR(token, message) {
  const octokit = new Octokit({ auth: token });

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

  const pull_number = process.env.GITHUB_REF.match(/\d+/)?.[0];

  if (!pull_number) return;

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: Number(pull_number),
    body: message,
  });
}

module.exports = { commentOnPR };