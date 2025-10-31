document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DATA SIMULASI (Ganti dengan API call jika sudah ada backend) =====
    const services = [
        { id: 1, name: 'WhatsApp', icon: 'bxl-whatsapp', stock: 120, price: 950 },
        { id: 2, name: 'Telegram', icon: 'bxl-telegram', stock: 250, price: 1200 },
        { id: 3, name: 'Gojek', icon: 'bx-car', stock: 88, price: 1500 },
        { id: 4, name: 'Google', icon: 'bxl-google', stock: 430, price: 800 },
        { id: 5, name: 'Grab', icon: 'bx-car', stock: 50, price: 1500 },
        { id: 6, name: 'Facebook', icon: 'bxl-facebook-circle', stock: 310, price: 750 },
        { id: 7, name: 'TikTok', icon: 'bxl-tiktok', stock: 150, price: 1100 },
        { id: 8, name: 'Shopee', icon: 'bx-shopping-bag', stock: 95, price: 1300 },
    ];
    
    const history = [
        { service: 'WhatsApp', number: '+62 812***1111', status: 'Selesai' },
        { service: 'Google', number: '+62 812***2222', status: 'Dibatalkan' },
        { service: 'Gojek', number: '+62 812***3333', status: 'Selesai' },
    ];


    // ===== VARIABEL & ELEMENT DOM =====
    const serviceListContainer = document.getElementById('service-list');
    const searchInput = document.getElementById('search-service');
    const orderFormSection = document.getElementById('order-form-section');
    const activeOrderSection = document.getElementById('active-order-section');
    const historyTableBody = document.getElementById('history-table-body');
    
    let countdownInterval;

    // ===== FUNGSI-FUNGSI =====

    /**
     * Menampilkan daftar layanan ke halaman.
     * @param {Array} servicesToRender - Array berisi objek layanan.
     */
    function renderServices(servicesToRender) {
        serviceListContainer.innerHTML = ''; // Kosongkan dulu
        if (servicesToRender.length === 0) {
            serviceListContainer.innerHTML = `<p class="text-muted">Layanan tidak ditemukan.</p>`;
            return;
        }

        servicesToRender.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-info">
                    <i class='bx ${service.icon} service-icon'></i>
                    <div class="service-details">
                        <span class="name">${service.name}</span>
                        <span class="stock">Stok: ${service.stock}</span>
                    </div>
                </div>
                <div class="service-price">
                    <span class="price">Rp ${service.price.toLocaleString('id-ID')}</span>
                    <button class="buy-btn" data-id="${service.id}">Beli</button>
                </div>
            `;
            serviceListContainer.appendChild(card);
        });
        
        // Tambahkan event listener ke tombol "Beli" yang baru dibuat
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', handleBuyClick);
        });
    }

    /**
     * Menampilkan riwayat pesanan
     */
    function renderHistory() {
        historyTableBody.innerHTML = '';
        history.forEach(item => {
            const statusClass = item.status === 'Selesai' ? 'status-success' : 'status-canceled';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.service}</td>
                <td>${item.number}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>Baru saja</td>
            `;
            historyTableBody.appendChild(row);
        });
    }

    /**
     * Menangani klik pada tombol "Beli"
     * @param {Event} event
     */
    function handleBuyClick(event) {
        const serviceId = parseInt(event.target.dataset.id);
        const service = services.find(s => s.id === serviceId);

        if (service) {
            // Sembunyikan form pembelian, tampilkan order aktif
            orderFormSection.classList.add('d-none');
            activeOrderSection.classList.remove('d-none');
            
            // Isi detail order
            document.getElementById('active-order-title').textContent = `Menunggu SMS untuk ${service.name}...`;
            document.getElementById('virtual-number').textContent = `+62 8${Math.floor(100000000 + Math.random() * 900000000)}`;
            document.getElementById('otp-code').textContent = "Menunggu SMS...";
            document.getElementById('otp-code').classList.add('text-muted');

            // Mulai timer
            startCountdown(5 * 60); // 5 menit

            // Simulasi OTP masuk setelah beberapa detik
            setTimeout(() => {
                receiveOTP('123456');
            }, 8000); // Terima OTP setelah 8 detik
        }
    }

    /**
     * Memulai timer hitung mundur.
     * @param {number} duration - Durasi dalam detik.
     */
    function startCountdown(duration) {
        clearInterval(countdownInterval);
        let timer = duration;
        const timerDisplay = document.getElementById('countdown-timer');

        countdownInterval = setInterval(() => {
            const minutes = Math.floor(timer / 60);
            let seconds = timer % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            
            timerDisplay.textContent = `${minutes}:${seconds}`;

            if (--timer < 0) {
                clearInterval(countdownInterval);
                timerDisplay.textContent = "Expired";
                // Handle order expired
            }
        }, 1000);
    }
    
    /**
     * Menangani saat OTP diterima
     * @param {string} code - Kode OTP yang diterima
     */
    function receiveOTP(code) {
        const otpDisplay = document.getElementById('otp-code');
        const copyOtpBtn = document.getElementById('copy-otp-btn');
        
        otpDisplay.textContent = code;
        otpDisplay.classList.remove('text-muted');
        copyOtpBtn.classList.remove('d-none');
        alert(`Kode OTP Diterima: ${code}`);
    }
    
    /**
     * Menangani pembatalan order
     */
    function cancelOrder() {
        clearInterval(countdownInterval);
        activeOrderSection.classList.add('d-none');
        orderFormSection.classList.remove('d-none');
        alert('Pesanan telah dibatalkan.');
    }
    
    /**
     * Menangani penyalinan teks
     * @param {string} text - Teks yang akan disalin
     * @param {string} type - Jenis teks (Nomor/Kode)
     */
    function copyToClipboard(text, type) {
        navigator.clipboard.writeText(text).then(() => {
            alert(`${type} berhasil disalin: ${text}`);
        }).catch(err => {
            console.error('Gagal menyalin teks: ', err);
        });
    }

    // ===== EVENT LISTENERS =====
    
    // Filter layanan saat pengguna mengetik di search bar
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredServices = services.filter(service => 
            service.name.toLowerCase().includes(searchTerm)
        );
        renderServices(filteredServices);
    });
    
    // Tombol batalkan pesanan
    document.getElementById('cancel-order-btn').addEventListener('click', cancelOrder);
    
    // Tombol salin nomor
    document.getElementById('copy-number-btn').addEventListener('click', () => {
        const number = document.getElementById('virtual-number').textContent;
        copyToClipboard(number, 'Nomor');
    });

    // Tombol salin OTP
    document.getElementById('copy-otp-btn').addEventListener('click', () => {
        const code = document.getElementById('otp-code').textContent;
        copyToClipboard(code, 'Kode OTP');
    });

    // ===== INISIALISASI HALAMAN =====
    setTimeout(() => {
        renderServices(services);
        renderHistory();
    }, 1000); // Simulasi loading data
});
