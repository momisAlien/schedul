// SCEDUL · Scriptable. Install from your SCEDUL site's widget menu.
const SITE = '__SCEDUL_SITE__';
const DEFAULT_THEME = 'auto'; // auto / dark / light
const themeInput=String(args.widgetParameter||DEFAULT_THEME).trim().toLowerCase();
const mode=({white:'light',화이트:'light',다크:'dark',자동:'auto'})[themeInput]||themeInput;
const dark=mode==='dark'||(mode!=='light'&&Device.isUsingDarkAppearance());
const palette=dark?{bg:'#161d20',text:'#e8edeb',secondary:'#afbfba',muted:'#91aaa2',track:'#303a3e',accent:'#80b6a7',warning:'#dbb68b'}:{bg:'#fafbf8',text:'#263530',secondary:'#5a6c63',muted:'#667d72',track:'#e0e6df',accent:'#487c6b',warning:'#8b6338'};
const ROOT = 'https://firestore.googleapis.com/v1/projects/scedul-app/databases/(default)/documents/calendar/admin/';
const fm=FileManager.local(),cachePath=fm.joinPath(fm.documentsDirectory(),'scedul-widget-cache-v1.json');
function decode(v){if('stringValue'in v)return v.stringValue;if('booleanValue'in v)return v.booleanValue;if('integerValue'in v)return Number(v.integerValue);if('doubleValue'in v)return v.doubleValue;if(v.arrayValue)return(v.arrayValue.values||[]).map(decode);if(v.mapValue)return fields(v.mapValue.fields||{});return null}
function fields(f){return Object.fromEntries(Object.entries(f).map(([k,v])=>[k,decode(v)]))}
async function json(url,optional=false){const r=new Request(url);r.timeoutInterval=15;const result=await r.loadJSON();if(r.response.statusCode===404&&optional)return {};if(r.response.statusCode>=400||result.error)throw new Error('동기화 오류');return result}
async function collection(name){let out={},token='';do{const r=await json(ROOT+name+'?pageSize=300'+(token?'&pageToken='+encodeURIComponent(token):''));for(const doc of r.documents||[])out[doc.name.split('/').pop()]=fields(doc.fields||{});token=r.nextPageToken||''}while(token);return out}
function dayKey(ms){return new Date(ms+32400000).toISOString().slice(0,10)}
function clockText(m){return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function buildToday(data,now){const day=dayKey(now),dow=new Date(now+32400000).getUTCDay(),blocks=[];
for(const [id,b]of Object.entries({...data.defaults.blocks,...data.timetable})){if(b.deleted)continue;if((b.days||[]).includes(dow))blocks.push({...b,id,s:b.start,e:b.end>b.start?b.end:1440});if(b.end<=b.start&&b.end>0&&(b.days||[]).includes((dow+6)%7))blocks.push({...b,id,s:0,e:b.end})}blocks.sort((a,b)=>a.s-b.s);
const tasks={};if(day.startsWith('2026-'))(data.defaults.daily[day.slice(5)]||[]).forEach((x,i)=>{const id=x[0]+'-'+day+'-'+i;tasks[id]={id,subj:x[0],text:x[1]}});
for(const [id,t]of Object.entries(data.tasks)){delete tasks[id];if(t.date===day&&!t.deleted)tasks[id]={id,...t}}
const allTasks=Object.values(tasks).map(t=>({...t,done:!!data.checked[t.id]})).sort((a,b)=>Number(a.done)-Number(b.done)||(a.order||0)-(b.order||0));const todos=allTasks.filter(t=>!t.done);const events=Object.values(data.events).filter(e=>e.date<=day&&(e.endDate||e.date)>=day).sort((a,b)=>(a.startTime||'').localeCompare(b.startTime||''));return{day,blocks,todos,allTasks,events}}
function ring(blocks,now){const d=new DrawContext();d.size=new Size(180,180);d.opaque=false;d.respectScreenScale=true;const center=90,r=65;
function arc(start,end,color,width){const p=new Path();for(let m=start,i=0;m<=end;m+=Math.max(1,(end-start)/120),i++){const a=m/1440*Math.PI*2-Math.PI/2,pt=new Point(center+Math.cos(a)*r,center+Math.sin(a)*r);if(i===0)p.move(pt);else p.addLine(pt)}d.addPath(p);d.setStrokeColor(new Color(color));d.setLineWidth(width);d.strokePath()}
arc(0,1440,palette.track,15);for(const b of blocks)if(b.e>b.s)arc(b.s+1,b.e-1,/^#[0-9a-f]{6}$/i.test(b.color)?b.color:'#258acc',15);
d.setTextColor(new Color(palette.secondary));d.setFont(Font.mediumSystemFont(9));d.setTextAlignedCenter();for(let h=0;h<24;h+=3){const a=h/24*Math.PI*2-Math.PI/2;d.drawTextInRect(String(h),new Rect(center+Math.cos(a)*83-9,center+Math.sin(a)*83-6,18,12))}
const date=new Date(now+32400000),m=date.getUTCHours()*60+date.getUTCMinutes(),a=m/1440*Math.PI*2-Math.PI/2,p=new Path();p.move(new Point(90,90));p.addLine(new Point(90+Math.cos(a)*50,90+Math.sin(a)*50));d.addPath(p);d.setLineWidth(2);d.setStrokeColor(new Color(palette.text));d.strokePath();d.setFillColor(new Color(palette.accent));d.fillEllipse(new Rect(87,87,6,6));return d.getImage()}
function text(parent,value,size=12,color=palette.text){const t=parent.addText(value);t.font=Font.mediumSystemFont(size);t.textColor=new Color(color);t.lineLimit=1;return t}
function card(parent,height=30){const c=parent.addStack();c.layoutHorizontally();c.centerAlignContent();c.setPadding(4,8,4,8);c.size=new Size(0,height);c.backgroundColor=new Color(dark?'#232e32':'#edf1ec');c.cornerRadius=8;return c}
function taskLink(day,id){return SITE+'/#planner&date='+encodeURIComponent(day)+'&task='+encodeURIComponent(id)}
function taskCards(parent,today,limit,wide=false){const done=today.allTasks.length-today.todos.length;
if(wide){const heading=parent.addStack();heading.layoutHorizontally();text(heading,'할 일',12,palette.secondary);heading.addSpacer();text(heading,done+' / '+today.allTasks.length+' 완료',12,palette.accent)}else{text(parent,'할 일',11,palette.secondary);parent.addSpacer(4);text(parent,done+' / '+today.allTasks.length+' 완료',14,palette.accent)}parent.addSpacer(8);
if(!today.allTasks.length){const c=card(parent,32);text(c,'등록된 할 일 없음',10,palette.muted);return}
for(const t of today.allTasks.slice(0,limit)){const c=card(parent,wide?30:24);c.url=taskLink(today.day,t.id);text(c,t.done?'☑':'☐',16,t.done?palette.accent:palette.muted);c.addSpacer(6);text(c,t.text,11,t.done?palette.muted:palette.text);parent.addSpacer(4)}
if(today.allTasks.length>limit){const more=text(parent,'+'+(today.allTasks.length-limit)+'개 보기',10,palette.muted);more.url=SITE+'/#planner'}
}
function scheduleCards(parent,today,now){text(parent,'오늘 시간표',11,palette.secondary);parent.addSpacer(7);
const minute=new Date(now+32400000).getUTCHours()*60+new Date(now+32400000).getUTCMinutes();
const entries=today.events.map(e=>({label:e.title,time:e.allDay?'종일':e.startTime||'',color:palette.accent})).concat(today.blocks.map(b=>({label:b.name,time:clockText(b.s)+'–'+clockText(b.e),color:b.color,ended:b.e<=minute}))).sort((a,b)=>Number(!!a.ended)-Number(!!b.ended));
if(!entries.length)text(parent,'등록된 일정 없음',11,palette.muted);
for(const entry of entries.slice(0,3)){const c=card(parent,32);text(c,'●',8,/^#[0-9a-f]{6}$/i.test(entry.color)?entry.color:palette.accent);c.addSpacer(6);const label=c.addStack();label.layoutVertically();text(label,entry.label,11,entry.ended?palette.muted:palette.text);text(label,entry.time,9,palette.muted);parent.addSpacer(4)}
if(entries.length>3)text(parent,'+'+(entries.length-3)+'개',9,palette.muted);
}
async function main(){const now=Date.now();let data,stale=false;
try{const [defaults,timetable,tasks,events,checkedDoc]=await Promise.all([json(SITE+'/widget-defaults.json'),collection('timetable'),collection('tasks'),collection('events'),json(ROOT+'planner/todoChecked',true)]);data={defaults,timetable,tasks,events,checked:fields(checkedDoc.fields||{}).data||{},updated:now};fm.writeString(cachePath,JSON.stringify(data))}catch(e){stale=true;if(fm.fileExists(cachePath))try{data=JSON.parse(fm.readString(cachePath))}catch(_){} }
let family=config.widgetFamily||'medium';
if(!config.runsInWidget){const picker=new Alert();picker.title='위젯 미리보기';picker.message='확인할 크기를 선택하세요.';picker.addAction('작게');picker.addAction('중간');picker.addAction('크게');picker.addCancelAction('취소');const choice=await picker.presentSheet();if(choice<0){Script.complete();return}family=['small','medium','large'][choice]}
const large=family==='large',small=family==='small';
const w=new ListWidget();w.backgroundColor=new Color(palette.bg);w.setPadding(14,14,14,14);w.url=SITE+'/#planner';w.refreshAfterDate=new Date(Math.min(now+15*60000,Date.parse(dayKey(now)+'T00:00:00+09:00')+86400000));
if(!data){text(w,'SCEDUL',15);w.addSpacer(8);text(w,'연결 후 다시 실행해 주세요',11,palette.secondary)}else{const today=buildToday(data,now);text(w,today.day.slice(5).replace('-','월 ')+'일 · 계획표',12,palette.secondary);w.addSpacer(large?8:6);
const row=w.addStack();row.topAlignContent();const image=row.addImage(ring(today.blocks,now));const side=small?106:large?132:108;image.imageSize=new Size(side,side);
if(!small){row.addSpacer(10);const right=row.addStack();right.layoutVertically();right.size=new Size(120,0);if(large)scheduleCards(right,today,now);else taskCards(right,today,2)}
if(large){w.addSpacer(12);taskCards(w,today,3,true)}
if(stale){w.addSpacer(3);text(w,'오프라인 · 저장된 기록',9,palette.warning)}}
// Flexible space belongs below the content so large widgets never center a short list.
w.addSpacer();
Script.setWidget(w);if(!config.runsInWidget){if(large)await w.presentLarge();else if(small)await w.presentSmall();else await w.presentMedium()}Script.complete()}
await main();
