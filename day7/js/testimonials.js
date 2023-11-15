class TestimonialUser {
  constructor(author, quote, image) {
    this.author = author;
    this.quote = quote;
    this.image = image;
  }
  cardTestimonial() {
    return `
            <div class="testimonial-card">
                <div class="card-container">
                <div class="image">
                    <img src="${this.image}" alt="image" />
                </div>
                <p class="quote">"${this.quote}"</p>
                <p class="author">- ${this.author}</p>
                </div>
            </div>`;
  }
}

const user1 = new TestimonialUser("Julian", "Keren abis lah pokoknya!", "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
const user2 = new TestimonialUser("Cloudy", "Mentor nya asik semua!", "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
const user3 = new TestimonialUser("ABC Company", "Mantap jiwa pokonya the best!", "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600");

const users = [user1, user2, user3];

let testimonialHtml = "";
users.forEach((user) => {
  testimonialHtml += user.cardTestimonial();
});

document.querySelector(".testimonial-container").innerHTML = testimonialHtml;

// Function Card-Testimonial
// function cardTestimonial(user) {
//   return `<div class="testimonial-card">
//                 <div class="card-container">
//                 <div class="image">
//                     <img src="" alt="image" />
//                 </div>
//                 <p class="quote">"${user.quote}"</p>
//                 <p class="author">- ${user.author}</p>
//                 </div>
//             </div>`;
// }

// data users sementara
// const users = [
//   {
//     name: "Julian",
//     quote: "Keren abis lah pokoknya!",
//     image: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//   },
//   {
//     name: "Cloudy",
//     quote: "Mentor nya asik semua!",
//     image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//   },
//   {
//     name: "ABC Company",
//     quote: "Mantap jiwa pokonya the best!",
//     image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600",
//   },
// ];
