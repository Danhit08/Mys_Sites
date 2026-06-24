function toggleMusic(){
document
.getElementById("musicPanel")
.classList.toggle("active");
}

function closeMusic(){
document
.getElementById("musicPanel")
.classList.remove("active");
}

function openProjects(){
document
.getElementById("projectsModal")
.style.display="flex";
}

function closeProjects(){
document
.getElementById("projectsModal")
.style.display="none";
}

function openComments(){
document
.getElementById("commentsModal")
.style.display="flex";
}

function closeComments(){
document
.getElementById("commentsModal")
.style.display="none";
}

// views

let views =
localStorage.getItem("views") || 0;

views++;

localStorage.setItem(
"views",
views
);

document
.getElementById("viewCounter")
.innerText = views;

// comentários

function addComment(){

const nick =
document.getElementById("nick");

const msg =
document.getElementById("msg");

if(!nick.value || !msg.value)
return;

const comments =
JSON.parse(
localStorage.getItem("comments")
) || [];

comments.push({
nick:nick.value,
msg:msg.value
});

localStorage.setItem(
"comments",
JSON.stringify(comments)
);

nick.value="";
msg.value="";

renderComments();
renderBouncingComments();
}

function renderComments(){

const comments =
JSON.parse(
localStorage.getItem("comments")
) || [];

const area =
document.getElementById("comments");

area.innerHTML="";

comments.forEach(c=>{

area.innerHTML += `
<div class="comment">
<strong>${c.nick}</strong>
<p>${c.msg}</p>
</div>
`;

});
}

class BouncingComment {
constructor(comment) {
this.comment = comment;
this.x = Math.random() * window.innerWidth;
this.y = Math.random() * window.innerHeight;
this.vx = (Math.random() - 0.5) * 3;
this.vy = (Math.random() - 0.5) * 3;
this.width = 240;
this.height = 70;

this.element = document.createElement('div');
this.element.className = 'bouncing-comment';
this.element.textContent = `${comment.nick}: ${comment.msg}`;
document.getElementById('bouncing-comments-container').appendChild(this.element);
this.updatePosition();
}

updatePosition() {
this.element.style.left = this.x + 'px';
this.element.style.top = this.y + 'px';
}

update() {
this.x += this.vx;
this.y += this.vy;

if (this.x <= 0 || this.x + this.width >= window.innerWidth) {
this.vx *= -1;
this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
}

if (this.y <= 0 || this.y + this.height >= window.innerHeight) {
this.vy *= -1;
this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.height));
}

this.updatePosition();
}
}

let bouncingCommentInstances = [];

function renderBouncingComments(){
const comments = JSON.parse(localStorage.getItem("comments")) || [];
const container = document.getElementById('bouncing-comments-container');
if(!container) return;

container.innerHTML = "";
bouncingCommentInstances = [];

comments.slice(-8).forEach(comment => {
bouncingCommentInstances.push(new BouncingComment(comment));
});
}

renderComments();
renderBouncingComments();

// BOUNCING HOBBIES

const hobbies = [
'🎬 Edição',
'🎮 Jogos',
'💻 Programação',
'✏️ Desenho'
];

class BouncingHobby {
constructor(hobby) {
this.hobby = hobby;
this.x = Math.random() * window.innerWidth;
this.y = Math.random() * window.innerHeight;
this.vx = (Math.random() - 0.5) * 6;
this.vy = (Math.random() - 0.5) * 6;
this.width = 120;
this.height = 50;

this.element = document.createElement('div');
this.element.className = 'bouncing-hobby';
this.element.textContent = hobby;
document.getElementById('bouncing-hobbies-container').appendChild(this.element);
this.updatePosition();
}

updatePosition() {
this.element.style.left = this.x + 'px';
this.element.style.top = this.y + 'px';
}

update() {
this.x += this.vx;
this.y += this.vy;

if (this.x <= 0 || this.x + this.width >= window.innerWidth) {
this.vx *= -1;
this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
}

if (this.y <= 0 || this.y + this.height >= window.innerHeight) {
this.vy *= -1;
this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.height));
}

this.updatePosition();
}
}

let bouncingHobbyInstances = [];

function initBouncingHobbies() {
for (let i = 0; i < 4; i++) {
const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
bouncingHobbyInstances.push(new BouncingHobby(randomHobby));
}
}

function animateBouncingHobbies() {
bouncingHobbyInstances.forEach(hobby => {
hobby.update();
});
bouncingCommentInstances.forEach(comment => {
comment.update();
});
requestAnimationFrame(animateBouncingHobbies);
}

initBouncingHobbies();
animateBouncingHobbies();

// MÚSICA PLAYER

let audioContext;
let analyser;
let dataArray;
let isPlaying = false;

const audioPlayer = document.getElementById('musicPlayer');
const audioSource = document.getElementById('audioSource');
const visualizerBars = document.querySelectorAll('.visualizer .bar');
const bgGlow = document.querySelector('.bg-glow');

// Quando termina a música
audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    playRandomMusic();
});

// Atualizar visualizador enquanto toca
audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    if(audioContext === null || audioContext === undefined) {
        initAudio();
    }
    animate();
});

audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
});

// Inicializar Web Audio API
function initAudio(){
    if(!audioContext){
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementAudioSource(audioPlayer);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
}

function playMusic(src, element){
    initAudio();
    
    audioSource.src = src;
    audioPlayer.load();
    audioPlayer.play();
    audioContext.resume();
    isPlaying = true;
    
    // Remove active class de todos os itens
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adiciona active class ao item clicado
    element.classList.add('active');
    
    // Iniciar animação do visualizador
    animate();
}

function playRandomMusic(){
    const playlistItems = Array.from(document.querySelectorAll('.playlist-item'));
    if(playlistItems.length === 0) return;

    const activeIndex = playlistItems.findIndex(item => item.classList.contains('active'));
    let nextIndex = Math.floor(Math.random() * playlistItems.length);

    if(playlistItems.length > 1){
        while(nextIndex === activeIndex){
            nextIndex = Math.floor(Math.random() * playlistItems.length);
        }
    }

    playlistItems[nextIndex].click();
}

function animate(){
    if(!isPlaying) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    // Atualizar barras do visualizador
    visualizerBars.forEach((bar, index) => {
        const value = dataArray[index * 4];
        const height = (value / 255) * 50 + 10;
        bar.style.height = height + 'px';
        
        // Cor dinâmica baseada na frequência
        const hue = (value / 255) * 360;
        bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 60%), hsl(${hue}, 100%, 30%))`;
        bar.style.boxShadow = `0 0 ${value/5}px hsl(${hue}, 100%, 60%)`;
    });
    
    // Animar o glow de fundo baseado na frequência média
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const glowIntensity = (average / 255) * 0.5 + 0.2;
    bgGlow.style.opacity = glowIntensity;
    bgGlow.style.filter = `blur(${100 + (average / 255) * 50}px)`;
    
    requestAnimationFrame(animate);
}
