/* ==========================================================================
   CONFIG — edit these to personalise everything
   ========================================================================== */
const CONFIG = {
  passcode: "ILOVEYOU",

  // Optional: paste a Formspree link here (e.g. "https://formspree.io/f/abcd1234")
  // and you'll get an EMAIL the instant she taps Yes or No.
  // See README.md -> "Knowing her answer" for the 2-minute, no-code setup.
  // Leave this as "" to skip notifications entirely.
  notifyURL: "https://formspree.io/f/xwlkoqgr",

  // The 5 balloon notes (each pairs with assets/images/photo1.jpg ... photo5.jpg)
  balloonNotes: [
    "you made my life better, just by being in it.",
    "every ordinary day feels lighter when I get to talk to you.",
    "you're the calm I didn't know I needed.",
    "I smile at my phone like an idiot and it's always because of you.",
    "whatever this is between us... I never want it to stop."
  ],

  // ~80-90 words, shown on the "final photo" scene
  finalParagraph:
    "This is still the picture I open when the day gets loud........ nothing fancy happened in it, you were just being you, and somehow that was enough to undo me a little. It's strange how one photo can hold this much........ I look at it more than I probably should, and every single time it lands the same way. Some things fade with time, this hasn't........ if I'm honest, it's not really about the picture anymore. It's you. It's always been you, and I don't know how to imagine my life without you in it."
};

/* ==========================================================================
   SCENE MANAGER
   ========================================================================== */
const scenes = ["scene-passcode","scene-welcome","scene-cake","scene-puzzle","scene-balloons","scene-final","scene-question","scene-result"];

function goToScene(id){
  scenes.forEach(s => document.getElementById(s).classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({top: 0, behavior: "instant"});
}

/* ==========================================================================
   FLOATING BACKGROUND (hearts / petals / sparkles, continuous)
   ========================================================================== */
(function floaters(){
  const layer = document.getElementById("floaters");
  const symbols = ["🩷","🌸","💗","✨","🌷"];
  const COUNT = 16;

  for(let i = 0; i < COUNT; i++){
    const el = document.createElement("span");
    el.className = "floater";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = (1 + Math.random() * 1.4) + "rem";
    el.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    el.style.animationDuration = (10 + Math.random() * 10) + "s";
    el.style.animationDelay = (Math.random() * 14) + "s";
    layer.appendChild(el);
  }
})();

/* ==========================================================================
   BACKGROUND MUSIC
   ========================================================================== */
const bgMusic = document.getElementById("bgMusic");
const soundToggle = document.getElementById("soundToggle");

function tryStartMusic(){
  bgMusic.volume = 0.55;
  const p = bgMusic.play();
  if(p && p.catch){
    p.then(() => { soundToggle.classList.remove("hidden"); })
     .catch(() => { /* autoplay blocked - toggle still shown so she can start it manually */
        soundToggle.classList.remove("hidden");
        soundToggle.textContent = "🔈";
     });
  } else {
    soundToggle.classList.remove("hidden");
  }
}

soundToggle.addEventListener("click", () => {
  if(bgMusic.paused){
    bgMusic.play().catch(()=>{});
    soundToggle.textContent = "🔊";
  } else {
    bgMusic.pause();
    soundToggle.textContent = "🔈";
  }
});

/* ==========================================================================
   SCENE 0 — PASSCODE
   ========================================================================== */
const passcodeForm = document.getElementById("passcodeForm");
const passcodeInput = document.getElementById("passcodeInput");
const passcodeError = document.getElementById("passcodeError");
const passcodeCard = document.querySelector(".passcode-card");

passcodeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const clean = passcodeInput.value.trim().toUpperCase().replace(/\s+/g, "");
  if(clean === CONFIG.passcode){
    tryStartMusic();
    goToScene("scene-welcome");
    buildHeartTree();
    buildFlowerRow();
  } else {
    passcodeError.classList.remove("show");
    void passcodeError.offsetWidth; // restart animation
    passcodeError.classList.add("show");
    passcodeCard.classList.remove("shake");
    void passcodeCard.offsetWidth;
    passcodeCard.classList.add("shake");
    passcodeInput.focus();
  }
});

/* ==========================================================================
   SCENE 1 — HEART TREE + FLOWERS
   ========================================================================== */
let treeBuilt = false;

function buildHeartTree(){
  if(treeBuilt) return;
  treeBuilt = true;

  const svg = document.getElementById("heartTree");
  const NS = "http://www.w3.org/2000/svg";

  // trunk
  const trunk = document.createElementNS(NS, "path");
  trunk.setAttribute("d", "M250,540 C246,470 254,430 248,380 C244,340 256,320 250,280");
  trunk.setAttribute("stroke", "#C99B7A");
  trunk.setAttribute("stroke-width", "14");
  trunk.setAttribute("fill", "none");
  trunk.setAttribute("stroke-linecap", "round");
  trunk.classList.add("tree-trunk-path");
  svg.appendChild(trunk);

  // small branches
  const branchPaths = [
    "M250,420 C230,410 210,395 190,392",
    "M250,400 C270,392 292,378 308,372",
    "M250,340 C228,332 206,320 188,316",
    "M250,320 C272,312 296,300 312,292"
  ];
  branchPaths.forEach((d, i) => {
    const b = document.createElementNS(NS, "path");
    b.setAttribute("d", d);
    b.setAttribute("stroke", "#C99B7A");
    b.setAttribute("stroke-width", "7");
    b.setAttribute("fill", "none");
    b.setAttribute("stroke-linecap", "round");
    b.classList.add("tree-trunk-path");
    b.style.animationDelay = (300 + i * 120) + "ms";
    svg.appendChild(b);
  });

  // heart-shaped canopy: scatter heart positions within an oval region up top
  const heartPositions = [];
  const cx = 250, cy = 190, rx = 155, ry = 130;
  const ringsCount = 46;
  for(let i = 0; i < ringsCount; i++){
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    const x = cx + Math.cos(t) * rx * r;
    const y = cy + Math.sin(t) * ry * r * 0.9;
    heartPositions.push({x, y, s: 0.55 + Math.random() * 0.85});
  }

  function heartPathAt(x, y, scale){
    const s = scale * 0.9;
    return `M${x},${y+6*s}
      C${x-14*s},${y-6*s} ${x-8*s},${y-16*s} ${x},${y-9*s}
      C${x+8*s},${y-16*s} ${x+14*s},${y-6*s} ${x},${y+6*s} Z`;
  }

  const colors = ["#F4B8CC","#E8879E","#F7C9D9","#D96C8C","#FBD5E3"];

  heartPositions
    .sort((a,b) => a.y - b.y)
    .forEach((h, i) => {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", heartPathAt(h.x, h.y, 16 * h.s));
      path.setAttribute("fill", colors[i % colors.length]);
      path.classList.add("tree-heart");
      path.style.animationDelay = (900 + i * 28) + "ms";
      svg.appendChild(path);
      requestAnimationFrame(() => path.classList.add("grown"));
    });
}

function buildFlowerRow(){
  const row = document.getElementById("flowerRow");
  if(row.childElementCount) return;
  const flowers = ["🌸","🌷","🌼","🌺","🌻","🌷","🌸"];
  flowers.forEach((f, i) => {
    const span = document.createElement("span");
    span.className = "flower";
    span.textContent = f;
    span.style.animationDelay = (2200 + i * 140) + "ms";
    row.appendChild(span);
  });
}

document.getElementById("scene-welcome").addEventListener("click", () => {
  goToScene("scene-cake");
  runCakeSequence();
});

/* ==========================================================================
   SCENE 2 — CAKE (build animation + drag-to-slice interaction)
   ========================================================================== */
function runCakeSequence(){
  const caption = document.getElementById("cakeCaption");
  const instruction = document.getElementById("cakeInstruction");
  const continueBtn = document.getElementById("cakeContinueBtn");
  const knife = document.getElementById("knife");
  const cakeEl = document.getElementById("cakeEl");
  const slicePiece = document.getElementById("slicePiece");
  const stage = document.getElementById("cakeStage");

  caption.textContent = "preparing a cake for you";
  instruction.classList.add("hidden");
  continueBtn.classList.add("hidden");

  let sliced = false;
  let dragging = false;
  let startX = 0;

  setTimeout(() => {
    caption.textContent = "happy birthday, Anwesha 🎂";
    instruction.classList.remove("hidden");
    knife.classList.add("ready");
    stage.addEventListener("pointerdown", onDown);
  }, 2400);

  function onDown(e){
    if(sliced) return;
    dragging = true;
    startX = e.clientX;
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
  }

  function onMove(e){
    if(!dragging || sliced) return;
    const dx = Math.max(0, e.clientX - startX);
    const clamped = Math.min(dx, 220);
    knife.style.transform = `translate(${clamped}px, ${Math.min(clamped * 0.15, 22)}px) rotate(${Math.min(clamped * 0.14, 22)}deg)`;
    if(dx > 130){
      performSlice();
    }
  }

  function onUp(){
    dragging = false;
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerup", onUp);
    if(!sliced){
      knife.style.transition = "transform 320ms ease";
      knife.style.transform = "";
      setTimeout(() => { knife.style.transition = ""; }, 340);
    }
  }

  function performSlice(){
    sliced = true;
    cakeEl.classList.add("sliced");
    slicePiece.classList.add("cut");
    knife.style.transition = "transform 420ms ease, opacity 420ms ease";
    knife.style.transform = "translate(250px, 46px) rotate(28deg)";
    knife.style.opacity = "0";
    instruction.classList.add("hidden");
    caption.textContent = "made with all my love 🩷";
    stage.removeEventListener("pointerdown", onDown);
    setTimeout(() => continueBtn.classList.remove("hidden"), 900);
  }
}

/* ==========================================================================
   SCENE 3 — PUZZLE (tap-to-swap picture puzzle)
   ========================================================================== */
const PUZZLE_SIZE = 3;
let puzzleState = null;

function buildPuzzle(){
  const board = document.getElementById("puzzleBoard");
  const sub = document.getElementById("puzzleSub");
  const continueBtn = document.getElementById("puzzleContinueBtn");
  continueBtn.classList.add("hidden");
  sub.textContent = "tap two tiles to swap them";
  board.innerHTML = "";

  const total = PUZZLE_SIZE * PUZZLE_SIZE;
  let order = [...Array(total).keys()];
  do {
    for(let i = order.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while(order.every((v, i) => v === i));

  puzzleState = { order, selected: null, solved: false };

  for(let slot = 0; slot < total; slot++){
    const tile = document.createElement("div");
    tile.className = "puzzle-tile";
    tile.dataset.slot = slot;
    tile.style.backgroundImage = "url('assets/images/puzzle.jpg')";
    tile.addEventListener("click", onTileClick);
    board.appendChild(tile);
  }
  renderPuzzleTiles();
}

function renderPuzzleTiles(){
  const tiles = document.querySelectorAll(".puzzle-tile");
  tiles.forEach(tile => {
    const slot = +tile.dataset.slot;
    const value = puzzleState.order[slot];
    const col = value % PUZZLE_SIZE;
    const row = Math.floor(value / PUZZLE_SIZE);
    tile.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
    tile.classList.toggle("correct", value === slot);
  });
}

function onTileClick(e){
  if(puzzleState.solved) return;
  const slot = +e.currentTarget.dataset.slot;

  if(puzzleState.selected === null){
    puzzleState.selected = slot;
    e.currentTarget.classList.add("selected");
    return;
  }

  if(puzzleState.selected === slot){
    e.currentTarget.classList.remove("selected");
    puzzleState.selected = null;
    return;
  }

  const a = puzzleState.selected;
  const b = slot;
  [puzzleState.order[a], puzzleState.order[b]] = [puzzleState.order[b], puzzleState.order[a]];

  const tileA = document.querySelector(`.puzzle-tile[data-slot="${a}"]`);
  const tileB = document.querySelector(`.puzzle-tile[data-slot="${b}"]`);
  tileA.classList.remove("selected");
  tileA.classList.add("swap-anim");
  tileB.classList.add("swap-anim");
  setTimeout(() => { tileA.classList.remove("swap-anim"); tileB.classList.remove("swap-anim"); }, 340);

  puzzleState.selected = null;
  renderPuzzleTiles();

  if(puzzleState.order.every((v, i) => v === i)){
    puzzleState.solved = true;
    document.getElementById("puzzleSub").textContent = "there she is 🩷";
    setTimeout(() => document.getElementById("puzzleContinueBtn").classList.remove("hidden"), 500);
  }
}

/* ==========================================================================
   SCENE 4 — BALLOONS
   ========================================================================== */
let balloonsPopped = 0;

function buildBalloons(){
  const field = document.getElementById("balloonField");
  const sub = document.getElementById("balloonSub");
  field.innerHTML = "";
  balloonsPopped = 0;
  document.getElementById("balloonsContinueBtn").classList.add("hidden");
  sub.textContent = "5 little things I needed to tell you";

  const colorPairs = [
    ["#ffe1ec", "#f2a4bf"],
    ["#ffe9dc", "#f4b98a"],
    ["#fbe4ff", "#d9a0e8"],
    ["#e3f1ff", "#a9c8e8"],
    ["#fff3d6", "#e8c26d"]
  ];
  const basePositions = [8, 26, 44, 62, 80];

  for(let i = 0; i < 5; i++){
    const b = document.createElement("div");
    b.className = "balloon";
    b.style.left = (basePositions[i] + (Math.random() * 6 - 3)) + "%";
    b.style.setProperty("--rise-delay", (i * 180) + "ms");
    b.style.setProperty("--rise-to", (6 + Math.random() * 12) + "%");
    b.style.setProperty("--b-light", colorPairs[i][0]);
    b.style.setProperty("--b-color", colorPairs[i][1]);
    b.innerHTML = '<div class="body"></div><div class="string"></div>';
    b.addEventListener("click", () => popBalloon(b, i));
    field.appendChild(b);
  }
}

function popBalloon(el, i){
  if(el.classList.contains("popped")) return;
  el.classList.add("popped");
  balloonsPopped++;

  const overlay = document.createElement("div");
  overlay.className = "balloon-note-overlay";
  overlay.innerHTML = `
    <div class="balloon-note-card">
      <img src="assets/images/photo${i + 1}.jpg" alt="a photo of her">
      <p>${CONFIG.balloonNotes[i]}</p>
      <button class="balloon-note-close">close</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector(".balloon-note-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if(e.target === overlay) overlay.remove(); });

  if(balloonsPopped === 5){
    document.getElementById("balloonSub").textContent = "that's all of them... for now 🩷";
    setTimeout(() => document.getElementById("balloonsContinueBtn").classList.remove("hidden"), 500);
  }
}

/* ==========================================================================
   SCENE 5 — FINAL PHOTO + PARAGRAPH
   ========================================================================== */
function showFinal(){
  document.getElementById("finalParagraph").textContent = CONFIG.finalParagraph;
}

/* ==========================================================================
   SCENE 6 — THE QUESTION
   ========================================================================== */
function sendAnswer(answer){
  if(!CONFIG.notifyURL) return;
  // This single payload works whether CONFIG.notifyURL is a Formspree link
  // (you get an email) or a Discord webhook link (you get a message) -
  // no need to change this code either way, see README section 4.
  fetch(CONFIG.notifyURL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      content: `💌 Anwesha answered your question: ${answer}`,
      answer: answer,
      message: `Anwesha answered your question: ${answer}`
    })
  }).catch(() => {});
}

function answerQuestion(answer){
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const responseEl = document.getElementById("questionResponse");
  if(btnYes.disabled) return; // already answered
  btnYes.disabled = true;
  btnNo.disabled = true;

  sendAnswer(answer);

  if(answer === "Yes"){
    responseEl.textContent = "it might be your birthday, but I'm the happiest person today 🩷";
    const gif = document.createElement("img");
    gif.src = "assets/images/celebration.gif";
    gif.alt = "celebration";
    gif.className = "question-gif";
    gif.onerror = () => gif.remove();
    document.querySelector(".question-wrap").appendChild(gif);
  } else {
    responseEl.textContent = "ohh....okayy have fun enjoy your day.....";
  }

  let advanced = false;
  function advance(){
    if(advanced) return;
    advanced = true;
    goToScene("scene-result");
    buildResultGallery();
  }
  setTimeout(advance, 3600);
  document.getElementById("scene-question").addEventListener("click", advance, { once: true });
}

/* ==========================================================================
   SCENE 7 — RESULT GALLERY
   ========================================================================== */
function buildResultGallery(){
  const gallery = document.getElementById("resultGallery");
  gallery.innerHTML = "";
  const imgs = ["photo1.jpg","photo2.jpg","favorite.jpg","photo3.jpg","photo4.jpg","photo5.jpg"];
  imgs.forEach(src => {
    const img = document.createElement("img");
    img.src = "assets/images/" + src;
    img.alt = "a memory of her";
    gallery.appendChild(img);
  });
}

/* ==========================================================================
   WIRING
   ========================================================================== */
document.getElementById("cakeContinueBtn").addEventListener("click", () => {
  goToScene("scene-puzzle");
  buildPuzzle();
});

document.getElementById("puzzleContinueBtn").addEventListener("click", () => {
  goToScene("scene-balloons");
  buildBalloons();
});

document.getElementById("balloonsContinueBtn").addEventListener("click", () => {
  goToScene("scene-final");
  showFinal();
});

document.getElementById("finalContinueBtn").addEventListener("click", () => {
  goToScene("scene-question");
});

document.getElementById("btnYes").addEventListener("click", () => answerQuestion("Yes"));
document.getElementById("btnNo").addEventListener("click", () => answerQuestion("No"));

// playful little dodge on the No button for desktop/mouse users
document.getElementById("btnNo").addEventListener("mouseenter", function(){
  if(this.disabled) return;
  if(window.matchMedia("(pointer: fine)").matches){
    const dx = Math.random() * 140 - 70;
    const dy = Math.random() * 30 - 15;
    this.style.transform = `translate(${dx}px, ${dy}px)`;
  }
});

passcodeInput.focus();
