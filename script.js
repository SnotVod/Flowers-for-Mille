const rawConfig = window.BLOOM_CONFIG || {};

const moods = {
  sunrise: {
    bgTop: "#ffe1ed", bgMid: "#fff3c7", bgBottom: "#cdf0c9", ground: "#7ccf72", groundDark: "#399451",
    petalOne: "#ff86b8", petalTwo: "#ffd1e2", petalThree: "#f45c9a", center: "#ffd862", glow: "rgba(255, 129, 184, 0.46)"
  },
  meadow: {
    bgTop: "#d9f5ff", bgMid: "#fffbe1", bgBottom: "#c9f7cb", ground: "#6fc46a", groundDark: "#2f8f4c",
    petalOne: "#ff9fcb", petalTwo: "#ffe0ee", petalThree: "#ee6ea8", center: "#ffe16b", glow: "rgba(255, 159, 203, 0.46)"
  },
  moonlight: {
    bgTop: "#1b2445", bgMid: "#5b5f93", bgBottom: "#8ec6a9", ground: "#4b966b", groundDark: "#1f5f45",
    petalOne: "#c99cff", petalTwo: "#ecdfff", petalThree: "#9463e5", center: "#fff0a8", glow: "rgba(214, 177, 255, 0.52)", text: "#fff8ff", softText: "#efe0ff", shadow: "rgba(22, 16, 38, 0.38)", card: "rgba(255, 255, 255, 0.86)"
  },
  peach: {
    bgTop: "#ffe2d8", bgMid: "#fff1d4", bgBottom: "#d6f0bd", ground: "#78c86e", groundDark: "#438f43",
    petalOne: "#ff9a7d", petalTwo: "#ffd2c4", petalThree: "#ff6f75", center: "#ffd65f", glow: "rgba(255, 150, 125, 0.45)"
  },
  lavender: {
    bgTop: "#eadfff", bgMid: "#fff4fa", bgBottom: "#d7f2c7", ground: "#77c16c", groundDark: "#3a8e53",
    petalOne: "#b79cff", petalTwo: "#eadfff", petalThree: "#8a6be8", center: "#ffe27a", glow: "rgba(183, 156, 255, 0.52)"
  },
  forest: {
    bgTop: "#c8f0df", bgMid: "#e9f7d6", bgBottom: "#b6e2a8", ground: "#62b261", groundDark: "#267044",
    petalOne: "#ff7da7", petalTwo: "#ffc9dc", petalThree: "#df4d87", center: "#f9d65c", glow: "rgba(255, 125, 167, 0.45)"
  }
};

const moodNames = Object.keys(moods);
let config = null;
let dateState = null;
let allEntries = [];
let timerInterval = null;

const flowerFacts = {
  peony: {
    title: "Peony",
    info: "A big, soft bloom with layered petals.",
    fact: "A healthy peony plant can come back for decades."
  },
  rose: {
    title: "Rose",
    info: "A classic flower for affection and warmth.",
    fact: "Roses are related to apples, pears, and strawberries."
  },
  hydrangea: {
    title: "Hydrangea",
    info: "A cloud of many tiny florets gathered into one bloom.",
    fact: "Some hydrangeas change color with the soil."
  },
  tulip: {
    title: "Tulip",
    info: "A clean cup-shaped flower that opens with the light.",
    fact: "Tulips keep growing a little after they are cut."
  },
  meadow: {
    title: "Meadow bloom",
    info: "A sunny field flower with a cheerful center.",
    fact: "Sunflowers can track the sun while they are young."
  },
  bouquet: {
    title: "Bouquet",
    info: "A gathered mix of favorite blooms.",
    fact: "Bouquets became little coded messages in Victorian flower language."
  },
  fuchsia: {
    title: "Fuchsia",
    info: "A hanging bell-shaped flower with bright skirts.",
    fact: "Hummingbirds love many fuchsia varieties."
  }
};

function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function applyMood(name) {
  const moodName = moods[name] ? name : moodNames[Math.floor(Math.random() * moodNames.length)];
  const mood = moods[moodName];
  document.body.dataset.mood = moodName;
  setCssVar("--bg-top", mood.bgTop);
  setCssVar("--bg-mid", mood.bgMid);
  setCssVar("--bg-bottom", mood.bgBottom);
  setCssVar("--ground", mood.ground);
  setCssVar("--ground-dark", mood.groundDark);
  setCssVar("--petal-one", mood.petalOne);
  setCssVar("--petal-two", mood.petalTwo);
  setCssVar("--petal-three", mood.petalThree);
  setCssVar("--center", mood.center);
  setCssVar("--glow", mood.glow);
  setCssVar("--text", mood.text || "#43283a");
  setCssVar("--soft-text", mood.softText || "#7b5269");
  setCssVar("--shadow", mood.shadow || "rgba(76, 35, 62, 0.2)");
  setCssVar("--card", mood.card || "rgba(255, 255, 255, 0.82)");
}

function safeText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value || "";
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function isCompactViewport() {
  return window.matchMedia?.("(max-width: 760px)").matches || window.innerWidth <= 760;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

function daysBetween(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const dateA = new Date(ay, am - 1, ad);
  const dateB = new Date(by, bm - 1, bd);
  return Math.round((dateB - dateA) / 86400000);
}

function resolveDailyBloom(settings) {
  const entries = [...(settings.dailyBlooms || [])].sort((a, b) => a.date.localeCompare(b.date));
  const params = new URLSearchParams(window.location.search);
  const previewDay = params.get("day");
  const previewDate = params.get("date") || params.get("preview");
  const today = localDateString();

  if (previewDay) {
    const dayNumber = Number(previewDay);
    if (Number.isInteger(dayNumber) && dayNumber >= 1 && dayNumber <= entries.length) {
      return { status: "active", entry: entries[dayNumber - 1], today, preview: true };
    }
  }

  if (previewDate) {
    const previewEntry = entries.find((entry) => entry.date === previewDate);
    if (previewEntry) return { status: "active", entry: previewEntry, today, preview: true };
  }

  const entry = entries.find((item) => item.date === today);
  if (entry) return { status: "active", entry, today, preview: false };

  const startDate = settings.startDate || entries[0]?.date;
  const endDate = settings.endDate || entries.at(-1)?.date;

  if (startDate && today < startDate) {
    return { status: "before", entry: entries[0], today, startDate, daysLeft: Math.max(0, daysBetween(today, startDate)), preview: false };
  }

  if (endDate && today > endDate) {
    return { status: "active", entry: entries.at(-1), today, endDate, preview: false, afterFinal: true };
  }

  return { status: "gap", entry: null, today, startDate, endDate, preview: false };
}

function mergeConfig(settings, state) {
  const entry = state.entry || {};
  return {
    ...settings,
    ...entry,
    recipientName: settings.recipientName,
    senderName: settings.senderName,
    dailyBlooms: settings.dailyBlooms
  };
}

function svgData(svg) {
  return `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}")`;
}

const pngAssets = {
  flowers: {
    peony: "Peony.png",
    rose: "Rose.png",
    hydrangea: "Hydrangea.png",
    tulip: "Tulip.png",
    meadow: "Sunflower.png",
    bouquet: "Bouquet.png"
  },
  animals: {
    dog: "Golden retriever.png",
    butterfly: "Butterfly.png",
    bee: "Bee.png",
    bird: "Blue bird.png",
    dove: "Seagull.png",
    owl: "Owl.png",
    rabbit: "Bunny.png",
    squirrel: "Squirrel.png",
    hedgehog: "hedgehog.png",
    fox: "Fox.png"
  }
};

function pngData(kind, type) {
  const file = pngAssets[kind]?.[type];
  return file ? `url("Images/${file.replace(/"/g, '\\"')}")` : "";
}

function flowerSvg(type) {
  const palette = {
    peony: ["#ff7ca8", "#ffd1e0", "#ffe17a"],
    tulip: ["#ff7b86", "#ffc8d0", "#ffe27b"],
    hydrangea: ["#8db3ff", "#dce8ff", "#ffe27b"],
    fuchsia: ["#d65fa1", "#ff9ad1", "#7d3f98"],
    meadow: ["#f7c94c", "#fff0af", "#8ecb63"],
    bouquet: ["#f5699b", "#ffd4ea", "#ffdd67"],
    rose: ["#d7192d", "#ff8f98", "#ffd86a"],
    default: ["#f17fab", "#ffd1e6", "#ffe17a"]
  };
  const [a, b, c] = palette[type] || palette.default;

  if (type === "tulip") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <rect width="100" height="120" fill="none"/>
      <path d="M50 112 C51 92 53 77 56 59" stroke="#3E9E60" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M54 82 C71 74 74 63 69 53" stroke="#5EBE76" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M51 23 C42 31 31 35 28 52 C27 70 39 77 50 76 C61 77 73 70 72 52 C69 34 58 30 51 23 Z" fill="${a}"/>
      <path d="M50 24 C48 38 42 50 32 61 C38 69 43 71 50 72 C57 71 62 69 68 61 C58 50 52 38 50 24 Z" fill="${b}" opacity=".95"/>
      <path d="M50 24 C57 34 63 44 67 58 C69 48 70 38 66 30 C62 24 57 22 50 24 Z" fill="${a}" opacity=".95"/>
      <ellipse cx="51" cy="38" rx="7" ry="4" fill="#fff" opacity=".35"/>
    </svg>`;
  }

  if (type === "hydrangea") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <path d="M49 114 C50 94 51 76 52 59" stroke="#4AA15D" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M49 84 C31 72 28 66 27 58" stroke="#70C57A" stroke-width="5" stroke-linecap="round" fill="none"/>
      <circle cx="35" cy="34" r="12" fill="${a}"/><circle cx="50" cy="30" r="13" fill="${a}"/><circle cx="64" cy="35" r="12" fill="${a}"/>
      <circle cx="40" cy="47" r="12" fill="${b}"/><circle cx="54" cy="47" r="14" fill="${a}"/><circle cx="68" cy="49" r="11" fill="${b}"/>
      <circle cx="49" cy="60" r="12" fill="${b}"/><circle cx="33" cy="58" r="10" fill="${a}"/><circle cx="64" cy="61" r="10" fill="${a}"/>
      <circle cx="50" cy="47" r="5" fill="#fff" opacity=".42"/>
    </svg>`;
  }

  if (type === "fuchsia") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <path d="M52 14 C52 42 49 52 44 63" stroke="#5BBE77" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M43 63 C34 74 31 84 33 95" stroke="#5BBE77" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M55 34 C64 34 70 40 71 49" stroke="#5BBE77" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="43" cy="67" rx="11" ry="10" fill="${c}"/>
      <path d="M43 69 C27 72 22 83 25 98 C36 95 43 89 43 69 Z" fill="${a}"/>
      <path d="M43 69 C58 72 63 83 60 98 C49 95 43 89 43 69 Z" fill="${b}"/>
      <ellipse cx="70" cy="52" rx="10" ry="9" fill="${c}"/>
      <path d="M70 54 C55 57 50 68 53 82 C64 79 70 73 70 54 Z" fill="${a}"/>
      <path d="M70 54 C84 57 89 68 87 82 C75 79 70 73 70 54 Z" fill="${b}"/>
    </svg>`;
  }

  if (type === "rose") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <defs>
        <linearGradient id="roseStem" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#5fc45f"/>
          <stop offset="1" stop-color="#207b35"/>
        </linearGradient>
        <radialGradient id="rosePetal" cx=".38" cy=".24" r=".76">
          <stop offset="0" stop-color="#ff685d"/>
          <stop offset=".45" stop-color="#df1e28"/>
          <stop offset="1" stop-color="#970717"/>
        </radialGradient>
      </defs>
      <path d="M50 114 C50 95 50 78 50 63" stroke="url(#roseStem)" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M48 88 C34 88 24 80 20 68" stroke="#329846" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M52 88 C66 88 76 80 80 68" stroke="#329846" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M28 75 C16 77 10 90 17 100 C31 100 41 89 41 78 C36 75 32 74 28 75 Z" fill="#49a83d"/>
      <path d="M72 75 C84 77 90 90 83 100 C69 100 59 89 59 78 C64 75 68 74 72 75 Z" fill="#55b846"/>
      <path d="M25 83 C31 82 36 81 41 78" stroke="#2d8737" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".7"/>
      <path d="M75 83 C69 82 64 81 59 78" stroke="#2d8737" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".7"/>
      <path d="M42 63 L50 78 L58 63 Z" fill="#236f34"/>
      <g transform="translate(50 42)">
        <path d="M0 -35 C-22 -35 -39 -18 -39 7 C-39 30 -22 45 0 47 C22 45 39 30 39 7 C39 -18 22 -35 0 -35 Z" fill="url(#rosePetal)"/>
        <path d="M-34 1 C-32 -26 -9 -41 8 -30 C-8 -17 -14 2 -9 24 C-24 23 -34 15 -34 1 Z" fill="#f02d2e"/>
        <path d="M34 1 C32 -26 9 -41 -8 -30 C8 -17 14 2 9 24 C24 23 34 15 34 1 Z" fill="#b70d1b"/>
        <path d="M-33 12 C-23 -3 -8 -5 2 8 C-7 27 -22 33 -34 23 C-37 18 -37 15 -33 12 Z" fill="#e6222b"/>
        <path d="M33 12 C23 -3 8 -5 -2 8 C7 27 22 33 34 23 C37 18 37 15 33 12 Z" fill="#9c0616"/>
        <path d="M-19 27 C-8 15 8 15 19 27 C13 39 -13 39 -19 27 Z" fill="#c50e20"/>
        <path d="M-18 -10 C-12 -28 10 -31 21 -13 C9 -16 -1 -10 -4 4 C-12 3 -18 -3 -18 -10 Z" fill="#ff4644"/>
        <path d="M18 -12 C9 -27 -13 -24 -18 -5 C-8 -10 1 -7 5 4 C13 1 19 -5 18 -12 Z" fill="#cf1122"/>
        <path d="M-9 -1 C-5 -14 10 -14 15 -5 C20 6 9 17 -4 13 C-15 10 -18 1 -9 -5" fill="none" stroke="#760512" stroke-width="3.3" stroke-linecap="round"/>
        <path d="M-1 -6 C6 -9 12 -4 11 3 C9 9 0 10 -6 4" fill="none" stroke="#ff8780" stroke-width="2.3" stroke-linecap="round" opacity=".92"/>
        <path d="M-24 -23 C-14 -31 2 -33 14 -26" stroke="#ff938a" stroke-width="3" stroke-linecap="round" opacity=".35"/>
      </g>
    </svg>`;
  }

  if (type === "meadow") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <path d="M50 113 C50 97 50 79 50 61" stroke="#53A85B" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M50 70 C68 65 75 58 77 49" stroke="#72C770" stroke-width="5" stroke-linecap="round" fill="none"/>
      <g transform="translate(50 46)">
        ${[0,45,90,135,180,225,270,315].map(a2=>`<ellipse cx="0" cy="-18" rx="8" ry="18" fill="${a}" transform="rotate(${a2})"/>`).join('')}
        <circle cx="0" cy="0" r="10" fill="${c}"/>
      </g>
      <g transform="translate(76 45) scale(.85)">
        ${[0,72,144,216,288].map(a2=>`<ellipse cx="0" cy="-14" rx="6" ry="14" fill="${b}" transform="rotate(${a2})"/>`).join('')}
        <circle cx="0" cy="0" r="8" fill="#ffef91"/>
      </g>
    </svg>`;
  }

  if (type === "bouquet") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <path d="M30 100 C37 89 42 77 45 62" stroke="#4FA35E" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M50 103 C52 86 54 71 55 56" stroke="#4FA35E" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M69 101 C64 87 61 74 60 58" stroke="#4FA35E" stroke-width="5" stroke-linecap="round" fill="none"/>
      <circle cx="30" cy="55" r="14" fill="${a}"/><circle cx="55" cy="50" r="16" fill="${b}"/><circle cx="71" cy="58" r="13" fill="#ffa0c0"/>
      <circle cx="28" cy="54" r="5" fill="${c}"/><circle cx="55" cy="50" r="5" fill="${c}"/><circle cx="71" cy="58" r="4" fill="${c}"/>
      <path d="M43 111 L58 111 L51 120 Z" fill="#C8965A"/>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
    <path d="M50 114 C50 93 50 76 50 60" stroke="#4AA35D" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M48 82 C33 74 28 66 27 56" stroke="#72C875" stroke-width="5" stroke-linecap="round" fill="none"/>
    <g transform="translate(50 46)">
      ${[0,30,60,90,120,150,180,210,240,270,300,330].map(a2=>`<ellipse cx="0" cy="-18" rx="8" ry="18" fill="${a}" transform="rotate(${a2})"/>`).join('')}
      ${[15,75,135,195,255,315].map(a2=>`<ellipse cx="0" cy="-12" rx="6" ry="12" fill="${b}" transform="rotate(${a2})"/>`).join('')}
      <circle cx="0" cy="0" r="11" fill="${c}"/>
    </g>
  </svg>`;
}

function animalSvg(type, variant = "ground") {
  if (type === "bird") {
    if (variant === "air") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 100">
        <path d="M49 51 C37 23 17 15 7 32 C18 43 33 51 52 57 Z" fill="#5C91D6"/>
        <path d="M51 62 C34 62 19 73 10 88 C30 87 44 79 56 65 Z" fill="#4C86CF"/>
        <path d="M20 61 L5 50 L10 72 Z" fill="#4D88D4"/>
        <ellipse cx="55" cy="62" rx="36" ry="20" fill="#89C0FF"/>
        <circle cx="82" cy="49" r="16" fill="#89C0FF"/>
        <path d="M80 40 C87 34 96 36 100 44 C91 43 85 45 80 52 Z" fill="#A9D2FF"/>
        <path d="M97 50 L109 56 L97 62 Z" fill="#F4BD5E"/>
        <circle cx="88" cy="47" r="2.6" fill="#293245"/>
        <path d="M42 80 L39 91" stroke="#A86442" stroke-width="3" stroke-linecap="round"/>
        <path d="M58 81 L59 92" stroke="#A86442" stroke-width="3" stroke-linecap="round"/>
      </svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M18 64 L5 55 L12 72 Z" fill="#4D88D4"/>
      <ellipse cx="47" cy="65" rx="30" ry="17" fill="#89C0FF"/>
      <circle cx="73" cy="53" r="15" fill="#89C0FF"/>
      <path d="M38 60 C48 49 62 51 69 60 C56 62 47 68 38 75 Z" fill="#5C91D6"/>
      <path d="M72 44 C78 38 88 40 92 48 C84 47 78 50 73 58 Z" fill="#A9D2FF"/>
      <path d="M90 52 L101 57 L90 62 Z" fill="#F4BD5E"/>
      <circle cx="82" cy="50" r="2.4" fill="#293245"/>
      <path d="M43 79 L41 90" stroke="#A86442" stroke-width="3" stroke-linecap="round"/>
      <path d="M55 79 L56 90" stroke="#A86442" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  if (type === "dove") {
    if (variant === "air") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 100">
        <path d="M51 50 C39 24 20 17 10 34 C22 45 36 51 53 57 Z" fill="#E7F2FF"/>
        <path d="M52 62 C35 63 21 73 12 88 C31 87 46 79 57 65 Z" fill="#D8E9FA"/>
        <path d="M20 61 L7 52 L12 71 Z" fill="#D8E9FA"/>
        <ellipse cx="55" cy="62" rx="35" ry="19" fill="#FFFFFF"/>
        <circle cx="81" cy="50" r="16" fill="#FFFFFF"/>
        <path d="M78 41 C85 35 94 37 99 45 C90 44 84 46 79 53 Z" fill="#F8FCFF"/>
        <path d="M97 51 L108 56 L97 62 Z" fill="#F4BD5E"/>
        <circle cx="88" cy="48" r="2.4" fill="#3A3A48"/>
      </svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M18 63 L6 54 L12 70 Z" fill="#D8E9FA"/>
      <ellipse cx="47" cy="64" rx="30" ry="17" fill="#FFFFFF"/>
      <circle cx="73" cy="52" r="15" fill="#FFFFFF"/>
      <path d="M39 58 C49 47 62 50 69 59 C57 61 47 67 39 74 Z" fill="#E7F2FF"/>
      <path d="M72 43 C78 38 87 40 91 47 C84 47 78 50 73 57 Z" fill="#F8FCFF"/>
      <path d="M89 51 L100 56 L89 61 Z" fill="#F4BD5E"/>
      <circle cx="82" cy="49" r="2.3" fill="#3A3A48"/>
    </svg>`;
  }

  const svgs = {
    dog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110">
      <path d="M104 63 C113 43 130 39 135 53 C126 55 117 63 112 76" stroke="#D99432" stroke-width="12" stroke-linecap="round" fill="none"/>
      <ellipse cx="79" cy="72" rx="41" ry="24" fill="#EAB45D"/>
      <path d="M47 61 C58 82 82 90 103 79 C93 98 55 99 38 79 C31 70 36 62 47 61 Z" fill="#D5983E" opacity=".42"/>
      <circle cx="43" cy="47" r="25" fill="#F0BE68"/>
      <path d="M22 39 C10 48 10 68 25 77 C37 67 37 49 28 36 Z" fill="#C8842F"/>
      <path d="M63 38 C76 47 77 66 64 77 C53 67 54 49 60 36 Z" fill="#C8842F"/>
      <ellipse cx="39" cy="57" rx="17" ry="12" fill="#FFF1D8"/>
      <path d="M41 64 C48 75 62 80 74 73 C66 86 47 87 35 70 Z" fill="#FFF1D8" opacity=".78"/>
      <circle cx="33" cy="45" r="3.2" fill="#33251E"/>
      <circle cx="52" cy="45" r="3.2" fill="#33251E"/>
      <ellipse cx="40" cy="56" rx="5.5" ry="4" fill="#30221C"/>
      <path d="M36 64 C40 68 46 68 50 64" stroke="#7A4232" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M42 67 C42 72 45 74 49 70" fill="#F48A91"/>
      <path d="M47 84 L56 84 L54 103 L46 103 Z" fill="#D99A3E"/>
      <path d="M63 85 L72 85 L70 102 L62 102 Z" fill="#D99A3E"/>
      <path d="M88 85 L97 85 L95 102 L87 102 Z" fill="#D99A3E"/>
      <path d="M104 82 L113 82 L111 103 L103 103 Z" fill="#D99A3E"/>
      <ellipse cx="51" cy="102" rx="8" ry="4" fill="#C8842F"/>
      <ellipse cx="91" cy="102" rx="8" ry="4" fill="#C8842F"/>
    </svg>`,
    butterfly: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M48 27 C31 4 13 17 18 39 C21 54 34 58 48 48 Z" fill="#FF8AB6"/>
      <path d="M52 27 C69 4 87 17 82 39 C79 54 66 58 52 48 Z" fill="#8DA3FF"/>
      <path d="M48 52 C31 50 21 63 27 80 C34 94 48 81 49 59 Z" fill="#FFD56E"/>
      <path d="M52 52 C69 50 79 63 73 80 C66 94 52 81 51 59 Z" fill="#C397FF"/>
      <ellipse cx="50" cy="52" rx="5" ry="27" fill="#4D2F52"/>
      <circle cx="50" cy="24" r="5" fill="#4D2F52"/>
      <path d="M49 23 C43 13 37 9 30 8" stroke="#4D2F52" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M51 23 C57 13 63 9 70 8" stroke="#4D2F52" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <circle cx="29" cy="34" r="3" fill="#fff" opacity=".45"/>
      <circle cx="71" cy="34" r="3" fill="#fff" opacity=".45"/>
    </svg>`,
    bee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="56" cy="58" rx="29" ry="17" fill="#F8C744"/>
      <path d="M32 44 C43 39 66 39 82 52 C76 42 62 34 47 36 C38 37 32 40 32 44 Z" fill="#FFD96A"/>
      <ellipse cx="39" cy="38" rx="16" ry="10" fill="#DDF2FF" opacity=".88" transform="rotate(-21 39 38)"/>
      <ellipse cx="65" cy="37" rx="16" ry="10" fill="#DDF2FF" opacity=".88" transform="rotate(20 65 37)"/>
      <path d="M41 43 C38 51 38 62 42 71" stroke="#2E2729" stroke-width="6" stroke-linecap="round"/>
      <path d="M56 40 C53 50 53 65 58 76" stroke="#2E2729" stroke-width="6" stroke-linecap="round"/>
      <path d="M71 45 C69 53 69 63 73 70" stroke="#2E2729" stroke-width="5" stroke-linecap="round"/>
      <circle cx="27" cy="57" r="10" fill="#2E2729"/>
      <circle cx="24" cy="54" r="1.9" fill="#fff"/>
      <circle cx="31" cy="54" r="1.9" fill="#fff"/>
      <path d="M21 50 C15 43 13 38 11 32" stroke="#2E2729" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M32 49 C35 42 38 37 43 32" stroke="#2E2729" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M83 58 L93 53 L90 62 Z" fill="#2E2729"/>
    </svg>`,
    bird: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M22 62 C35 42 58 39 72 51 C83 60 78 75 59 78 C42 81 29 73 22 62 Z" fill="#89C0FF"/>
      <path d="M65 48 C69 39 80 38 86 45 C80 47 76 51 74 57 Z" fill="#89C0FF"/>
      <path d="M21 62 L7 53 L14 69 Z" fill="#5C91D6"/>
      <path d="M40 59 C50 48 63 50 70 59 C58 60 49 66 40 73 Z" fill="#5C91D6"/>
      <path d="M85 48 L96 53 L84 58 Z" fill="#F4BD5E"/>
      <circle cx="78" cy="46" r="2.4" fill="#293245"/>
      <path d="M45 78 L43 89" stroke="#A86442" stroke-width="3" stroke-linecap="round"/>
      <path d="M55 78 L56 89" stroke="#A86442" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    rabbit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <ellipse cx="46" cy="66" rx="28" ry="18" fill="#F7F2F3"/>
      <circle cx="68" cy="49" r="15" fill="#F7F2F3"/>
      <path d="M61 38 C54 21 55 7 63 6 C72 8 70 27 66 41 Z" fill="#F7F2F3"/>
      <path d="M74 39 C71 20 75 7 83 9 C91 14 83 31 77 43 Z" fill="#F7F2F3"/>
      <path d="M63 36 C59 22 60 12 64 11 C68 13 67 27 65 37 Z" fill="#FFC9DA"/>
      <path d="M76 37 C75 23 78 15 82 15 C85 19 81 30 78 39 Z" fill="#FFC9DA"/>
      <circle cx="72" cy="47" r="2.2" fill="#454454"/>
      <circle cx="80" cy="53" r="2.6" fill="#FF9AAE"/>
      <circle cx="21" cy="68" r="7" fill="#fff"/>
      <path d="M41 78 C35 84 25 84 19 80" stroke="#E6DDDF" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M56 78 C62 85 73 84 78 79" stroke="#E6DDDF" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`,
    squirrel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110">
      <path d="M36 82 C20 80 9 66 12 48 C15 28 32 14 50 19 C66 24 70 43 58 55 C49 64 35 62 31 50 C43 52 52 45 50 35 C48 25 35 24 28 34 C19 48 26 65 43 68 C50 69 56 66 60 62 C62 74 52 86 36 82 Z" fill="#C96F2F"/>
      <path d="M34 70 C21 63 20 45 31 35 C40 27 51 30 51 40 C51 49 43 55 34 53" fill="none" stroke="#F3AD62" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="62" cy="75" rx="25" ry="19" fill="#E58B3B"/>
      <ellipse cx="64" cy="79" rx="15" ry="13" fill="#F7C27C"/>
      <circle cx="78" cy="52" r="17" fill="#E58B3B"/>
      <path d="M66 43 L73 28 L81 43 Z" fill="#C96F2F"/>
      <path d="M82 43 L91 30 L93 49 Z" fill="#C96F2F"/>
      <path d="M71 44 L74 36 L79 44 Z" fill="#F5B774"/>
      <path d="M85 45 L90 37 L91 48 Z" fill="#F5B774"/>
      <circle cx="84" cy="50" r="2.7" fill="#35251F"/>
      <path d="M89 56 C96 57 100 60 99 64 C94 67 88 64 86 59 Z" fill="#F3BF67"/>
      <circle cx="98" cy="62" r="2.8" fill="#35251F"/>
      <path d="M59 62 C53 66 52 73 57 77" stroke="#B85F2B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M50 87 L45 99" stroke="#A95728" stroke-width="5" stroke-linecap="round"/>
      <path d="M69 87 L74 99" stroke="#A95728" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="46" cy="99" rx="8" ry="4" fill="#8E4924"/>
      <ellipse cx="75" cy="99" rx="8" ry="4" fill="#8E4924"/>
    </svg>`,
    hedgehog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100">
      <path d="M13 62 C14 39 34 23 58 24 C75 25 88 36 91 53 C78 51 66 55 56 64 C43 75 24 75 13 62 Z" fill="#5D4337"/>
      <path d="M18 58 L23 38 L30 58 L37 34 L44 57 L52 31 L59 57 L67 35 L73 57 L84 43 L84 61 Z" fill="#8C6A54"/>
      <path d="M19 61 C30 50 48 50 62 62 C54 76 32 79 19 68 Z" fill="#B98966"/>
      <path d="M62 57 C75 53 91 60 98 70 C90 81 73 78 62 66 Z" fill="#C99A75"/>
      <path d="M88 65 C94 64 100 67 101 70 C98 74 92 75 88 72 Z" fill="#D7AA84"/>
      <circle cx="79" cy="62" r="2.6" fill="#2E2726"/>
      <circle cx="101" cy="70" r="3.3" fill="#2E2726"/>
      <path d="M31 75 L28 86" stroke="#7F5D48" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M50 76 L54 87" stroke="#7F5D48" stroke-width="4.5" stroke-linecap="round"/>
      <ellipse cx="28" cy="87" rx="6" ry="3" fill="#6F4F3D"/>
      <ellipse cx="55" cy="88" rx="6" ry="3" fill="#6F4F3D"/>
      <path d="M22 53 L28 47 M34 50 L40 44 M49 49 L55 42 M63 50 L69 45" stroke="#3E2D27" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    </svg>`,
    fox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M21 48 L29 14 L49 37 Z" fill="#EF7E24"/>
      <path d="M79 48 L71 14 L51 37 Z" fill="#EF7E24"/>
      <path d="M29 39 L33 24 L43 39 Z" fill="#6E3324"/>
      <path d="M71 39 L67 24 L57 39 Z" fill="#6E3324"/>
      <path d="M18 49 C18 31 32 24 50 30 C68 24 82 31 82 49 C82 72 66 88 50 89 C34 88 18 72 18 49 Z" fill="#F28A2E"/>
      <path d="M18 52 C24 66 35 80 50 89 C47 71 38 56 21 47 Z" fill="#FFF3E7"/>
      <path d="M82 52 C76 66 65 80 50 89 C53 71 62 56 79 47 Z" fill="#FFF3E7"/>
      <path d="M35 60 C39 52 61 52 65 60 C64 74 57 83 50 87 C43 83 36 74 35 60 Z" fill="#FFE7D2"/>
      <circle cx="40" cy="50" r="3.2" fill="#2C211E"/>
      <circle cx="60" cy="50" r="3.2" fill="#2C211E"/>
      <path d="M45 66 C47 62 53 62 55 66 C53 70 47 70 45 66 Z" fill="#2C211E"/>
      <path d="M50 69 C49 73 46 75 42 74 M50 69 C51 73 54 75 58 74" stroke="#7A3D33" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <path d="M31 42 C35 37 42 36 47 40" stroke="#FFB26B" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>
      <path d="M69 42 C65 37 58 36 53 40" stroke="#FFB26B" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>
    </svg>`,
    owl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 100">
      <path d="M35 47 C23 34 9 36 5 51 C12 64 25 72 42 73 Z" fill="#8B624A"/>
      <path d="M77 47 C89 34 103 36 107 51 C100 64 87 72 70 73 Z" fill="#8B624A"/>
      <path d="M34 43 C34 24 49 20 56 32 C63 20 78 24 78 43 C88 53 86 81 56 87 C26 81 24 53 34 43 Z" fill="#A07C63"/>
      <path d="M35 51 C42 65 48 75 56 80 C48 78 37 74 29 63 Z" fill="#7E5A45"/>
      <path d="M77 51 C70 65 64 75 56 80 C64 78 75 74 83 63 Z" fill="#7E5A45"/>
      <circle cx="47" cy="52" r="10" fill="#FFF9F4"/>
      <circle cx="66" cy="52" r="10" fill="#FFF9F4"/>
      <circle cx="47" cy="52" r="4" fill="#43312C"/>
      <circle cx="66" cy="52" r="4" fill="#43312C"/>
      <path d="M56 59 L63 68 L49 68 Z" fill="#F4BD5E"/>
      <path d="M41 38 L48 26 L53 41 Z" fill="#7A533E"/>
      <path d="M59 41 L65 26 L72 38 Z" fill="#7A533E"/>
      <path d="M48 84 L46 93" stroke="#A55F3A" stroke-width="3" stroke-linecap="round"/>
      <path d="M64 84 L66 93" stroke="#A55F3A" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    dove: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M16 61 C30 38 54 35 70 45 C83 54 80 72 58 76 C42 79 27 72 16 61 Z" fill="#FFFFFF"/>
      <path d="M33 58 C42 43 55 40 68 46 C55 51 45 58 33 66 Z" fill="#E7F2FF"/>
      <path d="M17 60 L6 52 L12 68 Z" fill="#E7F2FF"/>
      <path d="M68 45 C72 38 82 39 87 46 C80 48 76 52 74 58 Z" fill="#FFFFFF"/>
      <path d="M86 49 L97 54 L86 59 Z" fill="#F4BD5E"/>
      <circle cx="80" cy="46" r="2.2" fill="#3A3A48"/>
    </svg>`
  };
  return svgs[type] || svgs.butterfly;
}

function normalizeAnimalType(value) {
  const map = {
    "🦮": "dog", "🐕": "dog", "🐾": "dog",
    "🦋": "butterfly", "🐝": "bee",
    "🐦": "bird", "🕊️": "dove", "🕊": "dove", "🦉": "owl",
    "🐇": "rabbit", "🐿️": "squirrel", "🐿": "squirrel",
    "🦔": "hedgehog", "🦊": "fox", "🐢": "turtle"
  };
  const key = String(value || "").trim().toLowerCase();
  return map[value] || map[key] || key || "butterfly";
}

function normalizeFlowerType(value) {
  const map = {
    "🌸": "peony", "🌷": "tulip", "🌺": "fuchsia", "💐": "bouquet", "🌼": "meadow", "🌻": "meadow", "🪻": "hydrangea", "🌹": "rose", "💮": "hydrangea"
  };
  const key = String(value || "").trim().toLowerCase();
  return map[value] || map[key] || key || "peony";
}

function getEntryFlowerType(entry, index = 0) {
  return entry.flowerType || normalizeFlowerType(entry.smallFlowers?.[0]) || ["peony", "rose", "hydrangea", "tulip", "meadow", "bouquet"][index % 6];
}

function flowerDisplayName(type) {
  const names = {
    peony: "peony",
    tulip: "tulip",
    hydrangea: "hydrangea",
    fuchsia: "fuchsia",
    meadow: "meadow bloom",
    bouquet: "bouquet",
    rose: "rose"
  };
  return names[type] || "flower";
}

function flowerFactText(type) {
  const fact = flowerFacts[type] || flowerFacts.peony;
  return `${fact.title}: ${fact.info} Fun fact: ${fact.fact}`;
}

function flowerInfoText(type) {
  const fact = flowerFacts[type] || flowerFacts.peony;
  return `${fact.title}: ${fact.info}`;
}

function flowerFunFactText(type) {
  const fact = flowerFacts[type] || flowerFacts.peony;
  return `Fun fact: ${fact.fact}`;
}

function mountTapHint() {
  const hint = document.getElementById("tapHint");
  const row = document.getElementById("hintRow");
  if (hint && row && hint.parentElement !== row) {
    row.appendChild(hint);
  }
}

function setFlowerSideNotes(type) {
  safeText("flowerInfo", flowerInfoText(type));
  safeText("flowerFunFact", flowerFunFactText(type));
}

function localMidnight(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function nextEntryAfter(dateString) {
  return allEntries.find((entry) => entry.date > dateString) || null;
}

function timerTarget() {
  if (!allEntries.length) return null;
  if (dateState.preview && config?.date) return nextEntryAfter(config.date);
  if (dateState.status === "before") return allEntries[0];
  if (dateState.status === "gap") return nextEntryAfter(dateState.today);
  if (dateState.status === "active") return nextEntryAfter(dateState.today);
  return null;
}

function updateOpenTimer() {
  const timer = document.getElementById("openTimer");
  if (!timer) return;

  const target = timerTarget();
  if (!target) {
    timer.textContent = dateState.status === "after" ? "All blooms are open." : dateState.status === "active" ? "The final bloom is open." : "";
    return;
  }

  const diff = localMidnight(target.date) - new Date();
  if (diff <= 0 && !dateState.preview) {
    timer.textContent = "A bloom is ready now.";
    return;
  }

  const prefix = dateState.status === "active" ? "Next bloom opens in" : "Opens in";
  timer.textContent = `${prefix} ${formatDuration(diff)}`;
}

function startOpenTimer() {
  window.clearInterval(timerInterval);
  updateOpenTimer();
  timerInterval = window.setInterval(updateOpenTimer, 1000);
}

function createIllustratedFlower(type, className = "flower-asset") {
  const asset = document.createElement("span");
  asset.className = className;
  asset.style.backgroundImage = pngData("flowers", type) || svgData(flowerSvg(type));
  asset.setAttribute("aria-hidden", "true");
  return asset;
}

function createIllustratedAnimal(type, className = "animal-asset", variant = "ground") {
  const asset = document.createElement("span");
  asset.className = className;
  asset.style.backgroundImage = pngData("animals", type) || svgData(animalSvg(type, variant));
  asset.setAttribute("aria-hidden", "true");
  return asset;
}

function visibleGrassFlowerTypes() {
  const unlockedCount = getUnlockedCount();
  const finalIndex = Math.max(0, allEntries.length - 1);
  const unlockedTypes = allEntries
    .slice(0, unlockedCount)
    .filter((_, index) => index !== finalIndex)
    .map((entry, index) => normalizeFlowerType(getEntryFlowerType(entry, index)))
    .filter(Boolean);

  const fallback = (config.smallFlowers?.length ? config.smallFlowers : ["peony", "tulip", "hydrangea", "meadow"])
    .map(normalizeFlowerType)
    .filter((type) => type !== normalizeFlowerType(getEntryFlowerType(allEntries[finalIndex] || {}, finalIndex)));

  const uniqueTypes = [...new Set(unlockedTypes.length ? unlockedTypes : fallback)];
  return uniqueTypes.length ? uniqueTypes : ["peony", "rose", "hydrangea", "tulip", "meadow"];
}

function createSmallFlowers() {
  const layer = document.getElementById("backgroundFlowers");
  const flowers = visibleGrassFlowerTypes();
  const compact = isCompactViewport();
  const count = compact ? 15 : 28;

  layer.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const flower = document.createElement("span");
    flower.className = "small-flower small-flower--illustrated";
    flower.style.setProperty("--left", `${random(-3, 98).toFixed(1)}%`);
    flower.style.setProperty("--bottom", `${random(0, compact ? 14 : 18).toFixed(1)}%`);
    flower.style.setProperty("--size", `${random(compact ? 30 : 40, compact ? 54 : 82).toFixed(0)}px`);
    flower.style.setProperty("--stem-height", `${random(18, compact ? 42 : 66).toFixed(0)}px`);
    flower.style.setProperty("--delay", `${random(0, 3.6).toFixed(2)}s`);
    flower.style.setProperty("--z", `${Math.round(random(2, 9))}`);
    flower.appendChild(createIllustratedFlower(flowers[i % flowers.length]));
    layer.appendChild(flower);
  }
}

function classifyAnimal(type) {
  if (["butterfly", "bee"].includes(type)) return "butterfly";
  if (["bird", "dove", "owl"].includes(type)) return "bird";
  return "ground";
}

function animalPlacementCandidates(airborne) {
  const compact = isCompactViewport();

  if (airborne) {
    if (compact) {
      return [
        { left: 3, bottom: 70 }, { left: 82, bottom: 70 },
        { left: 12, bottom: 55 }, { left: 74, bottom: 55 },
        { left: 36, bottom: 78 }, { left: 58, bottom: 76 }
      ];
    }

    return [
      { left: -3, bottom: 72 }, { left: 93, bottom: 72 },
      { left: 6, bottom: 70 }, { left: 86, bottom: 70 },
      { left: 23, bottom: 82 }, { left: 66, bottom: 82 },
      { left: -2, bottom: 58 }, { left: 92, bottom: 58 },
      { left: 33, bottom: 86 }, { left: 56, bottom: 86 },
      { left: 10, bottom: 48 }, { left: 82, bottom: 48 }
    ];
  }

  if (compact) {
    return [
      { left: 2, bottom: 9 }, { left: 78, bottom: 9 },
      { left: 17, bottom: 6 }, { left: 60, bottom: 6 },
      { left: 6, bottom: 15 }, { left: 84, bottom: 15 }
    ];
  }

  return [
    { left: 4, bottom: 11 }, { left: 86, bottom: 11 },
    { left: 14, bottom: 15 }, { left: 76, bottom: 15 },
    { left: 25, bottom: 9 }, { left: 66, bottom: 9 },
    { left: 7, bottom: 6 }, { left: 91, bottom: 6 }
  ];
}

function inflatedRect(rect, pad) {
  return {
    left: rect.left - pad,
    right: rect.right + pad,
    top: rect.top - pad,
    bottom: rect.bottom + pad
  };
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function animalRectForPlacement(candidate, size, gardenRect) {
  const left = gardenRect.left + (candidate.left / 100) * gardenRect.width;
  const bottomOffset = (candidate.bottom / 100) * gardenRect.height;
  const top = gardenRect.bottom - bottomOffset - size;
  return {
    left,
    right: left + size,
    top,
    bottom: top + size
  };
}

function animalForbiddenRects() {
  const selectors = [
    "button",
    ".flower-sticky-note:not(:empty)",
    ".date-badge",
    ".open-timer:not(:empty)",
    ".tap-hint",
    ".flower-head"
  ];
  const rects = selectors
    .flatMap((selector) => [...document.querySelectorAll(selector)])
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect && rect.width > 0 && rect.height > 0)
    .map((rect) => inflatedRect(rect, 24));

  const wrapRect = document.getElementById("mainFlowerWrap")?.getBoundingClientRect();
  if (wrapRect && wrapRect.width && wrapRect.height) {
    rects.push(inflatedRect({
      left: wrapRect.left + wrapRect.width * .2,
      right: wrapRect.right - wrapRect.width * .2,
      top: wrapRect.top + wrapRect.height * .05,
      bottom: wrapRect.top + wrapRect.height * .82
    }, 10));
  }

  return rects;
}

function pickAnimalPlacement(index, airborne, size, placedRects, forbiddenRects) {
  const gardenRect = document.querySelector(".garden")?.getBoundingClientRect();
  const candidates = animalPlacementCandidates(airborne);
  if (!gardenRect || !gardenRect.width || !gardenRect.height) return candidates[index % candidates.length];

  const ordered = candidates.slice(index % candidates.length).concat(candidates.slice(0, index % candidates.length));
  const safe = ordered.find((candidate) => {
    const rect = animalRectForPlacement(candidate, size, gardenRect);
    return !forbiddenRects.some((blocked) => rectsOverlap(rect, blocked))
      && !placedRects.some((placed) => rectsOverlap(rect, inflatedRect(placed, 10)));
  });

  if (!safe && airborne) return null;

  const chosen = safe || ordered[0];
  placedRects.push(animalRectForPlacement(chosen, size, gardenRect));
  return chosen;
}

function createAnimals() {
  const layer = document.getElementById("animalLayer");
  const animals = (config.animals?.length ? config.animals : ["dog", "butterfly", "bee", "bird", "rabbit", "squirrel"])
    .map(normalizeAnimalType)
    .filter((animalType) => animalType && animalType !== "turtle");
  const compact = isCompactViewport();
  const maxCount = compact ? ["grandFinale", "memoryBouquet"].includes(config.bloomStyle) ? 5 : 4 : ["grandFinale", "memoryBouquet"].includes(config.bloomStyle) ? 8 : 6;
  const count = Math.min(animals.length, maxCount);
  const used = [...animals].sort(() => Math.random() - 0.5).slice(0, count);
  const categoryTotals = used.reduce((totals, animalType) => {
    const key = classifyAnimal(animalType) === "ground" ? "ground" : "air";
    totals[key] += 1;
    return totals;
  }, { ground: 0, air: 0 });
  const categoryIndex = { ground: 0, air: 0 };
  const placedRects = [];
  const forbiddenRects = animalForbiddenRects();

  layer.innerHTML = "";
  used.forEach((animalType, index) => {
    const animal = document.createElement("span");
    const className = classifyAnimal(animalType);
    animal.className = `animal animal--illustrated ${className} animal-${animalType}`;
    const airborne = className !== "ground";
    const category = airborne ? "air" : "ground";
    const slotIndex = categoryIndex[category];
    categoryIndex[category] += 1;
    const maxGroundSize = compact ? animalType === "dog" ? 68 : animalType === "fox" ? 70 : 60 : animalType === "dog" ? 96 : animalType === "fox" ? 98 : 82;
    const minSize = compact ? animalType === "fox" ? 48 : 36 : animalType === "fox" ? 66 : 48;
    const size = Number(random(minSize, airborne ? compact ? 56 : 78 : maxGroundSize).toFixed(0));
    const placement = pickAnimalPlacement(slotIndex, airborne, size, placedRects, forbiddenRects);
    if (!placement) return;
    animal.style.setProperty("--left", `${placement.left.toFixed(1)}%`);
    animal.style.setProperty("--bottom", `${placement.bottom.toFixed(1)}%`);
    animal.style.setProperty("--size", `${size}px`);
    animal.style.setProperty("--delay", `${(1.1 + index * random(.4, .85)).toFixed(2)}s`);
    animal.style.setProperty("--travel", `${Math.random() > .5 ? random(compact ? -74 : -120, compact ? -42 : -70) : random(compact ? 42 : 70, compact ? 74 : 120)}px`);
    animal.style.setProperty("--face", placement.left > 50 ? -1 : 1);
    animal.style.setProperty("--z", `${Math.round(random(8, 14))}`);
    animal.appendChild(createIllustratedAnimal(animalType, "animal-asset", airborne ? "air" : "ground"));
    layer.appendChild(animal);
  });
}

function makeParticle(layer, className, text, cssVars = {}) {
  const particle = document.createElement("span");
  particle.className = className;
  particle.textContent = text;
  Object.entries(cssVars).forEach(([key, value]) => particle.style.setProperty(key, value));
  layer.appendChild(particle);
  return particle;
}

function haloPosition(index, total, minRadiusX, maxRadiusX, minRadiusY, maxRadiusY) {
  const garden = document.querySelector(".garden");
  const flower = document.getElementById("mainFlowerWrap");
  const gardenRect = garden?.getBoundingClientRect();
  const flowerRect = flower?.getBoundingClientRect();

  let centerX = 50;
  let centerY = 45;

  if (gardenRect && flowerRect && gardenRect.width && gardenRect.height) {
    centerX = ((flowerRect.left + flowerRect.width / 2 - gardenRect.left) / gardenRect.width) * 100;
    // Aim around the flower head, not the message area or whole flower stem.
    centerY = ((flowerRect.top + flowerRect.height * 0.28 - gardenRect.top) / gardenRect.height) * 100;
  }

  const baseAngle = (index / total) * Math.PI * 2;
  const angle = baseAngle + random(-0.18, 0.18);
  const radiusX = random(minRadiusX, maxRadiusX);
  const radiusY = random(minRadiusY, maxRadiusY);

  return {
    left: `${Math.max(4, Math.min(96, centerX + Math.cos(angle) * radiusX)).toFixed(1)}%`,
    top: `${Math.max(6, Math.min(78, centerY + Math.sin(angle) * radiusY)).toFixed(1)}%`
  };
}


function upperHaloPosition(index, total, minRadiusX, maxRadiusX, minRadiusY, maxRadiusY) {
  const garden = document.querySelector(".garden");
  const flower = document.getElementById("mainFlowerWrap");
  const gardenRect = garden?.getBoundingClientRect();
  const flowerRect = flower?.getBoundingClientRect();

  let centerX = 50;
  let flowerStartY = 30;

  if (gardenRect && flowerRect && gardenRect.width && gardenRect.height) {
    centerX = ((flowerRect.left + flowerRect.width / 2 - gardenRect.left) / gardenRect.width) * 100;
    // This is the horizontal line where the visible flower head starts.
    // All stars/motes created with this helper stay above that line.
    flowerStartY = ((flowerRect.top + flowerRect.height * 0.08 - gardenRect.top) / gardenRect.height) * 100;
  }

  // Top half arc only: no particles below the flower-start line.
  const arcStart = Math.PI + 0.12;
  const arcEnd = Math.PI * 2 - 0.12;
  const angle = arcStart + (index / Math.max(1, total - 1)) * (arcEnd - arcStart) + random(-0.08, 0.08);
  const radiusX = random(minRadiusX, maxRadiusX);
  const radiusY = random(minRadiusY, maxRadiusY);
  const top = Math.min(flowerStartY - 1.4, flowerStartY + Math.sin(angle) * radiusY);

  return {
    left: `${Math.max(5, Math.min(95, centerX + Math.cos(angle) * radiusX)).toFixed(1)}%`,
    top: `${Math.max(5, Math.min(58, top)).toFixed(1)}%`
  };
}

function createAmbientMagic() {
  const layer = document.getElementById("magicLayer");
  if (!layer) return;
  layer.innerHTML = "";

  const style = config.bloomStyle;
  if (style !== "tulipMoonrise") return;

  const ambientCount = 24;

  if (["fireflyGlow", "moonlight", "birdCircle", "grandFinale"].includes(style)) {
    for (let i = 0; i < ambientCount; i += 1) {
      makeParticle(layer, "magic ambient-glow", pick(["✦", "·", "❋"]), {
        "--left": `${random(3, 96).toFixed(1)}%`,
        "--top": `${random(5, 62).toFixed(1)}%`,
        "--size": `${random(9, 22).toFixed(0)}px`,
        "--delay": `${random(0, 4).toFixed(2)}s`,
        "--duration": `${random(3.2, 6.4).toFixed(2)}s`
      });
    }
  }

  if (style === "hydrangeaFirefly") {
    for (let i = 0; i < 24; i += 1) {
      const position = haloPosition(i, 24, 23, 39, 14, 25);
      makeParticle(layer, "magic hydrangea-orbit-spark", "", {
        "--left": position.left,
        "--top": position.top,
        "--size": `${random(8, 18).toFixed(0)}px`,
        "--delay": `${random(0, 4.6).toFixed(2)}s`,
        "--duration": `${random(4.6, 8.2).toFixed(2)}s`
      });
    }
  }

  if (style === "tulipMoonrise") {
    for (let i = 0; i < ambientCount; i += 1) {
      const position = upperHaloPosition(i, ambientCount, 19, 36, 20, 33);
      makeParticle(layer, "magic moon-mote", "", {
        "--left": position.left,
        "--top": position.top,
        "--size": `${random(8, 18).toFixed(0)}px`,
        "--delay": `${random(0, 5.8).toFixed(2)}s`,
        "--duration": `${random(7.2, 12.4).toFixed(2)}s`
      });
    }
  }

  if (style === "sunflowerBeeDance") {
    for (let i = 0; i < 28; i += 1) {
      const position = haloPosition(i, 28, 16, 36, 9, 23);
      makeParticle(layer, "magic sunflower-orbit-pollen", "", {
        "--left": position.left,
        "--top": position.top,
        "--size": `${random(7, 17).toFixed(0)}px`,
        "--delay": `${random(0, 4.1).toFixed(2)}s`,
        "--duration": `${random(3.8, 6.8).toFixed(2)}s`
      });
    }
  }

  if (style === "belgiumFinale") {
    for (let i = 0; i < 34; i += 1) {
      const position = haloPosition(i, 34, 18, 42, 10, 28);
      makeParticle(layer, "magic finale-heart-orbit", "", {
        "--left": position.left,
        "--top": position.top,
        "--size": `${random(7, 16).toFixed(0)}px`,
        "--delay": `${random(0, 4.8).toFixed(2)}s`,
        "--duration": `${random(4.2, 7.8).toFixed(2)}s`
      });
    }

    for (let i = 0; i < 10; i += 1) {
      const position = haloPosition(i, 10, 22, 44, 12, 30);
      makeParticle(layer, "magic finale-ribbon-ambient", "", {
        "--left": position.left,
        "--top": position.top,
        "--size": `${random(40, 72).toFixed(0)}px`,
        "--delay": `${random(0, 4.5).toFixed(2)}s`,
        "--duration": `${random(6.2, 9.8).toFixed(2)}s`
      });
    }
  }


  if (style === "beeDance") {
    for (let i = 0; i < 18; i += 1) {
      makeParticle(layer, "magic pollen-dot", "•", {
        "--left": `${random(8, 92).toFixed(1)}%`,
        "--top": `${random(18, 74).toFixed(1)}%`,
        "--size": `${random(14, 26).toFixed(0)}px`,
        "--delay": `${random(0, 4).toFixed(2)}s`
      });
    }
  }
  if (style === "peonyUnfurl") {
    for (let i = 0; i < 16; i += 1) {
      makeParticle(layer, "magic peony-mote", "", {
        "--left": `${random(28, 72).toFixed(1)}%`,
        "--top": `${random(18, 56).toFixed(1)}%`,
        "--size": `${random(5, 12).toFixed(0)}px`,
        "--delay": `${random(0, 3.5).toFixed(2)}s`,
        "--duration": `${random(3.4, 5.8).toFixed(2)}s`
      });
    }
  }

  if (style === "roseSpiral") {
    for (let i = 0; i < 18; i += 1) {
      makeParticle(layer, "magic rose-mote", "", {
        "--left": `${random(18, 82).toFixed(1)}%`,
        "--top": `${random(14, 62).toFixed(1)}%`,
        "--size": `${random(7, 15).toFixed(0)}px`,
        "--delay": `${random(0, 3.6).toFixed(2)}s`,
        "--duration": `${random(3.2, 5.6).toFixed(2)}s`
      });
    }
  }

}

function rainPetals() {
  const layer = document.getElementById("petalLayer");
  const amount = ["grandFinale", "belgiumFinale"].includes(config.bloomStyle) ? 64 : ["peonyUnfurl", "roseSpiral", "hydrangeaFirefly", "tulipMoonrise", "sunflowerBeeDance"].includes(config.bloomStyle) ? 42 : 30;
  layer.innerHTML = "";

  for (let i = 0; i < amount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "falling-petal shape-petal";
    petal.style.setProperty("--left", `${random(-5, 99).toFixed(1)}%`);
    petal.style.setProperty("--size", `${random(16, 30).toFixed(0)}px`);
    petal.style.setProperty("--duration", `${random(7.2, 13.4).toFixed(2)}s`);
    petal.style.setProperty("--delay", `${random(0, 3.4).toFixed(2)}s`);
    petal.style.setProperty("--drift", `${random(-95, 95).toFixed(0)}px`);
    petal.style.setProperty("--hue", `${random(-15, 20).toFixed(0)}deg`);
    layer.appendChild(petal);
  }
}

function launchOpenEffect() {
  const layer = document.getElementById("magicLayer");
  if (!layer) return;
  const style = config.bloomStyle || "butterflyParade";
  if (style !== "tulipMoonrise") return;

  const options = {
    peonyUnfurl: { count: 30, className: "burst peony-unfurl-piece", items: [""] },
    roseSpiral: { count: 28, className: "burst rose-spiral-piece", items: [""] },
    butterflyParade: { count: 18, className: "burst butterfly-parade", items: ["✦", "❀", "♡"] },
    rabbitHop: { count: 12, className: "burst bunny-hop", items: ["❀", "·", "♡"] },
    fireflyGlow: { count: 34, className: "burst firefly-pop", items: ["✦", "❋", "·"] },
    hydrangeaFirefly: { count: 0, className: "hydrangea-disabled", items: [""] },
    tulipMoonrise: { count: 34, className: "burst tulip-moon-piece", items: [""] },
    sunflowerBeeDance: { count: 48, className: "burst sunflower-pollen-burst", items: [""] },
    birdCircle: { count: 16, className: "burst bird-swoop", items: ["✦", "☾", "·"] },
    beeDance: { count: 22, className: "burst bee-dance", items: ["❀", "·", "✦"] },
    grandFinale: { count: 54, className: "burst grand-piece", items: ["♡", "❀", "✦"] },
    belgiumFinale: { count: 76, className: "burst finale-bloom-piece", items: [""] }
  };

  const selected = options[style] || options.butterflyParade;
  for (let i = 0; i < selected.count; i += 1) {
    makeParticle(layer, selected.className, pick(selected.items), {
      "--left": `${random(-8, 96).toFixed(1)}%`,
      "--top": `${random(12, 78).toFixed(1)}%`,
      "--size": `${random(18, 38).toFixed(0)}px`,
      "--delay": `${random(0, 1.35).toFixed(2)}s`,
      "--duration": `${random(6.8, 12.4).toFixed(2)}s`,
      "--travel": `${Math.random() > .5 ? random(90, 240) : random(-240, -90)}px`,
      "--rise": `${random(-160, -54).toFixed(0)}px`,
      "--spin": `${random(-420, 420).toFixed(0)}deg`
    });
  }
}

function fillCard(entry, options = {}) {
  const close = document.getElementById("closeMessage");
  const flowerType = normalizeFlowerType(entry.flowerType || getEntryFlowerType(entry, 0));
  safeText("messageMeta", options.meta || entry.dayLabel || formatDate(entry.date));
  safeText("messageTitle", entry.messageTitle || "For you 🌸");
  safeText("messageBody", entry.message || "You make my world bloom.");
  safeText("messageFlowerFact", flowerFactText(flowerType));
  safeText("finalLine", entry.finalLine || "");
  safeText("senderName", rawConfig.senderName ? `— ${rawConfig.senderName}` : "");
  close.style.display = "";
}

function showCard() {
  const card = document.getElementById("messageCard");
  card.classList.add("visible");
  card.classList.remove("status-card");
  card.setAttribute("aria-hidden", "false");
}

function currentEntryMeta() {
  return `${config.dayLabel || formatDate(config.date)}${dateState.preview ? " Â· preview" : ""}`;
}

function setFlowerNoteVisible(isVisible, shouldFocus = false) {
  const note = document.getElementById("flowerNote");
  if (!note) return;

  note.classList.toggle("visible", isVisible);
  note.setAttribute("aria-hidden", isVisible ? "false" : "true");
  note.tabIndex = isVisible ? 0 : -1;

  if (isVisible && shouldFocus) {
    window.setTimeout(() => note.focus(), 120);
  }
}

function canOpenDisplayedFlower() {
  return dateState.status === "active" || document.body.dataset.dateStatus === "active";
}

function openFlower() {
  if (!canOpenDisplayedFlower()) return;

  const button = document.getElementById("flowerButton");
  if (button.classList.contains("opened")) {
    setFlowerNoteVisible(true, true);
    return;
  }
  if (button.classList.contains("opened")) {
    fillCard(config, { meta: `${config.dayLabel || formatDate(config.date)}${dateState.preview ? " · preview" : ""}` });
    showCard();
    return;
  }

  button.classList.add("opened");
  document.body.classList.add("flower-opened");
  button.setAttribute("aria-label", "The flower is open. Click the note in the bloom to read the message");
  rainPetals();
  launchOpenEffect();
  fillCard(config, { meta: `${config.dayLabel || formatDate(config.date)}${dateState.preview ? " · preview" : ""}` });

  window.setTimeout(() => {
    setFlowerNoteVisible(true);
  }, 720);
}

function openFlowerNote(event) {
  event?.stopPropagation();
  if (!canOpenDisplayedFlower()) return;

  fillCard(config, { meta: `${config.dayLabel || formatDate(config.date)}${dateState.preview ? " - preview" : ""}` });
  document.body.classList.add("open-mode");
  showCard();
}

function showEntryScreen(entry, options = {}) {
  const mainFlowerType = normalizeFlowerType(entry.flowerType || getEntryFlowerType(entry, 0));
  const flowerButton = document.getElementById("flowerButton");
  const petalLayer = document.getElementById("petalLayer");

  config = mergeConfig(rawConfig, { entry });
  applyMood(config.mood || "random");
  document.body.dataset.bloomStyle = config.bloomStyle || "waiting";
  document.body.dataset.dateStatus = "active";
  document.body.dataset.mainFlower = mainFlowerType;
  document.body.classList.remove("flower-opened");
  flowerButton.dataset.flowerType = mainFlowerType;
  flowerButton.disabled = false;
  flowerButton.classList.remove("opened", "locked");
  flowerButton.setAttribute("aria-label", `Click to open the ${flowerDisplayName(mainFlowerType)} and reveal the message`);
  if (petalLayer) petalLayer.innerHTML = "";

  safeText("tapHint", config.tapHint || "Click the flower to bloom it");
  safeText("messageTitle", config.messageTitle || "For you");
  safeText("messageBody", config.message || "You make my world bloom.");
  safeText("messageFlowerFact", flowerFactText(mainFlowerType));
  safeText("finalLine", config.finalLine || "You make my world bloom.");
  safeText("senderName", rawConfig.senderName ? `— ${rawConfig.senderName}` : "");
  safeText("dateBadge", `${config.dayLabel || formatDate(config.date)}${options.memory ? " - memory view" : dateState.preview ? " - preview" : ""}`);
  setFlowerSideNotes(mainFlowerType);

  setFlowerNoteVisible(false);
  closeMessage();
  renderMemoryGarden();
  updateOpenTimer();
  createSmallFlowers();
  createAnimals();
  createAmbientMagic();
}

function showEntryFromMemory(entry) {
  showEntryScreen(entry, { memory: true });
}

function closeMessage() {
  const card = document.getElementById("messageCard");
  card.classList.remove("visible");
  card.setAttribute("aria-hidden", "true");
  document.body.classList.remove("open-mode");
}

function showStatusCard(title, message, finalLine) {
  const card = document.getElementById("messageCard");
  const close = document.getElementById("closeMessage");
  safeText("messageMeta", "garden status");
  safeText("messageTitle", title);
  safeText("messageBody", message);
  safeText("messageFlowerFact", "");
  safeText("finalLine", finalLine || "");
  safeText("senderName", "");
  card.classList.add("visible", "status-card");
  card.setAttribute("aria-hidden", "false");
  close.style.display = "none";
}

function getUnlockedCount() {
  if (dateState.preview && dateState.entry) {
    return allEntries.findIndex((entry) => entry.date === dateState.entry.date) + 1;
  }
  if (dateState.status === "before") return 0;
  if (dateState.status === "after") return allEntries.length;
  if (dateState.status === "active" && dateState.entry) {
    return allEntries.filter((entry) => entry.date <= dateState.entry.date).length;
  }
  return allEntries.filter((entry) => entry.date <= dateState.today).length;
}

function renderMemoryGarden() {
  const memoryGarden = document.getElementById("memoryGarden");
  if (!memoryGarden) return;
  const unlockedCount = getUnlockedCount();

  memoryGarden.innerHTML = "";
  allEntries.forEach((entry, index) => {
    const isUnlocked = index < unlockedCount;
    const isCurrent = !!config.date && entry.date === config.date && dateState.status === "active";
    const bloom = document.createElement("button");
    bloom.type = "button";
    bloom.className = `memory-bloom${isUnlocked ? " is-open" : " is-locked"}${isCurrent ? " is-current" : ""}`;
    bloom.disabled = !isUnlocked;
    bloom.setAttribute("aria-label", isUnlocked ? `Open memory bloom for ${formatDate(entry.date)}` : `Locked bloom for ${formatDate(entry.date)}`);

    const top = document.createElement("span");
    top.className = "memory-bloom-top";
    top.appendChild(createIllustratedFlower(getEntryFlowerType(entry, index), "memory-flower-asset"));

    const label = document.createElement("span");
    label.className = "memory-bloom-label";
    label.textContent = entry.dayLabel ? entry.dayLabel.split("·")[0].trim() : `Bloom ${index + 1}`;

    const date = document.createElement("span");
    date.className = "memory-bloom-date";
    date.textContent = formatDate(entry.date);

    bloom.append(top, label, date);
    if (isUnlocked) {
      bloom.addEventListener("click", () => showEntryFromMemory(entry));
    }
    memoryGarden.appendChild(bloom);
  });
}

function initializeLockedState() {
  const flowerButton = document.getElementById("flowerButton");
  const statusFlowerType = normalizeFlowerType(config.flowerType || getEntryFlowerType(config, 0));
  flowerButton.disabled = true;
  flowerButton.classList.add("locked");
  flowerButton.setAttribute("aria-label", "This flower is not ready yet");
  setFlowerSideNotes(statusFlowerType);

  if (dateState.status === "before") {
    const dayText = dateState.daysLeft === 1 ? "1 day" : `${dateState.daysLeft} days`;
    safeText("tapHint", `Opens ${formatDate(dateState.startDate)}`);
    safeText("dateBadge", `${dayText} until the first bloom`);
    showStatusCard(rawConfig.lockedTitle, rawConfig.lockedMessage, `Starts ${formatDate(dateState.startDate)}`);
    return;
  }

  if (dateState.status === "after") {
    safeText("tapHint", "The garden is complete");
    safeText("dateBadge", `Finished ${formatDate(dateState.endDate)}`);
    showStatusCard(rawConfig.finishedTitle, rawConfig.finishedMessage, `Last bloom: ${formatDate(dateState.endDate)}`);
    return;
  }

  safeText("tapHint", "No bloom today");
  safeText("dateBadge", "The next bloom is still growing");
  showStatusCard("This flower is still growing 🌱", "There is no bloom scheduled for today.", "Try again on the next date.");
}

function initializeActiveState() {
  const mainFlowerType = normalizeFlowerType(config.flowerType || getEntryFlowerType(config, 0));
  safeText("tapHint", config.tapHint || "Click the flower to bloom it");
  safeText("messageTitle", config.messageTitle || "For you 🌸");
  safeText("messageBody", config.message || "You make my world bloom.");
  safeText("finalLine", config.finalLine || "You make my world bloom.");
  safeText("senderName", rawConfig.senderName ? `— ${rawConfig.senderName}` : "");
  safeText("dateBadge", `${config.dayLabel || formatDate(config.date)}${dateState.preview ? " · preview" : ""}`);
  setFlowerSideNotes(mainFlowerType);

  document.getElementById("flowerButton").addEventListener("click", openFlower);
  document.getElementById("flowerNote").addEventListener("click", openFlowerNote);
  document.getElementById("closeMessage").addEventListener("click", closeMessage);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMessage();
  });
}

function startAutoDayUpdater() {
  if (!dateState || dateState.preview) return;
  const dateAtLoad = dateState.today;
  window.setInterval(() => {
    if (localDateString() !== dateAtLoad) {
      window.location.reload();
    }
  }, 60000);
}

function initialize() {
  dateState = resolveDailyBloom(rawConfig);
  config = mergeConfig(rawConfig, dateState);
  allEntries = [...(rawConfig.dailyBlooms || [])].sort((a, b) => a.date.localeCompare(b.date));

  applyMood(config.mood || "random");
  document.body.dataset.bloomStyle = config.bloomStyle || "waiting";
  document.body.dataset.dateStatus = dateState.status;
  const mainFlowerType = normalizeFlowerType(config.flowerType || getEntryFlowerType(dateState.entry || {}, 0));
  const flowerButton = document.getElementById("flowerButton");
  document.body.dataset.mainFlower = mainFlowerType;
  flowerButton.dataset.flowerType = mainFlowerType;
  flowerButton.setAttribute("aria-label", `Click to open the ${flowerDisplayName(mainFlowerType)} and reveal the message`);

  safeText("recipientName", rawConfig.recipientName || "Someone special");
  mountTapHint();

  if (dateState.status === "active") {
    initializeActiveState();
  } else {
    initializeLockedState();
    document.getElementById("closeMessage").addEventListener("click", closeMessage);
  }

  startOpenTimer();
  renderMemoryGarden();
  createSmallFlowers();
  createAnimals();
  createAmbientMagic();
  startAutoDayUpdater();
}

window.addEventListener("resize", () => {
  createSmallFlowers();
  createAnimals();
  createAmbientMagic();
});

initialize();
