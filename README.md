# Digital Fundamentals Interactive Quiz Arena (CUET PG CS & MCA)

[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-emerald.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Netlify Status](https://img.shields.io/badge/Deploy-Netlify%20Ready-00c7b7.svg)](https://www.netlify.com/)
[![Exam Syllabus](https://img.shields.io/badge/Syllabus-CUET%20PG%20SCQP09%20%2F%20MCA-indigo.svg)](https://cuet.nta.nic.in/)
[![Total Questions](https://img.shields.io/badge/MCQs-220%20Advanced%20Questions-amber.svg)](#syllabus--12-unit-coverage)

A production-ready, responsive, zero-dependency interactive quiz and practice platform for **Digital Fundamentals / Digital Logic & Electronics**, tailored specifically for **CUET PG Computer Science (SCQP09)**, **MCA**, and **NIMCET** entrance examinations.

Modeled on the distraction-free NTA testing interface with immediate feedback, detailed step-by-step Hinglish solutions, and exam trap alerts.

---

## Key Features

- **220 High-Yield MCQs Across 12 Units:** Comprehensive coverage of binary arithmetic, Boolean algebra, K-Maps, adders, data routing (MUX/DEMUX), flip-flops, registers, counters, FSMs, logic families, semiconductor memories, and ADC/DAC converters.
- **Distraction-Free 3-Screen Architecture:**
  1. **Setup Dashboard:** Choose specific units or test all 12 units simultaneously; pick question counts (10, 25, 50, 100, or all 220).
  2. **Quiz Arena:** Real-time timer, live score tracker, keyboard navigation, question palette drawer, and flagging capability.
  3. **Results & In-Depth Review:** Interactive accuracy ring, unit-by-unit syllabus breakdown bar charts, and filterable review cards (All, Mistakes, Skipped, Correct).
- **Pedagogical Depth:** Every single question includes a **Step-by-Step Hinglish Solution** with numerical dry runs and a dedicated **⚠️ CUET PG Exam Trap & Shortcut Alert**.
- **Double Fisher-Yates Randomization:** Questions and option order (A, B, C, D) are shuffled independently to eliminate all positional memory bias.
- **Zero-CORS & Offline-First:** Fully functional by double-clicking `index.html` via `file:///` without any web server or CORS errors.
- **Native Web Audio API Synthesizer:** Procedural chime audio without external audio files.

---

## Syllabus & 12-Unit Coverage

| Unit | Syllabus Module Name | Questions | High-Yield Topics & Numericals |
| :---: | :--- | :---: | :--- |
| **Unit 1** | **Number Systems & Binary Arithmetic** | 18 | Radix conversions, 1's & 2's Complement arithmetic, Overflow detection ($V = C_n \oplus C_{n-1}$), BCD, Gray code, Excess-3, Hamming code, IEEE 754 float. |
| **Unit 2** | **Boolean Algebra & Logic Gates** | 18 | Universal gates (NAND/NOR minimization), XOR/XNOR properties, De Morgan's Laws, Consensus theorem, Duality, SOP/POS standard forms, Minterms & Maxterms. |
| **Unit 3** | **K-Map Minimization & Logic Hazards** | 18 | 2, 3, and 4-variable K-Maps, Prime Implicants (PI) vs Essential Prime Implicants (EPI), Don't Care conditions, Static-0, Static-1, and Dynamic hazards. |
| **Unit 4** | **Combinational Arithmetic Circuits** | 18 | Half Adder & Full Adder, Ripple Carry delay ($N \times t_{pd}$), Carry Look-Ahead (CLA) generator & propagator, BCD Adder (0110 correction). |
| **Unit 5** | **Data Routing Circuits (MUX, DEMUX, Encoders, Decoders)** | 20 | Multiplexers (2:1 to 32:1), Boolean function realization via Shannon's expansion, Decoders (active-low enable), Priority Encoders, Comparators. |
| **Unit 6** | **Latches & Flip-Flops (Bistable Multivibrators)** | 20 | SR Latch forbidden state, JK race-around condition ($t_p \ge T$), Master-Slave JK, D & T Flip-Flops, Setup time ($t_s$) & Hold time ($t_h$), Excitation tables. |
| **Unit 7** | **Registers & Shift Register Counters** | 18 | SISO, SIPO, PISO, PIPO modes, Universal Shift Register 74194, Ring Counter (MOD-$N$), Johnson / Twisted Ring Counter (MOD-$2N$). |
| **Unit 8** | **Counters (Asynchronous & Synchronous)** | 20 | Ripple Counters (propagation delay $N \cdot t_{pd}$, glitching, Up/Down clock trigger rules), Modulo-$N$ counters, Lockout condition & self-recovery. |
| **Unit 9** | **Finite State Machines (FSM) & Sequence Detectors** | 16 | Mealy Machine vs Moore Machine, State tables & diagrams, Overlapping vs Non-overlapping sequence detectors, One-Hot Encoding, ASM charts. |
| **Unit 10** | **Digital Logic Families & IC Characteristics** | 18 | Fan-in, Fan-out, Propagation delay, Noise margins ($NM_H, NM_L$), Speed-Power Product, TTL (Totem pole, Open collector, Tri-state), ECL, CMOS. |
| **Unit 11** | **Semiconductor Memories & PLDs** | 18 | SRAM vs DRAM refresh cycles, ROM (PROM, EPROM UV, EEPROM, Flash), Memory capacity expansion ($M \times N$ chips), PLD architectures (PROM, PAL, PLA, FPGA). |
| **Unit 12** | **Data Converters (ADC & DAC) & Interfacing** | 18 | Binary-weighted DAC vs R-2R ladder, Resolution ($V_{LSB}$), Flash ADC, SAR ADC, Dual-Slope ADC, Quantization error ($\pm \frac{1}{2} LSB$), Nyquist rate ($f_s \ge 2 f_{max}$). |

---

## How to Run Locally

### Option 1: Instant Offline Browser Access (Zero Setup)
Simply double-click `index.html` or open it directly in any browser:
```text
file:///path/to/DIGITAL%20FUNDAMANTAL/index.html
```

### Option 2: Local Node.js Development Server
```bash
# Start the lightweight built-in HTTP server
npm start
```
Then visit:
```text
http://localhost:3000
```

---

## Keyboard Shortcuts in Quiz Arena

| Key | Action |
| :---: | :--- |
| `1` / `2` / `3` / `4` or `A` / `B` / `C` / `D` | Select Option A, B, C, or D |
| `N` / `Enter` / `→` | Next Question |
| `P` / `←` | Previous Question |
| `S` | Skip Question |
| `F` | Toggle Bookmark / Flag |
| `Esc` | Close Question Palette Drawer / Restart Modal |

---

## Deployment Instructions

### Deploy to GitHub
```bash
git init
git add .
git commit -m "Initial commit: CUET PG Digital Fundamentals Interactive Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

### Deploy to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and choose your repository.
4. Deployment settings:
   - **Publish directory:** `.` *(Root)*
   - **Build command:** *(Leave blank - zero build steps required)*
5. Click **"Deploy site"**. Your platform will be live instantly!

---

## License
MIT License. Created for CUET PG CS / MCA aspirants.
