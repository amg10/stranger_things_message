const rows = {
    'row-1': "ABCDEFGH".split(""),
    'row-2': "IJKLMNOPQ".split(""),
    'row-3': "RSTUVWXYZ".split("")
};

const colors = ['#ffed5e', '#ff4d4d', '#4dff4d', '#4d4dff', '#ff4dff', '#ff9f4d'];

// 1. Build the Wall UI
for (const [rowId, letters] of Object.entries(rows)) {
    const rowElement = document.getElementById(rowId);
    letters.forEach(char => {
        const div = document.createElement('div');
        div.className = 'letter-box';
        div.innerHTML = `<div class="light" id="light-${char}"></div><div class="letter">${char}</div>`;
        rowElement.appendChild(div);
    });
}

// 2. Blink All Function
async function blinkAll(duration = 800) {
    const allLights = document.querySelectorAll('.light');
    allLights.forEach(light => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        light.style.backgroundColor = randomColor;
        light.style.boxShadow = `0 0 30px 10px ${randomColor}`;
    });
    
    await new Promise(r => setTimeout(r, duration));
    
    allLights.forEach(light => {
        light.style.backgroundColor = '';
        light.style.boxShadow = '';
    });
}

// 3. Play Message Logic
async function playMessage() {
    await blinkAll(1000); 
    
    const urlParams = new URLSearchParams(window.location.search);
    const encodedMsg = urlParams.get('msg');
    
    if (encodedMsg) {
        const message = atob(encodedMsg).toUpperCase().replace(/[^A-Z]/g, '');
        await new Promise(r => setTimeout(r, 1000));

        // Light blinking sequence
        for (let char of message) {
            const light = document.getElementById(`light-${char}`);
            if (light) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                light.style.backgroundColor = color;
                light.style.boxShadow = `0 0 40px 15px ${color}`;
                await new Promise(r => setTimeout(r, 800));
                light.style.backgroundColor = '';
                light.style.boxShadow = '';
                await new Promise(r => setTimeout(r, 300));
            }
        }

        await new Promise(r => setTimeout(r, 500));

        // --- UPDATED MULTI-IMAGE LOGIC ---
        const overlay = document.getElementById('jumpscare');
        const overlayImg = document.getElementById('overlayImage');

        if (message === "RUN") {
            overlayImg.src = "image.png"; // Your local Demogorgon file
            overlay.classList.add('active');
            setTimeout(() => { overlay.classList.remove('active'); }, 3000);

        } else if (message === "HAPPYNEWYEAR") {
            overlayImg.src = "new_year.png"; // Your local New Year file
            overlay.classList.add('active');
            // This one only lasts 3 seconds as requested
            setTimeout(() => { overlay.classList.remove('active'); }, 3000);
        } else {
            await blinkAll(1500); 
        }
    }
}

function generateLink() {
    const input = document.getElementById('messageInput');
    const msg = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    if(!msg) return alert("Type something!");
    
    const encoded = btoa(msg);
    const link = `${window.location.origin}${window.location.pathname}?msg=${encoded}`;
    
    navigator.clipboard.writeText(link).then(() => {
        document.getElementById('linkOutput').innerHTML = `<p style="color: #4caf50;">Link Copied! Send it to a friend.</p>`;
    });
}

// Function to trigger when user clicks the button
async function initiateTransmission() {
    // Hide the overlay
    document.getElementById('startOverlay').style.display = 'none';
    
    // Start the light sequence
    await playMessage();
}

// Check on load if we should show the "Start" screen
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('msg')) {
        // A message exists! Show the entry screen
        document.getElementById('startOverlay').style.display = 'flex';
    } else {
        // No message, just person A creating one. Show the wall normally.
        document.getElementById('startOverlay').style.display = 'none';
        // Optional: blink once to show the wall is "alive"
        blinkAll(1000);
    }
};