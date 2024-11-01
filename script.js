// script.js

document.addEventListener("DOMContentLoaded", () => {
    /* -----------------------------------
       1. Penanganan Formulir Prediksi (CKD Prediction Form Handling)
    ----------------------------------- */
    const predictionForm = document.getElementById("predictionForm");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");

    /**
     * Fungsi untuk mensimulasikan prediksi CKD berdasarkan usia dan hemoglobin.
     * @param {number} age - Usia pengguna.
     * @param {number} hemoglobin - Kadar hemoglobin pengguna (g/dL).
     * @returns {string} - "CKD" atau "Not CKD" atau pesan error.
     */
    function simulateCKDPrediction(age, hemoglobin) {
        if (age >= 0 && age < 18) { // Anak-anak (0-18 tahun)
            if (hemoglobin < 11.5 || hemoglobin > 13.5) {
                return "CKD";
            }
        } else if (age >= 18 && age < 65) { // Dewasa (18-64 tahun)
            if (hemoglobin < 12 || hemoglobin > 17.5) {
                return "CKD";
            }
        } else if (age >= 65) { // Lansia (65+ tahun)
            if (hemoglobin < 11.5 || hemoglobin > 16.0) {
                return "CKD";
            }
        } else {
            return "Data Usia Tidak Valid";
        }
        return "Not CKD";
    }

    /**
     * Fungsi untuk memeriksa dan memberikan umpan balik tentang kadar hemoglobin, tekanan darah, dan gula darah.
     * @param {number} age - Usia pengguna.
     * @param {number} hemoglobin - Kadar hemoglobin pengguna (g/dL).
     * @param {number} bloodPressure - Tekanan darah pengguna (mmHg).
     * @param {number} bloodGlucose - Kadar gula darah pengguna (mg/dL).
     * @returns {string} - Pesan umpan balik terkait kesehatan.
     */
    function evaluateHealthParameters(age, hemoglobin, bloodPressureDiastolic, bloodGlucose) {
        let messages = "";
    
        // Hemoglobin check
        if (age <= 10) {
            if (hemoglobin < 11.5) messages += "Hemoglobin anda terlalu rendah.<br>";
            else if (hemoglobin > 13.5) messages += "Kadar hemoglobin anda terlalu tinggi.<br>";
        } else if (age <= 64) {
            if (hemoglobin < 12) messages += "Hemoglobin anda terlalu rendah.<br>";
            else if (hemoglobin > 17.5) messages += "Kadar hemoglobin anda terlalu tinggi.<br>";
        } else { // age >= 65
            if (hemoglobin < 11.5) messages += "Hemoglobin anda terlalu rendah.<br>";
            else if (hemoglobin > 16) messages += "Kadar hemoglobin anda terlalu tinggi.<br>";
        }
    
        // Pemeriksaan tekanan darah diastolik
        if (bloodPressureDiastolic >= 80) {
            messages += "Tekanan darah diastolik Anda terlalu tinggi.<br>";
        }
        if (bloodPressureDiastolic <= 60) {
            messages += "Tekanan darah diastolik Anda terlalu rendah.<br>";
        }
    
        // Blood glucose check
        if (age < 6) {
            if (bloodGlucose < 100) messages += "Kadar gula darah anda terlalu rendah.<br>";
            else if (bloodGlucose > 180) messages += "Kadar gula darah anda terlalu tinggi.<br>";
        } else if (age <= 12) {
            if (bloodGlucose < 90) messages += "Kadar gula darah anda terlalu rendah.<br>";
            else if (bloodGlucose > 180) messages += "Kadar gula darah anda terlalu tinggi.<br>";
        } else { // age > 12
            if (bloodGlucose < 90) messages += "Kadar gula darah anda terlalu rendah.<br>";
            else if (bloodGlucose > 130) messages += "Kadar gula darah anda terlalu tinggi.<br>";
        }
    
        return messages;
    }
    

    predictionForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Validasi input
        if (!predictionForm.checkValidity()) {
            predictionForm.reportValidity();
            return;
        }

        // Menampilkan loading spinner
        loadingDiv.style.display = "block";
        resultDiv.innerHTML = "";

        // Mengambil nilai input dari formulir
        const age = parseFloat(document.getElementById("age").value);
        const hemoglobin = parseFloat(document.getElementById("hemoglobin").value);
        const bloodPressure = parseFloat(document.getElementById("bloodPressure").value);
        const bloodGlucose = parseFloat(document.getElementById("bloodGlucose").value);
        const hypertension = parseFloat(document.getElementById("hypertension").value);
        const pedalEdema = parseFloat(document.getElementById("pedalEdema").value);

        // Simulasi Prediksi CKD menggunakan logika IF
        const simulationResult = simulateCKDPrediction(age, hemoglobin);

        // Evaluasi parameter kesehatan tambahan
        const healthMessages = evaluateHealthParameters(age, hemoglobin, bloodPressure, bloodGlucose);

        // Menyembunyikan loading spinner
        loadingDiv.style.display = "none";

        // Menyusun pesan hasil prediksi CKD
        let ckdMessage = "";
        if (simulationResult === "CKD") {
            ckdMessage = "<p><strong>Hasil:</strong> Anda berisiko terkena Penyakit Ginjal Kronis (CKD). Disarankan untuk konsultasi dengan dokter. Silahkan lakukan diagnosis lebih lanjut di Rumah Sakit Terdekat.</p>";
        } else if (simulationResult === "Not CKD") {
            ckdMessage = "<p><strong>Hasil:</strong> Anda tidak berisiko terkena Penyakit Ginjal Kronis (CKD) berdasarkan data yang diberikan.</p>";
        } else { // "Data Usia Tidak Valid"
            ckdMessage = `<p><strong>Hasil:</strong> ${simulationResult}</p>`;
        }

        // Menyusun pesan parameter kesehatan tambahan
        let healthMessage = "";
        if (healthMessages) {
            healthMessage = `<p><strong>Pemeriksaan Kesehatan:</strong><br>${healthMessages}</p>`;
        } else {
            healthMessage = "<p><strong>Pemeriksaan Kesehatan:</strong> Semua kadar anda dalam batas normal.</p>";
        }

        // Menampilkan hasil prediksi dan pemeriksaan kesehatan
        resultDiv.innerHTML = ckdMessage + healthMessage;
    });


    /* -----------------------------------
       2. Fitur Peta Rumah Sakit Terdekat (Nearby Hospitals Map Feature)
    ----------------------------------- */
    const locateBtn = document.getElementById('locate-btn');
    const mapElement = document.getElementById('map');

    // Inisialisasi peta Leaflet
    const map = L.map(mapElement).setView([0, 0], 13);

    // Menambahkan tiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Memperbaiki path ikon default Leaflet
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
    });

    // Menambahkan marker dan popup untuk lokasi pengguna
    let userMarker;
    function displayUserLocation(lat, lon) {
        if (userMarker) {
            userMarker.setLatLng([lat, lon]);
        } else {
            userMarker = L.marker([lat, lon]).addTo(map)
                .bindPopup("Anda berada di sini.")
                .openPopup();
        }
        map.setView([lat, lon], 13);
    }

    // Mengambil dan menampilkan rumah sakit terdekat
    function findNearbyHospitals(lat, lon) {
        const radius = 10000; // Radius 10 km
        const query = `[out:json];
            node["amenity"="hospital"](around:${radius},${lat},${lon});
            out;`;

        fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.elements.length > 0) {
                    data.elements.forEach(hospital => {
                        const { lat, lon, tags } = hospital;
                        L.marker([lat, lon]).addTo(map)
                            .bindPopup(tags.name || "Rumah Sakit Tanpa Nama");
                    });
                } else {
                    alert("Tidak ditemukan rumah sakit terdekat.");
                }
            })
            .catch(error => {
                console.error("Error fetching hospital data:", error);
                alert("Terjadi kesalahan saat mengambil data rumah sakit.");
            });
    }

    // Geolokasi dan memicu pencarian rumah sakit
    locateBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    displayUserLocation(lat, lon);
                    findNearbyHospitals(lat, lon);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Tidak dapat mengambil lokasi Anda. Pastikan Anda telah memberikan izin akses lokasi.");
                }
            );
        } else {
            alert("Geolokasi tidak didukung oleh browser ini.");
        }
    });


    /* -----------------------------------
       3. Responsive Navbar
    ----------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    navMenu.querySelectorAll('a').forEach(n => n.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('toggle');
    }));


    /* -----------------------------------
       4. Back to Top Button
    ----------------------------------- */
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* -----------------------------------
       5. Dark Mode Toggle
    ----------------------------------- */
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        // Simpan preferensi pengguna di localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Periksa preferensi pengguna saat halaman dimuat
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }


    /* -----------------------------------
       6. Newsletter Subscription Form
    ----------------------------------- */
    const newsletterForm = document.getElementById('newsletterForm');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('newsletterEmail').value.trim();

        // Validasi email sederhana
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
            alert('Silakan masukkan email yang valid.');
            return;
        }

        // Lakukan tindakan untuk menyimpan email (Anda perlu membuat API untuk ini)
        // Misalnya, Anda bisa menggunakan fetch untuk mengirim data ke server
        // fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
        //     .then(response => response.json())
        //     .then(data => { /* Handle success */ })
        //     .catch(error => { /* Handle error */ });

        alert(`Terima kasih telah berlangganan, ${email}!`);
        newsletterForm.reset();
    });


    /* -----------------------------------
       7. Contact Form
    ----------------------------------- */
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validasi input
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Lakukan tindakan untuk mengirim pesan (Anda perlu membuat API untuk ini)
        // Misalnya, Anda bisa menggunakan fetch untuk mengirim data ke server
        // fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, message }) })
        //     .then(response => response.json())
        //     .then(data => { /* Handle success */ })
        //     .catch(error => { /* Handle error */ });

        alert(`Terima kasih, ${name}! Pesan Anda telah terkirim.`);
        contactForm.reset();
    });


    /* -----------------------------------
       8. Animate On Scroll Initialization
    ----------------------------------- */
    AOS.init({
        duration: 1000,
        once: true,
    });


    /* -----------------------------------
       9. Multilingual Support (Mock)
    ----------------------------------- */
    const langIdBtn = document.getElementById('lang-id');
    const langEnBtn = document.getElementById('lang-en');

    langIdBtn.addEventListener('click', () => {
        // Fungsi untuk mengganti teks ke Bahasa Indonesia
        langIdBtn.classList.add('active');
        langEnBtn.classList.remove('active');
        // Implementasi pergantian bahasa di sini
        alert('Bahasa Indonesia dipilih (Fitur belum diimplementasikan).');
    });

    langEnBtn.addEventListener('click', () => {
        // Fungsi untuk mengganti teks ke Bahasa Inggris
        langEnBtn.classList.add('active');
        langIdBtn.classList.remove('active');
        // Implementasi pergantian bahasa di sini
        alert('English language selected (Feature not implemented yet).');
    });
});
