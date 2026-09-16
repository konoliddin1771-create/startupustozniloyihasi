const STORAGE_KEY = 'orbitAcademy_Separated_Data';
const PRO_KEY = 'orbitAcademy_Enterprise_IsPro';

let spaceStudents = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let isUserPro = JSON.parse(localStorage.getItem(PRO_KEY)) || false;

// 🤖 GEMINI AI SOZLAMASI
const GEMINI_API_KEY = "URTINGIZGA_GEMINI_API_KEY_QO_SHING";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Siz "OrbitAcademy 3D" o'quv markazining konsultantisiz.
Faqat markaz doirasida o'zbekcha qisqa javob bering. Boshqa mavzularni muloyim rad eting!
Ma'lumotlar:
- Kurslar: English Planet va Code Star (IT). To'lov: 400,000 so'm.
- Pro litsenziya: oyiga 50,000 so'm (Saturn halqalari ochiladi).
- Tizim: Davomatda o'quvchiga 15 XP beriladi. 30 XP bo'lganda sehrli quti portlab ichidan stiker, shokolad yoki o'yinchoq chiqadi. New talabaga +15 XP start bonus bor.`;

// DOM Elementlari
const universe3D = document.getElementById('universe3D');
const studentNameInput = document.getElementById('studentName');
const courseTypeSelect = document.getElementById('courseType');
const spawnBtn = document.getElementById('spawnBtn');
const limitWarning = document.getElementById('limitWarning');
const teacherTableBody = document.getElementById('teacherTableBody');
const activateProBtn = document.getElementById('activateProBtn');

const giftPopup = document.getElementById('giftPopup');
const openGiftBtn = document.getElementById('openGiftBtn');
const giftResult = document.getElementById('giftResult');
const giftVisual = document.getElementById('giftVisual');
const giftText = document.getElementById('giftText');

const chatMessages = document.getElementById('chatMessages');
const aiInput = document.getElementById('aiInput');
const sendAiBtn = document.getElementById('sendAiBtn');

const giftsList = [
    { emoji: "🚀", name: "Uchar Kosmik Kema oʻyinchogʻi!" },
    { emoji: "🍫", name: "Mazali Kosmik Shokolad!" },
    { emoji: "🤖", name: "Mini Robot Stikeri!" },
    { emoji: "🪙", name: "100 ta Oltin Koinot Tangasi!" }
];
let activeGiftIndex = null;

// Sahifalar boshqaruvi
function switchPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));

    document.getElementById(`page-${pageName}`).classList.add('active');
    document.getElementById(`nav-${pageName}`).classList.add('active');

    spaceStudents = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (pageName === 'parent') renderUniverse();
    if (pageName === 'teacher') renderTeacherTable();
}

// --- 1. KOINOT VA SAYYORALAR ---
function renderUniverse() {
    if (!universe3D) return;
    universe3D.innerHTML = '';

    let foundGiftStudent = false;
    activeGiftIndex = null;

    spaceStudents.forEach((student, index) => {
        const planet = document.createElement('div');
        planet.classList.add('planet-3d');
        planet.style.left = `${student.posX}%`;
        planet.style.top = `${student.posY}%`;

        let colorGradient = student.course.includes('English')
            ? "radial-gradient(circle at 30% 30%, #ec4899, #3b82f6)"
            : "radial-gradient(circle at 30% 30%, #10b981, #06b6d4)";

        let ringHTML = isUserPro ? `<div class="premium-ring"></div>` : '';

        planet.innerHTML = `
            <div class="planet-sphere" style="background: ${colorGradient};">
                ${ringHTML}
            </div>
            <div class="planet-name">⭐ ${student.name} (${student.coins} XP)</div>
        `;
        universe3D.appendChild(planet);

        if (student.coins >= 30 && student.giftOpened === false) {
            activeGiftIndex = index;
            foundGiftStudent = true;
        }
    });

    if (foundGiftStudent && activeGiftIndex !== null) {
        giftPopup.classList.remove('hidden');
    } else {
        giftPopup.classList.add('hidden');
    }

    if (!isUserPro && spaceStudents.length >= 1) {
        limitWarning.classList.remove('hidden');
    } else {
        limitWarning.classList.add('hidden');
    }
}

if (spawnBtn) {
    spawnBtn.addEventListener('click', () => {
        const name = studentNameInput.value.trim();
        const course = courseTypeSelect.value;
        if (!name) return alert('Ism kiriting!');

        if (!isUserPro && spaceStudents.length >= 1) {
            alert("⚠️ Bepul rejimda faqat 1 ta sayyora mumkin. PRO-ga o'ting!");
            return;
        }

        spaceStudents.push({
            name: name, course: course, coins: 15, giftOpened: false,
            posX: Math.floor(Math.random() * 60) + 20,
            posY: Math.floor(Math.random() * 55) + 20
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(spaceStudents));
        renderUniverse();
        studentNameInput.value = '';
    });
}

// Sovg'a ochish va sandiqni portlatish
if (openGiftBtn) {
    openGiftBtn.onclick = function() {
        if (activeGiftIndex === null || !spaceStudents[activeGiftIndex]) return;

        const randomGift = giftsList[Math.floor(Math.random() * giftsList.length)];
        giftVisual.textContent = randomGift.emoji;
        giftText.textContent = randomGift.name;

        document.getElementById('boxEmoji').style.display = "none";
        openGiftBtn.style.display = 'none';
        giftResult.classList.remove('hidden');

        spaceStudents[activeGiftIndex].coins = 0;
        spaceStudents[activeGiftIndex].giftOpened = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(spaceStudents));

        setTimeout(() => {
            giftPopup.classList.add('hidden');
            giftResult.classList.add('hidden');
            openGiftBtn.style.display = 'block';
            document.getElementById('boxEmoji').style.display = "block";
            activeGiftIndex = null;
            renderUniverse();
        }, 4000);
    };
}

// --- 2. O'QITUVCHILAR PANELI ---
function renderTeacherTable() {
    if (!teacherTableBody) return;
    teacherTableBody.innerHTML = '';

    if (spaceStudents.length === 0) {
        teacherTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#6b7280; padding:20px;">Hozircha tizimda oʻquvchilar yoʻq.</td></tr>`;
        return;
    }

    spaceStudents.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${student.name}</strong></td>
            <td><span style="color:#a855f7;">${student.course}</span></td>
            <td><b style="color:#f59e0b;">⭐ ${student.coins} XP</b></td>
            <td>
                <button class="btn-action" onclick="givePoints(${index})">Davomat: Keldi ✅</button>
            </td>
        `;
        teacherTableBody.appendChild(tr);
    });
}

window.givePoints = function(index) {
    spaceStudents = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!spaceStudents[index]) return;

    spaceStudents[index].coins += 15;
    if (spaceStudents[index].coins >= 30) spaceStudents[index].giftOpened = false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(spaceStudents));
    renderTeacherTable();

    if (spaceStudents[index].coins >= 30) {
        alert(`${spaceStudents[index].name} 30 XP yigʻdi! Ota-onalar panelida sehrli quti tayyor! 🎁`);
        switchPage('parent');
    }
};

// --- 3. AI CHAT TIZIMI ---
if (sendAiBtn) {
    sendAiBtn.addEventListener('click', handleAiChat);
    aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAiChat(); });
}

async function handleAiChat() {
    const userText = aiInput.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user-msg');
    aiInput.value = '';

    const loadingDiv = appendMessage("OrbitAI o'ylamoqda... 🌌", 'ai-msg');

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "URTINGIZGA_GEMINI_API_KEY_QO_SHING") {
        loadingDiv.textContent = "Bot to'liq ishlashi uchun script.js fayliga haqiqiy Gemini API kalitini ulang. 🪐";
        return;
    }

    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nFoydalanuvchi: ${userText}` }] }]
            })
        });
        const data = await response.json();
        loadingDiv.textContent = data.candidates[0].content.parts[0].text;
    } catch (e) {
        loadingDiv.textContent = "Ulanishda xatolik bo'ldi. Kalitni tekshiring!";
    }
}

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.classList.add('msg', className);
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

if (activateProBtn) {
    activateProBtn.addEventListener('click', () => {
        if (confirm("PRO tarifni sotib olasizmi?")) {
            isUserPro = true;
            localStorage.setItem(PRO_KEY, true);
            switchPage('parent');
        }
    });
}

renderUniverse();
