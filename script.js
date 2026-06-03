const scenarioLibrary = {
  derivatives: {
    title: "Student: stuck on derivatives",
    confidence: 91,
    rootGap: "Algebraic simplification",
    explanation:
      "The student fails before applying derivative rules, so F.R.I.D.A.Y traces the issue to rational expression simplification.",
    path: ["algebra", "functions", "limits", "derivatives"],
    edges: ["algebra-functions", "functions-limits", "limits-derivatives"],
    recommendations: [
      "Review simplifying rational expressions",
      "Practice canceling common factors",
      "Retry derivative problems after simplification"
    ],
    time: "12 min",
    nodes: "6",
    feed: [
      ["Syllabus Scanner", "Parsed calculus unit objectives"],
      ["Prerequisite Engine", "Linked derivatives to limits and function manipulation"],
      ["Student Signal Reader", "Detected errors before derivative rules were used"],
      ["Gap Trace Core", "Traced the first weak prerequisite to rational simplification"],
      ["Briefing Validator", "Confirmed the diagnosis against syllabus dependencies"]
    ]
  },
  optimization: {
    title: "Student: stuck on optimization",
    confidence: 87,
    rootGap: "Graph interpretation",
    explanation:
      "The student can differentiate but cannot connect extrema to the shape of a function, so F.R.I.D.A.Y traces the gap to graph behavior.",
    path: ["graphs", "derivatives", "optimization"],
    edges: ["graphs-derivatives", "derivatives-optimization"],
    recommendations: [
      "Review increasing and decreasing intervals",
      "Match derivative signs to graph behavior",
      "Solve two optimization problems with sketched curves"
    ],
    time: "18 min",
    nodes: "5",
    feed: [
      ["Syllabus Scanner", "Found optimization after derivative applications"],
      ["Student Signal Reader", "Observed correct formulas but incorrect extrema decisions"],
      ["Gap Trace Core", "Walked backward from optimization to graph interpretation"],
      ["Recommender Core", "Built a visual bridge lesson before new optimization practice"],
      ["Briefing Validator", "Flagged medium confidence because algebra mastery is strong"]
    ]
  },
  integrals: {
    title: "Student: stuck on integrals",
    confidence: 84,
    rootGap: "Trigonometry identities",
    explanation:
      "The student understands the integration setup but stalls when identities are needed to transform the expression.",
    path: ["trig", "limits", "integrals"],
    edges: ["trig-integrals"],
    recommendations: [
      "Review core trigonometric identities",
      "Practice rewriting expressions before integrating",
      "Try substitution problems that require one identity"
    ],
    time: "16 min",
    nodes: "4",
    feed: [
      ["Concept Mapper", "Inferred trigonometry identities as a hidden prerequisite"],
      ["Prerequisite Engine", "Connected trig transformations to integration techniques"],
      ["Student Signal Reader", "Found repeated stalls during expression rewriting"],
      ["Gap Trace Core", "Selected trigonometry identities as the earliest blocker"],
      ["Briefing Validator", "Kept confidence lower because the edge was inferred"]
    ]
  }
};

const conceptRules = [
  ["algebra", "Algebraic simplification", ["algebra", "simplif", "rational", "factor", "expression"]],
  ["functions", "Function manipulation", ["function", "notation", "domain", "range"]],
  ["graphs", "Graph interpretation", ["graph", "curve", "increasing", "decreasing", "extrema", "shape"]],
  ["limits", "Limits", ["limit", "continuity", "approach"]],
  ["derivatives", "Derivatives", ["derivative", "differentiate", "slope", "rate of change"]],
  ["optimization", "Optimization", ["optimization", "maximum", "minimum", "extrema", "application"]],
  ["integrals", "Integrals", ["integral", "integrate", "substitution", "area"]],
  ["trig", "Trigonometry", ["trig", "trigonometry", "sine", "cosine", "identity"]]
];

const scenarioButtons = document.querySelectorAll(".scenario");
const title = document.querySelector("#selectedStudentTitle");
const confidence = document.querySelector("#confidenceScore");
const rootGap = document.querySelector("#rootGap");
const explanation = document.querySelector("#traceExplanation");
const recommendations = document.querySelector("#recommendations");
const timeSaved = document.querySelector("#timeSaved");
const nodesChecked = document.querySelector("#nodesChecked");
const agentFeed = document.querySelector("#agentFeed");
const runSwarm = document.querySelector("#runSwarm");
const resetDemo = document.querySelector("#resetDemo");
const nodes = document.querySelectorAll(".node");
const edges = document.querySelectorAll(".edges path");
const syllabusInput = document.querySelector("#syllabusInput");
const studentSignal = document.querySelector("#studentSignal");
const targetTopic = document.querySelector("#targetTopic");
const buildMap = document.querySelector("#buildMap");
const analyzeGap = document.querySelector("#analyzeGap");
const fileInput = document.querySelector("#fileInput");
const conceptCloud = document.querySelector("#conceptCloud");
const exportBriefing = document.querySelector("#exportBriefing");
const aiMode = document.querySelector("#aiMode");
const chatLog = document.querySelector("#chatLog");
const chatInput = document.querySelector("#chatInput");
const sendChat = document.querySelector("#sendChat");
const generatePractice = document.querySelector("#generatePractice");
const practiceList = document.querySelector("#practiceList");
const studyPlan = document.querySelector("#studyPlan");
const statuses = {
  scanner: document.querySelector("#scannerStatus"),
  mapper: document.querySelector("#mapperStatus"),
  trace: document.querySelector("#traceStatus"),
  validator: document.querySelector("#validatorStatus")
};

let activeScenario = "derivatives";
let feedTimer;
let currentBriefing = "";
let extractedConcepts = [];
let backendOnline = false;

const labelToNode = {
  "algebraic simplification": "algebra",
  algebra: "algebra",
  "rational expressions": "algebra",
  "function manipulation": "functions",
  functions: "functions",
  "function notation": "functions",
  "graph interpretation": "graphs",
  graphs: "graphs",
  limits: "limits",
  derivatives: "derivatives",
  derivative: "derivatives",
  optimization: "optimization",
  integrals: "integrals",
  integral: "integrals",
  trigonometry: "trig",
  "trigonometry identities": "trig",
  "trig identities": "trig",
  "expression rewriting": "trig"
};

const edgeMap = {
  "algebra-functions": ["algebra", "functions"],
  "functions-limits": ["functions", "limits"],
  "limits-derivatives": ["limits", "derivatives"],
  "derivatives-optimization": ["derivatives", "optimization"],
  "graphs-derivatives": ["graphs", "derivatives"],
  "trig-integrals": ["trig", "integrals"],
  "algebra-integrals": ["algebra", "integrals"]
};

function setScenario(name, animate = false, overrides = {}) {
  activeScenario = name;
  const data = { ...scenarioLibrary[name], ...overrides };

  scenarioButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === name);
  });

  title.textContent = data.title;
  confidence.textContent = `${data.confidence}% confidence`;
  rootGap.textContent = data.rootGap;
  explanation.textContent = data.explanation;
  timeSaved.textContent = data.time;
  nodesChecked.textContent = data.nodes;

  recommendations.innerHTML = data.recommendations
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  targetTopic.value = name;
  paintGraph(data);
  renderFeed(data.feed, animate);
  currentBriefing = createBriefing(data);
}

function paintGraph(data) {
  nodes.forEach((node) => {
    const nodeName = node.dataset.node;
    node.classList.remove("root", "path", "current", "active");

    if (data.path.includes(nodeName)) node.classList.add("path");
    if (nodeName === data.path[0]) node.classList.add("root");
    if (nodeName === data.path[data.path.length - 1]) node.classList.add("current");
  });

  edges.forEach((edge) => {
    edge.classList.toggle("active", data.edges.includes(edge.dataset.edge));
  });
}

function updateStudentOutputs(data) {
  if (Array.isArray(data.practice)) {
    practiceList.innerHTML = data.practice.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  if (Array.isArray(data.studyPlan)) {
    studyPlan.innerHTML = data.studyPlan.map((item) => `<p><strong>Protocol:</strong> ${escapeHtml(item)}</p>`).join("");
  }
}

function renderFeed(feed, animate) {
  clearInterval(feedTimer);
  agentFeed.innerHTML = "";

  if (!animate) {
    agentFeed.innerHTML = feed
      .slice(0, 3)
      .map(([agent, message]) => `<li><span>${escapeHtml(agent)}</span>${escapeHtml(message)}</li>`)
      .join("");
    return;
  }

  let index = 0;
  feedTimer = setInterval(() => {
    if (index >= feed.length) {
      clearInterval(feedTimer);
      const lastItem = agentFeed.querySelector(".running");
      if (lastItem) lastItem.classList.remove("running");
      return;
    }

    const previous = agentFeed.querySelector(".running");
    if (previous) previous.classList.remove("running");

    const [agent, message] = feed[index];
    const item = document.createElement("li");
    item.className = "running";
    item.innerHTML = `<span>${escapeHtml(agent)}</span>${escapeHtml(message)}`;
    agentFeed.appendChild(item);
    index += 1;
  }, 480);
}

function extractConcepts(text) {
  const lowerText = text.toLowerCase();
  return conceptRules
    .filter(([, , keywords]) => keywords.some((keyword) => lowerText.includes(keyword)))
    .map(([id, label]) => ({ id, label }));
}

function renderConceptCloud(concepts) {
  conceptCloud.innerHTML = concepts.length
    ? concepts.map((concept) => `<span class="concept-chip">${escapeHtml(concept.label)}</span>`).join("")
    : `<span class="concept-chip">No concepts detected yet</span>`;
}

function inferScenario(signal, preferredTopic) {
  const text = signal.toLowerCase();
  if (text.includes("integr") || text.includes("trig") || text.includes("identity")) return "integrals";
  if (text.includes("optim") || text.includes("maximum") || text.includes("minimum") || text.includes("graph")) return "optimization";
  if (text.includes("deriv") || text.includes("rational") || text.includes("simplif")) return "derivatives";
  return preferredTopic || "derivatives";
}

function deriveOverrides(name, concepts) {
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const base = scenarioLibrary[name];
  let confidenceDelta = conceptIds.has(base.path[0]) ? 2 : -6;
  confidenceDelta += conceptIds.has(name) ? 2 : -3;

  return {
    confidence: Math.max(68, Math.min(96, base.confidence + confidenceDelta)),
    nodes: String(new Set([...base.path, ...concepts.map((concept) => concept.id)]).size),
    feed: [
      ["Syllabus Scanner", `Detected ${concepts.length || 0} course concepts from the provided material`],
      ["Concept Mapper", concepts.length ? `Mapped ${concepts.map((concept) => concept.label).join(", ")}` : "No syllabus concepts found, using default calculus map"],
      ...base.feed.slice(2)
    ]
  };
}

function setStatus(key, label, working = false) {
  statuses[key].textContent = label;
  statuses[key].classList.toggle("working", working);
}

async function buildKnowledgeMap() {
  setStatus("scanner", "Scanning", true);
  setStatus("mapper", "Queued", true);
  await wait(350);

  extractedConcepts = extractConcepts(syllabusInput.value);
  renderConceptCloud(extractedConcepts);
  setStatus("scanner", "Complete");
  setStatus("mapper", "Mapping", true);
  await wait(350);

  const inferred = inferScenario(studentSignal.value, targetTopic.value);
  setScenario(inferred, true, deriveOverrides(inferred, extractedConcepts));
  setStatus("mapper", "Complete");
  setStatus("trace", "Ready");
  setStatus("validator", "Ready");
}

async function analyzeStudentGap() {
  setStatus("trace", "Tracing", true);
  setStatus("validator", "Queued", true);
  await wait(360);

  const concepts = extractedConcepts.length ? extractedConcepts : extractConcepts(syllabusInput.value);
  const inferred = inferScenario(studentSignal.value, targetTopic.value);
  const aiResult = await postApi("/api/analyze", {
    syllabus: syllabusInput.value,
    studentSignal: studentSignal.value,
    targetTopic: targetTopic.value
  });

  if (aiResult) {
    applyAiAnalysis(aiResult, inferred, concepts);
  } else {
    setScenario(inferred, true, deriveOverrides(inferred, concepts));
  }

  setStatus("trace", "Complete");

  await wait(320);
  setStatus("validator", aiResult?.aiGenerated ? "Gemini verified" : "Verified");
}

async function loadSyllabusFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  syllabusInput.value = text;
  setStatus("scanner", "File loaded");
  await buildKnowledgeMap();
}

function exportCurrentBriefing() {
  if (!currentBriefing) {
    const concepts = extractedConcepts.length ? extractedConcepts : extractConcepts(syllabusInput.value);
    const inferred = inferScenario(studentSignal.value, targetTopic.value);
    const data = { ...scenarioLibrary[inferred], ...deriveOverrides(inferred, concepts) };
    currentBriefing = createBriefing(data);
  }

  const blob = new Blob([currentBriefing], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "friday-student-briefing.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("validator", "Briefing exported");
}

async function handleChat() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendChat("You", message, "user", false);
  chatInput.value = "";
  appendChat("F.R.I.D.A.Y", "Processing student signal...", "system", false);

  const result = await postApi("/api/chat", {
    message,
    syllabus: syllabusInput.value,
    studentSignal: studentSignal.value,
    rootGap: rootGap.textContent,
    targetTopic: targetTopic.value
  });

  const pending = chatLog.lastElementChild;
  if (pending) pending.remove();

  appendChat("F.R.I.D.A.Y", result?.reply || localChatAnswer(message), "", true);
}

function appendChat(author, text, className = "", isMarkdown = false) {
  const item = document.createElement("p");
  item.className = className;
  
  if (isMarkdown && typeof marked !== 'undefined') {
    item.innerHTML = `<strong>${escapeHtml(author)}:</strong> ${marked.parse(text)}`;
  } else {
    item.innerHTML = `<strong>${escapeHtml(author)}:</strong> ${escapeHtml(text)}`;
  }
  
  chatLog.appendChild(item);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function handlePracticeGeneration() {
  setStatus("validator", "Generating", true);
  const result = await postApi("/api/practice", {
    rootGap: rootGap.textContent,
    targetTopic: targetTopic.value,
    studentSignal: studentSignal.value
  });

  if (result) {
    updateStudentOutputs(result);
    setStatus("validator", result.aiGenerated ? "Gemini practice" : "Practice ready");
  } else {
    const fallback = scenarioLibrary[activeScenario];
    updateStudentOutputs({
      practice: [
        `Explain ${fallback.rootGap} in one sentence.`,
        `Solve one warm-up focused only on ${fallback.rootGap}.`,
        "Mark the exact step where the original problem breaks.",
        "Solve a bridge problem that connects the gap to the target topic.",
        "Retry the original problem without notes."
      ],
      studyPlan: [
        `Repair ${fallback.rootGap}`,
        "Solve two bridge examples",
        "Return to the original topic and compare mistakes"
      ]
    });
    setStatus("validator", "Practice ready");
  }
}

function localChatAnswer(message) {
  return `Briefing: "${message}" connects to ${rootGap.textContent}. Fix that prerequisite first, then retry ${targetTopic.value}.`;
}

function applyAiAnalysis(result, fallbackScenario, concepts) {
  const normalizedPath = normalizePath(result.path, fallbackScenario);
  const scenario = inferScenario(`${result.title || ""} ${normalizedPath.join(" ")}`, fallbackScenario);
  const base = scenarioLibrary[scenario] || scenarioLibrary[fallbackScenario];
  
  const path = normalizedPath.length ? normalizedPath : base.path;
  const edgesForPath = edgesFromPath(path);

  setScenario(scenario, true, {
    ...deriveOverrides(scenario, concepts),
    title: result.title || base.title,
    confidence: Number(result.confidence) || base.confidence,
    rootGap: result.rootGap || base.rootGap,
    explanation: result.explanation || base.explanation,
    path: path, 
    edges: edgesForPath.length ? edgesForPath : base.edges,
    recommendations: Array.isArray(result.recommendations) ? result.recommendations : base.recommendations,
    feed: [
      ["Syllabus Scanner", "Sent syllabus context to Gemini"],
      ["Concept Mapper", "Merged extracted course concepts with AI reasoning"],
      ["Student Signal Reader", "Analyzed the student's reported confusion"],
      ["Gap Trace Core", `Root gap selected: ${result.rootGap || base.rootGap}`],
      ["Briefing Validator", `${result.provider || "AI"} returned a student briefing`]
    ]
  });
  updateStudentOutputs(result);
}

function normalizePath(path, fallbackScenario) {
  if (!Array.isArray(path)) return scenarioLibrary[fallbackScenario].path;
  return path
    .map((item) => labelToNode[String(item).toLowerCase().trim()] || String(item).toLowerCase().trim())
    .filter((item) => Array.from(nodes).some((node) => node.dataset.node === item));
}

function edgesFromPath(path) {
  const pairs = new Set();
  for (let index = 0; index < path.length - 1; index += 1) {
    pairs.add(`${path[index]}-${path[index + 1]}`);
    pairs.add(`${path[index + 1]}-${path[index]}`);
  }

  return Object.entries(edgeMap)
    .filter(([, [from, to]]) => pairs.has(`${from}-${to}`) || pairs.has(`${to}-${from}`))
    .map(([edge]) => edge);
}

async function postApi(path, payload) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Network connection error:", error);
    return null;
  }
}

async function checkAiStatus() {
  try {
    const response = await fetch("/api/status");
    if (!response.ok) throw new Error();
    if (aiMode) aiMode.textContent = "Gemini Swarm Engine Active";
  } catch {
    if (aiMode) aiMode.textContent = "Offline Fallback (Static Prompts)";
  }
}

function createBriefing(data) {
  return [
    "F.R.I.D.A.Y Student Briefing",
    "",
    data.title,
    `Confidence: ${data.confidence}%`,
    `Root gap: ${data.rootGap}`,
    "",
    "Trace:",
    data.path.map((node) => `- ${labelForNode(node)}`).join("\n"),
    "",
    "Explanation:",
    data.explanation,
    "",
    "Recommended bridge:",
    data.recommendations.map((item) => `- ${item}`).join("\n")
  ].join("\n");
}

function labelForNode(id) {
  return conceptRules.find(([conceptId]) => conceptId === id)?.[1] || id;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.scenario;
    targetTopic.value = name;
    setScenario(name, true, deriveOverrides(name, extractedConcepts));
  });
});

runSwarm.addEventListener("click", analyzeStudentGap);
analyzeGap.addEventListener("click", analyzeStudentGap);
buildMap.addEventListener("click", buildKnowledgeMap);
fileInput.addEventListener("change", loadSyllabusFile);
exportBriefing.addEventListener("click", exportCurrentBriefing);
generatePractice.addEventListener("click", handlePracticeGeneration);
sendChat.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleChat();
});

resetDemo.addEventListener("click", () => {
  syllabusInput.value = "Calculus I: functions, graph interpretation, limits, derivatives, optimization, integrals, trigonometry review, algebraic simplification, rational expressions, applications of rates of change.";
  studentSignal.value = "Student is stuck on derivatives and keeps failing when rational expressions must be simplified before using derivative rules.";
  extractedConcepts = extractConcepts(syllabusInput.value);
  renderConceptCloud(extractedConcepts);
  setStatus("scanner", "Ready");
  setStatus("mapper", "Ready");
  setStatus("trace", "Ready");
  setStatus("validator", "Ready");
  setScenario("derivatives", false, deriveOverrides("derivatives", extractedConcepts));
});

nodes.forEach((node) => {
  node.addEventListener("click", () => {
    const matchingScenario = Object.entries(scenarioLibrary).find(([, data]) => {
      return data.path.includes(node.dataset.node);
    });

    if (matchingScenario) {
      targetTopic.value = matchingScenario[0];
      setScenario(matchingScenario[0], true, deriveOverrides(matchingScenario[0], extractedConcepts));
    }
  });
});

extractedConcepts = extractConcepts(syllabusInput.value);
renderConceptCloud(extractedConcepts);
setScenario(activeScenario, false, deriveOverrides(activeScenario, extractedConcepts));
checkAiStatus();
