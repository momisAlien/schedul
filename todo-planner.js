var TODO_TAGS={NCS:{l:'NCS',bg:'rgba(59,130,246,.15)',c:'#3b82f6'},한국사:{l:'한국사',bg:'rgba(239,68,68,.15)',c:'#ef4444'},정처기:{l:'정처기',bg:'rgba(34,197,94,.15)',c:'#22c55e'},HSK:{l:'HSK',bg:'rgba(234,179,8,.15)',c:'#eab308'},시험:{l:'시험',bg:'rgba(168,85,247,.15)',c:'#a855f7'}};
var EXAMS={NCS:'2026-05-09',한국사:'2026-05-23',정처기:'2026-05-24',HSK:'2026-06-14'};
var CLASSES={1:[[11,13],[15,17]],2:[[13,15]],3:[[11,13],[15,17]],4:[[13,15]]};
var WORK={2:[[9,12.5],[15,17]],5:[[9,15]]};
var DAILY={'04-28':[['NCS','1회 30문항 풀이 + 오답'],['정처기','1과목 소프트웨어설계 PDF'],['HSK','어휘 Day 1']],'04-29':[['NCS','2회 풀이 + 오답'],['한국사','1~2강'],['HSK','Day 2']],'04-30':[['NCS','3회 + 오답'],['정처기','1과목 마무리+기출20'],['HSK','Day 3']],'05-01':[['NCS','4회 + 오답'],['정처기','2과목 소프트웨어개발'],['한국사','3~4강'],['HSK','Day 4']],'05-02':[['NCS','5회+6회 + 오답'],['정처기','2과목 기출 40문항'],['HSK','듣기+Day 5']],'05-03':[['NCS','7회+8회 + 오답'],['한국사','5~6강'],['HSK','Day 6']],'05-04':[['NCS','9회 + 오답'],['정처기','3과목 DB구축 1차'],['HSK','Day 7']],'05-05':[['NCS','10회+오답 인덱스'],['한국사','7강'],['HSK','Day 8']],'05-06':[['NCS','약점 재풀이 30~50문항'],['정처기','DB 2차'],['HSK','Day 9']],'05-07':[['NCS','50문항/50분 실전'],['정처기','4과목 핵심'],['HSK','Day 10']],'05-08':[['NCS','최종 오답 2회독+정리'],['NCS','수험표·시험장 체크'],['정처기','4과목 기출 20']],'05-09':[['시험','🔥 NCS 시험!'],['한국사','연표 1시간'],['정처기','5과목 1시간']],'05-10':[['한국사','상 1~5강 압축'],['정처기','1과목 기출 60'],['HSK','Day 11']],'05-11':[['한국사','상 6~9강'],['정처기','2과목 이론+기출'],['HSK','Day 12']],'05-12':[['한국사','상 10~13강'],['정처기','3과목 SQL·정규화'],['HSK','Day 13']],'05-13':[['한국사','상 14~17강'],['정처기','4과목 OS·네트워크'],['HSK','Day 14']],'05-14':[['한국사','상 18~21강+총정리'],['정처기','5과목 보안'],['HSK','Day 15']],'05-15':[['한국사','하 22~25강'],['정처기','기출 1회 100문항'],['HSK','독해 1부분']],'05-16':[['한국사','26~30강'],['정처기','기출 2회 100문항'],['HSK','Day 16']],'05-17':[['한국사','31~34강'],['정처기','기출 3회 100문항'],['HSK','쓰기 어법']],'05-18':[['한국사','35~37강'],['정처기','약점 DB/SQL'],['HSK','Day 17']],'05-19':[['한국사','38~40강+연표'],['정처기','약점 OS·네트워크'],['HSK','Day 18']],'05-20':[['한국사','기출 1회 80분'],['정처기','CBT 모의 1회'],['HSK','독해 2부분']],'05-21':[['한국사','기출 2회+약점'],['정처기','CBT 모의 2회'],['HSK','Day 19']],'05-22':[['한국사','기출 3회+최종암기'],['정처기','오답노트 훑기'],['HSK','가볍게']],'05-23':[['시험','🔥 한국사 시험!'],['정처기','오후 100문항 점검']],'05-24':[['시험','🔥 정처기 필기!'],['HSK','오후 HSK 전환']]};
var todoChecked=JSON.parse(localStorage.getItem('scedul_todo_checked')||'{}');
var studyTimes=JSON.parse(localStorage.getItem('scedul_study_times')||'{}');
function saveTodoChecked(){localStorage.setItem('scedul_todo_checked',JSON.stringify(todoChecked))}
function saveStudyTimes(){localStorage.setItem('scedul_study_times',JSON.stringify(studyTimes))}
var plannerDateStr=null,mcalMonth=null,mcalYear=null;
var timerInterval=null,timerStart=null,timerElapsed=0,timerRunning=false;
function getTodoForDate(ds){var k=ds.substring(5);var d=DAILY[k];if(!d)return[];return d.map(function(x,i){return{id:x[0]+'-'+ds+'-'+i,subj:x[0],text:x[1]}});}
function getPhase(ds){if(ds>='2026-04-28'&&ds<='2026-05-08')return'Phase 1 · NCS 집중';if(ds==='2026-05-09')return'D-Day · NCS 시험';if(ds>='2026-05-10'&&ds<='2026-05-16')return'Phase 2 전반';if(ds>='2026-05-17'&&ds<='2026-05-22')return'Phase 2 후반';if(ds==='2026-05-23')return'D-Day · 한국사';if(ds==='2026-05-24')return'D-Day · 정처기';return'';}
function getDday(ds,exam){var diff=Math.ceil((new Date(exam)-new Date(ds))/864e5);return diff>0?'D-'+diff:diff===0?'D-Day':'완료';}
function getAllDates(){var r=[];for(var k in DAILY)r.push('2026-'+k);return r.sort();}
function calcOverall(){var all=getAllDates(),r={};['NCS','한국사','정처기','HSK'].forEach(function(s){var t=0,d=0;all.forEach(function(ds){getTodoForDate(ds).forEach(function(it){if(it.subj===s){t++;if(todoChecked[it.id])d++;}});});r[s]={total:t,done:d,pct:t?Math.round(d/t*100):0};});return r;}
function calcDayPct(ds){var it=getTodoForDate(ds);if(!it.length)return-1;return Math.round(it.filter(function(x){return todoChecked[x.id]}).length/it.length*100);}
function getClockBlocks(ds){var d=new Date(ds+'T00:00:00'),dow=d.getDay(),b=[];
b.push({l:'수면',s:0,e:7,c:'#4338ca'});b.push({l:'기상',s:7,e:8,c:'#7c3aed'});
if(CLASSES[dow])CLASSES[dow].forEach(function(x){b.push({l:'수업',s:x[0],e:x[1],c:'#64748b'});});
if(WORK[dow])WORK[dow].forEach(function(x){b.push({l:'근로',s:x[0],e:x[1],c:'rgba(99,102,241,.35)'});});
b.push({l:'점심',s:12,e:13,c:'#f97316'});b.push({l:'저녁',s:18,e:19,c:'#f97316'});
b.push({l:'휴식',s:21.5,e:23,c:'#06b6d4'});b.push({l:'취침',s:23,e:24,c:'#4338ca'});return b;}
function drawClock(ds){var cv=document.getElementById('plannerClock');if(!cv)return;
var dpr=window.devicePixelRatio||1,sz=Math.min(280,window.innerWidth<600?window.innerWidth-80:280);
cv.width=sz*dpr;cv.height=sz*dpr;cv.style.width=sz+'px';cv.style.height=sz+'px';
var c=cv.getContext('2d');c.scale(dpr,dpr);var cx=sz/2,cy=sz/2,R=sz/2-26;
var bd=getComputedStyle(document.documentElement).getPropertyValue('--bd1').trim()||'#2a2a3e';
c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.strokeStyle=bd;c.lineWidth=26;c.stroke();
var blocks=getClockBlocks(ds);
blocks.forEach(function(b){var sa=(b.s/24)*Math.PI*2-Math.PI/2,ea=(b.e/24)*Math.PI*2-Math.PI/2;
c.beginPath();c.arc(cx,cy,R,sa,ea);c.strokeStyle=b.c;c.lineWidth=24;c.lineCap='butt';c.stroke();
if(b.e-b.s>=1.5){var ma=(sa+ea)/2,lx=cx+Math.cos(ma)*R,ly=cy+Math.sin(ma)*R;
c.save();c.translate(lx,ly);
var rot=ma+Math.PI/2;if(ma>Math.PI*0.5&&ma<Math.PI*1.5)rot=ma-Math.PI/2;
c.rotate(rot);c.font='bold 8px Inter,sans-serif';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
c.fillText(b.l.length>8?b.l.substring(0,8):b.l,0,0);c.restore();}});
for(var h=0;h<24;h++){var a=(h/24)*Math.PI*2-Math.PI/2;
c.beginPath();c.moveTo(cx+Math.cos(a)*(R+14),cy+Math.sin(a)*(R+14));c.lineTo(cx+Math.cos(a)*(R+20),cy+Math.sin(a)*(R+20));
c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--tx3').trim()||'#606078';c.lineWidth=h%6===0?2:1;c.stroke();
if(h%3===0){c.font='bold 9px Inter,sans-serif';c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--tx2').trim()||'#9090a8';c.textAlign='center';c.textBaseline='middle';
c.fillText(h+'',cx+Math.cos(a)*(R+28),cy+Math.sin(a)*(R+28));}}
var gr=c.createRadialGradient(cx,cy,0,cx,cy,12);gr.addColorStop(0,'#6c5ce7');gr.addColorStop(1,'#a29bfe');
c.beginPath();c.arc(cx,cy,8,0,Math.PI*2);c.fillStyle=gr;c.fill();
var now=new Date(),nh=now.getHours()+now.getMinutes()/60,na=(nh/24)*Math.PI*2-Math.PI/2;
c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(na)*(R-14),cy+Math.sin(na)*(R-14));
c.strokeStyle='#fd79a8';c.lineWidth=2;c.lineCap='round';c.stroke();}
function drawDonut(id,pct,col){var cv=document.getElementById(id);if(!cv)return;var dpr=window.devicePixelRatio||1;
cv.width=50*dpr;cv.height=50*dpr;cv.style.width='50px';cv.style.height='50px';
var c=cv.getContext('2d');c.scale(dpr,dpr);
c.beginPath();c.arc(25,25,20,0,Math.PI*2);c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--bg4').trim()||'#252535';c.lineWidth=5;c.stroke();
if(pct>0){c.beginPath();c.arc(25,25,20,-Math.PI/2,-Math.PI/2+(pct/100)*Math.PI*2);c.strokeStyle=col;c.lineWidth=5;c.lineCap='round';c.stroke();}}
function renderMiniCal(){var el=document.getElementById('plMiniCal');if(!el)return;
var y=mcalYear,m=mcalMonth,first=new Date(y,m,1),last=new Date(y,m+1,0),sd=first.getDay(),days=last.getDate();
var MN=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
var h='<div class="pl-mcal-month"><button class="pl-mcal-nav" onclick="mcalNav(-1)">‹</button>'+y+'년 '+MN[m]+'<button class="pl-mcal-nav" onclick="mcalNav(1)">›</button></div><div class="pl-mcal-grid">';
['일','월','화','수','목','금','토'].forEach(function(d){h+='<div class="pl-mcal-hdr">'+d+'</div>';});
var pd=new Date(y,m,0).getDate();for(var i=sd-1;i>=0;i--)h+='<div class="pl-mcal-day om">'+(pd-i)+'</div>';
var today=new Date(),ts=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
for(var d=1;d<=days;d++){var ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
var pct=calcDayPct(ds),cls='pl-mcal-day',bg='',nc='';
if(ds===ts)cls+=' today';if(ds===plannerDateStr)cls+=' sel';
if(pct>=0){cls+=' has-todo';if(pct===100){bg='background:rgba(34,197,94,.25)';nc='color:#22c55e'}else if(pct>=50){bg='background:rgba(234,179,8,.2)';nc='color:#eab308'}else if(pct>0){bg='background:rgba(59,130,246,.15)';nc='color:#3b82f6'}else{bg='background:var(--bg4)';nc='';}}
h+='<div class="'+cls+'" style="'+bg+'" onclick="plannerGo(\''+ds+'\')">';
h+='<span class="pl-mcal-num" style="'+nc+'">'+d+'</span>';
if(pct>=0)h+='<div class="pl-mcal-dot" style="background:'+(pct===100?'#22c55e':pct>=50?'#eab308':pct>0?'#3b82f6':'var(--bd2)')+'"></div>';
h+='</div>';}
var rem=(sd+days)%7;if(rem>0)for(var i=1;i<=7-rem;i++)h+='<div class="pl-mcal-day om">'+i+'</div>';
h+='</div>';el.innerHTML=h;showCalStudy();}
function mcalNav(dir){mcalMonth+=dir;if(mcalMonth>11){mcalMonth=0;mcalYear++}if(mcalMonth<0){mcalMonth=11;mcalYear--}renderMiniCal();}
function plannerGo(ds){plannerDateStr=ds;if(typeof S!=='undefined')S.selDate=ds;openTodo();}
function showCalStudy(){var el=document.getElementById('plCalStudy');if(!el)return;
var st=studyTimes[plannerDateStr];if(st&&st>0){var mins=Math.round(st/60);el.className='pl-cal-study on';el.innerHTML='📖 선택일 학습: <span class="pl-cal-study-time">'+(mins>=60?Math.floor(mins/60)+'시간 '+(mins%60)+'분':mins+'분')+'</span>';}else{el.className='pl-cal-study';el.innerHTML='';}}
function fmtTimer(s){var h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=Math.floor(s%60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');}
function updateTimerDisplay(){var saved=studyTimes[plannerDateStr]||0;var cur=timerRunning?(saved+timerElapsed+Math.floor((Date.now()-timerStart)/1000)):(saved+timerElapsed);
document.getElementById('plTimerDisplay').textContent=fmtTimer(cur);
var mins=Math.round(cur/60);document.getElementById('plStatStudy').textContent=mins>=60?Math.floor(mins/60)+'h '+mins%60+'m':mins+'분';}
function startTimer(){timerRunning=true;timerStart=Date.now();timerElapsed=0;
document.getElementById('plTimerStart').style.display='none';document.getElementById('plTimerPause').style.display='';document.getElementById('plTimerStop').style.display='';document.getElementById('plTimerResume').style.display='none';
timerInterval=setInterval(updateTimerDisplay,1000);updateTimerDisplay();}
function pauseTimer(){if(!timerRunning)return;timerElapsed+=Math.floor((Date.now()-timerStart)/1000);timerRunning=false;clearInterval(timerInterval);
document.getElementById('plTimerPause').style.display='none';document.getElementById('plTimerResume').style.display='';updateTimerDisplay();}
function resumeTimer(){timerRunning=true;timerStart=Date.now();
document.getElementById('plTimerResume').style.display='none';document.getElementById('plTimerPause').style.display='';
timerInterval=setInterval(updateTimerDisplay,1000);}
function stopTimer(){if(timerRunning)timerElapsed+=Math.floor((Date.now()-timerStart)/1000);timerRunning=false;clearInterval(timerInterval);
studyTimes[plannerDateStr]=(studyTimes[plannerDateStr]||0)+timerElapsed;saveStudyTimes();timerElapsed=0;
document.getElementById('plTimerStart').style.display='';document.getElementById('plTimerPause').style.display='none';document.getElementById('plTimerStop').style.display='none';document.getElementById('plTimerResume').style.display='none';
updateTimerDisplay();showCalStudy();renderMiniCal();}
function resetTimerUI(){clearInterval(timerInterval);timerRunning=false;timerElapsed=0;
document.getElementById('plTimerStart').style.display='';document.getElementById('plTimerPause').style.display='none';document.getElementById('plTimerStop').style.display='none';document.getElementById('plTimerResume').style.display='none';updateTimerDisplay();}
function openTodo(){var ds=plannerDateStr=plannerDateStr||(typeof S!=='undefined'?(S.selDate||fmt(S.cur)):new Date().toISOString().slice(0,10));
var d=new Date(ds+'T00:00:00'),items=getTodoForDate(ds),phase=getPhase(ds);
document.getElementById('plDate').textContent=d.getFullYear()+'년 '+(d.getMonth()+1)+'월 '+d.getDate()+'일 ('+(typeof DN!=='undefined'?DN[d.getDay()]:'')+'요일)';
document.getElementById('plPhase').textContent=phase||'일정 없는 기간';
document.getElementById('plannerView').classList.add('on');if(document.querySelector('.app'))document.querySelector('.app').style.display='none';
if(!mcalYear){mcalMonth=d.getMonth();mcalYear=d.getFullYear();}
renderMiniCal();resetTimerUI();
var ov=calcOverall(),ovEl=document.getElementById('plOverall'),oh='';
['NCS','한국사','정처기','HSK'].forEach(function(s){var tag=TODO_TAGS[s],exam=EXAMS[s],dd=getDday(ds,exam),data=ov[s];
oh+='<div class="pl-ov-item"><div class="pl-ov-icon" style="background:'+tag.c+'">'+s.charAt(0)+'</div><div class="pl-ov-info"><div class="pl-ov-name">'+s+' <span class="pl-ov-exam">'+dd+'</span></div><div class="pl-ov-bar"><div class="pl-ov-fill" style="width:'+data.pct+'%;background:'+tag.c+'"></div></div></div><div class="pl-ov-pct" style="color:'+tag.c+'">'+data.pct+'%</div></div>';});
ovEl.innerHTML=oh;
var total=items.length,done=items.filter(function(x){return todoChecked[x.id]}).length,pct=total?Math.round(done/total*100):0;
document.getElementById('plStatDone').textContent=done+' / '+total;
document.getElementById('plStatSub').textContent=pct===100?'완료! 🎉':total?total-done+'개 남음':'없음';
document.getElementById('plStatPct').textContent=pct+'%';
drawDonut('donutCanvas',pct,'#6c5ce7');updateTimerDisplay();
var grouped={};items.forEach(function(it){if(!grouped[it.subj])grouped[it.subj]=[];grouped[it.subj].push(it);});
var sp='';Object.keys(grouped).forEach(function(subj){var tag=TODO_TAGS[subj]||{bg:'rgba(108,92,231,.15)',c:'#6c5ce7'};
var cnt=grouped[subj].length,dn=grouped[subj].filter(function(x){return todoChecked[x.id]}).length,p=cnt?Math.round(dn/cnt*100):0;
var exam=EXAMS[subj],dd=exam?getDday(ds,exam):'';
sp+='<div class="pl-subj-row"><span class="pl-subj-tag" style="background:'+tag.bg+';color:'+tag.c+'">'+subj+'</span><div class="pl-subj-bar-wrap"><div class="pl-subj-bar-fill" style="width:'+p+'%;background:'+tag.c+'"></div></div><span class="pl-subj-pct" style="color:'+tag.c+'">'+p+'%</span>'+(dd?'<span class="pl-subj-exam">'+dd+'</span>':'')+'</div>';});
document.getElementById('plSubjProg').innerHTML=sp;
if(!items.length){document.getElementById('plTodoList').innerHTML='<div class="pl-todo-empty">📭 할 일 없음</div>';drawClock(ds);return;}
var th='';Object.keys(grouped).forEach(function(subj){var tag=TODO_TAGS[subj]||{bg:'rgba(108,92,231,.15)',c:'#6c5ce7'};
th+='<div class="pl-subj-group"><div class="pl-subj-group-hdr"><span class="pl-subj-group-tag" style="background:'+tag.bg+';color:'+tag.c+'">'+subj+'</span><span class="pl-subj-group-count">'+grouped[subj].filter(function(x){return todoChecked[x.id]}).length+'/'+grouped[subj].length+'</span></div>';
grouped[subj].forEach(function(it){var dn=todoChecked[it.id];
th+='<div class="pl-todo-item'+(dn?' done':'')+'" data-tid="'+it.id+'" style="border-left:3px solid '+tag.c+'"><div class="pl-todo-cb">'+(dn?'✓':'')+'</div><div class="pl-todo-content"><span class="pl-todo-subj" style="background:'+tag.bg+';color:'+tag.c+'">'+subj+'</span><div class="pl-todo-text">'+it.text+'</div></div></div>';});
th+='</div>';});
document.getElementById('plTodoList').innerHTML=th;
document.querySelectorAll('.pl-todo-item').forEach(function(row){row.addEventListener('click',function(){
var tid=row.dataset.tid;todoChecked[tid]=!todoChecked[tid];saveTodoChecked();
row.classList.toggle('done');row.querySelector('.pl-todo-cb').textContent=todoChecked[tid]?'✓':'';
refreshStats(ds);});});
drawClock(ds);}
function refreshStats(ds){var items=getTodoForDate(ds),total=items.length,done=items.filter(function(x){return todoChecked[x.id]}).length,pct=total?Math.round(done/total*100):0;
document.getElementById('plStatDone').textContent=done+' / '+total;
document.getElementById('plStatSub').textContent=pct===100?'완료! 🎉':total-done+'개 남음';
document.getElementById('plStatPct').textContent=pct+'%';drawDonut('donutCanvas',pct,'#6c5ce7');renderMiniCal();
var ov=calcOverall(),ovEl=document.getElementById('plOverall'),oh='';
['NCS','한국사','정처기','HSK'].forEach(function(s){var tag=TODO_TAGS[s],exam=EXAMS[s],dd=getDday(ds,exam),data=ov[s];
oh+='<div class="pl-ov-item"><div class="pl-ov-icon" style="background:'+tag.c+'">'+s.charAt(0)+'</div><div class="pl-ov-info"><div class="pl-ov-name">'+s+' <span class="pl-ov-exam">'+dd+'</span></div><div class="pl-ov-bar"><div class="pl-ov-fill" style="width:'+data.pct+'%;background:'+tag.c+'"></div></div></div><div class="pl-ov-pct" style="color:'+tag.c+'">'+data.pct+'%</div></div>';});
ovEl.innerHTML=oh;}
function closeTodo(){document.getElementById('plannerView').classList.remove('on');if(document.querySelector('.app'))document.querySelector('.app').style.display='';stopTimer();}
function plannerNav(dir){if(timerRunning)stopTimer();var d=new Date(plannerDateStr+'T00:00:00');d.setDate(d.getDate()+dir);
plannerDateStr=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
if(typeof S!=='undefined')S.selDate=plannerDateStr;mcalMonth=d.getMonth();mcalYear=d.getFullYear();openTodo();}
(function(){
document.getElementById('todoBtn').addEventListener('click',openTodo);
document.getElementById('plBack').addEventListener('click',closeTodo);
document.getElementById('plPrev').addEventListener('click',function(){plannerNav(-1)});
document.getElementById('plNext').addEventListener('click',function(){plannerNav(1)});
document.getElementById('plTimerStart').addEventListener('click',startTimer);
document.getElementById('plTimerPause').addEventListener('click',pauseTimer);
document.getElementById('plTimerResume').addEventListener('click',resumeTimer);
document.getElementById('plTimerStop').addEventListener('click',stopTimer);
document.addEventListener('keydown',function(e){if(document.getElementById('plannerView').classList.contains('on')){if(e.key==='Escape')closeTodo();if(e.key==='ArrowLeft')plannerNav(-1);if(e.key==='ArrowRight')plannerNav(1);}});
window.addEventListener('resize',function(){if(plannerDateStr&&document.getElementById('plannerView').classList.contains('on'))drawClock(plannerDateStr)});
})();
