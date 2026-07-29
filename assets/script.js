/* ─── App State ─── */
let quotes = [];
let shuffled = [];
let currentIdx = 0;
let frontCard = 'A';

/* ─── DOM Refs ─── */
const cardA   = document.getElementById('cardA');
const cardB   = document.getElementById('cardB');
const quoteA  = document.getElementById('quoteA');
const quoteB  = document.getElementById('quoteB');
const toast   = document.getElementById('toast');
let toastTimer = null;

/* ─── Fisher-Yates Shuffle (fresh random order each call) ─── */
const shuffleDeck = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

/* ─── Get next joke (no repeats until deck is exhausted) ─── */
const getNextQuote = () => {
    if (currentIdx >= shuffled.length) {
        // Ran through the whole deck — reshuffle and start over
        shuffled = shuffleDeck(quotes);
        currentIdx = 0;
    }
    return shuffled[currentIdx++].text;
};

/* ─── Load Quotes ─── */
const loadQuotes = async () => {
    const resp = await fetch('./db.json');
    const data = await resp.json();
    quotes = data;

    // Fresh random shuffle every page load
    shuffled = shuffleDeck(quotes);
    currentIdx = 0;

    quoteA.textContent = getNextQuote();
    quoteB.textContent = getNextQuote();

    cardA.classList.add('front');
    cardB.classList.add('back');
    setBackRotation(cardB);
};

/* ─── Random back tilt ─── */
const setBackRotation = (el) => {
    const deg = (Math.random() * 6 - 3).toFixed(2); // -3° to +3°
    el.style.setProperty('--back-rotate', deg + 'deg');
};

/* ─── Deck Flip ─── */
const flipCard = () => {
    const isFrontA = frontCard === 'A';
    const frontEl  = isFrontA ? cardA  : cardB;
    const backEl   = isFrontA ? cardB  : cardA;
    const backQuote = isFrontA ? quoteB : quoteA;

    backQuote.textContent = getNextQuote();

    frontEl.classList.remove('front');
    frontEl.classList.add('back');
    setBackRotation(frontEl); // give the just-demoted card a new random tilt

    backEl.classList.remove('back');
    backEl.classList.add('front');

    frontCard = isFrontA ? 'B' : 'A';
};

/* ─── Copy ─── */
const copyQuote = async () => {
    const sourceEl = frontCard === 'A' ? quoteA : quoteB;
    const jokeText = sourceEl.innerText;

    try {
        await navigator.clipboard.writeText(jokeText);
    } catch {
        const ta = document.createElement('textarea');
        ta.value = jokeText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
    showToast('Copied!');
};

/* ─── Toast ─── */
const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
};

/* ─── Orb Wander Engine ─── */
const orbEls = document.querySelectorAll('.orb');

class Orb {
    constructor(el, speed) {
        this.el = el;
        this.speed = speed;
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.pickTarget();
        this.offset = Math.random() * 1000;
    }

    pickTarget() {
        const margin = -100;
        this.tx = margin + Math.random() * (window.innerWidth  - margin * 2);
        this.ty = margin + Math.random() * (window.innerHeight - margin * 2);
    }

    update(time) {
        const dx = this.tx - this.x;
        const dy = this.ty - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
            const prevX = this.tx;
            const prevY = this.ty;
            this.pickTarget();
            if (Math.abs(this.tx - prevX) < 200 && Math.abs(this.ty - prevY) < 200) {
                this.pickTarget();
            }
        }

        const wobble = Math.sin(time * 0.0003 + this.offset) * 0.15 + 1;
        const t = Math.min(0.008 * this.speed * wobble, 0.08);
        this.x += dx * t;
        this.y += dy * t;

        this.el.style.left = this.x + 'px';
        this.el.style.top  = this.y + 'px';
    }
}

const wanderers = [
    new Orb(document.querySelector('.orb-1'), 0.8),
    new Orb(document.querySelector('.orb-2'), 0.6),
    new Orb(document.querySelector('.orb-3'), 0.5),
];

const tick = (time) => {
    for (const w of wanderers) w.update(time);
    requestAnimationFrame(tick);
};
requestAnimationFrame(tick);

window.addEventListener('resize', () => {
    setTimeout(() => {
        for (const w of wanderers) w.pickTarget();
    }, 100);
});

/* ─── Boot ─── */
loadQuotes();
