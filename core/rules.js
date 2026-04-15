function runRules({ diff = "", files = [] }) {
  const issues = [];
  let score = 0;

  const addIssue = ({ file, id, scoreValue, message, explanation, category = "general" }) => {
    issues.push({
      file,
      id,
      score: scoreValue,
      message,
      explanation,
      category,
    });

    score += scoreValue;
  };

  const hasDiff = (regex) => regex.test(diff);

  // ======================================
  // 🔥 1. MERGE CONFLICTS
  // ======================================
  if (diff.includes("<<<<<<<") || diff.includes(">>>>>>>")) {
  const conflictFiles = files.filter((f) =>
    diff.includes(f)
  );

  issues.push({
    file: conflictFiles.length ? conflictFiles.join(", ") : "unknown",
    id: "MERGE_CONFLICT",
    score: 40,
    message: "Merge conflict detected",
    explanation:
      "Unresolved Git conflict markers found in file(s).",
  });

  score += 40;
}
// ======================================
  // 🔥 1. DEPLOY CHANGE
  // ======================================
  if (files.some((f) => f.endsWith("Procfile"))) {
  issues.push({
    file: "backend/Procfile",
    id: "DEPLOY_CHANGE",
    score: 25,
    message: "Deployment config modified",
    explanation:
      "Changes in Procfile may affect backend startup in production.",
  });

  score += 25;
}

  // ======================================
  // 🔥 2. SECRETS DETECTION (REALISTIC)
  // ======================================
  const secretPatterns = [
    /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
    /secret\s*[:=]\s*["'][^"']+["']/i,
    /password\s*[:=]\s*["'][^"']+["']/i,
    /token\s*[:=]\s*["'][^"']+["']/i,
    /AKIA[0-9A-Z]{16}/,
    /eyJ[a-zA-Z0-9-_]+\./, // JWT
  ];

  secretPatterns.forEach((pattern) => {
    if (pattern.test(diff)) {
      addIssue({
        file: "codebase",
        id: "SECRET_DETECTED",
        scoreValue: 100,
        category: "security",
        message: "Hardcoded secret detected",
        explanation:
          "Sensitive credentials found in code. This can lead to full system compromise.",
      });
    }
  });

  // ======================================
  // 🔥 3. DANGEROUS CODE EXECUTION
  // ======================================
  const dangerousPatterns = [
    /eval\s*\(/,
    /new Function\s*\(/,
    /child_process\.exec/,
    /execSync/,
  ];

  dangerousPatterns.forEach((pattern) => {
    if (pattern.test(diff)) {
      addIssue({
        file: "codebase",
        id: "DANGEROUS_CODE",
        scoreValue: 80,
        category: "security",
        message: "Dangerous code execution detected",
        explanation:
          "This pattern can execute arbitrary code and introduces serious security risks.",
      });
    }
  });

  // ======================================
  // 🔥 4. SQL INJECTION RISK
  // ======================================
  if (/(SELECT|INSERT|UPDATE|DELETE).*["'`]\s*\+\s*/i.test(diff)) {
    addIssue({
      file: "backend",
      id: "SQL_INJECTION_RISK",
      scoreValue: 70,
      category: "security",
      message: "Possible SQL injection pattern",
      explanation:
        "String concatenation in SQL queries may allow attackers to inject malicious queries.",
    });
  }

  // ======================================
  // 🔥 5. XSS RISK
  // ======================================
  if (/(innerHTML|dangerouslySetInnerHTML)\s*=/i.test(diff)) {
    addIssue({
      file: "frontend",
      id: "XSS_RISK",
      scoreValue: 60,
      category: "security",
      message: "Possible XSS vulnerability",
      explanation:
        "Direct HTML injection can lead to cross-site scripting (XSS) attacks.",
    });
  }

  // ======================================
  // 🔥 6. DEPENDENCY CHANGES
  // ======================================
  if (files.some((f) => f.endsWith("package.json"))) {
    addIssue({
      file: "package.json",
      id: "DEPENDENCY_CHANGE",
      scoreValue: 30,
      category: "dependency",
      message: "Dependency changes detected",
      explanation:
        "New or updated dependencies may introduce security or stability risks.",
    });
  }

  // ======================================
  // 🔥 7. MERGE / LARGE DIFF RISK
  // ======================================
  if (diff.length > 3000) {
    addIssue({
      file: "codebase",
      id: "LARGE_DIFF",
      scoreValue: 20,
      category: "quality",
      message: "Large code change detected",
      explanation:
        "Large diffs are harder to review and increase risk of hidden bugs.",
    });
  }

  // ======================================
  // FINAL SCORE NORMALIZATION
  // ======================================
  const finalScore = Math.min(score, 100);

  const riskLevel =
    finalScore >= 70 ? "HIGH" :
    finalScore >= 40 ? "MEDIUM" :
    "LOW";

  return {
    score: finalScore,
    issues,
    metadata: {
      totalFiles: files.length,
      riskLevel,
    },
  };
}

module.exports = { runRules };