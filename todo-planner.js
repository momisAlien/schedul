/* Daily Planner Module */
var TODO_TAGS={NCS:{l:'NCS',bg:'rgba(59,130,246,.15)',c:'#3b82f6'},한국사:{l:'한국사',bg:'rgba(239,68,68,.15)',c:'#ef4444'},정처기:{l:'정처기',bg:'rgba(34,197,94,.15)',c:'#22c55e'},HSK:{l:'HSK',bg:'rgba(234,179,8,.15)',c:'#eab308'},시험:{l:'시험',bg:'rgba(168,85,247,.15)',c:'#a855f7'}};
var EXAMS={NCS:'2026-05-09',한국사:'2026-05-23',정처기:'2026-05-24',HSK:'2026-06-14'};
var CLASSES={1:[[11,13],[15,17]],2:[[13,15]],3:[[11,13],[15,17]],4:[[13,15]]};
var WORK={2:[[9,12.5],[15,17]],5:[[9,15]]};
var DAILY={
'04-28':[['NCS','1회 30문항 시간 재고 풀이 + 오답'],['정처기','1과목 소프트웨어설계 PDF 일부'],['HSK','어휘 Day 1']],
'04-29':[['NCS','2회 풀이 + 오답'],['한국사','1~2강 수강'],['HSK','어휘 Day 2']],
'04-30':[['NCS','3회 풀이 + 오답'],['정처기','1과목 소프트웨어설계 마무리 + 기출 20문항'],['HSK','어휘 Day 3']],
'05-01':[['NCS','4회 풀이 + 오답'],['정처기','2과목 소프트웨어개발 1차'],['한국사','3~4강 수강'],['HSK','어휘 Day 4']],
'05-02':[['NCS','5회 오전 + 6회 오후 + 오답'],['정처기','2과목 기출 40문항'],['HSK','듣기 1부분 + Day 5']],
'05-03':[['NCS','7회 오전 + 8회 오후 + 오답'],['한국사','5~6강 수강'],['HSK','어휘 Day 6']],
'05-04':[['NCS','9회 풀이 + 오답'],['정처기','3과목 데이터베이스구축 1차'],['HSK','어휘 Day 7']],
'05-05':[['NCS','10회 + 전체 오답 인덱스 작성'],['한국사','7강 수강'],['HSK','어휘 Day 8']],
'05-06':[['NCS','약점 재풀이 수리·자원관리·정보 30~50문항'],['정처기','DB 2차 복습'],['HSK','어휘 Day 9']],
'05-07':[['NCS','KIC식 50문항/50분 실전훈련'],['정처기','4과목 프로그래밍언어활용 핵심'],['HSK','어휘 Day 10']],
'05-08':[['NCS','최종 오답 2회독 + 공식·함정 정리'],['NCS','수험표·신분증·시험장 체크'],['정처기','4과목 기출 20문항']],
'05-09':[['시험','🔥 KIC NCS 시험 응시!'],['한국사','연표 정리 1시간'],['정처기','5과목 정보시스템구축관리 1시간']],
'05-10':[['한국사','상 1~5강 압축 복습: 선사~고대'],['정처기','1과목 소프트웨어설계 기출 60문항'],['HSK','어휘 Day 11']],
'05-11':[['한국사','상 6~9강: 통일신라·발해·고대 문화'],['정처기','2과목 소프트웨어개발 이론+기출'],['HSK','어휘 Day 12']],
'05-12':[['한국사','상 10~13강: 고려 정치·외교·경제'],['정처기','3과목 DB: SQL·정규화·트랜잭션'],['HSK','어휘 Day 13']],
'05-13':[['한국사','상 14~17강: 고려 문화~조선 전기'],['정처기','4과목 프로그래밍·OS·네트워크'],['HSK','어휘 Day 14']],
'05-14':[['한국사','상 18~21강 + 상권 총정리'],['정처기','5과목 보안·정보시스템구축관리'],['HSK','어휘 Day 15']],
'05-15':[['한국사','하 22~25강: 조선 후기 정치·경제'],['정처기','기출 1회 100문항 + 오답'],['HSK','독해 1부분']],
'05-16':[['한국사','26~30강: 조선 후기 문화~개항기'],['정처기','기출 2회 100문항 + 오답'],['HSK','어휘 Day 16']],
'05-17':[['한국사','31~34강: 국권 피탈·개항기 경제/문화'],['정처기','기출 3회 100문항 + 오답'],['HSK','쓰기 어법 연습']],
'05-18':[['한국사','35~37강: 일제 저항·독립운동 정리'],['정처기','약점 1: DB/SQL/정규화 집중'],['HSK','어휘 Day 17']],
'05-19':[['한국사','38~40강: 현대 + 전체 연표 완성'],['정처기','약점 2: 프로그래밍·OS·네트워크'],['HSK','어휘 Day 18']],
'05-20':[['한국사','기출 1회 80분 실전 + 오답'],['정처기','CBT 모의 1회 + 과목별 점수 기록'],['HSK','독해 2부분']],
'05-21':[['한국사','기출 2회 + 시대별 약점 정리'],['정처기','CBT 모의 2회 + 과락 위험 보강'],['HSK','어휘 Day 19']],
'05-22':[['한국사','기출 3회 + 최종 암기: 왕·문화재·독립단체'],['정처기','오답노트 1~5과목 훑기'],['HSK','가볍게 유지']],
'05-23':[['시험','🔥 한국사 심화 시험 응시!'],['정처기','오후 과목별 20문항씩 100문항 점검']],
'05-24':[['시험','🔥 정보처리기사 필기 시험!'],['HSK','오후: HSK 본격 전환 시작']]
};
var todoChecked=JSON.parse(localStorage.getItem('scedul_todo_checked')||'{}');
function saveTodoChecked(){localStorage.setItem('scedul_todo_checked',JSON.stringify(todoChecked))}
var plannerDateStr=null,mcalMonth=null,mcalYear=null;
function getTodoForDate(ds){var key=ds.substring(5);var d=DAILY[key];if(!d)return[];return d.map(function(x,i){return{id:x[0]+'-'+ds+'-'+i,subj:x[0],text:x[1]}});}
function getPhase(ds){if(ds>='2026-04-28'&&ds<='2026-05-08')return'Phase 1 · NCS 집중';if(ds==='2026-05-09')return'D-Day · NCS 시험';if(ds>='2026-05-10'&&ds<='2026-05-16')return'Phase 2 전반 · 한국사+정처기';if(ds>='2026-05-17'&&ds<='2026-05-22')return'Phase 2 후반 · 기출 강화';if(ds==='2026-05-23')return'D-Day · 한국사 시험';if(ds==='2026-05-24')return'D-Day · 정처기 시험';return'';}
function getDday(ds,exam){var a=new Date(exam),b=new Date(ds);var diff=Math.ceil((a-b)/(864e5));return diff>0?'D-'+diff:diff===0?'D-Day':'완료';}
function getAllDates(){var dates=[];for(var k in DAILY)dates.push('2026-'+k);return dates.sort();}
function calcOverall(){var all=getAllDates(),res={};['NCS','한국사','정처기','HSK'].forEach(function(s){var tot=0,dn=0;all.forEach(function(ds){getTodoForDate(ds).forEach(function(it){if(it.subj===s){tot++;if(todoChecked[it.id])dn++;}});});res[s]={total:tot,done:dn,pct:tot?Math.round(dn/tot*100):0};});return res;}
function calcDayPct(ds){var items=getTodoForDate(ds);if(!items.length)return-1;var dn=items.filter(function(x){return todoChecked[x.id]}).length;return Math.round(dn/items.length*100);}
function getClockBlocks(ds){var d=new Date(ds+'T00:00:00'),dow=d.getDay(),blocks=[];
blocks.push({l:'수면',s:0,e:7,c:'#4338ca',t:'fixed'});
blocks.push({l:'기상',s:7,e:8,c:'#7c3aed',t:'fixed'});
if(CLASSES[dow])CLASSES[dow].forEach(function(b){blocks.push({l:'수업',s:b[0],e:b[1],c:'#64748b',t:'class'});});
if(WORK[dow])WORK[dow].forEach(function(b){blocks.push({l:'근로(공부⭕)',s:b[0],e:b[1],c:'rgba(99,102,241,.3)',t:'work'});});
blocks.push({l:'점심',s:12,e:13,c:'#f97316',t:'fixed'});
blocks.push({l:'저녁',s:18,e:19,c:'#f97316',t:'fixed'});
blocks.push({l:'휴식',s:21.5,e:23,c:'#06b6d4',t:'fixed'});
blocks.push({l:'취침',s:23,e:24,c:'#4338ca',t:'fixed'});
return blocks;}

function drawClock(ds){var canvas=document.getElementById('plannerClock');if(!canvas)return;
var dpr=window.devicePixelRatio||1,size=Math.min(300,window.innerWidth<600?window.innerWidth-80:300);
canvas.width=size*dpr;canvas.height=size*dpr;canvas.style.width=size+'px';canvas.style.height=size+'px';
var c=canvas.getContext('2d');c.scale(dpr,dpr);var cx=size/2,cy=size/2,R=size/2-28;
c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);var bd=getComputedStyle(document.documentElement).getPropertyValue('--bd1').trim()||'#2a2a3e';
c.strokeStyle=bd;c.lineWidth=28;c.stroke();
var blocks=getClockBlocks(ds);
blocks.forEach(function(b){var sa=(b.s/24)*Math.PI*2-Math.PI/2,ea=(b.e/24)*Math.PI*2-Math.PI/2;
c.beginPath();c.arc(cx,cy,R,sa,ea);c.strokeStyle=b.c;c.lineWidth=26;c.lineCap='butt';c.stroke();
if(b.e-b.s>=1.5){var ma=(sa+ea)/2,lx=cx+Math.cos(ma)*(R),ly=cy+Math.sin(ma)*(R);
c.save();c.translate(lx,ly);var rot=ma+Math.PI/2;c.rotate(rot);c.font='bold 8px Inter,sans-serif';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
c.fillText(b.l.length>10?b.l.substring(0,10)+'…':b.l,0,0);c.restore();}});
for(var h=0;h<24;h++){var a=(h/24)*Math.PI*2-Math.PI/2,ix=R+16,ox=R+22;
c.beginPath();c.moveTo(cx+Math.cos(a)*ix,cy+Math.sin(a)*ix);c.lineTo(cx+Math.cos(a)*ox,cy+Math.sin(a)*ox);
c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--tx3').trim()||'#606078';c.lineWidth=h%6===0?2:1;c.stroke();
if(h%3===0){var tx=cx+Math.cos(a)*(R+32),ty=cy+Math.sin(a)*(R+32);c.font='bold 9px Inter,sans-serif';
c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--tx2').trim()||'#9090a8';c.textAlign='center';c.textBaseline='middle';
c.fillText(h===0?'0':h+'',tx,ty);}}
var gr=c.createRadialGradient(cx,cy,0,cx,cy,14);gr.addColorStop(0,'#6c5ce7');gr.addColorStop(1,'#a29bfe');
c.beginPath();c.arc(cx,cy,10,0,Math.PI*2);c.fillStyle=gr;c.fill();
var now=new Date(),nh=now.getHours()+now.getMinutes()/60,na=(nh/24)*Math.PI*2-Math.PI/2;
c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(na)*(R-16),cy+Math.sin(na)*(R-16));
c.strokeStyle='#fd79a8';c.lineWidth=2;c.lineCap='round';c.stroke();
c.beginPath();c.arc(cx+Math.cos(na)*(R-16),cy+Math.sin(na)*(R-16),3,0,Math.PI*2);c.fillStyle='#fd79a8';c.fill();}

function drawDonut(id,pct,color){var cv=document.getElementById(id);if(!cv)return;var dpr=window.devicePixelRatio||1;
cv.width=56*dpr;cv.height=56*dpr;cv.style.width='56px';cv.style.height='56px';
var c=cv.getContext('2d');c.scale(dpr,dpr);var cx=28,cy=28,r=22;
c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--bg4').trim()||'#252535';c.lineWidth=5;c.stroke();
if(pct>0){c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(pct/100)*Math.PI*2);c.strokeStyle=color;c.lineWidth=5;c.lineCap='round';c.stroke();}}

function renderMiniCal(){var el=document.getElementById('plMiniCal');if(!el)return;
var y=mcalYear,m=mcalMonth,first=new Date(y,m,1),last=new Date(y,m+1,0),startDow=first.getDay(),days=last.getDate();
var MN=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
var html='<div class="pl-mcal-month"><button class="pl-mcal-nav" onclick="mcalNav(-1)">‹</button>'+y+'년 '+MN[m]+'<button class="pl-mcal-nav" onclick="mcalNav(1)">›</button></div>';
html+='<div class="pl-mcal-grid">';
['일','월','화','수','목','금','토'].forEach(function(d){html+='<div class="pl-mcal-hdr">'+d+'</div>';});
var prevDays=new Date(y,m,0).getDate();
for(var i=startDow-1;i>=0;i--){html+='<div class="pl-mcal-day om">'+(prevDays-i)+'</div>';}
var today=new Date();var todayStr=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
for(var d=1;d<=days;d++){var ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
var pct=calcDayPct(ds),cls='pl-mcal-day',bg='',numC='';
if(ds===todayStr)cls+=' today';if(ds===plannerDateStr)cls+=' sel';
if(pct>=0){cls+=' has-todo';if(pct===100){bg='background:rgba(34,197,94,.3)';numC='color:#22c55e'}else if(pct>=50){bg='background:rgba(234,179,8,.25)';numC='color:#eab308'}else if(pct>0){bg='background:rgba(59,130,246,.2)';numC='color:#3b82f6'}else{bg='background:var(--bg4)';numC='color:var(--tx3)';}}
html+='<div class="'+cls+'" style="'+bg+'" onclick="plannerGo(\''+ds+'\')" title="'+ds+(pct>=0?' ('+pct+'%)':'')+'">';
html+='<span class="pl-mcal-num" style="'+numC+'">'+d+'</span>';
if(pct>=0)html+='<div class="pl-mcal-dot" style="background:'+(pct===100?'#22c55e':pct>=50?'#eab308':pct>0?'#3b82f6':'var(--bd2)')+'"></div>';
html+='</div>';}
var rem=(startDow+days)%7;if(rem>0)for(var i=1;i<=7-rem;i++)html+='<div class="pl-mcal-day om">'+i+'</div>';
html+='</div>';el.innerHTML=html;}
function mcalNav(dir){mcalMonth+=dir;if(mcalMonth>11){mcalMonth=0;mcalYear++}if(mcalMonth<0){mcalMonth=11;mcalYear--}renderMiniCal();}
function plannerGo(ds){plannerDateStr=ds;if(typeof S!=='undefined')S.selDate=ds;openTodo();}

function openTodo(){var ds=plannerDateStr=plannerDateStr||(typeof S!=='undefined'?(S.selDate||fmt(S.cur)):new Date().toISOString().slice(0,10));
var d=new Date(ds+'T00:00:00'),items=getTodoForDate(ds),phase=getPhase(ds);
var pv=document.getElementById('plannerView');
document.getElementById('plDate').textContent=d.getFullYear()+'년 '+(d.getMonth()+1)+'월 '+d.getDate()+'일 ('+(typeof DN!=='undefined'?DN[d.getDay()]:'')+'요일)';
document.getElementById('plPhase').textContent=phase||'일정 없는 기간';
pv.classList.add('on');if(document.querySelector('.app'))document.querySelector('.app').style.display='none';
if(!mcalYear){mcalMonth=d.getMonth();mcalYear=d.getFullYear();}
renderMiniCal();
// Overall progress
var ov=calcOverall(),ovEl=document.getElementById('plOverall'),ovHtml='';
['NCS','한국사','정처기','HSK'].forEach(function(s){var tag=TODO_TAGS[s],exam=EXAMS[s],dd=getDday(ds,exam),data=ov[s];
ovHtml+='<div class="pl-ov-item"><div class="pl-ov-icon" style="background:'+tag.c+'">'+s.charAt(0)+'</div><div class="pl-ov-info"><div class="pl-ov-name">'+s+' <span class="pl-ov-exam">'+dd+' ('+exam.slice(5)+')</span></div><div class="pl-ov-bar"><div class="pl-ov-fill" style="width:'+data.pct+'%;background:'+tag.c+'"></div></div></div><div class="pl-ov-pct" style="color:'+tag.c+'">'+data.pct+'%</div></div>';});
ovEl.innerHTML=ovHtml;
// Stats
var total=items.length,done=items.filter(function(x){return todoChecked[x.id]}).length,pct=total?Math.round(done/total*100):0;
document.getElementById('plStatDone').textContent=done+' / '+total;
document.getElementById('plStatSub').textContent=pct===100?'모두 완료! 🎉':total?total-done+'개 남음':'할 일 없음';
document.getElementById('plStatPct').textContent=pct+'%';
var studyH=0;items.forEach(function(it){if(it.subj!=='시험')studyH+=1.5;});
document.getElementById('plStatStudy').textContent=studyH.toFixed(1)+'h';
document.getElementById('plStatStudySub').textContent='예상 학습량';
drawDonut('donutCanvas',pct,'#6c5ce7');
// Subject progress (daily)
var grouped={};items.forEach(function(it){if(!grouped[it.subj])grouped[it.subj]=[];grouped[it.subj].push(it);});
var spHtml='';Object.keys(grouped).forEach(function(subj){var tag=TODO_TAGS[subj]||{bg:'rgba(108,92,231,.15)',c:'#6c5ce7'};
var cnt=grouped[subj].length,dn=grouped[subj].filter(function(x){return todoChecked[x.id]}).length,p=cnt?Math.round(dn/cnt*100):0;
var exam=EXAMS[subj],dd=exam?getDday(ds,exam):'';
spHtml+='<div class="pl-subj-row"><span class="pl-subj-tag" style="background:'+tag.bg+';color:'+tag.c+'">'+subj+'</span><div class="pl-subj-bar-wrap"><div class="pl-subj-bar-fill" style="width:'+p+'%;background:'+tag.c+'"></div></div><span class="pl-subj-pct" style="color:'+tag.c+'">'+p+'%</span>'+(dd?'<span class="pl-subj-exam">'+dd+'</span>':'')+'</div>';});
document.getElementById('plSubjProg').innerHTML=spHtml;
// Todo list
if(!items.length){document.getElementById('plTodoList').innerHTML='<div class="pl-todo-empty">📭 이 날짜에 할 일이 없습니다</div>';drawClock(ds);return;}
var html='';Object.keys(grouped).forEach(function(subj){var tag=TODO_TAGS[subj]||{bg:'rgba(108,92,231,.15)',c:'#6c5ce7'};
html+='<div class="pl-subj-group"><div class="pl-subj-group-hdr"><span class="pl-subj-group-tag" style="background:'+tag.bg+';color:'+tag.c+'">'+subj+'</span><span class="pl-subj-group-count">'+grouped[subj].filter(function(x){return todoChecked[x.id]}).length+'/'+grouped[subj].length+'</span></div>';
grouped[subj].forEach(function(it){var dn=todoChecked[it.id];
html+='<div class="pl-todo-item'+(dn?' done':'')+'" data-tid="'+it.id+'" style="border-left:3px solid '+tag.c+'"><div class="pl-todo-cb">'+(dn?'✓':'')+'</div><div class="pl-todo-content"><span class="pl-todo-subj" style="background:'+tag.bg+';color:'+tag.c+'">'+subj+'</span><div class="pl-todo-text">'+it.text+'</div></div></div>';});
html+='</div>';});
document.getElementById('plTodoList').innerHTML=html;
document.querySelectorAll('.pl-todo-item').forEach(function(row){row.addEventListener('click',function(){
var tid=row.dataset.tid;todoChecked[tid]=!todoChecked[tid];saveTodoChecked();
row.classList.toggle('done');row.querySelector('.pl-todo-cb').textContent=todoChecked[tid]?'✓':'';
refreshStats(ds);});});
drawClock(ds);}

function refreshStats(ds){var items=getTodoForDate(ds),total=items.length,done=items.filter(function(x){return todoChecked[x.id]}).length,pct=total?Math.round(done/total*100):0;
document.getElementById('plStatDone').textContent=done+' / '+total;
document.getElementById('plStatSub').textContent=pct===100?'모두 완료! 🎉':total-done+'개 남음';
document.getElementById('plStatPct').textContent=pct+'%';
drawDonut('donutCanvas',pct,'#6c5ce7');
renderMiniCal();
var ov=calcOverall(),ovEl=document.getElementById('plOverall'),ovHtml='';
['NCS','한국사','정처기','HSK'].forEach(function(s){var tag=TODO_TAGS[s],exam=EXAMS[s],dd=getDday(ds,exam),data=ov[s];
ovHtml+='<div class="pl-ov-item"><div class="pl-ov-icon" style="background:'+tag.c+'">'+s.charAt(0)+'</div><div class="pl-ov-info"><div class="pl-ov-name">'+s+' <span class="pl-ov-exam">'+dd+' ('+exam.slice(5)+')</span></div><div class="pl-ov-bar"><div class="pl-ov-fill" style="width:'+data.pct+'%;background:'+tag.c+'"></div></div></div><div class="pl-ov-pct" style="color:'+tag.c+'">'+data.pct+'%</div></div>';});
ovEl.innerHTML=ovHtml;
var grouped={};items.forEach(function(it){if(!grouped[it.subj])grouped[it.subj]=[];grouped[it.subj].push(it);});
document.querySelectorAll('.pl-subj-group').forEach(function(g){var tag=g.querySelector('.pl-subj-group-tag');if(!tag)return;var subj=tag.textContent;if(!grouped[subj])return;
var ce=g.querySelector('.pl-subj-group-count');if(ce)ce.textContent=grouped[subj].filter(function(x){return todoChecked[x.id]}).length+'/'+grouped[subj].length;});}

function closeTodo(){document.getElementById('plannerView').classList.remove('on');if(document.querySelector('.app'))document.querySelector('.app').style.display='';}
function plannerNav(dir){var d=new Date(plannerDateStr+'T00:00:00');d.setDate(d.getDate()+dir);
plannerDateStr=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
if(typeof S!=='undefined')S.selDate=plannerDateStr;mcalMonth=d.getMonth();mcalYear=d.getFullYear();openTodo();}

(function(){
document.getElementById('todoBtn').addEventListener('click',openTodo);
document.getElementById('plBack').addEventListener('click',closeTodo);
document.getElementById('plPrev').addEventListener('click',function(){plannerNav(-1)});
document.getElementById('plNext').addEventListener('click',function(){plannerNav(1)});
document.addEventListener('keydown',function(e){if(document.getElementById('plannerView').classList.contains('on')){if(e.key==='Escape')closeTodo();if(e.key==='ArrowLeft')plannerNav(-1);if(e.key==='ArrowRight')plannerNav(1);}});
window.addEventListener('resize',function(){if(plannerDateStr&&document.getElementById('plannerView').classList.contains('on'))drawClock(plannerDateStr)});
})();
