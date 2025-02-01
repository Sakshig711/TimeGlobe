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
    
    function renderTimezones() {
	const timezoneContainer = document.getElementById("timezones");
	timezoneContainer.innerHTML = ""; // Clear existing timezones
    
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
    
    function getTimeInTimezone(timezone) {
	return new Intl.DateTimeFormat("en-US", {
	    timeZone: timezone,
	    hour: "2-digit",
	    minute: "2-digit",
	    hour12: true,
	}).format(new Date());
    }
    
    // Fetch available countries from the API
    async function fetchAvailableCountries() {
	try {
	    const response = await fetch("https://api.apyhub.com/data/dictionary/timezone", {
		headers: {
		    "Content-Type": "application/json",
		    "apy-token": "APY0aeIyxkTLqXwvNMAqy6YhbNlqEuRzNg4zvcIz0Kzz9prT8YkycmiiIriQd2UVcfwnX",
		},
	    });
    
	    const data = await response.json();
    
	    if (data && data.data) {
		availableCountries = data.data.filter((tz) => {
		    return tz.value && !Object.values(displayedCountries).includes(tz.value);
		});
    
		renderCountryDropdown();
	    } else {
		console.error("Invalid API response:", data);
	    }
	} catch (error) {
	    console.error("Error fetching available countries:", error);
	}
    }
    
    // Populate the dropdown with available countries
    function renderCountryDropdown() {
	const countryDropdown = document.getElementById("country-dropdown");
    
	// Clear existing options
	countryDropdown.innerHTML = "";
    
	if (availableCountries.length === 0) {
	    const noOption = document.createElement("option");
	    noOption.textContent = "No countries available";
	    noOption.disabled = true;
	    countryDropdown.appendChild(noOption);
	    return;
	}
    
	availableCountries.forEach((country) => {
	    const option = document.createElement("option");
	    option.value = country.value;
	    option.textContent = country.key;
	    countryDropdown.appendChild(option);
	});
    }
    
    // Event listener for the "Add Country" button
    document.getElementById("add-country").addEventListener("click", () => {
	document.getElementById("country-selection-modal").style.display = "block";
	fetchAvailableCountries();
    });
    
    // Event listener for the "Confirm Add" button
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
    
	// Remove the added country from the dropdown options
	availableCountries = availableCountries.filter((country) => country.value !== timezone);
	renderCountryDropdown();
    
	// Close modal
	document.getElementById("country-selection-modal").style.display = "none";
    
	// Disable "Add More Countries" button if limit reached
	const addCountryBtn = document.getElementById("add-country");
	if (Object.keys(displayedCountries).length >= maxAdditionalCountries) {
	    addCountryBtn.disabled = true;
	    addCountryBtn.textContent = "Limit Reached";
	}
    });
    
    // Render default timezones on page load
    renderTimezones();
    