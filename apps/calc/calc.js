let display = document.getElementById("display");
const mainContainer = document.getElementById("calculator-flex");
const modeSelector = document.getElementById("chooseMode");

//default mode
window.addEventListener("DOMContentLoaded", function () {
  switchMode("advancedMode-template");
});

//switching mode with radioButton
modeSelector.addEventListener("change", function (e) {
  setDisplayValue("");
  const currentMode = mainContainer.querySelector(
    "#advancedMode-container, #pythMode-container"
  );

  currentMode.remove();
  switchMode(e.target.value);
});

function switchMode(template) {
  let nextTemplate = document.getElementById(template);
  let cloneTemplate = nextTemplate.content.cloneNode(true);
  document.getElementById("calculator-flex").appendChild(cloneTemplate);
  if (template == "advancedMode-template") {
    advancedModeScript();
  } else {
    pythModeScript();
  }
}

function setDisplayValue(value) {
  const strValue = String(value);
  const maxDisplayLength = 9;
  if (strValue.length > maxDisplayLength) {
    display.value = strValue.slice(0, maxDisplayLength);
  } else {
    display.value = strValue;
  }
}

function hypotenuse(a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

//AdvancedMode
function advancedModeScript() {
  const container = document.getElementById("advancedMode-container");
  let advancedModeButtons = container.querySelectorAll(".button");
  for (let i = 0; i < advancedModeButtons.length; i++) {
    let button = advancedModeButtons[i];

    button.addEventListener("click", function () {
      if (
        (button.classList.contains("button-num") ||
          button.classList.contains("button-operator")) &&
        display.value.length < 12
      ) {
        display.value += button.value;
      } else if (button.classList.contains("button-clear")) {
        setDisplayValue("");
      } else if (button.classList.contains("button-result")) {
        if (
          eval(display.value) == "Infinity" ||
          eval(display.value) == "-Infinity"
        ) {
          setDisplayValue("Error!");
        } else {
          setDisplayValue(eval(display.value));
        }
      } else if (button.id == "buttonPow2") {
        setDisplayValue(eval(Math.pow(display.value, 2)));
      } else if (button.id == "buttonSqrt") {
        setDisplayValue(eval(Math.sqrt(display.value)));
      } else if (button.id == "button-back") {
        setDisplayValue(display.value.slice(0, -1));
      }
    });
  }
}

//PythMode
function pythModeScript() {
  const container = document.getElementById("pythMode-container");
  const buttonList = container.querySelectorAll(".button");
  const explanation = container.querySelector("#explanation");
  let button = buttonList[0];

  button.addEventListener("click", function () {
    const valueA = Number(document.getElementById("inputSideA").value);
    const valueB = Number(document.getElementById("inputSideB").value);
    if (valueA <= 0 || valueB <= 0) {
      setDisplayValue("Error!");
    } else {
      setDisplayValue(hypotenuse(valueA, valueB));
      explanation.innerHTML =
        valueA +
        "&sup2; + " +
        valueB +
        "&sup2; = " +
        (Math.pow(valueA, 2) + Math.pow(valueB, 2)) +
        ". &radic;" +
        (Math.pow(valueA, 2) + Math.pow(valueB, 2)) +
        " is the hypotenuse's length.";
    }
  });
}
