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

renderVenue();
renderPrices();