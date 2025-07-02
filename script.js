const API_KEY = 'AIzaSyC1xjRMjKhyMiIzxzT59rbblxME63ni-Ts';  // Ganti dengan API Key Anda
const SPREADSHEET_ID = '1nncuHq7RTTbNHhWJOXNtphYHf6ZPpz7ZnyIZPheoMgY'; // Ganti dengan ID Spreadsheet Anda
const RANGE = 'Sheet1!A1:E'; // Ganti dengan rentang data yang sesuai

// Fungsi untuk mengambil data dari Google Sheets
function getDataFromSheet() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            let html = '<table><tr><th>Tanggal</th><th>Kategori</th><th>Jumlah</th><th>Deskripsi</th><th>Jenis</th></tr>';
            rows.forEach(row => {
                html += `<tr>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${row[4]}</td>
                </tr>`;
            });
            html += '</table>';
            document.getElementById('data').innerHTML = html;
        })
        .catch(error => console.error('Error:', error));
}

// Fungsi untuk menambah data ke Google Sheets
function addDataToSheet(data) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A1:E:append?valueInputOption=RAW&key=${API_KEY}`;
    
    const body = {
        values: [
            [data.date, data.category, data.amount, data.description, data.type]
        ]
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Data added:', result);
        getDataFromSheet();  // Refresh data after adding
    })
    .catch(error => console.error('Error:', error));
}

// Event listener untuk form submission
document.getElementById('moneyTrackerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const data = {
        date: document.getElementById('date').value,
        category: document.getElementById('category').value,
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        type: document.getElementById('type').value
    };

    addDataToSheet(data);
});

// Load data saat halaman pertama kali dimuat
window.onload = getDataFromSheet;
