let ratings = [];
let selectedRating = 0;
let currentCarId = null;

document.addEventListener('DOMContentLoaded', () => {
  const carData = JSON.parse(sessionStorage.getItem('selectedCar'));
  if (carData) {
    currentCarId = carData.id;  // Assuming each car has a unique 'id' property
    populateDetailsPage(carData);
  }

  attachEventListeners();

  loadReviews();
});

function attachEventListeners() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.removeEventListener('click', selectRating); // Remove previous listeners
    star.addEventListener('click', selectRating); // Add new listeners
  });

  const reviewSubmitButton = document.getElementById('review-submit');
  reviewSubmitButton.removeEventListener('click', addReview); // Remove previous listener
  reviewSubmitButton.addEventListener('click', addReview); // Add new listener
}

function selectRating(event) {
  const value = parseInt(event.target.getAttribute('data-value'));
  selectedRating = value;

  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    if (parseInt(star.getAttribute('data-value')) <= value) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

function addReview() {
  const reviewText = document.getElementById('review-text').value.trim();
  const reviewMedia = document.getElementById('review-media').files[0];

  if (!selectedRating || !reviewText) {
    alert('Please provide a rating and review text.');
    return;
  }

  const review = {
    text: reviewText,
    rating: selectedRating,
    media: reviewMedia ? URL.createObjectURL(reviewMedia) : null,
    mediaType: reviewMedia ? reviewMedia.type : null
  };

  saveReview(review);
  displayReview(review);
  ratings.push(selectedRating);
  updateRatings();

  clearReviewForm();
}

function saveReview(review) {
  const savedReviews = JSON.parse(localStorage.getItem(`reviews-${currentCarId}`)) || [];
  savedReviews.push(review);
  localStorage.setItem(`reviews-${currentCarId}`, JSON.stringify(savedReviews));
}

function loadReviews() {
  const savedReviews = JSON.parse(localStorage.getItem(`reviews-${currentCarId}`)) || [];
  savedReviews.forEach(review => {
    displayReview(review);
    ratings.push(review.rating);
  });
  updateRatings();
}

function displayReview(review) {
  const reviewList = document.getElementById('review-list');
  const reviewItem = document.createElement('div');
  reviewItem.className = 'review';
  reviewItem.innerHTML = `<p><strong>User:</strong> ${review.text}</p>`;

  if (review.media) {
    const mediaElement = document.createElement(review.mediaType.startsWith('video/') ? 'video' : 'img');
    mediaElement.src = review.media;
    if (review.mediaType.startsWith('video/')) {
      mediaElement.controls = true;
    }
    reviewItem.appendChild(mediaElement);
  }

  reviewList.appendChild(reviewItem);
}

function updateRatings() {
  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0 ? (ratings.reduce((sum, rating) => sum + rating, 0) / totalRatings).toFixed(1) : 0;

  document.getElementById('average-rating').innerText = averageRating;
  document.getElementById('total-ratings').innerText = `(${totalRatings} ratings)`;
}

function clearReviewForm() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.classList.remove('selected');
  });
  selectedRating = 0;
  document.getElementById('review-text').value = '';
  document.getElementById('review-media').value = '';
}

// Handle loading the details page and setting up the review functionality
window.addEventListener('popstate', function (event) {
  if (event.state) {
    loadDetailsPage('details.html', event.state);
  } else {
    location.reload();
  }
});

function loadDetailsPage(url, data) {
  fetch(url)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.querySelector('main').innerHTML;

      // Replace only the main content area instead of the entire body
      document.querySelector('main').innerHTML = newContent;
      populateDetailsPage(data);
      attachEventListeners(); // Reattach event listeners after new content is loaded
      window.scrollTo(0, 0);
    })
    .catch(err => console.error('Failed to load the details page:', err));
}

function populateDetailsPage(data) {
  document.getElementById('car-title').innerText = data.title;
  document.getElementById('car-year').innerText = data.year;
  document.getElementById('car-price').innerText = data.price;

  const detailsContainer = document.getElementById('car-details');
  detailsContainer.innerHTML = ''; // Clear previous details
  data.details.forEach(detail => {
    const p = document.createElement('p');
    p.innerText = detail;
    detailsContainer.appendChild(p);
  });

  const carouselInner = document.querySelector('.carousel-inner');
  carouselInner.innerHTML = ''; // Clear previous images
  data.images.forEach((imgSrc, index) => {
    const div = document.createElement('div');
    div.className = 'carousel-item' + (index === 0 ? ' active' : '');
    const img = document.createElement('img');
    img.src = imgSrc;
    div.appendChild(img);
    carouselInner.appendChild(div);
  });
}

let currentSlide = 0;

function showSlide(index) {
  const carouselInner = document.querySelector('.carousel-inner');
  const totalSlides = document.querySelectorAll('.carousel-item').length;
  if (index >= totalSlides) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = index;
  }
  const offset = -currentSlide * 100;
  carouselInner.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}


function redirectToWhatsApp() {
  // Retrieve customer details from local storage
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const customerEmail = userDetails.email;
  const customerName = userDetails.username;

  // Retrieve booking details from local storage
  const customerbookinginfo = JSON.parse(localStorage.getItem('bookingDetails'));
  const bookingtype = customerbookinginfo.bookingType;
  const dropoff = customerbookinginfo.dropoff;
  const pickup = customerbookinginfo.pickup;
  const pickupDate = customerbookinginfo.pickupDate;
  const pickuptime = customerbookinginfo.pickupTime;
  const returnDate = customerbookinginfo.returnDate;

  // Retrieve selected car details from local storage
  const selectedCar = JSON.parse(localStorage.getItem('selectedCar'));
  const carTitle = selectedCar.title;
  const carYear = selectedCar.year;
  const carPrice = selectedCar.price;

  // Construct the WhatsApp message with booking and car details
  const message = `Hello, I am interested in renting a car. Here are my details:
\n\nName: ${customerName}\n
Email: ${customerEmail}\n
Booking Type: ${bookingtype}\n
Pickup Location: ${pickup}\n
Dropoff Location: ${dropoff}\n
Pickup Date: ${pickupDate}\n
Pickup Time: ${pickuptime}\n
Return Date: ${returnDate}\n
\nCar Details:\n
Car Title: ${carTitle}\n
Car Year: ${carYear}\n
Car Price: ${carPrice}`;

  // Encode the message for use in a URL
  const encodedMessage = encodeURIComponent(message);

  // Construct the WhatsApp URL
  const whatsappURL = `https://wa.me/917780598470?text=${encodedMessage}`;

  // Redirect to WhatsApp
  window.location.href = whatsappURL;
}

