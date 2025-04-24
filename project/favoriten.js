document.addEventListener("DOMContentLoaded", () => {
    loadFavoriten();
});

function loadFavoriten() {
    const favoriten = JSON.parse(localStorage.getItem("favoriten")) || [];
    const container = document.getElementById("auto-container");

    if (favoriten.length === 0) {
        container.innerHTML = "<p>Keine Favoriten gespeichert.</p>";
        return;
    }

    renderFavoriten(favoriten);
}

function renderFavoriten(favoriten) {
    const container = document.getElementById("auto-container");
    container.innerHTML = "";

    favoriten.forEach(auto => {
        const autoBox = document.createElement("div");
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
    });
}
