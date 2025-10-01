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

// Before/After スライダー（ホバー追従・クリックジャンプ・ドラッグ・キーボード対応）
(() => {
  const ba = document.querySelector('.ba');
  if (!ba) return;

  const after  = ba.querySelector('.ba__after');
  const handle = ba.querySelector('.ba__handle span') || ba.querySelector('.ba__handle');

  const setPos = (clientX) => {
    const rect = ba.getBoundingClientRect();
    let x = (clientX - rect.left) / rect.width;       // 0..1
    x = Math.max(0, Math.min(1, x));
    after.style.clipPath = `inset(0 0 0 ${x * 100}%)`;
    if (handle) handle.style.left = `${x * 100}%`;
    ba.setAttribute("aria-valuenow", Math.round(x * 100));
  };

  // 初期位置は中央
  setPos(ba.getBoundingClientRect().left + ba.clientWidth / 2);

  // アクセシビリティ
  ba.setAttribute("tabindex", "0");
  ba.setAttribute("role", "slider");
  ba.setAttribute("aria-valuemin", "0");
  ba.setAttribute("aria-valuemax", "100");

  let dragging = false;

  // ドラッグ（マウス/タッチ統一）
  ba.addEventListener("pointerdown", (e) => {
    dragging = true;
    ba.setPointerCapture(e.pointerId);
    setPos(e.clientX);
  });
  ba.addEventListener("pointermove", (e) => {
    if (dragging) {
      setPos(e.clientX);
    } else {
      // PCはホバーでも追従（スマホは無視）
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        setPos(e.clientX);
      }
    }
  });
  ba.addEventListener("pointerup",   () => { dragging = false; });
  ba.addEventListener("pointercancel",() => { dragging = false; });

  // クリックした位置にパッと移動
  ba.addEventListener("click", (e) => setPos(e.clientX));

  // キーボード操作 ← → / Home / End
  ba.addEventListener("keydown", (e) => {
    const m = after.style.clipPath.match(/inset\(0 0 0 ([\d.]+)%\)/);
    let x = m ? parseFloat(m[1]) / 100 : 0.5;
    const step = e.shiftKey ? 0.10 : 0.05;

    if (e.key === "ArrowLeft")  x = Math.max(0, x - step);
    if (e.key === "ArrowRight") x = Math.min(1, x + step);
    if (e.key === "Home")       x = 0;
    if (e.key === "End")        x = 1;

    after.style.clipPath = `inset(0 0 0 ${x * 100}%)`;
    if (handle) handle.style.left = `${x * 100}%`;
    ba.setAttribute("aria-valuenow", Math.round(x * 100));
  });
})();


// スマホ専用の滑らかタッチ処理（PCは従来通り）
(() => {
  const ba = document.querySelector('.ba');
  if (!ba) return;

  // スマホ判定
  if (!window.matchMedia("(max-width: 767px)").matches) return;

  const after  = ba.querySelector('.ba__after');
  const handle = ba.querySelector('.ba__handle span') || ba.querySelector('.ba__handle');

  const setPos = (clientX) => {
    const rect = ba.getBoundingClientRect();
    let x = (clientX - rect.left) / rect.width;
    x = Math.max(0, Math.min(1, x));
    after.style.clipPath = `inset(0 0 0 ${x * 100}%)`;
    if (handle) handle.style.left = `${x * 100}%`;
  };

  let currentX = null;
  let needsUpdate = false;

  // rAFループで滑らかに更新
  const update = () => {
    if (needsUpdate && currentX !== null) {
      setPos(currentX);
      needsUpdate = false;
    }
    requestAnimationFrame(update);
  };
  update();

  // タッチイベント
  ba.addEventListener("touchstart", (e) => {
    currentX = e.touches[0].clientX;
    needsUpdate = true;
  }, { passive: true });

  ba.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX;
    needsUpdate = true;
  }, { passive: true });
})();
