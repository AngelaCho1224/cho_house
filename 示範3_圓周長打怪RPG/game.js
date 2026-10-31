/* 可編輯遊戲設定。題目、選項、答案與解析位於 questions.js。 */
(() => {
  'use strict';
  const CONFIG = {
    maxHp: 100, attack: 20, enemyHp: 120, correctGold: 12, reviewGold: 6,
    potion: { price: 30, heal: 40 }, crystal: { price: 45, bonus: 5, limit: 3 },
    revive: { price: 60, heal: 60, limit: 1 },
    stages: [
      { name: '野狼', fullName: '森林野狼', image: 'wolf', place: '苔蘚小徑', damage: 12 },
      { name: '毒蠍', fullName: '紫晶毒蠍', image: 'scorpion', place: '蕨葉谷地', damage: 14 },
      { name: '惡鬼', fullName: '青角惡鬼', image: 'oni', place: '古樹祕境', damage: 16 },
      { name: '巨龍', fullName: '琥珀巨龍', image: 'dragon', place: '龍眠之丘', damage: 18 },
      { name: '魔王', fullName: '暮光魔王', image: 'demon', place: '森林王座', damage: 20 }
    ]
  };
  const TYPES = {
    diameter: { title: '已知直徑，求圓周長', formula: '圓周長＝直徑 × π' },
    radius: { title: '已知半徑，求圓周長', formula: '圓周長＝半徑 × 2 × π' },
    findDiameter: { title: '已知圓周長，求直徑', formula: '直徑＝圓周長 ÷ π' },
    findRadius: { title: '已知圓周長，求半徑', formula: '半徑＝圓周長 ÷ π ÷ 2' }
  };
  const $ = id => document.getElementById(id);
  const letters = ['A', 'B', 'C', 'D'];
  let state = freshState();
  function freshState() {
    return { phase: 'welcome', stage: 0, hp: CONFIG.maxHp, gold: 0, crystals: 0, revives: 0,
      enemyHp: CONFIG.enemyHp, position: 0, reviewIndex: 0, reviewing: false, currentId: null,
      answered: false, records: [], reviewAttempts: 0, cleared: 0, roundFinished: false };
  }
  function attack() { return CONFIG.attack + state.crystals * CONFIG.crystal.bonus; }
  function stageQuestions() { return window.QUESTIONS.slice(state.stage * 6, state.stage * 6 + 6); }
  function currentQuestion() { return window.QUESTIONS.find(q => q.id === state.currentId); }
  function recordFor(id) { return state.records.find(r => r.id === id); }
  function reviewPool() {
    const wrong = stageQuestions().filter(q => recordFor(q.id)?.correct === false);
    return wrong.length ? wrong : stageQuestions();
  }
  function updateStatus() {
    $('hpText').textContent = `${state.hp} / ${CONFIG.maxHp}`;
    $('playerHp').value = state.hp;
    $('playerHp').max = CONFIG.maxHp;
    document.querySelector('.health-stat').classList.toggle('danger', state.hp <= 30);
    $('goldText').textContent = state.gold;
    $('attackText').textContent = attack();
    $('reviveText').textContent = state.revives;
    $('enemyHp').value = state.enemyHp;
    $('enemyHpText').textContent = `${state.enemyHp} / ${CONFIG.enemyHp}`;
    document.querySelector('.monster-wrap').classList.toggle('sealed', state.phase !== 'welcome' && state.enemyHp === 0);
    $('totalProgress').textContent = state.phase === 'welcome' ? '尚未開始・共 30 題' : `首次作答 ${state.records.length} / 30 題`;
    $('firstAttemptStats').textContent = `首次答對 ${state.records.filter(r => r.correct).length} / 已答 ${state.records.length} 題`;
    renderRoute();
  }
  function renderRoute() {
    $('route').replaceChildren(...CONFIG.stages.map((s, i) => {
      const li = document.createElement('li');
      const completed = i < state.cleared;
      const active = i === state.stage && state.phase !== 'welcome' && !completed;
      li.className = completed ? 'cleared' : active ? 'active' : '';
      if (active) li.setAttribute('aria-current', 'step');
      const img = document.createElement('img');
      img.src = `assets/characters/${s.image}.png`; img.alt = '';
      const info = document.createElement('div');
      info.innerHTML = `<small>TRIAL 0${i + 1}</small><strong>${s.name}</strong><span class="route-state">${completed ? '已封印' : active ? '挑戰中' : '等待挑戰'}</span>`;
      li.append(img, info); return li;
    }));
  }
  function focusQuestion() {
    $('questionText').focus({ preventScroll: true });
    if (matchMedia('(max-width: 780px)').matches) $('questionPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function startGame() {
    state = freshState(); state.phase = 'battle';
    $('welcomeView').hidden = true; $('quizView').hidden = false;
    $('titlePlaque').hidden = true; $('enemyStatus').hidden = false; $('versus').hidden = false;
    for (const id of ['resultDialog', 'shopDialog', 'rulesDialog']) if ($(id).open) $(id).close();
    startStage();
  }
  function startStage() {
    const stage = CONFIG.stages[state.stage];
    state.phase = 'battle'; state.position = 0; state.reviewing = false; state.reviewIndex = 0;
    state.enemyHp = CONFIG.enemyHp; state.roundFinished = false;
    $('chapterLabel').textContent = `第 ${state.stage + 1} 關 / 5`;
    $('journeyCaption').textContent = '一步一步，用智慧完成封印。';
    $('locationText').textContent = `圓之森・${stage.place}`;
    $('enemyName').textContent = stage.fullName;
    $('enemyHp').max = CONFIG.enemyHp;
    $('monsterSprite').src = `assets/characters/${stage.image}.png`;
    $('monsterSprite').style.transform = stage.image === 'wolf' ? 'scaleX(-1)' : '';
    $('monsterSprite').alt = `可愛的${stage.fullName}`;
    $('monsterTag').textContent = stage.fullName;
    $('sceneMessage').textContent = `完成本關六題，並把怪物 HP 降到 0！答錯扣 ${stage.damage} HP。`;
    renderQuestion();
  }
  function renderQuestion() {
    const q = state.reviewing ? reviewPool()[state.reviewIndex % reviewPool().length] : stageQuestions()[state.position];
    state.currentId = q.id; state.answered = false;
    $('questionType').textContent = TYPES[q.kind].title;
    $('questionCount').textContent = state.reviewing ? '原題訂正挑戰' : `本關 ${state.position + 1} / 6`;
    $('sceneCounter').textContent = state.reviewing ? '訂正魔法・再試一次' : `第 ${state.stage + 1} 關・六道封印`;
    $('questionProgress').replaceChildren(...Array.from({length: 6}, (_, i) => {
      const span = document.createElement('span'); span.className = state.reviewing || i < state.position ? 'done' : i === state.position ? 'current' : ''; return span;
    }));
    $('questionSource').textContent = `教材原題 ${String(q.id).padStart(2, '0')}${state.reviewing ? '・訂正不改動首次成績' : '・選一個正確答案'}`;
    $('questionText').textContent = q.question;
    $('formulaText').textContent = TYPES[q.kind].formula;
    $('formulaHint').open = false;
    $('feedback').hidden = true; $('nextButton').hidden = true;
    $('answers').replaceChildren(...q.options.map((option, index) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'answer'; b.dataset.index = index;
      const letter = document.createElement('span'); letter.className = 'answer-letter'; letter.textContent = letters[index];
      const text = document.createElement('span'); text.textContent = option;
      b.append(letter, text); b.addEventListener('click', () => answer(index)); return b;
    }));
    updateStatus(); focusQuestion();
  }
  function animateBattle(correct, amount) {
    const target = document.querySelector(correct ? '.monster-wrap' : '.mage-wrap');
    target.classList.remove('hit'); void target.offsetWidth; target.classList.add('hit');
    $('battleEffect').textContent = correct ? `−${amount}` : `HP −${amount}`;
    $('battleEffect').classList.remove('pop'); void $('battleEffect').offsetWidth; $('battleEffect').classList.add('pop');
  }
  function answer(index) {
    if (state.phase !== 'battle' || state.answered) return;
    state.answered = true;
    const q = currentQuestion(), correct = index === q.answer;
    const reward = state.reviewing ? CONFIG.reviewGold : CONFIG.correctGold;
    if (state.reviewing) state.reviewAttempts++;
    else state.records.push({ id: q.id, selected: index, correct });
    let revived = false, damage = 0;
    if (correct) {
      damage = Math.min(state.enemyHp, attack());
      state.enemyHp = Math.max(0, state.enemyHp - attack()); state.gold += reward;
    } else {
      damage = CONFIG.stages[state.stage].damage;
      state.hp = Math.max(0, state.hp - damage);
      if (state.hp === 0 && state.revives > 0) { state.revives--; state.hp = CONFIG.revive.heal; revived = true; }
    }
    $('answers').querySelectorAll('button').forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) { b.classList.add('correct'); b.setAttribute('aria-label', `${letters[i]}，${q.options[i]}，正確答案`); }
      else if (i === index) { b.classList.add('wrong'); b.setAttribute('aria-label', `${letters[i]}，${q.options[i]}，你的答案，答錯`); }
    });
    const f = $('feedback'); f.replaceChildren(); f.className = `feedback${correct ? '' : ' is-wrong'}`;
    const title = document.createElement('strong');
    title.textContent = correct ? `答對了！金幣 +${reward}` : `再學一次就更有力量！HP −${damage}`;
    const correctLine = document.createElement('p'); correctLine.textContent = `正解：${letters[q.answer]}．${q.options[q.answer]}`;
    const explanation = document.createElement('p'); explanation.className = 'explanation'; explanation.textContent = q.explanation;
    const outcome = document.createElement('p');
    outcome.textContent = correct ? damage > 0 ? `魔法命中，造成 ${damage} 點傷害。` : '怪物已封印，這一題讓封印更穩固。' : revived ? '復活符已自動使用，回復至 60 HP！' : '先看算式，準備好了再繼續。';
    f.append(title, correctLine, explanation, outcome); f.hidden = false;
    animateBattle(correct, damage);
    $('sceneMessage').textContent = revived ? '復活符亮起了！你又有繼續前進的力量。' : state.enemyHp === 0 ? '封印已完成！完成本關六題，就能前往補給所。' : correct ? '一道明亮的魔法，照亮了森林。' : '讀一讀正確算式，下一次會更熟練。';
    state.roundFinished = (state.reviewing || state.position === 5) && state.enemyHp === 0;
    $('nextButton').textContent = state.hp === 0 ? '查看本次成績 →' : state.roundFinished ? '封印成功，前往商店 →' : !state.reviewing && state.position === 5 ? '進入原題訂正挑戰 →' : '下一題 →';
    $('nextButton').hidden = false;
    updateStatus();
  }
  function nextQuestion() {
    if (!state.answered || state.phase !== 'battle') return;
    if (state.hp === 0) { showResults(false); return; }
    if (state.roundFinished) { state.cleared = state.stage + 1; openShop(); return; }
    if (state.reviewing) state.reviewIndex++;
    else if (state.position === 5) { state.reviewing = true; state.reviewIndex = 0; }
    else state.position++;
    renderQuestion();
  }
  const items = [
    { id: 'potion', name: '回血藥水', image: 'potion', description: '立即回復 40 HP，上限 100 HP。', price: CONFIG.potion.price },
    { id: 'crystal', name: '攻擊水晶', image: 'crystal', description: '永久增加 5 點攻擊，最多買 3 顆。', price: CONFIG.crystal.price },
    { id: 'revive', name: '復活符', image: 'revive', description: 'HP 歸零時自動回復 60 HP，限持有 1 張。', price: CONFIG.revive.price }
  ];
  function openShop() {
    state.phase = 'shop'; updateStatus();
    $('shopStageTitle').textContent = `第 ${state.stage + 1} 關・${CONFIG.stages[state.stage].name} 已封印`;
    $('shopSubtitle').textContent = state.stage === 4 ? '五道試煉都完成了！休息一下，再看看你的冒險成績。' : '辛苦了，勇者。替下一段旅程做好準備吧。';
    $('shopFeedback').textContent = '點選想購買的道具，效果立即生效。';
    $('leaveShop').textContent = state.stage === 4 ? '領取冒險成績 →' : `前往第 ${state.stage + 2} 關・${CONFIG.stages[state.stage + 1].name} →`;
    renderShop(); $('shopDialog').showModal();
  }
  function unavailable(item) {
    if (item.id === 'potion' && state.hp === CONFIG.maxHp) return 'HP 已滿';
    if (item.id === 'crystal' && state.crystals >= CONFIG.crystal.limit) return '已達 3 顆上限';
    if (item.id === 'revive' && state.revives >= CONFIG.revive.limit) return '已持有 1 張';
    return state.gold < item.price ? '金幣不足' : '';
  }
  function renderShop() {
    $('shopGold').textContent = state.gold; $('shopHp').textContent = state.hp;
    $('shopItems').replaceChildren(...items.map(item => {
      const card = document.createElement('article'); card.className = 'item-card';
      const img = document.createElement('img'); img.src = `assets/items/${item.image}.png`; img.alt = item.name;
      const title = document.createElement('h3'); title.textContent = item.name;
      const desc = document.createElement('p'); desc.textContent = item.description;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'buy-button'; b.dataset.item = item.id;
      const reason = unavailable(item); b.disabled = Boolean(reason);
      b.textContent = reason ? `${item.price} 金幣・${reason}` : `${item.price} 金幣・購買`;
      b.setAttribute('aria-label', `${item.name}，${b.textContent}`);
      b.addEventListener('click', () => buy(item)); card.append(img, title, desc, b); return card;
    }));
  }
  function buy(item) {
    if (state.phase !== 'shop' || unavailable(item)) return;
    state.gold -= item.price;
    if (item.id === 'potion') state.hp = Math.min(CONFIG.maxHp, state.hp + CONFIG.potion.heal);
    if (item.id === 'crystal') state.crystals++;
    if (item.id === 'revive') state.revives++;
    $('shopFeedback').textContent = item.id === 'potion' ? `已使用回血藥水！目前 ${state.hp} / 100 HP。` : item.id === 'crystal' ? `水晶已裝備！目前攻擊 ${attack()} 點，已購買 ${state.crystals} / 3 顆。` : '復活符已收好。HP 歸零時會自動保護你。';
    renderShop(); updateStatus();
    const replacement = $('shopItems').querySelector(`[data-item="${item.id}"]`);
    if (!replacement.disabled) replacement.focus({ preventScroll: true }); else $('leaveShop').focus({ preventScroll: true });
  }
  function leaveShop() {
    if (state.phase !== 'shop') return;
    $('shopDialog').close();
    if (state.stage === CONFIG.stages.length - 1) showResults(true);
    else { state.stage++; startStage(); }
  }
  function showResults(won) {
    state.phase = won ? 'won' : 'lost'; updateStatus();
    const correct = state.records.filter(r => r.correct).length;
    const mistakes = state.records.filter(r => !r.correct);
    $('resultKicker').textContent = won ? 'ADVENTURE COMPLETED' : 'REST, THEN TRY AGAIN';
    $('resultTitle').textContent = won ? '圓之森的新勇者，誕生！' : '先休息一下，再出發。';
    $('resultMessage').textContent = won ? '你完成了五道試煉。每一次思考，都讓你的魔法更有力量。' : '這趟冒險已結束。讀讀訂正算式，下次帶著新學會的魔法回來。';
    $('scoreValue').textContent = `${Math.round(correct / window.QUESTIONS.length * 100)} 分`;
    $('correctValue').textContent = `${correct} / 30`;
    $('clearedValue').textContent = `${state.cleared} / 5`;
    $('resultNote').textContent = `首次作答 ${state.records.length} / 30 題；訂正挑戰作答 ${state.reviewAttempts} 次。成績＝首次答對題數 ÷ 30 × 100（四捨五入）；未作答題不計分。`;
    $('reviewSummary').textContent = mistakes.length ? `複習 ${mistakes.length} 道首次答錯的題目` : '查看本次學習紀錄';
    $('reviewList').replaceChildren();
    if (!mistakes.length) { const p = document.createElement('p'); p.textContent = '已作答題目全部答對，繼續保持！'; $('reviewList').append(p); }
    for (const r of mistakes) {
      const q = window.QUESTIONS.find(q => q.id === r.id);
      const entry = document.createElement('article'); entry.className = 'review-entry';
      const title = document.createElement('strong'); title.textContent = `${q.id}. ${q.question}`;
      const chosen = document.createElement('p'); chosen.className = 'your-answer'; chosen.textContent = `你的答案：${letters[r.selected]}．${q.options[r.selected]}`;
      const answer = document.createElement('p'); answer.className = 'right-answer'; answer.textContent = `正確答案：${letters[q.answer]}．${q.options[q.answer]}`;
      const calc = document.createElement('p'); calc.textContent = q.explanation;
      entry.append(title, chosen, answer, calc); $('reviewList').append(entry);
    }
    $('resultDialog').querySelector('details').open = false;
    $('chapterLabel').textContent = won ? '五關挑戰完成' : '本次冒險結束';
    $('journeyCaption').textContent = won ? '你用智慧，守護了圓之森。' : '每一次練習，都是成長。';
    $('resultDialog').showModal();
  }
  $('startButton').addEventListener('click', startGame);
  $('retryButton').addEventListener('click', startGame);
  $('nextButton').addEventListener('click', nextQuestion);
  $('leaveShop').addEventListener('click', leaveShop);
  $('rulesButton').addEventListener('click', () => $('rulesDialog').showModal());
  for (const id of ['shopDialog', 'resultDialog']) $(id).addEventListener('cancel', event => event.preventDefault());
  // 唯讀狀態供驗收使用；遊戲操作仍經由畫面按鈕進行。
  Object.defineProperty(window, 'CircleRPG', { value: Object.freeze({ getState: () => JSON.parse(JSON.stringify(state)), config: JSON.parse(JSON.stringify(CONFIG)) }) });
  updateStatus();
})();
