(function(){
'use strict';
const rows=document.getElementById('velocityRows');if(!rows)return;
const $=id=>document.getElementById(id);
function datePlus(start,weeks){const d=new Date(start+'T00:00:00');d.setDate(d.getDate()+Math.ceil(weeks*7));return isNaN(d)?'—':d.toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'});}
function renumber(){[...rows.children].forEach((tr,i)=>{tr.children[0].textContent='Sprint '+(i+1);tr.querySelector('input').setAttribute('aria-label','Sprint '+(i+1)+' completed velocity');tr.querySelector('button').setAttribute('aria-label','Remove Sprint '+(i+1));});}
function add(value=40){const tr=document.createElement('tr');tr.innerHTML='<td></td><td><input type="number" min="0" step="0.1"></td><td><button class="calc-delete" type="button">×</button></td>';tr.querySelector('input').value=value;rows.appendChild(tr);renumber();tr.querySelector('input').addEventListener('input',calc);tr.querySelector('button').onclick=()=>{tr.remove();renumber();calc();};calc();}
function calc(){
 const inputs=[...rows.querySelectorAll('input')],vals=inputs.filter(x=>x.value.trim()!=='').map(x=>Number(x.value));
 const backlog=Number($('backlog').value),adjustment=Number($('adjustment').value),sw=Number($('sprintWeeks').value),start=$('startDate').value;
 const invalid=vals.length<2||vals.some(v=>!Number.isFinite(v)||v<0)||!$('backlog').value||!Number.isFinite(backlog)||backlog<0||!$('adjustment').value||!Number.isFinite(adjustment)||adjustment< -100||!Number.isFinite(sw)||sw<=0;
 $('forecastRows').replaceChildren();
 const adj=1+adjustment/100;
 const velocities=invalid?[null,null,null]:[Math.max(...vals)*adj,vals.reduce((a,b)=>a+b,0)/vals.length*adj,Math.min(...vals)*adj];
 const counts=velocities.map(v=>v===null?null:backlog===0?0:v>0?Math.ceil(backlog/v):Infinity);
 ['Optimistic','Likely','Conservative'].forEach((name,i)=>{
  const v=velocities[i],count=counts[i],finite=count!==null&&Number.isFinite(count);
  const sprintText=count===null?'—':finite?String(count):'No finite forecast';
  const date=finite&&start?datePlus(start,count*sw):'—';
  const tr=document.createElement('tr');
  [name,v===null?'—':['Highest historical','Average historical','Lowest historical'][i],v===null?'—':v.toFixed(1),sprintText,finite?(count*sw).toFixed(1)+' weeks':'—',date].forEach(text=>{const td=document.createElement('td');td.textContent=text;tr.appendChild(td);});
  $('forecastRows').appendChild(tr);
  const prefix=['opt','likely','cons'][i];$(prefix+'Sprints').textContent=sprintText;$(prefix+'Date').textContent=date;
 });
 $('range').textContent=!invalid&&Number.isFinite(counts[2])?(counts[0]*sw).toFixed(1)+'–'+(counts[2]*sw).toFixed(1)+' w':!invalid?'Unbounded':'—';
 $('forecastInsight').textContent=invalid?'Enter a non-negative backlog, at least two non-negative completed Sprint velocities, a positive Sprint length, and an adjustment of −100% or greater. Blank history is excluded; zero is included.':'The likely scenario averages '+vals.length+' completed Sprints, including zero-velocity Sprints. '+(counts.includes(Infinity)?'A zero delivery rate cannot produce a finite completion forecast. ':'')+'These scenarios are estimates, not confidence intervals or commitments.';
}
['backlog','sprintWeeks','adjustment','startDate'].forEach(id=>$(id).addEventListener('input',calc));$('addVelocity').onclick=()=>add();
const today=new Date();$('startDate').value=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
$('forecastInsight').setAttribute('role','status');add(38);add(42);add(40);
})();
