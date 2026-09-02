/* Agile Orbit — lightweight Three.js 3D universe hero */
(function(){
  'use strict';
  const wrap=document.querySelector('.u-3d-wrap');
  const canvas=document.getElementById('universe3d');
  if(!wrap||!canvas) return;

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch=window.matchMedia('(pointer:coarse)').matches;
  let THREE=null;

  let renderer,scene,camera,starField,core,halo,raf;
  let clock,raycaster,pointer;
  const planets=[];
  const labels=[];
  const orbitGroups=[];
  let hovered=null;
  let mouseX=0,mouseY=0,targetX=0,targetY=0;

  const nodes=[
    {key:'learn',name:'LEARN',sub:'Build knowledge',href:'learn/',color:0xa66cff,radius:4.0,speed:.16,tilt:.08,size:.55,phase:.2},
    {key:'tools',name:'TOOLS',sub:'Work smarter',href:'tools/',color:0x48c9ff,radius:5.25,speed:.105,tilt:-.12,size:.66,phase:2.1},
    {key:'practice',name:'PRACTICE',sub:'Sharpen skills',href:'practice/',color:0x61e878,radius:6.55,speed:.073,tilt:.15,size:.73,phase:3.7},
    {key:'insights',name:'INSIGHTS',sub:'See clearly',href:'insights/',color:0xffbd57,radius:5.15,speed:.092,tilt:.24,size:.59,phase:5.2},
    {key:'coaching',name:'COACHING',sub:'Grow people',href:'coaching/',color:0xff6bbd,radius:4.7,speed:.12,tilt:-.2,size:.62,phase:4.35},
    {key:'think',name:'THINK',sub:'Expand mindset',href:'insights/',color:0xff715c52,radius:6.0,speed:.081,tilt:-.05,size:.62,phase:1.25}
  ];

  function makeGlowTexture(){
    const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
    const g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba(255,245,190,.85)');g.addColorStop(.42,'rgba(255,180,60,.25)');g.addColorStop(1,'rgba(255,120,20,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);
  }
  function makePlanetTexture(hex){
    const c=document.createElement('canvas');c.width=256;c.height=128;const ctx=c.getContext('2d');
    const base=new THREE.Color(hex);const r=base.r*255,g=base.g*255,b=base.b*255;
    const grd=ctx.createLinearGradient(0,0,256,128);grd.addColorStop(0,`rgb(${r*.32|0},${g*.32|0},${b*.32|0})`);grd.addColorStop(.5,`rgb(${r|0},${g|0},${b|0})`);grd.addColorStop(1,`rgb(${r*.46|0},${g*.46|0},${b*.46|0})`);ctx.fillStyle=grd;ctx.fillRect(0,0,256,128);
    for(let i=0;i<55;i++){ctx.globalAlpha=.05+Math.random()*.1;ctx.fillStyle=Math.random()>.5?'#fff':'#000';ctx.beginPath();ctx.ellipse(Math.random()*256,Math.random()*128,5+Math.random()*30,2+Math.random()*9,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;return new THREE.CanvasTexture(c);
  }
  function ellipseLine(radius,tilt,color,opacity){
    const pts=[];for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*radius,Math.sin(a)*radius*.48,0));}
    const geo=new THREE.BufferGeometry().setFromPoints(pts);const mat=new THREE.LineBasicMaterial({color,transparent:true,opacity});const line=new THREE.LineLoop(geo,mat);line.rotation.z=tilt;return line;
  }

  function init(){
    clock=new THREE.Clock();
    raycaster=new THREE.Raycaster();
    pointer=new THREE.Vector2(9,9);
    try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch(e){throw e;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));renderer.setSize(wrap.clientWidth,wrap.clientHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
    scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x03050b,.012);
    camera=new THREE.PerspectiveCamera(44,wrap.clientWidth/wrap.clientHeight,.1,100);camera.position.set(0,1.1,17);

    const ambient=new THREE.AmbientLight(0x9db9ff,.72);scene.add(ambient);
    const key=new THREE.PointLight(0xffd27d,30,22,2);key.position.set(0,0,0);scene.add(key);
    const fill=new THREE.PointLight(0x5b8cff,8,30,2);fill.position.set(-8,5,6);scene.add(fill);

    const starGeo=new THREE.BufferGeometry();const starCount=isTouch?650:1200;const pos=new Float32Array(starCount*3);const sizes=new Float32Array(starCount);
    for(let i=0;i<starCount;i++){const r=25+Math.random()*35;const a=Math.random()*Math.PI*2;const z=(Math.random()-.5)*30;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r*.62;pos[i*3+2]=z;sizes[i]=Math.random()*1.8+.4;}
    starGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));starGeo.setAttribute('size',new THREE.BufferAttribute(sizes,1));
    const starMat=new THREE.PointsMaterial({color:0xdbeaff,size:.06,sizeAttenuation:true,transparent:true,opacity:.8});starField=new THREE.Points(starGeo,starMat);scene.add(starField);

    // central sun
    const sunGeo=new THREE.SphereGeometry(1.28,40,40);const sunMat=new THREE.MeshBasicMaterial({color:0xffd36f});core=new THREE.Mesh(sunGeo,sunMat);scene.add(core);
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:makeGlowTexture(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.85}));glow.scale.set(5.2,5.2,1);scene.add(glow);halo=glow;

    // orbital planes
    [2.25,3.35,4.35,5.15,6.15,7.05].forEach((r,i)=>{const line=ellipseLine(r,(i%2-.5)*.08,i%2?0x6b86ff:0x8e5dff,.12+(i===5?.05:0));scene.add(line);});

    nodes.forEach((d,i)=>{
      const group=new THREE.Object3D();group.rotation.x=d.tilt;group.rotation.z=(i%2-.5)*.12;group.userData.basePhase=d.phase;scene.add(group);orbitGroups.push(group);
      const geo=new THREE.SphereGeometry(d.size,24,24);const mat=new THREE.MeshStandardMaterial({map:makePlanetTexture(d.color),roughness:.72,metalness:.05,emissive:d.color,emissiveIntensity:.08});const p=new THREE.Mesh(geo,mat);p.position.set(d.radius,0,0);p.userData={node:d,index:i,baseScale:1};group.add(p);
      // tiny atmosphere shell
      const shell=new THREE.Mesh(new THREE.SphereGeometry(d.size*1.08,20,20),new THREE.MeshBasicMaterial({color:d.color,transparent:true,opacity:.07,side:THREE.BackSide,blending:THREE.AdditiveBlending}));p.add(shell);
      // tiny moon for depth on selected worlds
      if(i===0||i===2){const moon=new THREE.Mesh(new THREE.SphereGeometry(.12,12,12),new THREE.MeshStandardMaterial({color:0xbcc8dd,roughness:1}));moon.position.set(d.size*1.45,.25,0);p.add(moon);}
      planets.push(p);
      const el=document.createElement('a');el.className='u-3d-label '+d.key;el.href=d.href;el.innerHTML='<strong>'+d.name+'</strong><span>'+d.sub+'</span>';el.setAttribute('aria-label',d.name+' — '+d.sub);wrap.querySelector('.u-3d-labels').appendChild(el);labels.push(el);
    });

    canvas.addEventListener('pointermove',onPointerMove,{passive:true});canvas.addEventListener('pointerleave',()=>{hovered=null;pointer.set(9,9);});canvas.addEventListener('pointerdown',onPointerDown);
    window.addEventListener('resize',onResize);requestAnimationFrame(loop);
    setTimeout(()=>labels.forEach(l=>l.classList.add('is-visible')),300);
  }

  function onPointerMove(e){const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;targetX=((e.clientX-r.left)/r.width-.5)*1.8;targetY=((e.clientY-r.top)/r.height-.5)*-1.1;}
  function onPointerDown(e){if(e.pointerType==='touch')return;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(planets,false);if(hits.length&&hits[0].object.userData.node){window.location.href=hits[0].object.userData.node.href;}}
  function onResize(){if(!renderer)return;renderer.setSize(wrap.clientWidth,wrap.clientHeight,false);camera.aspect=wrap.clientWidth/wrap.clientHeight;camera.updateProjectionMatrix();}

  function updateLabels(){const w=wrap.clientWidth,h=wrap.clientHeight;planets.forEach((p,i)=>{const v=p.getWorldPosition(new THREE.Vector3()).project(camera);const x=(v.x*.5+.5)*w;const y=(-v.y*.5+.5)*h;const label=labels[i];label.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;const behind=v.z>1;label.style.opacity=behind?'0':'1';});}
  function loop(){raf=requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);const t=clock.elapsedTime;
    raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(planets,false);const next=hits.length?hits[0].object:null;
    if(next!==hovered){if(hovered){const idx=hovered.userData.index;labels[idx].classList.remove('is-hovered');}hovered=next;if(hovered){labels[hovered.userData.index].classList.add('is-hovered');}}
    const motion=reduceMotion?0:1;
    orbitGroups.forEach((g,i)=>{const d=nodes[i];if(!(hovered&&hovered.userData.index===i))g.rotation.y+=dt*d.speed*motion;g.rotation.x=d.tilt+Math.sin(t*.16+i)*.008;});
    if(core){core.rotation.y+=dt*.08*motion;core.scale.setScalar(1+Math.sin(t*1.7)*.025);halo.scale.setScalar(5.2+Math.sin(t*1.3)*.28);}
    if(starField)starField.rotation.y+=dt*.002*motion;
    if(!reduceMotion){mouseX+=(targetX-mouseX)*.025;mouseY+=(targetY-mouseY)*.025;camera.position.x=mouseX;camera.position.y=1.1+mouseY*.45;camera.lookAt(0,0,0);}
    else camera.lookAt(0,0,0);
    planets.forEach((p,i)=>{const s=(hovered===p?1.13:1);p.scale.lerp(new THREE.Vector3(s,s,s),.12);});
    updateLabels();renderer.render(scene,camera);
  }

  async function start(){
    try{
      const mod=await import('https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js');
      THREE=mod;
      init();
    }catch(error){
      console.warn('[Agile Orbit] 3D universe unavailable; using fallback.',error);
      showFallback();
    }
  }

  function showFallback(){
    wrap.classList.add('webgl-failed');
    const labelsHost=wrap.querySelector('.u-3d-labels');
    if(labelsHost) labelsHost.innerHTML='';
    const fallback=document.createElement('div');
    fallback.className='u-3d-fallback-scene';
    fallback.setAttribute('aria-label','Agile Orbit navigation fallback');
    fallback.innerHTML='<div class="fallback-sun"><span>AGILE</span><small>ORBIT</small></div>'+nodes.map((d,i)=>`<a class="fallback-planet p${i}" href="${d.href}" style="--planet:#${d.color.toString(16).padStart(6,'0')};--i:${i}"><i></i><span><b>${d.name}</b><small>${d.sub}</small></span></a>`).join('');
    wrap.appendChild(fallback);
  }

  start();
})();
