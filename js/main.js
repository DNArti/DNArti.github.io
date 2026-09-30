const frog = document.getElementById("frog");
const frogImage = frog.querySelector("img");
const frogBubble = document.getElementById("frogBubble");

const frogFrames = {
    idle: "assets/frog/frog-idle.png",
    throat: "assets/frog/frog-throat.png",
    mouth: "assets/frog/frog-mouth-open.png"
};

Object.values(frogFrames).forEach(src => {
    const image = new Image();
    image.src = src;
});

let frogTimer;
let frogSelected = false;

function scheduleFrogAction() {
    if (frogSelected) return;
    frogTimer = setTimeout(() => {
        if (frogSelected) return;
        if (Math.random() < 0.5) {
            frog.classList.add("frog-hopping");
            frogTimer = setTimeout(() => {
                frog.classList.remove("frog-hopping");
                scheduleFrogAction();
            }, 800);
        } else {
            frogImage.src = frogFrames.throat;
            frogTimer = setTimeout(() => {
                frogImage.src = frogFrames.idle;
                scheduleFrogAction();
            }, 650);
        }
    }, 1800 + Math.random() * 2200);
}

function resetFrog() {
    frogSelected = false;
    frogBubble.classList.remove("visible");
    frog.classList.remove("frog-hopping");
    frogImage.src = frogFrames.idle;
    clearTimeout(frogTimer);
    scheduleFrogAction();
}

frog.addEventListener("click", event => {
    event.stopPropagation();
    if (frogSelected) {
        const destination = "projects/minecraft-mods/";
        frogSelected = false;
        frogBubble.classList.remove("visible");
        frog.classList.remove("frog-hopping");
        frogImage.src = frogFrames.idle;
        clearTimeout(frogTimer);
        window.location.href = destination;
        return;
    }

    resetCharacter();
    frogSelected = true;
    clearTimeout(frogTimer);
    frog.classList.remove("frog-hopping");
    frogImage.src = frogFrames.mouth;
    frogBubble.classList.add("visible");
});

// Character
const character = document.getElementById("character");
const characterImage = character.querySelector("img");
const characterBubble = document.getElementById("characterBubble");
const characterFrames = {
    reading: "assets/character/character-reading.png",
    surprised: "assets/character/character-surprised.png"
};
const surprisedCharacterFrame = new Image();
surprisedCharacterFrame.src = characterFrames.surprised;
let characterSelected = false;

character.classList.add("character-idle");

function resetCharacter() {
    characterSelected = false;
    characterBubble.classList.remove("visible");
    character.classList.remove("showing-bubble");
    character.classList.remove("character-startled");
    characterImage.src = characterFrames.reading;
    character.classList.add("character-idle");
}

character.addEventListener("click", event => {
    event.stopPropagation();
    if (characterSelected) {
        const destination = "resume/";
        characterSelected = false;
        characterBubble.classList.remove("visible");
        character.classList.remove(
            "character-startled"
        );
        characterImage.src =
            characterFrames.reading;
        character.classList.add(
            "character-idle"
        );
        window.location.href = destination;
        return;
    }

    resetFrog();
    characterSelected = true;
    character.classList.add("showing-bubble");
    character.classList.remove(
        "character-idle"
    );
    characterImage.src =
        characterFrames.surprised;
    void character.offsetWidth;
    character.classList.add(
        "character-startled"
    );
    characterBubble.classList.add(
        "visible"
    );
});

// Help sign
const helpSign = document.getElementById("helpSign");
const helpOverlay = document.getElementById("helpOverlay");
const signAlert = helpSign.querySelector(".sign-alert");

helpSign.addEventListener("click", event => {
    event.stopPropagation();
    resetFrog();
    resetCharacter();
    signAlert.classList.add("seen");
    helpOverlay.classList.add("visible");
    helpOverlay.setAttribute(
        "aria-hidden",
        "false"
    );
});

helpOverlay.addEventListener("click", event => {
    if (event.target === helpOverlay) {
        helpOverlay.classList.remove("visible");
        helpOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && helpOverlay.classList.contains("visible")) {
        helpOverlay.classList.remove("visible");
        helpOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }
});

document.addEventListener("click", () => {
    if (frogSelected) {
        resetFrog();
    }
    if (characterSelected) {
        resetCharacter();
    }
});

// Background effects
const petalLayer = document.getElementById("petalLayer");
const petalSprites = [
    "assets/petals/petal-1.png",
    "assets/petals/petal-2.png",
    "assets/petals/petal-3.png",
    "assets/petals/petal-4.png",
    "assets/petals/petal-5.png",
    "assets/petals/petal-6.png",
    "assets/petals/petal-7.png"
];
let petalSpawner = null;

function spawnPetal() {
    const petal = document.createElement("img");
    petal.className = "petal";
    petal.src = petalSprites[Math.floor(Math.random() * petalSprites.length)];
    const startLeft = 72 + Math.random() * 28;
    const startTop = -8 + Math.random() * 18;
    const driftX = -90 - Math.random() * 45;
    const driftY = 70 + Math.random() * 35;
    const size = 14 + Math.random() * 10;
    const duration = 10 + Math.random() * 6;
    const rotation = 240 + Math.random() * 260;
    const scale = 0.85 + Math.random() * 0.45;
    petal.style.left = `${startLeft}%`;
    petal.style.top = `${startTop}%`;
    petal.style.width = `${size}px`;
    petal.style.setProperty("--drift-x", `${driftX}vw`);
    petal.style.setProperty("--drift-y", `${driftY}vh`);
    petal.style.setProperty("--petal-rotate", `${rotation}deg`);
    petal.style.setProperty("--petal-scale", scale);
    petal.style.animationDuration = `${duration}s`;
    petalLayer.appendChild(petal);
    petal.addEventListener("animationend", () => {
        petal.remove();
    });
}

function startPetals() {
    if (petalSpawner) {
        clearInterval(petalSpawner);
    }
    petalLayer.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            spawnPetal();
        }, i * 700);
    }
    petalSpawner = setInterval(() => {
        if (petalLayer.childElementCount < 12) {
            spawnPetal();
        }
    }, 700); 
}
startPetals();

window.addEventListener("pageshow", () => {
    clearTimeout(frogTimer);
    frogSelected = false;
    characterSelected = false;
    frogBubble.classList.remove("visible");
    characterBubble.classList.remove("visible");
    frog.classList.remove("frog-hopping");
    frogImage.src = frogFrames.idle;
    character.classList.remove(
        "character-startled"
    );
    characterImage.src =
        characterFrames.reading;
    character.classList.add(
        "character-idle"
    );
    scheduleFrogAction();
    startPetals();
});