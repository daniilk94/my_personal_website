let display = document.getElementById("display");
const mainContainer = document.getElementById("calculator-flex");
const modeSelector = document.getElementById("chooseMode");

//default mode
window.addEventListener("DOMContentLoaded", function () {
  switchMode("advancedMode-template");
});

//switching mode with radioButton
modeSelector.addEventListener("change", function (e) {
  display.value = "";
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

function formatNumber(number) {
  if (Number.isInteger(number)) {
    if (Math.abs(number) < 1e9) {
      return number;
    } else {
      return number.toExponential(3);
    }
  } else {
    return number.toPrecision(6);
  }
}

function hypotenuse(a, b) {
  const hypo = formatNumber(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
  if (hypo > 1e30) {
    return "Infinity";
  }
  return hypo;
}

//AdvancedMode
function advancedModeScript() {
  const container = document.getElementById("advancedMode-container");
  let advancedModeButtons = container.querySelectorAll(".button");
  for (let i = 0; i < advancedModeButtons.length; i++) {
    let button = advancedModeButtons[i];

    button.addEventListener("click", function () {
      if (
        button.classList.contains("button-num") ||
        button.classList.contains("button-operator")
      ) {
        display.value += button.value;
        display.scrollLeft = display.scrollWidth;
      } else if (button.classList.contains("button-clear")) {
        display.value = "";
      } else if (button.classList.contains("button-result")) {
        if (
          eval(display.value) == "Infinity" ||
          eval(display.value) == "-Infinity"
        ) {
          display.value = "Error!";
        } else {
          display.value = formatNumber(eval(display.value));
        }
      } else if (button.id == "buttonPow2") {
        display.value = formatNumber(eval(Math.pow(display.value, 2)));
      } else if (button.id == "buttonSqrt") {
        display.value = formatNumber(eval(Math.sqrt(display.value)));
      } else if (button.id == "button-back") {
        display.value = display.value.slice(0, -1);
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
      display.value = "Error!";
    } else {
      display.value = hypotenuse(valueA, valueB);
      if (display.value === "Infinity") {
        explanation.innerHTML =
          "The is nothing in universe you could measure with such inputs";
      } else {
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
    }
  });
}
