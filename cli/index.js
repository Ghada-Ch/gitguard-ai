#!/usr/bin/env node

const fs = require("fs");
const chalk = require("chalk").default;
const { analyzeRepo } = require("../core/engine");
const { commentOnPR } = require("../core/github");

async function main() {
  console.log("🔍 GitGuard AI running...\n");
  const args = process.argv.slice(2);
  const fullScan = args.includes("--full");

  const result = await analyzeRepo(process.cwd(), fullScan);

  console.log(chalk.yellow("\n⚠️    GitGuard AI Report\n"));

  console.log("Risk Score:", result.score);

  // 📦 FILE CONTEXT MESSAGE (IMPORTANT UX FIX)
  console.log(
    "\n📦 Analyzing changes from last commit:\n"
  );

if (fullScan) {
  console.log("\n📁 All project files:");
} else {
  console.log("\n📁 Changed files:");
}

result.metadata.files.forEach((f) => {
  console.log(`   - ${f}`);
});
if (result.metadata?.files?.length) {
  result.metadata.files.forEach((f) => {
    console.log(`   - ${f}`);
  });
} else {
  console.log("   - No changed files detected");
}
  
  console.log("\n----------------------------------\n");

  // ⚠️ ISSUES DISPLAY
  if (result.issues.length === 0) {
    console.log("🟢 No risks detected in this change.");
    console.log("✔️ Code looks clean based on current rules.\n");
  } else {
    result.issues.forEach((i) => {
    console.log(`\n📄 ${i.file}`);
    console.log(`⚠️  ${i.message} (+${i.score})`);
    console.log(`💡 ${i.explanation}`);
    });
  }

  // 🧠 BUILD PR MESSAGE
  const message = `
⚠️ GitGuard AI Report

Risk Score: ${result.score}

${
  result.issues.length === 0
    ? "🟢 No risks detected in this change."
    : result.issues.map(i => `- ${i.message}`).join("\n")
}
`;

  // 💾 SAVE RESULT
  fs.writeFileSync(
    ".gitguard.json",
    JSON.stringify(result, null, 2)
  );

  console.log("📦 Risk data saved to .gitguard.json");

  // 🚨 GITHUB COMMENT
  if (process.env.GITHUB_ACTIONS) {
    const token = process.env.GITHUB_TOKEN;

    if (token) {
      await commentOnPR(token, message);
    }
  }

  // ❌ CI FAILURE
  if (result.score >= 70) {
    console.error("\n❌ High risk detected. Failing CI.");
    process.exit(1);
  }
}
main();