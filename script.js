// 年号
document.getElementById('y').textContent = new Date().getFullYear();

// ナビのスムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length > 1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// スクロールリビール
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
},{threshold: .15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ハンバーガー（簡易）
const ham = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
ham?.addEventListener('click', ()=>{
  nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
});

// Before/After スライダー
(function(){
  const wrap = document.querySelector('.ba');
  if(!wrap) return;
  const after = wrap.querySelector('.ba__after');
  const line = wrap.querySelector('.ba__handle span');

  const set = (x)=>{
    const rect = wrap.getBoundingClientRect();
    let pct = (x - rect.left) / rect.width;
    pct = Math.max(0.02, Math.min(0.98, pct));
    after.style.clipPath = `inset(0 0 0 ${pct*100}%)`;
    line.style.left = `${pct*100}%`;
  };

  const onMove = (ev)=>{
    if(typeof ev.touches !== 'undefined'){
      set(ev.touches[0].clientX);
    } else {
      set(ev.clientX);
    }
  };

  // 初期位置
  set(wrap.getBoundingClientRect().left + wrap.clientWidth * .5);

  // ドラッグ / マウス移動
  let drag = false;
  wrap.addEventListener('mousedown', e=>{drag = true; onMove(e);});
  wrap.addEventListener('mousemove', e=>{if(drag) onMove(e);});
  window.addEventListener('mouseup', ()=> drag = false);

  // タッチ
  wrap.addEventListener('touchstart', onMove, {passive:true});
  wrap.addEventListener('touchmove', onMove, {passive:true});
})();

