/* Agile Orbit — dependency-free WebGL 3D hero.
   No CDN, no build step, GitHub Pages safe. */
(function(){
  'use strict';
  const wrap=document.querySelector('.u-3d-wrap');
  const canvas=document.getElementById('universe3d');
  if(!wrap||!canvas) return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer: coarse)').matches;
  const nodes=[
    {key:'learn',name:'LEARN',sub:'Build Knowledge',href:'learn/',r:3.35,size:.62,speed:.16,phase:.15,tilt:.14,color:[.62,.25,.98]},
    {key:'tools',name:'TOOLS',sub:'Work Smarter',href:'tools/',r:4.85,size:.72,speed:.105,phase:1.75,tilt:-.08,color:[.08,.62,1]},
    {key:'practice',name:'PRACTICE',sub:'Sharpen Skills',href:'practice/',r:5.9,size:.68,speed:.075,phase:3.65,tilt:.12,color:[.26,.9,.28]},
    {key:'insights',name:'INSIGHTS',sub:'See Clearly',href:'insights/',r:4.7,size:.72,speed:.09,phase:5.15,tilt:.22,color:[1,.58,.12]},
    {key:'coaching',name:'COACHING',sub:'Grow People',href:'coaching/',r:3.9,size:.72,speed:.12,phase:4.05,tilt:-.16,color:[1,.25,.68]},
    {key:'think',name:'THINK',sub:'Expand Mindset',href:'insights/',r:5.25,size:.7,speed:.082,phase:2.65,tilt:-.22,color:[1,.2,.32]}
  ];
  let gl,prog,sphere,orbitProg,starProg,sunProg;
  let uProj,uView,uModel,uColor,uLight,uEmissive,uPointSize;
  let viewW=1,viewH=1,dpr=1,time=0,last=performance.now();
  let mx=0,my=0,tx=0,ty=0,hover=-1;
  const planetScreen=nodes.map(()=>({x:0,y:0,r:0,visible:false}));
  const labelsHost=wrap.querySelector('.u-3d-labels');
  const labels=[];
  const fallbackScene=document.createElement('div'); fallbackScene.className='u-3d-fallback-scene';

  function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
  function program(v,f){const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,v));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p}
  const V=`attribute vec3 aPosition;attribute vec3 aNormal;uniform mat4 uProj,uView,uModel;varying vec3 vN;varying vec3 vP;void main(){vec4 wp=uModel*vec4(aPosition,1.0);vP=wp.xyz;vN=normalize(mat3(uModel)*aNormal);gl_Position=uProj*uView*wp;}`;
  const F=`precision mediump float;uniform vec3 uColor,uLight,uEmissive;varying vec3 vN;varying vec3 vP;void main(){vec3 n=normalize(vN);vec3 l=normalize(uLight-vP);float d=max(dot(n,l),0.0);float rim=pow(1.0-max(dot(n,normalize(-vP)),0.0),2.0);vec3 c=uColor*(.28+.92*d)+uEmissive*(.35+rim*1.8);float band=.08*sin(vP.x*9.0+vP.y*7.0+vP.z*11.0);c+=uColor*band;gl_FragColor=vec4(c,1.0);}`;
  const SF=`precision mediump float;attribute vec3 position;attribute float aSize;attribute vec3 aColor;uniform mat4 uProj,uView;varying vec3 vC;void main(){vC=aColor;gl_Position=uProj*uView*vec4(position,1.0);gl_PointSize=aSize;}`;
  const SG=`precision mediump float;varying vec3 vC;void main(){float d=distance(gl_PointCoord,vec2(.5));float a=smoothstep(.5,0.0,d);gl_FragColor=vec4(vC,a);}`;
  const OF=`precision mediump float;uniform vec3 uColor;varying float vA;void main(){gl_FragColor=vec4(uColor,vA);}`;
  const OV=`attribute vec3 aPosition;uniform mat4 uProj,uView,uModel;varying float vA;void main(){gl_Position=uProj*uView*uModel*vec4(aPosition,1.0);vA=.22;}`;
  const USV=`attribute vec3 aPosition;uniform mat4 uProj,uView,uModel;varying vec3 vP;void main(){vec4 p=uModel*vec4(aPosition,1.0);vP=p.xyz;gl_Position=uProj*uView*p;}`;
  const USF=`precision mediump float;varying vec3 vP;uniform vec3 uColor;void main(){vec3 n=normalize(vP);float pulse=.55+.45*sin(vP.x*7.0+vP.y*8.0+vP.z*5.0);float edge=pow(1.0-max(dot(n,vec3(.1,.35,1.0)),0.0),1.7);vec3 c=uColor*(.55+pulse*.5)+vec3(1.0,.7,.25)*(.3+edge*1.6);gl_FragColor=vec4(c,1.0);}`;

  function mat4(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
  function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o}
  function persp(fov,asp,n,f){const t=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o}
  function look(eye,target,up){let z=[eye[0]-target[0],eye[1]-target[1],eye[2]-target[2]];let zl=Math.hypot(...z);z=z.map(v=>v/zl);let x=[up[1]*z[2]-up[2]*z[1],up[2]*z[0]-up[0]*z[2],up[0]*z[1]-up[1]*z[0]];let xl=Math.hypot(...x);x=x.map(v=>v/xl);let y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1])}
  function translate(x,y,z){const m=mat4();m[12]=x;m[13]=y;m[14]=z;return m}
  function scale(s){const m=mat4();m[0]=m[5]=m[10]=s;return m}
  function rotateX(a){const m=mat4(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m}
  function rotateY(a){const m=mat4(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m}
  function rotateZ(a){const m=mat4(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m}
  function model(x,y,z,sx,sy,sz,rx,ry,rz){let m=translate(x,y,z);m=mul(m,rotateZ(rz));m=mul(m,rotateY(ry));m=mul(m,rotateX(rx));const sm=mat4();sm[0]=sx;sm[5]=sy;sm[10]=sz;return mul(m,sm)}
  function sphereData(lat,lon){const p=[],n=[],idx=[];for(let y=0;y<=lat;y++){const v=y/lat,th=v*Math.PI;for(let x=0;x<=lon;x++){const u=x/lon,ph=u*Math.PI*2,s=Math.sin(th);p.push(Math.cos(ph)*s,Math.cos(th),Math.sin(ph)*s);n.push(Math.cos(ph)*s,Math.cos(th),Math.sin(ph)*s)}}for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){const a=y*(lon+1)+x,b=a+lon+1;idx.push(a,b,a+1,b,b+1,a+1)}return {p:new Float32Array(p),n:new Float32Array(n),i:new Uint16Array(idx)}}
  function buffer(data,target){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,target===gl.ELEMENT_ARRAY_BUFFER?gl.STATIC_DRAW:gl.STATIC_DRAW);return b}
  function setup(){
    gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance'})||canvas.getContext('experimental-webgl');
    if(!gl)throw Error('WebGL unavailable');
    prog=program(V,F);orbitProg=program(OV,OF);starProg=program(SF,SG);sunProg=program(USV,USF);
    sphere=sphereData(24,32);sphere.pb=buffer(sphere.p,gl.ARRAY_BUFFER);sphere.nb=buffer(sphere.n,gl.ARRAY_BUFFER);sphere.ib=buffer(sphere.i,gl.ELEMENT_ARRAY_BUFFER);
    const stars=[];const sc=coarse?700:1250;for(let i=0;i<sc;i++){const r=16+Math.random()*28,a=Math.random()*Math.PI*2,z=(Math.random()-.5)*20;stars.push(Math.cos(a)*r,(Math.sin(a)*r)*.62,z)}
    const colors=[];const sizes=[];for(let i=0;i<sc;i++){const c=Math.random();colors.push(.55+.45*c,.62+.35*c,.85+Math.random()*.15);sizes.push(1.2+Math.random()*2.6)}
    starProg.sb=buffer(new Float32Array(stars),gl.ARRAY_BUFFER);starProg.cb=buffer(new Float32Array(colors),gl.ARRAY_BUFFER);starProg.sz=buffer(new Float32Array(sizes),gl.ARRAY_BUFFER);starProg.count=sc;
    orbitProg.ob=[];[2.2,3.35,4.35,4.95,5.65,6.35].forEach((r,k)=>{const pts=[];for(let i=0;i<161;i++){const a=i/160*Math.PI*2;pts.push(Math.cos(a)*r,Math.sin(a)*r*.53,0)}orbitProg.ob.push({b:buffer(new Float32Array(pts),gl.ARRAY_BUFFER),count:161,rot:(k%2?.05:-.07),color:k%2?[.2,.45,1]:[.65,.3,1]})});
    uProj=gl.getUniformLocation(prog,'uProj');uView=gl.getUniformLocation(prog,'uView');uModel=gl.getUniformLocation(prog,'uModel');uColor=gl.getUniformLocation(prog,'uColor');uLight=gl.getUniformLocation(prog,'uLight');uEmissive=gl.getUniformLocation(prog,'uEmissive');
    sunProg.uProj=gl.getUniformLocation(sunProg,'uProj');sunProg.uView=gl.getUniformLocation(sunProg,'uView');sunProg.uModel=gl.getUniformLocation(sunProg,'uModel');sunProg.uColor=gl.getUniformLocation(sunProg,'uColor');
    orbitProg.uProj=gl.getUniformLocation(orbitProg,'uProj');orbitProg.uView=gl.getUniformLocation(orbitProg,'uView');orbitProg.uModel=gl.getUniformLocation(orbitProg,'uModel');orbitProg.uColor=gl.getUniformLocation(orbitProg,'uColor');
    starProg.uProj=gl.getUniformLocation(starProg,'uProj');starProg.uView=gl.getUniformLocation(starProg,'uView');
    gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);resize();buildLabels();requestAnimationFrame(frame);
  }
  function buildLabels(){labelsHost.innerHTML='';nodes.forEach((n,i)=>{const a=document.createElement('a');a.className='u-3d-label '+n.key;a.href=n.href;a.innerHTML='<strong>'+n.name+'</strong><span>'+n.sub+'</span>';a.setAttribute('aria-label',n.name+' — '+n.sub);labelsHost.appendChild(a);labels.push(a)});setTimeout(()=>labels.forEach(x=>x.classList.add('is-visible')),220)}
  function resize(){const r=wrap.getBoundingClientRect();viewW=r.width;viewH=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.floor(viewW*dpr));canvas.height=Math.max(1,Math.floor(viewH*dpr));canvas.style.width=viewW+'px';canvas.style.height=viewH+'px';gl.viewport(0,0,canvas.width,canvas.height)}
  function project(v,proj,view){const m=mul(proj,view),x=v[0],y=v[1],z=v[2],cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy=m[1]*x+m[5]*y+m[9]*z+m[13],cw=m[3]*x+m[7]*y+m[11]*z+m[15];return [(cx/cw*.5+.5)*viewW,(-cy/cw*.5+.5)*viewH,cw]}
  function drawSphere(m,col,emissive){gl.useProgram(prog);gl.bindBuffer(gl.ARRAY_BUFFER,sphere.pb);const ap=gl.getAttribLocation(prog,'aPosition');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,sphere.nb);const an=gl.getAttribLocation(prog,'aNormal');gl.enableVertexAttribArray(an);gl.vertexAttribPointer(an,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,sphere.ib);gl.uniformMatrix4fv(uProj,false,currentProj);gl.uniformMatrix4fv(uView,false,currentView);gl.uniformMatrix4fv(uModel,false,m);gl.uniform3fv(uColor,col);gl.uniform3f(uLight,0,2.5,2);gl.uniform3fv(uEmissive,emissive||[0,0,0]);gl.drawElements(gl.TRIANGLES,sphere.i.length,gl.UNSIGNED_SHORT,0)}
  let currentProj,currentView;
  function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!reduce)time+=dt;tx*=.98;ty*=.98;mx+=(tx-mx)*.045;my+=(ty-my)*.045;
    const cam=[mx*.85,1.0+my*.45,17.2];currentProj=persp(43*Math.PI/180,viewW/viewH,.1,60);currentView=look(cam,[0,0,0],[0,1,0]);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(starProg);gl.uniformMatrix4fv(starProg.uProj,false,currentProj);gl.uniformMatrix4fv(starProg.uView,false,currentView);gl.bindBuffer(gl.ARRAY_BUFFER,starProg.sb);let loc=gl.getAttribLocation(starProg,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,starProg.cb);loc=gl.getAttribLocation(starProg,'aColor');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,starProg.sz);loc=gl.getAttribLocation(starProg,'aSize');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,1,gl.FLOAT,false,0,0);gl.drawArrays(gl.POINTS,0,starProg.count);
    gl.useProgram(orbitProg);gl.uniformMatrix4fv(orbitProg.uProj,false,currentProj);gl.uniformMatrix4fv(orbitProg.uView,false,currentView);gl.uniformMatrix4fv(orbitProg.uModel,false,mat4());orbitProg.ob.forEach(o=>{gl.bindBuffer(gl.ARRAY_BUFFER,o.b);const a=gl.getAttribLocation(orbitProg,'aPosition');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);gl.uniform3fv(orbitProg.uColor,o.color);const mm=mul(rotateZ(o.rot),rotateX(-.03));gl.uniformMatrix4fv(orbitProg.uModel,false,mm);gl.drawArrays(gl.LINE_STRIP,0,o.count)});
    gl.useProgram(sunProg);gl.uniformMatrix4fv(sunProg.uProj,false,currentProj);gl.uniformMatrix4fv(sunProg.uView,false,currentView);const sunM=mul(translate(0,0,0),scale(1.45+Math.sin(time*1.7)*.035));gl.uniformMatrix4fv(sunProg.uModel,false,sunM);gl.uniform3f(sunProg.uColor,1,.48,.08);bindSun();
    nodes.forEach((n,i)=>{const a=n.phase+time*n.speed;const x=Math.cos(a)*n.r,y=Math.sin(a)*n.r*.53,z=Math.sin(a)*n.r*.32;const m=mul(mul(mul(translate(x,y,z),rotateZ(n.tilt)),rotateY(time*.25+i)),scale(n.size));drawSphere(m,n.color,[n.color[0]*.05,n.color[1]*.05,n.color[2]*.05]);const pr=project([x,y,z],currentProj,currentView);planetScreen[i].x=pr[0];planetScreen[i].y=pr[1];planetScreen[i].r=n.size*(viewH/17);planetScreen[i].visible=pr[2]>0;positionLabel(i)});
    requestAnimationFrame(frame);
  }
  function bindSun(){gl.bindBuffer(gl.ARRAY_BUFFER,sphere.pb);let a=gl.getAttribLocation(sunProg,'aPosition');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);gl.drawElements(gl.TRIANGLES,sphere.i.length,gl.UNSIGNED_SHORT,0);}
  function positionLabel(i){const p=planetScreen[i],el=labels[i];if(!el)return;const ox=Math.max(42,Math.min(72,viewW*.065)), oy=(i===0?-10:i===1?-6:2);el.style.transform=`translate(${p.x+ox}px,${p.y+oy}px) translate(0,-50%)`;el.style.opacity=p.visible?'1':'0';el.classList.toggle('is-hovered',i===hover)}
  function pointer(e){const r=canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;tx=(x/r.width-.5)*1.7;ty=(y/r.height-.5)*-1.0;let hit=-1,best=1e9;nodes.forEach((n,i)=>{const p=planetScreen[i],d=Math.hypot(x-p.x,y-p.y);if(d<p.r*1.25&&d<best){best=d;hit=i}});hover=hit;canvas.style.cursor=hit>=0?'pointer':'grab'}
  canvas.addEventListener('pointermove',pointer,{passive:true});canvas.addEventListener('pointerleave',()=>{hover=-1;tx=ty=0;canvas.style.cursor='grab'});canvas.addEventListener('pointerdown',e=>{pointer(e);if(hover>=0&&e.pointerType!=='touch')location.href=nodes[hover].href});window.addEventListener('resize',resize);
  function fallback(){wrap.classList.add('webgl-failed');fallbackScene.innerHTML='<div class="fallback-sun"><span>AGILE</span><small>ORBIT</small></div>'+nodes.map((n,i)=>`<a class="fallback-planet p${i}" href="${n.href}" style="--planet:rgb(${n.color.map(x=>Math.round(x*255)).join(',')});--i:${i}"><i></i><span><b>${n.name}</b><small>${n.sub}</small></span></a>`).join('');wrap.appendChild(fallbackScene);}
  try{setup()}catch(e){console.warn('[Agile Orbit] WebGL unavailable',e);fallback()}
})();
