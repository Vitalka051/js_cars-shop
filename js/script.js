let apiUrl =
  "https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/cars";
let optionsUrl =
  "https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/options";
let cardsContainer = document.getElementById("cards-container");
let filterInput = document.getElementById("filter-input");
let carDetails = document.getElementById("car-details");
let optionsInner = document.getElementById("options-inner");
let modal = document.getElementById("modal");
let closeModal = document.getElementById("close-modal");
let buyBnt = document.getElementById("purchase-button");
let buyModal = document.getElementById("buyModal");
let changeDate = document.getElementById("shipDate");

let sum = 0;

let now = new Date();
let today = now.toISOString().slice(0, 10);
let changedUsersDate = "";

async function getCars() {
  try {
    let response = await fetch(apiUrl);
    let cars = await response.json();
    return cars;
  } catch (error) {
    console.error(error);
  }
}

async function renderCars() {
  try {
    let cars = await getCars();
    cars.forEach((car) => {
      renderCard(car);
    });
  } catch (error) {
    console.error(error);
  }
}

async function getOptions() {
  try {
    let response = await fetch(optionsUrl);
    let options = await response.json();
    return options;
  } catch (error) {
    console.error(error);
  }
}

async function renderOptions() {
  try {
    let options = await getOptions();
    options.forEach((option) => {
      renderOptionsCard(option);
    });
  } catch (error) {
    console.error(error);
  }
}

function renderOptionsCard(option) {
  let optionCard = document.createElement("div");
  optionCard.classList.add("option-card");
  optionCard.setAttribute("option-id", `${option.id}`);

  let checkOption = document.createElement("input");
  checkOption.type = "checkbox";
  optionCard.appendChild(checkOption);

  let optionName = document.createElement("h4");
  optionName.innerText = `${option.name}`;
  optionCard.appendChild(optionName);

  let optionInfo = document.createElement("p");
  optionInfo.innerText = `${option.info}`;
  optionCard.appendChild(optionInfo);

  let optionPrice = document.createElement("p");
  optionPrice.innerHTML = `<span>${option.price}</span> zł`;
  optionCard.appendChild(optionPrice);

  optionsInner.appendChild(optionCard);
}

function renderCard(car) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("car-id", `${car.id}`);

  let cardImage = document.createElement("div");
  cardImage.classList.add("card-image");
  card.appendChild(cardImage);

  let image = document.createElement("img");
  image.src = `${car.image[0]}`;
  cardImage.appendChild(image);

  let name = document.createElement("h2");
  name.innerText = `${car.brand} ${car.model}`;
  card.appendChild(name);

  let year = document.createElement("p");
  year.innerText = `Rok produkcji: ${car.year}`;
  card.appendChild(year);

  let price = document.createElement("p");
  price.innerText = `Cena: ${car.price} zł`;
  card.appendChild(price);

  let kilometers = document.createElement("p");
  kilometers.innerText = `Przebieg: ${car.kilometers} km`;
  card.appendChild(kilometers);

  let power = document.createElement("p");
  power.innerText = `Moc silnika: ${car.power} KM`;
  card.appendChild(power);

  let info = document.createElement("p");
  info.innerText = `Opis: ${car.info.slice(0, 70)}...`;
  card.appendChild(info);

  cardsContainer.appendChild(card);
}

function filterCars() {
  let filterValue = filterInput.value.toLowerCase();
  let cards = document.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    let name = cards[i].querySelector("h2").innerText.toLowerCase();
    name.indexOf(filterValue) > -1
      ? cards[i].classList.remove("display-card")
      : cards[i].classList.add("display-card");
  }
}

function renderModal(carId) {
  document.body.classList.add("modal");
  let carDetails = document.getElementById("car-details");
  let purchasePrice = document.getElementById("purchase-price");

  optionsInner.innerHTML = "";

  renderOptions();

  carDetails.innerText = "";

  fetch(
    `https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/cars/${carId}`
  )
    .then((response) => response.json())
    .then((car) => {
      sum = car.price;

      let imageDiv = document.createElement("div");
      imageDiv.classList.add("modal_car-images");
      for (let image of car.image) {
        let modalCarImage = document.createElement("div");
        modalCarImage.classList.add("modal_car-image");
        let carImage = document.createElement("img");
        carImage.src = `${image}`;
        modalCarImage.appendChild(carImage);
        imageDiv.appendChild(modalCarImage);
      }
      carDetails.appendChild(imageDiv);

      let carTitle = document.createElement("h2");
      carTitle.id = "carTitle";
      carTitle.innerText = `${car.brand} ${car.model}`;
      carDetails.appendChild(carTitle);

      let carParams = document.createElement("p");
      carParams.innerText = `Rok: ${car.year}, moc silnika: ${car.power} KM, przebieg: ${car.kilometers} km`;
      carDetails.appendChild(carParams);

      let carInfo = document.createElement("p");
      carInfo.innerText = `${car.info}`;
      carDetails.appendChild(carInfo);

      purchasePrice.innerText = `${sum} zł`;

      changeDate.value = today;

      let minTimeShip = new Date(now);
      minTimeShip.setDate(now.getDate() + 3);
      changeDate.min = minTimeShip.toISOString().slice(0, 10);

      let maxTimeShip = new Date(now);
      maxTimeShip.setDate(now.getDate() + 15);
      changeDate.max = maxTimeShip.toISOString().slice(0, 10);
    });
}

function checkOption(e) {
  let optionId;
  let optionPrice = 0;
  if (e.target.tagName === "INPUT") {
    let purchasePrice = document.getElementById("purchase-price");

    optionId = e.target.closest(".option-card").getAttribute("option-id");
    getOptions()
      .then((options) => {
        if (e.target.checked) {
          sum += options[optionId - 1].price;
          purchasePrice.innerText = `${sum} zł`;
        } else {
          sum = sum - options[optionId - 1].price;
          purchasePrice.innerText = `${sum} zł`;
        }
      })
      .catch((err) => {
        console.error(err);
      });
    return optionPrice;
  }
}

optionsInner.addEventListener("change", checkOption);

cardsContainer.addEventListener("click", function (e) {
  let carId;
  if (e.target.classList.contains("card") || e.target.closest(".card")) {
    modal.classList.add("modal-open");
    carId = e.target.closest(".card").getAttribute("car-id");
    renderModal(carId);
  }
});

filterInput.addEventListener("input", filterCars);

closeModal.addEventListener("click", function () {
  modal.classList.remove("modal-open");
  document.body.classList.remove("modal");
});

let closeBuyModal = document.getElementById("close-buy_modal");

closeBuyModal.addEventListener("click", function () {
  buyModal.classList.remove("buy-modal_open");
});

function renderBuyModal(buyedCarName, shippedDate) {
  return `Twój samochód to: ${buyedCarName}.
  Przewidywana data dostawy to: ${shippedDate}`;
}

buyBnt.addEventListener("click", function () {
  form.onsubmit();
});

function generateBuyModal() {
  let buyModalInner = document.getElementById("buy-modal_inner");
  let buyCarInfo = document.createElement("p");
  let buyedCar = document.getElementById("carTitle").innerText;
  buyModalInner.innerText = "";
  buyModal.classList.add("buy-modal_open");
  console.log(buyedCar);
  buyCarInfo.innerText = renderBuyModal(buyedCar, changedUsersDate);
  buyModalInner.appendChild(buyCarInfo);
}

changeDate.addEventListener("change", function () {
  changedUsersDate = changeDate.value;
});

renderCars();

let form = document.getElementById("order-form");
let nameInput = document.getElementById("customer-name");
let emailInput = document.getElementById("customer-email");
let phoneInput = document.getElementById("customer-phone");
let shipDateInput = document.getElementById("shipDate");

form.addEventListener("submit", (event) => {
  let errors = [];

  if (nameInput.value === "") {
    errors.push("Proszę podać imię i nazwisko.");
  }

  if (emailInput.value === "") {
    errors.push("Proszę podać adres e-mail.");
  } else if (!validateEmail(emailInput.value)) {
    errors.push("Proszę podać prawidłowy adres e-mail.");
  }

  if (phoneInput.value === "") {
    errors.push("Proszę podać numer telefonu.");
  } else if (!validatePhone(phoneInput.value)) {
    errors.push("Proszę podać prawidłowy numer telefonu.");
  }

  if (shipDateInput.value === "") {
    errors.push("Proszę wybrać datę dostawy.");
  }

  if (errors.length > 0) {
    event.preventDefault();
    alert(errors.join("\n"));
  } else {
    event.preventDefault();
    generateBuyModal();
  }
});

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\d{9}$/;
  return phoneRegex.test(phone);
}
