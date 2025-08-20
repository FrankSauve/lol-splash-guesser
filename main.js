const form = document.getElementById("answer-form");
let answer = "";
let championNames;
let streak = 0;

console.log(form)

window.onload = async () => {
    const input = document.getElementById("answer");
    input.value = "";
    await getRandomSplash();
}

async function getRandomSplash() {
    championNames = await getAllChampionNames();
    const selectedName = championNames[Math.floor(Math.random() * championNames.length)];
    answer = selectedName;
    console.log(answer)
    const skinNums = await getSkinsForChampion(selectedName);
    const selectedSkinNum = skinNums[Math.floor(Math.random() * skinNums.length)];

    const splashUrl = await getSplash(selectedName, selectedSkinNum)
    const img = document.getElementById("splash");
    img.src = splashUrl;
}

async function getAllChampionNames() {
    let url = "https://ddragon.leagueoflegends.com/cdn/15.16.1/data/en_US/champion.json";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Riot API error: ${response.status}`);
        }
    
        const result = await response.json();
        return Object.values(result.data).map(champion => champion.id);
    } catch (error) {
        console.error(error.message);
        alert(error.message);
  }
}

async function getSkinsForChampion(championName) {
    let url = `https://ddragon.leagueoflegends.com/cdn/15.16.1/data/en_US/champion/${championName}.json`

     try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Riot API error: ${response.status}`);
        }
    
        const result = await response.json();
        return Object.values(result.data)[0].skins.map(skin => skin.num);
    } catch (error) {
        console.error(error.message);
        alert(error.message);
  }
}

async function getSplash(championName, skinNum) {
    let url = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skinNum}.jpg`

     try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Riot API error: ${response.status}`);
        }
    
        return response.url;
    } catch (error) {
        console.error(error.message);
        alert(error.message);
  }
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const input = document.getElementById("answer");
    const resultsDiv = document.getElementById("results");

    if (input.value.toLowerCase() == answer.toLowerCase()) {
        const result = document.createElement("p");
        result.className = "text-white"
        result.innerText = `✔ ${answer}`;
        resultsDiv.appendChild(result);
        input.value = "";

        streak++;
        const streakP = document.getElementById("streak");
        streakP.innerText = `Streak: ${streak}`

        await getRandomSplash();
    } else {
        const result = document.createElement("p");
        result.className = "text-white"
        result.innerText = `❌ ${input.value} --> ${answer}`;
        resultsDiv.appendChild(result);
        input.value = "";
        input.disabled = true;
        input.hidden = true;

        const reloadBtn = document.createElement("button");
        reloadBtn.className = "m-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        reloadBtn.innerText = "Retry";
        reloadBtn.onclick = () => {window.location.reload()}
        resultsDiv.appendChild(reloadBtn);

        document.getElementById("submitBtn").disabled = true;
        document.getElementById("submitBtn").hidden = true;
    }
})

const input = document.getElementById("answer");
const listContainer = document.getElementById("autocomplete-list");
let currentFocus = -1;

function renderList(filtered) {
    listContainer.innerHTML = "";
    if (filtered.length === 0) {
        listContainer.classList.add("hidden");
        return;
    }
    listContainer.classList.remove("hidden");

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.textContent = item;
        div.className = "px-4 py-2 cursor-pointer hover:bg-blue-100";
        div.addEventListener("click", () => {
        input.value = item;
        listContainer.innerHTML = "";
        listContainer.classList.add("hidden");
        });
        listContainer.appendChild(div);
    });
}

input.addEventListener("input", function() {
    const value = this.value.toLowerCase();
    currentFocus = -1;
    if (!value) {
        listContainer.innerHTML = "";
        listContainer.classList.add("hidden");
        return;
    }
    const filtered = championNames.filter(item =>
        item.toLowerCase().includes(value)
    );
    renderList(filtered);
});

input.addEventListener("keydown", function(e) {
    let items = listContainer.querySelectorAll("div");
    if (e.key === "ArrowDown") {
        currentFocus++;
        if (currentFocus >= items.length) currentFocus = 0;
        setActive(items);
    } else if (e.key === "ArrowUp") {
        currentFocus--;
        if (currentFocus < 0) currentFocus = items.length - 1;
        setActive(items);
    } else if (e.key === "Enter") {
            if (currentFocus > -1 && items[currentFocus]) {
            items[currentFocus].click();
        }
    }
});

function setActive(items) {
    if (!items) return;
    items.forEach(item => item.classList.remove("bg-blue-500", "text-white"));
    if (currentFocus >= 0 && currentFocus < items.length) {
        items[currentFocus].classList.add("bg-blue-500", "text-white");
        items[currentFocus].scrollIntoView({ block: "nearest" });
    }
}

document.addEventListener("click", function(e) {
if (e.target !== input) {
    listContainer.innerHTML = "";
    listContainer.classList.add("hidden");
}
});