const stokTable = document.getElementById("stokTable");
const totalItem = document.getElementById("totalItem");
function renderTable() {
  stokTable.innerHTML = "";
  dataBahanAjar.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
					<td>
						<div class="cover">
							<img src="${item.cover || "assets/img/placeholder.jpg"}" alt="${item.namaBarang}">
						</div>
					</td>
					<td>${item.kodeLokasi}</td>
					<td>${item.kodeBarang}</td>
					<td>${item.namaBarang}</td>
					<td>${item.jenisBarang}</td>
					<td>${item.edisi}</td>
					<td>${item.stok}</td>
				`;
    stokTable.appendChild(row);
  });
  totalItem.textContent = dataBahanAjar.length;
}

renderTable();
