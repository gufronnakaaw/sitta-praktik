const loginForm = document.getElementById("loginForm");
const alertModal = document.getElementById("alertModal");
const lupaModal = document.getElementById("lupaModal");
const daftarModal = document.getElementById("daftarModal");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const check = dataPengguna.find(
    (user) => user.email === email && user.password === password,
  );

  if (check) {
    alert("✅ Login berhasil! Selamat datang.");

    window.location.href = "dashboard.html";
  } else {
    document.getElementById("alertMessage").textContent =
      "Email/password yang anda masukkan salah";
    alertModal.style.display = "flex";
  }
});

document.getElementById("lupaPassword").addEventListener("click", function (e) {
  e.preventDefault();
  lupaModal.style.display = "flex";
});

document.getElementById("daftar").addEventListener("click", function (e) {
  e.preventDefault();
  daftarModal.style.display = "flex";
});

function closeModal() {
  alertModal.style.display = "none";
}

function closeLupaModal() {
  lupaModal.style.display = "none";
}

function closeDaftarModal() {
  daftarModal.style.display = "none";
}

function kirimReset() {
  const resetEmail = document.getElementById("resetEmail").value;
  if (resetEmail) {
    alert("✅ Link reset password telah dikirim ke " + resetEmail);
    closeLupaModal();
  } else {
    alert("Mohon masukkan email Anda");
  }
}

window.onclick = function (event) {
  if (event.target === alertModal) closeModal();
  if (event.target === lupaModal) closeLupaModal();
  if (event.target === daftarModal) closeDaftarModal();
};
