// =================================================================
// GANTI DENGAN KONFIGURASI FIREBASE LO!
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAObivzsuB3SiixRMhUtz_0bktasM3yyw0",
  authDomain: "jasaotp-8e1f4.firebaseapp.com",
  databaseURL: "https://jasaotp-8e1f4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jasaotp-8e1f4",
  storageBucket: "jasaotp-8e1f4.firebasestorage.app",
  messagingSenderId: "572441136683",
  appId: "1:572441136683:web:f40ea33eb39767cae6646e"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const pendingOrdersList = document.getElementById('pending-orders-list');

// Mendengarkan perubahan pada node 'orders'
const ordersRef = db.ref('orders');
ordersRef.on('value', (snapshot) => {
    pendingOrdersList.innerHTML = '';
    const orders = snapshot.val();

    let hasPendingOrders = false;
    if (orders) {
        Object.keys(orders).forEach(orderId => {
            const order = orders[orderId];
            
            // Tampilkan hanya order yang butuh tindakan (belum selesai)
            if (order.status !== 'completed' && order.status !== 'canceled') {
                hasPendingOrders = true;
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';

                let actionsHtml = '';
                if (order.status === 'waiting_sms') {
                    actionsHtml = `
                        <div class="order-actions">
                            <input type="text" id="otp-input-${orderId}" placeholder="Masukkan kode OTP">
                            <button onclick="provideOtp('${orderId}')">Kirim OTP</button>
                        </div>
                    `;
                }

                orderItem.innerHTML = `
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Layanan:</strong> ${order.serviceName}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Nomor Virtual:</strong> ${order.virtualNumber || 'Belum di-assign'}</p>
                    ${actionsHtml}
                `;
                pendingOrdersList.appendChild(orderItem);
            }
        });
    }

    if (!hasPendingOrders) {
        pendingOrdersList.innerHTML = '<p class="placeholder">Tidak ada pesanan aktif saat ini.</p>';
    }
});

// Fungsi untuk mengirim OTP dari admin
window.provideOtp = function(orderId) {
    const otpInput = document.getElementById(`otp-input-${orderId}`);
    const otpCode = otpInput.value.trim();
    if (otpCode) {
        db.ref('orders/' + orderId).update({
            otpCode: otpCode,
            status: 'completed'
        });
    } else {
        alert('Kode OTP tidak boleh kosong!');
    }
}
