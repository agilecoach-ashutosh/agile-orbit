(function(){
  'use strict';

  const NAVY='FF071019', NAVY2='FF0B1520', CYAN='FF61D9FF', VIOLET='FF8B7CFF', GREEN='FF61E6A7', AMBER='FFFFC56B', RED='FFFF7F8C', WHITE='FFFFFFFF', TEXT='FF0C1A27', MUTED='FF526575', LIGHT='FFF5F8FB', MID='FFD7E3EC';
  const depTypes=['Competency / Skill','Architecture / System','Process / Workflow','Decision / Approval','Rights / Authorization','External Team','Vendor / Third Party','Environment / Tooling / Data'];
  const responses=['Control','Influence','Escalate','Accept / Manage'];

  function fill(argb){return {type:'pattern',pattern:'solid',fgColor:{argb}}}
  function border(color=MID){return {bottom:{style:'thin',color:{argb:color}}}}
  function downloadBlob(buffer,name){
    const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function mergeTitle(ws,range,text,size=18,color=NAVY){
    ws.mergeCells(range);const c=ws.getCell(range.split(':')[0]);c.value=text;c.fill=fill(color);c.font={bold:true,color:{argb:WHITE},size};c.alignment={vertical:'middle'};
  }
  function headerRow(row,fillColor=NAVY,fontColor=WHITE){
    row.eachCell(c=>{c.fill=fill(fillColor);c.font={bold:true,color:{argb:fontColor},size:9};c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.border=border(CYAN)});row.height=34;
  }

  async function buildWorkbook(){
    if(!window.ExcelJS) throw new Error('Excel library did not load');
    const wb=new ExcelJS.Workbook();
    wb.creator='Agile Orbit';wb.title='Dependency & Constraint Coaching Canvas';wb.subject='Agile coaching dependency and constraint workshop canvas';wb.created=new Date();

    // 1) Dependency Canvas
    const ws=wb.addWorksheet('Dependency Canvas',{properties:{tabColor:{argb:CYAN}},views:[{state:'frozen',xSplit:2,ySplit:12}]});
    ws.columns=[
      {key:'id',width:5},{key:'dep',width:27},{key:'type',width:23},{key:'who',width:23},{key:'why',width:28},{key:'freq',width:11},{key:'impact',width:11},{key:'wait',width:11},{key:'exposure',width:12},{key:'control',width:12},{key:'response',width:17},{key:'evidence',width:25},{key:'waiting',width:29},{key:'action',width:31},{key:'owner',width:16},{key:'review',width:15},{key:'status',width:15}
    ];
    ws.mergeCells('A1:Q2');Object.assign(ws.getCell('A1'),{value:'DEPENDENCY & CONSTRAINT COACHING CANVAS',fill:fill(NAVY),font:{bold:true,color:{argb:WHITE},size:20},alignment:{vertical:'middle'}});
    ws.mergeCells('A3:Q3');Object.assign(ws.getCell('A3'),{value:'Surface hidden waiting, hand-offs and constraints. Decide what the team can Control, Influence, Escalate or consciously Accept / Manage.',fill:fill(NAVY2),font:{italic:true,color:{argb:'FFDCE8F2'},size:10},alignment:{vertical:'middle'}});
    [['A5:D5','Team / Value Stream'],['E5:H5','Session Date'],['I5:L5','Facilitator'],['M5:Q5','Review Horizon']].forEach(([r,t])=>{ws.mergeCells(r);const c=ws.getCell(r.split(':')[0]);c.value=t;c.fill=fill('FFDDEFF6');c.font={bold:true,color:{argb:NAVY}}});
    ['A6:D6','E6:H6','I6:L6','M6:Q6'].forEach(r=>{ws.mergeCells(r);const c=ws.getCell(r.split(':')[0]);c.fill=fill(WHITE);c.border=border()});
    const kpis=[['A8:D8','A9:D9','Dependencies Logged','=COUNTIF(B13:B32,"<>")',CYAN],['E8:H8','E9:H9','High Exposure (≥50)','=COUNTIF(I13:I32,">=50")',RED],['I8:L8','I9:L9','Needs Escalation','=COUNTIF(K13:K32,"Escalate")',AMBER],['M8:P8','M9:P9','Actions Done','=COUNTIF(Q13:Q32,"Done")',GREEN]];
    kpis.forEach(([lr,vr,label,formula,col])=>{ws.mergeCells(lr);ws.mergeCells(vr);let l=ws.getCell(lr.split(':')[0]),v=ws.getCell(vr.split(':')[0]);l.value=label;l.fill=fill(col);l.font={bold:true,color:{argb:col===RED?WHITE:NAVY},size:9};l.alignment={horizontal:'center'};v.value={formula};v.fill=fill(LIGHT);v.font={bold:true,color:{argb:NAVY},size:18};v.alignment={horizontal:'center'};});
    ws.mergeCells('A11:Q11');Object.assign(ws.getCell('A11'),{value:'Score Frequency, Impact and Wait from 1–5. Exposure = Frequency × Impact × Wait. Use the score to prioritise discussion—not as a performance metric.',fill:fill('FFFFF7E5'),font:{italic:true,color:{argb:'FF6F4A00'},size:9}});
    const hdr=['ID','Dependency / Constraint','Dependency Type','Who / What We Depend On','Why It Exists','Frequency\n1–5','Impact\n1–5','Wait\n1–5','Exposure','Control','Response','Evidence / Data','What Happens While We Wait','Experiment / Action','Owner','Review Date','Status'];
    ws.getRow(12).values=hdr;headerRow(ws.getRow(12));
    for(let r=13;r<=32;r++){
      ws.getCell(`A${r}`).value=r-12;ws.getCell(`I${r}`).value={formula:`IF(COUNTA(B${r}:H${r})=0,"",F${r}*G${r}*H${r})`};
      ws.getRow(r).height=38;
      for(let c=1;c<=17;c++){const cell=ws.getCell(r,c);cell.fill=fill(r%2===0?'FFF8FBFD':WHITE);cell.font={color:{argb:TEXT},size:9};cell.alignment={vertical:'top',wrapText:true};cell.border=border('FFE6EEF4')}
      ws.getCell(`I${r}`).fill=fill('FFECFDF5');
      ws.getCell(`C${r}`).dataValidation={type:'list',allowBlank:true,formulae:[`"${depTypes.join(',')}"`]};
      ['F','G','H'].forEach(col=>ws.getCell(`${col}${r}`).dataValidation={type:'list',allowBlank:true,formulae:['"1,2,3,4,5"']});
      ws.getCell(`J${r}`).dataValidation={type:'list',allowBlank:true,formulae:['"High,Medium,Low"']};
      ws.getCell(`K${r}`).dataValidation={type:'list',allowBlank:true,formulae:[`"${responses.join(',')}"`]};
      ws.getCell(`Q${r}`).dataValidation={type:'list',allowBlank:true,formulae:['"Not Started,In Progress,Done,Blocked"']};
      ws.getCell(`P${r}`).numFmt='dd-mmm-yyyy';
    }
    ws.autoFilter={from:'A12',to:'Q32'};

    // 2) Coaching Questions
    const q=wb.addWorksheet('Coaching Questions',{properties:{tabColor:{argb:VIOLET}},views:[{state:'frozen',ySplit:5}]});
    q.columns=[{width:24},{width:58},{width:38}];mergeTitle(q,'A1:C2','POWERFUL COACHING QUESTIONS');
    q.mergeCells('A3:C3');Object.assign(q.getCell('A3'),{value:'Use inquiry before jumping to solutions. Select questions that help the team see waiting, coupling, pressure and options.',fill:fill(NAVY2),font:{italic:true,color:{argb:'FFDCE8F2'},size:10}});
    q.getRow(5).values=['Theme','Question','Useful when...'];headerRow(q.getRow(5),CYAN,NAVY);
    const questionData=[
      ['Surface the hidden system','Where does work spend more time waiting than being worked on?','The team reports being busy but delivery remains slow.'],['Surface the hidden system','What does the team regularly say “we are waiting for”?','Recurring blockers are being normalised.'],['Surface the hidden system','Who do we repeatedly need before we can finish?','You want to surface external-team or role dependencies.'],['Surface the hidden system','Which work looks “in progress” but is actually blocked?','Status masks waiting.'],['Surface the hidden system','What dependency has become so normal that nobody questions it anymore?','A constraint has become part of the culture.'],['Surface the hidden system','Where does work leave the team and later come back?','There are hand-offs, queues or rework.'],
      ['Understand the impact','What happens to other work while this item waits?','Waiting creates side effects.'],['Understand the impact','Does waiting cause us to start more work?','WIP and context switching are increasing.'],['Understand the impact','How much WIP exists because something else is blocked?','The board is crowded with partially done work.'],['Understand the impact','Which dependency creates the most context switching?','People keep switching to stay “busy”.'],['Understand the impact','Which delays affect customers rather than only internal milestones?','Connect constraints to value.'],['Understand the impact','What percentage of our cycle time is actually waiting?','The team needs evidence about flow.'],
      ['Challenge the system','Why does this dependency exist?','The team is ready to inspect root causes.'],['Challenge the system','What would need to be true for us not to need it?','You want possibility thinking without prescribing a solution.'],['Challenge the system','Is this a real dependency or an organisational habit?','A process may exist only because it always has.'],['Challenge the system','Are we dependent on a capability, a person, a permission or a decision?','The word “dependency” is too vague.'],['Challenge the system','Could capability move instead of work moving?','Specialist or central-team bottlenecks dominate.'],['Challenge the system','What would happen if the team owned this capability themselves?','Exploring team autonomy.'],
      ['Move toward action','Which dependency could we reduce without waiting for a reorganisation?','The team needs a realistic next step.'],['Move toward action','What experiment would give us evidence within two Sprints?','The group is stuck in large solution proposals.'],['Move toward action','Who needs to be part of the conversation that is currently missing?','The dependency crosses boundaries.'],['Move toward action','What can we make explicit before work starts?','Surprise dependencies appear late.'],['Move toward action','What should we stop starting when this dependency blocks us?','Blocked work is causing more WIP.'],['Move toward action','How will we know the situation has improved?','Actions lack a measurable outcome.'],
      ['Expose pressure & heroics','Why does the team always feel under pressure?','Constant urgency is becoming normal.'],['Expose pressure & heroics','Is the team actually overloaded—or is work accumulating because it cannot flow?','Utilisation and flow are being confused.'],['Expose pressure & heroics','How many things are currently waiting on somebody else?','Hidden queues may dominate.'],['Expose pressure & heroics','What work did we start because another item became blocked?','Context switching is a symptom.'],['Expose pressure & heroics','How much urgent work is caused by previously unresolved dependencies?','Recurring firefighting needs system context.'],['Expose pressure & heroics','Where are people compensating manually for a broken system?','Heroics are masking structural problems.'],['Expose pressure & heroics','What recurring organisational problem is currently being absorbed by individual heroics?','Leadership needs visibility into systemic pressure.']
    ];
    const themeColors={'Surface the hidden system':'FFE0F2FE','Understand the impact':'FFEDE9FE','Challenge the system':'FFFEF3C7','Move toward action':'FFDCFCE7','Expose pressure & heroics':'FFFEE2E2'};
    questionData.forEach((d,i)=>{const r=i+6;q.getRow(r).values=d;q.getRow(r).height=34;q.getRow(r).eachCell(c=>{c.font={color:{argb:TEXT},size:10};c.alignment={vertical:'top',wrapText:true};c.border=border()});q.getCell(`A${r}`).fill=fill(themeColors[d[0]]);q.getCell(`A${r}`).font={bold:true,color:{argb:NAVY}}});

    // 3) Session Guide
    const g=wb.addWorksheet('Session Guide',{properties:{tabColor:{argb:GREEN}},views:[{state:'frozen',ySplit:5}]});
    g.columns=[{width:20},{width:14},{width:27},{width:42},{width:30}];mergeTitle(g,'A1:E2','60–90 MINUTE DEPENDENCY COACHING SESSION');
    g.mergeCells('A3:E3');Object.assign(g.getCell('A3'),{value:'Turn frustration into evidence, choices and small experiments—without turning the session into a blame exercise.',fill:fill(NAVY2),font:{italic:true,color:{argb:'FFDCE8F2'},size:10}});
    g.getRow(5).values=['Step','Time','Purpose','Facilitator guidance','Output'];headerRow(g.getRow(5),VIOLET,WHITE);
    const agenda=[['1. Frame','5 min','Set the purpose','We are not here to blame another team. We are here to understand what constrains our ability to deliver value.','Shared purpose and psychological safety'],['2. Surface','15 min','Generate dependencies','Silent brainstorm first. Include decisions, permissions, process, environments and data—not only technical dependencies.','Visible dependency list'],['3. Evidence','15 min','Explore impact','Add frequency, wait time, affected work and consequences such as WIP, context switching, rework or missed outcomes.','Evidence instead of anecdotes'],['4. Classify','15 min','Choose the response','Place each significant dependency under Control, Influence, Escalate or Accept / Manage.','Intentional response'],['5. Prioritise','10 min','Find the few that matter','Use Exposure = Frequency × Impact × Wait or dot voting. Do not leave with twenty equal problems.','Top 1–3 constraints'],['6. Act','10–20 min','Design experiments','Agree an action, owner, evidence to watch and review date. Keep the action small enough to learn quickly.','Experiments and ownership']];
    agenda.forEach((d,i)=>{const r=i+6;g.getRow(r).values=d;g.getRow(r).height=42;g.getRow(r).eachCell(c=>{c.font={color:{argb:TEXT},size:10};c.alignment={vertical:'top',wrapText:true};c.border=border()});g.getCell(`A${r}`).fill=fill('FFEEF4F8');g.getCell(`A${r}`).font={bold:true,color:{argb:NAVY}};g.getCell(`B${r}`).font={bold:true,color:{argb:VIOLET}}});
    g.mergeCells('A14:E14');Object.assign(g.getCell('A14'),{value:'CHOOSING THE RESPONSE',fill:fill(NAVY),font:{bold:true,color:{argb:WHITE},size:12}});g.getRow(15).values=['Response','Use when','Key coaching question','Typical action','Leadership attention?'];headerRow(g.getRow(15),CYAN,NAVY);
    const resp=[['Control','The team has authority or capability to reduce the constraint directly.','What can we learn, own or change ourselves?','Cross-skill, automate, simplify process, change working agreement','Usually no'],['Influence','The dependency is real but coordination can improve.','Can we improve the interface, expectation or timing?','Joint refinement, service expectations, earlier engagement','Sometimes'],['Escalate','The problem is bigger than the team’s authority.','What evidence shows the system cost, and who can change it?','Escalate policy, decision rights, structure or shared bottleneck','Yes'],['Accept / Manage','The constraint protects a legitimate risk or cannot yet be removed.','How can we make it predictable and reduce its impact?','Plan earlier, set lead times, create triggers, reduce surprise','Maybe']];
    const respCols=[GREEN,'FFBDE3FF',AMBER,'FFDCCBFF'];resp.forEach((d,i)=>{const r=i+16;g.getRow(r).values=d;g.getRow(r).height=42;g.getRow(r).eachCell(c=>{c.font={color:{argb:TEXT},size:10};c.alignment={vertical:'top',wrapText:true};c.border=border()});g.getCell(`A${r}`).fill=fill(respCols[i]);g.getCell(`A${r}`).font={bold:true,color:{argb:NAVY}}});

    // 4) Scoring Guide
    const s=wb.addWorksheet('Scoring Guide',{properties:{tabColor:{argb:AMBER}},views:[{state:'frozen',ySplit:5}]});
    s.columns=[{width:26},{width:16},{width:16},{width:18},{width:14},{width:18},{width:22}];mergeTitle(s,'A1:G2','DEPENDENCY EXPOSURE SCORING GUIDE');
    s.mergeCells('A3:G3');Object.assign(s.getCell('A3'),{value:'Exposure = Frequency × Impact × Wait. Use it to prioritise discussion—not to rank teams or people.',fill:fill(NAVY2),font:{italic:true,color:{argb:'FFDCE8F2'},size:10}});
    s.getRow(5).values=['Score','Frequency','Impact','Wait'];headerRow(s.getRow(5),CYAN,NAVY);
    const scale=[[1,'Rare / exceptional','Minor inconvenience','Hours / same day'],[2,'Occasional','Some delay; workaround available','1–2 days'],[3,'Frequent','Meaningful delay / context switching','Several days'],[4,'Very frequent','Major delivery impact / repeated blocking','About a week'],[5,'Constant / every cycle','Stops value delivery / serious risk','Multiple weeks']];
    scale.forEach((d,i)=>{const r=i+6;s.getRow(r).values=d;s.getRow(r).height=30;s.getRow(r).eachCell(c=>{c.font={color:{argb:TEXT},size:10};c.alignment={vertical:'top',wrapText:true};c.border=border()});});
    s.mergeCells('A13:G13');Object.assign(s.getCell('A13'),{value:'WORKED EXAMPLES',fill:fill(NAVY),font:{bold:true,color:{argb:WHITE},size:12}});s.getRow(14).values=['Dependency','Frequency','Impact','Wait','Exposure','Control','Likely Response'];headerRow(s.getRow(14),VIOLET,WHITE);
    const ex=[['Architecture approval',4,5,4,'Low','Escalate'],['Regulatory sign-off',2,5,5,'Low','Accept / Manage'],['Test-data creation',5,3,3,'Medium','Influence'],['Specialist knowledge',3,4,2,'High','Control']];
    ex.forEach((d,i)=>{const r=i+15;s.getRow(r).values=[d[0],d[1],d[2],d[3],{formula:`B${r}*C${r}*D${r}`},d[4],d[5]];s.getRow(r).eachCell(c=>{c.font={color:{argb:TEXT},size:10};c.alignment={vertical:'top',wrapText:true};c.border=border()});s.getCell(`E${r}`).fill=fill(d[1]*d[2]*d[3]>=50?'FFFEE2E2':'FFFFF7E5')});

    return wb;
  }

  async function handleDownload(btn){
    const old=btn.textContent;btn.disabled=true;btn.textContent='Building Excel…';
    try{const wb=await buildWorkbook();const buffer=await wb.xlsx.writeBuffer();downloadBlob(buffer,'Dependency_Constraint_Coaching_Canvas.xlsx');btn.textContent='Downloaded ✓';}
    catch(err){console.error(err);btn.textContent='Excel download unavailable';}
    setTimeout(()=>{btn.disabled=false;btn.textContent=old},2200);
  }

  document.addEventListener('click',e=>{const btn=e.target.closest('#downloadDependencyCanvas');if(btn)handleDownload(btn)});
})();