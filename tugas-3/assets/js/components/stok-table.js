const StokComponent = {
  template: `
		<section class="main-content stok-page">

			<header class="page-header">
				<div>
					<h1>Stok Bahan Ajar</h1>
					<p class="page-subtitle">
						Pantau ketersediaan bahan ajar dan tambahkan stok baru.
					</p>
				</div>

				<div class="total-card">
					<span>Total Item</span>
					<strong>{{ filteredStok.length }}</strong>
				</div>
			</header>

			<section class="filter-card">
      <div class="filter-header">
        <div>
          <h3>Filter & Sort</h3>
          <p>Gunakan filter untuk menampilkan data prioritas reorder.</p>
        </div>
        <button class="btn ghost" type="button" @click="resetFilters">Reset Filter</button>
      </div>
      <div class="filter-grid">
        <div class="field">
          <label for="filterUpbjj">UT-Daerah</label>
          <select id="filterUpbjj" v-model="filters.upbjj">
            <option value="">Semua UT-Daerah</option>
            <option v-for="lokasi in upbjjList" :key="lokasi" :value="lokasi">{{ lokasi }}</option>
          </select>
        </div>
        <div class="field" v-if="filters.upbjj">
          <label for="filterKategori">Kategori Mata Kuliah</label>
          <select id="filterKategori" v-model="filters.kategori">
            <option value="">Semua Kategori</option>
            <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">{{ kategori }}</option>
          </select>
        </div>
        <div class="field">
          <label for="filterSort">Urutkan</label>
          <select id="filterSort" v-model="filters.sort">
            <option value="judul">Judul</option>
            <option value="qty">Stok</option>
            <option value="harga">Harga</option>
          </select>
        </div>
        <div class="field check-stack">
          <label>Stok Prioritas</label>
          <label class="checkbox">
            <input type="checkbox" v-model="filters.lowStock">
            <span>Stok &lt; Safety</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" v-model="filters.outOfStock">
            <span>Stok = 0</span>
          </label>
        </div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h3>Daftar Stok</h3>
        <span class="table-note">Data diambil dari data dummy.</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kode / Nama Mata Kuliah</th>
              <th>Kategori</th>
              <th>UT-Daerah</th>
              <th>Lokasi Rak</th>
              <th>Stok</th>
              <th>Safety</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Catatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredStok" :key="item.kode">
              <td>
                <div class="title-cell">
                  <strong>{{ item.kode }}</strong>
                  <span>{{ item.judul }}</span>
                </div>
              </td>
              <td>{{ item.kategori }}</td>
              <td>{{ item.upbjj }}</td>
              <td>
                <template v-if="editingKode === item.kode">
                  <input class="inline-input" v-model="editDraft.lokasiRak" />
                </template>
                <template v-else>{{ item.lokasiRak }}</template>
              </td>
              <td>
                <template v-if="editingKode === item.kode">
                  <input class="inline-input" type="number" min="0" v-model.number="editDraft.qty" />
                </template>
                <template v-else>
                  <span class="pill">{{ item.qty }}</span>
                </template>
              </td>
              <td>
                <template v-if="editingKode === item.kode">
                  <input class="inline-input" type="number" min="0" v-model.number="editDraft.safety" />
                </template>
                <template v-else>
                  <span class="pill muted">{{ item.safety }}</span>
                </template>
              </td>
              <td>{{ formatCurrency(item.harga) }}</td>
              <td>
                <span class="status-badge" :class="statusClass(item)">
                  <span class="status-dot"></span>{{ statusLabel(item) }}
                </span>
              </td>
              <td>
                <template v-if="editingKode === item.kode">
                  <input class="inline-input" v-model="editDraft.catatanHTML" />
                </template>
                <template v-else>
                  <div class="note" v-html="item.catatanHTML"></div>
                </template>
              </td>
              <td>
                <div class="action-row" v-if="editingKode === item.kode">
                  <button class="btn" type="button" @click="saveEdit(item)">Simpan</button>
                  <button class="btn ghost" type="button" @click="cancelEdit">Batal</button>
                </div>
                <button v-else class="btn ghost" type="button" @click="startEdit(item)">Edit</button>
              </td>
            </tr>
            <tr v-if="filteredStok.length === 0">
              <td colspan="10" class="empty-state">Data tidak ditemukan. Coba atur ulang filter.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="form-card">
      <div class="form-header">
        <div>
          <h3>Tambah Stok Baru</h3>
          <p>Lengkapi data bahan ajar baru dan lakukan validasi sederhana.</p>
        </div>
        <span class="form-note">Wajib diisi: kode, judul, kategori, UT-daerah, stok.</span>
      </div>
      <form @submit.prevent="addItem" class="form-grid">
        <div class="field">
          <label for="kode">Kode Mata Kuliah</label>
          <input id="kode" v-model.trim="newItem.kode" placeholder="Contoh: EKMA4116" />
          <small class="error" v-if="formErrors.kode">{{ formErrors.kode }}</small>
        </div>
        <div class="field">
          <label for="judul">Nama Mata Kuliah</label>
          <input id="judul" v-model.trim="newItem.judul" placeholder="Judul mata kuliah" />
          <small class="error" v-if="formErrors.judul">{{ formErrors.judul }}</small>
        </div>
        <div class="field">
          <label for="kategori">Kategori Mata Kuliah</label>
          <select id="kategori" v-model="newItem.kategori">
            <option value="">Pilih Kategori</option>
            <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">{{ kategori }}</option>
          </select>
          <small class="error" v-if="formErrors.kategori">{{ formErrors.kategori }}</small>
        </div>
        <div class="field">
          <label for="upbjj">UT-Daerah</label>
          <select id="upbjj" v-model="newItem.upbjj">
            <option value="">Pilih UT-Daerah</option>
            <option v-for="lokasi in upbjjList" :key="lokasi" :value="lokasi">{{ lokasi }}</option>
          </select>
          <small class="error" v-if="formErrors.upbjj">{{ formErrors.upbjj }}</small>
        </div>
        <div class="field">
          <label for="lokasiRak">Lokasi Rak</label>
          <input id="lokasiRak" v-model.trim="newItem.lokasiRak" placeholder="Contoh: R1-A3" />
          <small class="error" v-if="formErrors.lokasiRak">{{ formErrors.lokasiRak }}</small>
        </div>
        <div class="field">
          <label for="harga">Harga</label>
          <input id="harga" type="number" min="0" v-model.number="newItem.harga" placeholder="65000" />
          <small class="error" v-if="formErrors.harga">{{ formErrors.harga }}</small>
        </div>
        <div class="field">
          <label for="qty">Jumlah Stok</label>
          <input id="qty" type="number" min="0" v-model.number="newItem.qty" />
          <small class="error" v-if="formErrors.qty">{{ formErrors.qty }}</small>
        </div>
        <div class="field">
          <label for="safety">Jumlah Safety</label>
          <input id="safety" type="number" min="0" v-model.number="newItem.safety" />
          <small class="error" v-if="formErrors.safety">{{ formErrors.safety }}</small>
        </div>
        <div class="field">
          <label for="catatan">Catatan</label>
          <input id="catatan" v-model.trim="newItem.catatanHTML" placeholder="Catatan singkat" />
        </div>
        <div class="field full-width">
          <button class="btn primary" type="submit">Simpan Data</button>
          <span class="helper" v-if="formErrors.general">{{ formErrors.general }}</span>
        </div>
      </form>
    </section>
  </section>
	`,

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
};
