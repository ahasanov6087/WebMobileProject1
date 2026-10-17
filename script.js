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
console.log(`${seats.length} seats created`);
console.log(findSeat("A-5"));