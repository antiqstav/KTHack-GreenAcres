document.addEventListener("DOMContentLoaded", function () {
    // localStorage.clear();
    const input = document.getElementById('coords');
    const submit = document.getElementById('saveCoords');
    const save = document.getElementById('saved');
    save.style.display = 'none';
    
    submit.addEventListener('click', function () {
        const inp = input.value;
        const regex = /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/;
        save.style.display = 'block';
        setTimeout(() => {
            save.style.display = 'none';
        }, 3000);
        if (regex.test(inp)) {
            console.log('Valid coordinates:', inp);
            save.innerText = "Saved!";
            localStorage.setItem("latitude", Number(inp.split(',')[0].trim()));
            localStorage.setItem("longitude", Number(inp.split(',')[1].trim()));
        } else {
            save.innerText = "Incorrect format inputted!";
            console.error('User-entered information doesn\'t follow the format x,y');
        }
        input.value = '';
    });
});

var map = L.map('map').setView([38.7946, 263.14453], 4);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', function(e) {
    var popup = L.popup();
    var lat = e.latlng.lat.toFixed(2);
    var lon = e.latlng.lng.toFixed(2);
    if (lat > 180) {
        lat -= 180;
        while (lat >= 180) {
            lat -= 180;
        }
    }
    else if (lat < -180) {
        lat += 180;
        while (lat <= -180) {
            lat += 180;
        }
    }
    if (lon > 180) {
        lon -= 180;
        while (lon >= 180) {
            lon -= 180;
        }
    }
    else if (lon < -180) {
        lon += 180;
        while (lon <= -180) {
            lon += 180;
        }
    }
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + lat + ", " + lon)
        .openOn(map);
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lon);
});