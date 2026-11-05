// SCEDUL · Scriptable. Install from your SCEDUL site's widget menu.
const SITE = '__SCEDUL_SITE__';
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
const todos=Object.values(tasks).filter(t=>!data.checked[t.id]);const events=Object.values(data.events).filter(e=>e.date<=day&&(e.endDate||e.date)>=day).sort((a,b)=>(a.startTime||'').localeCompare(b.startTime||''));return{day,blocks,todos,events}}
function ring(blocks,now){const d=new DrawContext();d.size=new Size(180,180);d.opaque=false;d.respectScreenScale=true;const center=90,r=65;
function arc(start,end,color,width){const p=new Path();for(let m=start,i=0;m<=end;m+=Math.max(1,(end-start)/120),i++){const a=m/1440*Math.PI*2-Math.PI/2,pt=new Point(center+Math.cos(a)*r,center+Math.sin(a)*r);if(i===0)p.move(pt);else p.addLine(pt)}d.addPath(p);d.setStrokeColor(new Color(color));d.setLineWidth(width);d.strokePath()}
arc(0,1440,'303a3e',15);for(const b of blocks)if(b.e>b.s)arc(b.s+1,b.e-1,/^#[0-9a-f]{6}$/i.test(b.color)?b.color:'#258acc',15);
d.setTextColor(new Color('#afbfba'));d.setFont(Font.mediumSystemFont(9));d.setTextAlignedCenter();for(let h=0;h<24;h+=3){const a=h/24*Math.PI*2-Math.PI/2;d.drawTextInRect(String(h),new Rect(center+Math.cos(a)*83-9,center+Math.sin(a)*83-6,18,12))}
const date=new Date(now+32400000),m=date.getUTCHours()*60+date.getUTCMinutes(),a=m/1440*Math.PI*2-Math.PI/2,p=new Path();p.move(new Point(90,90));p.addLine(new Point(90+Math.cos(a)*50,90+Math.sin(a)*50));d.addPath(p);d.setLineWidth(2);d.setStrokeColor(new Color('#e8edeb'));d.strokePath();d.setFillColor(new Color('#80b6a7'));d.fillEllipse(new Rect(87,87,6,6));return d.getImage()}
function text(parent,value,size=12,color='#e8edeb'){const t=parent.addText(value);t.font=Font.mediumSystemFont(size);t.textColor=new Color(color);t.lineLimit=1;return t}
async function main(){const now=Date.now();let data,stale=false;
try{const [defaults,timetable,tasks,events,checkedDoc]=await Promise.all([json(SITE+'/widget-defaults.json'),collection('timetable'),collection('tasks'),collection('events'),json(ROOT+'planner/todoChecked',true)]);data={defaults,timetable,tasks,events,checked:fields(checkedDoc.fields||{}).data||{},updated:now};fm.writeString(cachePath,JSON.stringify(data))}catch(e){stale=true;if(fm.fileExists(cachePath))try{data=JSON.parse(fm.readString(cachePath))}catch(_){} }
const w=new ListWidget();w.backgroundColor=new Color('#161d20');w.setPadding(14,14,14,14);w.url=SITE+'/#planner';w.refreshAfterDate=new Date(Math.min(now+15*60000,Date.parse(dayKey(now)+'T00:00:00+09:00')+86400000));
if(!data){text(w,'SCEDUL',15);w.addSpacer(8);text(w,'연결 후 다시 실행해 주세요',11,'#afbfba')}else{const today=buildToday(data,now),family=config.widgetFamily||'medium',large=family==='large',small=family==='small';text(w,today.day.slice(5).replace('-','월 ')+'일 · 계획표',12,'#afbfba');w.addSpacer(6);
const row=w.addStack();row.centerAlignContent();const image=row.addImage(ring(today.blocks,now));image.imageSize=new Size(small?106:large?160:112,small?106:large?160:112);
if(!small){row.addSpacer(12);const right=row.addStack();right.layoutVertically();const minute=new Date(now+32400000).getUTCHours()*60+new Date(now+32400000).getUTCMinutes();const upcoming=today.blocks.filter(b=>b.e>minute).slice(0,large?4:2);for(const b of upcoming){text(right,b.name,12);text(right,clockText(b.s)+'–'+clockText(b.e),10,'#91aaa2');right.addSpacer(5)}if(!upcoming.length)text(right,'남은 시간표 없음',11,'#91aaa2');text(right,'할 일 '+today.todos.length+'개',11,'#91aaa2');}
if(large){w.addSpacer(10);for(const e of today.events.slice(0,2)){text(w,(e.allDay?'종일':e.startTime||'')+'  '+e.title,12);w.addSpacer(5)}for(const t of today.todos.slice(0,4)){text(w,'○ '+t.text,12);w.addSpacer(5)}}
if(stale){w.addSpacer(3);text(w,'오프라인 · 저장된 기록',9,'#bd9e79')}}
Script.setWidget(w);if(!config.runsInWidget)await w.presentMedium();Script.complete()}
await main();
