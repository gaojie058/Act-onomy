# Case Study 1 — Profiling Behavior Across Three Agents

_Formal Skill-Annotation Analysis (Act-onomy v4.2). Generated from `pilot_skill_analysis.ipynb` over 300 auto-annotated trajectories under `results/formal_traces/qualitative/` (2026-05-06)._

The 300 traces cover three agent collections that differ in architecture and task domain — **AG2** (multi-agent math, 100 traces), **HyperAgent** (SWE-bench single-agent, 100 traces), and **SWE-Agent** (multi-repo SWE single-agent, 100 traces).

Per-trace LLM run summaries are split out into [`run_summaries.md`](run_summaries.md).

## Contents

1. Global stats
2. Codebook group distribution
3. Per-dataset comparison (group counts as % of dataset total)
4. Statistical test — chi-square of (group × dataset)
5. Annotation density (quotes per annotated turn)
6. Top 15 leaf actions
7. Per-trace behavior fingerprint (top-3 groups)
8. → Per-trace run summaries: [`run_summaries.md`](run_summaries.md)

## Global stats

| metric | value |
|---|---|
| traces                   | 300 |
| turns w/ quotes          | 4856 |
| quotes total             | 8244 |
| quotes per trace (mean)  | 27.5 |
| turns total / findings total / per-trace min·median·max | _regenerate from notebook over the AG2 + HyperAgent + SWE-Agent subset_ |

## Codebook group distribution

| group | count | % of all quotes |
|---|---:|---:|
| Executing | 1806 | 21.9% |
| Reasoning | 1742 | 21.1% |
| Grounding | 1063 | 12.9% |
| Planning | 1056 | 12.8% |
| Retrieval | 982 | 11.9% |
| Evaluate | 782 | 9.5% |
| Memory | 364 | 4.4% |
| Reflection | 320 | 3.9% |
| Deciding | 121 | 1.5% |
| Learning | 8 | 0.1% |

## Per-dataset comparison (group counts as % of dataset total)

| group | AG2 | HyperAgent | SWE-Agent |
|---|---:|---:|---:|
| Deciding | 28 (2.8%) | 48 (1.1%) | 45 (1.6%) |
| Evaluate | 137 (13.6%) | 385 (8.8%) | 260 (9.1%) |
| Executing | 204 (20.3%) | 756 (17.3%) | 846 (29.5%) |
| Grounding | 184 (18.3%) | 566 (12.9%) | 313 (10.9%) |
| Learning | 0 (0.0%) | 8 (0.2%) | 0 (0.0%) |
| Memory | 41 (4.1%) | 193 (4.4%) | 130 (4.5%) |
| Planning | 148 (14.7%) | 579 (13.2%) | 329 (11.5%) |
| Reasoning | 241 (24.0%) | 1051 (24.0%) | 450 (15.7%) |
| Reflection | 8 (0.8%) | 205 (4.7%) | 107 (3.7%) |
| Retrieval | 15 (1.5%) | 584 (13.3%) | 383 (13.4%) |
| **TOTAL** | **1006 (100%)** | **4375 (100%)** | **2863 (100%)** |

## Statistical test — chi-square of (group × dataset)

**H₀:** dataset and codebook group are independent (same group distribution).

| metric | value |
|---|---|
| N (total quotes) | 8244 |
| contingency shape | 3 datasets × 10 groups |
| χ² | 400.69 |
| df | 18 |
| p-value | < 1e-70 |
| Cramér's V | 0.156 (small-medium) |
| reject H₀ at α=0.05 | **YES** |
| Bonferroni z-threshold | ±3.144 (α=0.05 / 30 cells, two-sided) |
| min expected cell | 0.98 (some expected cells <5; treat p as approximate, consider Fisher/G-test) |

### Per-cell adjusted standardized residuals

All cells shown. **Bold** = Bonferroni-significant (|z| ≥ 3.14, family-wise α=0.05 across 30 cells).

| dataset | Deciding | Evaluate | Executing | Grounding | Learning | Memory | Planning | Reasoning | Reflection | Retrieval |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| AG2 | **+3.70** | **+4.77** | -1.33 | **+5.45** | -1.06 | -0.56 | +1.93 | +2.34 | **-5.41** | **-10.89** |
| HyperAgent | -2.98 | -2.26 | **-10.80** | +0.12 | +2.66 | -0.02 | +1.23 | **+6.84** | **+4.02** | **+4.28** |
| SWE-Agent | +0.57 | -0.91 | **+12.24** | **-3.88** | -2.06 | +0.40 | -2.61 | **-8.78** | -0.50 | +3.00 |

## Annotation density (quotes per annotated turn)

| dataset | annotated turns | mean | median | min | max |
|---|---:|---:|---:|---:|---:|
| AG2 | 544 | 1.85 | 1 | 1 | 4 |
| HyperAgent | 2325 | 1.88 | 2 | 1 | 4 |
| SWE-Agent | 1987 | 1.44 | 1 | 1 | 5 |

## Top 15 leaf actions

_Note: leaf counts below are from the original 4-dataset run and still include CodeAct contributions. Regenerate from the notebook over the AG2 + HyperAgent + SWE-Agent subset for a clean three-agent ranking. The example traces (all AG2) remain valid._

| # | group :: sub :: leaf | count | example trace | example quote |
|---:|---|---:|---|---|
| 792 | `Reasoning :: Analysing :: Analyse source code` | 792 | `AG2/026a0b8d-393f-5a0a-99ec-de367e` | et's denote the number of tomato packets with the sy |
| 729 | `Executing :: Executing plan :: Initiate planned action` | 729 | `AG2/03846ead-3648-58cb-864b-d42093` | [Agent_Code_Executor \| role=user] Sure, based on your explanation, I am going to write a python script to find the answe |
| 681 | `Executing :: Executing plan :: Apply patch via edit` | 681 | `AG2/03846ead-3648-58cb-864b-d42093` | [Agent_Code_Executor \| role=user] # Step 1: Calculate the points collected by Bella.  # Since Bella has collected 30% mo |
| 668 | `Retrieval :: Retrieve from local corpus :: Retrieve from local corpus` | 668 | `AG2/14ad4372-fb63-5154-afce-29967d` | [Agent_Verifier \| role=assistant] Judy teaches 5 dance classes every day from Monday to Friday, and 8 classes on Saturda |
| 585 | `Retrieval :: Retrieve from local corpus :: Read code semantics from open file` | 585 | `AG2/f4e0d743-34bc-50ee-ade8-39dcb9` | [mathproxyagent \| role=assistant]       Let's use Python to tackle a math |
| 460 | `Grounding :: Interact with digital environments :: Issue operational commands` | 460 | `AG2/09a5652f-b49c-5f8e-aa2f-4a3634` | [mathproxyagent \| role=assistant] Let's |
| 424 | `Executing :: Executing plan :: Run verification command` | 424 | `AG2/03fcef05-c193-5817-bc36-0135ef` | [mathproxyagent \| role=assistant] 800 |
| 324 | `Grounding :: Augment with external computation :: Execute code` | 324 | `AG2/08a6477e-37a2-5633-8a6e-478b56` | [mathproxyagent \| role=assistant] Bandages used on the first day: 76 |
| 237 | `Reflection :: Reflect on errors and failures :: Detect failed action` | 237 | `AG2/42a8fa38-241b-5990-b081-6c20d3` | e=assistant] No output found. Make sure you print the results. Error: Traceback (most recent call last):   File "", line |
| 219 | `Memory :: Store Information :: Store information in working memory` | 219 | `AG2/026a0b8d-393f-5a0a-99ec-de367e` | [Agent_Verifier \| role=assistant] It's April, and Mrs. Rylan has been busy on her farm planting different types of veget |
| 205 | `Planning :: Formulate a workflow or plan :: Formulate a high-level plan` | 205 | `AG2/018efed1-9951-5512-a991-d2115e` | ssive granularity). 2. Identify any queries that can be comput |
| 197 | `Evaluate :: Evaluating with gold :: Confirm actual == expected` | 197 | `AG2/03846ead-3648-58cb-864b-d42093` | [Agent_Code_Executor \| role=user] Based on the Python code execution, the class 3B needs an additional 210 points to rea |
| 174 | `Planning :: Decompose task :: Decompose into subtasks` | 174 | `AG2/018efed1-9951-5512-a991-d2115e` | istant \| role=user] Key Idea: To find out how much Gerald spent, we need to calculate his total earnings for the week an |
| 174 | `Grounding :: Interact with other agents :: Send message to peer agent` | 174 | `AG2/03846ead-3648-58cb-864b-d42093` | [Agent_Problem_Solver \| role=user] Thanks, Agent Code Executor and Agent Verifier for your contributions. Our approaches |
| 165 | `Planning :: Formulate a workflow or plan :: Formulate an analysis workflow` | 165 | `AG2/03fcef05-c193-5817-bc36-0135ef` | [mathproxyagent \| role=assistant] Let's use Py |

## Per-trace behavior fingerprint (top-3 groups)

| dataset / trace | turns | quotes | top groups |
|---|---:|---:|---|
| AG2/018efed1-9951-5512-a991-d2115e718547 | 4 | 7 | `Planning`:2, `Executing`:2, `Deciding`:1 |
| AG2/026a0b8d-393f-5a0a-99ec-de367e6d294f | 12 | 12 | `Evaluate`:6, `Reasoning`:3, `Memory`:2 |
| AG2/03846ead-3648-58cb-864b-d42093699a1f | 21 | 22 | `Grounding`:8, `Evaluate`:6, `Executing`:3 |
| AG2/03fcef05-c193-5817-bc36-0135ef921645 | 4 | 7 | `Executing`:3, `Reasoning`:2, `Planning`:1 |
| AG2/08a6477e-37a2-5633-8a6e-478b568a578e | 4 | 8 | `Reasoning`:3, `Executing`:2, `Deciding`:1 |
| AG2/09a5652f-b49c-5f8e-aa2f-4a3634d93164 | 8 | 9 | `Grounding`:3, `Reasoning`:1, `Planning`:1 |
| AG2/09a5652f-b49c-5f8e-aa2f-4a3634d93164_2 | 4 | 9 | `Reasoning`:3, `Executing`:3, `Planning`:2 |
| AG2/0ab7fe5c-26be-554a-aea3-0481ed24907a | 6 | 14 | `Reasoning`:3, `Evaluate`:3, `Planning`:2 |
| AG2/0fa4d4dd-2fee-5ee9-8c49-98f450277727 | 4 | 11 | `Reasoning`:2, `Planning`:2, `Memory`:2 |
| AG2/14ad4372-fb63-5154-afce-29967d1c1462 | 5 | 11 | `Reasoning`:4, `Planning`:2, `Executing`:2 |
| AG2/14ad4372-fb63-5154-afce-29967d1c1462_2 | 6 | 6 | `Evaluate`:2, `Retrieval`:1, `Memory`:1 |
| AG2/14ad4372-fb63-5154-afce-29967d1c1462_3 | 4 | 7 | `Executing`:3, `Planning`:2, `Reasoning`:1 |
| AG2/162c2979-633b-57b5-b090-2694826e8f79 | 2 | 4 | `Reasoning`:2, `Grounding`:1, `Planning`:1 |
| AG2/162c2979-633b-57b5-b090-2694826e8f79_2 | 4 | 7 | `Planning`:2, `Executing`:2, `Deciding`:1 |
| AG2/184cfba4-3071-5731-b828-ff219c2892ad | 6 | 7 | `Reasoning`:2, `Executing`:2, `Evaluate`:2 |
| AG2/22ccd417-a3ea-5b7e-95ed-698cb708ac4d | 4 | 6 | `Grounding`:2, `Memory`:1, `Planning`:1 |
| AG2/2653076b-c412-5a24-aa56-74c6a241409d | 12 | 12 | `Memory`:6, `Evaluate`:2, `Grounding`:1 |
| AG2/2a8fa54b-df25-5d6f-a7a0-e40885768b1b | 4 | 5 | `Reasoning`:2, `Planning`:1, `Executing`:1 |
| AG2/2eb2b55a-bc5a-5ed8-84f6-1de061a55000 | 2 | 6 | `Planning`:2, `Reasoning`:2, `Grounding`:1 |
| AG2/33a17279-f8a1-5d06-a898-1b8ddf509f45 | 6 | 14 | `Reasoning`:5, `Grounding`:4, `Planning`:3 |
| AG2/33a17279-f8a1-5d06-a898-1b8ddf509f45_2 | 4 | 9 | `Executing`:3, `Reasoning`:2, `Planning`:2 |
| AG2/356a95f1-7ecc-5ca1-898d-b8bcb8291581 | 6 | 10 | `Planning`:2, `Reasoning`:2, `Grounding`:2 |
| AG2/356a95f1-7ecc-5ca1-898d-b8bcb8291581_2 | 4 | 9 | `Reasoning`:4, `Executing`:2, `Grounding`:1 |
| AG2/3d7112da-b130-507a-95a4-39013d8d8849 | 4 | 9 | `Grounding`:3, `Reasoning`:2, `Planning`:2 |
| AG2/3ec6d63c-cddb-59db-945b-f0d4feb4c177 | 6 | 14 | `Grounding`:4, `Planning`:4, `Reasoning`:3 |
| AG2/42a8fa38-241b-5990-b081-6c20d34fa01d | 6 | 17 | `Executing`:4, `Planning`:3, `Reasoning`:3 |
| AG2/44eb108f-eea7-594c-a251-3e46bab477fe | 4 | 9 | `Reasoning`:3, `Grounding`:2, `Executing`:2 |
| AG2/44eb108f-eea7-594c-a251-3e46bab477fe_2 | 4 | 8 | `Grounding`:3, `Executing`:3, `Reasoning`:2 |
| AG2/4596c19f-1bd6-58f8-98d9-ca15b2b7dcdd | 4 | 10 | `Grounding`:2, `Planning`:2, `Reasoning`:2 |
| AG2/4734c944-b6c2-542d-99b2-adee7088cf9f | 7 | 14 | `Reasoning`:4, `Evaluate`:3, `Grounding`:2 |
| AG2/4e041013-6a69-5b99-b74e-e2023612f32e | 8 | 12 | `Memory`:3, `Reasoning`:2, `Evaluate`:2 |
| AG2/51c0de4f-c74a-5ce4-8138-177312027e57 | 7 | 14 | `Reasoning`:4, `Grounding`:3, `Memory`:2 |
| AG2/5310bfe7-f17d-51cc-b0bd-898daeb1515e | 4 | 9 | `Reasoning`:4, `Grounding`:2, `Executing`:2 |
| AG2/58be8739-d76d-579a-8ceb-ffc2f3064f18 | 2 | 7 | `Reasoning`:4, `Planning`:1, `Memory`:1 |
| AG2/60cdf0a9-0267-5cbe-a018-35a509e65e04 | 4 | 6 | `Executing`:3, `Reasoning`:1, `Planning`:1 |
| AG2/61bdfeb6-c12a-56ad-a86b-0e0baf880938 | 4 | 10 | `Grounding`:4, `Planning`:3, `Reasoning`:1 |
| AG2/62631a5e-6bc4-5461-b784-e095b57cc340 | 4 | 9 | `Reasoning`:3, `Executing`:3, `Deciding`:1 |
| AG2/63835b93-e41f-5360-a02c-326e4bc86acc | 4 | 6 | `Reasoning`:2, `Planning`:1, `Executing`:1 |
| AG2/66e7e569-490a-5183-ab8f-04fa6dc6c645 | 4 | 12 | `Executing`:4, `Planning`:3, `Reasoning`:3 |
| AG2/66e7e569-490a-5183-ab8f-04fa6dc6c645_2 | 4 | 11 | `Reasoning`:5, `Executing`:2, `Planning`:1 |
| AG2/67c8dfa4-2004-5516-8c23-5a9f10b04758 | 6 | 13 | `Reasoning`:6, `Executing`:2, `Evaluate`:2 |
| AG2/687c0e05-83a1-5d13-9163-b245b1a02245 | 4 | 10 | `Reasoning`:4, `Planning`:2, `Executing`:2 |
| AG2/6891537b-54d7-5f49-b9e4-790b5e6a5de6 | 12 | 8 | `Reasoning`:3, `Executing`:2, `Evaluate`:2 |
| AG2/6891537b-54d7-5f49-b9e4-790b5e6a5de6_2 | 4 | 6 | `Planning`:2, `Executing`:2, `Reasoning`:1 |
| AG2/695911c4-fe0c-5809-8c1a-7d4a133f2f94 | 5 | 17 | `Grounding`:6, `Executing`:4, `Reasoning`:3 |
| AG2/6adc69c3-14ad-544f-8573-fc04c9be26d6 | 6 | 10 | `Reasoning`:4, `Executing`:3, `Grounding`:2 |
| AG2/6b318f09-4775-5050-968c-45fb12f70793 | 6 | 9 | `Executing`:3, `Reasoning`:2, `Planning`:1 |
| AG2/6b318f09-4775-5050-968c-45fb12f70793_2 | 4 | 10 | `Reasoning`:3, `Planning`:2, `Executing`:2 |
| AG2/6ea5bca9-56f3-5ebd-b732-023ceb4cc818 | 4 | 12 | `Reasoning`:4, `Planning`:3, `Executing`:3 |
| AG2/716b2374-8eb3-5db7-add1-b09e751a36f6 | 8 | 11 | `Grounding`:4, `Reasoning`:2, `Retrieval`:1 |
| AG2/865e7e09-d12a-539c-8983-ca9800e1e784 | 4 | 10 | `Grounding`:3, `Executing`:3, `Planning`:2 |
| AG2/9242f0d1-620a-518f-9121-fb37df93c668 | 4 | 5 | `Grounding`:2, `Memory`:1, `Executing`:1 |
| AG2/9242f0d1-620a-518f-9121-fb37df93c668_2 | 6 | 13 | `Memory`:3, `Grounding`:3, `Executing`:2 |
| AG2/92b1c12e-e163-55c0-b5d5-d5a7098c7854 | 8 | 8 | `Reasoning`:2, `Executing`:2, `Evaluate`:2 |
| AG2/9d4eecf3-32cf-5c54-8290-3f5bbe05bec3 | 4 | 11 | `Reasoning`:3, `Planning`:3, `Executing`:2 |
| AG2/9e7ea617-0523-599b-8d24-129114eaf302 | 4 | 7 | `Executing`:3, `Reasoning`:2, `Planning`:1 |
| AG2/9e8ee62d-dd02-5c50-a42e-8eada69a0acc | 8 | 12 | `Evaluate`:3, `Memory`:2, `Reasoning`:2 |
| AG2/a006a8dc-1ba1-5097-bc1c-043b44f6a03d | 6 | 11 | `Reasoning`:4, `Grounding`:3, `Executing`:2 |
| AG2/a126d8eb-6c77-5fad-83e4-686a0b159bec | 9 | 9 | `Memory`:2, `Planning`:2, `Executing`:2 |
| AG2/a49f0912-ada2-5052-91f9-94f615ec9597 | 7 | 14 | `Reasoning`:4, `Grounding`:3, `Evaluate`:3 |
| AG2/a536a498-8195-51c7-8f84-9fd235b62490 | 4 | 8 | `Executing`:3, `Grounding`:2, `Reasoning`:2 |
| AG2/a5714da3-9107-5a28-a6df-bb97dcf4e29a | 15 | 12 | `Reasoning`:2, `Planning`:2, `Executing`:2 |
| AG2/a5714da3-9107-5a28-a6df-bb97dcf4e29a_2 | 4 | 8 | `Reasoning`:3, `Executing`:2, `Planning`:1 |
| AG2/ac636464-515f-5ffc-b284-a9f738e74a2c | 4 | 7 | `Executing`:2, `Evaluate`:2, `Retrieval`:1 |
| AG2/ac636464-515f-5ffc-b284-a9f738e74a2c_2 | 6 | 9 | `Executing`:3, `Planning`:2, `Grounding`:2 |
| AG2/b01f5564-0cfd-5691-9839-ad5d344d1002 | 6 | 16 | `Reasoning`:7, `Evaluate`:3, `Grounding`:2 |
| AG2/b1704622-73f8-5d2f-99d0-af4c6a80ee93 | 6 | 10 | `Grounding`:4, `Planning`:2, `Reasoning`:2 |
| AG2/b387eab0-64ee-5868-847e-4c8e153b6717 | 7 | 8 | `Executing`:3, `Memory`:1, `Planning`:1 |
| AG2/b5250d30-5380-5209-9925-b19fc931a165 | 6 | 11 | `Grounding`:3, `Planning`:2, `Reasoning`:2 |
| AG2/b5250d30-5380-5209-9925-b19fc931a165_2 | 6 | 11 | `Executing`:3, `Evaluate`:3, `Grounding`:2 |
| AG2/b5250d30-5380-5209-9925-b19fc931a165_3 | 6 | 9 | `Reasoning`:2, `Executing`:2, `Evaluate`:2 |
| AG2/b64e6493-693f-54d3-90e9-c6fee723a945 | 6 | 10 | `Grounding`:2, `Reasoning`:2, `Executing`:2 |
| AG2/b7098e15-d748-548e-97de-c5b17218dc94 | 6 | 11 | `Reasoning`:4, `Executing`:3, `Planning`:2 |
| AG2/b7afed10-5983-52e4-b20f-e800e875c45b | 21 | 26 | `Grounding`:16, `Executing`:4, `Planning`:2 |
| AG2/b7afed10-5983-52e4-b20f-e800e875c45b_2 | 6 | 10 | `Executing`:4, `Evaluate`:3, `Planning`:2 |
| AG2/b7ed33fc-e5e4-5546-9a68-0e0b4996d238 | 4 | 7 | `Grounding`:3, `Planning`:2, `Executing`:1 |
| AG2/bf175de5-3398-5836-9824-6bbe24092fd9 | 6 | 12 | `Grounding`:4, `Reasoning`:3, `Executing`:3 |
| AG2/bf175de5-3398-5836-9824-6bbe24092fd9_2 | 2 | 8 | `Reasoning`:4, `Planning`:2, `Evaluate`:1 |
| AG2/c349f75a-43fc-5613-9c47-cb1ff550c2fb | 4 | 10 | `Reasoning`:3, `Planning`:2, `Executing`:2 |
| AG2/c7f5f770-8f71-59f9-b416-e5bfbc12e46d | 6 | 6 | `Reasoning`:2, `Executing`:2, `Planning`:1 |
| AG2/c7f5f770-8f71-59f9-b416-e5bfbc12e46d_2 | 4 | 8 | `Reasoning`:3, `Grounding`:2, `Executing`:2 |
| AG2/c8a83329-9e1c-5201-a22a-f831bc45e949 | 10 | 20 | `Reasoning`:8, `Grounding`:6, `Executing`:2 |
| AG2/cb149e20-ce79-5570-8c2e-1898a275d0c7 | 7 | 8 | `Grounding`:3, `Reasoning`:1, `Planning`:1 |
| AG2/cb149e20-ce79-5570-8c2e-1898a275d0c7_2 | 6 | 10 | `Grounding`:3, `Planning`:2, `Reasoning`:2 |
| AG2/cb149e20-ce79-5570-8c2e-1898a275d0c7_3 | 4 | 11 | `Reasoning`:4, `Planning`:2, `Evaluate`:2 |
| AG2/d8c37fac-fcc1-5fdd-9dc4-4daf33a02f73 | 6 | 8 | `Executing`:3, `Grounding`:2, `Evaluate`:2 |
| AG2/d8cf5ae6-df57-5f72-b6d7-ad4c8861b049 | 9 | 12 | `Executing`:4, `Evaluate`:3, `Reasoning`:2 |
| AG2/d8cf5ae6-df57-5f72-b6d7-ad4c8861b049_2 | 4 | 7 | `Planning`:2, `Grounding`:2, `Reasoning`:1 |
| AG2/daac6a15-9dc5-50c4-afc7-5de80fc5c9b5 | 4 | 7 | `Grounding`:3, `Planning`:2, `Reasoning`:1 |
| AG2/ddfcd47d-92bd-5cc8-a994-973eac9a38e1 | 4 | 12 | `Executing`:4, `Reasoning`:3, `Planning`:2 |
| AG2/de70c80d-0fa2-5ecf-bb6e-57a628c5d085 | 7 | 10 | `Executing`:3, `Grounding`:2, `Evaluate`:2 |
| AG2/e0359d1a-924a-5661-b4c5-912d9214f4d1 | 4 | 10 | `Grounding`:3, `Planning`:3, `Memory`:1 |
| AG2/e603057a-4c9e-596e-b9e7-d254b1b24956 | 7 | 10 | `Reasoning`:4, `Grounding`:2, `Planning`:1 |
| AG2/e603057a-4c9e-596e-b9e7-d254b1b24956_2 | 7 | 13 | `Reasoning`:4, `Evaluate`:3, `Retrieval`:2 |
| AG2/e8f106be-fc94-516c-90ca-65a219e684ee | 6 | 9 | `Grounding`:3, `Reasoning`:2, `Planning`:2 |
| AG2/ec103bfa-b44d-5ebe-ba91-6b4a51b30a06 | 13 | 11 | `Evaluate`:4, `Memory`:2, `Reasoning`:2 |
| AG2/ee148ddd-6e24-541d-8c36-f2805c23c22e | 7 | 9 | `Reasoning`:4, `Grounding`:2, `Retrieval`:1 |
| AG2/f4e0d743-34bc-50ee-ade8-39dcb95a91bd | 4 | 7 | `Reasoning`:2, `Planning`:2, `Evaluate`:2 |
| AG2/f4e0d743-34bc-50ee-ade8-39dcb95a91bd_2 | 6 | 12 | `Reasoning`:3, `Retrieval`:2, `Planning`:2 |
| AG2/fbb94a81-29ac-5807-a5c9-ba8a1a630954 | 4 | 8 | `Executing`:3, `Reasoning`:2, `Deciding`:1 |
| HyperAgent/astropy__astropy-14182 | 49 | 53 | `Grounding`:18, `Reasoning`:11, `Executing`:9 |
| HyperAgent/django__django-11001 | 201 | 58 | `Reasoning`:17, `Memory`:8, `Retrieval`:7 |
| HyperAgent/django__django-11019 | 157 | 55 | `Planning`:12, `Executing`:11, `Reasoning`:10 |
| HyperAgent/django__django-11179 | 42 | 50 | `Executing`:13, `Grounding`:9, `Planning`:8 |
| HyperAgent/django__django-11620 | 63 | 50 | `Reasoning`:16, `Executing`:16, `Planning`:8 |
| HyperAgent/django__django-11797 | 51 | 36 | `Executing`:7, `Planning`:6, `Memory`:5 |
| HyperAgent/django__django-11905 | 111 | 12 | `Planning`:3, `Reasoning`:2, `Retrieval`:2 |
| HyperAgent/django__django-11910 | 691 | 31 | `Planning`:6, `Reasoning`:5, `Memory`:4 |
| HyperAgent/django__django-12113 | 68 | 47 | `Planning`:13, `Evaluate`:10, `Reasoning`:9 |
| HyperAgent/django__django-12184 | 985 | 49 | `Executing`:11, `Grounding`:7, `Retrieval`:7 |
| HyperAgent/django__django-12284 | 54 | 41 | `Retrieval`:12, `Grounding`:7, `Executing`:7 |
| HyperAgent/django__django-12286 | 31 | 48 | `Executing`:18, `Planning`:10, `Reasoning`:8 |
| HyperAgent/django__django-12308 | 324 | 24 | `Evaluate`:5, `Planning`:4, `Executing`:4 |
| HyperAgent/django__django-12470 | 618 | 34 | `Executing`:8, `Planning`:7, `Reflection`:7 |
| HyperAgent/django__django-12589 | 724 | 52 | `Grounding`:16, `Executing`:10, `Planning`:7 |
| HyperAgent/django__django-12747 | 129 | 46 | `Retrieval`:13, `Planning`:7, `Reasoning`:7 |
| HyperAgent/django__django-13028 | 157 | 77 | `Executing`:23, `Reasoning`:23, `Planning`:14 |
| HyperAgent/django__django-13220 | 67 | 34 | `Reasoning`:9, `Grounding`:8, `Executing`:6 |
| HyperAgent/django__django-13265 | 523 | 27 | `Executing`:10, `Reasoning`:9, `Planning`:3 |
| HyperAgent/django__django-13768 | 23 | 47 | `Reasoning`:13, `Executing`:11, `Retrieval`:8 |
| HyperAgent/django__django-13925 | 89 | 30 | `Executing`:8, `Planning`:7, `Reasoning`:6 |
| HyperAgent/django__django-13964 | 43 | 74 | `Reasoning`:28, `Retrieval`:21, `Planning`:12 |
| HyperAgent/django__django-14155 | 115 | 45 | `Reasoning`:13, `Grounding`:9, `Evaluate`:7 |
| HyperAgent/django__django-14787 | 39 | 35 | `Executing`:8, `Reasoning`:7, `Planning`:5 |
| HyperAgent/django__django-14997 | 48 | 58 | `Reasoning`:19, `Executing`:10, `Evaluate`:8 |
| HyperAgent/django__django-15213 | 56 | 46 | `Executing`:10, `Reasoning`:9, `Planning`:7 |
| HyperAgent/django__django-15320 | 30 | 40 | `Planning`:10, `Reasoning`:6, `Executing`:6 |
| HyperAgent/django__django-15347 | 48 | 49 | `Grounding`:14, `Reasoning`:13, `Executing`:9 |
| HyperAgent/django__django-15388 | 347 | 46 | `Grounding`:11, `Reasoning`:10, `Retrieval`:8 |
| HyperAgent/django__django-15400 | 30 | 36 | `Executing`:13, `Retrieval`:10, `Planning`:4 |
| HyperAgent/django__django-15498 | 28 | 61 | `Reasoning`:21, `Planning`:12, `Grounding`:11 |
| HyperAgent/django__django-15781 | 54 | 55 | `Reasoning`:15, `Grounding`:13, `Retrieval`:11 |
| HyperAgent/django__django-16229 | 105 | 39 | `Retrieval`:13, `Executing`:8, `Reasoning`:7 |
| HyperAgent/django__django-16400 | 315 | 38 | `Reasoning`:15, `Grounding`:13, `Memory`:4 |
| HyperAgent/django__django-16408 | 59 | 44 | `Reasoning`:15, `Executing`:9, `Grounding`:7 |
| HyperAgent/django__django-16816 | 177 | 26 | `Reasoning`:11, `Retrieval`:6, `Executing`:3 |
| HyperAgent/django__django-16820 | 98 | 58 | `Retrieval`:15, `Reasoning`:13, `Grounding`:12 |
| HyperAgent/django__django-17087 | 117 | 36 | `Executing`:12, `Reasoning`:6, `Grounding`:6 |
| HyperAgent/matplotlib__matplotlib-18869 | 58 | 34 | `Retrieval`:9, `Planning`:5, `Executing`:5 |
| HyperAgent/matplotlib__matplotlib-23476 | 56 | 75 | `Executing`:29, `Reasoning`:26, `Planning`:13 |
| HyperAgent/matplotlib__matplotlib-23987 | 522 | 29 | `Reasoning`:14, `Evaluate`:6, `Executing`:5 |
| HyperAgent/matplotlib__matplotlib-24334 | 151 | 46 | `Executing`:10, `Reasoning`:9, `Planning`:8 |
| HyperAgent/matplotlib__matplotlib-24970 | 501 | 28 | `Grounding`:7, `Reasoning`:6, `Reflection`:5 |
| HyperAgent/matplotlib__matplotlib-25079 | 138 | 51 | `Executing`:13, `Reasoning`:12, `Retrieval`:9 |
| HyperAgent/matplotlib__matplotlib-25332 | 146 | 50 | `Executing`:14, `Planning`:13, `Reasoning`:8 |
| HyperAgent/matplotlib__matplotlib-25433 | 39 | 54 | `Reasoning`:14, `Executing`:12, `Planning`:9 |
| HyperAgent/matplotlib__matplotlib-25498 | 52 | 85 | `Reasoning`:22, `Retrieval`:17, `Executing`:12 |
| HyperAgent/matplotlib__matplotlib-26011 | 298 | 43 | `Retrieval`:16, `Evaluate`:9, `Executing`:7 |
| HyperAgent/mwaskom__seaborn-2848 | 171 | 19 | `Reasoning`:11, `Grounding`:7, `Planning`:1 |
| HyperAgent/pallets__flask-4992 | 52 | 46 | `Executing`:14, `Retrieval`:9, `Evaluate`:9 |
| HyperAgent/pallets__flask-5063 | 67 | 52 | `Grounding`:21, `Reasoning`:11, `Planning`:10 |
| HyperAgent/psf__requests-863 | 46 | 54 | `Executing`:12, `Reasoning`:11, `Planning`:9 |
| HyperAgent/pylint-dev__pylint-5859 | 69 | 34 | `Retrieval`:11, `Reasoning`:10, `Planning`:6 |
| HyperAgent/pylint-dev__pylint-6506 | 22 | 45 | `Reasoning`:13, `Grounding`:9, `Memory`:6 |
| HyperAgent/pytest-dev__pytest-5103 | 55 | 38 | `Retrieval`:15, `Reasoning`:7, `Grounding`:5 |
| HyperAgent/pytest-dev__pytest-5227 | 275 | 60 | `Reasoning`:24, `Executing`:19, `Planning`:6 |
| HyperAgent/pytest-dev__pytest-5413 | 183 | 64 | `Reasoning`:26, `Executing`:15, `Evaluate`:14 |
| HyperAgent/pytest-dev__pytest-5495 | 123 | 63 | `Reasoning`:26, `Retrieval`:13, `Executing`:7 |
| HyperAgent/scikit-learn__scikit-learn-11281 | 67 | 27 | `Retrieval`:8, `Planning`:7, `Executing`:6 |
| HyperAgent/scikit-learn__scikit-learn-25500 | 56 | 61 | `Reasoning`:22, `Executing`:12, `Evaluate`:7 |
| HyperAgent/scikit-learn__scikit-learn-25570 | 20 | 35 | `Reasoning`:9, `Executing`:6, `Planning`:5 |
| HyperAgent/scikit-learn__scikit-learn-25747 | 409 | 63 | `Reasoning`:25, `Evaluate`:12, `Grounding`:10 |
| HyperAgent/sphinx-doc__sphinx-10451 | 51 | 70 | `Reasoning`:28, `Retrieval`:15, `Planning`:12 |
| HyperAgent/sphinx-doc__sphinx-7686 | 154 | 72 | `Reasoning`:23, `Retrieval`:12, `Grounding`:10 |
| HyperAgent/sphinx-doc__sphinx-8273 | 52 | 65 | `Grounding`:13, `Planning`:11, `Executing`:10 |
| HyperAgent/sphinx-doc__sphinx-8282 | 145 | 47 | `Reasoning`:16, `Grounding`:9, `Executing`:9 |
| HyperAgent/sphinx-doc__sphinx-8435 | 121 | 17 | `Retrieval`:6, `Memory`:4, `Reasoning`:4 |
| HyperAgent/sphinx-doc__sphinx-8506 | 153 | 78 | `Grounding`:22, `Executing`:14, `Evaluate`:12 |
| HyperAgent/sphinx-doc__sphinx-8595 | 128 | 82 | `Reasoning`:22, `Retrieval`:19, `Grounding`:14 |
| HyperAgent/sphinx-doc__sphinx-8721 | 145 | 39 | `Reasoning`:17, `Executing`:7, `Planning`:6 |
| HyperAgent/sphinx-doc__sphinx-8801 | 66 | 27 | `Retrieval`:6, `Executing`:6, `Reasoning`:5 |
| HyperAgent/sympy__sympy-11897 | 282 | 52 | `Retrieval`:20, `Reasoning`:13, `Planning`:7 |
| HyperAgent/sympy__sympy-12236 | 47 | 51 | `Executing`:14, `Grounding`:9, `Reasoning`:8 |
| HyperAgent/sympy__sympy-12481 | 78 | 25 | `Executing`:10, `Planning`:6, `Reasoning`:5 |
| HyperAgent/sympy__sympy-13043 | 26 | 30 | `Reasoning`:8, `Executing`:7, `Reflection`:5 |
| HyperAgent/sympy__sympy-13146 | 46 | 66 | `Reasoning`:20, `Grounding`:18, `Reflection`:8 |
| HyperAgent/sympy__sympy-13773 | 31 | 37 | `Grounding`:7, `Executing`:6, `Retrieval`:5 |
| HyperAgent/sympy__sympy-13971 | 22 | 47 | `Reasoning`:15, `Grounding`:10, `Executing`:5 |
| HyperAgent/sympy__sympy-14317 | 70 | 45 | `Evaluate`:12, `Grounding`:10, `Reasoning`:9 |
| HyperAgent/sympy__sympy-14817 | 91 | 42 | `Planning`:9, `Retrieval`:9, `Learning`:8 |
| HyperAgent/sympy__sympy-15308 | 163 | 41 | `Retrieval`:13, `Executing`:6, `Memory`:4 |
| HyperAgent/sympy__sympy-15678 | 75 | 37 | `Reasoning`:15, `Executing`:10, `Planning`:5 |
| HyperAgent/sympy__sympy-16106 | 54 | 62 | `Grounding`:16, `Planning`:15, `Reasoning`:10 |
| HyperAgent/sympy__sympy-17022 | 173 | 43 | `Reasoning`:11, `Executing`:10, `Memory`:7 |
| HyperAgent/sympy__sympy-17139 | 21 | 20 | `Executing`:10, `Grounding`:5, `Planning`:3 |
| HyperAgent/sympy__sympy-17655 | 71 | 31 | `Executing`:8, `Evaluate`:6, `Reasoning`:5 |
| HyperAgent/sympy__sympy-19254 | 185 | 33 | `Retrieval`:11, `Executing`:7, `Planning`:6 |
| HyperAgent/sympy__sympy-19487 | 198 | 60 | `Reasoning`:19, `Grounding`:18, `Executing`:9 |
| HyperAgent/sympy__sympy-20049 | 173 | 50 | `Grounding`:18, `Reasoning`:12, `Evaluate`:8 |
| HyperAgent/sympy__sympy-20212 | 262 | 31 | `Retrieval`:9, `Planning`:7, `Grounding`:7 |
| HyperAgent/sympy__sympy-20322 | 170 | 58 | `Planning`:15, `Executing`:13, `Reasoning`:10 |
| HyperAgent/sympy__sympy-20590 | 129 | 36 | `Retrieval`:8, `Reasoning`:7, `Evaluate`:6 |
| HyperAgent/sympy__sympy-20639 | 60 | 53 | `Executing`:12, `Evaluate`:11, `Retrieval`:9 |
| HyperAgent/sympy__sympy-21379 | 39 | 57 | `Grounding`:18, `Reasoning`:10, `Retrieval`:8 |
| HyperAgent/sympy__sympy-21612 | 24 | 24 | `Reasoning`:6, `Retrieval`:6, `Planning`:4 |
| HyperAgent/sympy__sympy-21627 | 3 | 0 |  |
| HyperAgent/sympy__sympy-22005 | 3 | 0 |  |
| HyperAgent/sympy__sympy-23191 | 3 | 0 |  |
| HyperAgent/sympy__sympy-24066 | 3 | 1 | `Memory`:1 |
| HyperAgent/sympy__sympy-24102 | 3 | 3 | `Memory`:3 |
| SWE-Agent/Bachmann1234__diff_cover-210 | 44 | 26 | `Executing`:10, `Retrieval`:4, `Reflection`:3 |
| SWE-Agent/Backblaze__B2_Command_Line_Tool-420 | 16 | 24 | `Executing`:7, `Retrieval`:5, `Reasoning`:5 |
| SWE-Agent/Electrostatics__mmcif_pdbx-27 | 202 | 39 | `Executing`:16, `Retrieval`:7, `Grounding`:5 |
| SWE-Agent/Fatal1ty__mashumaro-142 | 82 | 18 | `Executing`:8, `Evaluate`:4, `Reasoning`:4 |
| SWE-Agent/Infinidat__munch-52 | 30 | 46 | `Executing`:15, `Memory`:10, `Reasoning`:6 |
| SWE-Agent/MGough__sensorhub-4 | 20 | 26 | `Planning`:10, `Executing`:10, `Grounding`:4 |
| SWE-Agent/NCAS-CMS__cfdm-175 | 20 | 13 | `Executing`:5, `Retrieval`:2, `Evaluate`:2 |
| SWE-Agent/PyCQA__flake8-1642 | 18 | 25 | `Executing`:9, `Reasoning`:6, `Retrieval`:3 |
| SWE-Agent/PyCQA__flake8-bugbear-209 | 22 | 15 | `Executing`:6, `Planning`:3, `Grounding`:2 |
| SWE-Agent/Unidata__MetPy-2691 | 64 | 38 | `Executing`:16, `Reasoning`:6, `Evaluate`:4 |
| SWE-Agent/ValvePython__steam-359 | 20 | 23 | `Executing`:11, `Grounding`:5, `Planning`:4 |
| SWE-Agent/VirtusLab__git-machete-330 | 22 | 44 | `Reasoning`:15, `Executing`:12, `Retrieval`:10 |
| SWE-Agent/WIPACrepo__iceprod-339 | 104 | 49 | `Executing`:11, `Evaluate`:10, `Reflection`:10 |
| SWE-Agent/adafruit__Adafruit_CircuitPython_GPS-76 | 24 | 35 | `Executing`:12, `Retrieval`:9, `Reasoning`:7 |
| SWE-Agent/adamchainz__apig-wsgi-187 | 36 | 39 | `Memory`:10, `Executing`:7, `Retrieval`:7 |
| SWE-Agent/adamchainz__apig-wsgi-80 | 8 | 16 | `Reasoning`:4, `Retrieval`:3, `Planning`:2 |
| SWE-Agent/agronholm__exceptiongroup-34 | 18 | 18 | `Reasoning`:5, `Grounding`:5, `Executing`:4 |
| SWE-Agent/allo-media__text2num-77 | 56 | 39 | `Planning`:11, `Reasoning`:9, `Executing`:6 |
| SWE-Agent/antirotor__speedcopy-6 | 28 | 30 | `Executing`:11, `Evaluate`:6, `Retrieval`:5 |
| SWE-Agent/asottile__add-trailing-comma-71 | 32 | 48 | `Executing`:16, `Planning`:10, `Retrieval`:8 |
| SWE-Agent/astropy__pyvo-357 | 90 | 43 | `Executing`:15, `Grounding`:7, `Reasoning`:6 |
| SWE-Agent/astropy__pyvo-459 | 26 | 25 | `Grounding`:9, `Evaluate`:4, `Reasoning`:4 |
| SWE-Agent/barrust__pyspellchecker-101 | 40 | 20 | `Retrieval`:7, `Executing`:5, `Reasoning`:3 |
| SWE-Agent/beartype__plum-106 | 24 | 26 | `Executing`:11, `Evaluate`:4, `Reasoning`:4 |
| SWE-Agent/benjamincorcoran__sasdocs-5 | 42 | 30 | `Planning`:11, `Grounding`:8, `Executing`:4 |
| SWE-Agent/bids-standard__pybids-611 | 20 | 26 | `Planning`:6, `Retrieval`:5, `Executing`:5 |
| SWE-Agent/canonical__charmcraft-869 | 24 | 23 | `Grounding`:7, `Retrieval`:5, `Evaluate`:5 |
| SWE-Agent/canonical__charmcraft-917 | 16 | 13 | `Grounding`:3, `Reasoning`:3, `Executing`:3 |
| SWE-Agent/cdent__gabbi-186 | 68 | 32 | `Executing`:16, `Reflection`:5, `Grounding`:3 |
| SWE-Agent/claudep__swiss-qr-bill-87 | 52 | 23 | `Executing`:10, `Reasoning`:4, `Retrieval`:4 |
| SWE-Agent/d-Rickyy-b__pyBrematic-22 | 42 | 38 | `Executing`:21, `Reasoning`:7, `Memory`:4 |
| SWE-Agent/data61__blocklib-75 | 16 | 16 | `Retrieval`:6, `Memory`:5, `Grounding`:3 |
| SWE-Agent/deardurham__ciprs-reader-38 | 32 | 26 | `Retrieval`:8, `Executing`:7, `Evaluate`:3 |
| SWE-Agent/eEcoLiDAR__laserchicken-135 | 26 | 30 | `Retrieval`:7, `Evaluate`:5, `Planning`:4 |
| SWE-Agent/fatiando__boule-146 | 26 | 36 | `Executing`:12, `Retrieval`:6, `Reasoning`:4 |
| SWE-Agent/fatiando__pooch-77 | 14 | 12 | `Executing`:4, `Grounding`:3, `Planning`:2 |
| SWE-Agent/geopandas__geopandas-3240 | 24 | 25 | `Executing`:9, `Reasoning`:7, `Evaluate`:4 |
| SWE-Agent/geospace-code__pymap3d-66 | 26 | 17 | `Executing`:11, `Reasoning`:3, `Retrieval`:2 |
| SWE-Agent/getlogbook__logbook-242 | 72 | 31 | `Executing`:12, `Reflection`:7, `Reasoning`:6 |
| SWE-Agent/glotzerlab__signac-flow-738 | 50 | 34 | `Executing`:15, `Evaluate`:7, `Planning`:5 |
| SWE-Agent/googleapis__synthtool-348 | 22 | 35 | `Memory`:12, `Grounding`:7, `Reasoning`:5 |
| SWE-Agent/horejsek__python-fastjsonschema-144 | 78 | 23 | `Reasoning`:10, `Retrieval`:4, `Planning`:3 |
| SWE-Agent/ikamensh__flynt-163 | 104 | 34 | `Grounding`:15, `Reasoning`:5, `Deciding`:5 |
| SWE-Agent/iterative__dvc-2068 | 36 | 29 | `Planning`:9, `Reasoning`:9, `Retrieval`:6 |
| SWE-Agent/iterative__dvc-2478 | 14 | 21 | `Executing`:6, `Reasoning`:5, `Grounding`:4 |
| SWE-Agent/iterative__dvc-3097 | 34 | 22 | `Grounding`:10, `Reasoning`:5, `Executing`:3 |
| SWE-Agent/iterative__dvc-3337 | 96 | 26 | `Executing`:12, `Retrieval`:7, `Reasoning`:3 |
| SWE-Agent/iterative__dvc-3337_2 | 148 | 23 | `Retrieval`:11, `Memory`:10, `Planning`:1 |
| SWE-Agent/iterative__dvc-3351 | 30 | 24 | `Executing`:10, `Planning`:4, `Retrieval`:4 |
| SWE-Agent/iterative__dvc-3527 | 36 | 26 | `Executing`:7, `Retrieval`:5, `Reasoning`:4 |
| SWE-Agent/iterative__dvc-5785 | 52 | 35 | `Executing`:17, `Reasoning`:8, `Reflection`:3 |
| SWE-Agent/iterative__dvc-5822 | 74 | 24 | `Executing`:8, `Reasoning`:6, `Planning`:3 |
| SWE-Agent/iterative__dvc-6375 | 40 | 60 | `Reasoning`:20, `Grounding`:15, `Evaluate`:12 |
| SWE-Agent/iterative__dvc-6519 | 682 | 17 | `Executing`:10, `Reasoning`:5, `Planning`:1 |
| SWE-Agent/iterative__dvc-6649 | 126 | 31 | `Planning`:11, `Retrieval`:11, `Executing`:5 |
| SWE-Agent/iterative__dvc-6683 | 44 | 43 | `Executing`:14, `Grounding`:10, `Reasoning`:7 |
| SWE-Agent/iterative__dvc-7103 | 130 | 28 | `Retrieval`:17, `Evaluate`:5, `Reasoning`:4 |
| SWE-Agent/joke2k__faker-1991 | 72 | 33 | `Retrieval`:11, `Executing`:9, `Evaluate`:5 |
| SWE-Agent/locustio__locust-994 | 20 | 22 | `Executing`:9, `Evaluate`:4, `Retrieval`:3 |
| SWE-Agent/marshmallow-code__flask-smorest-542 | 44 | 22 | `Planning`:14, `Executing`:4, `Evaluate`:2 |
| SWE-Agent/matthewwithanm__python-markdownify-23 | 26 | 28 | `Grounding`:7, `Executing`:7, `Planning`:4 |
| SWE-Agent/mirumee__ariadne-172 | 186 | 27 | `Reasoning`:11, `Executing`:9, `Retrieval`:4 |
| SWE-Agent/missionpinball__mpf-1564 | 16 | 34 | `Retrieval`:9, `Reasoning`:8, `Planning`:6 |
| SWE-Agent/networkx__networkx-4066 | 32 | 41 | `Executing`:12, `Memory`:7, `Reasoning`:5 |
| SWE-Agent/novonordisk-research__ProcessOptimizer-91 | 96 | 30 | `Executing`:14, `Reasoning`:9, `Retrieval`:4 |
| SWE-Agent/numpy__numpydoc-286 | 30 | 31 | `Executing`:10, `Reasoning`:5, `Grounding`:5 |
| SWE-Agent/ofek__pypinfo-109 | 12 | 14 | `Executing`:6, `Reasoning`:5, `Evaluate`:2 |
| SWE-Agent/openlawlibrary__pygls-252 | 70 | 32 | `Executing`:15, `Retrieval`:9, `Planning`:4 |
| SWE-Agent/panosz__alpha_shapes-2 | 30 | 24 | `Grounding`:9, `Executing`:6, `Reasoning`:4 |
| SWE-Agent/pddg__uroboros-34 | 26 | 32 | `Evaluate`:10, `Executing`:9, `Grounding`:6 |
| SWE-Agent/planetlabs__planet-client-python-896 | 24 | 19 | `Retrieval`:8, `Planning`:5, `Reasoning`:3 |
| SWE-Agent/pydantic__pydantic-1630 | 22 | 18 | `Retrieval`:6, `Executing`:4, `Evaluate`:3 |
| SWE-Agent/pydantic__pydantic-1804 | 16 | 18 | `Executing`:11, `Planning`:2, `Reasoning`:2 |
| SWE-Agent/pydantic__pydantic-3819 | 78 | 33 | `Executing`:16, `Planning`:5, `Retrieval`:5 |
| SWE-Agent/pydantic__pydantic-5736 | 38 | 31 | `Retrieval`:15, `Executing`:5, `Grounding`:3 |
| SWE-Agent/pydicom__pydicom-1539 | 22 | 23 | `Executing`:5, `Reasoning`:5, `Grounding`:4 |
| SWE-Agent/pylint-dev__astroid-1616 | 42 | 25 | `Retrieval`:9, `Executing`:8, `Evaluate`:3 |
| SWE-Agent/pylint-dev__astroid-941 | 64 | 35 | `Reasoning`:11, `Grounding`:7, `Executing`:7 |
| SWE-Agent/pypa__build-339 | 12 | 15 | `Grounding`:3, `Memory`:3, `Reasoning`:2 |
| SWE-Agent/pypa__hatch-610 | 384 | 21 | `Grounding`:11, `Reasoning`:3, `Executing`:3 |
| SWE-Agent/pystorm__pystorm-31 | 14 | 24 | `Grounding`:6, `Memory`:5, `Planning`:4 |
| SWE-Agent/python-metar__python-metar-150 | 36 | 27 | `Executing`:11, `Reasoning`:8, `Grounding`:2 |
| SWE-Agent/reata__sqllineage-58 | 26 | 29 | `Grounding`:12, `Executing`:6, `Planning`:4 |
| SWE-Agent/reframe-hpc__reframe-2790 | 90 | 70 | `Reasoning`:17, `Grounding`:16, `Executing`:12 |
| SWE-Agent/sciunto-org__python-bibtexparser-424 | 18 | 19 | `Executing`:9, `Reasoning`:4, `Evaluate`:3 |
| SWE-Agent/sciunto-org__python-bibtexparser-424_2 | 36 | 37 | `Executing`:9, `Grounding`:8, `Memory`:7 |
| SWE-Agent/serge-sans-paille__gast-50 | 98 | 28 | `Retrieval`:9, `Executing`:5, `Evaluate`:5 |
| SWE-Agent/smarkets__marge-bot-29 | 18 | 27 | `Executing`:9, `Reasoning`:5, `Planning`:3 |
| SWE-Agent/stfc__PSyclone-1101 | 78 | 30 | `Executing`:10, `Planning`:8, `Grounding`:5 |
| SWE-Agent/stfc__PSyclone-2230 | 50 | 41 | `Executing`:15, `Planning`:9, `Memory`:4 |
| SWE-Agent/streamlink__streamlink-3019 | 44 | 20 | `Executing`:13, `Planning`:6, `Retrieval`:1 |
| SWE-Agent/stummjr__flake8-scrapy-19 | 16 | 23 | `Executing`:8, `Evaluate`:5, `Reasoning`:3 |
| SWE-Agent/tobymao__sqlglot-2395 | 182 | 20 | `Executing`:10, `Grounding`:4, `Evaluate`:3 |
| SWE-Agent/tobymao__sqlglot-2956 | 50 | 19 | `Executing`:7, `Retrieval`:6, `Planning`:2 |
| SWE-Agent/weaveworks__grafanalib-584 | 32 | 30 | `Grounding`:8, `Executing`:8, `Planning`:4 |
| SWE-Agent/wright-group__WrightTools-938 | 26 | 28 | `Executing`:8, `Reasoning`:8, `Retrieval`:6 |
| SWE-Agent/xCDAT__xcdat-257 | 52 | 57 | `Reasoning`:12, `Executing`:11, `Evaluate`:9 |
| SWE-Agent/yukinarit__pyserde-441 | 60 | 28 | `Executing`:12, `Reasoning`:7, `Retrieval`:5 |
| SWE-Agent/zalando-stups__pierone-cli-49 | 26 | 38 | `Executing`:13, `Memory`:7, `Planning`:6 |
| SWE-Agent/zalando-stups__senza-521 | 14 | 22 | `Executing`:7, `Retrieval`:6, `Reasoning`:3 |
