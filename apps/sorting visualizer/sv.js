const array = generateRandomArray(40);    
generateBars(array,visualizer);
const swaps = bubbleSort(array);
animate(swaps);


function swapChildren([left, right],container){
  const children = container.children;
  const barLeft = children[left];
  const barRight = children[right];
  container.insertBefore(barRight, barLeft);
  for (const bar of children){
    bar.style.backgroundColor = "";
  }
  barLeft.style.backgroundColor = "red";
  barRight.style.backgroundColor = "red";
}

function animate(swaps){
  if (swaps.length == 0) {
    return;
  }
  const indicies = swaps.shift();
  swapChildren(indicies,visualizer);  
  setTimeout(function() {
  animate(swaps);
  }, 100);
}

function  bubbleSort(array){
  const swaps = [];
  let somethingChanged;
  do{
    somethingChanged = false;
    for(let i = 1; i < array.length;i++){
      if (array[i - 1] > array[i]){
        [array[i-1], array[i]] = [array[i], array[i-1]];
        somethingChanged = true;
        swaps.push([i-1, i]);
      } 
    }
  } while (somethingChanged == true);
  return swaps;
}

function generateRandomArray(size){
  const array = new Array(size);
  for (let i = 0; i  < size; i++){
    array[i] = Math.random();
  }
  return array; 
}

function generateBars(array, container){
  for (let i = 0; i < array.length;i++){
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = array[i] * 100 + "%";
    visualizer.appendChild(bar);
  }
}