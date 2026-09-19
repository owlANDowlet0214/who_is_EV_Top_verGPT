const palette=['#d8ff43','#8b7cff','#40d7c1','#ff9f68','#5ea8ff','#393a35'];
const data={
  2022:{label:'2022年',total:31592,makers:[['日産',16017],['輸入車（集計）',14348],['トヨタ',618],['ホンダ',371],['SUBARU',180]]},
  2023:{label:'2023年',total:43991,makers:[['輸入車（集計）',22848],['日産',17660],['トヨタ',2546],['SUBARU',632],['ホンダ',286]]},
  2024:{label:'2024年',total:34057,makers:[['輸入車（集計）',24057],['日産',7823],['トヨタ',1789],['SUBARU',229],['ホンダ',147]]},
  2025:{label:'2025年',total:39885,makers:[['輸入車（集計）',30458],['日産',4875],['トヨタ',4203],['SUBARU',330],['ホンダ',10]]},
  2026:{label:'2026年 1〜8月',total:69441,makers:[['輸入車（集計）',28987],['トヨタ',19545],['日産',14087],['ホンダ',3912],['SUBARU',2910]]}
};
const annual=[['2022',31592],['2023',43991],['2024',34057],['2025',39885],['2026',69441]];
const months=[5419,6245,11245,6937,8957,12225,10062,8351];
let selected='2026',metric='units';
const n=new Intl.NumberFormat('ja-JP');
const list=()=>{const d=data[selected], items=d.makers.map(([name,value],i)=>({name,value,color:palette[i],share:value/d.total*100}));const rest=d.total-items.reduce((s,x)=>s+x.value,0);if(rest>0)items.push({name:'その他',value:rest,color:palette.at(-1),share:rest/d.total*100});return items};
function render(){const d=data[selected],items=list(),max=metric==='units'?items[0].value:items[0].share;document.querySelector('#bars').innerHTML=items.map((x,i)=>`<button class="bar"><span class="rank">${String(i+1).padStart(2,'0')}</span><span>${x.name}</span><span class="track"><i style="width:${(metric==='units'?x.value:x.share)/max*100}%;background:${x.color}"></i></span><strong class="value">${metric==='units'?n.format(x.value)+'台':x.share.toFixed(1)+'%'}</strong></button>`).join('');let p=0;const stops=items.map(x=>{const q=p+x.share,s=`${x.color} ${p}% ${q}%`;p=q;return s});document.querySelector('#donut').style.background=`conic-gradient(${stops})`;document.querySelector('#legend').innerHTML=items.map(x=>`<div><i style="background:${x.color}"></i><span>${x.name}</span><b>${x.share.toFixed(1)}%</b></div>`).join('');document.querySelector('#sharePeriod').textContent=d.label;document.querySelector('#insight').innerHTML=`${items[0].name}が<br><b>${items[0].share.toFixed(1)}%</b>で最多。`;}
const select=document.querySelector('#yearSelect');Object.entries(data).forEach(([year,d])=>select.insertAdjacentHTML('beforeend',`<option value="${year}">${d.label}</option>`));select.value=selected;select.addEventListener('change',e=>{selected=e.target.value;render()});document.querySelectorAll('[data-metric]').forEach(b=>b.addEventListener('click',()=>{metric=b.dataset.metric;document.querySelectorAll('[data-metric]').forEach(x=>x.classList.toggle('active',x===b));render()}));
document.querySelector('#trendPoints').innerHTML=annual.map(([year,value],i)=>`<div class="point" style="left:${i/4*100}%;top:${84-value/70000*76}%"><i></i><b>${(value/1000).toFixed(1)}k${year==='2026'?'*':''}</b><span>${year}</span></div>`).join('');const highest=Math.max(...months);document.querySelector('#months').innerHTML=months.map((value,i)=>`<div class="month" style="height:${value/highest*100}%;animation-delay:${i*.06}s"><span>${i+1}月</span></div>`).join('');render();
