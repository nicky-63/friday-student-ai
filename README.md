F.R.I.D.A.Y. is a multi-module academic search, indexing, and dependency engine designed to optimize student learning paths. Instead of treating study material as static text, this platform programmatically maps educational content into dynamic graph logic to isolate core conceptual knowledge gaps and deliver deterministic study paths.

🧩 Core Functional Modules

### 1. Ingestion & Tokenization Engine
*   **Lexical Parsing:** Implements native JavaScript tokenization routines to parse raw academic syllabi and text documents into structured JSON objects.
*   **Inverted Indexing:** Dynamically builds an in-memory transactional index map to achieve $O(1)$ lookup complexity across complex key terms and conceptual requirements.

### 2. DAG Dependency Resolver
*   **Relational Adjacency Matrices:** Translates curricular paths into explicit node-and-edge arrays.
*   **Topological Knowledge Mapping:** Computes conceptual prerequisites. If Node B requires Node A, the engine prevents path forward-traversal until Node A state resolves to `complete`.
*   **Knowledge Gap Isolation:** Traverses the graph to spot broken structural connections, automatically flagging missing prerequisites or non-linear jumps in a user's comprehension history.

### 3. Dynamic Vector Graph Renderer
*   **Mathematical Spatial Layouts:** Uses coordinate-based calculation algorithms to position nodes logically, minimizing line crossovers for high visual scannability.
*   **Native DOM Interaction:** Bypasses heavy canvas tracking mechanisms by manipulating high-performance, responsive HTML5 and CSS3 grid elements directly, ensuring rapid viewport paint times.

---

## 🛠️ Technical Stack & Dependencies

| Layer | Technology | Engineering Purpose |
| :--- | :--- | :--- |
| **Logic & State Engine** | JavaScript (ES6+) | Immutable state manipulation, topological sorting, matrix evaluation. |
| **Presentation Canvas** | HTML5 Semantic DOM | Lightweight interface construction, high-accessibility viewport tree. |
|Style & Transition | CSS3 Variables / Flexbox | Hardware-accelerated transitions, vector theme variables, responsive bounding. |

Zero-Dependency Design: Built entirely on native Web APIs. The project requires no heavy third-party bundle footprints (e.g., Webpack, React, or Lodash), maintaining a near-instantaneous Time-to-Interactive (TTI).

---

⚙️ Installation & Local Deployment

Production Prerequisites
To initialize the development sandbox or execute local production environments, ensure you have a modern web browser installed (e.g., Chromium 110+, WebKit 16+).

Step-by-Step Initialization
1. Clone the master distribution branch down to your operational workspace:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/FRIDAY.git](https://github.com/YOUR_USERNAME/FRIDAY.git)
Transition directly into the project repository root:

Bash
cd FRIDAY
Initialize a local development host environment (Python serving example):

Bash
# For Python 3.x environments
python3 -m http.server 8080
