// data users sementara
const users = [
  {
    name: "Julian",
    quote: "Keren abis lah pokoknya!",
    image: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5,
  },
  {
    name: "Cloudy",
    quote: "Mentor nya asik semua!",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 4,
  },
  {
    name: "ABC Company",
    quote: "Mantap jiwa pokoknya the best!",
    image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    name: "Robert",
    quote: "Biasa saja sih",
    image: "https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 3,
  },
  {
    name: "Dine",
    quote: "Pelajayannya cukup bagus!",
    image: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4,
  },
];

function filterAll() {
  let htmlCards = "";
  users.forEach((user) => {
    htmlCards += cardTestimonial(user);
  });
  document.querySelector(".testimonial-container").innerHTML = htmlCards;
}
filterAll();

function filterStar(star) {
  let htmlCards = "";
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
