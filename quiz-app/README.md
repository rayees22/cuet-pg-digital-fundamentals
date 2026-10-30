# SAMARTH CUET PG 2026 - Digital Fundamentals Interactive Quiz Platform

> A production-ready, zero-dependency, modern interactive quiz web application for **Digital Fundamentals / Digital Electronics & Logic Design**, strictly modeled on the **SAMARTH NTA CUET PG testing platform architecture** for **CUET PG Computer Science (SCQP09) / MCA / NIMCET**.

---

## 🌟 Key Highlights & Architectural Principles

- **Uncluttered 3-Screen Flow**:
  1. **Setup Dashboard (`#screen-setup`)**: Topic selector (All 12 Units or specific Unit), question count pills (10, 25, 50, 100, All), and live resume ongoing session banner.
  2. **Quiz Arena (`#screen-quiz`)**: Distraction-free testing layout, real-time metrics (timer, correct/incorrect counters, score, progress bar), instant green/red evaluation, step-by-step Hinglish derivations, and **⚠️ CUET PG Exam Trap & Shortcut** alerts.
  3. **Results & In-Depth Review (`#screen-results`)**: Circular animated score ring, CUET PG marking scheme calculation (+4 for correct, -1 for negative marking), 6 performance metrics, 12-unit syllabus progress bars, and filterable review cards (`All`, `Mistakes Only`, `Skipped`, `Correct Only`).
- **Retake Missed Questions Only**: One-click launcher on the results page that initializes a new quiz session targeting ONLY the questions the student got wrong.
- **Double Fisher-Yates Randomization**:
  - The questions array is shuffled.
  - For each question, **all 4 options are shuffled independently** with zero position bias. Option mapping dynamically tracks correctness, ensuring 100% mathematical accuracy without position predictability.
- **Zero-CORS & Offline-First**:
  - Double-clicking `index.html` via `file:///` works out of the box with zero CORS errors.
  - Data is cleanly loaded via `data/questions.js` (`window.CUET_DF_DATA`).
- **Zero External Dependencies**:
  - Pure vanilla HTML5, CSS3, and ES6+ JavaScript.
  - Native Web Audio API procedural sound synthesis (custom harmonic sine/triangle chimes for correct/incorrect answers without needing external MP3/WAV files).
- **LocalStorage Session Auto-Save**:
  - Automatically saves quiz progress, answers, elapsed timer, and bookmark flags under `cuet_df_quiz_session_v1`.
  - Refreshing or closing the browser preserves the active session with an animated pulsing indicator on the setup screen.
- **Question Palette Drawer**:
  - Slide-out drawer accessible from any screen via header grid icon.
  - Displays numbered chips 1 to 220 color-coded by state (Green = Correct, Red = Incorrect, Amber = Flagged, Slate = Unanswered, Blue Border = Current).
- **Full Keyboard Navigation**:
  - `1 - 4` or `A - D`: Select Option
  - `N` / `→` / `Enter`: Next Question
  - `P` / `←`: Previous Question
  - `S`: Skip Question
  - `F`: Flag / Bookmark Question
  - `Escape`: Close Modals and Drawer
- **Theme & Sound Persistence**:
  - Sleek Dark Mode (Default) and crisp Light Mode with instant transition.
  - Audio mute/unmute toggle.

---

## 📚 12-Unit Syllabus & Question Bank Distribution (220 MCQs)

| Unit | Syllabus Module Name | Question Count | Core Exam Topics Covered |
| :---: | :--- | :---: | :--- |
| **Unit 1** | **Number Systems & Binary Arithmetic** | **18 MCQs** | Radix conversions, 1's & 2's Complement, Overflow detection ($V = C_n \oplus C_{n-1}$), BCD, Gray code, Excess-3, Hamming code parity, IEEE 754 Floating point. |
| **Unit 2** | **Boolean Algebra & Logic Gates** | **18 MCQs** | Universal gates (NAND/NOR counts), XOR/XNOR parity, De Morgan's Laws, Consensus theorem, Duality, Idempotent/Involution laws, Self-dual functions. |
| **Unit 3** | **K-Map Minimization & Logic Hazards** | **18 MCQs** | Gray code adjacency, Prime Implicants (PI) vs Essential Prime Implicants (EPI), Don't Care conditions ($d$), Corner quads, Static-0/1 & Dynamic hazards. |
| **Unit 4** | **Combinational Arithmetic Circuits** | **18 MCQs** | Half Adder & Full Adder equations ($S, C_{out}$), Half/Full Subtractor, Ripple Carry delay ($N \cdot t_{pd}$), Carry Look-Ahead (CLA) generator ($G_i$) & propagator ($P_i$), BCD Adder. |
| **Unit 5** | **Data Routing Circuits (MUX, DEMUX, Decoders)** | **20 MCQs** | 2:1 to 16:1 MUX trees, Shannon's expansion for function synthesis, Decoders with active-low enable, Priority Encoders, 2-bit Magnitude Comparators. |
| **Unit 6** | **Latches & Flip-Flops** | **20 MCQs** | SR Latch forbidden states, Clocked SR, JK Flip-Flop race-around condition ($t_p \ge \Delta t$), Master-Slave JK, D & T Flip-Flops, Setup time ($t_s$) & Hold time ($t_h$), Metastability. |
| **Unit 7** | **Registers & Shift Register Counters** | **18 MCQs** | SISO, SIPO, PISO, PIPO timing, Universal Shift Register (74194), Ring Counter ($N$ states, $2^N - N$ unused), Johnson Counter ($2N$ states, $2^N - 2N$ unused, glitch-free decoding). |
| **Unit 8** | **Counters (Asynchronous & Synchronous)** | **20 MCQs** | Ripple Counters (trigger rules: Neg-edge + Q = UP), MOD-N counters with active-low clear, Decade (BCD) counter, Synchronous counter design with excitation tables, Lockout condition. |
| **Unit 9** | **Finite State Machines & Sequence Detectors** | **16 MCQs** | Mealy (state + input) vs Moore (state only), State tables & diagrams, Overlapping vs Non-overlapping sequence detectors, State reduction, One-Hot encoding, ASM charts. |
| **Unit 10** | **Digital Logic Families & IC Characteristics** | **18 MCQs** | Fan-in, Fan-out, Propagation delay, Speed-Power Product (pJ), Noise margins ($NM_H, NM_L$), Totem pole vs Open collector TTL, ECL (fastest bipolar), CMOS (lowest static power). |
| **Unit 11** | **Semiconductor Memories & PLDs** | **18 MCQs** | SRAM (6T, cache) vs DRAM (1T-1C, refresh), ROM (PROM, EPROM UV quartz, EEPROM, Flash), Chip capacity calculations, PLDs: PROM (Fixed AND, Prog OR), PAL (Prog AND, Fixed OR), PLA (Prog AND & OR). |
| **Unit 12** | **D/A and A/D Data Converters** | **18 MCQs** | Weighted Resistor vs R-2R Ladder DAC, Resolution ($V_{ref}/(2^N-1)$), Flash ADC (fastest, $2^N-1$ comparators), SAR ADC ($N$ clock cycles), Dual-Slope ADC (highest accuracy/noise rejection). |
| **TOTAL** | **Full Digital Fundamentals Syllabus** | **220 MCQs** | **100% Complete CUET PG Exam Coverage** |

---

## 🚀 How to Run Locally

### Method 1: Instant Local Execution (Zero-CORS Double Click)
Because all questions are bundled into `data/questions.js` (`window.CUET_DF_DATA`), you do **NOT** need any web server:
1. Navigate into the `quiz-app/` folder.
2. Double-click `index.html` to open it in your browser (`file:///.../quiz-app/index.html`).
3. The platform will run with 100% functionality (sound, storage, question palette, analytics).

### Method 2: Local Development Server (Node.js)
```bash
cd quiz-app
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Method 3: Python HTTP Server
```bash
cd quiz-app
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Deploy to Netlify / GitHub Pages

### Deploying to Netlify:
1. Connect your GitHub repository to [Netlify](https://www.netlify.com/).
2. Set **Publish directory** to `quiz-app` (or repository root if deployed as standalone repo).
3. The included `netlify.toml` file will automatically configure cache headers, security options, and single-page routing redirects.
4. Deploy! Zero build steps required.

### Deploying to GitHub Pages:
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Choose your branch and select `/quiz-app` (or root) folder.
5. Click **Save**.

---

## 📁 File Structure

```text
quiz-app/
├── index.html        # Clean semantic 3-screen layout + palette drawer & modals
├── css/
│   └── style.css     # SAMARTH modern design system (dark/light theme tokens)
├── js/
│   ├── audio.js      # Native Web Audio API procedural synthesizer
│   ├── storage.js    # LocalStorage auto-save & session persistence
│   ├── quiz-engine.js# Fisher-Yates double randomization & analytics engine
│   └── app.js        # Main UI event controller & keyboard navigation
├── data/
│   └── questions.js  # window.CUET_DF_DATA data bundle (zero-CORS)
├── questions.json    # Standard JSON export
├── server.js         # Zero-dependency local dev server
├── netlify.toml      # Netlify deployment configuration & cache headers
└── README.md         # Documentation & GitHub/Netlify deployment guide
```

---

## 🎯 Target Examination & Scoring Scheme
- **Target Exams**: CUET PG Computer Science (SCQP09), NIMCET, DU MCA, BHU MCA, JNU MCA, Pune University.
- **Marking Scheme**:
  - **Correct Choice**: +4 Marks
  - **Incorrect Choice**: -1 Mark (25% Negative Marking Penalty)
  - **Unattempted**: 0 Marks
