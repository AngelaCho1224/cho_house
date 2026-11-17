(function () {
  'use strict';
  var chapters=window.STORIES,art=window.STORY_ART;
  var $=function(id){return document.getElementById(id);};
  var player={name:'同學',color:'#795195'},selected=0,state=null;
  var settings={timed:false,quick:false,large:false},records={};
  var timer=null,messageTimer=null,generation=0,locked=false;
  var colors=['#795195','#397d75','#a36137','#446e9b'];
  var artLabels={'ch1-open':'阿哲在數學課上突然大喊，同學受到打擾','ch1-hallway':'同學在走廊以綽號嘲笑阿哲','ch2-open':'小晴在教室熱情地靠近同學','ch3-open':'自習時小宇突然唱歌，同學受到影響','ch3-note':'小宇拿著一張黃色便利貼，嘗試向同學道歉'};
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
  function button(text,cls,fn){var b=el('button',cls||'btn',text);b.type='button';b.addEventListener('click',fn);return b;}
  function fmt(text){return String(text).replace(/\{我\}/g,player.name);}
  function clone(value){return JSON.parse(JSON.stringify(value));}
  function clamp(n){return Math.max(0,Math.min(10,n));}
  function cancel(){generation++;clearInterval(timer);clearTimeout(messageTimer);timer=null;messageTimer=null;}
  function save(){try{localStorage.setItem('class703-branches-v2',JSON.stringify({settings:settings,records:records}));$('storageStatus').textContent='結局與設定僅保存在這個瀏覽器，不儲存暱稱。';}catch(e){$('storageStatus').textContent='這個瀏覽器目前無法保留記錄；本次仍可正常遊玩。';}}
  function load(){
    try{
      var saved=JSON.parse(localStorage.getItem('class703-branches-v2')||'null');
      var old=JSON.parse(localStorage.getItem('class703-progress-v1')||'null');
      var source=saved||old;
      if(source&&source.settings){settings.timed=source.settings.timed===true;settings.quick=source.settings.quick===true;settings.large=source.settings.large===true;}
      if(saved&&saved.records){chapters.forEach(function(ch){var r=saved.records[ch.id];if(r&&Array.isArray(r.unlocked)){var valid=r.unlocked.filter(function(id){return !!ch.endings[id];});records[ch.id]={last:ch.endings[r.last]?r.last:valid[0],unlocked:valid};}});}
    }catch(e){}
  }
  function applySettings(){
    document.body.classList.toggle('large-text',settings.large);
    document.querySelector('input[name="pace"][value="'+(settings.timed?'timed':'calm')+'"]').checked=true;
    $('quickChat').checked=settings.quick;$('largeText').checked=settings.large;
  }
  function show(id){
    ['vTitle','vProfile','vSelect','vPlay','vBook'].forEach(function(v){$(v).hidden=v!==id;});
    document.body.dataset.view=id;window.scrollTo(0,0);
    $('btnContinue').hidden=!Object.keys(records).length;
  }
  function paint(target,key,who){
    var a=art[key],src=a?a.src:'img/'+key+'.webp';
    target.style.backgroundImage='url("'+src+'")';
    target.style.backgroundSize=a?'200% 200%':'cover';
    target.style.backgroundPosition=a?((a.panel%2)*100)+'% '+(Math.floor(a.panel/2)*100)+'%':'center';
    target.setAttribute('role','img');target.setAttribute('aria-label',a?who+'：'+a.alt:(artLabels[key]||who+'的校園情境'));
    target.dataset.art=key;target.dataset.source=src;
  }
  function renderSelect(){
    var ch=chapters[selected],r=records[ch.id];
    $('selHello').textContent=player.name+'，今天想先看誰的故事？';
    paint($('selArt'),ch.cover,ch.who);
    $('selPeriod').textContent=ch.period+' · 每條路線 6 次選擇';$('selTitle').textContent=ch.title;$('selTag').textContent=ch.type;
    $('selWho').textContent=ch.who+'，'+ch.behavior;$('selRole').textContent=ch.role;
    $('selDone').textContent=r?'已看過 '+r.unlocked.length+' / 5 種結局 · 上次：'+ch.endings[r.last].title:'18 個選擇情境 · 5 種結局，依你的選擇走不同路線';
    $('selDots').replaceChildren();chapters.forEach(function(c,i){$('selDots').appendChild(el('i',i===selected?'on':''));});
    $('selGo').textContent=r?'再走一條新路線':'進入這一節';
  }
  function move(n){selected=(selected+n+chapters.length)%chapters.length;renderSelect();}
  function toSelect(){cancel();renderSelect();show('vSelect');}
  function meters(){
    [['mood',state.mood],['cls',state.cls]].forEach(function(pair){
      $(pair[0]+'Num').textContent=pair[1]+'/10';var bar=$(pair[0]+'Bar');bar.style.width=(pair[1]*10)+'%';bar.className=pair[1]<=3?'bad':pair[1]<7?'mid':'';
    });
    $('choiceCount').textContent='第 '+Math.min(state.picks.length+1,6)+' / 6 次選擇';
    $('meterNote').textContent='故事變化示意，不是心理評量';
  }
  function start(i){
    cancel();selected=i;
    state={chapter:chapters[i],node:chapters[i].start,mood:5,cls:5,flags:{},picks:[],snapshots:[],ending:null};
    $('moodLabel').textContent=state.chapter.who+'的心情';$('hudTitle').textContent=state.chapter.period+' · '+state.chapter.title;
    show('vPlay');renderNode();
  }
  function appendLine(target,text,isChat){
    var split=text.indexOf('|');
    if(split<0){target.appendChild(el('p','story-narration',fmt(text)));return;}
    var name=text.slice(0,split),words=fmt(text.slice(split+1));
    var row=el('div',isChat?'story-message':'story-speech');row.appendChild(el('b','message-name',name));row.appendChild(el('p','message-words',words));target.appendChild(row);
  }
  function renderNode(){
    cancel();locked=false;var token=generation;
    var node=state.chapter.nodes[state.node];
    if(!node)throw new Error('找不到故事節點：'+state.node);
    $('vPlay').dataset.node=state.node;
    $('eventTitle').textContent=node.title;$('eventTitle').focus({preventScroll:true});
    $('stageCaption').textContent=state.chapter.who+'的故事 · '+node.title;
    paint($('visualArt'),node.art,state.chapter.who);
    $('channelLabel').textContent=node.channel||'校園現場';$('channelLabel').classList.toggle('is-chat',!!node.channel);
    $('sceneText').replaceChildren();$('choices').replaceChildren();$('choicePrompt').textContent='';$('countdown').hidden=true;
    $('aftermath').hidden=true;$('sceneText').classList.toggle('chat-layout',!!node.channel);
    $('branchTrail').textContent=state.picks.length?state.picks.slice(-2).map(function(p){return p.title;}).join(' → '):'故事的起點 · 你的第一個選擇';
    $('readingScroll').scrollTop=0;$('choices').scrollTop=0;meters();
    var k=0;
    function line(){
      if(token!==generation)return;
      if(k<node.lines.length){appendLine($('sceneText'),node.lines[k++],!!node.channel);if(node.channel&&!settings.quick&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){messageTimer=setTimeout(line,550);return;}line();}
      else renderChoices(node,token);
    }
    line();
  }
  function renderChoices(node,token){
    $('choicePrompt').textContent=node.ask;
    node.options.forEach(function(option,i){
      var b=button('', 'opt branch-option',function(){pick(option,i,false,token);});
      b.appendChild(el('span','option-number',String(i+1).padStart(2,'0')));b.appendChild(el('span','option-label',option.label));
      $('choices').appendChild(b);
    });
    if(node.timed&&settings.timed){
      var left=100;$('countdown').hidden=false;$('countdownLabel').textContent='10 秒';$('countdownFill').style.width='100%';
      timer=setInterval(function(){
        if(document.hidden||document.querySelector('dialog[open]'))return;
        if(token!==generation){clearInterval(timer);return;}
        left--;$('countdownLabel').textContent=Math.ceil(left/10)+' 秒';$('countdownFill').style.width=left+'%';
        if(left<=0){pick({label:'暫時沒有回應，先停一下',next:node.timeoutNext,reply:'時間到了，你還來不及回應。接下來仍然可以選擇安全的做法。',note:'來不及反應不代表同意。可以再找同伴或可信任的大人幫忙。',delta:[0,0],flags:{}},-1,true,token);}
      },100);
    }
  }
  function pick(option,index,late,token){
    if(locked||token!==generation)return;locked=true;clearInterval(timer);timer=null;
    var node=state.chapter.nodes[state.node];
    state.snapshots.push({node:state.node,mood:state.mood,cls:state.cls,flags:clone(state.flags)});
    state.mood=clamp(state.mood+option.delta[0]);state.cls=clamp(state.cls+option.delta[1]);Object.assign(state.flags,option.flags);
    state.picks.push({node:state.node,title:node.title,label:option.label,reply:option.reply,note:option.note,next:option.next,index:index,late:late});
    $('choices').replaceChildren();$('choicePrompt').textContent=player.name+'的選擇：'+option.label;$('countdown').hidden=true;
    $('afterReply').textContent=fmt(option.reply);$('afterNote').textContent=option.note;$('aftermath').hidden=false;
    $('choices').appendChild(button('看看接下來 →','btn next-event',function(){
      if(token!==generation)return;
      if(option.next.indexOf('end:')===0)finish(option.next.slice(4));
      else{state.node=option.next;renderNode();}
    }));
    [['mood',state.mood],['cls',state.cls]].forEach(function(pair){$(pair[0]+'Num').textContent=pair[1]+'/10';var b=$(pair[0]+'Bar');b.style.width=(pair[1]*10)+'%';b.className=pair[1]<=3?'bad':pair[1]<7?'mid':'';});
    $('choiceCount').textContent='已選 '+state.picks.length+' / 6 次';
    $('aftermath').scrollIntoView({block:'nearest'});
  }
  function finish(id){
    cancel();state.ending=id;
    var old=records[state.chapter.id]||{last:id,unlocked:[]};old.last=id;if(old.unlocked.indexOf(id)<0)old.unlocked.push(id);records[state.chapter.id]=old;save();renderBook();
  }
  function rewind(index){
    var snap=state.snapshots[index];if(!snap)return;
    cancel();state.node=snap.node;state.mood=snap.mood;state.cls=snap.cls;state.flags=clone(snap.flags);
    state.picks=state.picks.slice(0,index);state.snapshots=state.snapshots.slice(0,index);state.ending=null;
    var d=$('routeDialog');if(d.open)d.close();show('vPlay');renderNode();
  }
  function routeList(target,rewindable){
    var list=el('ol','route-list');
    state.picks.forEach(function(p,i){var li=el('li','route-item');li.appendChild(el('b',null,p.title));li.appendChild(el('p','route-label',p.label));li.appendChild(el('p','route-note',p.note));if(rewindable)li.appendChild(button('從這裡改選','route-rewind',function(){rewind(i);}));list.appendChild(li);});
    if(!state.picks.length)target.appendChild(el('p',null,'你還在故事的起點，做出選擇後，路線會記在這裡。'));
    else target.appendChild(list);
  }
  function openRoute(){
    if(!state)return;$('routeContent').replaceChildren();routeList($('routeContent'),true);
    if(!state.ending)$('routeContent').appendChild(el('p','soft-note','回到先前的選擇，會改寫那一次之後的路線；已看過的結局仍會保留。'));
    $('routeDialog').showModal();
  }
  function panel(title){var box=el('section','panel');box.appendChild(el('h3',null,title));return box;}
  function renderBook(){
    var ch=state.chapter,end=ch.endings[state.ending],box=$('vBook');box.replaceChildren();
    box.appendChild(el('p','eyebrow',ch.period+' · '+ch.title+' · 你的相處手冊'));
    var result=panel('這一次，故事走到這裡');result.appendChild(el('h2','verdict '+end.kind,end.title));
    var image=el('div','ending-art');paint(image,end.art,ch.who);result.appendChild(image);
    end.lines.forEach(function(line){appendLine(result,line,false);});result.appendChild(el('p','takeaway',end.takeaway));box.appendChild(result);
    var collection=panel('這個故事的 5 種結局');var grid=el('div','ending-grid');
    Object.keys(ch.endings).forEach(function(id){var unlocked=records[ch.id].unlocked.indexOf(id)>=0;var card=el('div','ending-card'+(unlocked?' unlocked':'')+(id===state.ending?' current':''));card.appendChild(el('small',null,id===state.ending?'這次走到':unlocked?'已看過':'還沒看過'));card.appendChild(el('b',null,unlocked?ch.endings[id].title:'另一條故事路線'));grid.appendChild(card);});collection.appendChild(grid);box.appendChild(collection);
    var route=panel('我的 6 次選擇');route.appendChild(el('p','profile-note','點「從這裡改選」，可以保留前面的選擇，試試另一條支線。'));routeList(route,true);box.appendChild(route);
    var skills=panel('可以練習說出口的句子');ch.say.forEach(function(text){skills.appendChild(el('p','say','「'+text+'」'));});box.appendChild(skills);
    var discussion=panel('一起想一想');var ul=el('ul');ch.discuss.forEach(function(text){ul.appendChild(el('li',null,text));});discussion.appendChild(ul);box.appendChild(discussion);
    var help=panel('如果事情發生在你身邊');help.appendChild(el('p',null,'先照顧自己的安全。可以找導師、輔導老師或可信任的大人，請朋友陪同。若事情沒有改善，可以再次求助。'));help.appendChild(el('p','soft-note','這是虛構故事，結局不是對你的評分。沉默、害怕或來不及反應，不代表你同意傷害，也不代表你必須獨自解決。'));box.appendChild(help);
    var actions=el('div','row');actions.appendChild(button('從頭試另一條路線','btn',function(){start(selected);}));actions.appendChild(button('選其他同學','btn ghost',toSelect));box.appendChild(actions);show('vBook');
  }
  load();applySettings();
  $('btnStart').addEventListener('click',function(){show('vProfile');$('nick').focus();});
  colors.forEach(function(c,i){var b=button('','sw',function(){player.color=c;document.documentElement.style.setProperty('--player-color',c);document.querySelectorAll('.sw').forEach(function(x){x.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed','true');});b.style.background=c;b.setAttribute('aria-label','顏色 '+(i+1));b.setAttribute('aria-pressed',i===0?'true':'false');$('swatches').appendChild(b);});
  $('profileForm').addEventListener('submit',function(e){e.preventDefault();player.name=$('nick').value.trim()||'同學';renderSelect();show('vSelect');});
  $('selPrev').addEventListener('click',function(){move(-1);});$('selNext').addEventListener('click',function(){move(1);});$('selGo').addEventListener('click',function(){start(selected);});
  $('btnBack').addEventListener('click',toSelect);$('btnRoute').addEventListener('click',openRoute);
  $('btnContinue').addEventListener('click',toSelect);
  document.querySelectorAll('[data-chapter]').forEach(function(b){b.addEventListener('click',function(){selected=Number(b.dataset.chapter);show('vProfile');$('nick').focus();});});
  $('btnGuide').addEventListener('click',function(){$('guideDialog').showModal();});$('btnSettings').addEventListener('click',function(){$('settingsDialog').showModal();});
  document.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){$(b.dataset.close).close();});});
  document.querySelectorAll('input[name="pace"]').forEach(function(input){input.addEventListener('change',function(){settings.timed=input.value==='timed';save();});});
  $('quickChat').addEventListener('change',function(){settings.quick=this.checked;save();});
  $('largeText').addEventListener('change',function(){settings.large=this.checked;applySettings();save();});
  $('resetProgress').addEventListener('click',function(){records={};save();$('resetStatus').textContent='已清除已看過的結局記錄。';$('btnContinue').hidden=true;if(!$('vSelect').hidden)renderSelect();});
  document.addEventListener('keydown',function(e){if($('vSelect').hidden||document.querySelector('dialog[open]')||e.target.matches('input,textarea'))return;if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);});
  document.querySelectorAll('dialog').forEach(function(d){d.addEventListener('click',function(e){if(e.target!==d)return;var r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});
  document.querySelectorAll('[data-paint]').forEach(function(target){paint(target,target.dataset.paint,target.dataset.who);});
  show('vTitle');
}());
