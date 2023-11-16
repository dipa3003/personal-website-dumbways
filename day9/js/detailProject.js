const dataSession = document.querySelector(".data-session");
const data = JSON.parse(sessionStorage.getItem("dataSession"));
console.log("data session:", data);

const sessionTitle = document.querySelector(".session-title");
sessionTitle.innerHTML = data.name;

const sessionContent = document.querySelector(".session-content");
sessionContent.innerHTML = data.description;

const sessionDate = document.querySelector(".session-date");
sessionDate.innerHTML = `${data.startDate} until ${data.endDate}`;

const sessionMonth = document.querySelector(".session-month");
sessionMonth.innerHTML = `${data.year > 0 ? `${data.year} tahun` : data.month > 0 ? `${data.month} bulan` : `${data.day} hari`}
`;
const sessionReact = document.querySelector(".session-react");
sessionReact.innerHTML = `${data.react ? ` <i class="fa-brands fa-react fa-2xl"></i> <p>React JS</p>` : ""}`;

const sessionHtml = document.querySelector(".session-html");
sessionHtml.innerHTML = `${data.html ? ` <i class="fa-brands fa-html5 fa-2xl"></i> <p>HTML</p>` : ""}`;

const sessionCss = document.querySelector(".session-css");
sessionCss.innerHTML = `${data.css ? ` <i class="fa-brands fa-css3-alt fa-2xl"></i> <p>CSS</p>` : ""}`;

const sessionJs = document.querySelector(".session-js");
sessionJs.innerHTML = `${data.js ? ` <i class="fa-brands fa-js fa-2xl"></i> <p>JavaScript</p>` : ""}`;

// const sessionImage = document.querySelector(".session-image");
// sessionImage.setAttribute("src", data.image);
