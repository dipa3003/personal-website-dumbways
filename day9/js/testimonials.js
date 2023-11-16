// Fetch data dari n-point.io (JSON)
function getData() {
  return fetch("https://api.npoint.io/2b43b7e81d29d73ab8d8")
    .then((respose) => respose.json())
    .then((data) => data);
}

async function filterAll() {
  let htmlCards = "";
  const users = await getData();
  users.forEach((user) => {
    htmlCards += cardTestimonial(user);
  });
  document.querySelector(".testimonial-container").innerHTML = htmlCards;
}
filterAll();

async function filterStar(star) {
  let htmlCards = "";

  const users = await getData();
  const filteredUser = users.filter((user) => user.rating == star);

  if (filteredUser.length == 0) {
    htmlCards = `<h3>Data Not Found!</h3>`;
  } else {
    filteredUser.forEach((item) => (htmlCards += cardTestimonial(item)));
  }

  document.querySelector(".testimonial-container").innerHTML = htmlCards;
}

// Function Card-Testimonial
function cardTestimonial(user) {
  return `<div class="testimonial-card">
                <div class="card-container">
                <div class="image">
                    <img src="${user.image}" alt="image" />
                </div>
                <p class="quote">"${user.quote}"</p>
                <p class="author">- ${user.name}</p>
                <p class="author">${user.rating} <i class="fa-solid fa-star"></i></p>
                </div>
            </div>`;
}
