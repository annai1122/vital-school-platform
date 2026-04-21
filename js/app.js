// ========== ДАНІ УЧНІВ ==========
const students = [
    { id: 1, name: 'Софія Петренко', photo: 'https://i.pravatar.cc/150?img=1', grade1: 10, grade2: 11, grade3: 12 },
    { id: 2, name: 'Максим Іванов', photo: 'https://i.pravatar.cc/150?img=2', grade1: 9, grade2: 10, grade3: 11 },
    { id: 3, name: 'Ксенія Коваленко', photo: 'https://i.pravatar.cc/150?img=3', grade1: 11, grade2: 12, grade3: 12 },
    { id: 4, name: 'Давид Миколайчик', photo: 'https://i.pravatar.cc/150?img=4', grade1: 10, grade2: 10, grade3: 10 },
    { id: 5, name: 'Анна Сидоренко', photo: 'https://i.pravatar.cc/150?img=5', grade1: 12, grade2: 12, grade3: 11 },
    { id: 6, name: 'Олег Бандера', photo: 'https://i.pravatar.cc/150?img=6', grade1: 8, grade2: 9, grade3: 10 },
    { id: 7, name: 'Дарія Марченко', photo: 'https://i.pravatar.cc/150?img=7', grade1: 11, grade2: 11, grade3: 12 },
    { id: 8, name: 'Тимур Сотник', photo: 'https://i.pravatar.cc/150?img=8', grade1: 10, grade2: 11, grade3: 11 },
    { id: 9, name: 'Наталія Гончар', photo: 'https://i.pravatar.cc/150?img=9', grade1: 9, grade2: 10, grade3: 9 },
    { id: 10, name: 'Артем Кравченко', photo: 'https://i.pravatar.cc/150?img=10', grade1: 10, grade2: 10, grade3: 12 },
    { id: 11, name: 'Вероніка Шевченко', photo: 'https://i.pravatar.cc/150?img=11', grade1: 11, grade2: 12, grade3: 12 },
    { id: 12, name: 'Роман Боровець', photo: 'https://i.pravatar.cc/150?img=12', grade1: 9, grade2: 9, grade3: 10 }
];

// Дитячі фрази для голосу
const voicePhrases = [
    'Я тут!',
    'Слава Богу, я готова відповідати',
    'Я зробила домашнє завдання',
    'Привіт, вчителю!',
    'Готов слухати'
];

// ========== РЕЄСТРАЦІЯ ==========
document.getElementById('register-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    // Збереження даних
    localStorage.setItem('teacher', JSON.stringify({ name, email }));
    
    // Показ email на етапі 2
    document.getElementById('display-email').textContent = email;
    
    goToStage(2);
});

function goToStage(stage) {
    document.querySelectorAll('.auth-stage').forEach(el => el.classList.remove('active'));
    document.getElementById(`stage-${stage}`).classList.add('active');
}

function enterDashboard() {
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('teacher');
    localStorage.removeItem('announcements');
    window.location.href = 'index.html';
}

// ========== DASHBOARD ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard')) {
        initDashboard();
    }
});

function initDashboard() {
    loadStudents();
    loadJournal();
    loadAnnouncements();
}

// ========== ЗАВАНТАЖЕННЯ УЧНІВ ==========
function loadStudents() {
    const grid = document.getElementById('students-grid');
    if (!grid) return;
    
    grid.innerHTML = students.map(student => `
        <div class="student-card">
            <img src="${student.photo}" alt="${student.name}" class="student-photo">
            <div class="student-name">${student.name}</div>
            <button class="btn-call" onclick="triggerVoiceResponse(${student.id}, '${student.name}', '${student.photo}')">
                🎤 Викликати до відповіді
            </button>
        </div>
    `).join('');
}

// ========== ГОЛОСОВА ВЗАЄМОДІЯ ==========
function triggerVoiceResponse(studentId, studentName, photoUrl) {
    const modal = document.getElementById('voice-modal');
    const nameElement = document.getElementById('modal-student-name');
    const photoElement = document.getElementById('modal-student-photo');
    const voiceText = document.getElementById('voice-response');
    
    // Встановлення фото та імені
    photoElement.src = photoUrl;
    nameElement.textContent = studentName;
    
    // Показ модального вікна
    modal.classList.add('active');
    
    // Генерація випадкової фрази
    const randomPhrase = voicePhrases[Math.floor(Math.random() * voicePhrases.length)];
    voiceText.textContent = '🎤 Прослуховування...';
    
    // Додання хвильки
    const voiceWave = document.querySelector('.voice-wave');
    voiceWave.innerHTML = '<div class="wave"></div><div class="wave"></div><div class="wave"></div><div class="wave"></div><div class="wave"></div>';
    
    // Затримка перед голосом
    setTimeout(() => {
        speakInUkrainian(randomPhrase, studentName);
        voiceText.textContent = randomPhrase;
    }, 500);
}

// ========== СИНТЕЗ МОВИ (TTS) ==========
function speakInUkrainian(text, studentName) {
    // Перевірка браузерної підтримки Web Speech API
    const synth = window.speechSynthesis;
    
    if (!synth) {
        console.error('Speech Synthesis не підтримується');
        return;
    }
    
    // Скасування попередніх промовлянь
    synth.cancel();
    
    // Вибір голосу українською
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'uk-UA';
    utterance.pitch = 1.6; // Дитячий тон
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    
    synth.speak(utterance);
}

function closeVoiceModal() {
    const modal = document.getElementById('voice-modal');
    modal.classList.remove('active');
    window.speechSynthesis.cancel();
}

// ========== ПЕРЕМИКАННЯ ВКЛАДОК ==========
function switchTab(tabName) {
    // Сховати всі вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показати потрібну вкладку
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Оновити активну кнопку
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ========== ЖУРНАЛ ОЦІНОК ==========
function loadJournal() {
    const tbody = document.getElementById('journal-body');
    if (!tbody) return;
    
    tbody.innerHTML = students.map((student, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td><div class="grade-cell">${student.grade1}</div></td>
            <td><div class="grade-cell">${student.grade2}</div></td>
            <td><div class="grade-cell">${student.grade3}</div></td>
        </tr>
    `).join('');
}

// ========== ЗАВАНТАЖЕННЯ ЖУРНАЛУ СКРІНШОТОМ ==========
async function downloadJournalScreenshot() {
    const table = document.getElementById('journal-table');
    
    try {
        const canvas = await html2canvas(table, {
            backgroundColor: '#ffffff',
            scale: 2
        });
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `VITAL-SCHOOL-Журнал-${new Date().toLocaleDateString('uk-UA')}.png`;
        link.click();
    } catch (error) {
        alert('Помилка при завантаженні: ' + error.message);
    }
}

// ========== ОГОЛОШЕННЯ ВЧИТЕЛЯ ==========
function sendAnnouncement() {
    const text = document.getElementById('announcement-text').value.trim();
    
    if (!text) {
        alert('Напишіть оголошення!');
        return;
    }
    
    // Отримання попередніх оголошень
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    // Додання нового оголошення
    announcements.push({
        text: text,
        timestamp: new Date().toLocaleString('uk-UA')
    });
    
    localStorage.setItem('announcements', JSON.stringify(announcements));
    
    document.getElementById('announcement-text').value = '';
    loadAnnouncements();
}

function loadAnnouncements() {
    const list = document.getElementById('announcements-list');
    if (!list) return;
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    list.innerHTML = announcements.reverse().map(ann => `
        <div class="announcement-item">
            <p>${ann.text}</p>
            <div class="announcement-time">📅 ${ann.timestamp}</div>
        </div>
    `).join('');
}
