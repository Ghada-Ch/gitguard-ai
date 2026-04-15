const express = require("express");
const fs = require("fs");

const app = express();

app.get("/badge", (req, res) => {
  const data = JSON.parse(fs.readFileSync(".gitguard.json"));

  const score = data.score;

  let color = "brightgreen";
  let label = "SAFE";

  if (score > 20) {
    color = "yellow";
    label = "LOW";
  }
  if (score > 50) {
    color = "orange";
    label = "MEDIUM";
  }
  if (score > 75) {
    color = "red";
    label = "HIGH";
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="20">
  <rect width="140" height="20" fill="${color}" />
  <text x="10" y="14" fill="white" font-size="12">
    Risk: ${score} (${label})
  </text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

app.listen(3000, () => {
  console.log("Badge server running on port 3000");
});