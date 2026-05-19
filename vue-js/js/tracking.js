const { createApp } = Vue;

const formatDateTime = (value) => {
  const pad = (num) => String(num).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
};

createApp({
  data() {
    const today = new Date().toISOString().slice(0, 10);
    const trackingRecords = Object.entries(dataVue.tracking || {}).map(
      ([nomor, item]) => ({
        nomor,
        ...item,
      }),
    );

    return {
      pengirimanList: dataVue.pengirimanList || [],
      paket: dataVue.paket || [],
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
      const pattern = new RegExp(`^DO${this.currentYear}-(\\d{3})$`);
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
      return `DO${this.currentYear}-${String(this.nextSequence).padStart(3, "0")}`;
    },
    progressPercent() {
      if (!this.activeTracking) {
        return 0;
      }
      const steps = this.activeTracking.perjalanan?.length || 0;
      return Math.min(100, Math.round((steps / 4) * 100));
    },
  },
  methods: {
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

      if (!this.newTracking.nim) {
        this.formErrors.nim = "NIM wajib diisi.";
      }
      if (!this.newTracking.nama) {
        this.formErrors.nama = "Nama wajib diisi.";
      }
      if (!this.newTracking.ekspedisi) {
        this.formErrors.ekspedisi = "Ekspedisi wajib dipilih.";
      }
      if (!this.newTracking.paket) {
        this.formErrors.paket = "Paket wajib dipilih.";
      }
      if (!this.newTracking.tanggalKirim) {
        this.formErrors.tanggalKirim = "Tanggal kirim wajib diisi.";
      }

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
            waktu: formatDateTime(new Date()),
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
}).mount("#app");
