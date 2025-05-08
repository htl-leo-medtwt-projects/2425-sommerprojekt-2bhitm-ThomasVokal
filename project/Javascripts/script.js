let autos = [];
let searchBox = document.getElementById("search-box");
let getriebeOptionen = ["Automatik", "Manuell"];
let favoriten = []

fetch("data/autos.json")
  .then(response => response.json())
  .then(data => {
      autos = data;
      console.log(autos);
      printSearchBox();
      renderAutos(autos);
  })
  .catch(error => console.error("Fehler beim Laden der Daten:", error));

function printSearchBox() {
    if (!searchBox) {
        console.error("Fehler: Suchbox nicht gefunden!");
        return;
    }

    let marken = [...new Set(autos.map(auto => auto.marke))];

    let minLeistung = Math.floor(Math.min(...autos.map(auto => auto.leistung)) / 10) * 10;
    let maxLeistung = Math.ceil(Math.max(...autos.map(auto => auto.leistung)) / 10) * 10;

    let minPreis = Math.floor(Math.min(...autos.map(auto => auto.preis)) / 1000) * 1000;
    let maxPreis = Math.ceil(Math.max(...autos.map(auto => auto.preis)) / 1000) * 1000;

    let minBaujahr = Math.min(...autos.map(auto => auto.baujahr));
    let maxBaujahr = Math.max(...autos.map(auto => auto.baujahr));

    let minKilometer = Math.min(...autos.map(auto => auto.kilometerstand));
    let maxKilometer = Math.max(...autos.map(auto => auto.kilometerstand));

    let treibstoffOptionen = [...new Set(autos.map(auto => auto.treibstoff))];

    let searchBrick = `
        <div class="filters-container">
            <h2 class="filters-title">Fahrzeugfilter</h2>
            <div class="filters">
                <select id="marke-filter">
                    <option value="">Alle Marken</option>
                    ${marken.map(marke => `<option value="${marke}">${marke}</option>`).join("")}
                </select>
                <select id="treibstoff-filter">
                    <option value="">Alle Treibstoffe</option>
                    ${treibstoffOptionen.map(treibstoff => `<option value="${treibstoff}">${treibstoff}</option>`).join("")}
                </select>
                <input type="number" id="min-leistung-filter" placeholder="Min. Leistung (PS)" min="${minLeistung}" max="${maxLeistung}">
                <input type="number" id="max-leistung-filter" placeholder="Max. Leistung (PS)" min="${minLeistung}" max="${maxLeistung}">

                <input type="number" id="min-preis-filter" placeholder="Min. Preis (€)" min="${minPreis}" max="${maxPreis}">
                <input type="number" id="max-preis-filter" placeholder="Max. Preis (€)" min="${minPreis}" max="${maxPreis}">

                <input type="number" id="min-baujahr-filter" placeholder="Min. Baujahr" min="${minBaujahr}" max="${maxBaujahr}">
                <input type="number" id="max-baujahr-filter" placeholder="Max. Baujahr" min="${minBaujahr}" max="${maxBaujahr}">

                <input type="number" id="min-kilometer-filter" placeholder="Min. Kilometer" min="${minKilometer}" max="${maxKilometer}">
                <input type="number" id="max-kilometer-filter" placeholder="Max. Kilometer" min="${minKilometer}" max="${maxKilometer}">

                
            </div
        </div>
    `;
    searchBox.innerHTML = searchBrick;
}

function filterAutos() {
    let marke = document.getElementById("marke-filter").value;
    let minLeistung = parseInt(document.getElementById("min-leistung-filter").value) || 0;
    let maxLeistung = parseInt(document.getElementById("max-leistung-filter").value) || Infinity;
    let minPreis = parseInt(document.getElementById("min-preis-filter").value) || 0;
    let maxPreis = parseInt(document.getElementById("max-preis-filter").value) || Infinity;
    let minBaujahr = parseInt(document.getElementById("min-baujahr-filter").value) || 0;
    let maxBaujahr = parseInt(document.getElementById("max-baujahr-filter").value) || Infinity;
    let minKilometer = parseInt(document.getElementById("min-kilometer-filter").value) || 0;
    let maxKilometer = parseInt(document.getElementById("max-kilometer-filter").value) || Infinity;
    let treibstoff = document.getElementById("treibstoff-filter").value;

    let filteredAutos = autos.filter(auto => 
        (marke === "" || auto.marke === marke) &&
        (auto.leistung >= minLeistung && auto.leistung <= maxLeistung) &&
        (auto.preis >= minPreis && auto.preis <= maxPreis) &&
        (auto.baujahr >= minBaujahr && auto.baujahr <= maxBaujahr) &&
        (auto.kilometerstand >= minKilometer && auto.kilometerstand <= maxKilometer) &&
        (treibstoff === "" || auto.treibstoff === treibstoff)
    );

    renderAutos(filteredAutos);
}

function createDetailView(auto) {
    if (document.getElementById("detail-view")) return;

    const detailView = document.createElement("div");
    detailView.id = "detail-view";
    detailView.innerHTML = `
        <div class="detail-content">
            <button id="close-detail-view">X</button>
            <div class="detail-left">
                <img src="${auto.bild}" alt="${auto.marke} ${auto.modell}">
                <h3><strong></strong> ${generateDescription(auto)}</h3>
            </div>
            <div class="detail-right">
                <p>${auto.marke} ${auto.modell}</p>
                <p><strong>Preis:</strong> ${auto.preis} €</p>
                <p><strong>Leistung:</strong> ${auto.leistung} PS</p>
                <p><strong>Zylinder:</strong> ${auto.zylinder}</p>
                <p><strong>Standort:</strong> ${auto.standort}</p>
                <p><strong>Baujahr:</strong> ${auto.baujahr}</p>
                <p><strong>Kilometerstand:</strong> ${auto.kilometerstand} km</p>
                <p><strong>Treibstoff:</strong> ${auto.treibstoff}</p>
                <p><strong>Getriebe:</strong> ${auto.getriebe}</p>
                <p><strong>Fahrzeugtyp:</strong> ${auto.fahrzeugtyp}</p>
                <p><strong>Farbe:</strong> ${auto.farbe}</p>
                <button id="fav-btn" class="fav-btn">⭐ Zum Favoriten hinzufügen</button>
            </div>
        </div>
    `;
    document.body.appendChild(detailView);

    gsap.fromTo(
        detailView.querySelector(".detail-content"),
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.5, ease: "power4.out" }
    );

    document.getElementById("close-detail-view").addEventListener("click", () => {
        gsap.to(detailView.querySelector(".detail-content"), {
            y: "100%",
            opacity: 0,
            duration: 0.5,
            ease: "power4.in",
            onComplete: () => detailView.remove()
        });
    });

    document.getElementById("fav-btn").addEventListener("click", (event) => {
        let favoriten = JSON.parse(localStorage.getItem("favoriten")) || [];

        if (!auto.id) {
            auto.id = `${auto.marke}-${auto.modell}-${auto.baujahr}-${auto.kilometerstand}`;
        }

        if (!favoriten.some(fav => fav.id === auto.id)) {
            favoriten.push(auto);
            localStorage.setItem("favoriten", JSON.stringify(favoriten));
        }

        event.target.textContent = "Favorit Hinzugefügt";
        event.target.disabled = true;
    });

    let favoriten = JSON.parse(localStorage.getItem("favoriten")) || [];
    if (favoriten.some(fav => fav.id === auto.id)) {
        const favButton = document.getElementById("fav-btn");
        favButton.textContent = "Favorit Hinzugefügt";
        favButton.disabled = true;
    }
}

function renderAutos(filteredAutos) {

    let container = document.getElementById("auto-container");
    container.innerHTML = "";

    for (let i = 0; i < filteredAutos.length; i++) {
        let auto = filteredAutos[i];
        let autoBox = document.createElement("div");
        autoBox.classList.add("auto-box");
        autoBox.id = i;
        autoBox.innerHTML = `
            <h2>${auto.marke} ${auto.modell}</h2>
            <img src="${auto.bild}" alt="${auto.marke} ${auto.modell}" class="auto-bild">
            <h3><strong>Preis:</strong> ${auto.preis} €</h3>
            <p><strong>Leistung:</strong> ${auto.leistung} PS</p>
            <p><strong>Kilometer:</strong> ${auto.kilometerstand} km</p>
            <p><strong>Baujahr:</strong> ${auto.baujahr}</p>
            <p><strong>Getriebe:</strong> ${auto.getriebe}</p>
            <p><strong>Treibstoff:</strong> ${auto.treibstoff}</p>
        `;
        autoBox.addEventListener("click", () => createDetailView(auto));
        container.appendChild(autoBox);

        // Intersection Observer für Animation (Hilfe von KI)
        const observer = new IntersectionObserver(entries => {
            for (let j = 0; j < entries.length; j++) {
                let entry = entries[j];
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        opacity: 1,
                        y: 0,
                        duration: 0.2,
                        ease: "power4.out"
                    });
                    observer.unobserve(entry.target);
                }
            }
        }, { threshold: 0.01 });

        observer.observe(autoBox);
    }
}

function generateDescription(auto) {
    return `Der ${auto.marke} ${auto.modell} ist ein ${auto.fahrzeugtyp} mit ${auto.leistung} PS und einem ${auto.getriebe}-Getriebe. 
    Er wurde im Jahr ${auto.baujahr} gebaut und hat bisher ${auto.kilometerstand} km zurückgelegt. 
    Dieses Fahrzeug ist in ${auto.farbe} erhältlich und verwendet ${auto.treibstoff} als Treibstoff.`;
}

document.addEventListener("change", event => {
    if (event.target.closest(".filters")) {
        filterAutos();
    }
});

let tempCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "light") {
        document.documentElement.classList.add("light-mode");
        document.getElementById("whiteModeToggle").innerHTML = "LIGHT";
    } else {
        document.documentElement.classList.remove("light-mode");
        document.getElementById("whiteModeToggle").innerHTML = "DARK";
    }

    if (window.location.pathname.includes("favoriten.html")) {
        loadFavoriten();
    }

    document.getElementById("logo").addEventListener("click", () => {
        window.location.href = "autos.html";
    });
});


document.getElementById("whiteModeToggle").addEventListener("click", () => {
    const mode = document.documentElement.classList.toggle("light-mode") ? "LIGHT" : "DARK";
    localStorage.setItem("theme", mode.toLowerCase());
    document.getElementById("whiteModeToggle").innerHTML = mode;
});

document.getElementById("dropDown").onclick = () => document.querySelector(".nav-rechts").classList.toggle("active");

