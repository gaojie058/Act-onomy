(() => {
  'use strict';
  const data = window.ACTONOMY_DATA;
  if (!data) return;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const aliases = {Evaluate: 'Evaluating', Reflection: 'Reflecting'};
  const label = name => aliases[name] || name;
  const groups = {
    Grounding: {color:'#54879b', bg:'#e8f1f4', description:'Connect with people, agents, tools, and environments.'},
    Retrieval: {color:'#6d91a8', bg:'#e9f1f5', description:'Bring relevant information into the current task.'},
    Reasoning: {color:'#9d8766', bg:'#f2ede3', description:'Analyze, generate, compare, and make sense of information.'},
    Planning: {color:'#7a9052', bg:'#eaf0de', description:'Break down a goal and organize the steps to pursue it.'},
    Evaluate: {color:'#5b9083', bg:'#e5f0eb', description:'Assess an outcome against references, requirements, or criteria.'},
    Deciding: {color:'#b18b50', bg:'#f4eddf', description:'Choose an action, an alternative, or whether to proceed.'},
    Executing: {color:'#65866b', bg:'#e9f0e5', description:'Carry out a plan, make a change, or finish the task.'},
    Reflection: {color:'#a07d9b', bg:'#f1eaf1', description:'Reconsider outcomes, errors, and feedback to inform what happens next.'},
    Learning: {color:'#8c83b2', bg:'#eeecf5', description:'Change knowledge, skills, instructions, or model parameters.'},
    Memory: {color:'#a0846c', bg:'#f2ece6', description:'Store, update, retrieve, consolidate, or discard remembered information.'}
  };
  const order = Object.keys(groups);
  const style = group => `--category:${groups[group]?.color || '#789169'};--category-bg:${groups[group]?.bg || '#ecf0e5'}`;
  const tax = data.taxonomy.taxonomy;
  const evidenceByCode = new Map();
  for (const row of data.codebook) {
    const code = row.taxonomy_code;
    if (!evidenceByCode.has(code)) evidenceByCode.set(code, []);
    evidenceByCode.get(code).push(row);
  }
  const leaves = tax.flatMap(action => action.subactions.flatMap(sub => sub.instances.map(leaf => ({...leaf, action: action.name, sub: sub.name, subCode: sub.code, evidence: evidenceByCode.get(leaf.code) || []}))));
  const taxState = {action:'Planning', query:'', leaf:'T2.1.1.2'};
  const traceState = {trace:0, turn:6, quote:2, filter:'all'};
  const heroState = {turn:6, annotated:true};

  const citation = `@misc{gao2026interpret,
  title = {How to Interpret Agent Behavior},
  author = {Jie Gao and Kaiser Sun and Jen-tse Huang and
            Katherine Van Koevering and Sijie Ji and Heyuan Huang and
            Weiyan Shi and Zhuoran Lu and Ziang Xiao and
            Daniel Khashabi and Mark Dredze},
  year = {2026},
  eprint = {2605.13625},
  archivePrefix = {arXiv},
  primaryClass = {cs.AI},
  url = {https://arxiv.org/abs/2605.13625}
}`;

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* try selection-based fallback */ }
    }
    const field = document.createElement('textarea');
    field.value = text;
    field.style.cssText = 'position:fixed;left:-10000px;top:0';
    document.body.appendChild(field);
    field.select();
    let result = false;
    try { result = document.execCommand('copy'); } catch (_) { result = false; }
    field.remove();
    return result;
  }

  function renderHero() {
    const turn = data.traces[0].turns.find(t => t.n === heroState.turn);
    const quoteIndex = heroState.turn === 6 ? 2 : heroState.turn === 8 ? 2 : 0;
    const annotation = turn.quotes[quoteIndex];
    const snippets = {
      6: 'To verify that this change resolves the issue, we should create a script that replicates the problem as described.',
      8: "Let's run the script to see if it executes successfully without encountering the issue described.",
      9: 'The script ran successfully and received a 200 OK response, which indicates that the issue with handling binary method strings has been resolved.'
    };
    const text = snippets[heroState.turn];
    const index = text.indexOf(annotation.quote);
    $('#hero-quote').innerHTML = heroState.annotated && index >= 0
      ? esc(text.slice(0,index)) + `<mark>${esc(annotation.quote)}</mark>` + esc(text.slice(index + annotation.quote.length))
      : esc(text);
    $('#hero-turn-label').textContent = `TURN ${String(turn.n).padStart(2,'0')} · VERIFY`;
    $('#hero-annotation').innerHTML = heroState.annotated
      ? `<span class="annotation-path"><b>${esc(label(annotation.grp))}</b> <span aria-hidden="true"> / </span> ${esc(annotation.sub)}</span><span class="annotation-leaf">${esc(annotation.leaf)}</span>`
      : '<span class="annotation-empty">What behavior do you see in these words?</span>';
    for (const mode of ['raw','annotated']) {
      const active = (mode === 'annotated') === heroState.annotated;
      $(`#hero-${mode}`).classList.toggle('active', active);
      $(`#hero-${mode}`).setAttribute('aria-pressed', active);
    }
    $$('[data-hero-turn]').forEach(button => {
      const active = Number(button.dataset.heroTurn) === heroState.turn;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active);
    });
  }
  if ($('#hero-quote')) {
  $('#hero-raw').addEventListener('click', () => {heroState.annotated = false; renderHero();});
  $('#hero-annotated').addEventListener('click', () => {heroState.annotated = true; renderHero();});
  $$('[data-hero-turn]').forEach(button => button.addEventListener('click', () => {heroState.turn = Number(button.dataset.heroTurn); renderHero();}));
  }

  function matches(leaf) {
    const q = taxState.query.toLowerCase().trim();
    return !q || [leaf.name, leaf.definition, leaf.code, leaf.action, label(leaf.action), leaf.sub, ...leaf.evidence.map(e => e.examples_raw)].join(' ').toLowerCase().includes(q);
  }

  function renderTaxonomy(resetScroll = false) {
    const query = taxState.query.trim();
    const resultLeaves = leaves.filter(leaf => matches(leaf) && (query || leaf.action === taxState.action));
    const selected = resultLeaves.find(leaf => leaf.code === taxState.leaf) || resultLeaves[0];
    if (selected) taxState.leaf = selected.code;
    $('#action-list').innerHTML = order.map(action => {
      const count = leaves.filter(leaf => leaf.action === action && matches(leaf)).length;
      const active = !query && action === taxState.action;
      return `<button data-action="${esc(action)}" class="${active?'active':''}" aria-pressed="${active}" style="${style(action)}"><span class="category-dot"></span><span>${esc(label(action))}</span><span>${count}</span></button>`;
    }).join('');
    if (query) {
      $('#action-heading').innerHTML = `<div class="action-title-row"><h3>Search the vocabulary</h3></div><p>Matching “${esc(query)}” across all 10 actions.</p><div class="action-meta"><span>${resultLeaves.length} LEAF ${resultLeaves.length === 1?'CATEGORY':'CATEGORIES'}</span></div>`;
      $('#taxonomy-count').textContent = `${resultLeaves.length} of ${leaves.length} leaf categories`;
    } else {
      const action = tax.find(a => a.name === taxState.action);
      $('#action-heading').innerHTML = `<div class="action-title-row" style="${style(action.name)}"><span class="category-dot"></span><h3>${esc(label(action.name))}</h3></div><p>${esc(groups[action.name].description)}</p><div class="action-meta"><span>${action.subactions.length} SUBACTIONS</span><span>${resultLeaves.length} LEAF CATEGORIES</span></div>`;
      $('#taxonomy-count').textContent = `${leaves.length} leaf categories`;
    }
    $('#reset-taxonomy').hidden = !query;
    const subGroups = new Map();
    resultLeaves.forEach(leaf => {
      const key = leaf.subCode;
      if (!subGroups.has(key)) subGroups.set(key, {action:leaf.action, name:leaf.sub, code:leaf.subCode, items:[]});
      subGroups.get(key).items.push(leaf);
    });
    $('#taxonomy-results').innerHTML = resultLeaves.length ? [...subGroups.values()].map(sub => `<div class="subaction-group"><div class="subaction-title">${query ? esc(label(sub.action)) + ' / ' : ''}${esc(sub.name)}<span>${esc(sub.code)}</span></div>${sub.items.map(leaf => `<button class="leaf-button ${leaf.code===taxState.leaf?'active':''}" data-leaf="${esc(leaf.code)}" aria-pressed="${leaf.code===taxState.leaf}"><span>${esc(leaf.name)}</span><span aria-hidden="true">↗</span></button>`).join('')}</div>`).join('') : '<div class="empty-results">No categories found.<br>Try “memory”, “plan”, or a code such as T2.1.</div>';
    renderLeaf(selected);
    if (resetScroll) $('.taxonomy-content').scrollTop = 0;
  }

  function renderLeaf(leaf) {
    if (!leaf) { $('#leaf-detail').innerHTML = '<div class="empty-results">Select a category to explore its evidence.</div>'; return; }
    const references = [...new Set(leaf.evidence.map(e => e.papers_cited).filter(Boolean))].join('; ');
    const theory = leaf.evidence.some(e => (e['human reviewers'] || '').includes('theory'));
    $('#leaf-detail').innerHTML = `<div class="detail-main"><div class="mono">A CLOSER LOOK</div><span class="detail-code mono">${esc(leaf.code)}</span><h4>${esc(leaf.name)}</h4><p class="detail-breadcrumb">${esc(label(leaf.action))} <span aria-hidden="true">→</span> ${esc(leaf.sub)}</p></div><div class="detail-evidence"><div class="detail-rule"></div><div class="mono">RELEASED DEFINITION / EXAMPLE</div><p class="detail-definition">${esc(leaf.definition)}</p><p class="detail-reference">${references ? 'Codebook references: ' + esc(references) : theory ? 'Theory-driven entry in the codebook.' : 'Source: the released taxonomy JSON.'}</p></div><div class="detail-actions"><button class="detail-copy" id="copy-category">Copy category link <span aria-hidden="true">↗</span></button><p id="category-copy-status" class="detail-feedback" role="status"></p></div>`;
    $('#copy-category').addEventListener('click', async () => {
      const url = new URL(window.location.href);
      url.hash = `taxonomy/${encodeURIComponent(leaf.code)}`;
      const copied = await copyText(url.href);
      $('#category-copy-status').textContent = copied ? 'Link copied.' : `Category: ${leaf.code}. Select the page URL to copy.`;
    });
  }

  if ($('#taxonomy')) {
  $('#action-list').addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    taxState.action = button.dataset.action;
    taxState.query = ''; $('#taxonomy-search').value = '';
    taxState.leaf = leaves.find(leaf => leaf.action === taxState.action).code;
    renderTaxonomy(true);
    $(`[data-action="${CSS.escape(taxState.action)}"]`).focus({preventScroll:true});
  });
  $('#taxonomy-results').addEventListener('click', event => {
    const button = event.target.closest('[data-leaf]');
    if (!button) return;
    taxState.leaf = button.dataset.leaf;
    $$('.leaf-button').forEach(item => {
      const active = item.dataset.leaf === taxState.leaf;
      item.classList.toggle('active', active); item.setAttribute('aria-pressed', active);
    });
    renderLeaf(leaves.find(leaf => leaf.code === taxState.leaf));
    history.replaceState(null, '', `#taxonomy/${encodeURIComponent(taxState.leaf)}`);
    if (window.innerWidth <= 900) $('#leaf-detail').scrollIntoView({block:'nearest'});
  });
  $('#taxonomy-search').addEventListener('input', event => {taxState.query = event.target.value; renderTaxonomy(true);});
  $('#reset-taxonomy').addEventListener('click', () => {taxState.query = '';$('#taxonomy-search').value = '';renderTaxonomy(true);$('#taxonomy-search').focus();});
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.metaKey && !event.ctrlKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
      event.preventDefault(); $('#taxonomy').scrollIntoView(); $('#taxonomy-search').focus({preventScroll:true});
    }
  });
  }

  function activeTrace() { return data.traces[traceState.trace]; }
  const isHuman = turn => turn.kind === 'interaction' || turn.actor === 'human';
  const eventId = turn => isHuman(turn) ? turn.id : `T${turn.n}`;
  const turnQuotes = turn => turn.quotes || [];
  const activeTurn = () => activeTrace().turns[traceState.turn - 1];
  function selectTurn(position, quote = 0) {
    traceState.turn = Math.max(1, Math.min(position, activeTrace().turns.length));
    traceState.quote = quote;
    renderTrace();
  }
  function selectTrace(index) {
    traceState.trace = index;
    traceState.filter = 'all';
    const trace = activeTrace();
    const initial = trace.initial_event && trace.turns.findIndex(t => eventId(t) === trace.initial_event);
    selectTurn(trace.initial_event ? initial + 1 : index === 0 ? 6 : 16, trace.initial_event ? 0 : 2);
  }
  function keepTurnVisible() {
    const scroller = $('.timeline-scroll');
    const selected = $('.timeline-turn.active');
    if (!selected) return;
    const a = selected.getBoundingClientRect(), b = scroller.getBoundingClientRect();
    if (a.left < b.left || a.right > b.right) scroller.scrollLeft += a.left - b.left - (b.width - a.width) / 2;
  }
  function renderTrace() {
    const trace = activeTrace(), turn = activeTurn();
    const human = isHuman(turn), mixed = trace.turns.some(isHuman);
    const agentCount = trace.turns.filter(t => !isHuman(t)).length;
    const humanCount = trace.turns.length - agentCount;
    const count = trace.turns.reduce((n,t) => n + turnQuotes(t).length, 0);
    $('#trace-name').textContent = trace.display_name || trace.instance_id;
    $('#trace-model').textContent = mixed ? 'SWE-CHAT · CLAUDE CODE' : 'SWE-AGENT · GPT-4 TURBO';
    $('#trace-meta').textContent = `${agentCount} ${mixed ? 'AGENT TURNS · ' + humanCount + ' HUMAN INPUTS' : 'TURNS'} · ${count} QUOTE ANNOTATIONS`;
    $('#trace-report-link').href = trace.report_url;
    $('#trace-json-link').href = trace.download_url;
    $('#trace-source-note').textContent = mixed
      ? 'Outcome and annotations are retained from the supplied SWE-chat report. Human inputs are shown separately from agent behavior labels; labels may extend the released taxonomy.'
      : 'Labels describe observed behavior; they are not a quality score. Case-study labels include extensions to the released taxonomy.';
    $('#swe-agent-note').hidden = mixed;
    $('#swe-chat-note').hidden = !mixed;
    $$('[data-trace]').forEach(button => {
      const active = Number(button.dataset.trace) === traceState.trace;
      button.classList.toggle('active', active);button.setAttribute('aria-pressed', active);
    });
    $('.timeline-track').style.minWidth = mixed ? `${trace.turns.length * 30}px` : '';
    $('#timeline-instruction').textContent = mixed ? 'H = human input · T = agent turn · scroll to explore' : 'Choose a turn to inspect its evidence';
    $('#trace-timeline').innerHTML = trace.turns.map((t,i) => {
      const cats = [...new Set(turnQuotes(t).map(q => q.grp))];
      const humanStep = isHuman(t), active = i + 1 === traceState.turn;
      const dimmed = traceState.filter !== 'all' && (traceState.filter === 'human' ? !humanStep : !cats.includes(traceState.filter));
      return `<button data-turn="${i+1}" data-event="${eventId(t)}" class="timeline-turn ${humanStep?'human-turn':''} ${active?'active':''} ${dimmed?'dimmed':''}" aria-label="${humanStep?'Human input '+t.id:'Agent turn '+t.n}: ${esc(t.headline)}" aria-pressed="${active}" title="${esc(t.headline)}"><span class="timeline-bars">${humanStep?'<b aria-hidden="true">H</b>':cats.map(group => `<i style="${style(group)}" aria-hidden="true"></i>`).join('')}</span><span>${mixed?eventId(t):String(t.n).padStart(2,'0')}</span></button>`;
    }).join('');
    const phaseStarts = trace.segments.map(segment => {
      let index = trace.turns.findIndex(t => !isHuman(t) && t.n === segment.start);
      while (index > 0 && isHuman(trace.turns[index-1])) index--;
      return index;
    });
    $('#timeline-phases').innerHTML = trace.segments.map((segment,i) => {
      const names = {'Agent locates the bug':'Locate','Agent patches the bug':'Patch','Agent verifies the fix':'Verify','Agent submits':'Submit','Agent searches for the bug':'Locate','Agent hits a dead end in helpers.py':'Investigate','Agent hits a second dead end':'Investigate','Agent finds the right spot':'Inspect','Agent patches, recovers, and submits':'Patch & submit'};
      const length = (phaseStarts[i+1] ?? trace.turns.length) - phaseStarts[i];
      return `<span class="timeline-phase" style="flex:${length}" title="${esc(segment.title)}">${esc(trace.phase_short_names?.[i] || names[segment.title] || segment.title)}</span>`;
    }).join('');
    $('#human-jumps').hidden = !mixed;
    $('#human-jumps').innerHTML = mixed ? '<span class="mono">HUMAN INPUTS</span>' + trace.turns.map((t,i) => isHuman(t) ? `<button data-human-step="${i+1}" class="${i+1===traceState.turn?'active':''}" aria-pressed="${i+1===traceState.turn}" title="${esc(t.label)}">${esc(t.id)}</button>` : '').join('') : '';
    const quoteCounts = {};
    trace.turns.forEach(t => turnQuotes(t).forEach(q => quoteCounts[q.grp] = (quoteCounts[q.grp] || 0) + 1));
    $('#trace-filters').innerHTML = `<button class="filter-chip ${traceState.filter==='all'?'active':''}" data-filter="all" aria-pressed="${traceState.filter==='all'}">${mixed?'All steps':'All actions'}</button>` + (mixed ? `<button class="filter-chip ${traceState.filter==='human'?'active':''}" data-filter="human" aria-pressed="${traceState.filter==='human'}">Human input <span>${humanCount}</span></button>` : '') + order.filter(group => quoteCounts[group]).map(group => `<button class="filter-chip ${traceState.filter===group?'active':''}" data-filter="${esc(group)}" aria-pressed="${traceState.filter===group}" style="${style(group)}" title="${quoteCounts[group]} quote annotations"><span class="category-dot"></span>${esc(label(group))}<span>${quoteCounts[group]}</span></button>`).join('');
    $('#turn-kicker').textContent = human ? `${turn.id} · HUMAN INPUT · ${turn.label.toUpperCase()}` : `${mixed?'T'+turn.n+' · AGENT ':''}TURN ${String(turn.n).padStart(2,'0')} / ${String(agentCount).padStart(2,'0')} · ${(turn.phase_label || '').toUpperCase()}`;
    $('#turn-title').textContent = turn.headline;
    $('#turn-text-label').textContent = human ? 'HUMAN MESSAGE' : 'AGENT THOUGHT';
    $('#turn-text-label').hidden = !human && !turn.thought;
    $('#turn-thought').hidden = !human && !turn.thought;
    $('.command-block').hidden = human || !turn.action;
    $('.observation').hidden = human || !turn.obs;
    $('#turn-observation').textContent = turn.obs || '';
    $('#annotation-count').textContent = human ? 'Human input' : `${turnQuotes(turn).length} labels`;
    $('#evidence-title').textContent = human ? 'HUMAN INTERACTION' : 'ANNOTATION → EVIDENCE';
    $('#evidence-hint').textContent = human ? 'This is the human’s original message. Agent behavior labels appear on the following turns.' : 'Select a label to highlight its exact words in the thought or action.';
    $('#previous-turn').disabled = traceState.turn === 1;
    $('#next-turn').disabled = traceState.turn === trace.turns.length;
    $('.observation').open = false;
    const preceding = trace.turns.slice(0, traceState.turn - 1).map((t,i) => ({t,i})).filter(({t}) => isHuman(t)).pop();
    $('#human-context').hidden = !mixed || human || !preceding;
    if (mixed && !human && preceding) {
      const text = preceding.t.text;
      $('#human-context').innerHTML = `<span class="mono">LATEST HUMAN INPUT · ${esc(preceding.t.id)}</span><p>${esc(text.length > 240 ? text.slice(0,240) + '…' : text)}</p><button class="inline-link" data-human-step="${preceding.i+1}">Read the full message →</button>`;
    }
    renderAnnotations();
    keepTurnVisible();
  }
  function renderAnnotations() {
    const turn = activeTurn(), quotes = turnQuotes(turn);
    if (isHuman(turn)) {
      $('#turn-thought').textContent = turn.text;
      $('#turn-command').textContent = '';
      const nextPosition = traceState.turn + 1;
      const next = activeTrace().turns[nextPosition-1];
      $('#turn-annotations').innerHTML = `<div class="human-evidence"><span class="mono">${esc(turn.id)} · ${esc(turn.label)}</span><p>${esc(turn.headline)}</p>${next ? `<button class="inline-link" data-follow-turn="${nextPosition}">Follow the response at ${eventId(next)} →</button>` : ''}</div>`;
      $('#selected-evidence').innerHTML = '';
      return;
    }
    if (traceState.quote >= quotes.length) traceState.quote = 0;
    $('#turn-annotations').innerHTML = quotes.map((quote, i) => `<button class="annotation-button ${i===traceState.quote?'active':''}" data-quote="${i}" aria-pressed="${i===traceState.quote}" style="${style(quote.grp)}"><span class="annotation-group"><span class="category-dot"></span>${esc(label(quote.grp))}<span class="annotation-target">${quote.target === 'action'?'ACTION':'THOUGHT'}</span></span><span class="annotation-name">${esc(quote.leaf)}</span><span class="annotation-sub">${esc(quote.sub)}</span></button>`).join('');
    const selected = quotes[traceState.quote];
    const target = selected?.target === 'action' ? 'action' : 'thought';
    const text = turn[target] || '';
    const index = selected ? text.indexOf(selected.quote) : -1;
    const colors = groups[selected?.grp] || groups.Planning;
    for (const [field,id] of [['thought','turn-thought'],['action','turn-command']]) {
      const value = turn[field] || '';
      $('#'+id).innerHTML = field === target && index >= 0
        ? esc(value.slice(0,index)) + `<mark style="--highlight:${colors.bg};--highlight-ink:${colors.color}">${esc(selected.quote)}</mark>` + esc(value.slice(index+selected.quote.length))
        : esc(value);
    }
    $('#selected-evidence').innerHTML = selected ? `<span class="mono">${index>=0?'HIGHLIGHTED IN '+target.toUpperCase():'ANNOTATED EVIDENCE'}</span><blockquote>${esc(selected.quote)}</blockquote>` : '<p>No quote annotations for this turn.</p>';
    const command = $('#turn-command'), mark = $('mark', command);
    command.scrollTop = mark ? mark.getBoundingClientRect().top - command.getBoundingClientRect().top + command.scrollTop - 35 : 0;
  }
  if ($('#traces')) {
    $$('[data-trace]').forEach(button => button.addEventListener('click', () => selectTrace(Number(button.dataset.trace))));
    $('#trace-timeline').addEventListener('click', event => {
      const button = event.target.closest('[data-turn]');
      if (!button) return;
      const position = Number(button.dataset.turn), turn = activeTrace().turns[position-1];
      selectTurn(position, Math.max(0,turnQuotes(turn).findIndex(q => q.grp === traceState.filter)));
    });
    $('#traces').addEventListener('click', event => {
      const button = event.target.closest('[data-human-step], [data-follow-turn]');
      if (button) { traceState.filter = 'all'; selectTurn(Number(button.dataset.humanStep || button.dataset.followTurn)); }
    });
    $('#trace-filters').addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      traceState.filter = button.dataset.filter;
      const matchesFilter = t => traceState.filter === 'human' ? isHuman(t) : turnQuotes(t).some(q => q.grp === traceState.filter);
      if (traceState.filter !== 'all') {
        const index = matchesFilter(activeTurn()) ? traceState.turn-1 : activeTrace().turns.findIndex(matchesFilter);
        if (index >= 0) {
          traceState.turn = index+1;
          traceState.quote = Math.max(0,turnQuotes(activeTurn()).findIndex(q => q.grp === traceState.filter));
        }
      }
      renderTrace();
      $(`[data-filter="${CSS.escape(traceState.filter)}"]`).focus({preventScroll:true});
    });
    $('#turn-annotations').addEventListener('click', event => {const button = event.target.closest('[data-quote]');if(button){traceState.quote = Number(button.dataset.quote);renderAnnotations();}});
    $('#previous-turn').addEventListener('click', () => {if(traceState.turn>1) selectTurn(traceState.turn-1);});
    $('#next-turn').addEventListener('click', () => {if(traceState.turn<activeTrace().turns.length) selectTurn(traceState.turn+1);});
    $('#compare-evidence').addEventListener('click', () => {
      traceState.trace = traceState.trace === 0 ? 1 : 0;traceState.filter = 'all';
      selectTurn(traceState.trace === 0 ? 9 : 16, traceState.trace === 0 ? 0 : 2);
      $('.trace-viewer').scrollIntoView({block:'start'});
    });
    $('#jump-human-feedback').addEventListener('click', () => {
      selectTrace(2);
      $('.turn-panel').scrollIntoView({block:'start'});
    });
  }

  if ($('#citation-text')) {
  $('#citation-text').textContent = citation;
  $('#copy-citation').addEventListener('click', async () => {
    const copied = await copyText(citation);
    $('#copy-citation').textContent = copied ? 'Copied ✓' : 'Select citation below';
    $('#copy-status').textContent = copied ? 'BibTeX copied to clipboard.' : 'Copy failed. The citation is expanded below for manual copying.';
    if (!copied) $('.citation-details').open = true;
    setTimeout(() => {$('#copy-citation').innerHTML = 'Copy BibTeX <span aria-hidden="true">↗</span>';}, 2500);
  });
  }
  function readHash() {
    if (!$('#taxonomy')) return;
    if (location.hash.startsWith('#traces/c621c551')) {
      selectTrace(2);
      const id = location.hash.split('/')[2];
      const index = activeTrace().turns.findIndex(t => eventId(t) === id);
      if (index >= 0) selectTurn(index + 1);
      requestAnimationFrame(() => $('#traces').scrollIntoView({behavior:'instant'}));
      return;
    }
    const match = location.hash.match(/^#taxonomy\/(.+)$/);
    if (!match) return;
    let code;
    try { code = decodeURIComponent(match[1]); } catch (_) { return; }
    const leaf = leaves.find(l => l.code === code);
    if (!leaf) return;
    taxState.leaf = leaf.code;taxState.action = leaf.action;taxState.query = '';
    $('#taxonomy-search').value = '';renderTaxonomy();
    requestAnimationFrame(() => {
      $('#taxonomy').scrollIntoView({behavior:'instant'});
      const item = $(`[data-leaf="${CSS.escape(code)}"]`);
      if (item) $('.taxonomy-content').scrollTop = item.offsetTop - $('.taxonomy-content').offsetTop - 100;
    });
  }
  window.addEventListener('hashchange', readHash);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {if(entry.isIntersecting) $$('nav a').forEach(link => link.classList.toggle('active',link.hash === `#${entry.target.id}`));});
    }, {rootMargin:'-20% 0px -60% 0px'});
    $$('main section[id]').forEach(section => observer.observe(section));
  }
  if ($('#hero-quote')) renderHero();
  if ($('#taxonomy')) renderTaxonomy();
  if ($('#traces')) renderTrace();
  readHash();
})();
