let autos = [];
let searchBox = document.getElementById("search-box");
let favoriten = [];
let empfohlenContainer = document.getElementById("empfohlen-container");
if (empfohlenContainer) {
    empfohlenContainer.innerHTML = "<div style='color:#7700ff;text-align:center;padding:30px;'>Lade Daten...</div>";
}

fetch("data/autos.json")
  .then(response => {
      if (!response.ok) throw new Error("Autos konnten nicht geladen werden!");
      return response.json();
  })
  .then(data => {
      autos = data;
      printEmpfohlenFragebogen();
      printSearchBox();
      renderAutos(autos);
  })
  .catch(error => {
      if (empfohlenContainer) {
          empfohlenContainer.innerHTML = "<div style='color:red;text-align:center;padding:30px;'>Fehler beim Laden der Fahrzeugdaten!</div>";
      }
      console.error("Fehler beim Laden der Daten:", error);
  });

// --- NEU: Empfohlenes Auto Fragebogen & Anzeige ---
function printEmpfohlenFragebogen() {
    if (!empfohlenContainer) return;
    let marken = [...new Set(autos.map(auto => auto.marke))];
    let treibstoffe = [...new Set(autos.map(auto => auto.treibstoff))];
    let getriebe = [...new Set(autos.map(auto => auto.getriebe))];
    let fahrzeugtypen = [...new Set(autos.map(auto => auto.fahrzeugtyp))];
    let zylinder = [...new Set(autos.map(auto => auto.zylinder))];

    empfohlenContainer.innerHTML = `
        <div class="empfohlen-box">
            <h2>Dein empfohlenes Auto</h2>
            <form id="empfohlen-form" class="empfohlen-form">
                <select name="marke" required>
                    <option value="">Marke wählen</option>
                    ${marken.map(m => `<option value="${m}">${m}</option>`).join("")}
                </select>
                <input type="number" name="baujahr" placeholder="Baujahr" required min="1900" max="2100">
                <input type="number" name="kilometerstand" placeholder="Kilometerstand" required min="0">
                <input type="number" name="leistung" placeholder="Leistung (PS)" required min="1">
                <input type="number" name="preis" placeholder="Preis (€)" required min="0">
                <select name="treibstoff" required>
                    <option value="">Treibstoff wählen</option>
                    ${treibstoffe.map(t => `<option value="${t}">${t}</option>`).join("")}
                </select>
                <select name="getriebe" required>
                    <option value="">Getriebe wählen</option>
                    ${getriebe.map(g => `<option value="${g}">${g}</option>`).join("")}
                </select>
                <select name="fahrzeugtyp" required>
                    <option value="">Fahrzeugtyp wählen</option>
                    ${fahrzeugtypen.map(f => `<option value="${f}">${f}</option>`).join("")}
                </select>
                <select name="zylinder" required>
                    <option value="">Zylinder wählen</option>
                    ${zylinder.map(z => `<option value="${z}">${z}</option>`).join("")}
                </select>
                <button type="submit">Empfohlenes Auto finden</button>
            </form>
            <div id="empfohlen-auto-anzeige"></div>
        </div>
    `;

    document.getElementById("empfohlen-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const form = e.target;
        const values = {
            marke: form.marke.value,
            baujahr: parseInt(form.baujahr.value),
            kilometerstand: parseInt(form.kilometerstand.value),
            leistung: parseFloat(form.leistung.value),
            preis: parseInt(form.preis.value),
            treibstoff: form.treibstoff.value,
            getriebe: form.getriebe.value,
            fahrzeugtyp: form.fahrzeugtyp.value,
            zylinder: parseInt(form.zylinder.value)
        };
        const empfohlen = findeEmpfohlenesAuto(values);
        renderEmpfohlenesAuto(empfohlen);
    });
}

function findeEmpfohlenesAuto(wunsch) {
    let minScore = Infinity;
    let bestAuto = null;
    for (const auto of autos) {
        let score = 0;
        score += auto.marke === wunsch.marke ? 0 : 10000;
        score += auto.treibstoff === wunsch.treibstoff ? 0 : 1000;
        score += auto.getriebe === wunsch.getriebe ? 0 : 1000;
        score += auto.fahrzeugtyp === wunsch.fahrzeugtyp ? 0 : 1000;
        score += auto.zylinder === wunsch.zylinder ? 0 : 100;
        score += Math.abs(auto.baujahr - wunsch.baujahr);
        score += Math.abs(auto.kilometerstand - wunsch.kilometerstand) / 1000;
        score += Math.abs(auto.leistung - wunsch.leistung);
        score += Math.abs(auto.preis - wunsch.preis) / 1000;
        if (score < minScore) {
            minScore = score;
            bestAuto = auto;
        }
    }
    return bestAuto;
}

function renderEmpfohlenesAuto(auto) {
    const anzeige = document.getElementById("empfohlen-auto-anzeige");
    if (!auto) {
        anzeige.innerHTML = `<p>Kein passendes Auto gefunden.</p>`;
        return;
    }
    anzeige.innerHTML = `
        <div class="empfohlen-auto-card">
            <h3>${auto.marke} ${auto.modell}</h3>
            <img src="${auto.bild}" alt="${auto.marke} ${auto.modell}" style="max-width:300px; border-radius:10px;">
            <p><strong>Preis:</strong> ${auto.preis} €</p>
            <p><strong>Leistung:</strong> ${auto.leistung} PS</p>
            <p><strong>Kilometerstand:</strong> ${auto.kilometerstand} km</p>
            <p><strong>Baujahr:</strong> ${auto.baujahr}</p>
            <p><strong>Getriebe:</strong> ${auto.getriebe}</p>
            <p><strong>Treibstoff:</strong> ${auto.treibstoff}</p>
            <p><strong>Fahrzeugtyp:</strong> ${auto.fahrzeugtyp}</p>            <p><strong>Zylinder:</strong> ${auto.zylinder}</p>
        </div>
    `;
}

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
        triggerPageTransition("autos.html");
    });

    transitionScreen.classList.add("fade-out"); // Add fade-out class
    setTimeout(() => {
        transitionScreen.classList.remove("active", "fade-out");
    }, 500); // Ensure the fade-out animation completes
});

document.getElementById("whiteModeToggle").addEventListener("click", () => {
    const mode = document.documentElement.classList.toggle("light-mode") ? "LIGHT" : "DARK";
    localStorage.setItem("theme", mode.toLowerCase());
    document.getElementById("whiteModeToggle").innerHTML = mode;
});

document.getElementById("dropDown").onclick = () => {
    const navRechts = document.querySelector(".nav-rechts");
    if (navRechts.classList.contains("active")) {
        navRechts.classList.remove("active");
        navRechts.classList.add("inactive");
        setTimeout(() => navRechts.classList.remove("inactive"), 1000);
    } else {
        navRechts.classList.add("active");
    }
};

const transitionScreen = document.createElement("div");
transitionScreen.classList.add("transition-screen");
document.body.appendChild(transitionScreen);

function triggerPageTransition(url) {
    transitionScreen.classList.add("active");
    setTimeout(() => {
        window.location.href = url;
    }, 1000);
}

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("#")) {
            event.preventDefault();
            triggerPageTransition(href);
        }
    });
});

