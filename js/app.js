const students = [
    { id: 1, name: "Софія", img: "https://randomuser.me/api/portraits/med/girls/1.jpg", grade: 12, status: "online" },
    { id: 2, name: "Марія", img: "https://randomuser.me/api/portraits/med/girls/2.jpg", grade: 11, status: "online" },
    { id: 3, name: "Данилко", img: "https://randomuser.me/api/portraits/med/boys/1.jpg", grade: 10, status: "offline" },
    { id: 4, name: "Оленка", img: "https://randomuser.me/api/portraits/med/girls/8.jpg", grade: 12, status: "online" },
    { id: 5, name: "Іванко", img: "https://randomuser.me/api/portraits/med/boys/8.jpg", grade: 11, status: "online" },
    { id: 6, name: "Максим", img: "https://randomuser.me/api/portraits/med/boys/15.jpg", grade: 12, status: "online" }
];

const phrases = [
    "Привіт! Я готова відповідати.",
    "Слава Богу, в мене все добре!",
    "Я зробила домашнє завдання.",
    "Я уважно слухаю урок.",
    "Дякую, вчителю, дуже цікаво!"
];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userName').innerText = localStorage.getItem('schoolUserName') || "Вчитель";
    renderData();
});

function renderData() {
    const grid = document.getElementById('classGrid');
    const journal = document.getElementById('journal');
    
    students.forEach(s => {
        grid.innerHTML += `
            <div id="kid-${s.id}" class="bg-white rounded-3xl overflow-hidden shadow-sm border-4 border-transparent transition-all duration-300">
                <img src="${s.img}" class="w-full h-40 object-cover ${s.status === 'offline' ? 'grayscale opacity-40' : ''}">
                <div class="p-3 flex justify-between items-center">
                    <span class="font-bold text-sm text-gray-700">${s.name}</span>
                    ${s.status === 'online' ? 
                        `<button onclick="callStudent(${s.id})" class="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">ВИКЛИКАТИ</button>` : 
                        `<span class="text-red-400 text-[10px] font-bold">ВІДСУТНІЙ</span>`}
                </div>
            </div>
        `;

        journal.innerHTML += `
            <div class="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                <span class="text-gray-600">${s.name}</span>
                <span class="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">${s.grade} б.</span>
            </div>
        `;
    });
}

function callStudent(id) {
    const kid = students.find(s => s.id === id);
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'uk-UA';
    utterance.pitch = 1.6; // ДИТЯЧИЙ ГОЛОС
    utterance.rate = 1.0;

    const card = document.getElementById(`kid-${id}`);
    card.classList.add('border-green-400', 'scale-105');
    
    utterance.onend = () => card.classList.remove('border-green-400', 'scale-105');
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}
