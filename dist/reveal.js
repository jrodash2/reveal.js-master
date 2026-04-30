(function(){
  function flatSlides(root){
    const out=[];
    [...root.children].forEach((h,hi)=>{
      const v=[...h.children].filter(c=>c.tagName==='SECTION');
      if(v.length){v.forEach((s,vi)=>out.push({el:s,h:hi,v:vi,parent:h}))}
      else out.push({el:h,h:hi,v:0,parent:null});
    });
    return out;
  }
  const Reveal={
    initialize(opts={}){
      this.opts=Object.assign({controls:true,progress:true,hash:true,slideNumber:true},opts);
      this.root=document.querySelector('.reveal'); this.slidesEl=this.root.querySelector('.slides');
      this.slides=flatSlides(this.slidesEl); this.index=0;
      this.slides.forEach(s=>s.el.classList.remove('active'));
      this.buildUI(); this.bind();
      const fromHash=this.fromHash(); this.goTo(fromHash>=0?fromHash:0,false);
      return this;
    },
    buildUI(){
      if(this.opts.controls){const c=document.createElement('div');c.className='controls';c.innerHTML='<button data-d="prev">◀</button><button data-d="next">▶</button>';this.root.appendChild(c);}
      if(this.opts.progress){const p=document.createElement('div');p.className='progress';p.innerHTML='<span></span>';this.root.appendChild(p);}
      if(this.opts.slideNumber){const n=document.createElement('div');n.className='slide-number';this.root.appendChild(n);}
    },
    bind(){
      this.root.addEventListener('click',e=>{const d=e.target.dataset.d;if(d==='prev')this.prev();if(d==='next')this.next();});
      window.addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key))this.next();if(['ArrowLeft','PageUp'].includes(e.key))this.prev();if(e.key==='ArrowDown')this.nextVertical();if(e.key==='ArrowUp')this.prevVertical();});
      window.addEventListener('hashchange',()=>{const i=this.fromHash();if(i>=0)this.goTo(i,false);});
    },
    fromHash(){const m=location.hash.match(/#\/(\d+)(?:\/(\d+))?/);if(!m)return-1;const h=+m[1],v=+(m[2]||0);return this.slides.findIndex(s=>s.h===h&&s.v===v);},
    toHash(s){return `#/${s.h}/${s.v}`;},
    goTo(i,update=true){if(i<0||i>=this.slides.length)return;this.slides[this.index]&&this.slides[this.index].el.classList.remove('active');this.index=i;const s=this.slides[i];s.el.classList.add('active');if(update){if(this.opts.hash)location.hash=this.toHash(s);const p=this.root.querySelector('.progress span');if(p)p.style.width=((i+1)/this.slides.length*100)+'%';const n=this.root.querySelector('.slide-number');if(n)n.textContent=`${i+1} / ${this.slides.length}`;}},
    next(){this.goTo(this.index+1)}, prev(){this.goTo(this.index-1)},
    nextVertical(){const s=this.slides[this.index];const i=this.slides.findIndex(x=>x.h===s.h&&x.v===s.v+1);if(i>=0)this.goTo(i)},
    prevVertical(){const s=this.slides[this.index];const i=this.slides.findIndex(x=>x.h===s.h&&x.v===s.v-1);if(i>=0)this.goTo(i)}
  };
  window.Reveal=Reveal;
})();
