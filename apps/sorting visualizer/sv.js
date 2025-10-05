const visualizer = document.getElementById("visualizer");
const speedBar = document.getElementById("speed-bar");
const playButton = document.getElementById("play-button");
const reloadButton = document.getElementById("reload-button");
const chooseSort = document.getElementById("sorting-type");
const muteButton = document.getElementById("mute-button");

let array = generateRandomArray(40);
let swaps = [];
let muteSound = true;
let isPlaying = false;
let currentIndex = 0;
let timeout = null;
let audioCtx = null;
let basicBarColor = "#000000";
let swapBarColor = "#ff0000ff";

//Based on documentation from https://github.com/simonwep/pickr

const basicPickr = Pickr.create({
  el: "#basic-bar-color",
  theme: "nano",
  default: "#000000",
  inline: false,
  padding: 10,
  position: "left-end",
  appendTo: document.body,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      input: true,
    },
  },
});
const swapPickr = Pickr.create({
  el: "#swapping-bar-color",
  theme: "nano",
  default: "#ff0000ff",
  position: "right-end",
  padding: 20,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      input: true,
    },
  },
});

function updateBarColor() {
  const bars = visualizer.children;
  for (const bar of bars) {
    if (bar.dataset.isSwapping === "true") {
      bar.style.backgroundColor = swapBarColor;
    } else {
      bar.style.backgroundColor = basicBarColor;
    }
  }
}

basicPickr.on("change", function (color) {
  basicBarColor = color.toHEXA().toString();
  basicPickr.applyColor();
  updateBarColor();
});

swapPickr.on("change", function (color) {
  swapBarColor = color.toHEXA().toString();
  swapPickr.applyColor();
  updateBarColor();
});

generateBars(array, visualizer);
swaps = bubbleSort([...array]);

/* Copied from https://www.youtube.com/watch?v=_AwSlHlpFuc&t=1s
Sorting Visualizer with Sound (JavaScript Tutorial) video
*/

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }

  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function swapChildren([left, right], container) {
  const children = container.children;
  const barLeft = children[left];
  const barRight = children[right];
  container.insertBefore(barRight, barLeft);
  for (const bar of children) {
    bar.style.backgroundColor = basicBarColor;
    bar.dataset.isSwapping = "false";
  }
  barLeft.style.backgroundColor = swapBarColor;
  barRight.style.backgroundColor = swapBarColor;

  barLeft.dataset.isSwapping = "true";
  barRight.dataset.isSwapping = "true";
}

function animate() {
  if (currentIndex >= swaps.length) {
    isPlaying = false;
    playButton.innerHTML = "&#9658";
    playButton.style.backgroundColor = "green";
    return;
  }
  const indicies = swaps[currentIndex];
  swapChildren(indicies, visualizer);
  currentIndex++;

  if (!muteSound) {
    playNote(50 + indicies[0] * 150);
    playNote(50 + indicies[1] * 150);
  }

  const delay = Number(speedBar.max) - Number(speedBar.value);
  timeout = setTimeout(animate, delay);
}

function bubbleSort(array) {
  const swaps = [];
  let somethingChanged;
  do {
    somethingChanged = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i - 1] > array[i]) {
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        somethingChanged = true;
        swaps.push([i - 1, i]);
      }
    }
  } while (somethingChanged);
  return swaps;
}

/*
Copied from https://www.geeksforgeeks.org/dsa/insertion-sort-algorithm/
with adding indicies to swaps array.
*/

function insertionSort(array) {
  const swaps = [];
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      swaps.push([j, j + 1]);
      j = j - 1;
    }
    array[j + 1] = key;
  }
  return swaps;
}

function generateRandomArray(size) {
  const array = new Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = Math.random();
  }
  return array;
}

function generateBars(array, container) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.backgroundColor = basicBarColor;
    bar.style.height = array[i] * 100 + "%";
    container.appendChild(bar);
  }
}

playButton.addEventListener("click", function () {
  if (!isPlaying) {
    isPlaying = true;
    playButton.innerHTML = "||";
    playButton.style.backgroundColor = "red";
    animate();
  } else {
    isPlaying = false;
    playButton.innerHTML = "&#9658";
    playButton.style.backgroundColor = "green";
    clearTimeout(timeout);
  }
});

function resetAnimation() {
  clearTimeout(timeout);
  isPlaying = false;
  currentIndex = 0;
  playButton.innerHTML = "&#9658";
  playButton.style.backgroundColor = "green";
}

function selectSortingType() {
  if (chooseSort.value === "bubble-sort") {
    swaps = bubbleSort([...array]);
  } else if (chooseSort.value === "insertion-sort") {
    swaps = insertionSort([...array]);
  }
}

reloadButton.addEventListener("click", function () {
  resetAnimation();
  array = generateRandomArray(40);
  generateBars(array, visualizer);
  selectSortingType();
});

muteButton.addEventListener("click", function () {
  const muteIcon = muteButton.querySelector("i");
  if (muteSound) {
    muteIcon.classList.remove("fa-volume-mute");
    muteIcon.classList.add("fa-volume-high");
  } else {
    muteIcon.classList.remove("fa-volume-high");
    muteIcon.classList.add("fa-volume-mute");
  }
  muteSound = !muteSound;
});

chooseSort.addEventListener("change", function () {
  resetAnimation();
  array = generateRandomArray(40);
  generateBars(array, visualizer);
  selectSortingType();
});
