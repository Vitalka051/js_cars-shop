let apiUrl =
  "https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/cars";
let optionsUrl =
  "https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/options";
let cardsContainer = document.getElementById("cards-container");
let filterInput = document.getElementById("filter-input");
let carDetails = document.getElementById("car-details");
let optionsInner = document.getElementById("options-inner");

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
  // console.log(optionCard);
}

function renderCard(car) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("car-id", `${car.id}`);

  let image = document.createElement("img");
  image.src = `${car.image[0]}`;
  card.appendChild(image);

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
  console.log(cards);
  for (let i = 0; i < cards.length; i++) {
    let name = cards[i].querySelector("h2").innerText.toLowerCase();
    name.indexOf(filterValue) > -1
      ? cards[i].classList.remove("display-card")
      : cards[i].classList.add("display-card");
  }
}

function renderModal(carId) {
  let carDetails = document.getElementById("car-details");
  let purchasePrice = document.getElementById("purchase-price");

  optionsInner.innerHTML = "";

  renderOptions();

  let sum = 0;

  carDetails.innerText = "";

  fetch(
    `https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/cars/${carId}`
  )
    .then((response) => response.json())
    .then((car) => {
      sum += car.price;

      let imageDiv = document.createElement("div");
      for (let image of car.image) {
        let carImage = document.createElement("img");
        carImage.src = `${image}`;
        imageDiv.appendChild(carImage);
      }
      carDetails.appendChild(imageDiv);

      let carTitle = document.createElement("h2");
      carTitle.innerText = `${car.brand}, ${car.model}`;
      carDetails.appendChild(carTitle);

      let carParams = document.createElement("p");
      carParams.innerText = `Rok: ${car.year}, moc silnika: ${car.power} KM, przebieg: ${car.kilometers} km`;
      carDetails.appendChild(carParams);

      let carInfo = document.createElement("p");
      carInfo.innerText = `${car.info}`;
      carDetails.appendChild(carInfo);

      purchasePrice.innerHTML = `Wartość zamówienia: <span>${sum}</span> zł`;
    });
}

cardsContainer.addEventListener("click", function (e) {
  let carId;
  if (e.target.classList.contains("card") || e.target.closest(".card")) {
    carId = e.target.closest(".card").getAttribute("car-id");
    renderModal(carId);
  }
});

filterInput.addEventListener("input", filterCars);

renderCars();
