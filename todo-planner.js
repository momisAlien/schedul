/* ===== DAILY PLANNER MODULE ===== */
const TODO_TAGS={NCS:{label:'NCS',bg:'rgba(59,130,246,.15)',color:'#3b82f6',border:'#3b82f6'},한국사:{label:'한국사',bg:'rgba(239,68,68,.15)',color:'#ef4444',border:'#ef4444'},정처기:{label:'정처기',bg:'rgba(34,197,94,.15)',color:'#22c55e',border:'#22c55e'},HSK:{label:'HSK',bg:'rgba(234,179,8,.15)',color:'#eab308',border:'#eab308'},시험:{label:'시험',bg:'rgba(168,85,247,.15)',color:'#a855f7',border:'#a855f7'}};

function getTodoForDate(ds){
const items=[];
if(ds>='2026-04-28'&&ds<='2026-05-08'){
items.push({id:'ncs-'+ds,subj:'NCS',text:'혼잡 PSAT 300제 — 하루 30문제 풀이 및 오답 분석',time:[8,10]});
items.push({id:'kor-'+ds,subj:'한국사',text:'최태성 별별한국사 — 하루 1강 수강',time:[13,14]});
items.push({id:'jcg-'+ds,subj:'정처기',text:'핵심요약 PDF — 하루 5~10페이지 정독',time:[14,16]});
items.push({id:'hsk-'+ds,subj:'HSK',text:'해커스 핵심어휘집 — 1Day 눈도장 10분',time:[16,16.5]});
}
if(ds==='2026-05-08')items.push({id:'ncs-review-'+ds,subj:'NCS',text:'누적 오답 총복습 및 실전 시뮬레이션',time:[10,12]});
if(ds==='2026-05-09')items.push({id:'ncs-exam-'+ds,subj:'시험',text:'🔥 KIC 청년인턴 NCS 시험 응시!',time:[9,12]});
if(ds>='2026-05-10'&&ds<='2026-05-16'){
items.push({id:'kor2-'+ds,subj:'한국사',text:'하루 2~3강 몰아보기',time:[8,11]});
items.push({id:'jcg2-'+ds,subj:'정처기',text:'3~5과목 PDF 정독',time:[13,16]});
items.push({id:'hsk2-'+ds,subj:'HSK',text:'해커스 핵심어휘집 1Day 눈도장 유지',time:[16,16.5]});
}
if(ds>='2026-05-17'&&ds<='2026-05-22'){
items.push({id:'kor3-'+ds,subj:'한국사',text:'심화 기출 1회차 풀이 + 개념 보완',time:[8,11]});
items.push({id:'jcg3-'+ds,subj:'정처기',text:'CBT 기출 2회차 풀이 + PDF 오답 발췌독',time:[13,16]});
}
if(ds==='2026-05-23'){
items.push({id:'kor-exam-'+ds,subj:'시험',text:'🔥 한국사 시험 응시!',time:[9,11]});
items.push({id:'jcg-cram-'+ds,subj:'정처기',text:'정처기 직전 벼락치기',time:[13,18]});
}
if(ds==='2026-05-24')items.push({id:'jcg-exam-'+ds,subj:'시험',text:'🔥 정보처리기사 필기 시험 응시!',time:[9,12]});
if(ds>='2026-05-25'&&ds<='2026-06-15'){
items.push({id:'hsk3-'+ds,subj:'HSK',text:'핵심어휘집 3Day씩 누적 복습 (iBT 타이핑 연습)',time:[8,10]});
items.push({id:'hsk4-'+ds,subj:'HSK',text:'쓰기 1부분 문법 공식 하루 2개 암기',time:[10,11]});
items.push({id:'hsk5-'+ds,subj:'HSK',text:'실전모의고사 듣기 1회 풀이',time:[13,14]});
}
return items;
}

function getPhase(ds){
if(ds>='2026-04-28'&&ds<='2026-05-08')return 'Phase 1 · NCS 집중 기간';
if(ds==='2026-05-09')return 'Phase 1 결전 · NCS 시험일';
if(ds>='2026-05-10'&&ds<='2026-05-16')return 'Phase 2 전반 · 한국사+정처기 몰입';
if(ds>='2026-05-17'&&ds<='2026-05-22')return 'Phase 2 후반 · 기출 풀이 강화';
if(ds==='2026-05-23')return 'Phase 2 이벤트 · 한국사 시험일';
if(ds==='2026-05-24')return 'Phase 2 결전 · 정처기 시험일';
if(ds>='2026-05-25'&&ds<='2026-06-15')return 'Phase 3 · HSK 집중 기간';
return '';
}

function getTimeBlocks(ds){
const items=getTodoForDate(ds);
const blocks=[{label:'수면',start:0,end:7,color:'#6366f1'},{label:'기상·준비',start:7,end:8,color:'#8b5cf6'}];
items.forEach(it=>{
if(!it.time)return;
const tag=TODO_TAGS[it.subj]||{color:'#6c5ce7'};
blocks.push({label:it.subj+': '+it.text.split('—')[0].trim(),start:it.time[0],end:it.time[1],color:tag.border});
});
blocks.push({label:'점심',start:12,end:13,color:'#f97316'});
blocks.push({label:'저녁·휴식',start:18,end:22,color:'#06b6d4'});
blocks.push({label:'취침 준비',start:22,end:24,color:'#6366f1'});
blocks.sort((a,b)=>a.start-b.start);
return blocks;
}

let todoChecked=JSON.parse(localStorage.getItem('scedul_todo_checked')||'{}');
function saveTodoChecked(){localStorage.setItem('scedul_todo_checked',JSON.stringify(todoChecked))}
let plannerDateStr=null;

/* Draw 24h circular clock */
function drawClock(ds){
const canvas=document.getElementById('plannerClock');
if(!canvas)return;
const dpr=window.devicePixelRatio||1;
const size=Math.min(380, window.innerWidth<600?window.innerWidth-80:380);
canvas.width=size*dpr; canvas.height=size*dpr;
canvas.style.width=size+'px'; canvas.style.height=size+'px';
const c=canvas.getContext('2d');
c.scale(dpr,dpr);
const cx=size/2,cy=size/2,R=size/2-30;

// Background ring
c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);
c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--bd1').trim()||'#2a2a3e';
c.lineWidth=36;c.stroke();

// Draw time blocks
const blocks=getTimeBlocks(ds);
blocks.forEach(b=>{
const startAngle=(b.start/24)*Math.PI*2-Math.PI/2;
const endAngle=(b.end/24)*Math.PI*2-Math.PI/2;
c.beginPath();c.arc(cx,cy,R,startAngle,endAngle);
c.strokeStyle=b.color;c.lineWidth=34;c.lineCap='butt';c.stroke();
// Label
const midAngle=(startAngle+endAngle)/2;
const span=b.end-b.start;
if(span>=1){
const lx=cx+Math.cos(midAngle)*(R-2);
const ly=cy+Math.sin(midAngle)*(R-2);
c.save();c.translate(lx,ly);
let rot=midAngle+Math.PI/2;
if(midAngle>Math.PI/2&&midAngle<Math.PI*1.5)rot+=Math.PI;
if(midAngle>0&&midAngle<Math.PI)rot=midAngle+Math.PI/2;
c.rotate(rot);
c.font=`bold ${span>=2?11:9}px Inter,sans-serif`;
c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
const lbl=b.label.length>12?b.label.substring(0,12)+'…':b.label;
c.fillText(lbl,0,0);c.restore();
}
});

// Hour markers
for(let h=0;h<24;h++){
const angle=(h/24)*Math.PI*2-Math.PI/2;
const inner=R+20,outer=R+26;
const x1=cx+Math.cos(angle)*inner,y1=cy+Math.sin(angle)*inner;
const x2=cx+Math.cos(angle)*outer,y2=cy+Math.sin(angle)*outer;
c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);
c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--tx3').trim()||'#606078';
c.lineWidth=h%6===0?2:1;c.stroke();
// Hour text
if(h%3===0){
const tx=cx+Math.cos(angle)*(R+38),ty=cy+Math.sin(angle)*(R+38);
c.font='bold 10px Inter,sans-serif';
c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--tx2').trim()||'#9090a8';
c.textAlign='center';c.textBaseline='middle';
c.fillText(h===0?'12AM':h===12?'12PM':h<12?h+'AM':(h-12)+'PM',tx,ty);
}
}

// Center circle
const grad=c.createRadialGradient(cx,cy,0,cx,cy,20);
grad.addColorStop(0,'#6c5ce7');grad.addColorStop(1,'#a29bfe');
c.beginPath();c.arc(cx,cy,14,0,Math.PI*2);c.fillStyle=grad;c.fill();
c.beginPath();c.arc(cx,cy,6,0,Math.PI*2);
c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--bg2').trim()||'#16161e';c.fill();

// Current time needle
const now=new Date();
const nowH=now.getHours()+now.getMinutes()/60;
const needleAngle=(nowH/24)*Math.PI*2-Math.PI/2;
c.beginPath();c.moveTo(cx,cy);
c.lineTo(cx+Math.cos(needleAngle)*(R-20),cy+Math.sin(needleAngle)*(R-20));
c.strokeStyle='#fd79a8';c.lineWidth=2.5;c.lineCap='round';c.stroke();
c.beginPath();c.arc(cx+Math.cos(needleAngle)*(R-20),cy+Math.sin(needleAngle)*(R-20),4,0,Math.PI*2);
c.fillStyle='#fd79a8';c.fill();
}

/* Mini donut for stat card */
function drawDonut(canvasId,pct,color){
const canvas=document.getElementById(canvasId);if(!canvas)return;
const dpr=window.devicePixelRatio||1;
canvas.width=70*dpr;canvas.height=70*dpr;
canvas.style.width='70px';canvas.style.height='70px';
const c=canvas.getContext('2d');c.scale(dpr,dpr);
const cx=35,cy=35,r=28;
c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);
c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--bg4').trim()||'#252535';
c.lineWidth=7;c.stroke();
if(pct>0){
c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(pct/100)*Math.PI*2);
c.strokeStyle=color;c.lineWidth=7;c.lineCap='round';c.stroke();
}
}

function openTodo(){
const ds=plannerDateStr=S.selDate||fmt(S.cur);
const d=new Date(ds+'T00:00:00');
const items=getTodoForDate(ds);
const phase=getPhase(ds);
const pv=document.getElementById('plannerView');

// Header
document.getElementById('plDate').textContent=`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${DN[d.getDay()]})`;
document.getElementById('plPhase').textContent=phase||'일정 없는 기간';

// Show view
pv.classList.add('on');
document.querySelector('.app').style.display='none';

if(!items.length){
document.getElementById('plTodoList').innerHTML='<div class="pl-todo-empty"><span class="pl-todo-empty-icon">📭</span>이 날짜에 할 일이 없습니다</div>';
document.getElementById('plSubjProg').innerHTML='';
document.getElementById('plStatDone').textContent='0 / 0';
document.getElementById('plStatSub').textContent='할 일 없음';
document.getElementById('plStatPct').textContent='0%';
document.getElementById('plStatStudy').textContent='0h';
document.getElementById('plStatStudySub').textContent='공부 시간 없음';
drawClock(ds);drawDonut('donutCanvas',0,'#6c5ce7');
return;
}

// Stats
const total=items.length,done=items.filter(x=>todoChecked[x.id]).length;
const pct=total?Math.round(done/total*100):0;
const studyH=items.reduce((s,it)=>s+(it.time?(it.time[1]-it.time[0]):0),0);
document.getElementById('plStatDone').textContent=`${done} / ${total}`;
document.getElementById('plStatSub').textContent=pct===100?'모두 완료! 🎉':`${total-done}개 남음`;
document.getElementById('plStatPct').textContent=pct+'%';
document.getElementById('plStatStudy').textContent=studyH+'h';
document.getElementById('plStatStudySub').textContent='오늘의 학습량';

// Subject progress bars
const grouped={};items.forEach(it=>{if(!grouped[it.subj])grouped[it.subj]=[];grouped[it.subj].push(it)});
let spHtml='';
Object.keys(grouped).forEach(subj=>{
const tag=TODO_TAGS[subj]||{bg:'rgba(108,92,231,.15)',color:'var(--ac1)'};
const cnt=grouped[subj].length,dn=grouped[subj].filter(x=>todoChecked[x.id]).length;
const p=cnt?Math.round(dn/cnt*100):0;
spHtml+=`<div class="pl-subj-row"><span class="pl-subj-tag" style="background:${tag.bg};color:${tag.color}">${subj}</span><div class="pl-subj-bar-wrap"><div class="pl-subj-bar-fill" style="width:${p}%;background:${tag.color}"></div></div><span class="pl-subj-pct" style="color:${tag.color}">${p}%</span></div>`;
});
document.getElementById('plSubjProg').innerHTML=spHtml;

// Todo list
let html='';
Object.keys(grouped).forEach(subj=>{
const tag=TODO_TAGS[subj]||{bg:'rgba(108,92,231,.15)',color:'var(--ac1)',border:'var(--ac1)'};
html+=`<div class="pl-subj-group"><div class="pl-subj-group-hdr"><span class="pl-subj-group-tag" style="background:${tag.bg};color:${tag.color}">${subj}</span><span class="pl-subj-group-count">${grouped[subj].filter(x=>todoChecked[x.id]).length}/${grouped[subj].length}</span></div>`;
grouped[subj].forEach(it=>{
const dn=todoChecked[it.id];
html+=`<div class="pl-todo-item${dn?' done':''}" data-tid="${it.id}" style="--tag-color:${tag.border}"><div class="pl-todo-cb">${dn?'✓':''}</div><div class="pl-todo-content"><span class="pl-todo-subj" style="background:${tag.bg};color:${tag.color}">${subj}</span><div class="pl-todo-text">${it.text}</div></div></div>`;
});
html+='</div>';
});
document.getElementById('plTodoList').innerHTML=html;

// Bind clicks
document.querySelectorAll('.pl-todo-item').forEach(row=>{
row.style.setProperty('--tag-color',row.style.getPropertyValue('--tag-color'));
row.querySelector('.pl-todo-item::before')||null;
row.addEventListener('click',()=>{
const tid=row.dataset.tid;
todoChecked[tid]=!todoChecked[tid];saveTodoChecked();
row.classList.toggle('done');
row.querySelector('.pl-todo-cb').textContent=todoChecked[tid]?'✓':'';
refreshPlannerStats(ds);
});
});

// Style the left border using CSS variable
document.querySelectorAll('.pl-todo-item').forEach(el=>{
const c=el.style.getPropertyValue('--tag-color');
el.style.borderLeft=`4px solid ${c}`;
});

drawClock(ds);
drawDonut('donutCanvas',pct,'#6c5ce7');
}

function refreshPlannerStats(ds){
const items=getTodoForDate(ds);
const total=items.length,done=items.filter(x=>todoChecked[x.id]).length;
const pct=total?Math.round(done/total*100):0;
document.getElementById('plStatDone').textContent=`${done} / ${total}`;
document.getElementById('plStatSub').textContent=pct===100?'모두 완료! 🎉':`${total-done}개 남음`;
document.getElementById('plStatPct').textContent=pct+'%';
drawDonut('donutCanvas',pct,'#6c5ce7');

// Update subject bars
const grouped={};items.forEach(it=>{if(!grouped[it.subj])grouped[it.subj]=[];grouped[it.subj].push(it)});
let spHtml='';
Object.keys(grouped).forEach(subj=>{
const tag=TODO_TAGS[subj]||{bg:'rgba(108,92,231,.15)',color:'var(--ac1)'};
const cnt=grouped[subj].length,dn=grouped[subj].filter(x=>todoChecked[x.id]).length;
const p=cnt?Math.round(dn/cnt*100):0;
spHtml+=`<div class="pl-subj-row"><span class="pl-subj-tag" style="background:${tag.bg};color:${tag.color}">${subj}</span><div class="pl-subj-bar-wrap"><div class="pl-subj-bar-fill" style="width:${p}%;background:${tag.color}"></div></div><span class="pl-subj-pct" style="color:${tag.color}">${p}%</span></div>`;
});
document.getElementById('plSubjProg').innerHTML=spHtml;
// Update group counts
document.querySelectorAll('.pl-subj-group').forEach(g=>{
const tag=g.querySelector('.pl-subj-group-tag');
if(!tag)return;
const subj=tag.textContent;
if(!grouped[subj])return;
const countEl=g.querySelector('.pl-subj-group-count');
if(countEl)countEl.textContent=`${grouped[subj].filter(x=>todoChecked[x.id]).length}/${grouped[subj].length}`;
});
}

function closeTodo(){
document.getElementById('plannerView').classList.remove('on');
document.querySelector('.app').style.display='';
}

function plannerNav(dir){
const d=new Date(plannerDateStr+'T00:00:00');
d.setDate(d.getDate()+dir);
plannerDateStr=fmt(d);
S.selDate=plannerDateStr;
openTodo();
}

(function(){
document.getElementById('todoBtn').addEventListener('click',openTodo);
document.getElementById('plBack').addEventListener('click',closeTodo);
document.getElementById('plPrev').addEventListener('click',function(){plannerNav(-1)});
document.getElementById('plNext').addEventListener('click',function(){plannerNav(1)});
document.addEventListener('keydown',function(e){
if(document.getElementById('plannerView').classList.contains('on')){
if(e.key==='Escape')closeTodo();
if(e.key==='ArrowLeft')plannerNav(-1);
if(e.key==='ArrowRight')plannerNav(1);
}
});
window.addEventListener('resize',function(){if(plannerDateStr&&document.getElementById('plannerView').classList.contains('on'))drawClock(plannerDateStr)});
})();

