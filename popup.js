document.addEventListener("DOMContentLoaded", () => {
        const timezoneContainer = document.getElementById("timezones");
      
        // Function to format the time in AM/PM
        function formatTime(utcOffset) {
          const currentTime = new Date();
          const utcHours = currentTime.getUTCHours();
          const utcMinutes = currentTime.getUTCMinutes();
          const offsetHours = parseInt(utcOffset.split(":")[0], 10) || 0;
          const offsetMinutes = parseInt(utcOffset.split(":")[1], 10) || 0;
          const localHours = (utcHours + offsetHours + 24) % 24;
          const localMinutes = (utcMinutes + offsetMinutes) % 60;
      
          const isPM = localHours >= 12;
          const displayHours = localHours % 12 || 12; // Convert 0 to 12 for AM/PM
          const formattedMinutes = localMinutes.toString().padStart(2, "0");
          const period = isPM ? "PM" : "AM";
      
          return `${displayHours}:${formattedMinutes} ${period}`;
        }
      
        // Fetch timezone data
        fetch("https://api.apyhub.com/data/dictionary/timezone", {
          headers: {
            "Content-Type": "application/json",
            "apy-token": "APY0aeIyxkTLqXwvNMAqy6YhbNlqEuRzNg4zvcIz0Kzz9prT8YkycmiiIriQd2UVcfwnX" // Replace with your token
          }
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data || !data.data) {
              console.error("Invalid API response format");
              return;
            }
      
            const capitalTimezones = {
              Afghanistan: "Asia/Kabul",
              Brazil: "America/Sao_Paulo",
              Canada: "America/Toronto",
              China: "Asia/Shanghai",
              France: "Europe/Paris",
              Germany: "Europe/Berlin",
              India: "Asia/Kolkata",
              Japan: "Asia/Tokyo",
              Russia: "Europe/Moscow",
              South_Africa: "Africa/Johannesburg"
            };
      
            // Process and map timezones
            const selectedTimezones = Object.entries(capitalTimezones).map(([country, capitalTimezone]) => {
              const timezone = data.data.find((tz) => tz.value === capitalTimezone);
              if (timezone) {
                const utcOffset = timezone.utc_time.split("UTC ")[1] || "00:00";
                const currentTime = formatTime(utcOffset);
                return { country, currentTime };
              }
              return null;
            }).filter((entry) => entry !== null);
      
            // Render timezones
            selectedTimezones.forEach((tz) => {
              const timezoneItem = document.createElement("div");
              timezoneItem.className = "timezone-item";
              timezoneItem.innerHTML = `
                <div class="timezone-name">${tz.country}</div>
                <div class="timezone-time">${tz.currentTime}</div>
              `;
              timezoneContainer.appendChild(timezoneItem);
            });
          })
          .catch((error) => {
            console.error("Error fetching timezones:", error);
          });
      });
      