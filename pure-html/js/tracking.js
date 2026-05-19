const form = document.getElementById("trackingForm");
const input = document.getElementById("nomorDO");
const resultSection = document.getElementById("resultSection");
const errorMessage = document.getElementById("errorMessage");
const namaMahasiswa = document.getElementById("namaMahasiswa");
const statusText = document.getElementById("statusText");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const ekspedisi = document.getElementById("ekspedisi");
const tanggalKirim = document.getElementById("tanggalKirim");
const jenisPaket = document.getElementById("jenisPaket");
const totalPembayaran = document.getElementById("totalPembayaran");
const timelineList = document.getElementById("timelineList");

function getProgress(status) {
  const key = status.toLowerCase();
  if (key.includes("selesai") || key.includes("diterima")) return 100;
  if (key.includes("dikirim")) return 70;
  if (key.includes("perjalanan")) return 55;
  if (key.includes("proses")) return 40;
  return 30;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderTracking(data) {
  namaMahasiswa.textContent = data.nama;
  statusText.textContent = data.status;
  statusText.setAttribute("data-status", data.status.toLowerCase());
  const percent = getProgress(data.status);
  progressBar.style.width = percent + "%";
  progressPercent.textContent = percent + "%";
  ekspedisi.textContent = data.ekspedisi;
  tanggalKirim.textContent = formatDate(data.tanggalKirim);
  jenisPaket.textContent = data.paket;
  totalPembayaran.textContent = data.total;

  timelineList.innerHTML = "";
  data.perjalanan.forEach((item) => {
    const li = document.createElement("li");
    const time = document.createElement("span");
    const text = document.createElement("p");
    time.textContent = item.waktu;
    text.textContent = item.keterangan;
    li.appendChild(time);
    li.appendChild(text);
    timelineList.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nomor = input.value.trim();
  const data = dataTracking[nomor];
  if (!nomor || !data) {
    errorMessage.textContent =
      "Nomor DO tidak ditemukan. Cek kembali input Anda.";
    resultSection.classList.add("hidden");
    return;
  }
  errorMessage.textContent = "";
  resultSection.classList.remove("hidden");
  renderTracking(data);
});
