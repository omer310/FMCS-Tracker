// Google Sheets API configuration
const SPREADSHEET_ID = '1YPsUjj7fk0bMgkVUIM2m4KQC1i4FODdrV_P4_MlsUzo';
const API_KEY = 'AIzaSyDsGJODK2d8jFzQX8U_iVXtWcnVVVbxf0g';
const RANGE = 'Sheet1!A:B';
const TARGET_AMOUNT = 17000000;

// Initialize the Google Sheets API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        // Start fetching data periodically
        fetchDonations();
        setInterval(fetchDonations, 60000); // Update every minute
    }).catch(function(error) {
        console.error('Error initializing Google Sheets API:', error);
    });
}

// Fetch donations from Google Sheets
function fetchDonations() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then(function(response) {
        const values = response.result.values;
        if (values && values.length > 1) { // Skip header row
            const total = calculateTotal(values.slice(1)); // Skip header row
            updateDisplay(total);
        }
    }).catch(function(error) {
        console.error('Error fetching donations:', error);
    });
}

// Calculate total donations
function calculateTotal(values) {
    return values.reduce((sum, row) => {
        const amount = parseFloat(row[1]) || 0;
        return sum + amount;
    }, 0);
}

// Update the display with new values
function updateDisplay(total) {
    // Calculate percentage (rounded to 1 decimal place)
    const percentage = (total / TARGET_AMOUNT) * 100;
    const roundedPercentage = Math.min(percentage, 100).toFixed(1);
    
    // Format the total amount with commas
    const formattedTotal = new Intl.NumberFormat('ar-SD').format(total);
    
    // Update progress bar width
    const progressBar = document.getElementById('progress');
    if (progressBar) {
        progressBar.style.width = `${roundedPercentage}%`;
    }
    
    // Update amount text
    const currentAmountElement = document.querySelector('.current-amount');
    if (currentAmountElement) {
        currentAmountElement.textContent = formattedTotal;
    }
    
    // Update percentage text
    const percentageElement = document.querySelector('.percentage');
    if (percentageElement) {
        percentageElement.textContent = `${roundedPercentage}%`;
    }
}

// Load the Google Sheets API
gapi.load('client', initClient);