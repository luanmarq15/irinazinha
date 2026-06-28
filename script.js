
const poemText=`Para el amor de mi vida, te escribo despacio,

porque hay cosas en el pecho que no tienen espacio fácil de explicar.
Busco palabras que te puedan alcanzar,
pero ninguna parece suficiente para poderte nombrar o mostrar.

No recuerdo el momento del primer “te amo” dicho,
quizás eso sea solo un detalle perdido.
Porque lo que siento por vos ya nació escrito,
antes incluso de que nuestro encuentro hubiera existido.

Aunque estés lejos, vivís en mi pensar,
en mi despertar, en mi soñar, en mi caminar.
Y todo el día te anda buscando sin parar,
como si el mundo supiera bien dónde estás.

Y mi mayor deseo, sincero y entero,
es simple como el viento de un día verdadero:
mirarte a los ojos, sin nada entre los dos,
y tomar tu mano…
y no soltarla jamás, mi amor.`;

/* poem typing removed */
/* ========================= */
/* NAVEGAÇÃO ENTRE TELAS */
/* ========================= */

let currentScreen = 0;
const screens = document.querySelectorAll(".screen");

function showScreen(index){
    screens.forEach(s => s.classList.remove("active"));
    if(screens[index]){
        screens[index].classList.add("active");
    }
    currentScreen = index;
}

function nextScreen(){
    showScreen(currentScreen + 1);
}

/* ========================= */
/* NEBULOSA (CANVAS) */
/* ========================= */

const canvas = document.getElementById("nebula");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();

window.addEventListener("resize", resize);

let mouse = {x:0,y:0};

window.addEventListener("mousemove",(e)=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* partículas da nebulosa */
let particles = [];

for(let i=0;i<120;i++){
    particles.push({
        x:Math.random()*window.innerWidth,
        y:Math.random()*window.innerHeight,
        vx:(Math.random()-0.5)*0.6,
        vy:(Math.random()-0.5)*0.6,
        r:Math.random()*2+0.5
    });
}

/* clique cria explosão */
window.addEventListener("click",(e)=>{
    for(let i=0;i<25;i++){
        particles.push({
            x:e.clientX,
            y:e.clientY,
            vx:(Math.random()-0.5)*3,
            vy:(Math.random()-0.5)*3,
            r:Math.random()*2+1
        });
    }
});

/* loop */
function animate(){
    ctx.fillStyle="rgba(5,0,20,0.35)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let p of particles){

        /* interação com mouse */
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < 120){
            p.vx += dx * 0.0005;
            p.vy += dy * 0.0005;
        }

        p.x += p.vx;
        p.y += p.vy;

        /* leve atrito */
        p.vx *= 0.98;
        p.vy *= 0.98;

        /* reposição */
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle="rgba(255,100,200,0.6)";
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
    }

    requestAnimationFrame(animate);
}

animate();
/* ========================= */
/* ENVELOPE 3D */
/* ========================= */
const envelope = document.getElementById("envelope");
const poem = document.getElementById("poem");

if (envelope) {

    envelope.addEventListener("click", () => {

        envelope.classList.toggle("open");

        poem.classList.add("show");

    });

}
/* ========================= */
/* APAGAR VELAS */
/* ========================= */

const blowButton = document.getElementById("blowButton");
const cake = document.getElementById("cake");
const messageBox = document.getElementById("birthdayMessage");

/* texto final do bolo */
const birthdayText =
"Feliz cumpleaños, mi amor. Aunque en este momento no pueda estar contigo, estaré en tus pensamientos y muy pronto también estaré contigo en persona. Te amo muchísimo y siempre voy a amarte.";
function typeText(text, container){
    container.innerHTML = "";

    let i = 0;

    function write(){
        if(i < text.length){
            let span = document.createElement("span");
            span.className = "char";

            span.textContent = text[i] === " " ? "\u00A0" : text[i];

            container.appendChild(span);

            i++;
            setTimeout(write, 25);
        }
    }

    write();
}

/* apagar velas */
let candlesBlown=false;
function blowCandles(){ if(candlesBlown)return; candlesBlown=true;
    const flames = document.querySelectorAll(".flame");

    flames.forEach((flame, index)=>{
        setTimeout(()=>{
            flame.style.transition = "0.6s";
            flame.style.opacity = "0";
            flame.style.transform = "scale(0)";
        }, index * 300);
    });

    /* iniciar mensagem depois */
    setTimeout(()=>{
        typeText(birthdayText, messageBox);
    }, 1200);
}

if(blowButton){
    blowButton.addEventListener("click", blowCandles);
}

/* ========================= */
/* EFEITO LETRAS SAINDO E ORGANIZANDO */
/* ========================= */

/* melhora visual quando mensagem termina */
const observer = new MutationObserver(()=>{
    const chars = document.querySelectorAll("#birthdayMessage .char");

    if(chars.length > 0){

        setTimeout(()=>{
            chars.forEach((c,i)=>{

                let x = (Math.random() - 0.5) * 200;
                let y = (Math.random() - 0.5) * 150;

                c.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
                c.style.transition = "0.8s";

                setTimeout(()=>{
                    c.style.transform = "translate(0px,0px)";
                }, 900 + i * 10);

            });
        }, 1200);
    }
});

observer.observe(messageBox,{childList:true});

/* ========================= */
/* FINAL TOUCH (SUAVIDADE) */
/* ========================= */

/* evita bug de tela branca em reload */
window.addEventListener("load",()=>{
    showScreen(0);
});