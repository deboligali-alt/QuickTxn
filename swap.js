
const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("newsletterEmail").value;

    if (email === "") {

        alert("Please enter your email.");

        return;

    }

    alert("Thank you for subscribing!");

    newsletterForm.reset();

});


/* BACK TO TOP */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});



const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.boxShadow = "0 20px 40px rgba(108,60,240,.25)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.boxShadow = "0 10px 30px rgba(0,0,0,.06)";

    });

});


const miniCards = document.querySelectorAll(".mini-card");

miniCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.background = "#6C3CF0";
        card.style.color = "white";

        card.querySelector("i").style.color = "white";

    });

    card.addEventListener("mouseleave", () => {

        card.style.background = "white";
        card.style.color = "#40196D";

        card.querySelector("i").style.color = "#6C3CF0";

    });

});


const testimonials = document.querySelectorAll(".testimonial-card");

const next = document.getElementById("next");

const prev = document.getElementById("prev");

let current = 0;

function showTestimonial(index) {

    testimonials.forEach(card => {

        card.classList.remove("active");

    });

    testimonials[index].classList.add("active");

}

next.addEventListener("click", () => {

    current++;

    if (current >= testimonials.length) {

        current = 0;

    }

    showTestimonial(current);

});

prev.addEventListener("click", () => {

    current--;

    if (current < 0) {

        current = testimonials.length - 1;

    }

    showTestimonial(current);

});

/* Auto Slide */

setInterval(() => {

    current++;

    if (current >= testimonials.length) {

        current = 0;

    }

    showTestimonial(current);

}, 5000);



const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        faqItems.forEach(faq => {

            if (faq !== item) {

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});


const pricingCards = document.querySelectorAll(".price-card");

pricingCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.boxShadow = "0 20px 50px rgba(108,60,240,.25)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.boxShadow = "0 10px 35px rgba(0,0,0,.07)";

    });

});



const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value;

    alert("Thank you " + name + "! Your message has been sent successfully.");

    form.reset();

});


const logos = document.querySelectorAll(".network-logos img");

logos.forEach((logo, index) => {

    logo.style.animation = `floatLogo 2s ease-in-out ${index * 0.2}s infinite`;

});







const reveals = document.querySelectorAll(".reveal");

function reveal() {

    reveals.forEach(section => {

        const top = section.getBoundingClientRect().top;

        if (top < window.innerHeight - 100) {

            section.classList.add("active-reveal");

        }

    });

}

window.addEventListener("scroll", reveal);

reveal();


// hamburger

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const menuIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");
    } else {
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");
    }

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");

    });

});