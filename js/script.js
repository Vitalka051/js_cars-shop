window.onload = function () {
  const apiUrl =
    "https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/cars";
  const optionsUrl =
    "https://6400a0c863e89b0913b3565c.mockapi.io/api_js_kotsovskyi/options";
  const $cardsContainer = document.getElementById("cards-container");
  const $filterInput = document.getElementById("filter-input");
  const $optionsInner = document.getElementById("options-inner");
  const $modal = document.getElementById("modal");
  const $closeModal = document.getElementById("close-modal");
  const $buyModal = document.getElementById("buyModal");
  const $changeDate = document.getElementById("deliveryDate");
  const $form = document.querySelector("#order-form");
  const $buyModalInner = document.getElementById("buy-modal_inner");
  let sum = 0;

  let now = new Date();
  let today = now.toISOString().slice(0, 10);
  let changedUsersDate = "";

  let changedCar = [];

  renderCars();
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
    const $optionCard = document.createElement("div");
    $optionCard.classList.add("option-card");
    $optionCard.setAttribute("option-id", `${option.id}`);

    const $checkOption = document.createElement("input");
    $checkOption.type = "checkbox";
    $optionCard.appendChild($checkOption);

    const $optionName = document.createElement("h4");
    $optionName.innerText = `${option.name}`;
    $optionCard.appendChild($optionName);

    const $optionInfo = document.createElement("p");
    $optionInfo.innerText = `${option.info}`;
    $optionCard.appendChild($optionInfo);

    const $optionPrice = document.createElement("p");
    $optionPrice.innerHTML = `<span>${option.price}</span> zł`;
    $optionCard.appendChild($optionPrice);

    $optionsInner.appendChild($optionCard);
  }

  function renderCard(car) {
    const $card = document.createElement("div");
    $card.classList.add("card");
    $card.setAttribute("car-id", `${car.id}`);

    const $cardImage = document.createElement("div");
    $cardImage.classList.add("card-image");
    $card.appendChild($cardImage);

    const $image = document.createElement("img");
    $image.src = `${car.image[0]}`;
    $cardImage.appendChild($image);

    const $name = document.createElement("h2");
    $name.classList.add("carCardName");
    $name.innerText = `${car.brand} ${car.model}`;
    $card.appendChild($name);

    const $year = document.createElement("p");
    $year.innerText = `Rok produkcji: ${car.year}`;
    $card.appendChild($year);

    const $price = document.createElement("p");
    $price.innerText = `Cena: ${car.price} zł`;
    $card.appendChild($price);

    const $kilometers = document.createElement("p");
    $kilometers.innerText = `Przebieg: ${car.kilometers} km`;
    $card.appendChild($kilometers);

    const $power = document.createElement("p");
    $power.innerText = `Moc silnika: ${car.power} KM`;
    $card.appendChild($power);

    const $info = document.createElement("p");
    $info.innerText = `Opis: ${car.info.slice(0, 70)}...`;
    $card.appendChild($info);

    $cardsContainer.appendChild($card);
  }

  function filterCars() {
    const $filterValue = $filterInput.value.toLowerCase();
    const $cards = document.getElementsByClassName("card");
    for (let i = 0; i < $cards.length; i++) {
      const name = $cards[i]
        .querySelector(".carCardName")
        .innerText.toLowerCase();
      name.indexOf($filterValue) > -1
        ? $cards[i].classList.remove("display-card")
        : $cards[i].classList.add("display-card");
    }
  }

  function renderModal(carId) {
    document.body.classList.add("modal");
    const $carDetails = document.getElementById("car-details");
    const $purchasePrice = document.getElementById("purchase-price");

    $optionsInner.innerHTML = "";

    renderOptions();

    $carDetails.innerText = "";

    fetch(`${apiUrl}/${carId}`)
      .then((response) => response.json())
      .then((car) => {
        sum = car.price;

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("modal_car-images");
        for (let image of car.image) {
          const modalCarImage = document.createElement("div");
          modalCarImage.classList.add("modal_car-image");
          const carImage = document.createElement("img");
          carImage.src = `${image}`;
          modalCarImage.appendChild(carImage);
          imageDiv.appendChild(modalCarImage);
        }
        $carDetails.appendChild(imageDiv);

        const carTitle = document.createElement("h2");
        carTitle.id = "carTitle";
        carTitle.innerText = `${car.brand} ${car.model}`;
        $carDetails.appendChild(carTitle);

        const carParams = document.createElement("p");
        carParams.innerText = `Rok: ${car.year}, moc silnika: ${car.power} KM, przebieg: ${car.kilometers} km`;
        $carDetails.appendChild(carParams);

        const carInfo = document.createElement("p");
        carInfo.innerText = `${car.info}`;
        $carDetails.appendChild(carInfo);

        $purchasePrice.innerText = `${sum} zł`;

        $changeDate.value = today;

        const minTimeShip = new Date(now);
        minTimeShip.setDate(now.getDate() + 3);
        $changeDate.min = minTimeShip.toISOString().slice(0, 10);

        const maxTimeShip = new Date(now);
        maxTimeShip.setDate(now.getDate() + 15);
        $changeDate.max = maxTimeShip.toISOString().slice(0, 10);

        changedCar = [];
        changedCar.push(car.brand, car.model);
        loadFormFromLocalStorage();
      });
  }

  function checkOption(e) {
    let optionId;
    let optionPrice = 0;
    if (e.target.tagName === "INPUT") {
      const purchasePrice = document.getElementById("purchase-price");

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

  $optionsInner.addEventListener("change", checkOption);

  $cardsContainer.addEventListener("click", function (e) {
    let carId;
    if (e.target.classList.contains("card") || e.target.closest(".card")) {
      $modal.classList.add("modal-open");
      carId = e.target.closest(".card").getAttribute("car-id");
      renderModal(carId);
    }
  });

  $filterInput.addEventListener("input", filterCars);

  $closeModal.addEventListener("click", function () {
    $modal.classList.remove("modal-open");
    document.body.classList.remove("modal");
  });

  let closeBuyModal = document.getElementById("close-buy_modal");

  closeBuyModal.addEventListener("click", function () {
    $buyModal.classList.remove("buy-modal_open");
  });

  $changeDate.addEventListener("change", function () {
    changedUsersDate = $changeDate.value;
  });

  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const deliveryDate = document.querySelector("#deliveryDate").value;
    changedCar.push(firstName, lastName, deliveryDate);
    $form.reset();
    localStorage.clear();
    renderBuyModal(changedCar);
  });

  function renderBuyModal(aboutPurchase) {
    $modal.classList.remove("modal-open");
    $buyModal.classList.add("buy-modal_open");
    $buyModalInner.innerText = "";
    const purchaseInfo = document.createElement("p");
    purchaseInfo.innerText = `Dane dotyczące zamówienia:\n ${aboutPurchase[0]} ${aboutPurchase[1]},\n Klient: ${aboutPurchase[2]} ${aboutPurchase[3]},\n Data dostawy: ${aboutPurchase[4]}`;
    $buyModalInner.appendChild(purchaseInfo);
  }

  document.getElementById("close-buy_modal").onclick = () => {
    $buyModal.classList.remove("buy-modal_open");
    document.body.classList.remove("modal");
  };

  function saveFormToLocalStorage() {
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const phone = document.querySelector("#phone").value;
    const email = document.querySelector("#email").value;
    const deliveryDate = document.querySelector("#deliveryDate").value;
    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).value;

    let formData = {
      firstName,
      lastName,
      phone,
      email,
      deliveryDate,
      paymentMethod,
    };

    localStorage.setItem("formData", JSON.stringify(formData));
  }

  function loadFormFromLocalStorage() {
    const formData = localStorage.getItem("formData");
    if (formData) {
      let { firstName, lastName, phone, email, deliveryDate, paymentMethod } =
        JSON.parse(formData);
      document.querySelector("#firstName").value = firstName;
      document.querySelector("#lastName").value = lastName;
      document.querySelector("#phone").value = phone;
      document.querySelector("#email").value = email;
      document.querySelector("#deliveryDate").value = deliveryDate;
      document.querySelector(`input[value="${paymentMethod}"]`).checked = true;
    }
  }

  $form.addEventListener("input", saveFormToLocalStorage);
};
