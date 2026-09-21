
(function () {
  var LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="XOXO">   <path d="M32 3c16 0 29 6 29 29s-13 29-29 29S3 48 3 32 16 3 32 3z" fill="#F9C5D1" stroke="#4A3B36" stroke-width="3"/>   <path d="M32 9c13 0 23 5 23 23S45 55 32 55 9 45 9 32 19 9 32 9z" fill="#FFF8F1"/>   <ellipse cx="18" cy="38" rx="5" ry="3" fill="#F9C5D1"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#F9C5D1"/>   <circle cx="24" cy="29" r="3.2" fill="#4A3B36"/><circle cx="40" cy="29" r="3.2" fill="#4A3B36"/>   <circle cx="25.2" cy="27.8" r="1" fill="#fff"/><circle cx="41.2" cy="27.8" r="1" fill="#fff"/>   <path d="M27 38q5 4 10 0" fill="none" stroke="#4A3B36" stroke-width="2.6" stroke-linecap="round"/>   <path d="M44 12l3 3-3 3M50 12l-3 3 3 3" fill="none" stroke="#E2708A" stroke-width="2.4" stroke-linecap="round"/> </svg>';
  var stateEl = document.getElementById('state');
  var dataEl = document.getElementById('data');
  var metaEl = document.getElementById('meta');
  var chartsEl = document.getElementById('charts');
  var state = JSON.parse(stateEl.textContent);
  var data = JSON.parse(dataEl.textContent);
  var meta = JSON.parse(metaEl.textContent);
  var charts = JSON.parse(chartsEl.textContent);
  var app = document.getElementById('app');
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var src = function (s) { return s.indexOf('assets/') === 0 ? s : 'data:image/jpeg;base64,' + s; };
  var ringN = 0;
  var img = function (o, lazy) { ringN++; return '<img class="r' + (ringN % 4) + '" src="' + src(o.s) + '" alt="' + esc(meta.devices[o.d]) + '" data-d="' + o.d + '" data-p="' + o.p + '" tabindex="0"' + (lazy ? ' loading="lazy"' : '') + '>'; };

  function render(editing) {
    ringN = 0;
    var ce = editing ? ' contenteditable="true" spellcheck="true"' : '';
    var h = '<div class="wrap">';
    h += '<div class="top"><div class="brand">' + LOGO + '<p class="kicker">XOXO · building notes</p></div><div class="bar" id="bar"></div></div>';
    h += '<h1 data-k="title"' + ce + '>' + esc(state.title) + '</h1>';
    h += '<p class="dek" data-k="dek"' + ce + '>' + esc(state.dek) + '</p>';
    h += '<p class="by" data-k="by"' + ce + '>' + esc(state.by) + '</p>';
    data.forEach(function (d, i) {
      var s = state.sections[i] || { h: '', p: '', learn: '' };
      h += '<section id="s' + i + '" data-when="' + esc(d.when) + '">';
      h += '<div class="sh"><span class="when">' + esc(d.when) + '</span><h2 data-k="sections.' + i + '.h"' + ce + '>' + esc(s.h) + '</h2><span class="count">' + d.total + ' drawings</span><button type="button" class="cbtn" data-c="s' + i + '" hidden>Comment</button></div>';
      h += '<p class="lead" data-k="sections.' + i + '.p"' + ce + '>' + esc(s.p) + '</p>';
      if (d.strip) h += (d.stripLabel ? '<p class="sl">' + esc(d.stripLabel) + '</p>' : '') + '<div class="strip s' + d.strip.length + '">' + d.strip.map(function (o) { return img(o, false); }).join('') + '</div>';
      if (d.pair) {
        h += '<div class="pair">' + d.pair.map(function (o, k) {
          return '<figure>' + img(o, i > 2) + '<figcaption data-k="sections.' + i + '.cap' + k + '"' + ce + '>' + esc(s['cap' + k] || '') + '</figcaption></figure>';
        }).join('') + '</div>';
      }
      if (d.more && d.more.length) {
        var groups = '';
        if (d.moreLabel) groups += '<p class="sl">' + esc(d.moreLabel) + '</p>';
        groups += d.more.map(function (o) { return img(o, true); }).join('');
        if (d.extra && d.extra.length) groups += '<p class="sl">' + esc(d.extraLabel || '') + '</p>' + (d.extraNote ? '<p class="note">' + esc(d.extraNote) + '</p>' : '') + d.extra.map(function (o) { return img(o, true); }).join('');
        h += '<details><summary>Show ' + (d.more.length + (d.extra ? d.extra.length : 0)) + ' more</summary><div class="more">' + groups + '</div></details>';
      }
      h += '</section>';
    });
    // Numbers
    h += '<section id="numbers" data-when="Numbers"><div class="sh"><span class="when">Numbers</span><h2 data-k="numbersTitle"' + ce + '>' + esc(state.numbersTitle) + '</h2><button type="button" class="cbtn" data-c="numbers" hidden>Comment</button></div>';
    h += '<p class="lead" data-k="numbersLead"' + ce + '>' + esc(state.numbersLead) + '</p>';
    h += figScatter() + figStrip() + figMatrix() + figDumbbell();
    h += '</section>';
    h += '<p class="end" data-k="end"' + ce + '>' + esc(state.end) + '</p>';
    h += '</div>';
    h += '<nav class="rail" id="rail">' + data.map(function (d, i) { return '<a href="#s' + i + '"><b>' + esc(d.when) + '</b><span>' + esc((state.sections[i] || {}).h || '') + '</span></a>'; }).join('') +
      '<a href="#numbers"><b>Numbers</b><span>' + esc(state.numbersTitle) + '</span></a></nav>';
    app.innerHTML = h;
    renderBar(editing);
    showCommentButtons();
    watchRail();
    reveal();
  }

  // Scroll reveal: only elements below the first view get the rise; the first view is at rest.
  var rvObs = null;
  function reveal() {
    if (rvObs) rvObs.disconnect();
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var vh = window.innerHeight;
    var els = app.querySelectorAll('section, figure.fig');
    rvObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rvObs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top > vh * 0.92) { el.classList.add('rv'); rvObs.observe(el); }
    });
  }

  // ---- figures (inline SVG from the charts block) ----
  var C = { ink: '#4A3B36', muted: '#8A7670', rule: '#F9C5D1', berry: '#4A3B36', teal: '#CDEBDD', band: '#FFEFE0', paper: '#fff', blush: '#F9C5D1', lav: '#DDD6F5' };
  var grid = ' stroke="' + C.rule + '" stroke-width="1.5" stroke-dasharray="2 4" stroke-linecap="round"';
  function tip(o) { return ' data-tip="' + esc(o) + '"'; }
  function figScatter() {
    var d = charts.backgrounds, W = 320, H = 300, L = 44, B = 40, T = 14, R = 16;
    var x = function (v) { return L + (v / 0.7) * (W - L - R); }, y = function (v) { return T + (1 - v / 0.7) * (H - T - B); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Differentiation against drift for three background choices">';
    [0, 0.2, 0.4, 0.6].forEach(function (v) {
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '"' + grid + '/>';
      s += '<text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end" fill="' + C.muted + '" font-size="11">' + v.toFixed(1) + '</text>';
      s += '<text x="' + x(v) + '" y="' + (H - B + 16) + '" text-anchor="middle" fill="' + C.muted + '" font-size="11">' + v.toFixed(1) + '</text>';
    });
    s += '<text x="' + (L + (W - L - R) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" fill="' + C.muted + '" font-size="12">Differentiation between moods →</text>';
    s += '<text transform="translate(12 ' + (T + (H - T - B) / 2) + ') rotate(-90)" text-anchor="middle" fill="' + C.muted + '" font-size="12">Drift from the anchor face →</text>';
    d.forEach(function (p) {
      var cx = x(p.diff), cy = p.drift == null ? y(0) : y(p.drift), chosen = p.chosen;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (chosen ? 8 : 6) + '" fill="' + (chosen ? C.berry : C.paper) + '" stroke="' + (chosen ? C.berry : C.ink) + '" stroke-width="2"' + tip(p.name + ': differentiation ' + p.diff + (p.drift == null ? ', drift not measured' : ', drift ' + p.drift)) + '/>';
      s += '<text x="' + (cx + 12) + '" y="' + (cy + 4) + '" fill="' + C.ink + '" font-size="13"' + (chosen ? ' font-weight="600"' : '') + '>' + esc(p.name) + (chosen ? ' · chosen' : '') + '</text>';
    });
    s += '</svg>';
    return '<figure class="fig" style="max-width:360px"><span class="lbl">Figure 1</span>' + s + '<figcaption>How different each background made the avatar look. Up and right means the moods are easier to tell apart but the face is less like you. No scene has no drift value because nothing separated the moods to measure.</figcaption></figure>';
  }
  function figStrip() {
    var labs = charts.strip, rowH = 28, L = 230, R = 24, W = 760, top = 34;
    var x = function (v) { return L + (v / 0.7) * (W - L - R); };
    var out = '';
    labs.forEach(function (l) {
      var hgt = l.rows.length * rowH, H = top + hgt + 34;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(l.name) + ': distance from control per prompt arm">';
      [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].forEach(function (v) {
        s += '<line x1="' + x(v) + '" x2="' + x(v) + '" y1="' + (top - 6) + '" y2="' + (top + hgt + 2) + '"' + grid + '/>';
        s += '<text x="' + x(v) + '" y="' + (H - 8) + '" text-anchor="middle" fill="' + C.muted + '" font-size="13">' + v.toFixed(1) + '</text>';
      });
      s += '<rect x="' + x(0) + '" y="' + (top - 6) + '" width="' + (x(l.floor) - x(0)) + '" height="' + (hgt + 8) + '" fill="' + C.band + '"' + tip(l.name + ': run-to-run floor. The control drawn again lands within ' + l.floor) + '/>';
      s += '<text x="' + L + '" y="' + (top - 14) + '" fill="' + C.ink + '" font-size="15" font-weight="600">' + esc(l.name) + '</text>';
      s += '<text x="' + (x(l.floor) + 5) + '" y="' + (top + 12) + '" fill="' + C.muted + '" font-size="12">floor ' + l.floor + '</text>';
      l.rows.forEach(function (r, i) {
        var cy = top + i * rowH + rowH / 2;
        s += '<text x="' + (L - 12) + '" y="' + (cy + 5) + '" text-anchor="end" fill="' + C.ink + '" font-size="14">' + esc(r.name) + '</text>';
        r.pts.forEach(function (v) {
          var o = v > l.floor;
          s += '<circle cx="' + x(v) + '" cy="' + cy + '" r="6" fill="' + (o ? C.ink : C.blush) + '" stroke="' + C.ink + '" stroke-width="1.5"' + tip(r.name + ': ' + v + (o ? ' (outside the floor: a real change)' : ' (inside the floor: same as a re-run)')) + '/>';
        });
      });
      s += '</svg>';
      out += '<div class="tw">' + s + '</div>';
    });
    return '<figure class="fig"><span class="lbl">Figure 2</span>' + out + '<div class="legend"><span><i style="background:#4A3B36"></i>outside the floor: a real change</span><span><i style="background:#F9C5D1;border:1.5px solid #4A3B36"></i>inside the floor: the same as drawing the control again</span></div><figcaption>How far each prompt moved the drawing from its control, one dot per generation. The shaded band is how far the control wanders when drawn again. Apple’s two knobs stay inside it on both phones; dropping “large sparkling” steps outside.</figcaption></figure>';
  }
  function figMatrix() {
    var m = charts.matrix, cw = 104, rh = 30, L = 200, top = 74, W = L + m.cols.length * cw + 10, H = top + m.rows.length * rh + 10;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Which prompt clauses survive the sheet rewrite, per phone">';
    m.cols.forEach(function (c, j) {
      var cx = L + j * cw + cw / 2;
      s += '<text x="' + cx + '" y="24" text-anchor="middle" fill="' + C.ink + '" font-size="12" font-weight="600">' + esc(c.phone) + '</text>';
      s += '<text x="' + cx + '" y="40" text-anchor="middle" fill="' + C.muted + '" font-size="11">' + esc(c.look) + '</text>';
      s += '<text x="' + cx + '" y="55" text-anchor="middle" fill="' + C.muted + '" font-size="11">' + esc(c.note || '') + '</text>';
    });
    m.rows.forEach(function (r, i) {
      var cy = top + i * rh;
      s += '<text x="' + (L - 12) + '" y="' + (cy + rh / 2 + 4) + '" text-anchor="end" fill="' + C.ink + '" font-size="13">' + esc(r.name) + '</text>';
      r.cells.forEach(function (v, j) {
        var cx = L + j * cw, fill = v === 1 ? C.berry : v === 0 ? C.paper : C.band, mark = v === 1 ? '✓' : v === 0 ? '×' : '–';
        var col = v === 1 ? '#fff' : C.ink;
        s += '<rect x="' + (cx + 2) + '" y="' + (cy + 2) + '" width="' + (cw - 4) + '" height="' + (rh - 4) + '" rx="6" fill="' + fill + '" stroke="' + C.rule + '"' + tip(r.name + ' · ' + m.cols[j].phone + ' (' + m.cols[j].look + '): ' + (v === 1 ? 'kept in the sheet header' : v === 0 ? 'dropped by the rewrite' : 'not in the prompt sent')) + '/>';
        s += '<text x="' + (cx + cw / 2) + '" y="' + (cy + rh / 2 + 5) + '" text-anchor="middle" fill="' + col + '" font-size="14" pointer-events="none">' + mark + '</text>';
      });
    });
    s += '</svg>';
    return '<figure class="fig"><span class="lbl">Figure 3</span><div class="tw">' + s + '</div><div class="legend"><span><i style="background:#4A3B36"></i>kept in the header</span><span><i class="ring"></i>dropped by the rewrite</span><span><i class="lav"></i>not in the prompt</span></div><figcaption>Which words survive the sheet’s rewrite, read off the header it shows before drawing. This rewrite is what a prompt is really tuned against. Headers from the Sep 15, 18 and 20 lab summaries.</figcaption></figure>';
  }
  function figDumbbell() {
    var labs = charts.dumbbell, rowH = 20, L = 190, R = 20, W = 720, top = 22, gap = 22;
    var rows = 0; labs.forEach(function (l) { rows += l.rows.length; });
    var H = top + rows * rowH + labs.length * gap + 28;
    var x = function (v) { return L + (v / 25) * (W - L - R); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Blind likeness and cuteness scores per avatar prompt">';
    [0, 5, 10, 15, 20, 25].forEach(function (v) {
      s += '<line x1="' + x(v) + '" x2="' + x(v) + '" y1="' + (top - 4) + '" y2="' + (H - 22) + '"' + grid + '/>';
      s += '<text x="' + x(v) + '" y="' + (H - 6) + '" text-anchor="middle" fill="' + C.muted + '" font-size="11">' + v + '</text>';
    });
    var yy = top;
    labs.forEach(function (l) {
      s += '<text x="' + L + '" y="' + (yy - 6) + '" fill="' + C.ink + '" font-size="12" font-weight="600">' + esc(l.name) + '</text>';
      l.rows.forEach(function (r, i) {
        var cy = yy + i * rowH + rowH / 2, ctrl = r.control;
        s += '<text x="' + (L - 10) + '" y="' + (cy + 4) + '" text-anchor="end" fill="' + C.ink + '" font-size="12"' + (ctrl ? ' font-weight="600"' : '') + '>' + esc(r.name) + '</text>';
        s += '<line x1="' + x(Math.min(r.like, r.cute)) + '" x2="' + x(Math.max(r.like, r.cute)) + '" y1="' + cy + '" y2="' + cy + '" stroke="' + C.rule + '" stroke-width="2"/>';
        s += '<circle cx="' + x(r.like) + '" cy="' + cy + '" r="5.5" fill="' + C.ink + '" stroke="' + C.paper + '" stroke-width="2"' + tip(r.name + ' likeness ' + r.like + ' / 25' + (r.n > 1 ? ' (mean of ' + r.n + ')' : '')) + '/>';
        s += '<circle cx="' + x(r.cute) + '" cy="' + cy + '" r="5.5" fill="' + C.teal + '" stroke="' + C.ink + '" stroke-width="2"' + tip(r.name + ' cuteness ' + r.cute + ' / 25' + (r.n > 1 ? ' (mean of ' + r.n + ')' : '')) + '/>';
      });
      yy += l.rows.length * rowH + gap;
    });
    s += '</svg>';
    return '<figure class="fig"><span class="lbl">Figure 4</span><div class="tw">' + s + '</div><div class="legend"><span><i style="background:#4A3B36"></i>likeness, 25 points</span><span><i class="mint"></i>cuteness, 25 points</span></div><figcaption>How much like Kyle, and how cute, each avatar prompt drew, scored blind under random file names. Control in bold. Most single edits move nothing. The two that raise likeness most, P07 watercolour and G7 prefix-plus-sentence, pay for it in cuteness; the identity prefix on its own (P11, G1) lifts likeness and keeps cuteness whole.</figcaption></figure>';
  }

  // ---- hover card, click to pin ----
  var card = document.createElement('div');
  card.className = 'card'; card.hidden = true; card.setAttribute('role', 'tooltip');
  document.body.appendChild(card);
  var shownFor = null, pinned = false, curPrompt = '';
  function place(anchorEl) {
    var r = anchorEl.getBoundingClientRect(), cw = Math.min(400, window.innerWidth - 24);
    card.style.width = cw + 'px';
    var x = Math.max(12, Math.min(r.left, window.innerWidth - cw - 12));
    var ch = card.offsetHeight;
    var y = r.bottom + 8 + ch > window.innerHeight ? r.top - ch - 8 : r.bottom + 8;
    if (y < 8) y = 8;
    card.style.left = x + 'px'; card.style.top = y + 'px';
  }
  var hoverT = null;
  function showImageCard(im, pin) {
    shownFor = im; pinned = !!pin; curPrompt = meta.prompts[+im.getAttribute('data-p')];
    var shown = pin || curPrompt.length <= 160 ? curPrompt : curPrompt.slice(0, 150).replace(/\s+\S*$/, '') + '… (click for the full prompt)';
    card.className = 'card' + (pin ? ' pinned' : '');
    card.innerHTML = '<div class="row"><span class="lbl">iPhone model</span><span class="val">' + esc(meta.devices[+im.getAttribute('data-d')]) + '</span></div>' +
      '<div class="row"><span class="lbl">Prompt</span><span class="val">' + esc(shown) + '</span></div>' +
      (pin ? '<div class="acts"><button type="button" id="copyp">Copy prompt</button>' + (commentsNs ? '<button type="button" id="cmtp">Comment on this picture</button>' : '') + '<button type="button" id="closep">Close</button></div>' : '');
    card.hidden = false; place(im); startWatch();
    if (pin) {
      document.getElementById('copyp').onclick = function () {
        var b = this;
        try { navigator.clipboard.writeText(curPrompt).then(function () { b.textContent = 'Copied'; }, function () { b.textContent = 'Select and copy'; }); } catch (e) { b.textContent = 'Select and copy'; }
      };
      var cb = document.getElementById('cmtp'); if (cb) cb.onclick = function () { openComposerOn(im); };
      document.getElementById('closep').onclick = hideCard;
    }
  }
  function showTipCard(el) {
    shownFor = el; pinned = false; card.className = 'card';
    card.innerHTML = '<div class="row"><span class="val">' + esc(el.getAttribute('data-tip')) + '</span></div>';
    card.hidden = false; place(el);
  }
  var watch = null;
  function startWatch() {
    clearInterval(watch);
    watch = setInterval(function () {
      if (!shownFor) { clearInterval(watch); return; }
      var over = false;
      try { over = shownFor.matches(':hover') || (pinned && card.matches(':hover')); } catch (e) { over = true; }
      if (!over && !(pinned && document.activeElement && card.contains(document.activeElement))) hideCard();
    }, 150);
  }
  function hideCard() { clearTimeout(hoverT); clearInterval(watch); shownFor = null; pinned = false; card.hidden = true; }
  app.addEventListener('mouseover', function (e) {
    if (pinned) return;
    clearTimeout(hoverT);
    var im = e.target.closest && e.target.closest('img[data-d]');
    var t = im || (e.target.closest && e.target.closest('[data-tip]'));
    if (!t) { if (shownFor) hideCard(); return; }
    hoverT = setTimeout(function () { im ? showImageCard(im, false) : showTipCard(t); }, 80);
  });
  app.addEventListener('mouseout', function (e) {
    if (pinned) return;
    clearTimeout(hoverT);
    var t = e.target.closest && (e.target.closest('img[data-d]') || e.target.closest('[data-tip]'));
    if (t && t === shownFor) hideCard();
  });
  app.addEventListener('mouseleave', function () { if (!pinned) hideCard(); });
  document.addEventListener('mousemove', function (e) {
    if (!shownFor) return;
    var t = e.target;
    var onSubject = t === shownFor || (shownFor.contains && shownFor.contains(t));
    var onCard = pinned && card.contains(t);
    if (!onSubject && !onCard) hideCard();
  }, { passive: true });
  document.addEventListener('visibilitychange', hideCard);
  window.addEventListener('blur', hideCard);
  document.addEventListener('mouseleave', hideCard);
  document.documentElement.addEventListener('mouseleave', hideCard);
  app.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var im = e.target.closest && e.target.closest('img[data-d]');
    if (im) { e.preventDefault(); pinned && shownFor === im ? hideCard() : showImageCard(im, true); }
  });
  app.addEventListener('click', function (e) {
    var im = e.target.closest && e.target.closest('img[data-d]');
    if (im) { e.preventDefault(); if (pinned && shownFor === im) hideCard(); else showImageCard(im, true); return; }
    var t = e.target.closest && e.target.closest('[data-tip]');
    if (t) { showTipCard(t); return; }
    if (pinned) hideCard();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideCard(); });
  window.addEventListener('scroll', function () { if (shownFor && !pinned) hideCard(); else if (pinned && shownFor) place(shownFor); }, { passive: true });

  // ---- timeline rail ----
  var railObs = null;
  function watchRail() {
    if (railObs) railObs.disconnect();
    var links = {}; app.querySelectorAll('.rail a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    if (!('IntersectionObserver' in window)) return;
    railObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { Object.keys(links).forEach(function (k) { links[k].classList.toggle('on', k === en.target.id); }); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    app.querySelectorAll('section[id]').forEach(function (s) { railObs.observe(s); });
  }

  // ---- edit and save ----
  var artifactNs = null, canWrite = true, busy = false;
  function renderBar(editing) {
    var bar = document.getElementById('bar');
    if (!bar) return;
    if (!artifactNs || !canWrite) { bar.innerHTML = ''; return; }
    if (!editing) {
      bar.innerHTML = '<button id="edit" type="button">Edit text</button>';
      document.getElementById('edit').onclick = function () { render(true); };
    } else {
      bar.innerHTML = '<button id="cancel" type="button">Cancel</button><button id="save" type="button" class="primary">Save</button><span class="status" id="status"></span>';
      document.getElementById('cancel').onclick = function () { render(false); };
      document.getElementById('save').onclick = save;
    }
  }
  function collect() {
    var next = JSON.parse(JSON.stringify(state));
    app.querySelectorAll('[data-k]').forEach(function (el) {
      var path = el.getAttribute('data-k').split('.');
      var o = next;
      for (var i = 0; i < path.length - 1; i++) { if (o[path[i]] === undefined) o[path[i]] = {}; o = o[path[i]]; }
      o[path[path.length - 1]] = el.innerText.replace(/\s+/g, ' ').trim();
    });
    return next;
  }
  function buildDocument(nextState) {
    var link = '';
    document.head.querySelectorAll('link[rel="stylesheet"],link[rel="preconnect"]').forEach(function (l) { link += l.outerHTML; });
    var js = function (o) { return JSON.stringify(o).replace(/<\//g, '<\\/'); };
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
      '<title>' + esc(document.title || '1,489 Drawings Later') + '</title>' + link +
      '<style id="css">' + document.getElementById('css').textContent + '</style></head><body>' +
      '<script type="application/json" id="state">' + js(nextState) + '<\/script>' +
      '<script type="application/json" id="meta">' + metaEl.textContent + '<\/script>' +
      '<script type="application/json" id="charts">' + chartsEl.textContent + '<\/script>' +
      '<script type="application/json" id="data">' + dataEl.textContent + '<\/script>' +
      '<div id="app"></div>' +
      '<script id="main">' + document.getElementById('main').textContent + '<\/script>' +
      '</body></html>';
  }
  function save() {
    if (busy) return;
    var next = collect();
    var status = document.getElementById('status');
    var btn = document.getElementById('save');
    busy = true; btn.disabled = true; status.textContent = 'Saving…';
    try { sessionStorage.setItem('draft-1489', JSON.stringify(next)); } catch (e) {}
    artifactNs.publish(buildDocument(next)).then(function () {
      status.textContent = 'Saved. Reloading…';
      try { sessionStorage.removeItem('draft-1489'); } catch (e) {}
    }).catch(function (err) {
      busy = false; btn.disabled = false;
      var code = err && err.code;
      if (code === 'conflict') { status.textContent = 'Someone else saved first. Reloading to their version.'; return; }
      if (code === 'not_writer' || code === 'not_granted' || code === 'not_declared' || code === 'consent_required') { canWrite = false; state = next; render(false); return; }
      if (code === 'too_large') { status.textContent = 'Too large to save.'; return; }
      if (code === 'rate_limited') { status.textContent = 'Saving too often. Wait a moment.'; return; }
      status.textContent = 'Could not save. Try once more.';
    });
  }

  // ---- comments ----
  var commentsNs = null;
  function showCommentButtons() { app.querySelectorAll('.cbtn').forEach(function (b) { b.hidden = !commentsNs; }); }
  function openComposerOn(el) {
    if (!commentsNs) return;
    commentsNs.openComposer({ element: el }).catch(function (err) { if (err && err.code === 'unavailable') { commentsNs = null; showCommentButtons(); } });
  }
  app.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.cbtn');
    if (b) { var sec = document.getElementById(b.getAttribute('data-c')); if (sec) openComposerOn(sec); }
  });

  var pendingDraft = false;
  render(false);
  try { var d = sessionStorage.getItem('draft-1489'); if (d) { state = JSON.parse(d); pendingDraft = true; render(false); } } catch (e) {}
  var STATIC = true;
  var tries = 0;
  (function hook() {
    if (STATIC) return;
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('artifact').then(function (ns) { artifactNs = ns; if (ns && pendingDraft) { pendingDraft = false; render(true); } else if (ns) renderBar(false); }).catch(function () {});
      window.claude.use('comments').then(function (ns) { commentsNs = ns; showCommentButtons(); }).catch(function () {});
    } else if (tries++ < 40) setTimeout(hook, 250);
  })();
})();
