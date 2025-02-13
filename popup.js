let displayedCountries = {
	Canada: "America/Toronto",
	China: "Asia/Shanghai",
	France: "Europe/Paris",
	Germany: "Europe/Berlin",
	India: "Asia/Kolkata",
	South_Korea: "Asia/Seoul",
	United_Kingdom: "Europe/London"
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
	Saudi_Arabia: "Asia/Riyadh",
	Turkey: "Europe/Istanbul",
	Netherlands: "Europe/Amsterdam",
	Switzerland: "Europe/Zurich",
	Sweden: "Europe/Stockholm",
	Thailand: "Asia/Bangkok",
	UAE: "Asia/Dubai",
	Singapore: "Asia/Singapore",
	Malaysia: "Asia/Kuala_Lumpur",
	Israel: "Asia/Jerusalem",
	Vietnam: "Asia/Ho_Chi_Minh",
	Philippines: "Asia/Manila",
	Ukraine: "Europe/Kiev",
	Iran: "Asia/Tehran",
	Pakistan: "Asia/Karachi",
	Bangladesh: "Asia/Dhaka",
	Portugal: "Europe/Lisbon",
	Greece: "Europe/Athens",
	Belgium: "Europe/Brussels",
	Norway: "Europe/Oslo",
	Poland: "Europe/Warsaw",
	Austria: "Europe/Vienna",
	Czech_Republic: "Europe/Prague",
	Colombia: "America/Bogota",
	Venezuela: "America/Caracas",
	Chile: "America/Santiago",
	Peru: "America/Lima",
	Nigeria: "Africa/Lagos",
	Kenya: "Africa/Nairobi",
	Morocco: "Africa/Casablanca",
	Algeria: "Africa/Algiers",
	Ethiopia: "Africa/Addis_Ababa",
	New_Zealand: "Pacific/Auckland",
	Qatar: "Asia/Qatar",
	Kuwait: "Asia/Kuwait",
	Bahrain: "Asia/Bahrain",
	Oman: "Asia/Muscat",
	Jordan: "Asia/Amman",
	Myanmar: "Asia/Yangon",
	Sri_Lanka: "Asia/Colombo",
	Nepal: "Asia/Kathmandu",
	Bangladesh: "Asia/Dhaka",
	Iceland: "Atlantic/Reykjavik",
	Ireland: "Europe/Dublin"
    };
    

function saveDisplayedCountries() {
	chrome.storage.local.set({ displayedCountries });
}

function loadDisplayedCountries() {
	chrome.storage.local.get(["displayedCountries"], (result) => {
		if (result.displayedCountries) {
			displayedCountries = result.displayedCountries;
			const countryEntries = Object.entries(displayedCountries);
			if (countryEntries.length > 7) {
				displayedCountries = Object.fromEntries(countryEntries.slice(0, 7));
			}
		} else {
			saveDisplayedCountries();
		}
		renderTimezones();
	});
}

function renderTimezones() {
	const timezoneContainer = document.getElementById("timezones");
	timezoneContainer.innerHTML = "";
	const sortedDisplayedCountries = Object.entries(displayedCountries).sort(([a], [b]) => a.localeCompare(b));

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

function getTimeInTimezone(timezone) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	}).format(new Date());
}

function renderCountryDropdown() {
	const countryDropdown = document.getElementById("country-dropdown");
	const addButton = document.getElementById("confirm-add");

	countryDropdown.innerHTML = "";
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
		option.textContent = country.replace(/_/g, " ");
		countryDropdown.appendChild(option);
	});

	addButton.disabled = Object.keys(displayedCountries).length >= 7;
}

document.getElementById("confirm-add").addEventListener("click", () => {
	if (Object.keys(displayedCountries).length >= 7) {
		alert("You can only display up to 7 countries at a time.");
		return;
	}

	const countryDropdown = document.getElementById("country-dropdown");
	const selectedOption = countryDropdown.options[countryDropdown.selectedIndex];

	if (!selectedOption) {
		alert("Please select a valid country to add.");
		return;
	}

	const countryName = selectedOption.textContent;
	const timezone = selectedOption.value;

	displayedCountries[countryName] = timezone;
	delete predefinedCountries[countryName];

	saveDisplayedCountries();
	renderTimezones();
	renderCountryDropdown();

	document.getElementById("country-selection-modal").style.display = "none";
});

document.getElementById("add-country").addEventListener("click", () => {
	if (Object.keys(displayedCountries).length >= 7) {
	    alert("Limit reached! You can only display up to 7 countries.");
	    return;
	}
	document.getElementById("country-selection-modal").style.display = "block";
	renderCountryDropdown();
    });
    
loadDisplayedCountries();
