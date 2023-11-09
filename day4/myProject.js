let projects = [];

// function checkedHtml(){
//     const img1 = document.querySelector('.html')
//     img1.style.display =
// }

// FUNCTION GET DATA
function submitData(event) {
  event.preventDefault();

  const inputName = document.querySelector("#inputName").value;
  const inputDateStart = document.querySelector("#inputDateStart").value;
  const inputDateEnd = document.querySelector("#inputDateEnd").value;
  const inputDescription = document.querySelector("#inputDescription").value;

  //   let css = document.querySelector("#css").value;

  //   let js = document.querySelector("#js").value;

  //   let react = document.querySelector("#react").value;
  // const technologies = document.getElementsByName('tech')
  // let techs= []
  // for(let i = 0; i < technologies.length; i++){
  //     if (technologies[i].checked){
  //         techs.push(technologies[i].value)
  //     }
  // }

  const html = document.querySelector("#html");
  const css = document.querySelector("#css");
  const js = document.querySelector("#js");
  const react = document.querySelector("#react").value;
  let image = document.querySelector("#image").files;

  image = URL.createObjectURL(image[0]);

  const inputData = {
    name: inputName,
    startDate: inputDateStart,
    endDate: inputDateEnd,
    description: inputDescription,
    html,
    css,
    js,
    react,
    image,
  };

  projects.push(inputData);
  console.log(projects);
  loopProjects(projects);
}

// FUNCTION LOOPING PROJECTS
function loopProjects(projects) {
  let projectCards = "";
  for (let i = 0; i < projects.length; i++) {
    projectCards += showCards(projects[i]);
  }

  const containerCards = document.querySelector(".container-cards");
  containerCards.innerHTML = projectCards;
}

// FUNCTION SHOW-CARD-HTML
function showCards(data) {
  return `<div class="card">
            <div class="image">
                <img src="${data.image}" alt="" />
            </div>
            <div class="project-title">
                <h3>${data.name}</h3>
                 <p>durasi: 4 bulan</p>
            </div>
            <div class="content">
                <p>${data.description}</p>
            </div>
            <div class="logo">
                <img src="icons/html.png" class="html" />
                <img src="icons/css.png" />
                <img src="icons/js.png" />
                <img src="icons/react.png" />
            </div>
            <div class="btn-card">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>`;
}
