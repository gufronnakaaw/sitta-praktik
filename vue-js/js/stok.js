const { createApp } = Vue;

createApp({
  data() {
    return {
      upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
      kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
      stok: [
        {
          kode: "EKMA4116",
          judul: "Pengantar Manajemen",
          kategori: "MK Wajib",
          upbjj: "Jakarta",
          lokasiRak: "R1-A3",
          harga: 65000,
          qty: 28,
          safety: 20,
          catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
        },
        {
          kode: "EKMA4115",
          judul: "Pengantar Akuntansi",
          kategori: "MK Wajib",
          upbjj: "Jakarta",
          lokasiRak: "R1-A4",
          harga: 60000,
          qty: 7,
          safety: 15,
          catatanHTML: "<strong>Cover baru</strong>",
        },
        {
          kode: "BIOL4201",
          judul: "Biologi Umum (Praktikum)",
          kategori: "Praktikum",
          upbjj: "Surabaya",
          lokasiRak: "R3-B2",
          harga: 80000,
          qty: 12,
          safety: 10,
          catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
        },
        {
          kode: "FISIP4001",
          judul: "Dasar-Dasar Sosiologi",
          kategori: "MK Pilihan",
          upbjj: "Makassar",
          lokasiRak: "R2-C1",
          harga: 55000,
          qty: 2,
          safety: 8,
          catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
        },
        {
          kode: "MKDU4109",
          judul: "Pendidikan Kewarganegaraan",
          kategori: "MK Wajib",
          upbjj: "Padang",
          lokasiRak: "R2-A2",
          harga: 52000,
          qty: 0,
          safety: 12,
          catatanHTML: "Perlu reorder segera",
        },
      ],
      filters: {
        upbjj: "",
        kategori: "",
        lowStock: false,
        outOfStock: false,
        sort: "judul",
      },
      editingKode: "",
      editDraft: {
        lokasiRak: "",
        qty: 0,
        safety: 0,
        catatanHTML: "",
      },
      newItem: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      },
      formErrors: {},
    };
  },
  computed: {
    filteredStok() {
      let items = this.stok.slice();

      if (this.filters.upbjj) {
        items = items.filter((item) => item.upbjj === this.filters.upbjj);
      }

      if (this.filters.kategori) {
        items = items.filter((item) => item.kategori === this.filters.kategori);
      }

      if (this.filters.lowStock || this.filters.outOfStock) {
        items = items.filter((item) => {
          const isLow = item.qty < item.safety && item.qty > 0;
          const isEmpty = item.qty === 0;
          if (this.filters.lowStock && this.filters.outOfStock) {
            return isLow || isEmpty;
          }
          if (this.filters.lowStock) {
            return isLow;
          }
          return isEmpty;
        });
      }

      const sortKey = this.filters.sort;
      items.sort((a, b) => {
        if (sortKey === "judul") {
          return a.judul.localeCompare(b.judul);
        }
        return a[sortKey] - b[sortKey];
      });

      return items;
    },
  },
  watch: {
    "filters.upbjj"(value) {
      if (!value) {
        this.filters.kategori = "";
      }
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
    statusLabel(item) {
      if (item.qty === 0) {
        return "Kosong";
      }
      if (item.qty < item.safety) {
        return "Menipis";
      }
      return "Aman";
    },
    statusClass(item) {
      if (item.qty === 0) {
        return "status-empty";
      }
      if (item.qty < item.safety) {
        return "status-low";
      }
      return "status-safe";
    },
    startEdit(item) {
      this.editingKode = item.kode;
      this.editDraft = {
        lokasiRak: item.lokasiRak,
        qty: item.qty,
        safety: item.safety,
        catatanHTML: item.catatanHTML,
      };
    },
    cancelEdit() {
      this.editingKode = "";
      this.editDraft = {
        lokasiRak: "",
        qty: 0,
        safety: 0,
        catatanHTML: "",
      };
    },
    saveEdit(item) {
      if (this.editingKode !== item.kode) {
        return;
      }

      item.lokasiRak = this.editDraft.lokasiRak.trim();
      item.qty = Math.max(0, Number(this.editDraft.qty) || 0);
      item.safety = Math.max(0, Number(this.editDraft.safety) || 0);
      item.catatanHTML = this.editDraft.catatanHTML.trim();

      this.cancelEdit();
    },
    resetFilters() {
      this.filters = {
        upbjj: "",
        kategori: "",
        lowStock: false,
        outOfStock: false,
        sort: "judul",
      };
    },
    addItem() {
      this.formErrors = {};

      if (!this.newItem.kode) {
        this.formErrors.kode = "Kode mata kuliah wajib diisi.";
      }
      if (!this.newItem.judul) {
        this.formErrors.judul = "Nama mata kuliah wajib diisi.";
      }
      if (!this.newItem.kategori) {
        this.formErrors.kategori = "Kategori wajib dipilih.";
      }
      if (!this.newItem.upbjj) {
        this.formErrors.upbjj = "UT-daerah wajib dipilih.";
      }
      if (!this.newItem.lokasiRak) {
        this.formErrors.lokasiRak = "Lokasi rak wajib diisi.";
      }
      if (!Number.isFinite(this.newItem.harga) || this.newItem.harga < 0) {
        this.formErrors.harga = "Harga harus bernilai 0 atau lebih.";
      }
      if (!Number.isFinite(this.newItem.qty) || this.newItem.qty < 0) {
        this.formErrors.qty = "Jumlah stok harus bernilai 0 atau lebih.";
      }
      if (!Number.isFinite(this.newItem.safety) || this.newItem.safety < 0) {
        this.formErrors.safety = "Safety stok harus bernilai 0 atau lebih.";
      }

      const hasDuplicate = this.stok.some(
        (item) => item.kode === this.newItem.kode,
      );
      if (hasDuplicate) {
        this.formErrors.kode = "Kode sudah digunakan.";
      }

      if (Object.keys(this.formErrors).length > 0) {
        this.formErrors.general = "Periksa kembali data yang belum valid.";
        return;
      }

      this.stok.push({
        kode: this.newItem.kode,
        judul: this.newItem.judul,
        kategori: this.newItem.kategori,
        upbjj: this.newItem.upbjj,
        lokasiRak: this.newItem.lokasiRak,
        harga: Number(this.newItem.harga) || 0,
        qty: Number(this.newItem.qty) || 0,
        safety: Number(this.newItem.safety) || 0,
        catatanHTML: this.newItem.catatanHTML || "-",
      });

      this.newItem = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      };
    },
  },
}).mount("#app");
