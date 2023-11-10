let projects = [];

// FUNCTION GET DATA
function submitData(event) {
  event.preventDefault();

  const inputName = document.querySelector("#inputName").value;
  let inputDateStart = document.querySelector("#inputDateStart").value;
  let inputDateEnd = document.querySelector("#inputDateEnd").value;
  const inputDescription = document.querySelector("#inputDescription").value;

  const html = document.querySelector("#html").checked;
  const css = document.querySelector("#css").checked;
  const js = document.querySelector("#js").checked;
  const react = document.querySelector("#react").checked;
  let image = document.querySelector("#image").files;

  image = URL.createObjectURL(image[0]);

  let start = Date.parse(inputDateStart);
  let end = Date.parse(inputDateEnd);
  let durasi = end - start;

  let day = Math.floor(durasi / 1000 / 60 / 60 / 24);
  let month = Math.floor(day / 30);
  let year = Math.floor(month / 12);

  console.log("date start:", start, "date End:", end);
  console.log("durasi: ", durasi);
  console.log("day: ", day);
  console.log("month: ", month);

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
    day,
    month,
    year,
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

// FUNCTION SHOW-DETAIL-CARD
function showDetail() {
  const titleCard = document.querySelector(".project-title");
  titleCard.addEventListener("click", () => {});
}

// FUNCTION SHOW-CARD-HTML
function showCards(data) {
  return `<div class="card">
            <div class="image">
                <img src="${data.image}" alt="" />
            </div>
            <div class="project-title">
            <a href="detailProject.html"><h3>${data.name}</h3></a>
                ${data.year > 0 ? `<p>durasi: ${data.year} tahun</p>` : data.month > 0 ? `<p>durasi: ${data.month} bulan</p>` : `<p>durasi: ${data.day} hari</p>`}
            </div>
            <div class="content">
                <p>${data.description}</p>
            </div>
            <div class="logo">
              ${data.html ? ` <i class="fa-brands fa-html5 fa-2xl"></i>` : ""}
              ${data.css ? ` <i class="fa-brands fa-css3-alt fa-2xl"></i>` : ""}
              ${data.js ? ` <i class="fa-brands fa-js fa-2xl"></i>` : ""}
              ${data.react ? ` <i class="fa-brands fa-react fa-2xl"></i>` : ""}
            </div>
            <div class="btn-card">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>`;
}
