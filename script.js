const sections = [
  { id: "stalls",  name: "Front Stalls", price: 60, rows: ["A", "B", "C", "D", "E"],      seatsPerRow: 12 },
  { id: "circle",  name: "Dress Circle", price: 40, rows: ["F", "G", "H", "J", "K"],      seatsPerRow: 14 },
  { id: "balcony", name: "Balcony",      price: 25, rows: ["L", "M", "N", "P", "Q", "R"], seatsPerRow: 16 }
];

const takenSeats = [
  "A-5", "A-6", "B-3", "B-9", "C-7", "D-1", "D-12", "E-4",
  "F-6", "F-7", "G-10", "H-2", "H-3", "J-8", "K-14",
  "L-1", "M-8", "M-9", "N-12", "P-5", "Q-3", "R-16"
];

const seats = [];

function createSeats() {
  for (const section of sections) {
    for (const rowLetter of section.rows) {
      for (let n = 1; n <= section.seatsPerRow; n++) {
        const id = `${rowLetter}-${n}`;

        seats.push({
          id: id,
          sectionId: section.id,
          section: section.name,
          row: rowLetter,
          number: n,
          price: section.price,
          taken: takenSeats.includes(id)
        });
      }
    }
  }
}

function findSeat(id) {
  return seats.find(seat => seat.id === id);
}

createSeats();

let cart = [];

function isInCart(id) {
  return cart.includes(id);
}

function addToCart(id) {
  const seat = findSeat(id);

  if (seat === undefined) return false;
  if (seat.taken) return false;
  if (isInCart(id)) return false;

  cart.push(id);
  return true;
}

function removeFromCart(id) {
  cart = cart.filter(item => item !== id);
}

function getTotal() {
  return cart.reduce((sum, id) => sum + findSeat(id).price, 0);
}

cart = [];

const venue = document.getElementById("venue");
const viewport = document.getElementById("viewport");
const priceList = document.getElementById("price-list");

function renderVenue() {
  for (const section of sections) {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("section", section.id);

    const title = document.createElement("h3");
    title.textContent = `${section.name} - $${section.price}`;
    sectionDiv.append(title);

    for (const rowLetter of section.rows) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      const label = document.createElement("span");
      label.classList.add("row-label");
      label.textContent = rowLetter;
      rowDiv.append(label);

      const rowSeats = seats.filter(seat => seat.row === rowLetter);

      for (const seat of rowSeats) {
        const btn = document.createElement("button");
        btn.classList.add("seat", section.id);
        btn.setAttribute("data-id", seat.id);
        btn.setAttribute("title", `Row ${seat.row}, seat ${seat.number}`);
        btn.setAttribute("aria-label", `${seat.section}, row ${seat.row}, seat ${seat.number}`);

        if (seat.number === section.seatsPerRow / 2) {
          btn.classList.add("aisle-after");
        }

        if (seat.taken) {
          btn.classList.add("taken");
        }

        rowDiv.append(btn);
      }

      sectionDiv.append(rowDiv);
    }

    venue.append(sectionDiv);
  }
}

function renderPrices() {
  for (const section of sections) {
    const li = document.createElement("li");
    li.textContent = `${section.name}: $${section.price}`;
    priceList.append(li);
  }
}

const seatText = document.getElementById("seat-text");
const addBtn = document.getElementById("add-btn");

let selectedId = null;

function showSeatDetails() {
  const seat = findSeat(selectedId);
  seatText.textContent = `${seat.section}, row ${seat.row}, seat ${seat.number} - $${seat.price}`;

  if (isInCart(selectedId)) {
    addBtn.disabled = true;
    addBtn.textContent = "Already in cart";
  } else {
    addBtn.disabled = false;
    addBtn.textContent = "Add to cart";
  }
}

function inspectSeat(id) {
  const seat = findSeat(id);

  if (seat.taken) {
    selectedId = null;
    seatText.textContent = `Seat ${id} is not available.`;
    addBtn.disabled = true;
    addBtn.textContent = "Add to cart";
  } else {
    selectedId = id;
    showSeatDetails();
  }

  updateSeatColours();
}

function updateSeatColours() {
  const allSeats = document.querySelectorAll(".seat");

  allSeats.forEach(btn => {
    const id = btn.getAttribute("data-id");
    const inCart = isInCart(id);

    if (inCart) {
      btn.classList.add("in-cart");
    } else {
      btn.classList.remove("in-cart");
    }

    if (id === selectedId && !inCart) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

venue.addEventListener("click", event => {
  const btn = event.target.closest(".seat");
  if (!btn) return;

  inspectSeat(btn.getAttribute("data-id"));
});

const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");
const totalSpan = document.getElementById("total");

function cartChanged() {
    saveCart();  
    drawCart();
    updateSeatColours();

    if (selectedId !== null) {
        showSeatDetails();
  }
}

function drawCart() {
  cartList.replaceChildren();

  for (const id of cart) {
    const seat = findSeat(id);

    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = `Row ${seat.row} seat ${seat.number} (${seat.section}) - $${seat.price}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.setAttribute("data-id", id);

    li.append(text, removeBtn);
    cartList.append(li);
  }

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
  } else {
    cartEmpty.style.display = "none";
  }

  totalSpan.textContent = getTotal();
}

addBtn.addEventListener("click", () => {
  if (selectedId === null) return;

  addToCart(selectedId);
  cartChanged();
});

cartList.addEventListener("click", event => {
  const btn = event.target.closest("button");
  if (!btn) return;

  removeFromCart(btn.getAttribute("data-id"));
  cartChanged();
});

const STEP = 60;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const PAN_LIMIT = 500;

let zoom = 1;
let panX = 0;
let panY = 0;

function applyView() {
  panX = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, panX));
  panY = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, panY));
  zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  zoom = Math.round(zoom * 10) / 10;

  venue.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

function resetView() {
  zoom = 1;
  panX = 0;
  panY = 0;
  applyView();
}

document.getElementById("zoom-in").addEventListener("click", () => {
  zoom = zoom + 0.2;
  applyView();
});

document.getElementById("zoom-out").addEventListener("click", () => {
  zoom = zoom - 0.2;
  applyView();
});

document.getElementById("move-up").addEventListener("click", () => {
  panY = panY + STEP;
  applyView();
});

document.getElementById("move-down").addEventListener("click", () => {
  panY = panY - STEP;
  applyView();
});

document.getElementById("move-left").addEventListener("click", () => {
  panX = panX + STEP;
  applyView();
});

document.getElementById("move-right").addEventListener("click", () => {
  panX = panX - STEP;
  applyView();
});

document.getElementById("reset").addEventListener("click", resetView);

function saveCart() {
  localStorage.setItem("lanternCart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("lanternCart");
  if (saved === null) return;

  try {
    const ids = JSON.parse(saved);

    cart = ids.filter(id => {
      const seat = findSeat(id);
      return seat !== undefined && !seat.taken;
    });
  } catch (error) {
    cart = [];
  }
}

renderVenue();
renderPrices();
loadCart();
updateSeatColours();
drawCart();
applyView();