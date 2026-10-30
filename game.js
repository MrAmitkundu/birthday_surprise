import * as THREE from 'three';
import { GLTFLoader } from 'https://esm.sh/three@0.166.1/examples/jsm/loaders/GLTFLoader.js';

// Customize this message to make it personal.
const SURPRISE_MESSAGE = "Puchki, every little step led you here. Thank you for being my favourite part of this world. Here's to all our memories and the ones still waiting for us. 💖";

const LEVELS = [
    { name: "THE MEADOW", title: "Find our first memory 🌼", description: "Your adventure begins here. Complete this tiny memory challenge.", task: "memory", marker: [-8, 0, -7] },
    { name: "THE STAR BRIDGE", title: "Relationship quiz ⭐", description: "Answer this little quiz to unlock the next path. Edit the questions in game.js to match your story.", task: "quiz", marker: [8, 0, -11] },
    { name: "THE HEART GARDEN", title: "Collect three hearts 💗", description: "Find all three floating hearts in the garden. Walk near each one and press E.", task: "hearts", marker: [-1, 0, 11] },
    { name: "THE ARCADE", title: "Tic-Tac-Toe challenge 🎮", description: "Beat the computer at Tic-Tac-Toe. You need three in a row to pass.", task: "ttt", marker: [-15, 0, 2] },
    { name: "THE MEMORY ROOM", title: "Photo tile puzzle 🧩", description: "Put the numbered tiles in order from 1 to 8. The empty space lets you slide a tile.", task: "puzzle", marker: [16, 0, 4] },
    { name: "THE STAR LAKE", title: "A second quiz 🌙", description: "One more mini quiz before the last challenge. Get the answer right to continue.", task: "quiz2", marker: [11, 0, 16] },
    { name: "THE FLIRTING FOUNTAIN", title: "A little flirty challenge 😉", description: "Pick your favourite cheeky romantic replies and unlock a playful note.", task: "flirty", marker: [-27, 0, -7] },
    { name: "THE LOVE LETTER NOOK", title: "What nickname does your partner call you? 💗", description: "Enter the special nickname. “Puchki” or a spelling at least 80% similar unlocks a cute love letter.", task: "nickname", marker: [27, 0, 1] },
    { name: "THE DATE NIGHT PIER", title: "Would you rather: couple edition 🌹", description: "Choose your dream date in three quick rounds. There are no wrong answers.", task: "wouldyou", marker: [-27, 0, 20] },
    { name: "THE CUPID ARCADE", title: "Thirty seconds of love 💘", description: "Catch as many falling hearts as you can in 30 seconds. Your score will reveal a little love message.", task: "reaction", marker: [27, 0, -22] },
    { name: "THE SECRET SIGNAL", title: "Decode our love language 💞", description: "Solve three emoji riddles to reveal a secret message.", task: "emoji", marker: [-2, 0, -31] },
    { name: "THE PROMISE TREE", title: "Pick three little promises 🌳", description: "Choose three promises you want to keep in your relationship. Together, small things matter.", task: "promises", marker: [0, 0, 31] },
    { name: "THE MOONLIGHT STAGE", title: "Play our tiny love song 🎶", description: "Tap the glowing notes in the right order to light up the stage.", task: "serenade", marker: [30, 0, 16] },
    { name: "THE SECRET HOME", title: "Insert All 13 Keys 🏡🔑", description: "Bring all 13 collected keys here to unlock the secret pin code for the world treasure chest.", task: "final", marker: [20, 0, -20] }
];

const CHEST_POSITION = new THREE.Vector3(0, 0, -20); // Chest is at a distinct location in the world

const canvas = document.querySelector("#world"), scene = new THREE.Scene();
scene.background = new THREE.Color("#bfe6ed"); scene.fog = new THREE.Fog("#bfe6ed", 35, 100);

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 160); camera.position.set(0, 8, 15);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight(0xffffff, 0x789a72, 2)); const sun = new THREE.DirectionalLight(0xfff0d2, 2.7); sun.position.set(-12, 25, 12); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun);

const mat = (c, r = .85) => new THREE.MeshStandardMaterial({ color: c, roughness: r });

const ground = new THREE.Mesh(new THREE.PlaneGeometry(110, 110), mat("#8ecb9a")); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

const pathMat = mat("#f1d9ad"), trunkMat = mat("#9c6c51"), leafMats = [mat("#65ad85"), mat("#83c49a"), mat("#a5d6a7")], flowerMats = [mat("#ff8fb1"), mat("#fff1a6"), mat("#c2a6ff")];

for (let i = 0; i < 28; i++) { const z = 22 - i * 1.7, x = Math.sin(i * .32) * 4; const stone = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), pathMat); stone.rotation.x = -Math.PI / 2; stone.position.set(x, .025, z); stone.scale.set(1.25, .8, 1); scene.add(stone); }

function addTree(x, z, s = 1) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.22 * s, .34 * s, 2.1 * s, 7), trunkMat); t.position.set(x, 1.05 * s, z); t.castShadow = true; scene.add(t); const c = new THREE.Mesh(new THREE.SphereGeometry(1.25 * s, 9, 8), leafMats[Math.floor(Math.random() * leafMats.length)]); c.position.set(x, 2.35 * s, z); c.castShadow = true; scene.add(c); }

for (let i = 0; i < 58; i++) { const x = (Math.random() - .5) * 82, z = (Math.random() - .5) * 82; if (Math.abs(x) < 7 && z < 25 && z > -26) continue; addTree(x, z, .65 + Math.random() * .6); }

function addFlower(x, z, m) { const s = new THREE.Mesh(new THREE.CylinderGeometry(.035, .05, .5, 5), mat("#4e9b68")); s.position.set(x, .25, z); scene.add(s); const b = new THREE.Mesh(new THREE.SphereGeometry(.19, 8, 6), m); b.position.set(x, .55, z); scene.add(b); }

for (let i = 0; i < 110; i++) { const x = (Math.random() - .5) * 75, z = (Math.random() - .5) * 75; if (Math.abs(x) < 5 && z < 22 && z > -25) continue; addFlower(x, z, flowerMats[i % 3]); }

function addHouse(x, z, w, r, s = 1) { const g = new THREE.Group(), walls = new THREE.Mesh(new THREE.BoxGeometry(4 * s, 2.7 * s, 3.4 * s), mat(w)); walls.position.y = 1.35 * s; walls.castShadow = true; g.add(walls); const roof = new THREE.Mesh(new THREE.ConeGeometry(3.1 * s, 2 * s, 4), mat(r)); roof.position.y = 3.65 * s; roof.rotation.y = Math.PI / 4; g.add(roof); const door = new THREE.Mesh(new THREE.BoxGeometry(.8 * s, 1.5 * s, .12 * s), mat("#765246")); door.position.set(0, .75 * s, 1.76 * s); g.add(door); g.position.set(x, 0, z); scene.add(g); }

addHouse(-18, -19, "#ffe7d3", "#e78da6", 1.35); addHouse(19, 20, "#e2e9ff", "#8797d7", 1.25); addHouse(-20, 12, "#f7e4ff", "#ae83cf", .9); addHouse(20, -16, "#fff0b8", "#e2a765", .9);

// ---------------- TREASURE CHEST IN THE WORLD (present from beginning) ----------------
let chestGroup = null;
function addWorldChest(x, z) {
    chestGroup = new THREE.Group();
    const boxBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.1), mat("#8b5a2b"));
    boxBase.position.y = 0.5;
    boxBase.castShadow = true;
    chestGroup.add(boxBase);

    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 12, 1, false, 0, Math.PI), mat("#a06832"));
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 1.0, 0);
    lid.castShadow = true;
    chestGroup.add(lid);

    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.1), mat("#ffd700"));
    lock.position.set(0, 0.55, 0.56);
    chestGroup.add(lock);

    chestGroup.position.set(x, 0, z);
    scene.add(chestGroup);
}
addWorldChest(CHEST_POSITION.x, CHEST_POSITION.z);

// ---------------- CHARACTER + ANIMATION ----------------
const player = new THREE.Group();
player.position.set(0, 0, 20);
scene.add(player);

const CHARACTER_MODEL = './models/tara.glb';
const loader = new GLTFLoader();

let characterModel = null;
let characterMixer = null;
let walkAction = null;
let idleAction = null;
let activeNativeAction = null;
let hasNativeWalkAnimation = false;
let modelBaseY = 0;
let gaitTime = 0;
let proceduralBones = [];
let animationMoving = false;
let gaitBlend = 0;
const ARM_DOWN_ANGLE = 0.3;

const WALK_SPEED = 8.5;
const LEG_SWING = 0.43;
const KNEE_BEND = 0.72;
const ARM_SWING = 0.22;
const ELBOW_BEND = 0.24;
const HIP_SWAY = 0.035;
const BODY_BOB = 0.018;
const ANIMATION_SMOOTHNESS = 10;

function classifyCharacterBone(bone) {
    const n = (bone.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    const left = /^(?:l(?=collar|shldr|shoulder|upperarm|arm|forearm|hand|thigh|upleg|upperleg|shin|calf|lowerleg|foot|toe|leg))/.test(n) || /left/.test(n);
    const right = /^(?:r(?=collar|shldr|shoulder|upperarm|arm|forearm|hand|thigh|upleg|upperleg|shin|calf|lowerleg|foot|toe|leg))/.test(n) || /right/.test(n);

    let role = null;

    if (/hand|finger|thumb|wrist/.test(n)) role = "hand";
    else if (/forearm|lowerarm|elbow/.test(n)) role = "lowerArm";
    else if (/upperarm|shldr|shoulder/.test(n)) role = "upperArm";
    else if (/shin|calf|lowerleg|knee/.test(n)) role = "lowerLeg";
    else if (/thigh|upleg|upperleg|femur/.test(n)) role = "upperLeg";
    else if (/foot|toe|ankle/.test(n)) role = "foot";
    else if (/hips|pelvis|root/.test(n)) role = "hips";
    else if (/spine|chest|torso/.test(n)) role = "spine";
    else if (/neck|head/.test(n)) role = "head";

    if (!role) return null;

    return { bone, role, side: left ? -1 : right ? 1 : 0, baseRotation: bone.rotation.clone() };
}

function setNativeAnimation(moving) {
    if (!hasNativeWalkAnimation || moving === animationMoving) return;
    animationMoving = moving;
    const nextAction = moving ? walkAction : idleAction;

    if (!nextAction) {
        if (activeNativeAction) activeNativeAction.fadeOut(0.2);
        activeNativeAction = null;
        return;
    }

    nextAction.reset();
    nextAction.enabled = true;
    nextAction.setEffectiveWeight(1);
    nextAction.setEffectiveTimeScale(1);

    if (moving) nextAction.setLoop(THREE.LoopRepeat, Infinity);
    else nextAction.setLoop(THREE.LoopRepeat, Infinity);

    nextAction.play();

    if (activeNativeAction && activeNativeAction !== nextAction) {
        nextAction.crossFadeFrom(activeNativeAction, 0.25, false);
    } else {
        nextAction.fadeIn(0.25);
    }

    activeNativeAction = nextAction;
}

function dampBoneRotation(bone, target, dt, smoothness = ANIMATION_SMOOTHNESS) {
    bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, target.x, smoothness, dt);
    bone.rotation.y = THREE.MathUtils.damp(bone.rotation.y, target.y, smoothness, dt);
    bone.rotation.z = THREE.MathUtils.damp(bone.rotation.z, target.z, smoothness, dt);
}

function updateCharacterAnimation(dt, moving) {
    if (!characterModel) return;
    dt = Math.min(Math.max(dt, 0), 0.05);

    if (characterMixer) characterMixer.update(dt);

    if (hasNativeWalkAnimation) {
        setNativeAnimation(moving);
        if (moving) gaitTime += dt * WALK_SPEED;
        const nativeBob = moving ? Math.abs(Math.sin(gaitTime * 2)) * 0.018 : Math.sin(clock.elapsedTime * 1.5) * 0.004;
        characterModel.position.y = modelBaseY + nativeBob;
        return;
    }

    gaitBlend = THREE.MathUtils.damp(gaitBlend, moving ? 1 : 0, 7, dt);
    if (moving) gaitTime += dt * WALK_SPEED;

    const phase = gaitTime;
    const blend = gaitBlend;
    const forwardLean = 0.045 * blend;

    for (const item of proceduralBones) {
        const { bone, role, side, baseRotation } = item;
        let targetX = baseRotation.x;
        let targetY = baseRotation.y;
        let targetZ = baseRotation.z;

        const sidePhase = side > 0 ? Math.PI : 0;
        const legWave = Math.sin(phase + sidePhase);
        const forwardSwing = legWave;
        const backwardSwing = -legWave;
        const amount = blend;

        if (role === "upperLeg" && side !== 0) {
            targetX += forwardSwing * LEG_SWING * amount;
            targetY += side * 0.025 * amount;
        } else if (role === "lowerLeg" && side !== 0) {
            const kneePhase = Math.max(0, backwardSwing);
            targetX += kneePhase * KNEE_BEND * amount;
            targetY += side * 0.008 * amount;
        } else if (role === "foot" && side !== 0) {
            const footLift = Math.max(0, backwardSwing);
            targetX += -footLift * 0.20 * amount;
            targetZ += side * 0.015 * amount;
        } else if (role === "upperArm" && side !== 0) {
            targetX += -legWave * ARM_SWING * amount;
            targetZ += side * ARM_DOWN_ANGLE;
            targetY += side * 0.025 * amount;
        } else if (role === "lowerArm" && side !== 0) {
            targetX += -legWave * ARM_SWING * 0.45 * amount;
            const elbowFlex = 0.5 + 0.5 * Math.sin(phase + sidePhase + Math.PI / 3);
            targetZ += -side * ELBOW_BEND * (0.35 + elbowFlex * 0.65);
            targetZ += -side * 0.025 * legWave * amount;
        } else if (role === "hand" && side !== 0) {
            targetX += -legWave * 0.035 * amount;
        } else if (role === "hips") {
            targetZ += Math.sin(phase * 2) * HIP_SWAY * amount;
            targetY += Math.sin(phase) * 0.025 * amount;
        } else if (role === "spine") {
            targetZ += Math.sin(phase * 2) * 0.012 * amount;
            targetY += -Math.sin(phase) * 0.018 * amount;
            targetX += forwardLean;
            targetX += Math.sin(clock.elapsedTime * 1.5) * 0.006 * (1 - amount);
        } else if (role === "head") {
            targetZ += Math.sin(phase * 2) * 0.008 * amount;
            targetY += -Math.sin(phase) * 0.012 * amount;
        }

        dampBoneRotation(bone, { x: targetX, y: targetY, z: targetZ }, dt, ANIMATION_SMOOTHNESS);
    }

    const walkBob = Math.abs(Math.sin(phase * 2)) * BODY_BOB * blend;
    const idleBob = Math.sin(clock.elapsedTime * 1.5) * 0.004 * (1 - blend);

    characterModel.position.y = modelBaseY + walkBob + idleBob;
}

loader.load(
    CHARACTER_MODEL,
    (gltf) => {
        const model = gltf.scene;

        const originalBox = new THREE.Box3().setFromObject(model);
        const originalSize = originalBox.getSize(new THREE.Vector3());

        if (originalSize.y > 0) {
            model.scale.setScalar(2 / originalSize.y);
        }

        model.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(model);
        model.position.y -= scaledBox.min.y;
        modelBaseY = model.position.y;

        model.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
            if (object.isBone) {
                const info = classifyCharacterBone(object);
                if (info) proceduralBones.push(info);
            }
        });

        player.add(model);
        characterModel = model;

        const clips = gltf.animations || [];
        const walkClip = clips.find((clip) => /(walk|run|jog|locomotion)/i.test(clip.name));
        const idleClip = clips.find((clip) => /(idle|stand|breath|rest)/i.test(clip.name));

        if (walkClip) {
            characterMixer = new THREE.AnimationMixer(model);
            walkAction = characterMixer.clipAction(walkClip);
            idleAction = idleClip ? characterMixer.clipAction(idleClip) : null;
            hasNativeWalkAnimation = true;
            animationMoving = false;

            if (idleAction) {
                idleAction.setLoop(THREE.LoopRepeat, Infinity);
                idleAction.play();
                activeNativeAction = idleAction;
            }
        }
    },
    undefined,
    (error) => console.error("Error loading model", error)
);

const markerGroups = [], markerMeshes = [], unlocked = LEVELS.map((_, i) => i === 0), completed = LEVELS.map(() => false);

let currentTaskIndex = 0, collectedHearts = 0, nearestLevel = -1, isNearChest = false, modalOpen = false;

function makeMarker(level, i) { const g = new THREE.Group(), rm = new THREE.MeshStandardMaterial({ color: i === 0 ? "#ff7eac" : "#b8bacb", emissive: i === 0 ? "#ff5e9b" : "#5c6072", emissiveIntensity: 1.3 }); const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .09, 10, 32), rm); ring.rotation.x = Math.PI / 2; ring.position.y = .18; g.add(ring); const om = new THREE.MeshStandardMaterial({ color: i === 0 ? "#fff2a8" : "#c7c9d8", emissive: i === 0 ? "#ffce67" : "#777b90", emissiveIntensity: 1.7 }); const orb = new THREE.Mesh(new THREE.OctahedronGeometry(.48), om); orb.position.y = 1.5; g.add(orb); const beam = new THREE.Mesh(new THREE.CylinderGeometry(.03, .7, 3.2, 16, 1, true), new THREE.MeshBasicMaterial({ color: i === 0 ? "#ff9fbd" : "#b5b9ce", transparent: true, opacity: .15, side: THREE.DoubleSide })); beam.position.y = 1.65; g.add(beam); g.position.set(...level.marker); scene.add(g); markerGroups.push(g); markerMeshes.push({ ring, orb, rm, om, beam }); }

LEVELS.forEach(makeMarker);

const heartItems = []; function makeHeart(x, z) { const g = new THREE.Group(), h = new THREE.Mesh(new THREE.IcosahedronGeometry(.45, 1), new THREE.MeshStandardMaterial({ color: "#ff5d96", emissive: "#ff347b", emissiveIntensity: 1.2 })); h.scale.set(1, .85, .65); h.position.y = 1; g.add(h); const halo = new THREE.Mesh(new THREE.TorusGeometry(.68, .035, 8, 24), mat("#ffd4e3")); halo.position.y = 1; g.add(halo); g.position.set(x, 0, z); scene.add(g); heartItems.push({ group: g, collected: false }); }

makeHeart(-8, 8); makeHeart(6, 13); makeHeart(8, 5);

const $ = id => document.getElementById(id), taskModal = $("taskModal"), surpriseModal = $("surpriseModal"), interaction = $("interaction"), interactionText = $("interactionText"), toast = $("toast");

function showToast(s) { toast.textContent = s; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300); }

function updateProgress() {
    const n = completed.filter(Boolean).length;
    $("progressText").textContent = `${n} / ${LEVELS.length}`;
    $("progressBar").style.width = `${n / LEVELS.length * 100}%`;

    const firstUnfinished = completed.findIndex(done => !done);
    const i = firstUnfinished === -1 ? LEVELS.length - 1 : firstUnfinished;
    $("levelPill").textContent = `LEVEL ${i + 1} · ${LEVELS[i].name}`;
}

function refreshMarkers() { markerMeshes.forEach((m, i) => { const c = completed[i] ? "#8ed7a6" : unlocked[i] ? "#ff7eac" : "#b8bacb"; m.rm.color.set(c); m.rm.emissive.set(completed[i] ? "#3cba75" : unlocked[i] ? "#ff5e9b" : "#5c6072"); m.om.color.set(completed[i] ? "#b4f2c7" : unlocked[i] ? "#fff2a8" : "#c7c9d8"); m.om.emissive.set(completed[i] ? "#4dcb83" : unlocked[i] ? "#ffce67" : "#777b90"); m.beam.material.color.set(c); }); }

function closeTask() { taskModal.hidden = true; modalOpen = false; }

$("closeTask").addEventListener("click", closeTask);

function setTaskFeedback(s) { $("taskFeedback").textContent = s; }

function actionButton(label, fn) { const b = $("taskAction"); b.textContent = label; b.disabled = false; b.onclick = fn; }

const TOTAL_KEYS = 13;
let collectedKeys = 0;
const earnedKeys = Array(TOTAL_KEYS).fill(false);
const insertedKeySlots = Array(TOTAL_KEYS).fill(false);
let selectedKeyBox = -1;
let chestOverlay = null;

function createKeyHUD() {
    if (document.getElementById("keyHUD")) return;
    const hud = document.createElement("div");
    hud.id = "keyHUD";
    hud.style.cssText = "position:fixed;z-index:40;top:76px;right:16px;width:190px;max-width:calc(100vw - 32px);padding:12px 14px;border:1px solid rgba(255,255,255,.65);border-radius:16px;background:rgba(38,24,52,.82);color:#fff;font:600 13px/1.4 system-ui,sans-serif;box-shadow:0 8px 24px #28152c40;backdrop-filter:blur(8px);";
    hud.innerHTML = '<div style="display:flex;justify-content:space-between;gap:8px"><span>🔑 Treasure keys</span><strong id="keyCount">0 / 13</strong></div><div style="height:7px;margin-top:9px;background:#ffffff35;border-radius:99px;overflow:hidden"><div id="keyProgress" style="height:100%;width:0;background:linear-gradient(90deg,#ff8fba,#ffe28b);border-radius:99px;transition:width .25s"></div></div>';
    document.body.appendChild(hud);
}

function updateKeyHUD() {
    const count = document.getElementById("keyCount");
    const bar = document.getElementById("keyProgress");
    if (count) count.textContent = `${collectedKeys} / ${TOTAL_KEYS}`;
    if (bar) bar.style.width = `${collectedKeys / TOTAL_KEYS * 100}%`;
}

function awardLevelKey(levelIndex) {
    if (levelIndex < 0 || levelIndex >= TOTAL_KEYS || earnedKeys[levelIndex]) return;
    earnedKeys[levelIndex] = true;
    collectedKeys = earnedKeys.filter(Boolean).length;
    updateKeyHUD();
    showToast(`You earned key ${levelIndex + 1} of ${TOTAL_KEYS}! 🔑`);
}

function showFinalCodeMessage() {
    let layer = document.getElementById("finalCodeMessage");
    if (!layer) {
        layer = document.createElement("div");
        layer.id = "finalCodeMessage";
        layer.style.cssText = "position:fixed;inset:0;z-index:900;display:flex;align-items:center;justify-content:center;padding:18px;background:#1b1026d9;color:#fff;font-family:system-ui,sans-serif";
        document.body.appendChild(layer);
    }
    layer.innerHTML = `<div style="width:min(470px,100%);padding:30px 24px;border-radius:24px;text-align:center;background:linear-gradient(145deg,#492c50,#24172e);border:1px solid #ffd3e7a0;box-shadow:0 22px 70px #0008;max-height:90vh;overflow-y:auto">
        <div style="font-size:54px">🎉🔑💌</div>
        <h2 style="color:#ffd7e7;margin:10px 0">All 13 keys inserted!</h2>
        <p style="line-height:1.7">You unlocked Level 14! The secret PIN code for the world treasure chest has been revealed. Go find the chest in the world and enter this PIN to open it.</p>
        
        <!-- Secret Letter Section -->
        <div style="margin:20px 0;padding:16px;border-radius:16px;background:#00000030;border:1px solid #ffd7e750;text-align:left;font-size:14px;line-height:1.6;color:#ffe3f0">
            <div style="font-weight:bold;font-size:15px;color:#ffd778;margin-bottom:8px;text-align:center">✉️ A Secret Letter for You</div>
            <p style="margin:0 0 10px 0">Before you unlock the final chest, please go to the link below and watch the video.</p>
            <p style="margin:0 0 12px 0;padding:8px 12px;background:#ff4d7930;border-left:3px solid #ff4d79;border-radius:4px;font-size:13px">
                ⚠️ <strong>Important Instructions:</strong> Before watching the video, please <strong>be completely alone</strong> and <strong>use headphones</strong>. Do not share this video with others and do not watch it with another person!
            </p>
            <div style="text-align:center">
                <a href="https://youtu.be/lFaW86G9SgI" target="_blank" style="display:inline-block;padding:10px 18px;background:#ff8ab7;color:#28182c;text-decoration:none;font-weight:bold;border-radius:8px">▶ Watch the Secret Video First</a>
            </div>
        </div>

        <div style="margin:18px auto;padding:14px;border-radius:14px;background:#ffffff15;border:1px dashed #ffe08a">
            <div style="font-size:12px;letter-spacing:2px;color:#f7d9e8">WORLD CHEST PIN CODE</div>
            <div style="font-size:38px;font-weight:900;letter-spacing:9px;color:#ffe08a;margin-top:6px">2345</div>
        </div>
        <button id="finalCodeContinue" style="border:0;border-radius:13px;padding:12px 24px;background:linear-gradient(90deg,#ff8ab7,#ffd778);color:#28182c;font-weight:800;cursor:pointer">Find the chest 💖</button>
    </div>`;
    layer.style.display = "flex";
    modalOpen = true;
    layer.querySelector("#finalCodeContinue").onclick = () => { layer.style.display = "none"; modalOpen = false; showToast("Now locate the chest in the world and use PIN 2345! 🏡"); };
}

function finishLevel() {
    const i = currentTaskIndex;
    if (completed[i]) return;
    completed[i] = true;
    awardLevelKey(i);
    if (i + 1 < LEVELS.length) unlocked[i + 1] = true;
    closeTask();
    refreshMarkers();
    updateProgress();
    if (i < TOTAL_KEYS) showToast(`Level ${i + 1} complete! Next level unlocked ✨`);
}

function openTask(i) {
    if (!unlocked[i]) { showToast("🔒 Finish the previous level to unlock this one."); return; }
    if (completed[i] && i !== 13) { showToast("✓ You already completed this level!"); return; }

    currentTaskIndex = i; const l = LEVELS[i]; $("taskKicker").textContent = `LEVEL ${i + 1} · ${l.name}`; $("taskTitle").textContent = l.title; $("taskDescription").textContent = l.description; const c = $("taskContent"); c.innerHTML = ""; setTaskFeedback(""); taskModal.hidden = false; modalOpen = true; interaction.hidden = true;

    if (l.task === "memory") buildMemory(c);
    else if (l.task === "quiz") buildQuiz(c, [{ q: "Amader Somporke kon jinis ta tomar besi valo lage ?", opts: ["Ake Opor ke na bojha", "Ake Opor er proti understanding ", "Sob somoy jhogra "], correct: 1 }, { q: "Tomader Modhee Ke besi pagol ?", opts: ["Tumi nije", "Tomar bor moshai", "Kau noi"], correct: 1 }], "Pass quiz");
    else if (l.task === "hearts") { c.innerHTML = `<strong>Hearts collected: <span id="heartCount">${collectedHearts}</span> / 3</strong><p>Close this card and walk near each floating heart, then press E. Return here after collecting all three.</p>`; actionButton("Collect all 3 hearts first", () => { if (collectedHearts < 3) { setTaskFeedback("Find all three floating hearts first 💗"); return; } finishLevel(); }); $("taskAction").disabled = collectedHearts < 3; }
    else if (l.task === "ttt") buildTicTacToe(c);
    else if (l.task === "puzzle") buildPuzzle(c);
    else if (l.task === "quiz2") buildQuiz(c, [{ q: "Amar daoa kon dak nam ta tomar sob theke besi prio ?", opts: ["Puchki", "Sona", "Babu"], correct: 0 }, { q: "Amra Dujon Couple hisabe kotota valo ?", opts: ["-100%", "0%", "99.99%"], correct: 2 }], "Pass final quiz");
    else if (l.task === "flirty") buildFlirty(c);
    else if (l.task === "nickname") buildNickname(c);
    else if (l.task === "loveletter") buildLoveLetter(c);
    else if (l.task === "wouldyou") buildWouldYou(c);
    else if (l.task === "reaction") buildReaction(c);
    else if (l.task === "emoji") buildEmoji(c);
    else if (l.task === "promises") buildPromises(c);
    else if (l.task === "serenade") buildSerenade(c);
    else if (l.task === "final") buildLevel14KeyInsertion(c);
}

// ---------------- LEVEL 14: INSERT ALL 13 KEYS ----------------
function buildLevel14KeyInsertion(c) {
    const inserted = insertedKeySlots.filter(Boolean).length;
    c.innerHTML = `
        <strong>Insert all 13 keys to unlock Level 14 🔑</strong>
        <p>You have collected ${collectedKeys} / 13 keys. Select each key box below and insert them into Level 14.</p>
        <div style="font-weight:700;margin:10px 0">Keys inserted: <span id="insertedCountL14">${inserted}</span> / 13</div>
        <div id="keyBoxesL14" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(72px,1fr));gap:8px;margin:12px 0">
            ${earnedKeys.map((earned, i) => `
                <button type="button" data-l14key="${i}" ${insertedKeySlots[i] ? 'disabled' : ''} style="min-height:60px;border-radius:12px;border:1px solid ${selectedKeyBox === i ? '#ffe38a' : '#e7b6d0'};background:${insertedKeySlots[i] ? '#527e65' : '#ffffff18'};color:#fff;cursor:${insertedKeySlots[i] ? 'default' : 'pointer'};font-weight:700">
                    ${insertedKeySlots[i] ? '✓ Done' : selectedKeyBox === i ? '🔑 Selected' : `Key ${i + 1}`}
                </button>
            `).join('')}
        </div>
        <p id="keyHintL14" style="min-height:22px;color:#ffe4a8">${selectedKeyBox >= 0 ? `Key ${selectedKeyBox + 1} selected. Click below to insert.` : 'Select a key to insert.'}</p>
    `;

    c.querySelectorAll("[data-l14key]").forEach(btn => btn.addEventListener("click", () => {
        const i = Number(btn.dataset.l14key);
        if (insertedKeySlots[i]) return;
        selectedKeyBox = i;
        buildLevel14KeyInsertion(c);
    }));

    actionButton("Insert selected key 🔑", () => {
        if (selectedKeyBox < 0 || insertedKeySlots[selectedKeyBox]) {
            setTaskFeedback("Please select an uninserted key first.");
            return;
        }
        insertedKeySlots[selectedKeyBox] = true;
        selectedKeyBox = -1;

        if (insertedKeySlots.every(Boolean)) {
            finishLevel();
            showFinalCodeMessage();
        } else {
            buildLevel14KeyInsertion(c);
        }
    });
}

function buildMemory(c) {
    c.innerHTML = `
        <strong>Memory Match</strong>
        <p>Find all four pairs of similar photos.</p>
        <div class="memory-grid" id="memoryGrid"></div>
        <div class="mini-status" id="memoryStatus">Pairs found: 0 / 4</div>
    `;

    const images = [
        { pairId: "cat", src: "images/a1.jpg", alt: "Cat 1" },
        { pairId: "cat", src: "images/a2.jpg", alt: "Cat 2" },
        { pairId: "dog", src: "images/b1.jpg", alt: "Dog 1" },
        { pairId: "dog", src: "images/b2.jpg", alt: "Dog 2" },
        { pairId: "bird", src: "images/c1.jpg", alt: "Bird 1" },
        { pairId: "bird", src: "images/c2.jpg", alt: "Bird 2" },
        { pairId: "flower", src: "images/d1.jpg", alt: "Flower 1" },
        { pairId: "flower", src: "images/d2.jpg", alt: "Flower 2" }
    ];

    const cards = [...images];

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    let first = null, lock = false, pairs = 0;
    const grid = c.querySelector("#memoryGrid"), status = c.querySelector("#memoryStatus");

    cards.forEach(card => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-card";
        button.innerHTML = `<span class="card-back">?</span>`;
        button.dataset.pairId = card.pairId;

        button.onclick = () => {
            if (lock || button.disabled || button === first) return;

            button.innerHTML = `<img src="${card.src}" alt="${card.alt}">`;
            button.classList.add("flipped");

            if (!first) { first = button; return; }

            const previous = first;
            first = null;

            if (previous.dataset.pairId === button.dataset.pairId) {
                previous.classList.add("matched");
                button.classList.add("matched");
                previous.disabled = true;
                button.disabled = true;

                pairs++;
                status.textContent = `Pairs found: ${pairs} / 4`;

                if (pairs === 4) {
                    setTaskFeedback("Excellent! All four photo pairs found.");
                    actionButton("Unlock next level", finishLevel);
                }
            } else {
                lock = true;
                setTimeout(() => {
                    previous.innerHTML = `<span class="card-back">?</span>`;
                    button.innerHTML = `<span class="card-back">?</span>`;
                    previous.classList.remove("flipped");
                    button.classList.remove("flipped");
                    lock = false;
                }, 800);
            }
        };
        grid.appendChild(button);
    });

    actionButton("Keep matching…", () => {
        setTaskFeedback("Find all four matching photo pairs!");
    });
}

function buildQuiz(c, questions, buttonText) {
    let qi = 0, score = 0;
    function render() {
        const q = questions[qi];
        c.innerHTML = `<strong>Question ${qi + 1} of ${questions.length}</strong><p>${q.q}</p><div class="quiz-options">${q.opts.map((o, j) => `<label class="quiz-option"><input type="radio" name="quizAnswer" value="${j}"> ${o}</label>`).join("")}</div>`;
        actionButton(qi === questions.length - 1 ? buttonText : "Check answer", check);
    }

    function check() {
        const selected = c.querySelector('input[name="quizAnswer"]:checked');
        if (!selected) { setTaskFeedback("Choose an answer first."); return; }
        if (Number(selected.value) !== questions[qi].correct) { setTaskFeedback("Not quite — try again 💕"); return; }
        score++;
        if (qi < questions.length - 1) { qi++; setTaskFeedback("Correct! Next question."); render(); }
        else { setTaskFeedback("Perfect score!"); actionButton("Unlock next level", finishLevel); }
    }
    render();
}

function buildTicTacToe(c) {
    c.innerHTML = `<p class="mini-status" id="tttStatus">You are X. Get three in a row before the computer does.</p><div class="ttt" id="tttBoard"></div>`;
    let board = Array(9).fill(""), done = false;
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const status = c.querySelector("#tttStatus"), grid = c.querySelector("#tttBoard");

    function winner(b) { for (const line of wins) { const [a, d, e] = line; if (b[a] && b[a] === b[d] && b[a] === b[e]) return b[a]; } return b.every(Boolean) ? "draw" : null; }

    function render() { grid.innerHTML = ""; board.forEach((v, i) => { const b = document.createElement("button"); b.className = "ttt-cell"; b.textContent = v; b.disabled = !!v || done; b.onclick = () => move(i); grid.appendChild(b); }); }

    function endCheck() {
        const w = winner(board); if (!w) return false; done = true;
        if (w === "X") { status.textContent = "You won! Great move 🎉"; setTaskFeedback("Challenge passed."); actionButton("Unlock next level", finishLevel); }
        else if (w === "O") { status.textContent = "Computer won this round. Try again!"; actionButton("Play again", () => { board = Array(9).fill(""); done = false; setTaskFeedback(""); status.textContent = "You are X. Get three in a row!"; render(); }); }
        else { status.textContent = "It's a draw — try again to win."; actionButton("Play again", () => { board = Array(9).fill(""); done = false; setTaskFeedback(""); status.textContent = "You are X. Get three in a row!"; render(); }); }
        render(); return true;
    }

    function move(i) {
        if (done || board[i]) return; board[i] = "X"; if (endCheck()) return;
        const available = board.map((v, j) => v ? null : j).filter(v => v !== null); if (!available.length) { endCheck(); return; }
        let choice = available.find(j => { const b = board.slice(); b[j] = "O"; return winner(b) === "O"; });
        if (choice === undefined) choice = available.find(j => { const b = board.slice(); b[j] = "X"; return winner(b) === "X"; });
        if (choice === undefined) choice = available.includes(4) ? 4 : available[Math.floor(Math.random() * available.length)];
        board[choice] = "O"; endCheck(); render();
    }

    render(); actionButton("Play Tic-Tac-Toe", () => setTaskFeedback("Tap any square to make your move."));
}

function buildPuzzle(c) {
    c.innerHTML = `
        <p>Slide the tiles into numerical order. Place each tile in its correct position to reveal the picture.</p>
        <div class="photo-puzzle" id="puzzleGrid"></div>
        <div class="puzzle-note">Move the tiles to reveal the hidden image.</div>
        <div class="mini-status" id="puzzleStatus">Arrange tiles 1 to 8 in order.</div>
    `;

    const grid = c.querySelector("#puzzleGrid"), status = c.querySelector("#puzzleStatus");
    const imageFolder = "puzzle image/";
    const fullImage = imageFolder + "image0.jpg";

    let board = [1, 2, 3, 4, 5, 6, 7, 8, 0];

    function isSolved(b) { return b.every((v, i) => v === (i === 8 ? 0 : i + 1)); }

    do {
        board = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        for (let n = 0; n < 80; n++) {
            const z = board.indexOf(0);
            const neighbors = [z - 3, z + 3, ...(z % 3 !== 0 ? [z - 1] : []), ...(z % 3 !== 2 ? [z + 1] : [])].filter(v => v >= 0 && v < 9);
            const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
            [board[z], board[pick]] = [board[pick], board[z]];
        }
    } while (isSolved(board));

    function getNeighbors(z) { return [z - 3, z + 3, ...(z % 3 !== 0 ? [z - 1] : []), ...(z % 3 !== 2 ? [z + 1] : [])].filter(v => v >= 0 && v < 9); }

    function render() {
        grid.innerHTML = "";
        if (isSolved(board)) {
            const img = document.createElement("img");
            img.src = fullImage;
            img.alt = "Completed puzzle";
            img.className = "puzzle-complete-image";
            grid.appendChild(img);
            status.textContent = "Puzzle solved! 🎉";
            setTaskFeedback("You solved the puzzle.");
            actionButton("Unlock next level", finishLevel);
            return;
        }

        board.forEach((value, index) => {
            const tile = document.createElement("button");
            tile.className = "puzzle-tile" + (value === 0 ? " blank" : "");
            tile.type = "button";
            tile.disabled = value === 0;

            if (value !== 0) {
                if (value === index + 1) {
                    const img = document.createElement("img");
                    img.src = imageFolder + "image" + value + ".jpg";
                    img.alt = "Puzzle tile " + value;
                    img.className = "puzzle-tile-image";
                    tile.appendChild(img);
                    tile.classList.add("correct");
                } else {
                    tile.textContent = value;
                }

                tile.onclick = () => {
                    const blankIndex = board.indexOf(0);
                    if (getNeighbors(blankIndex).includes(index)) {
                        [board[blankIndex], board[index]] = [board[index], board[blankIndex]];
                        render();
                    }
                };
            }
            grid.appendChild(tile);
        });

        status.textContent = "Tiles correctly placed: " + board.filter((value, index) => value !== 0 && value === index + 1).length + " / 8";
    }

    render();
    actionButton("Keep solving…", () => setTaskFeedback("Place all eight tiles in numerical order."));
}

function buildFlirty(c) {
    c.innerHTML = `<div class="romance-banner">💋 <strong>Pick your vibe</strong></div><p>Choose one answer for each playful situation.</p><div class="romance-question"><strong>When I say “I miss you”…</strong><div class="quiz-options"><label class="quiz-option"><input type="radio" name="flirt1" value="0"> “Then come collect your hug tax.” 🤗</label><label class="quiz-option"><input type="radio" name="flirt1" value="1"> “I miss you more, cutie.” 💗</label><label class="quiz-option"><input type="radio" name="flirt1" value="2"> “Sending one forehead kiss immediately.” 😚</label></div></div><div class="romance-question"><strong>Our ideal cuddle plan?</strong><div class="quiz-options"><label class="quiz-option"><input type="radio" name="flirt2" value="0"> Blanket burrito, no escape. 🌯</label><label class="quiz-option"><input type="radio" name="flirt2" value="1"> Movie on, but we watch approximately 4 minutes. 🎬</label><label class="quiz-option"><input type="radio" name="flirt2" value="2"> Just stay close and talk all night. 🌙</label></div></div><div class="mini-status" id="flirtResult">Your answers unlock a tiny flirty note.</div>`;
    actionButton("Reveal my flirty note 😉", () => {
        if (!c.querySelector('input[name="flirt1"]:checked') || !c.querySelector('input[name="flirt2"]:checked')) { setTaskFeedback("Choose one answer in both situations first 💕"); return; }
        c.querySelector('#flirtResult').textContent = "Official diagnosis: dangerously cute, highly huggable, and permanently on my mind. 😘";
        setTaskFeedback("Certified cutie status unlocked!");
        actionButton("Unlock next level", finishLevel);
    });
}

function buildLoveLetter(c) {
    c.innerHTML = `<p>Complete this tiny note. Any answer is valid—make it sound like you.</p><div class="letter-paper">My Puchki, you make ordinary days feel <input id="letter1" class="love-input" placeholder="magical" maxlength="24">. My favourite thing is when we <input id="letter2" class="love-input" placeholder="laugh together" maxlength="30">. If I could give you one thing, it would be <input id="letter3" class="love-input" placeholder="a giant hug" maxlength="30">. And my favourite person will always be <strong>you 💗</strong>.</div><div class="mini-status" id="letterPreview">Your words will become a little keepsake.</div>`;
    actionButton("Seal the love letter 💌", () => {
        const a = c.querySelector('#letter1').value.trim(), b = c.querySelector('#letter2').value.trim(), d = c.querySelector('#letter3').value.trim();
        if (!a || !b || !d) { setTaskFeedback("Fill in all three blanks to seal your letter."); return; }
        c.querySelector('#letterPreview').textContent = `To Puchki: You make life ${a}; I love when we ${b}; and I owe you ${d}. Forever your favourite teammate. 💖`;
        actionButton("Unlock next level", finishLevel);
    });
}

function buildWouldYou(c) {
    const rounds = [{ q: "Choose our perfect evening", a: "Sunset walk and hand-holding 🌅", b: "Cozy blanket and a movie 🍿" }, { q: "Pick your cute surprise", a: "A handwritten love note 💌", b: "A surprise snack date 🍓" }, { q: "Your preferred affection", a: "A long warm hug 🤗", b: "A thousand tiny kisses 😚" }];
    let n = 0, answers = [];

    function render() {
        const r = rounds[n];
        c.innerHTML = `<strong>Round ${n + 1} of ${rounds.length}</strong><p>${r.q}</p><div class="choice-stack"><button class="choice-card" id="wouldA">${r.a}</button><button class="choice-card" id="wouldB">${r.b}</button></div><div class="mini-status">No wrong answers—this is your dream-date profile.</div>`;
        c.querySelector('#wouldA').onclick = () => pick(r.a);
        c.querySelector('#wouldB').onclick = () => pick(r.b);
    }

    function pick(v) {
        answers.push(v);
        if (n < rounds.length - 1) { n++; render(); setTaskFeedback("Cute choice! One more 💕"); }
        else {
            c.innerHTML = `<div class="romance-banner">🌹 Your dream-date recipe</div><p>${answers.join("<br><br>")}</p><p>Whatever we choose, the best part is getting to spend it together.</p>`;
            actionButton("Unlock next level", finishLevel);
        }
    }
    render();
    actionButton("Choose our date", () => setTaskFeedback("Tap one of the two date ideas."));
}

function buildNickname(c) {
    c.innerHTML = `
        <div class="romance-banner">💌 <strong>A nickname only we know</strong></div>
        <p>What special nickname does your life partner call you? Type it below.</p>
        <form id="nicknameForm" class="nickname-form">
            <input id="nicknameAnswer" class="love-input" type="text" maxlength="40" autocomplete="off" placeholder="Enter the nickname…" aria-label="Nickname answer">
            <button type="submit" class="choice-card">Check answer 💗</button>
        </form>
        <div id="nicknameResult" class="mini-status" aria-live="polite">Hint: it starts with “P” 😉</div>
        <div id="nicknameLetter" class="letter-paper" hidden></div>
    `;

    const form = c.querySelector("#nicknameForm"), input = c.querySelector("#nicknameAnswer"), result = c.querySelector("#nicknameResult"), letter = c.querySelector("#nicknameLetter");

    function similarity(a, b) {
        const aa = a.toLowerCase().replace(/[^a-z0-9]/g, "");
        const bb = b.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!aa || !bb) return 0;
        const previous = Array.from({ length: bb.length + 1 }, (_, i) => i);
        for (let i = 1; i <= aa.length; i++) {
            let diagonal = previous[0]; previous[0] = i;
            for (let j = 1; j <= bb.length; j++) {
                const old = previous[j];
                const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
                previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + cost);
                diagonal = old;
            }
        }
        return 1 - previous[bb.length] / Math.max(aa.length, bb.length);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const answer = input.value.trim();
        if (!answer) { result.textContent = "Type the nickname first, cutie 💕"; return; }
        if (similarity(answer, "Puchki") >= 0.8) {
            result.textContent = "You remembered it! This letter is just for you 💖";
            letter.hidden = false;
            letter.innerHTML = `
                <h3>To my Puchki 💌</h3>
                <p>My sweetest Puchki,</p>
                <p>That little name will always have a special place in my heart, because it reminds me of the warmth, laughter, and love you bring into my life.</p>
                <p>If I could choose my favourite place in the whole world, it would be right beside you. Thank you for being my smile on ordinary days and my favourite part of every memory.</p>
                <p>No matter how many adventures we go on, you will always be my favourite person and my sweetest Puchki.</p>
                <p><strong>Forever yours, with all my love 💗</strong></p>
            `;
            input.disabled = true;
            form.querySelector("button").disabled = true;
            setTaskFeedback("Nickname accepted! Your love letter is unlocked 💌");
            actionButton("Unlock next level", finishLevel);
        } else {
            letter.hidden = true;
            result.textContent = "Not quite, try the special nickname again 💕";
            input.focus();
        }
    });

    actionButton("Check my answer 💗", () => form.requestSubmit());
}

function buildReaction(c) {
    c.innerHTML = `
        <p>Catch as many falling hearts as you can in <strong>30 seconds</strong>. Use the left and right buttons or keyboard arrows. Every heart counts! 💗</p>
        <div class="reaction-game" style="position:relative;width:100%;max-width:440px;margin:12px auto;user-select:none">
            <div style="display:flex;justify-content:space-between;gap:12px;font-weight:700"><span id="reactionScore">💗 Hearts caught: 0</span><span id="reactionTime">⏱ 30s</span></div>
            <div id="catchField" style="position:relative;overflow:hidden;height:300px;margin-top:10px;border:2px solid #f3a7c5;border-radius:16px;background:linear-gradient(#fff1f7,#e7f5ff)">
                <div style="position:absolute;top:10px;left:0;right:0;text-align:center;color:#c15b8b;pointer-events:none">Catch the love! 💕</div>
                <div id="catchBucket" style="position:absolute;bottom:8px;left:calc(50% - 32px);width:64px;height:34px;display:flex;align-items:center;justify-content:center;font-size:34px;line-height:1;filter:drop-shadow(0 2px 2px #b56b8b)">🪣</div>
            </div>
            <div style="display:flex;justify-content:center;gap:22px;margin:12px 0"><button type="button" id="bucketLeft" class="choice-card">⬅️ Left</button><button type="button" id="bucketRight" class="choice-card">Right ➡️</button></div>
            <div class="mini-status" id="reactionStatus" aria-live="polite">Press Start to begin your 30-second love challenge.</div>
        </div>`;

    const field = c.querySelector("#catchField"), bucket = c.querySelector("#catchBucket"), scoreLabel = c.querySelector("#reactionScore"), timeLabel = c.querySelector("#reactionTime"), status = c.querySelector("#reactionStatus"), leftButton = c.querySelector("#bucketLeft"), rightButton = c.querySelector("#bucketRight");
    let score = 0, time = 30, bucketX = 0.5, started = false, ended = false, hearts = [], tickTimer = null, countdownTimer = null, spawnTimer = null;

    function positionBucket() { const maxX = Math.max(0, field.clientWidth - bucket.offsetWidth); bucket.style.left = `${bucketX * maxX}px`; }
    function moveBucket(direction) { if (ended) return; bucketX = Math.max(0, Math.min(1, bucketX + direction * 0.13)); positionBucket(); }
    leftButton.addEventListener("click", () => moveBucket(-1));
    rightButton.addEventListener("click", () => moveBucket(1));

    function onKeyDown(event) {
        if (ended || !modalOpen || currentTaskIndex !== 9) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); moveBucket(-1); }
        else if (event.key === "ArrowRight") { event.preventDefault(); moveBucket(1); }
    }
    window.addEventListener("keydown", onKeyDown);

    function spawnHeart() {
        if (ended) return;
        const heart = document.createElement("span");
        heart.textContent = ["💗", "💖", "💘", "💕", "💝"][Math.floor(Math.random() * 5)];
        heart.style.cssText = "position:absolute;top:-28px;left:0;font-size:25px;line-height:1;pointer-events:none;will-change:transform";
        const x = Math.random() * Math.max(0, field.clientWidth - 28);
        field.appendChild(heart);
        hearts.push({ element: heart, x, y: -28, speed: 95 + Math.random() * 75 });
    }

    function cleanup() {
        clearInterval(tickTimer); clearInterval(countdownTimer); clearInterval(spawnTimer);
        window.removeEventListener("keydown", onKeyDown);
        hearts.forEach(h => h.element.remove()); hearts = [];
    }

    function loveMessage(n) {
        if (n >= 25) return "Puchki, your love fills every little corner of my world. I feel unbelievably lucky to be loved by you. You are my favourite person, my safest place, and my sweetest adventure. 💖";
        if (n >= 16) return "Puchki, every heart you caught reminds me how much warmth you bring into my life. Your love makes ordinary days beautiful, and I would choose you again and again. 💗";
        if (n >= 8) return "Puchki, every heart is a tiny reminder that my love for you keeps growing. You make my world softer, brighter, and happier just by being in it. 💕";
        return "Puchki, no score could ever measure how much you mean to me. Even one little heart is a reminder that my favourite part of life is loving you. Always you. 💘";
    }

    function endGame() {
        if (ended) return;
        ended = true; cleanup(); leftButton.disabled = true; rightButton.disabled = true;
        status.innerHTML = `<strong>Time is up! You caught ${score} ${score === 1 ? "heart" : "hearts"}. 💗</strong><p style="line-height:1.6">${loveMessage(score)}</p>`;
        setTaskFeedback(`Your 30-second score: ${score} ${score === 1 ? "heart" : "hearts"}. Your love key is ready!`);
        actionButton("Collect my love key 🔑", finishLevel);
    }

    function startGame() {
        if (started || ended) return;
        started = true; status.textContent = "Catch as many hearts as you can! 💗";
        actionButton("Challenge in progress…", () => setTaskFeedback("Keep moving the bucket to catch falling hearts."));
        tickTimer = setInterval(() => {
            const dt = 1 / 30, fieldRect = field.getBoundingClientRect(), bucketRect = bucket.getBoundingClientRect();
            const bucketLeft = bucketRect.left - fieldRect.left, bucketRight = bucketLeft + bucketRect.width, bucketTop = bucketRect.top - fieldRect.top, bucketBottom = bucketTop + bucketRect.height;
            hearts = hearts.filter(heart => {
                heart.y += heart.speed * dt;
                heart.element.style.transform = `translate(${heart.x}px, ${heart.y}px)`;
                const caught = heart.y + 25 >= bucketTop && heart.y <= bucketBottom && heart.x + 25 >= bucketLeft && heart.x <= bucketRight;
                if (caught) { heart.element.remove(); score++; scoreLabel.textContent = `💗 Hearts caught: ${score}`; return false; }
                if (heart.y > field.clientHeight) { heart.element.remove(); return false; }
                return true;
            });
        }, 1000 / 30);
        countdownTimer = setInterval(() => { time--; timeLabel.textContent = `⏱ ${time}s`; if (time <= 0) endGame(); }, 1000);
        spawnHeart(); spawnTimer = setInterval(spawnHeart, 520);
    }

    if (typeof ResizeObserver !== "undefined") { const observer = new ResizeObserver(positionBucket); observer.observe(field); const oldCleanup = cleanup; cleanup = function () { observer.disconnect(); oldCleanup(); }; }
    positionBucket(); actionButton("Start catching hearts 💘", startGame);
}

function buildEmoji(c) {
    const qs = [{ q: "🌙 + 🤗 = ?", opts: ["A cozy goodnight hug", "A beach picnic", "A dance contest"], a: 0 }, { q: "🍓 + 🎬 + 🛋️ = ?", opts: ["A study session", "A cozy movie date", "A mountain hike"], a: 1 }, { q: "💌 + 💗 + ♾️ = ?", opts: ["A secret code for forever love", "A shopping list", "A weather report"], a: 0 }];
    buildQuiz(c, qs.map(x => ({ q: x.q, opts: x.opts, correct: x.a })), "Decode our secret");
}

function buildPromises(c) {
    const choices = ["All time message kore debo 👂", "Bina karon e Jhogra Korbo na  🕯️", "Sob Somoy valobasbo 💘", "Khusnuti korbo but kosto debo na  🤍", "Sob somoy valo valo ranna kore khaoabo 🥳", "Sob somoy tomar kotha mane cholbo  💞"];
    c.innerHTML = `<p>Pick exactly <strong>three</strong> little promises. These are sweet reminders, not pressure or a test.</p><div class="promise-list">${choices.map((x, i) => `<label class="promise-choice"><input type="checkbox" value="${i}"> ${x}</label>`).join("")}</div><div class="mini-status" id="promiseCount">0 / 3 selected</div>`;

    c.querySelectorAll('input[type="checkbox"]').forEach(box => box.addEventListener('change', () => {
        const checked = [...c.querySelectorAll('input[type="checkbox"]:checked')];
        if (checked.length > 3) { box.checked = false; return; }
        c.querySelector('#promiseCount').textContent = `${[...c.querySelectorAll('input[type="checkbox"]:checked')].length} / 3 selected`;
    }));

    actionButton("Plant our promises 🌱", () => {
        const selected = [...c.querySelectorAll('input[type="checkbox"]:checked')];
        if (selected.length !== 3) { setTaskFeedback("Choose exactly three promises first."); return; }
        c.innerHTML = `<div class="romance-banner">🌳 Our little promise tree</div><ul>${selected.map(x => `<li>${choices[Number(x.value)]}</li>`).join("")}</ul><p>Little things, repeated with love, become a beautiful life.</p>`;
        actionButton("Unlock next level", finishLevel);
    });
}

function buildSerenade(c) {
    const notes = ["💗", "🎵", "🌙", "💞"]; const sequence = [0, 2, 1, 3]; let input = [], playing = false;
    c.innerHTML = `<p>Remember the glowing note pattern, then repeat it in order. Press “Show pattern” to begin.</p><div class="note-row">${notes.map((n, i) => `<button class="note-button" data-note="${i}">${n}</button>`).join("")}</div><div class="mini-status" id="serenadeStatus">Your tiny love song has four notes.</div>`;

    const status = c.querySelector('#serenadeStatus');
    function flash(i) { const b = c.querySelector(`[data-note="${i}"]`); b.classList.add('note-glow'); setTimeout(() => b.classList.remove('note-glow'), 420); }

    c.querySelectorAll('.note-button').forEach(b => b.onclick = () => {
        if (playing) return;
        const i = Number(b.dataset.note);
        input.push(i); flash(i);
        if (i !== sequence[input.length - 1]) { input = []; status.textContent = "Oops, the melody slipped! Show the pattern and try again."; return; }
        if (input.length === sequence.length) {
            status.textContent = "Our love song is complete! 🎶";
            setTaskFeedback("Melody mastered!");
            actionButton("Unlock next level", finishLevel);
        }
    });

    actionButton("Show pattern 🎶", () => {
        playing = true; input = []; let j = 0; status.textContent = "Watch carefully…";
        const step = () => {
            if (j >= sequence.length) { playing = false; status.textContent = "Now repeat the pattern!"; return; }
            flash(sequence[j++]); setTimeout(step, 650);
        };
        step();
    });
}

// ---------------- WORLD TREASURE CHEST OVERLAY ----------------
function ensureChestOverlay() {
    if (chestOverlay) return chestOverlay;
    chestOverlay = document.createElement("div");
    chestOverlay.id = "treasureOverlay";
    chestOverlay.style.cssText = "position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:18px;background:radial-gradient(circle at top,#4d2b58eF,#170f25f5);color:#fff;font-family:system-ui,sans-serif;overflow:auto";
    document.body.appendChild(chestOverlay);
    return chestOverlay;
}

function openTreasureChest() {
    if (modalOpen) return;
    modalOpen = true;
    const overlay = ensureChestOverlay();
    overlay.style.display = "flex";
    renderWorldChestPIN();
}

function closeTreasureOverlay() {
    if (chestOverlay) chestOverlay.style.display = "none";
    modalOpen = false;
}

function renderWorldChestPIN() {
    const overlay = ensureChestOverlay();
    overlay.innerHTML = `
        <div style="width:min(520px,100%);background:linear-gradient(145deg,#382342,#21182e);border:1px solid #f4c9df80;border-radius:24px;padding:clamp(22px,5vw,36px);box-shadow:0 24px 90px #0008;text-align:center">
            <div style="font-size:58px;animation:treasurePulse 1.8s infinite">🧰</div>
            <h2 style="color:#ffd7e7">The World Treasure Chest</h2>
            <p style="line-height:1.7;color:#f4e7f1">A strong PIN lock guards this chest. Enter the 4-digit password you received after completing Level 14.</p>
            <form id="treasureCodeForm">
                <input id="treasureCodeInput" type="text" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="Enter PIN code" aria-label="Treasure chest PIN code" style="box-sizing:border-box;width:100%;padding:14px;border-radius:12px;border:1px solid #e6b9d0;background:#fff;color:#26172d;font-size:20px;text-align:center;letter-spacing:8px">
                <p id="treasureCodeFeedback" aria-live="polite" style="min-height:22px;color:#ffd0d0"></p>
                <button type="submit" style="border:0;border-radius:13px;padding:12px 24px;background:linear-gradient(90deg,#ff8ab7,#ffd778);color:#28182c;font-weight:800;cursor:pointer">Unlock Chest 🔓</button>
                <button type="button" id="chestClose" style="border:1px solid #ffffff55;border-radius:13px;padding:12px 18px;background:transparent;color:#fff;cursor:pointer">Close</button>
            </form>
        </div>
    `;

    overlay.querySelector("#chestClose").onclick = closeTreasureOverlay;
    overlay.querySelector("#treasureCodeForm").onsubmit = event => {
        event.preventDefault();
        const input = overlay.querySelector("#treasureCodeInput");
        const feedback = overlay.querySelector("#treasureCodeFeedback");
        if (input.value.trim() !== "2345") {
            feedback.textContent = "Wrong PIN! Finish Level 14 to receive the correct code.";
            input.value = "";
            input.focus();
            return;
        }
        renderWorldChestLetter();
    };
}

function renderWorldChestLetter() {
    const overlay = ensureChestOverlay();
    overlay.innerHTML = `
        <div style="width:min(620px,100%);max-height:92vh;overflow:auto;background:linear-gradient(145deg,#fff4e9,#ffe0ed);border:1px solid #fff;border-radius:22px;padding:clamp(22px,5vw,38px);box-shadow:0 24px 90px #0008;color:#39233a;text-align:left;animation:treasureReveal .8s ease-out">
            <div style="text-align:center;font-size:50px">💌</div>
            <p style="font-family:Georgia,serif;font-size:18px;line-height:1.9;white-space:pre-line">My dearest Puchki,

If you are reading this, the old chest has finally opened. The real treasure was never gold or jewels. It was the patience, laughter, care, and love you brought with you on this little journey.

Here is your final secret riddle:

<strong>“I am a three-digit number. My first digit is the number of corners on a triangle. My middle digit is the number of noses a person usually has. My final digit is the number of points on a classic five-pointed star. Put the three digits together, in that order, and you will know what to enter.”</strong>


With all my love,
Someone who chooses you, every day. 💖</p>
            <div style="text-align:center;margin-top:20px">
                <button id="finishTreasure" type="button" style="border:0;border-radius:13px;padding:12px 24px;background:linear-gradient(90deg,#ff8ab7,#ffd778);color:#28182c;font-weight:800;cursor:pointer">Keep this memory 💞</button>
            </div>
        </div>
    `;

    overlay.querySelector("#finishTreasure").onclick = () => {
        closeTreasureOverlay();
        surpriseModal.hidden = false;
        modalOpen = true;
        $("surpriseMessage").textContent = `${SURPRISE_MESSAGE}\n\nYou are my favourite treasure, Puchki. 💖`;
        player.position.set(0, 0, 20); yaw = 0;
    };
}

function addTreasureStyles() {
    if (document.getElementById("treasureStyles")) return;
    const style = document.createElement("style");
    style.id = "treasureStyles";
    style.textContent = "@keyframes treasureReveal{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes treasurePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}#treasureOverlay button:focus-visible,#treasureOverlay input:focus-visible{outline:3px solid #ffe38a;outline-offset:3px}#treasureOverlay button:disabled{opacity:.65}";
    document.head.appendChild(style);
}

function collectHeart(item) { if (item.collected) return; item.collected = true; item.group.visible = false; collectedHearts++; showToast(`Heart collected! ${collectedHearts} / 3 💗`); const count = document.querySelector("#heartCount"); if (count) count.textContent = collectedHearts; if (collectedHearts === 3 && currentTaskIndex === 2) { $("taskAction").disabled = false; $("taskAction").textContent = "Complete level"; setTaskFeedback("All hearts found! Return to the marker."); } }

function interact() {
    if (isNearChest) {
        openTreasureChest();
        return;
    }
    if (nearestLevel >= 0) {
        if (!unlocked[nearestLevel]) {
            showToast("🔒 Complete the previous level first.");
            return;
        }
        if (nearestLevel === 2 && !completed[2]) { openTask(2); return; }
        openTask(nearestLevel);
        return;
    }
    for (const item of heartItems) {
        if (!item.collected && player.position.distanceTo(item.group.position) < 2.5) { collectHeart(item); return; }
    }
    showToast("Explore the world and look for a glowing marker or treasure chest.");
}

$("closeSurprise").addEventListener("click", () => { surpriseModal.hidden = true; modalOpen = false; player.position.set(0, 0, 20); yaw = 0; showToast("The world is yours to explore 💖"); });

const keys = {}; let yaw = 0, pitch = .18, dragging = false, lastPointer = { x: 0, y: 0 }, zoom = 1;

window.addEventListener("keydown", e => { const k = e.key.toLowerCase(); keys[k] = true; if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault(); if (k === "e" && !modalOpen) interact(); if (k === "escape" && !taskModal.hidden) closeTask(); }); window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

canvas.addEventListener("pointerdown", e => { dragging = true; lastPointer = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); }); canvas.addEventListener("pointerup", () => dragging = false); canvas.addEventListener("pointermove", e => { if (!dragging || modalOpen) return; const dx = e.clientX - lastPointer.x, dy = e.clientY - lastPointer.y; yaw -= dx * .005; pitch = THREE.MathUtils.clamp(pitch + dy * .003, -.05, .75); lastPointer = { x: e.clientX, y: e.clientY }; }); canvas.addEventListener("wheel", e => zoom = THREE.MathUtils.clamp(zoom + e.deltaY * .001, .65, 1.7), { passive: true });

const clock = new THREE.Clock(), desiredCamera = new THREE.Vector3(), lookTarget = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.04);
    const move = new THREE.Vector3();
    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    if (!modalOpen) {
        if (keys.w || keys.arrowup) move.addScaledVector(forward, -1);
        if (keys.s || keys.arrowdown) move.addScaledVector(forward, 1);
        if (keys.a || keys.arrowleft) move.addScaledVector(right, -1);
        if (keys.d || keys.arrowright) move.addScaledVector(right, 1);

        if (move.lengthSq()) {
            move.normalize();
            player.position.addScaledVector(move, dt * 7);
            player.rotation.y = Math.atan2(move.x, move.z);
        }
    }

    const isMoving = !modalOpen && move.lengthSq() > 0;
    updateCharacterAnimation(dt, isMoving);

    player.position.x = THREE.MathUtils.clamp(player.position.x, -48, 48);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -48, 48);

    markerGroups.forEach((g, i) => {
        g.position.y = Math.sin(clock.elapsedTime * 2.1 + i) * 0.12;
        markerMeshes[i].orb.rotation.y += dt * 1.2;
        markerMeshes[i].orb.rotation.x += dt * 0.5;
    });

    heartItems.forEach((it, i) => {
        if (!it.collected) {
            it.group.position.y = Math.sin(clock.elapsedTime * 2 + i * 2) * 0.14;
            it.group.rotation.y += dt * 0.7;
        }
    });

    nearestLevel = -1;
    let nd = Infinity;
    markerGroups.forEach((g, i) => {
        const d = player.position.distanceTo(
            new THREE.Vector3(LEVELS[i].marker[0], 0, LEVELS[i].marker[2])
        );
        if (d < nd) {
            nd = d;
            nearestLevel = i;
        }
    });
    if (nd > 3.1) nearestLevel = -1;

    // Check distance to world treasure chest
    const distToChest = player.position.distanceTo(CHEST_POSITION);
    isNearChest = distToChest < 3.0;

    let nearHeart = false;
    for (const it of heartItems) {
        if (!it.collected && player.position.distanceTo(it.group.position) < 2.5) {
            nearHeart = true;
        }
    }

    if (!modalOpen && isNearChest) {
        interaction.hidden = false;
        interactionText.textContent = 'Press E to open Treasure Chest 🧰';
    } else if (!modalOpen && nearHeart) {
        interaction.hidden = false;
        interactionText.textContent = 'Collect floating heart';
    } else if (!modalOpen && nearestLevel >= 0) {
        interaction.hidden = false;
        interactionText.textContent = unlocked[nearestLevel]
            ? (completed[nearestLevel]
                ? 'Level completed ✓'
                : `Press E to enter ${LEVELS[nearestLevel].name}`)
            : `🔒 ${LEVELS[nearestLevel].name} is locked`;
    } else {
        interaction.hidden = true;
    }

    const dist = 10 * zoom;
    desiredCamera.set(
        player.position.x + Math.sin(yaw) * dist,
        player.position.y + 5 + pitch * 5,
        player.position.z + Math.cos(yaw) * dist
    );
    camera.position.lerp(desiredCamera, 1 - Math.pow(0.001, dt));
    lookTarget.set(player.position.x, player.position.y + 1.1, player.position.z);
    camera.lookAt(lookTarget);
    renderer.render(scene, camera);
}

addTreasureStyles(); createKeyHUD(); updateKeyHUD(); refreshMarkers(); updateProgress(); animate(); window.addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });