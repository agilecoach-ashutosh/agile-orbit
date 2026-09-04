(function(){
  document.addEventListener('DOMContentLoaded',function(){
    const root=document.querySelector('.orbit-experience');
    if(!root||typeof gsap==='undefined'||typeof ScrollTrigger==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const viewport=root.querySelector('.orbit-viewport');
    const art=root.querySelector('.orbit-art');
    const story=root.querySelector('.orbit-story');
    const beats=gsap.utils.toArray('.orbit-beat',root);
    const cards=gsap.utils.toArray('.beat-card',root);
    const points=gsap.utils.toArray('.orbit-point',root);
    const counter=root.querySelector('.orbit-counter');
    const sceneLabel=root.querySelector('.orbit-scene-label');
    const kicker=root.querySelector('.orbit-story .orbit-kicker');
    const title=root.querySelector('.orbit-story h1');
    const lead=root.querySelector('.orbit-story-lead');
    const cta=root.querySelector('.orbit-cta');
    const chips=root.querySelector('.orbit-chip-row');
    const rings=root.querySelector('.orbit-rings');
    if(!viewport||!art) return;

    const scenes=[
      {n:'01',label:'WELCOME TO THE ORBIT',eyebrow:'YOUR UNIVERSE OF AGILE KNOWLEDGE',title:['Explore the','Agile Universe.'],lead:'Learn Agile. Think Better. Lead Differently. A practical universe of frameworks, tools, practice, coaching and ideas.',cta:'Begin the Journey',href:'learn/',chips:['Scrum','Kanban','SAFe','Lean'],orbit:'START HERE'},
      {n:'02',label:'KNOWLEDGE',eyebrow:'01 · LEARN',title:['Build a','Stronger Foundation.'],lead:'Dive into frameworks, principles, product thinking, Lean, Scrum, Kanban, coaching and leadership.',cta:'Start Learning',href:'learn/',chips:['Frameworks','Principles','Product','Leadership'],orbit:'BUILD YOUR FOUNDATION'},
      {n:'03',label:'PRACTICE',eyebrow:'02 · PRACTICE',title:['Turn Knowledge','into Action.'],lead:'Test your judgement with practice questions, real scenarios and hands-on exercises.',cta:'Start Practicing',href:'practice/',chips:['548+ Questions','Exam Mode','Scenarios','Feedback'],orbit:'PRACTICE BUILDS CONFIDENCE'},
      {n:'04',label:'UTILITY',eyebrow:'03 · USE',title:['Tools for','Everyday Agility.'],lead:'Ready-to-use calculators, templates, JQL recipes, prompts and facilitation tools for real delivery problems.',cta:'Explore Tools',href:'tools/',chips:['Calculators','Templates','JQL','AI Prompts'],orbit:'PRACTICAL TOOLS · REAL RESULTS'},
      {n:'05',label:'GROWTH',eyebrow:'04 · BEYOND TOOLING',title:['Grow. Lead.','Inspire.'],lead:'Coaching insights, books, behavioural psychology and leadership ideas to create lasting impact.',cta:'Explore Resources',href:'resources/',chips:['Coaching','Psychology','Books','Insights'],orbit:'A MORE HUMAN AGILE WORLD'},
      {n:'06',label:'ARRIVAL',eyebrow:'READY TO EXPLORE?',title:['Your Agile Journey','Starts Here.'],lead:'Choose your next orbit. Learn something useful, challenge your thinking, practice a skill, then take it back to your team.',cta:'Explore the Orbit',href:'tools/',chips:['Learn','Think','Practice','Use'],orbit:'SAME UNIVERSE · NEW POSSIBILITIES'}
    ];

    const setText=(s)=>{
      kicker.textContent=s.eyebrow;
      title.innerHTML='<span class="white">'+s.title[0]+'</span><span class="cyan">'+s.title[1]+'</span>';
      lead.textContent=s.lead;
      cta.textContent=s.cta+'  →';
      cta.href=s.href;
      chips.innerHTML=s.chips.map(x=>'<span class="orbit-chip">'+x+'</span>').join('');
      if(counter) counter.textContent=s.n+' / 06';
      if(sceneLabel) sceneLabel.textContent=s.orbit;
      points.forEach((p,i)=>p.classList.toggle('active',i===Number(s.n)-1));
    };

    const beatIndices=[1,2,3,4];
    gsap.set(beats,{autoAlpha:0,y:38});
    gsap.set(cards,{autoAlpha:0,y:18,scale:.96});
    setText(scenes[0]);

    const master=gsap.timeline({
      scrollTrigger:{trigger:root,start:'top top',end:'bottom bottom',scrub:1.1,invalidateOnRefresh:true,
        onUpdate:self=>{
          const p=self.progress;
          const scene=Math.min(5,Math.floor(p*6));
          const local=(p*6)-scene;
          if(Number.isFinite(scene)){
            const data=scenes[scene];
            if(data.n!==counter.textContent.slice(0,2).trim()) setText(data);
          }
          if(scene===0){
            story.style.opacity=String(1-Math.min(1,local*1.4));
          }else{story.style.opacity='0'}
        }
      }
    });

    // Continuous camera-like movement through the same universe artwork.
    master.to(art,{scale:1.16,xPercent:-1.5,yPercent:-1,duration:.9,ease:'none'},0)
      .to(art,{scale:1.25,xPercent:2,yPercent:-2.3,duration:1,ease:'none'},1)
      .to(art,{scale:1.34,xPercent:-2.5,yPercent:.6,duration:1,ease:'none'},2)
      .to(art,{scale:1.45,xPercent:2.4,yPercent:1.2,duration:1,ease:'none'},3)
      .to(art,{scale:1.56,xPercent:-2.2,yPercent:-1.5,duration:1,ease:'none'},4)
      .to(art,{scale:1.62,xPercent:.8,yPercent:-.5,duration:1,ease:'none'},5)
      .to(rings,{rotation:16,scale:1.15,duration:6,ease:'none'},0);

    // Scene 01 exits as the content beats take over.
    master.to(story,{yPercent:-12,filter:'blur(3px)',duration:.55},.72);

    beatIndices.forEach((sceneNumber,idx)=>{
      const start=sceneNumber-.18;
      const end=sceneNumber+.66;
      const beat=beats[idx];
      const beatCards=cards.slice(idx*4,idx*4+4);
      master.fromTo(beat,{autoAlpha:0,y:48,filter:'blur(7px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.26,ease:'power2.out'},start)
        .to(beat,{autoAlpha:0,y:-36,filter:'blur(5px)',duration:.18,ease:'power2.in'},end);
      beatCards.forEach((card,j)=>{
        master.fromTo(card,{autoAlpha:0,y:24,scale:.94},{autoAlpha:1,y:0,scale:1,duration:.18,ease:'power2.out'},start+.06+j*.045)
          .to(card,{autoAlpha:0,y:-14,scale:1.02,duration:.12,ease:'power2.in'},end-.04+j*.012);
      });
    });

    // Final scene fades back to an intentional landing state, never a black gap.
    master.fromTo(root.querySelector('.final-scene'),{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:.22,ease:'power2.out'},4.9);

    // Small pointer parallax makes the scene feel responsive without WebGL.
    const mm=gsap.matchMedia();
    mm.add('(min-width:961px)',()=>{
      const move=(e)=>{
        const x=(e.clientX/window.innerWidth-.5)*2;
        const y=(e.clientY/window.innerHeight-.5)*2;
        gsap.to(art,{x:x*10,y:y*7,duration:1.5,ease:'power2.out',overwrite:'auto'});
        gsap.to(rings,{x:x*5,y:y*3,duration:1.8,ease:'power2.out',overwrite:'auto'});
      };
      window.addEventListener('pointermove',move,{passive:true});
      return()=>window.removeEventListener('pointermove',move);
    });

    // Accessible keyboard focus should not be trapped by the cinematic layer.
    ScrollTrigger.refresh();
  });
})();
