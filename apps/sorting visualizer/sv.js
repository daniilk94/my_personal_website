const visualizer = document.getElementById("visualizer");
const swappingBarColor = document.getElementById("swapping-bar-color");
const basicBarColor = document.getElementById("basic-bar-color");
const speedBar = document.getElementById("speed-bar");
const playButton = document.getElementById("play-button");
const reloadButton = document.getElementById("reload-button");
const chooseSort = document.getElementById("sorting-type");

let array = generateRandomArray(40);
let swaps = [];
let isPlaying = false;
let isPaused = false;
let currentIndex = 0;
let timeout = null;
let audioCtx = null;

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
    bar.style.backgroundColor = basicBarColor.value;
  }
  barLeft.style.backgroundColor = swappingBarColor.value;
  barRight.style.backgroundColor = swappingBarColor.value;
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

  playNote(100 + indicies[0] * 250);
  playNote(100 + indicies[1] * 250);

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
    bar.style.backgroundColor = basicBarColor.value;
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
  } else if (!isPaused) {
    isPaused = true;
    playButton.innerHTML = "&#9658";
    playButton.style.backgroundColor = "green";
    clearTimeout(timeout);
  } else {
    isPaused = false;
    playButton.innerHTML = "||";
    playButton.style.backgroundColor = "red";
    animate();
  }
});

reloadButton.addEventListener("click", function () {
  clearTimeout(timeout);
  isPlaying = false;
  isPaused = false;
  currentIndex = 0;
  playButton.innerHTML = "&#9658";
  playButton.style.backgroundColor = "green";
  array = generateRandomArray(40);
  generateBars(array, visualizer);

  if (chooseSort.value === "bubble-sort") {
    swaps = bubbleSort([...array]);
  } else if (chooseSort.value === "insertion-sort") {
    swaps = insertionSort([...array]);
  }
});

chooseSort.addEventListener("change", function () {
  clearTimeout(timeout);
  isPlaying = false;
  isPaused = false;
  currentIndex = 0;

  array = generateRandomArray(40);
  generateBars(array, visualizer);

  if (chooseSort.value === "bubble-sort") {
    swaps = bubbleSort([...array]);
  } else if (chooseSort.value === "insertion-sort") {
    swaps = insertionSort([...array]);
  }

  playButton.innerHTML = "&#9658";
  playButton.style.backgroundColor = "green";
});
