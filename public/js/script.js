(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})();



if (document.getElementById("map")) {
    // Guard: only init map if coords are valid
    if (mapCoords[0] && mapCoords[1]) {
        var map = L.map("map").setView(mapCoords, 9);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.marker(mapCoords)
            .addTo(map)
            .bindPopup(`<b>${listingTitle}</b>`)
            .openPopup();
    } else {
        document.getElementById("map").innerHTML =
            "<p>Map not available for this listing.</p>";
    }
}