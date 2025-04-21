document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar-container");
  const mainContent = document.getElementById("mainContent");

  async function loadSection(section) {
    const response = await fetch(`${section}.html`);
    const html = await response.text();
    mainContent.innerHTML = html;

    if (section === "stock-table") {
      loadStockData();
    }
  }

  async function loadSidebar() {
    const res = await fetch("menu.html");
    const html = await res.text();
    sidebarContainer.innerHTML = html;

    const links = sidebarContainer.querySelectorAll("a[data-section]");
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        loadSection(section);
      });
    });
  }

  async function loadStockData() {
    const SUPABASE_URL = "https://xkrpljsulrjsmtmkeefc.supabase.co";
    const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcnBsanN1bHJqc210bWtlZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTMxMDYsImV4cCI6MjA2MDgyOTEwNn0.r0-1UIWWs9esFIY3lc3Fz3IclRJSrPqx4D-hXvhOFvo";

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/stock`, {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      const tbody = document.getElementById("stockTableBody");
      if (!tbody) return;

      tbody.innerHTML = "";
      data.forEach(item => {
        tbody.innerHTML += `
          <tr>
            <td class="py-3 px-4">${item.reference || ""}</td>
            <td class="py-3 px-4">${item.designation || ""}</td>
            <td class="py-3 px-4">${item.quantite || 0}</td>
            <td class="py-3 px-4">${item.emplacement || ""}</td>
            <td class="py-3 px-4">${item.prix_ht ? item.prix_ht.toFixed(2) + " €" : ""}</td>
          </tr>
        `;
      });
    } catch (error) {
      console.error("Erreur de chargement des données Supabase:", error);
    }
  }

  loadSidebar();
  loadSection("stock");
});