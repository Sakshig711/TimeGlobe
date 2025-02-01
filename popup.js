// Default countries and their timezones
let displayedCountries = {
	Afghanistan: "Asia/Kabul",
	Brazil: "America/Sao_Paulo",
	Canada: "America/Toronto",
	China: "Asia/Shanghai",
	France: "Europe/Paris",
	Germany: "Europe/Berlin",
	India: "Asia/Kolkata",
	Japan: "Asia/Tokyo",
    };
    
    let availableCountries = [];
    const maxAdditionalCountries = 10;
    
    // Renders the list of displayed timezones
    function renderTimezones() {
	const timezoneContainer = document.getElementById("timezones");
	timezoneContainer.innerHTML = ""; 
    
	Object.entries(displayedCountries).forEach(([country, timezone]) => {
	    const timezoneItem = document.createElement("div");
	    timezoneItem.className = "timezone-item";
	    timezoneItem.innerHTML = `
		<div class="timezone-info">
		    <div class="timezone-name">${country}</div>
		    <div class="timezone-time">${getTimeInTimezone(timezone)}</div>
		</div>
		<div class="timezone-actions">
		    <button class="delete-btn" data-country="${country}">Delete</button>
		</div>
	    `;
    
	    timezoneItem.querySelector(".delete-btn").addEventListener("click", () => {
		delete displayedCountries[country];
		renderTimezones();
		fetchAvailableCountries();
    
		const addCountryBtn = document.getElementById("add-country");
		if (Object.keys(displayedCountries).length < maxAdditionalCountries) {
		    addCountryBtn.disabled = false;
		    addCountryBtn.textContent = "Add More Countries";
		}
	    });
    
	    timezoneContainer.appendChild(timezoneItem);
	});
    }
    
    // Gets the current time in a given timezone
    function getTimeInTimezone(timezone) {
	return new Intl.DateTimeFormat("en-US", {
	    timeZone: timezone,
	    hour: "2-digit",
	    minute: "2-digit",
	    hour12: true,
	}).format(new Date());
    }
    
    // Fetches available countries from the API and removes duplicates
    async function fetchAvailableCountries() {
	console.log("Fetching available countries...");
	try {
	    const response = await fetch("https://api.apyhub.com/data/dictionary/timezone", {
		headers: {
		    "Content-Type": "application/json",
		    "apy-token": "APY0aeIyxkTLqXwvNMAqy6YhbNlqEuRzNg4zvcIz0Kzz9prT8YkycmiiIriQd2UVcfwnX",
		},
	    });
    
	    const data = await response.json();
	    console.log("API Response:", data);
    
	    if (data && data.data) {
		const uniqueTimezones = new Set();
    
		availableCountries = data.data
		    .map((tz) => tz.value)
		    .filter((timezone) => {
			if (!uniqueTimezones.has(timezone)) {
			    uniqueTimezones.add(timezone);
			    return true;
			}
			return false;
		    })
		    .map((timezone) => ({ country: timezone, timezone }));
    
		console.log("Filtered Available Countries:", availableCountries);
		renderCountryDropdown();
	    } else {
		console.error("Invalid API response:", data);
	    }
	} catch (error) {
	    console.error("Error fetching available countries:", error);
	}
    }
    
    // Updates the country dropdown with available options
    function renderCountryDropdown() {
	const countryDropdown = document.getElementById("country-dropdown");
	countryDropdown.innerHTML = "";
    
	availableCountries.forEach((country) => {
	    const option = document.createElement("option");
	    option.value = country.timezone;
	    option.textContent = country.timezone;
	    countryDropdown.appendChild(option);
	});
    
	console.log("Dropdown Updated with Full Timezones");
    }
    
    // Opens the country selection modal and fetches countries
    document.getElementById("add-country").addEventListener("click", () => {
	document.getElementById("country-selection-modal").style.display = "block";
	fetchAvailableCountries();
    });
    
    // Adds the selected country to the displayed list
    document.getElementById("confirm-add").addEventListener("click", () => {
	const countryDropdown = document.getElementById("country-dropdown");
	const selectedOption = countryDropdown.options[countryDropdown.selectedIndex];
    
	if (!selectedOption) {
	    alert("Please select a country to add.");
	    return;
	}
    
	const countryName = selectedOption.textContent;
	const timezone = selectedOption.value;
    
	if (Object.keys(displayedCountries).length >= maxAdditionalCountries) {
	    alert("You can only add up to 10 countries.");
	    return;
	}
    
	displayedCountries[countryName] = timezone;
	renderTimezones();
    
	availableCountries = availableCountries.filter((country) => country.value !== timezone);
	renderCountryDropdown();
    
	document.getElementById("country-selection-modal").style.display = "none";
    
	const addCountryBtn = document.getElementById("add-country");
	if (Object.keys(displayedCountries).length >= maxAdditionalCountries) {
	    addCountryBtn.disabled = true;
	    addCountryBtn.textContent = "Limit Reached";
	}
    });
    
    // Initial render of default timezones
    renderTimezones();
    