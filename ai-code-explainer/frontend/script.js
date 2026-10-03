// Backend address (Spring Boot)
// After you deploy the backend, replace the URL below with your real one.
const PRODUCTION_API = "https://YOUR-BACKEND-URL/api/code/explain";
const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const API_URL = IS_LOCAL ? "http://localhost:8080/api/code/explain" : PRODUCTION_API;

// Which response field goes in which card
const SECTIONS = [
  { key: "explanation",     title: "Simple Explanation" },
  { key: "lineByLine",      title: "Line-by-Line Explanation" },
  { key: "logic",           title: "Logic / Algorithm" },
  { key: "concepts",        title: "Important Programming Concepts" },
  { key: "timeComplexity",  title: "Time Complexity" },
  { key: "spaceComplexity", title: "Space Complexity" },
  { key: "errors",          title: "Possible Errors" },
  { key: "suggestions",     title: "Suggestions" },
  { key: "improvedCode",    title: "Improved Code", isCode: true }
];

const languageEl = document.getElementById("language");
const codeEl = document.getElementById("code");
const countEl = document.getElementById("count");
const explainBtn = document.getElementById("explainBtn");
const clearBtn = document.getElementById("clearBtn");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const sectionsEl = document.getElementById("sections");
const copyAllBtn = document.getElementById("copyAllBtn");
const themeBtn = document.getElementById("themeBtn");

let lastData = null;

/* ---------- Theme (dark / light) ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
}
applyTheme(localStorage.getItem("theme") || "light");

themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

/* ---------- Helpers ---------- */
function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}
function hideError() {
  errorEl.classList.add("hidden");
}
function setLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
  explainBtn.disabled = isLoading;
}
async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const original = button.textContent;
    button.textContent = "Copied!";
    setTimeout(() => (button.textContent = original), 1500);
  } catch (e) {
    showError("Could not copy to clipboard.");
  }
}

/* ---------- Show the result ---------- */
function renderResult(data) {
  lastData = data;
  document.getElementById("programOutput").textContent = data.programOutput || "Not available.";
  sectionsEl.innerHTML = "";

  SECTIONS.forEach(({ key, title, isCode }) => {
    const card = document.createElement("div");
    card.className = "card section";

    const heading = document.createElement("h3");
    heading.textContent = title;
    card.appendChild(heading);

    const value = data[key] || "Not available.";

    if (isCode) {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = value;            // textContent = safe, never runs as HTML
      pre.appendChild(code);
      card.appendChild(pre);

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "btn secondary small copy-code";
      copyBtn.textContent = "Copy Code";
      copyBtn.addEventListener("click", () => copyText(value, copyBtn));
      card.appendChild(copyBtn);
    } else {
      const p = document.createElement("p");
      p.className = "text";
      p.textContent = value;
      card.appendChild(p);
    }
    sectionsEl.appendChild(card);
  });

  resultEl.classList.remove("hidden");
  resultEl.scrollIntoView({ behavior: "smooth" });
}

/* ---------- Main action ---------- */
async function explainCode() {
  hideError();
  resultEl.classList.add("hidden");

  const language = languageEl.value;
  const code = codeEl.value.trim();

  // 1. Validate input
  if (!language) {
    showError("Please select a programming language.");
    return;
  }
  if (!code) {
    showError("Please enter some code.");
    return;
  }

  // 2. Show loading and call the backend
  setLoading(true);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code })
    });

    // 3. Read JSON (may fail if the server sent something else)
    let data;
    try {
      data = await response.json();
    } catch (e) {
      showError("Something went wrong while analyzing the code.");
      return;
    }

    // 4. Handle API errors from our backend
    if (!response.ok || !data.success) {
      showError(data.message || "Something went wrong while analyzing the code.");
      return;
    }

    // 5. Display
    renderResult(data);

  } catch (e) {
    // fetch() itself failed: backend off, wrong port, no internet...
    showError("Unable to connect to the AI service. Please try again.");
  } finally {
    setLoading(false);
  }
}

/* ---------- Events ---------- */
explainBtn.addEventListener("click", explainCode);

clearBtn.addEventListener("click", () => {
  codeEl.value = "";
  countEl.textContent = "0";
  hideError();
  resultEl.classList.add("hidden");
  sectionsEl.innerHTML = "";
  lastData = null;
});

codeEl.addEventListener("input", () => {
  countEl.textContent = codeEl.value.length;
});

copyAllBtn.addEventListener("click", () => {
  if (!lastData) return;
  const text = SECTIONS
    .map(({ key, title }) => title + "\n" + (lastData[key] || "Not available."))
    .join("\n\n");
  copyText(text, copyAllBtn);
});

/* ---------- Output options (shown at the end of the result) ---------- */
function buildText(markdown) {
  if (!lastData) return "";
  const parts = SECTIONS.map(({ key, title, isCode }) => {
    const value = lastData[key] || "Not available.";
    if (markdown) {
      return "## " + title + "\n\n" + (isCode ? "```\n" + value + "\n```" : value);
    }
    return title + "\n" + "-".repeat(title.length) + "\n" + value;
  });
  const out = lastData.programOutput || "Not available.";
  parts.push(markdown
    ? "## Program Output (predicted)\n\n```\n" + out + "\n```"
    : "Program Output (predicted)\n--------------------------\n" + out);
  const head = markdown ? "# AI Code Explainer Output\n\n" : "AI CODE EXPLAINER OUTPUT\n\n";
  return head + parts.join("\n\n") + "\n";
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.getElementById("outCopy").addEventListener("click", (e) => copyText(buildText(false), e.target));
document.getElementById("outTxt").addEventListener("click", () =>
  downloadFile("code-explanation.txt", buildText(false), "text/plain"));
document.getElementById("outMd").addEventListener("click", () =>
  downloadFile("code-explanation.md", buildText(true), "text/markdown"));
document.getElementById("outPrint").addEventListener("click", () => window.print());
