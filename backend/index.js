const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json()); // allow JSON body
const PORT = 3001;

app.get("/decisions", (req, res) => {
  const decisionsDir = path.join(__dirname, "../data/decisions");
  let decisions = [];

  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir);

    decisions = files.map((file) => {
      const content = fs.readFileSync(
        path.join(decisionsDir, file),
        "utf-8"
      );

      return {
        filename: file,
        text: content,
      };
    });
  }

  res.json(decisions);
});



app.post("/search", (req, res) => {
  const { caseText } = req.body;

  // Placeholder search: return all precedents for now
  const decisionsDir = path.join(__dirname, "../data/decisions");
  let decisions = [];

  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir);

    decisions = files.map((file) => {
      const content = fs.readFileSync(path.join(decisionsDir, file), "utf-8");
      return { filename: file, text: content };
    });
  }

  res.json({
    query: caseText || "",
    results: decisions,
  });
});




app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});



