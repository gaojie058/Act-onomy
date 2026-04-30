# Action Codebook Reference

This codebook defines the action taxonomy used to annotate agent trajectories. Each codebook tag has three levels: **Group** › **Subgroup** › **Leaf action**. When annotating a thought, ground each label to a specific quoted phrase from the verbatim thought text.

This file is the **operational mirror** of the canonical `codebook.md` at the repository root (paper v1.0, 11 top-level groups). It carries the additional palette metadata and the empirically-extra leaves accumulated during real annotation runs that the paper appendix does not enumerate. The two files are kept in sync: any change to the canonical codebook should be reflected here, and any new leaf added during annotation should be promoted into the canonical codebook before the next versioned release.

The codebook is **non-exhaustive** — when a phrase clearly fits a group's spirit but no listed leaf matches, you may write a new leaf label that follows the same naming style ("verb-phrase capturing the cognitive move").

---

## Group palette (used for colour mapping in the rendered artifact)

| Group | Hex | Semantic core |
|---|---|---|
| Reasoning   | `#5b4a8a` (purple)        | Internal cognition: analysing, diagnosing, comparing, inferring, ranking, filtering, decomposing, synthesizing |
| Generating  | `#c08030` (amber)         | Producing new artifacts *de novo*: requirements, candidate moves, initial codes |
| Executing   | `#2d5a3d` (green)         | Externalised action: running commands, applying patches, terminating |
| Evaluating  | `#1a5878` (blue)          | Checking outputs against criteria, metrics, gold, goals |
| Reflecting  | `#b8451a` (orange)        | Detecting and recovering from failures, in-episode error correction |
| Learning    | `#8a3a4a` (wine)          | Persistent change to policy, prompts, code, weights, or knowledge |
| Retrieval   | `#6b5b3a` (olive)         | Pulling info from environment, docs, knowledge, errors, memory |
| Grounding   | `#8a4a6a` (mauve)         | Interacting with users, physical world, digital interfaces, peer agents |
| Planning    | `#2d4a6a` (navy)          | Decomposing tasks, formulating workflows, selecting strategies |
| Memory      | `#6a5a3a` (warm grey)     | Storing, reading, discarding, converting working/episodic/semantic memory |
| Deciding    | `#4a4a5a` (slate)         | Picking among options, accepting/rejecting, generating multiple candidates |

The group keys above are the exact strings the renderer consumes (no spaces, no hyphens). They are also the display names; the template no longer rewrites any of them.

---

## Group: Reasoning

Internal cognition. Most thoughts contain at least one Reasoning tag.

### Subgroup: Distilling
- **Summarize recent observations and trajectories** — condensing flood of info into key takeaways
- **Distill insights from retrieved information** — binary-score-with-explanation style

### Subgroup: Inferring
- **Infer hidden state from observable evidence** — e.g., damage calc reveals stat distribution
- **Infer causal relationship** — determine plausible event/factor accounting for variability
- **Infer dataflow / control flow** — trace how data moves through code
- **Predict patch effect** — anticipate what an edit will change
- **Form precursor hypothesis about cause** — early-stage causal guess
- **Conclude success from evidence** — wrap up an investigation

### Subgroup: Decomposing
- **Decompose into atomic knowledge units** — break a description into atomic pieces
- **Plan deeper inspection before edit** — split "fix" into "investigate then patch"

### Subgroup: Analysing
- **Apply Analogical Reasoning** — solutions by analogy to other projects
- **Analyze codebase structure and behavior** — frontend framework, components
- **Analyse source code** — read source to understand logic
- **Detect trend in data** — patterns/directions/changes over time
- **Understanding intent** — clarify what the user is asking for

### Subgroup: Diagnosing
- **Diagnose Error Cause** — examine error and propose what went wrong
- **Initial diagnostic framing** — first-pass framing of where the bug lives
- **Pinpoint root cause mechanism** — late-stage, mechanism-level diagnosis

### Subgroup: Comparing
- **Compare QoR before/after to link directive to hardware** — compare metric across configurations
- **Count and compare values** — quantify and compare across sources
- **Match observation against spec** — verify observed behaviour matches description

### Subgroup: Ranking
- **Rank items by criteria** — order by importance/match-count/score

### Subgroup: Contextualizing
- **Provide context for subsequent LLM calls** — package reasoning as background

### Subgroup: Synthesizing
- **Combine info to coherent solution** — fuse multiple sources into a single output
- **Correlate variables across sources** — measure relationships

### Subgroup: Filtering
- **Filter information by threshold** — selecting relevant info by criteria/quality

### Subgroup: Aggregating
- **Aggregate multiple candidate outputs** — combine tool predictions
- **Representative value from multi-source data** — summarise numerical data

---

## Group: Generating

Producing new artifacts *de novo*. Distinct from Reasoning, which transforms information already present.

### Subgroup: Generate
- **Generate initial codes** — drafting code, scripts, or text content
- **Propose action candidates** — brainstorming possible next moves
- **Generate requirements** — auto-generating user-facing requirements

---

## Group: Executing

Externalised action. Almost every turn has an Executing tag because the agent must produce an action.

### Subgroup: Executing strategy
- **Initiate planned action** — first-time launch of a plan step
- **Apply patch via edit** — running an `edit` command
- **Run verification command** — running `python`, `pytest`, etc., to verify
- **Insertion agent executes HLS-C optimization** (domain-specific example)

### Subgroup: Terminating
- **Terminate rollout with submission** — `submit` command
- **Terminate rollout with answer tags** — wrap answer in `<answer>...</answer>`

### Subgroup: Execute debugging
- **Strict-instruction debugging implementation**

### Subgroup: Generate Refusal Response
- **Character-consistent refusal with explanation**

### Subgroup: Executing with anonymity
- **Mask algorithm IDs with generic labels**

---

## Group: Evaluating

Checking outputs against criteria.

### Subgroup: Evaluating with metrics
- **Halve parallelism if utilization exceeds budget**
- **Reproducibility score 1–4**
- **Trustworthiness scores**
- **Score Repair Candidates**

### Subgroup: Evaluating with gold
- **Compare against expected** — predict expected outcome before action
- **Confirm actual ≠ expected** — bug reproduction succeeded
- **Confirm actual == expected** — fix verified
- **Plan verification step** — articulate what verification will look like
- **Review code against expected output**
- **HLSFixer retest vs golden results**
- **Gold Checker: equivalence/completeness/correctness**

### Subgroup: Evaluating with heuristics
- **Verify intermediate results** — domain-expert agent verification
- **Quality control before normalization**
- **Recognize Knowledge Boundary** — identify queries outside role scope
- **Verify output accuracy via consistency check**
- **LLM-as-judge / heuristics**

### Subgroup: Evaluating with goals
- **Combine subtasks to meet user requirements**
- **Independent goal-completion check**
- **Detect query-role conflict**
- **QoR-aware reasoning aligns with hardware**

### Subgroup: Evaluating query
- **Acknowledge False Information** — surface false premises in the user's query

---

## Group: Reflecting

Detecting and recovering from failures within an episode. Steers subsequent steps without changing the agent's policy persistently — see Learning for that.

### Subgroup: Reflecting on failures (overall goal)
- **Analyze stuck/failed state vs ground truth**
- **Debug Test Logic from failure log**
- **Align Requirements to validated tests**
- **Wrong conclusion despite correct info**

### Subgroup: Reflecting from in-episode error (in execution)
- **Detect failed action** — recognise that prior command did not produce expected output
- **Navigation error recovery** — failed to locate / access the correct source
- **Synthesis error recovery** — wrong conclusion despite correct info
- **Executor self-corrects on execution error**

### Subgroup: Reflecting with external feedback
- **Adjust action parameters based on feedback** — update params from exception/lint info
- **Revise output based on evaluator feedback** — iterative refinement
- **Detect prior fix did not work** — issue persists after a remediation attempt
- **Incorporate feedback from another agent**
- **Correct reasoning direction mid-trajectory**

### Subgroup: Reflecting through iteration
- **Refine outcome over multiple rounds (self-reflective)**
- **Refine Directive Strategy Iteratively**
- **Iterate toward a quality threshold**

### Subgroup: Reflecting from memory
- **Learn from mistakes in working memory**

### Subgroup: Reflect through self-monitoring
- **Self-monitoring** — explicit reasoning before issuing commands

---

## Group: Learning

Persistently changes the agent's policy, prompts, code, weights, or knowledge so future behaviour differs. Distinct from Reflecting, which steers within an episode and leaves no permanent trace.

### Subgroup: Learning decision-making
- **From random pick to scored selection** — improve the decision process itself

### Subgroup: Learning reasoning
- **Utilize subtask-specific LLMs** — specialise smaller models per subtask
- **Update reasoning via prompt update** — rewrite the agent's own prompt template

### Subgroup: Learning grounding
- **Update grounding via code-based skills** — improve code that interacts with the outside world

### Subgroup: Learning knowledge
- **Update the source code as procedural memory** — self-patch the agent's source
- **Update semantic memory with knowledge** — integrate a new error type into the repository

### Subgroup: Learning LLM parameters
- **Update parametric policy** — train weights for similar tasks
- **Update LLM parameters via SL/RL/RLHF** — supervised, RL, or human-feedback updates

### Subgroup: Learning retrieval skills
- **Update retrieval procedures** — better keyword strategies, smarter ranking

### Subgroup: Learning instructions
- **Infer instructions from input–output examples** — extract rule from i/o examples

### Subgroup: Self-improving
- **Generate-then-train on best outputs** — sample, pick best, train on those
- **Self-correct step implementation** — modify step implementation based on error message

---

## Group: Retrieval

Pulling info from environment, docs, knowledge, errors, memory.

### Subgroup: Retrieve events
- **Retrieve events from episodic memory**
- **Retrieve Analogical Examples**

### Subgroup: Retrieve skills
- **Load skills from the skill library**

### Subgroup: Retrieve documents
- **Extract data from structured documents** — read 1–15 docs/tables, search results, file viewer output
- **Leverage documents for code generation**

### Subgroup: Retrieve knowledge
- **Retrieve knowledge from semantic memory** — general facts
- **Read code semantics from open file** — understand a function/class from its body

### Subgroup: Retrieve errors
- **Query Error Repository**

### Subgroup: Retrieve Domain Context
- **Retrieve HLS-related context** (or any domain-specific doc retrieval)

---

## Group: Grounding

Interacting with users, physical world, digital interfaces, peer agents.

### Subgroup: Interact with users
- **Accept instructions from humans**
- **Ask for clarification from people**
- **Inform user of task outcome**
- **Visualize results for human consumption**
- **Format structured output for verification**
- **Entertain people** — casual chat / role-play / emotional support

### Subgroup: Interact with physical environments
- **Affect physical environments via robotic planners**
- **Process perceptual inputs into textual observations**

### Subgroup: Interact with digital environments
- **Navigate and interact with web interfaces**
- **Invoke structured API or data endpoint** — calling a tool like `open`, `edit`, `goto`
- **Invoke visual inspection tool** — zoom-in, focus
- **Annotate UI Components**

### Subgroup: Interact with other agents
- **Conduct multi-agent debate**
- **Solve tasks collaboratively across agents**
- **Communicate with peer agents**
- **Communicate via Structured Dialogue**

### Subgroup: Augmenting
- **Augment external knowledge** — generate via RAG
- **Augment external computation** — execute code, calculator, heavy compute

---

## Group: Planning

Decomposing tasks, formulating workflows, selecting strategies.

### Subgroup: Decompose a task into subtasks
- **Subgoal with executable success-condition** — pair each subgoal with a verifiable check
- **Plans with sub-steps for navigation**
- **Phase transition: reproduce → localize** — explicit phase shift in agent workflow
- **Decompose Task into Subproblems**
- **Diverse roles for complex task decomposition**
- **Planner-Executor-Evaluator decomposition**

### Subgroup: Formulate a workflow from task structure
- **Comprehensive analysis workflow**
- **Multi-step web navigation plan**
- **Plan Code Structure: HTML/CSS/JS**

### Subgroup: Select Directive Strategy
- **HLS directive combinations on loops/arrays** (domain-specific)

---

## Group: Memory

Storing, reading, discarding working/episodic/semantic memory.

### Subgroup: Store Information
- **Store information in working memory** — scratchpad
- **Store episodic trajectories** — record full action sequences
- **Store knowledge in semantic memory** — save general facts
- **Store experiences in episodic memory**

### Subgroup: Discard information
- **Discard information from working memory** — discard repro file, temp script

### Subgroup: Convert memory
- **Consolidate working memory into long-term memory**

### Subgroup: Read memory
- **Read from working memory** — refer back to issue text, prior tool output, current view state
- **Track current view state** — file viewer position, cursor

---

## Group: Deciding

Picking among options, accepting/rejecting, generating multiple candidates.

### Subgroup: Make a decision
- **Pick alternative strategy** — switch approach after one fails
- **Decision according to memory** — condition decision on history buffer

### Subgroup: Pick scores
- **argmax / softmax / majority vote**

### Subgroup: Decide accept or not
- **Decide accept** — accept submitted output as final
- **Decline out-of-scope queries**

### Subgroup: Generate multiple candidates
- **Multifaceted debugging instruction generation**
- **Running multiple candidate pipelines**

### Subgroup: Decide multiple states
- **Fork generative state at uncertainty point**

---

## Annotation guidelines

**Granularity rule of thumb**: aim for **2–5 quote-level annotations per thought**. Some short procedural turns may have only 1; richly reasoned turns may have 5+. Don't pad — only mark phrases that genuinely carry distinct cognitive moves.

**Quote selection**:
- Quotes must be **verbatim substrings** of the thought text (case-sensitive). The renderer matches by `String.indexOf`.
- Prefer **short, semantically dense phrases** (3–15 words) over full sentences.
- Quotes must not overlap. If two cognitive moves are expressed in the same phrase, pick the more dominant one or split the phrase.

**Tag selection**:
- One quote → exactly one `(group, subgroup, leaf)` triple.
- Choose the **most specific** leaf you can. If you genuinely can't find a fit, write a new leaf in the same naming style and note it in the annotation summary so the user can review.
- Avoid tagging boilerplate ("Now let's", "Next, we should") unless the boilerplate itself is the action (e.g., "Let's start by creating..." may anchor an Executing tag).

**Common patterns to watch for**:
- A thought that starts with phase transition ("The next step is to...") usually has a Planning tag.
- A thought that contains an error reflection ("This did not work...") usually has a Reflecting tag.
- A thought that proposes a code change ("We can do this by...") usually has a Generating tag (new artifact) or Reasoning tag (transformation of existing info).
- The actual command-issuing clause ("Let's run pylint...", "Let's edit...") often anchors an Executing tag.
- A thought that updates the agent's prompt, weights, or saved knowledge ("we'll add this to the skill library") anchors a Learning tag — distinct from Reflecting, which only steers the current episode.
