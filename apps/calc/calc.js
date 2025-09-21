let display = document.getElementById("display");
const mainContainer = document.getElementById("calculator-flex");
const modeSelector = document.getElementById("chooseMode");

//default mode
window.addEventListener("DOMContentLoaded", function() {
  const template = document.getElementById("basicMode-template");
  const clone = template.content.cloneNode(true);
  document.getElementById("calculator-flex").appendChild(clone);
  basicModeScript();
})

//switching mode with radioButton
modeSelector.addEventListener("change", function (e){
  let nextTemplate;
  let cloneTemplate;
  display.value = "";
  const currentMode = mainContainer.querySelector("#basicMode-container, #advancedMode-container, #pythMode-container");
  if (currentMode){
    currentMode.remove();
  }

  if (e.target.value == "basic"){
    nextTemplate = document.getElementById("basicMode-template");
    cloneTemplate = nextTemplate.content.cloneNode(true);
    document.getElementById("calculator-flex").appendChild(cloneTemplate);
    basicModeScript();
  }
  else if (e.target.value == "advanced"){
    nextTemplate = document.getElementById("advancedMode-template");
    cloneTemplate = nextTemplate.content.cloneNode(true);
    document.getElementById("calculator-flex").appendChild(cloneTemplate);
    advancedModeScript();
  }
  else if (e.target.value == "pyth"){
    nextTemplate = document.getElementById("pythMode-template");
    cloneTemplate = nextTemplate.content.cloneNode(true);
    document.getElementById("calculator-flex").appendChild(cloneTemplate);
    pythModeScript();
  }
});

//Some math functions
function summary(a, b){
  return a+b;
}
function subtraction(a, b){
  return a-b;
}
function multiplication(a, b){
  return a*b;
}
function divison(a, b){
  if (b == 0){
    return "Division by 0!";
  }
  return a/b;
}
function hypotenuse(a, b){
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}



//Basic Mode
function basicModeScript(){
  const container = document.getElementById("basicMode-container");
  let basicModeButtons = container.querySelectorAll(".button");

  for (let i = 0; i < basicModeButtons.length; i++){
    let button = basicModeButtons[i];

    button.addEventListener("click", function (){
      const valueA = Number(document.getElementById("inputNumberA").value);
      const valueB = Number(document.getElementById("inputNumberB").value);
      if (button.value == "sum"){
        display.value = summary(valueA, valueB);
      }
      else if (button.value == "subtr"){
        display.value = subtraction(valueA, valueB);
      }
      else if (button.value == "mult"){
        display.value = multiplication(valueA, valueB);
      }
      else if (button.value == "div"){
        display.value = divison(valueA, valueB);
      }
    });
  }
}

//AdvancedMode
function advancedModeScript(){
  const container = document.getElementById("advancedMode-container");
  let advancedModeButtons = container.querySelectorAll(".button");
  for (let i = 0; i < advancedModeButtons.length; i++){
    let button = advancedModeButtons[i];

    button.addEventListener("click", function(){
      if(button.classList.contains("button-num") || button.classList.contains("button-operator")){
        display.value += button.value;
      }
      else if(button.classList.contains("button-clear")){
        display.value="";
      }
      else if(button.classList.contains("button-result")){
        if(eval(display.value) == "Infinity"){
          display.value = "Division by 0!"
        }
        else{
          display.value = eval(display.value);
        }
      }
      else if(button.id == "buttonPow2"){
        display.value = eval(Math.pow(display.value, 2));
      }
      else if(button.id == "buttonSqrt"){
        display.value = eval(Math.sqrt(display.value));
      }
      else if(button.id == "button-back"){
        display.value = display.value.slice(0, -1);
      }
    });
  }
}

//PythMode
function pythModeScript(){
  const container = document.getElementById("pythMode-container");
  const buttonList = container.querySelectorAll(".button");
  const explanation = container.querySelector("#explanation");
  let button = buttonList[0];
  
  button.addEventListener("click", function (){
    const valueA = Number(document.getElementById("inputSideA").value);
    const valueB = Number(document.getElementById("inputSideB").value);
    display.value = hypotenuse(valueA,valueB);
    explanation.innerHTML = valueA + "&sup2; + " + valueB + "&sup2; = " + (Math.pow(valueA, 2) + Math.pow(valueB, 2)) + ". &radic;" + (Math.pow(valueA, 2) + Math.pow(valueB, 2)) + " is the hypotenuse's length."
  });
}


