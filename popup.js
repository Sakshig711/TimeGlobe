// Default countries and their timezones (always displayed initially)
let displayedCountries = {
	Afghanistan: "Asia/Kabul",
	Brazil: "America/Sao_Paulo",
	Canada: "America/Toronto",
	China: "Asia/Shanghai",
	France: "Europe/Paris",
	Germany: "Europe/Berlin",
	India: "Asia/Kolkata",
	Japan: "Asia/Tokyo"
};

const predefinedCountries = {
	Afghanistan: "Asia/Kabul",
	Brazil: "America/Sao_Paulo",
	Canada: "America/Toronto",
	China: "Asia/Shanghai",
	France: "Europe/Paris",
	Germany: "Europe/Berlin",
	India: "Asia/Kolkata",
	Japan: "Asia/Tokyo",
	United_States: "America/New_York",
	Australia: "Australia/Sydney",
	Russia: "Europe/Moscow",
	Italy: "Europe/Rome",
	Spain: "Europe/Madrid",
	South_Korea: "Asia/Seoul",
	Mexico: "America/Mexico_City",
	South_Africa: "Africa/Johannesburg",
	Argentina: "America/Argentina/Buenos_Aires",
	Egypt: "Africa/Cairo",
	Indonesia: "Asia/Jakarta",
	United_Kingdom: "Europe/London",
	Thailand: "Asia/Bangkok",
	Saudi_Arabia: "Asia/Riyadh",
	Netherlands: "Europe/Amsterdam",
	Sweden: "Europe/Stockholm",
	Switzerland: "Europe/Zurich",
	Turkey: "Europe/Istanbul",
	Pakistan: "Asia/Karachi",
	Portugal: "Europe/Lisbon",
	Iran: "Asia/Tehran",
	Canada_East: "America/Halifax",
	Canada_West: "America/Vancouver",
	New_Zealand: "Pacific/Auckland",
	Philippines: "Asia/Manila",
	Chile: "America/Santiago",
	Colombia: "America/Bogota",
	Norway: "Europe/Oslo",
	Poland: "Europe/Warsaw",
	Belgium: "Europe/Brussels",
	Denmark: "Europe/Copenhagen",
	Singapore: "Asia/Singapore",
	Malaysia: "Asia/Kuala_Lumpur",
	Nigeria: "Africa/Lagos",
	Kenya: "Africa/Nairobi",
	Bangladesh: "Asia/Dhaka",
	Vietnam: "Asia/Ho_Chi_Minh",
	Ireland: "Europe/Dublin",
	Austria: "Europe/Vienna",
	Hungary: "Europe/Budapest",
	Czech_Republic: "Europe/Prague",
	Greece: "Europe/Athens",
	Israel: "Asia/Jerusalem",
	Ukraine: "Europe/Kiev",
	Kazakhstan: "Asia/Almaty",
	Uzbekistan: "Asia/Tashkent",
	Maldives: "Indian/Maldives",
	Iceland: "Atlantic/Reykjavik",
	Peru: "America/Lima",
	Paraguay: "America/Asuncion",
	Morocco: "Africa/Casablanca",
	Algeria: "Africa/Algiers",
	Ghana: "Africa/Accra",
	Angola: "Africa/Luanda",
	Zambia: "Africa/Lusaka",
	Ethiopia: "Africa/Addis_Ababa",
	Senegal: "Africa/Dakar",
	Tanzania: "Africa/Dar_es_Salaam",
	Uganda: "Africa/Kampala",
	Zimbabwe: "Africa/Harare",
	Mozambique: "Africa/Maputo",
	Sri_Lanka: "Asia/Colombo",
	Nepal: "Asia/Kathmandu",
	Bhutan: "Asia/Thimphu",
	Myanmar: "Asia/Yangon",
	Lebanon: "Asia/Beirut",
	Iraq: "Asia/Baghdad",
	Jordan: "Asia/Amman",
	Qatar: "Asia/Qatar",
	Oman: "Asia/Muscat",
	Kuwait: "Asia/Kuwait",
	Bahrain: "Asia/Bahrain",
	Costa_Rica: "America/Costa_Rica",
	Venezuela: "America/Caracas",
	Uruguay: "America/Montevideo",
	Ecuador: "America/Guayaquil",
	Bolivia: "America/La_Paz",
	Cuba: "America/Havana",
	Dominican_Republic: "America/Santo_Domingo",
	Guatemala: "America/Guatemala"
};

// Save displayedCountries to chrome.storage.local
function saveDisplayedCountries() {
	chrome.storage.local.set({ displayedCountries }, () => {
		console.log("Saved to storage:", displayedCountries);
	});
}

// Load displayedCountries from chrome.storage.local
function loadDisplayedCountries() {
	chrome.storage.local.get(["displayedCountries"], (result) => {
		if (result.displayedCountries) {
			// Load from storage
			displayedCountries = result.displayedCountries;
		} else {
			// Save defaults if no data found
			saveDisplayedCountries();
		}
		renderTimezones();
	});
}

function renderTimezones() {
	const timezoneContainer = document.getElementById("timezones");
	timezoneContainer.innerHTML = "";
    
	// Sort displayed countries alphabetically
	const sortedDisplayedCountries = Object.entries(displayedCountries).sort(([a], [b]) =>
	    a.localeCompare(b)
	);
    
	sortedDisplayedCountries.forEach(([country, timezone]) => {
	    const timezoneItem = document.createElement("div");
	    timezoneItem.className = "timezone-item";
	    timezoneItem.innerHTML = `
		<div class="timezone-info">
		    <div class="timezone-name">${country}</div>
		    <div class="timezone-time">${getTimeInTimezone(timezone)}</div>
		</div>
		<div class="timezone-actions">
		    <i class="fas fa-trash delete-icon" data-country="${country}"></i>
		</div>
	    `;
    
	    // Add functionality to the delete icon
	    timezoneItem.querySelector(".delete-icon").addEventListener("click", () => {
		if (!predefinedCountries[country]) {
		    predefinedCountries[country] = timezone;
		}
		delete displayedCountries[country];
		saveDisplayedCountries();
		renderTimezones();
		renderCountryDropdown();
	    });
    
	    timezoneContainer.appendChild(timezoneItem);
	});
    }
    
// Get current time in a given timezone
function getTimeInTimezone(timezone) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	}).format(new Date());
}

// Render dropdown for available countries
function renderCountryDropdown() {
	const countryDropdown = document.getElementById("country-dropdown");
	countryDropdown.innerHTML = ""; // Clear previous options

	// Sort predefined countries alphabetically and filter unused ones
	const sortedPredefinedCountries = Object.entries(predefinedCountries)
		.filter(([country]) => !displayedCountries[country])
		.sort(([a], [b]) => a.localeCompare(b));

	if (sortedPredefinedCountries.length === 0) {
		const noOption = document.createElement("option");
		noOption.textContent = "No countries available to add";
		noOption.disabled = true;
		countryDropdown.appendChild(noOption);
		return;
	}

	sortedPredefinedCountries.forEach(([country, timezone]) => {
		const option = document.createElement("option");
		option.value = timezone;
		option.textContent = country.replace(/_/g, " "); // Replace underscores with spaces
		countryDropdown.appendChild(option);
	});

	console.log("Dropdown Updated with Sorted Countries");
}

// Add selected country to displayedCountries
document.getElementById("confirm-add").addEventListener("click", () => {
	const countryDropdown = document.getElementById("country-dropdown");
	const selectedOption = countryDropdown.options[countryDropdown.selectedIndex];

	if (!selectedOption) {
		alert("Please select a valid country to add.");
		return;
	}

	const countryName = selectedOption.textContent;
	const timezone = selectedOption.value;

	displayedCountries[countryName] = timezone;
	delete predefinedCountries[countryName]; // Remove from dropdown options

	saveDisplayedCountries();
	renderTimezones();
	renderCountryDropdown();

	document.getElementById("country-selection-modal").style.display = "none";
});

// Open modal for adding countries
document.getElementById("add-country").addEventListener("click", () => {
	document.getElementById("country-selection-modal").style.display = "block";
	renderCountryDropdown();
});

// Load stored countries on startup
loadDisplayedCountries();
