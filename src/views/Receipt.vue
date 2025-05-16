<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow-sm" style="max-width: 400px; width: 100%;">
      <div class="card-body text-center">
        <div class="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style="width: 50px; height: 50px;">
          <i class="bi bi-check-lg fs-4"></i>
        </div>
        <h5 class="card-title fw-bold">Terima Kasih</h5>
        <p class="text-muted small">Pesanan anda akan kami proses</p>
      </div>

      <div class="border-top border-bottom px-4 py-3">
        <div class="d-flex justify-content-between small mb-3">
          <div>
            <strong>Order ID</strong><br />
            #SP28102023
          </div>
          <div class="text-end">
            <strong>Estimated Time</strong><br />
            15–30 mins
          </div>
        </div>

        <p class="fw-semibold mb-2">Ringkasan pesanan</p>

        <div class="d-flex justify-content-between mb-2 small">
          <div>Nasi Goreng Special<br /><span class="text-muted">Qty: 1</span></div>
          <div>Rp 45.000</div>
        </div>

        <div class="d-flex justify-content-between mb-2 small">
          <div>Sate Ayam<br /><span class="text-muted">Qty: 2</span></div>
          <div>Rp 70.000</div>
        </div>

        <div class="d-flex justify-content-between mb-2 small">
          <div>Es Teh Manis<br /><span class="text-muted">Qty: 1</span></div>
          <div>Rp 8.000</div>
        </div>

        <div class="d-flex justify-content-between mt-3">
          <div class="fw-bold">Total</div>
          <div class="fw-bold">Rp 125.000</div>
        </div>

        <div class="d-flex justify-content-between small text-muted mt-1">
          <div>Tipe Pembayaran</div>
          <div>Cash on Delivery</div>
        </div>
      </div>

      <div class="card-body">
        <button class="btn btn-success w-100 mb-2">Lacak pesanan</button>
        <button class="btn btn-outline-secondary w-100">Kembali ke Menu</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderConfirmation"
}
</script>