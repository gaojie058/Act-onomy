# AgentAction Codebook

**Version: v1.0** — initial release accompanying the NeurIPS 2026 submission.

This is the canonical, machine-readable codebook consumed by the AgentAction Skill. It mirrors the snapshot reproduced in the paper's appendix; the paper version and this file are intended to be 1:1.

The codebook has **three levels**:

1. **Action** (top-level) — one of 11 functional categories of agent behavior.
2. **Sub-action** — a coarse functional grouping within a category (e.g., *Distilling*, *Inferring*, *Diagnosing* under **Reasoning**).
3. **Specialization** — a fine-grained code that names a specific way the sub-action is realized in practice. Each specialization is illustrated by a representative example or a quoted instance from a paper in our corpus (paper IDs in parentheses, e.g., P1, P2).

For category boundaries (Grounding vs. Executing, Retrieval vs. Memory, Generating vs. Reasoning, Planning vs. Reasoning, Evaluating vs. Deciding, Reflecting vs. Learning), see §3.1 of the paper.

---

## 1. Grounding

> Connect the agent to users, physical/digital environments, or peer agents through input or output channels.

### 1.1 Interact with users

| Specialization | Example & Quote |
|---|---|
| Accept instructions from humans | Receive a task or command from a human user (e.g., "book me a flight" or "translate this paragraph"). |
| Ask for clarification from people | Proactively ask the human when the request is unclear (e.g., "Which file did you mean?"). |
| Inform user of task outcome | Agent informs the user of the result, e.g., "Buy a nice rich navy bathing dress" (P3); WiFi-off notification example (P3). |
| Visualize results for human consumption | "CellAgent generated differential expression and marker gene visualizations, enabling intuitive interpretation of cluster identities" (P1). |
| Format structured output for verification | "generate outputs in a JSON format (or lists of JSON objects)" (P2). |
| Entertain people | Casual chat / role-play / emotional support (chat casually, tell jokes, do role-play). |

### 1.2 Interact with physical environments

| Specialization | Example & Quote |
|---|---|
| Affect physical environments via robotic planners | Send language commands to a robot arm to move things in the real world. |
| Process perceptual inputs into textual observations | Convert images/sensor/audio readings to text via VLMs so a text-based LLM can consume them. |

### 1.3 Interact with digital environments

| Specialization | Example & Quote |
|---|---|
| Navigate and interact with web interfaces | "navigate multiple websites, extract information from both structured and unstructured sources" (P2). |
| Invoke structured API or data endpoint | "Game Control: `get_game_state`, `press_buttons`, and `navigate_to` for direct game control" (P25). |
| Invoke visual inspection tool | "proactively invokes the Zoom-in tool for a targeted examination of the specific region of interest" (P4). |
| Annotate UI components | "`annotate_interactive_components(file, strategy='add data-testid')`" (P28). |

### 1.4 Interact with other agents

| Specialization | Example & Quote |
|---|---|
| Conduct multi-agent debate | Multiple agents argue different sides toward a better answer. |
| Solve tasks collaboratively across agents | "A central orchestrator maintains a high-level route plan while dynamically dispatching sub-agents based on game context" (P25); evaluator provides natural-language feedback (P1); decompose development roles (P28). |
| Communicate via structured dialogue | "LLM-driven agents communicate via structured chat chains across design, coding, and testing phases" (P28). |

### 1.5 Augmenting

| Specialization | Example & Quote |
|---|---|
| Augment external knowledge | "LLM which generates buggy code by integrating retrieved error slices from BugRAG as context" (P29). |
| Augment external computation | Execute code (test runner detects logic inconsistencies, P28); use calculator/heavy compute tools to handle math beyond the LLM. |

---

## 2. Planning

> Lay out the structure of future work as subtasks, workflows, or strategy choices before execution.

### 2.1 Decompose a task into subtasks

| Specialization | Example & Quote |
|---|---|
| Planner–Executor–Evaluator decomposition | "Decomposes complex user requests into manageable subtasks, an Executor that carries out the analysis by generating and running code, and an Evaluator that assesses the quality of the results" (P1). |
| Plans with sub-steps for navigation | "formulate plans, decompose problems into sub-steps" (P2). |
| Subgoal with executable success-condition | "LLM decomposes the task into a sequence of subgoals, each paired with an executable success-condition function" (P25). |
| Diverse roles for complex task decomposition | "assigns diverse roles to multiple agents to efficiently decompose complex tasks" (P28). |
| Decompose task into subproblems | "Create JavaScript functionality handling empty display and consecutive operator clicks" (P28). |

### 2.2 Formulate a workflow from task structure

| Specialization | Example & Quote |
|---|---|
| Comprehensive analysis workflow | "the Planner accurately interprets user intent and formulates a comprehensive analysis workflow" (P1). |
| Multi-step web navigation plan | "planning to navigate the web; tasks require navigation through an average of 4.2 web pages" (P2). |
| HLSTuner directive insertion plan | "HLSTuner formulates a detailed plan that specifies: (1) the combination of HLS directives, (2) target code segments, and (3) the insertion actions" (P29). |
| Plan code structure: HTML/CSS/JS | "Planning: HTML Structure, CSS Styling, JavaScript Functionality" (P28). |

### 2.3 Select directive strategy

| Specialization | Example & Quote |
|---|---|
| HLS directive combinations on loops/arrays | "selects effective HLS directive combination strategies and inserts directives within the specific structure (e.g., loops and arrays)" (P29). |

---

## 3. Reasoning

> Manipulate existing information via inference, decomposition, comparison, synthesis, or filtering to derive new conclusions.

### 3.1 Distilling

| Specialization | Example & Quote |
|---|---|
| Summarize recent observations and trajectories | Condense a flood of information into key takeaways. |
| Distill insights from retrieved information | "For every binary score $z^{(q)}_{i,j}$ from the judge, there is a corresponding explanation $e^{(q)}_{i,j}$" (P3). |

### 3.2 Inferring

| Specialization | Example & Quote |
|---|---|
| Infer hidden state from observable evidence | "intelligently infers hidden information through game mechanics: damage calculations reveal stat distributions, move priority ordering constrains speed ranges" (P25). |
| Infer causal relationship | "determine the most plausible event or factor accounting for this variability" (P2). |

### 3.3 Decomposing

| Specialization | Example & Quote |
|---|---|
| Decompose into atomic knowledge units | "break down the given character description into multiple atomic pieces of knowledge" (P22). |

### 3.4 Analysing

| Specialization | Example & Quote |
|---|---|
| Apply analogical reasoning | "generates solutions based on analogies to unrelated projects, which resemble few-shot prompting" (P28). |
| Analyze codebase structure and behavior | "Analyze frontend framework and interactive components" (P28). |
| Detect trend in data | "Identifying patterns, directions, or changes in data over time or across contexts" (P2). |
| Analyse source code | "analyzes the project's core functionalities and their interactions with UI elements by reading the source code" (P28). |
| Understand intent | "demonstrate clear intent understanding, partial progress" (P5). |

### 3.5 Diagnosing

| Specialization | Example & Quote |
|---|---|
| Diagnose error cause | "The analysis LLM then examines the error causes and provides debugging instructions" (P29). |

### 3.6 Comparing

| Specialization | Example & Quote |
|---|---|
| Compare QoR before/after to link directive to hardware | "Applying UNROLL increases parallelism, which reduces total execution time but requires more logic resources to instantiate parallel hardware units" (P29). |
| Count and compare values | "Quantifying occurrences and comparing values across sources or categories" (P2). |

### 3.7 Ranking

| Specialization | Example & Quote |
|---|---|
| Rank items by criteria | "Ordering items or facts based on specific criteria or importance" (P2). |

### 3.8 Contextualizing

| Specialization | Example & Quote |
|---|---|
| Provide context for subsequent LLM calls | Package the reasoning so far as background for the next LLM call. |

### 3.9 Synthesizing

| Specialization | Example & Quote |
|---|---|
| Combine info to coherent solution | "combine information from multiple sources… to produce a coherent solution" (P2). |
| Correlate variables across sources | "Measuring relationships or associations between two or more variables" (P2). |

### 3.10 Filtering

| Specialization | Example & Quote |
|---|---|
| Filter information by threshold | "Selecting relevant information based on criteria, quality, or thresholds" (P2). |

### 3.11 Aggregating

| Specialization | Example & Quote |
|---|---|
| Aggregate multiple candidate outputs | "aggregates prediction results from multiple tools to generate the final cell type labels" (P1). |
| Representative value from multi-source data | "Determining a representative value that summarises numerical data collected from multiple sources" (P2). |

---

## 4. Retrieval

> Pull external content (events, skills, documents, knowledge, errors, domain context) into the agent's working context.

### 4.1 Retrieve events

| Specialization | Example & Quote |
|---|---|
| Retrieve events from episodic memory | "Persistent memory system storing discoveries (locations, NPCs, items, strategies) with importance-weighted retrieval" (P25). |
| Retrieve analogical examples | "Recall three (03) relevant and distinct problems (different from the user task)" (P28). |

### 4.2 Retrieve skills

| Specialization | Example & Quote |
|---|---|
| Load skills from the skill library | Grab a pre-built skill snippet (e.g., Minecraft "chop tree") from a library of ready-made code. |

### 4.3 Retrieve documents

| Specialization | Example & Quote |
|---|---|
| Extract data from structured and unstructured documents | "diverse filetype reading; read between 1 to 15 documents and/or tables" (P2). |
| Leverage documents for code generation | Look up API docs and tutorials and reference them while writing code. |

### 4.4 Retrieve knowledge

| Specialization | Example & Quote |
|---|---|
| Retrieve knowledge from semantic memory | Look up general facts (e.g., the meaning of HTTP 404) from a knowledge base. |

### 4.5 Retrieve errors

| Specialization | Example & Quote |
|---|---|
| Query error repository | "queries BugRAG to check for existing entries" (P29). |

### 4.6 Retrieve domain context

| Specialization | Example & Quote |
|---|---|
| Retrieve HLS-related context | "LLM leverages retrieved HLS-related context to transform input C algorithms or natural language descriptions" (P29). |

---

## 5. Memory

> Read, write, discard, or transform information across working, episodic, and semantic memory stores.

### 5.1 Store information

| Specialization | Example & Quote |
|---|---|
| Store information in working memory | A scratchpad / quick-access buffer that holds recent inputs and intermediate results. |
| Store episodic trajectories | Record full action sequences (start to finish) for later training or review. |
| Store knowledge in semantic memory | Save general world facts not tied to any specific event. |
| Store experiences in episodic memory | Save past events as personal-diary-like episodes (e.g., which game was won, which plan failed). |

### 5.2 Discard information

| Specialization | Example & Quote |
|---|---|
| Discard information from working memory | "the local memory is discarded upon successful completion of the subtask" (P1). |

### 5.3 Convert memory

| Specialization | Example & Quote |
|---|---|
| Consolidate working memory into long-term memory | Discard-after-use strategy that retains only the clear and successful analysis path, preventing trial-and-error interference (P1). |

### 5.4 Read memory

| Specialization | Example & Quote |
|---|---|
| Read from working memory | Check the scratchpad: grab stored intermediate results and state. |

---

## 6. Generating

> Produce new artifacts *de novo*, such as requirements, candidate moves, or initial codes.

### 6.1 Generate

| Specialization | Example & Quote |
|---|---|
| Generate requirements | "automatically generates candidate user-facing requirements based on this analysis" (P28). |
| Propose action candidates | Brainstorm one or more possible next moves. |
| Generate initial codes | "Each agent then emits a set of initial codes; cluster semantically similar codes and generate preliminary themes" (P27). |

---

## 7. Evaluating

> Assign quality, correctness, or goal-completion judgments using metrics, gold references, heuristics, or goals.

### 7.1 Evaluating with metrics

| Specialization | Example & Quote |
|---|---|
| Halve parallelism if utilization exceeds budget | "HLSTuner analyzes QoR to scale loop parallelism up or down. For example, if hardware utilization exceeds the budget, HLSTuner halves parallelism" (P29). |
| Reproducibility score 1–4 | "In Phase 2, they inspect the provided code for potential inconsistencies; generating a reproducibility score on a scale from 1 to 4" (P11). |
| Trustworthiness scores $s^{(t)}=(C,D,T)$ | "Evaluation Scores: Obtain $s^{(t)}=(C,D,T)$ on the trustworthiness dimensions" (P27). |
| Score repair candidates | "the scoring agent (functioning as the judge) based on clarity, logical soundness, alignment with error messages, this agent selects the optimal suggestion" (P29). |

### 7.2 Evaluating with gold

| Specialization | Example & Quote |
|---|---|
| Review code against golden standard | "we prompt LLM to review the correct HLS-C code, pairing buggy code segments with corresponding error messages to construct debugging CoT" (P29). |
| HLSFixer retest vs. golden results | "HLSFixer retests the corrected HLS design against the golden results to ensure semantic equivalence" (P29). |
| Gold checker: equivalence/completeness/correctness | "The Gold Checker evaluates each annotation on three binary criteria: equivalence, completeness, and correctness, where a score of 1 indicates the criterion is met" (P28). |

### 7.3 Evaluating with heuristics

| Specialization | Example & Quote |
|---|---|
| Reduce trivial-bug generation | "The agent assesses the contextual applicability of potential bugs, reducing the probability that the LLM forcibly generates trivial results" (P29). |
| Verify intermediate results | "agents with domain expertise verify intermediate results and reduce errors" (P28). |
| Quality control before normalization | "codified best-practices, such as the standard order of operations (e.g., quality control must precede normalization)" (P1). |
| Recognize knowledge boundary | "recognize and refuse queries that conflict with their role knowledge" (P22). |
| Verify output accuracy via consistency check | "task an evaluator agent with determining whether each theme is consistent with its supporting quotes" (P27). |
| LLM-as-judge / heuristics | "we use GPT-4o as the default evaluator, each dimension scored on a scale of 0 to 2" (P22). |

### 7.4 Evaluating with goals

| Specialization | Example & Quote |
|---|---|
| Combine subtasks to meet user requirements | "the final results from all subtasks are synthesized to meet the user's requirements" (P1). |
| Independent goal-completion check | "Independently checks whether objectives are truly complete, preventing the orchestrator from advancing when the main agent incorrectly believes a task is finished" (P25). |
| Detect query–role conflict | "violates specific content within the role profile" (P22). |
| QoR-aware reasoning aligns with hardware | "HLSTuner enables QoR-aware reasoning to align optimization goals with hardware constraints" (P29). |

### 7.5 Evaluating query

| Specialization | Example & Quote |
|---|---|
| Acknowledge false information | "Evaluating whether the model recognizes potential errors in the query" (P22). |

---

## 8. Deciding

> Select among candidates, states, or branches once they have been generated and (optionally) scored.

### 8.1 Make a decision

| Specialization | Example & Quote |
|---|---|
| Make a decision according to memory | "The agent conditions its decisions on $I$, the current observation $s_t$, and a history buffer of $n$ past state–action pairs" (P5). |

### 8.2 Pick scores

| Specialization | Example & Quote |
|---|---|
| argmax / softmax / majority vote | argmax = highest score; softmax = probabilistic sample; majority vote across evaluators. |

### 8.3 Decide accept or not

| Specialization | Example & Quote |
|---|---|
| Decline out-of-scope queries | "appropriately reject queries that exceed their knowledge boundaries or conflict with their role settings" (P22). |

### 8.4 Generate multiple candidates

| Specialization | Example & Quote |
|---|---|
| Multifaceted debugging instruction generation | "LLM Group for multifaceted evaluation generates diverse debugging instructions" (P29). |
| Running multiple candidate pipelines | "Running multiple candidate pipelines for each analysis step" (P1). |

### 8.5 Decide multiple states

| Specialization | Example & Quote |
|---|---|
| Fork generative state at uncertainty point | "Fork the current generative state and generate a new parallel trajectory from this point of high uncertainty" (P4). |

---

## 9. Executing

> Carry out a concrete operation that commits the agent to an outward effect or terminates a rollout.

### 9.1 Executing strategy

| Specialization | Example & Quote |
|---|---|
| Insertion agent executes HLS-C optimization | "an insertion agent executes this plan for HLS-C optimization" (P29). |

### 9.2 Terminating

| Specialization | Example & Quote |
|---|---|
| Terminate rollout with answer tags | "produces a final answer and terminates the rollout; enclose it within `<answer></answer>` tags" (P4). |

### 9.3 Execute debugging

| Specialization | Example & Quote |
|---|---|
| Strict-instruction debugging implementation | "Operating under strict instruction adherence, this agent adopts the instructions to implement debugging" (P29). |

### 9.4 Generate refusal response

| Specialization | Example & Quote |
|---|---|
| Character-consistent refusal with explanation | "providing clear refusal responses with appropriate explanations" (P22). |

### 9.5 Executing with anonymity

| Specialization | Example & Quote |
|---|---|
| Mask algorithm IDs with generic labels | "all algorithm identifiers are masked before evaluation… replaced by generic labels" (P1). |

---

## 10. Reflecting

> Inspect prior trajectory, errors, or feedback to diagnose problems and steer subsequent steps within an episode.

### 10.1 Reflecting on failures (overall goal)

| Specialization | Example & Quote |
|---|---|
| Analyze stuck/failed state vs. ground truth | "Analyzes stuck states by comparing current situation against ground truth sources (porymap data, knowledge base) to diagnose navigation failures" (P25). |
| Debug test logic from failure log | "Modify test script based on failure log" (P28). |
| Align requirements to validated tests | "Refine requirement based on validated test cases to ensure alignment" (P28). |
| Wrong conclusion despite correct info | "When the agent reaches an incorrect conclusion despite accessing the correct information, due to flaws in logical reasoning, interpretation, or multi-step analytical processes" (P2). |
| Self-correct step implementation | "Modify step implementation based on error message" (P28). |
| Explicit modification instructions | "This model formulates explicit modification instructions with detailed analysis" (P29). |

### 10.2 Reflecting from in-episode error (in execution)

| Specialization | Example & Quote |
|---|---|
| Navigation error recovery | "Navigation errors — when the agent fails to locate or access the correct source of information" (P2). |
| Synthesis error recovery | "Synthesis Error — when the agent reaches an incorrect conclusion despite accessing the correct information" (P2). |
| Executor self-corrects on execution error | "In case of an execution error $E(c_i)$, the Executor autonomously performs self-correction to produce a valid code version" (P1). |
| Analyse log to formulate error modification actions | "an analysis agent adopts a reasoning-to-instruction method, analyzing the HLS log to formulate error modification actions" (P29). |
| Inspect error pattern in HLS log | "an inspection agent examines the erroneous code and error messages parsed from the HLS tool test results" (P29). |
| Reflect on error fix for reasonableness | "reflects on the code after assuming the fix to ensure the modification is reasonable" (P29). |

### 10.3 Reflecting with external feedback

| Specialization | Example & Quote |
|---|---|
| Adjust action parameters based on feedback | "automatically adjusts parameters using exception information to generate executable code" (P1). |
| Revise output based on evaluator feedback | "feedback from the feedback agent is used to iteratively refine and improve the generated themes" (P27). |
| Simulate grounding feedback internally | Mental rehearsal: imagine "if I do X, what will the environment look like?" without executing. |
| Incorporate feedback from another agent | "the Evaluator agent ALLMe assesses the outcome and provides natural language feedback if it deems revisions are necessary" (P1). |
| Correct reasoning direction mid-trajectory | "allowing the model to update its textual understanding, refine its hypothesis, or even trigger further visual exploration" (P4). |

### 10.4 Reflecting through iteration

| Specialization | Example & Quote |
|---|---|
| Refine outcome over multiple rounds (self-reflective) | "The Evaluator drives a self-reflective optimization mechanism, which leverages automated evaluation methods… to iteratively refine outcomes" (P1). |
| Refine directive strategy iteratively | "When the initial attempt fails… HLSTuner activates an iterative refinement incorporating current directives and the resulting QoR" (P29). |
| Iterative precision enhancement loop | "This self-reflective optimization loop iterates to enhance precision, and the final results from all subtasks are synthesized" (P1). |
| Iterate toward a quality threshold | "the optimization process runs three iterations, each invoking a different algorithm" (P1). |

### 10.5 Reflecting from memory

| Specialization | Example & Quote |
|---|---|
| Learn from mistakes in working memory | "This allows the agent to learn from mistakes in realtime and avoid repeating errors before the local memory is discarded" (P1). |

### 10.6 Reflect through self-monitoring

| Specialization | Example & Quote |
|---|---|
| Self-monitoring | "These steps are labeled as reflective, indicating the model is engaging in self-monitoring or explicit reasoning before issuing commands" (P1). |

---

## 11. Learning

> Persistently change the agent's policy, prompts, code, weights, or knowledge so that future behavior differs.

### 11.1 Learning decision-making

| Specialization | Example & Quote |
|---|---|
| From random pick to scored selection | Improve the decision process itself (e.g., move from random sampling to scored ranking of candidates). |

### 11.2 Learning reasoning

| Specialization | Example & Quote |
|---|---|
| Utilize subtask-specific LLMs | One model for summarization, another for SQL; smaller, specialized models for specific jobs. |
| Update reasoning via prompt update | Rewrite the agent's own prompt template to learn a better way to reason. |

### 11.3 Learning grounding

| Specialization | Example & Quote |
|---|---|
| Update grounding via code-based skills | Improve web-navigation code snippets, i.e., write or improve code that interacts with the outside world. |

### 11.4 Learning knowledge

| Specialization | Example & Quote |
|---|---|
| Update the source code as procedural memory | Self-patch the agent's own source code to change its behavior. |
| Update semantic memory with knowledge | "the inspection agent identifies a new error type and integrates the slice into the error repository with a new mnemonic identifier" (P29). |

### 11.5 Learning LLM parameters

| Specialization | Example & Quote |
|---|---|
| Update parametric policy | Train weights for similar tasks; real learning by changing internal weights. |
| Update LLM parameters via SL/RL/RLHF | Use supervised, reinforcement, or human-feedback learning to adjust model weights. |

### 11.6 Learning retrieval skills

| Specialization | Example & Quote |
|---|---|
| Update retrieval procedures | Better keyword strategies / smarter ranking to improve search and relevance. |

### 11.7 Learning instructions

| Specialization | Example & Quote |
|---|---|
| Infer instructions from input–output examples | Extract the underlying rule from input/output examples for future use. |

### 11.8 Self-improving

| Specialization | Example & Quote |
|---|---|
| Generate-then-train on best outputs | The LLM produces multiple outputs, picks the best, and trains on those, bootstrapping improvement. |
| Self-correct step implementation | "Modify step implementation based on error message" (P28). |
