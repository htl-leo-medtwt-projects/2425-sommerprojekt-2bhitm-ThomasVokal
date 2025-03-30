let autos = [];
let searchBox = document.getElementById("search-box");
let getriebeOptionen = ["Automatik", "Manuell"];

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

    // Marken extrahieren
    let marken = [...new Set(autos.map(auto => auto.marke))];

    let minLeistung = Math.floor(Math.min(...autos.map(auto => auto.leistung)) / 10) * 10;
    let maxLeistung = Math.max(...autos.map(auto => auto.leistung));
    let leistungSchritte = [];
    for (let i = minLeistung; i <= maxLeistung; i += 50) {
        leistungSchritte.push(i);
    }

    let minPreis = Math.floor(Math.min(...autos.map(auto => auto.preis)) / 1000) * 1000;
    let maxPreis = Math.ceil(Math.max(...autos.map(auto => auto.preis)) / 1000) * 1000;
    let preisSchritte = [];
    for (let i = minPreis; i <= maxPreis; i += 5000) {
        preisSchritte.push(i);
    }

    let searchBrick = `
        <div class="filters-container">
            <h2 class="filters-title">Fahrzeugfilter</h2>
            <div class="filters">
                <select id="marke-filter">
                    <option value="">Alle Marken</option>
                    ${marken.map(marke => `<option value="${marke}">${marke}</option>`).join("")}
                </select>

                <select id="leistung-filter">
                    <option value="">Alle Leistungen</option>
                    ${leistungSchritte.map(leistung => `<option value="${leistung}">von ${leistung} PS</option>`).join("")}
                </select>

                <select id="preis-filter">
                    <option value="">Alle Preise</option>
                    ${preisSchritte.map(preis => `<option value="${preis}">Bis ${preis} €</option>`).join("")}
                </select>

                <select id="baujahr-filter">
                    <option value="">Alle Baujahre</option>
                    ${Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i)
                        .map(baujahr => `<option value="${baujahr}">${baujahr}</option>`).join("")}
                </select>

                <select id="getriebe-filter">
                    <option value="">Alle Getriebe</option>
                    ${getriebeOptionen.map(getriebe => `<option value="${getriebe}">${getriebe}</option>`).join("")}
                </select>

                <select id="treibstoff-filter">
                    <option value="">Alle Treibstoffe</option>
                    <option value="Benzin">Benzin</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Elektro">Elektro</option>
                </select>

                <select id="kilometer-filter">
                    <option value="">Alle Kilometer</option>
                    <option value="50000">Bis 50.000 km</option>
                    <option value="100000">Bis 100.000 km</option>
                    <option value="150000">Bis 150.000 km</option>
                    <option value="200000">Bis 200.000 km</option>
                </select>
            </div>
        </div>
    `;
    searchBox.innerHTML = searchBrick;
}

function filterAutos() {
    let marke = document.getElementById("marke-filter").value;
    let leistung = document.getElementById("leistung-filter").value;
    let preis = document.getElementById("preis-filter").value;
    let baujahr = document.getElementById("baujahr-filter").value;
    let getriebe = document.getElementById("getriebe-filter").value;
    let treibstoff = document.getElementById("treibstoff-filter").value;
    let kilometer = document.getElementById("kilometer-filter").value;

    let filteredAutos = autos.filter(auto => 
        (marke === "" || auto.marke === marke) &&
        (leistung === "" || auto.leistung >= parseInt(leistung)) &&
        (preis === "" || auto.preis <= parseInt(preis)) &&
        (baujahr === "" || auto.baujahr <= parseInt(baujahr)) &&
        (getriebe === "" || auto.getriebe === getriebe) &&
        (treibstoff === "" || auto.treibstoff === treibstoff) &&
        (kilometer === "" || auto.kilometerstand <= parseInt(kilometer))
    );

    renderAutos(filteredAutos);
}

function renderAutos(filteredAutos) {
    let container = document.getElementById("auto-container");
    container.innerHTML = "";

    filteredAutos.forEach(auto => {
        let autoBox = document.createElement("div");
        autoBox.classList.add("auto-box");
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
        container.appendChild(autoBox);

        // Intersection Observer für Animation (Hilfe von KI)
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        opacity: 1,
                        y: 0,
                        duration: 0.2,
                        ease: "power4.out"
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.01 });

        observer.observe(autoBox);
    });
}

document.addEventListener("change", event => {
    if (event.target.closest(".filters")) {
        filterAutos();
    }
});

let tempCount = 0;

document.getElementById("whiteModeToggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("light-mode");
    if (tempCount % 2 == 0) {
        document.getElementById('whiteModeToggle').innerHTML = "LIGHT";
    }else {
        document.getElementById('whiteModeToggle').innerHTML = "DARK";
    }
    tempCount++;
});

document.getElementById("dropDown").onclick = () => document.querySelector(".nav-rechts").classList.toggle("active");

