let data = [];

async function loadData() {
  try {
    const response = await fetch('oscars_data.json');
    data = await response.json();

    data = data.map(item => ({
      Year: item.Year || item['Year '],
      Category: item.Category || item['Category '],
      Name: item.Name || item['Name '],
      Film: item.Film || item['Film '],
      Winner: item.Winner || item['Winner '],
      Detail: item.Detail || item['Detail '],
    }));

    data = data.filter(item => {
      const winnerFlag =
        item.Winner === true ||
        item.Winner === "YES" ||
        item.Winner === "Yes" ||
        item.Winner === 1 ||
        item.Winner === "True";
      const hasDetails = item.Name?.trim() || item.Film?.trim();
      return winnerFlag && hasDetails;
    });

    populateYearDropdown();
    displayResults(data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function populateYearDropdown() {
  const yearSelect = document.getElementById('yearSelect');
  const years = [...new Set(data.map(item => item.Year))]
    .filter(y => y)
    .sort((a, b) => b - a);
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });
}

function displayResults(filteredData) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = '';

  if (filteredData.length === 0) {
    container.innerHTML = '<p style="text-align:center;">No winners found for this year or search.</p>';
    return;
  }

  filteredData.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${item.Category || "Unknown Category"}</h3>
      <p><strong>Year:</strong> ${item.Year || "N/A"}</p>
      <p><strong>Winner:</strong> ${item.Name || "—"}</p>
      <p><strong>Film:</strong> ${item.Film || "—"}</p>
      <p><strong>Detail:</strong> ${item.Detail || "—"}</p>
    `;
    container.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchValue = e.target.value.toLowerCase();
  const filtered = data.filter(item =>
    item.Name?.toLowerCase().includes(searchValue) ||
    item.Film?.toLowerCase().includes(searchValue) ||
    item.Category?.toLowerCase().includes(searchValue)
  );
  displayResults(filtered);
});

document.getElementById('yearSelect').addEventListener('change', (e) => {
  const year = e.target.value;
  const filtered = year ? data.filter(item => item.Year == year) : data;
  displayResults(filtered);
});

loadData();
