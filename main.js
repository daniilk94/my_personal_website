let projectImages = document.querySelectorAll(".project-img");
const container = document.getElementById("app-container");
const frame = document.getElementById("app-frame");
const mainSecHeading = document.getElementById("main-section-heading");
const closeBtn = document.getElementById("close-btn");

for (let i = 0; i < projectImages.length; i++){
  let img = projectImages[i];
  img.addEventListener("click", function(){
    frame.src = img.dataset.src;
    container.classList.add("open");
    mainSecHeading.innerHTML = img.alt;
  });
}

function closeFrame(){
  container.classList.remove("open");
  frame.src = "";
  mainSecHeading.innerHTML = "Interactive Apps";
}

closeBtn.addEventListener("click", function(){
  closeFrame();
})

addEventListener("keydown", function(e){
  if (e.code == "Escape"){
    closeFrame();
  }
})


