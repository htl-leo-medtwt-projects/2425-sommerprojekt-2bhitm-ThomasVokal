document.addEventListener("DOMContentLoaded", () => {
    loadFavoriten();

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
});

function loadFavoriten() {
    const favoriten = JSON.parse(localStorage.getItem("favoriten")) || [];
    const container = document.getElementById("auto-container");

    if (favoriten.length === 0) {
        container.innerHTML = "<h1>Keine Favoriten gespeichert.</h1>"
        ;
        return;
    }

    renderFavoriten(favoriten);
}

function renderFavoriten(favoriten) {
    const container = document.getElementById("auto-container");
    container.innerHTML = "";

    for (let i = 0; i < favoriten.length; i++) {
        const auto = favoriten[i];
        const autoBox = document.createElement("div");
        autoBox.classList.add("auto-box");
        autoBox.innerHTML = `
            <h2>${auto.marke} ${auto.modell}</h2>
            <img src="../${auto.bild}" alt="${auto.marke} ${auto.modell}" class="auto-bild">
            <h3><strong>Preis:</strong> ${auto.preis} €</h3>
            <p><strong>Leistung:</strong> ${auto.leistung} PS</p>
            <p><strong>Kilometer:</strong> ${auto.kilometerstand} km</p>
            <p><strong>Baujahr:</strong> ${auto.baujahr}</p>
            <p><strong>Getriebe:</strong> ${auto.getriebe}</p>
            <p><strong>Treibstoff:</strong> ${auto.treibstoff}</p>
        `;
        autoBox.addEventListener("click", () => createDetailView(auto));
        container.appendChild(autoBox);

        // Intersection Observer for animation
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
    }
}

function createDetailView(auto) {
    // Check if detail view already exists
    if (document.getElementById("detail-view")) return;

    const detailView = document.createElement("div");
    detailView.id = "detail-view";
    detailView.innerHTML = `
        <div class="detail-content">
            <button id="close-detail-view">X</button>
            <div class="detail-left">
                <img src="../${auto.bild}" alt="${auto.marke} ${auto.modell}">
                <h3><strong></strong> ${generateDescription(auto)}</h3>
            </div>
            <div class="detail-right">
                <h2>${auto.marke} ${auto.modell}</h2>
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
                <button id="remove-fav-btn" class="fav-btn">❌ Favorit entfernen</button>
            </div>
        </div>
    `;
    document.body.appendChild(detailView);

    // Add GSAP animation for detail view
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

    function generateDescription(auto) {
        return `Der ${auto.marke} ${auto.modell} ist ein ${auto.fahrzeugtyp} mit ${auto.leistung} PS und einem ${auto.getriebe}-Getriebe. 
        Er wurde im Jahr ${auto.baujahr} gebaut und hat bisher ${auto.kilometerstand} km zurückgelegt. 
        Dieses Fahrzeug ist in ${auto.farbe} erhältlich und verwendet ${auto.treibstoff} als Treibstoff.`;
    }

    document.getElementById("remove-fav-btn").addEventListener("click", () => {
        let favoriten = JSON.parse(localStorage.getItem("favoriten")) || [];
        favoriten = favoriten.filter(fav => fav.id !== auto.id);
        localStorage.setItem("favoriten", JSON.stringify(favoriten));
        detailView.remove();
        loadFavoriten();
    });
}

// Theme ändern und in localstorage speichern für Seitenübergreifendes wechseln
document.getElementById("whiteModeToggle").addEventListener("click", () => {
    const mode = document.documentElement.classList.toggle("light-mode") ? "LIGHT" : "DARK";
    localStorage.setItem("theme", mode.toLowerCase());
    document.getElementById("whiteModeToggle").innerHTML = mode;
});

document.getElementById("dropDown").onclick = () => document.querySelector(".nav-rechts").classList.toggle("active");

