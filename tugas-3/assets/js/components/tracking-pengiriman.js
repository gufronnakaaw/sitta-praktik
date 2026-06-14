const TrackingPengirimanComponent = {
  template: `
    <section class="main-content tracking-page">
      <header class="page-header">
        <div>
          <h1>Tracking Pengiriman</h1>
          <p class="page-subtitle">Cari status pengiriman bahan ajar berdasarkan nomor delivery order.</p>
        </div>
      </header>

      <section class="form-card">
        <div class="form-header">
          <div>
            <h3>Tambah Delivery Order</h3>
            <p>Masukkan data pengiriman baru, nomor DO tergenerate otomatis.</p>
          </div>
          <span class="form-note">Format: {{ nextDoNumber }}</span>
        </div>
        <form class="form-grid" @submit.prevent="addTracking">
          <div class="field">
            <label for="nomorDoBaru">Nomor DO</label>
            <input id="nomorDoBaru" :value="nextDoNumber" readonly />
          </div>
          <div class="field">
            <label for="nim">NIM</label>
            <input id="nim" v-model.trim="newTracking.nim" placeholder="Contoh: 123456789" />
            <small class="error" v-if="formErrors.nim">{{ formErrors.nim }}</small>
          </div>
          <div class="field">
            <label for="nama">Nama Mahasiswa</label>
            <input id="nama" v-model.trim="newTracking.nama" placeholder="Nama lengkap" />
            <small class="error" v-if="formErrors.nama">{{ formErrors.nama }}</small>
          </div>
          <div class="field">
            <label for="ekspedisi">Ekspedisi</label>
            <select id="ekspedisi" v-model="newTracking.ekspedisi">
              <option value="">Pilih Ekspedisi</option>
              <option v-for="item in pengirimanList" :key="item.kode" :value="item.nama">{{ item.nama }}</option>
            </select>
            <small class="error" v-if="formErrors.ekspedisi">{{ formErrors.ekspedisi }}</small>
          </div>
          <div class="field">
            <label for="paket">Paket Bahan Ajar</label>
            <select id="paket" v-model="newTracking.paket">
              <option value="">Pilih Paket</option>
              <option v-for="item in paket" :key="item.kode" :value="item.kode">{{ item.kode }} - {{ item.nama }}</option>
            </select>
            <small class="error" v-if="formErrors.paket">{{ formErrors.paket }}</small>
            <div class="paket-detail" v-if="selectedPaket">
              <span>Isi Paket:</span>
              <ul>
                <li v-for="kode in selectedPaket.isi" :key="kode">{{ kode }}</li>
              </ul>
            </div>
          </div>
          <div class="field">
            <label for="tanggal">Tanggal Kirim</label>
            <input id="tanggal" type="date" v-model="newTracking.tanggalKirim" />
            <small class="error" v-if="formErrors.tanggalKirim">{{ formErrors.tanggalKirim }}</small>
          </div>
          <div class="field">
            <label for="total">Total Harga</label>
            <input id="total" :value="formatCurrency(selectedPaket ? selectedPaket.harga : 0)" readonly />
          </div>
          <div class="field full-width">
            <button class="btn primary" type="submit">Simpan DO</button>
            <span class="helper" v-if="formErrors.general">{{ formErrors.general }}</span>
          </div>
        </form>
      </section>

      <form class="search-card" @submit.prevent="searchTracking">
        <label for="nomorDO">Nomor Delivery Order</label>
        <div class="search-row">
          <input type="text" id="nomorDO" v-model.trim="searchQuery" placeholder="Masukkan nomor DO" required>
          <button type="submit" class="btn primary">Cari</button>
        </div>
        <p class="helper">Contoh: DO{{ currentYear }}-0001</p>
        <p class="error">{{ searchError }}</p>
      </form>

      <section class="result-section" v-if="activeTracking">
        <div class="result-header">
          <div>
            <div class="result-title">Nama Mahasiswa</div>
            <div class="result-name">{{ activeTracking.nama }}</div>
          </div>
          <span class="status-pill" :data-status="activeTracking.status.toLowerCase()">{{ activeTracking.status }}</span>
        </div>

        <div class="progress-wrap">
          <div class="progress-label">
            <span>Status Pengiriman</span>
            <span>{{ progressPercent }}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span>Ekspedisi</span>
            <strong>{{ activeTracking.ekspedisi }}</strong>
          </div>
          <div class="detail-item">
            <span>Tanggal Kirim</span>
            <strong>{{ activeTracking.tanggalKirim }}</strong>
          </div>
          <div class="detail-item">
            <span>Jenis Paket</span>
            <strong>{{ activeTracking.paket }}</strong>
          </div>
          <div class="detail-item">
            <span>Total Pembayaran</span>
            <strong>{{ formatCurrency(activeTracking.total) }}</strong>
          </div>
        </div>

        <div class="timeline">
          <h3>Riwayat Pengiriman</h3>
          <ul>
            <li v-for="(item, index) in activeTracking.perjalanan" :key="index">
              <span>{{ item.waktu }}</span>
              <p>{{ item.keterangan }}</p>
            </li>
          </ul>
        </div>
      </section>
    </section>
  `,

  data() {
    const today = new Date().toISOString().slice(0, 10);

    const trackingRecords = Object.entries({
      "DO2026-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "Reguler (3-5 hari)",
        tanggalKirim: "2026-06-14",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          {
            waktu: "2026-06-14 10:12:20",
            keterangan: "Penerimaan di Loket: TANGSEL",
          },
        ],
      },
    }).map(([nomor, item]) => ({
      nomor,
      ...item,
    }));

    return {
      pengirimanList: [
        { kode: "REG", nama: "Reguler (3-5 hari)" },
        { kode: "EXP", nama: "Ekspres (1-2 hari)" },
      ],
      paket: [
        {
          kode: "PAKET-UT-001",
          nama: "PAKET IPS Dasar",
          isi: ["EKMA4116", "EKMA4115"],
          harga: 120000,
        },
        {
          kode: "PAKET-UT-002",
          nama: "PAKET IPA Dasar",
          isi: ["BIOL4201", "FISIP4001"],
          harga: 140000,
        },
      ],
      trackingRecords,
      searchQuery: "",
      searchError: "",
      activeTracking: null,
      formErrors: {},
      currentYear: new Date().getFullYear(),
      newTracking: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paket: "",
        tanggalKirim: today,
      },
    };
  },
  computed: {
    selectedPaket() {
      return (
        this.paket.find((item) => item.kode === this.newTracking.paket) || null
      );
    },
    nextSequence() {
      const pattern = new RegExp(`^DO${this.currentYear}-(\\d{4})$`);
      const sequences = this.trackingRecords
        .map((item) => {
          const match = item.nomor.match(pattern);
          return match ? Number(match[1]) : 0;
        })
        .filter((value) => Number.isFinite(value));

      const max = sequences.length ? Math.max(...sequences) : 0;
      return max + 1;
    },
    nextDoNumber() {
      return `DO${this.currentYear}-${String(this.nextSequence).padStart(4, "0")}`;
    },
    progressPercent() {
      if (!this.activeTracking) return 0;
      const steps = this.activeTracking.perjalanan?.length || 0;
      return Math.min(100, Math.round((steps / 4) * 100));
    },
  },
  methods: {
    formatDateTime(value) {
      const pad = (num) => String(num).padStart(2, "0");
      return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
    },
    formatCurrency(value) {
      const amount = Number(value) || 0;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    },
    addTracking() {
      this.formErrors = {};

      if (!this.newTracking.nim) this.formErrors.nim = "NIM wajib diisi.";
      if (!this.newTracking.nama) this.formErrors.nama = "Nama wajib diisi.";
      if (!this.newTracking.ekspedisi)
        this.formErrors.ekspedisi = "Ekspedisi wajib dipilih.";
      if (!this.newTracking.paket)
        this.formErrors.paket = "Paket wajib dipilih.";
      if (!this.newTracking.tanggalKirim)
        this.formErrors.tanggalKirim = "Tanggal kirim wajib diisi.";

      if (Object.keys(this.formErrors).length) {
        this.formErrors.general = "Periksa data yang belum lengkap.";
        return;
      }

      const record = {
        nomor: this.nextDoNumber,
        nim: this.newTracking.nim,
        nama: this.newTracking.nama,
        status: "Dalam Perjalanan",
        ekspedisi: this.newTracking.ekspedisi,
        tanggalKirim: this.newTracking.tanggalKirim,
        paket: this.newTracking.paket,
        total: this.selectedPaket ? this.selectedPaket.harga : 0,
        perjalanan: [
          {
            waktu: this.formatDateTime(new Date()),
            keterangan: "Delivery order dibuat dan menunggu penjemputan",
          },
        ],
      };

      this.trackingRecords.push(record);
      this.searchQuery = record.nomor;
      this.activeTracking = record;
      this.searchError = "";

      this.newTracking = {
        nim: "",
        nama: "",
        ekspedisi: "",
        paket: "",
        tanggalKirim: new Date().toISOString().slice(0, 10),
      };
    },
    searchTracking() {
      const query = this.searchQuery.trim().toUpperCase();
      if (!query) {
        this.searchError = "Masukkan nomor delivery order terlebih dahulu.";
        this.activeTracking = null;
        return;
      }

      const found = this.trackingRecords.find(
        (item) => item.nomor.toUpperCase() === query,
      );
      if (!found) {
        this.searchError = "Nomor delivery order tidak ditemukan.";
        this.activeTracking = null;
        return;
      }

      this.searchError = "";
      this.activeTracking = found;
    },
  },
};
