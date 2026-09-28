/**
 * THUẬN PHÁT TECHNOLOGY — MODERN CMS CONTROLLER
 * Quản lý dữ liệu trực quan, đơn giản, kết nối trực tiếp với website chính.
 */

let currentAdminTab = 'tab-dashboard';
let prodFilterCat = 'all';
let prodSearchQuery = '';
let prodCurrentPage = 1;
const PRODS_PER_PAGE = 15;

let postFilterCat = 'all';
let postSearchQuery = '';

document.addEventListener("DOMContentLoaded", () => {
  // Check if DataStore is ready
  if (typeof DataStore !== "undefined") {
    initAdmin();
  } else {
    setTimeout(initAdmin, 100);
  }

  // Realtime sync from main site (e.g. new lead submitted on index.html)
  window.addEventListener("tp:datasync", (e) => {
    showToast("Nhận được cập nhật dữ liệu mới từ website!");
    refreshAllViews();
  });
});

function initAdmin() {
  checkAdminAuth();
  renderDashboard();
  renderAdminProducts();
  renderAdminPosts();
  renderBannerEditor();
  renderAdminLeads();
  loadSettingsForm();
}

function refreshAllViews() {
  renderDashboard();
  renderAdminProducts();
  renderAdminPosts();
  renderBannerEditor();
  renderAdminLeads();
}

// ============================================================
// TAB NAVIGATION
// ============================================================
function switchAdminTab(tabId) {
  currentAdminTab = tabId;
  document.querySelectorAll(".cms-tab-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".cms-nav-item").forEach(b => b.classList.remove("active"));

  const targetPanel = document.getElementById(tabId);
  if (targetPanel) targetPanel.classList.add("active");

  const targetNavBtn = document.querySelector(`.cms-nav-item[data-tab="${tabId}"]`);
  if (targetNavBtn) targetNavBtn.classList.add("active");

  // Re-render tab specific content
  if (tabId === 'tab-dashboard') renderDashboard();
  if (tabId === 'tab-products') renderAdminProducts();
  if (tabId === 'tab-posts') renderAdminPosts();
  if (tabId === 'tab-banners') renderBannerEditor();
  if (tabId === 'tab-leads') renderAdminLeads();
  if (tabId === 'tab-settings') loadSettingsForm();
}

// ============================================================
// 1. DASHBOARD OVERVIEW
// ============================================================
function renderDashboard() {
  const prods = DataStore.getProducts();
  const posts = DataStore.getPosts();
  const leads = DataStore.getLeads();

  const scanners = prods.filter(p => p.category === 'may-scan');
  const newLeads = leads.filter(l => l.status === 'new');

  // KPI elements
  const elDashScanners = document.getElementById("dashCountScanners");
  const elDashProds = document.getElementById("dashCountAllProducts");
  const elDashPosts = document.getElementById("dashCountPosts");
  const elDashLeads = document.getElementById("dashCountNewLeads");

  if (elDashScanners) elDashScanners.textContent = scanners.length;
  if (elDashProds) elDashProds.textContent = prods.length;
  if (elDashPosts) elDashPosts.textContent = posts.length;
  if (elDashLeads) elDashLeads.textContent = newLeads.length;

  // Sidebar badges
  const badgeTotalProds = document.getElementById("badgeTotalProducts");
  const badgeTotalPosts = document.getElementById("badgeTotalPosts");
  const badgeNewLeads = document.getElementById("badgeNewLeads");

  if (badgeTotalProds) badgeTotalProds.textContent = prods.length;
  if (badgeTotalPosts) badgeTotalPosts.textContent = posts.length;
  if (badgeNewLeads) badgeNewLeads.textContent = newLeads.length;

  // Recent leads in dashboard
  const tableBody = document.getElementById("dashLeadsTableBody");
  if (!tableBody) return;

  const recentLeads = leads.slice(0, 5);
  if (recentLeads.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 24px;">Chưa có yêu cầu báo giá nào</td></tr>`;
    return;
  }

  tableBody.innerHTML = recentLeads.map(lead => {
    const formattedDate = lead.date ? new Date(lead.date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '';
    const statusMap = {
      'new': '<span class="status-badge status-new">Mới gửi</span>',
      'contacted': '<span class="status-badge status-contacted">Đã liên hệ</span>',
      'done': '<span class="status-badge status-done">Đã chốt</span>'
    };

    return `
      <tr>
        <td style="font-size: 12.5px; color: #64748b;">${formattedDate}</td>
        <td><strong>${lead.fullname || 'Khách hàng'}</strong></td>
        <td><a href="tel:${lead.phone}" style="color: #b45309; font-weight: 600; text-decoration: none;">${lead.phone}</a></td>
        <td>${lead.company || '—'}</td>
        <td style="max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lead.service || 'Tư vấn'}</td>
        <td>${statusMap[lead.status] || lead.status}</td>
        <td>
          <button class="btn-action-sm" onclick="switchAdminTab('tab-leads')">Chi tiết →</button>
        </td>
      </tr>
    `;
  }).join("");
}

// ============================================================
// 2. PRODUCTS MANAGEMENT
// ============================================================
function renderAdminProducts() {
  const container = document.getElementById("adminProductsTableBody");
  if (!container) return;

  const allProds = DataStore.getProducts();

  // Counts
  const countAll = document.getElementById("prodCountAll");
  const countScan = document.getElementById("prodCountScan");
  const countIn = document.getElementById("prodCountIn");
  const countPhoto = document.getElementById("prodCountPhoto");

  if (countAll) countAll.textContent = allProds.length;
  if (countScan) countScan.textContent = allProds.filter(p => p.category === 'may-scan').length;
  if (countIn) countIn.textContent = allProds.filter(p => p.category === 'may-in-kyocera').length;
  if (countPhoto) countPhoto.textContent = allProds.filter(p => p.category === 'may-photocopy-ricoh').length;

  let filtered = allProds;
  if (prodFilterCat !== 'all') {
    filtered = filtered.filter(p => p.category === prodFilterCat);
  }
  if (prodSearchQuery.trim()) {
    const q = prodSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.slug && p.slug.toLowerCase().includes(q)));
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / PRODS_PER_PAGE) || 1;
  if (prodCurrentPage > totalPages) prodCurrentPage = 1;

  const startIdx = (prodCurrentPage - 1) * PRODS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + PRODS_PER_PAGE);

  const paginationInfo = document.getElementById("productsPaginationInfo");
  if (paginationInfo) {
    paginationInfo.textContent = `Hiển thị ${filtered.length > 0 ? startIdx + 1 : 0} - ${Math.min(startIdx + PRODS_PER_PAGE, filtered.length)} trên tổng số ${filtered.length} sản phẩm`;
  }

  const paginationBtns = document.getElementById("productsPaginationBtns");
  if (paginationBtns) {
    paginationBtns.innerHTML = "";
    for (let i = 1; i <= Math.min(totalPages, 7); i++) {
      const btn = document.createElement("button");
      btn.className = `btn-page ${i === prodCurrentPage ? 'active' : ''}`;
      btn.textContent = i;
      btn.onclick = () => { prodCurrentPage = i; renderAdminProducts(); };
      paginationBtns.appendChild(btn);
    }
  }

  if (pageItems.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy sản phẩm nào phù hợp.</td></tr>`;
    return;
  }

  container.innerHTML = pageItems.map(p => {
    const catMap = {
      'may-scan': '<span class="tag-badge tag-scan">Máy scan Ricoh</span>',
      'may-in-kyocera': '<span class="tag-badge tag-in">Máy in Kyocera</span>',
      'may-photocopy-ricoh': '<span class="tag-badge tag-photo">Photocopy Ricoh</span>'
    };

    return `
      <tr>
        <td>
          <img src="${p.image || 'favicon.svg'}" alt="${p.name}" class="table-thumb" onerror="this.src='favicon.svg'">
        </td>
        <td>
          <strong style="color: #0f172a; font-size: 14px;">${p.name}</strong>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Mã: ${p.slug || p.id}</div>
        </td>
        <td>${catMap[p.category] || p.category}</td>
        <td>
          <span style="font-weight: 700; color: #b45309;">${p.price && p.price !== '0' ? p.price : 'Liên hệ báo giá'}</span>
        </td>
        <td>
          <span class="status-badge status-in_stock">Mới 100% Chính Hãng</span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn-action-sm" onclick="editProduct('${p.id}')">Sửa</button>
            <button class="btn-action-sm btn-action-delete" onclick="confirmDeleteProduct('${p.id}')">Xóa</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function filterProductsByCat(cat, btn) {
  prodFilterCat = cat;
  prodCurrentPage = 1;
  document.querySelectorAll("#tab-products .filter-pill").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderAdminProducts();
}

function handleAdminProductSearch(query) {
  prodSearchQuery = query || '';
  prodCurrentPage = 1;
  renderAdminProducts();
}

function openProductModal(prodId = null) {
  const modal = document.getElementById("productModal");
  const title = document.getElementById("productModalTitle");
  const form = document.getElementById("productForm");
  form.reset();

  if (prodId) {
    title.textContent = "Chỉnh Sửa Thiết Bị";
    const prod = DataStore.getProductById(prodId);
    if (prod) {
      document.getElementById("prodEditId").value = prod.id;
      document.getElementById("prodName").value = prod.name || '';
      document.getElementById("prodCategory").value = prod.category || 'may-scan';
      document.getElementById("prodPrice").value = prod.price || '';
      document.getElementById("prodImage").value = prod.image || '';
      document.getElementById("prodExcerpt").value = prod.excerpt || '';
      document.getElementById("prodStatus").value = prod.status || 'in_stock';
    }
  } else {
    title.textContent = "Thêm Sản Phẩm Mới";
    document.getElementById("prodEditId").value = "";
  }

  modal.classList.add("open");
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("open");
}

function handleSaveProduct(e) {
  e.preventDefault();
  const id = document.getElementById("prodEditId").value;
  const name = document.getElementById("prodName").value.trim();
  const category = document.getElementById("prodCategory").value;
  const price = document.getElementById("prodPrice").value.trim() || "Liên hệ";
  const image = document.getElementById("prodImage").value.trim() || "assets/logo.png";
  const excerpt = document.getElementById("prodExcerpt").value.trim();
  const status = document.getElementById("prodStatus").value;

  const prodData = {
    id: id || "tp-prod-" + Date.now(),
    name,
    category,
    price,
    image,
    excerpt,
    status,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  };

  DataStore.saveProduct(prodData);
  closeProductModal();
  renderAdminProducts();
  renderDashboard();
  showToast(id ? "Đã cập nhật sản phẩm thành công!" : "Đã thêm sản phẩm mới vào website!");
}

function editProduct(id) {
  openProductModal(id);
}

function confirmDeleteProduct(id) {
  const prod = DataStore.getProductById(id);
  if (!prod) return;
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${prod.name}" không? Thao tác này sẽ đồng bộ ngay lập tức sang website.`)) {
    DataStore.deleteProduct(id);
    renderAdminProducts();
    renderDashboard();
    showToast("Đã xóa sản phẩm thành công!");
  }
}

// ============================================================
// 3. POSTS / NEWS MANAGEMENT (12 CRAWLED POSTS)
// ============================================================
function renderAdminPosts() {
  const container = document.getElementById("adminPostsTableBody");
  if (!container) return;

  const allPosts = DataStore.getPosts();

  // Counts
  const countAll = document.getElementById("postCountAll");
  const countDvkt = document.getElementById("postCountDvkt");
  const countTbia = document.getElementById("postCountTbia");

  if (countAll) countAll.textContent = allPosts.length;
  if (countDvkt) countDvkt.textContent = allPosts.filter(p => p.category === 'dich-vu-ky-thuat').length;
  if (countTbia) countTbia.textContent = allPosts.filter(p => p.category === 'thiet-bi-in-an').length;

  let filtered = allPosts;
  if (postFilterCat !== 'all') {
    filtered = filtered.filter(p => p.category === postFilterCat);
  }
  if (postSearchQuery.trim()) {
    const q = postSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => (p.title && p.title.toLowerCase().includes(q)) || (p.excerpt && p.excerpt.toLowerCase().includes(q)));
  }

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy bài viết nào phù hợp.</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(post => {
    const catBadge = post.category === 'dich-vu-ky-thuat' 
      ? '<span class="tag-badge tag-dvkt">Dịch Vụ Kỹ Thuật</span>' 
      : '<span class="tag-badge tag-tbia">Thiết Bị In Ấn</span>';

    return `
      <tr>
        <td>
          <img src="${post.thumbnail || post.image || 'assets/logo.png'}" alt="${post.title}" class="table-thumb" style="object-fit: cover;" onerror="this.src='assets/logo.png'">
        </td>
        <td>
          <strong style="color: #0f172a; font-size: 14px; line-height: 1.4; display: block;">${post.title}</strong>
          <span style="font-size: 12px; color: #64748b;">${post.excerpt ? post.excerpt.substring(0, 90) + '...' : ''}</span>
        </td>
        <td>${catBadge}</td>
        <td style="color: #64748b; font-size: 12.5px;">${post.date || '18/07/2025'}</td>
        <td style="font-weight: 600; color: #334155;">${post.views || 100}</td>
        <td><span class="status-badge status-in_stock">Đã xuất bản</span></td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn-action-sm" onclick="editPost('${post.id}')">Sửa</button>
            <button class="btn-action-sm btn-action-delete" onclick="confirmDeletePost('${post.id}')">Xóa</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function filterPostsByCat(cat, btn) {
  postFilterCat = cat;
  document.querySelectorAll("#tab-posts .filter-pill").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderAdminPosts();
}

function handleAdminPostSearch(query) {
  postSearchQuery = query || '';
  renderAdminPosts();
}

function openPostModal(postId = null) {
  const modal = document.getElementById("postModal");
  const title = document.getElementById("postModalTitle");
  const form = document.getElementById("postForm");
  form.reset();

  if (postId) {
    title.textContent = "Chỉnh Sửa Bài Viết";
    const post = DataStore.getPostById(postId);
    if (post) {
      document.getElementById("postEditId").value = post.id;
      document.getElementById("postTitle").value = post.title || '';
      document.getElementById("postCategory").value = post.category || 'dich-vu-ky-thuat';
      document.getElementById("postAuthor").value = post.author || 'Thuận Phát Technology';
      document.getElementById("postImage").value = post.image || post.thumbnail || '';
      document.getElementById("postExcerpt").value = post.excerpt || '';
      document.getElementById("postContent").value = post.content || '';
    }
  } else {
    title.textContent = "Tạo Bài Viết Mới";
    document.getElementById("postEditId").value = "";
    document.getElementById("postAuthor").value = "Thuận Phát Technology";
  }

  modal.classList.add("open");
}

function closePostModal() {
  document.getElementById("postModal").classList.remove("open");
}

function handleSavePost(e) {
  e.preventDefault();
  const id = document.getElementById("postEditId").value;
  const title = document.getElementById("postTitle").value.trim();
  const category = document.getElementById("postCategory").value;
  const categoryName = category === 'dich-vu-ky-thuat' ? 'Dịch Vụ Kỹ Thuật' : 'Thiết Bị In Ấn';
  const author = document.getElementById("postAuthor").value.trim() || "Thuận Phát Technology";
  const image = document.getElementById("postImage").value.trim();
  const excerpt = document.getElementById("postExcerpt").value.trim();
  const content = document.getElementById("postContent").value.trim() || `<p>${excerpt}</p>`;

  const postData = {
    id: id || "post-" + Date.now(),
    title,
    category,
    categoryName,
    author,
    image,
    thumbnail: image,
    excerpt,
    content,
    status: "published",
    date: new Date().toISOString().split("T")[0],
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  };

  DataStore.savePost(postData);
  closePostModal();
  renderAdminPosts();
  renderDashboard();
  showToast(id ? "Đã lưu bài viết thành công!" : "Đã xuất bản bài viết mới!");
}

function editPost(id) {
  openPostModal(id);
}

function confirmDeletePost(id) {
  const post = DataStore.getPostById(id);
  if (!post) return;
  if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title}" không?`)) {
    DataStore.deletePost(id);
    renderAdminPosts();
    renderDashboard();
    showToast("Đã xóa bài viết thành công!");
  }
}

// ============================================================
// 4. LEADS & CONTACTS MANAGEMENT (CRM)
// ============================================================
function renderAdminLeads() {
  const container = document.getElementById("adminLeadsTableBody");
  if (!container) return;

  const leads = DataStore.getLeads();
  if (leads.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">Chưa có khách hàng nào để lại thông tin liên hệ.</td></tr>`;
    return;
  }

  container.innerHTML = leads.map(lead => {
    const formattedDate = lead.date ? new Date(lead.date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');

    return `
      <tr>
        <td style="font-size: 12px; color: #64748b;">${formattedDate}</td>
        <td><strong style="color: #0f172a; font-size: 14px;">${lead.fullname || 'Khách hàng'}</strong></td>
        <td>
          <a href="tel:${cleanPhone}" style="color: #b45309; font-weight: 700; text-decoration: none;">${lead.phone}</a>
        </td>
        <td>${lead.email ? `<a href="mailto:${lead.email}" style="color: #475569; text-decoration: none;">${lead.email}</a>` : '—'}</td>
        <td>${lead.company || '—'}</td>
        <td>
          <strong style="color: #1e293b;">${lead.service || 'Tư vấn chung'}</strong>
          ${lead.notes ? `<div style="font-size: 12px; color: #64748b; margin-top: 2px;">${lead.notes}</div>` : ''}
        </td>
        <td>
          <select class="form-control" style="padding: 4px 8px; font-size: 12px; border-radius: 6px;" onchange="changeLeadStatus('${lead.id}', this.value)">
            <option value="new" ${lead.status === 'new' ? 'selected' : ''}>Mới gửi</option>
            <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Đã liên hệ tư vấn</option>
            <option value="done" ${lead.status === 'done' ? 'selected' : ''}>Đã chốt hợp đồng</option>
          </select>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            ${cleanPhone ? `<a href="https://zalo.me/${cleanPhone}" target="_blank" class="btn-action-sm" style="background: #0068ff; color: #fff; border-color: #0068ff; text-decoration: none;">Zalo</a>` : ''}
            <button class="btn-action-sm btn-action-delete" onclick="confirmDeleteLead('${lead.id}')">Xóa</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function changeLeadStatus(id, newStatus) {
  DataStore.updateLeadStatus(id, newStatus);
  renderDashboard();
  showToast("Đã cập nhật trạng thái yêu cầu!");
}

function confirmDeleteLead(id) {
  if (confirm("Bạn có chắc chắn muốn xóa yêu cầu tư vấn này không?")) {
    DataStore.deleteLead(id);
    renderAdminLeads();
    renderDashboard();
    showToast("Đã xóa yêu cầu thành công!");
  }
}

function exportLeadsToCSV() {
  const leads = DataStore.getLeads();
  if (leads.length === 0) {
    alert("Chưa có danh sách khách hàng để xuất file!");
    return;
  }
  let csv = "Thời gian,Họ và tên,Điện thoại,Email,Đơn vị / Công ty,Nhu cầu tư vấn,Trạng thái\n";
  leads.forEach(l => {
    csv += `"${l.date}","${l.fullname}","${l.phone}","${l.email}","${l.company}","${l.service}","${l.status}"\n`;
  });
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Danh_Sach_Khach_Hang_ThuanPhat_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// 5. SETTINGS & BACKUP/RESTORE
// ============================================================
function loadSettingsForm() {
  const settings = DataStore.getSettings();
  if (document.getElementById("settingCompanyName")) {
    document.getElementById("settingCompanyName").value = settings.companyName || '';
    document.getElementById("settingHotline").value = settings.hotline || '0903 726 554';
    document.getElementById("settingHotlineAlt").value = settings.hotlineAlt || '0901 396 669';
    document.getElementById("settingEmail").value = settings.email || 'contact@thuanphat8.vn';
    document.getElementById("settingTaxCode").value = settings.taxCode || '0107425090';
    document.getElementById("settingAddress").value = settings.address || '';
    document.getElementById("settingHeroTitle").value = settings.heroTitle || '';
  }
}

function handleSaveSettings(e) {
  e.preventDefault();
  const current = DataStore.getSettings();
  const updated = {
    ...current,
    companyName: document.getElementById("settingCompanyName").value.trim(),
    hotline: document.getElementById("settingHotline").value.trim(),
    hotlineAlt: document.getElementById("settingHotlineAlt").value.trim(),
    email: document.getElementById("settingEmail").value.trim(),
    taxCode: document.getElementById("settingTaxCode").value.trim(),
    address: document.getElementById("settingAddress").value.trim(),
    heroTitle: document.getElementById("settingHeroTitle").value.trim()
  };
  DataStore.saveSettings(updated);
  showToast("Đã lưu cấu hình website thành công!");
}

function exportFullDatabaseJSON() {
  const data = DataStore.exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Backup_ThuanPhat8_Database_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Đã tải xuống file sao lưu cơ sở dữ liệu!");
}

function handleImportJSONFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const obj = JSON.parse(event.target.result);
      if (DataStore.importAllData(obj)) {
        refreshAllViews();
        loadSettingsForm();
        showToast("Đã nhập dữ liệu thành công từ file backup!");
      } else {
        alert("Định dạng file sao lưu không hợp lệ!");
      }
    } catch (err) {
      alert("Lỗi đọc file JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

async function confirmResetToDefault() {
  if (confirm("Bạn có chắc chắn muốn khôi phục lại toàn bộ cơ sở dữ liệu về mặc định (96 sản phẩm, 12 bài viết cào từ thuanphat8.vn)?")) {
    await DataStore.resetToDefault();
    refreshAllViews();
    loadSettingsForm();
    showToast("Đã khôi phục dữ liệu gốc thành công!");
  }
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(msg) {
  const toast = document.getElementById("cmsToast");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// ============================================================
// 6. ADMIN AUTHENTICATION CONTROLLER
// ============================================================
function checkAdminAuth() {
  const overlay = document.getElementById("adminAuthOverlay");
  const currentAdmin = DataStore.getCurrentAdmin();

  if (currentAdmin) {
    if (overlay) overlay.classList.add("hidden");
    
    // Update topbar user
    const nameEl = document.getElementById("topbarUserName");
    const roleEl = document.getElementById("topbarUserRole");
    const avatarEl = document.getElementById("topbarUserAvatar");
    if (nameEl) nameEl.textContent = currentAdmin.fullname || currentAdmin.username;
    if (roleEl) roleEl.textContent = currentAdmin.role || "Quản Trị Viên";
    if (avatarEl) {
      const parts = (currentAdmin.fullname || currentAdmin.username).trim().split(" ");
      avatarEl.textContent = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    }
  } else {
    if (overlay) overlay.classList.remove("hidden");
  }
}

function switchAuthMode(mode) {
  const loginForm = document.getElementById("adminLoginForm");
  const regForm = document.getElementById("adminRegisterForm");
  const tabLogin = document.getElementById("tabBtnLogin");
  const tabReg = document.getElementById("tabBtnRegister");

  if (mode === 'login') {
    if (loginForm) loginForm.style.display = "block";
    if (regForm) regForm.style.display = "none";
    if (tabLogin) tabLogin.classList.add("active");
    if (tabReg) tabReg.classList.remove("active");
  } else {
    if (loginForm) loginForm.style.display = "none";
    if (regForm) regForm.style.display = "block";
    if (tabLogin) tabLogin.classList.remove("active");
    if (tabReg) tabReg.classList.add("active");
  }
}

function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById("authLoginUser").value;
  const password = document.getElementById("authLoginPass").value;

  const res = DataStore.loginAdmin(username, password);
  if (res.success) {
    showToast(`Chào mừng ${res.user.fullname} đã đăng nhập!`);
    checkAdminAuth();
  } else {
    alert(res.message);
  }
}

function handleAdminRegisterSubmit(e) {
  e.preventDefault();
  const fullname = document.getElementById("authRegFullname").value;
  const username = document.getElementById("authRegUser").value;
  const password = document.getElementById("authRegPass").value;
  const confirmPass = document.getElementById("authRegPassConfirm").value;

  if (password !== confirmPass) {
    alert("Mật khẩu xác nhận không khớp, vui lòng nhập lại!");
    return;
  }

  const res = DataStore.registerAdmin({ username, password, fullname });
  if (res.success) {
    showToast("Tạo tài khoản quản trị thành công! Đang tự động đăng nhập...");
    DataStore.loginAdmin(username, password);
    checkAdminAuth();
  } else {
    alert(res.message);
  }
}

function handleAdminLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống CMS?")) {
    DataStore.logoutAdmin();
    checkAdminAuth();
    showToast("Đã đăng xuất tài khoản an toàn!");
  }
}

// ============================================================
// 7. BANNER & PAGES MANAGER CONTROLLER
// ============================================================
let currentBannerPage = 'may-scan';

const PAGE_LABELS = {
  'may-scan': 'Trang Máy Scan Ricoh',
  'home': 'Trang Chủ',
  'ha-tang': 'Hạ Tầng CNTT',
  'giai-phap-so': 'Giải Pháp Số & DTI',
  'tin-tuc': 'Tin Tức & Cẩm Nang',
  'gioi-thieu': 'Giới Thiệu',
  'lien-he': 'Liên Hệ'
};

const PAGE_PREVIEW_URLS = {
  'may-scan': 'index.html#may-scan',
  'home': 'index.html',
  'ha-tang': 'index.html#ha-tang',
  'giai-phap-so': 'index.html#giai-phap-so',
  'tin-tuc': 'index.html#tin-tuc',
  'gioi-thieu': 'index.html#gioi-thieu',
  'lien-he': 'index.html#lien-he'
};

function selectBannerPage(pageKey, btnEl) {
  currentBannerPage = pageKey;

  // Update button active state
  document.querySelectorAll(".banner-page-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  if (btnEl) {
    btnEl.classList.add("active");
  } else {
    const matchingBtn = document.querySelector(`.banner-page-btn[data-page="${pageKey}"]`);
    if (matchingBtn) matchingBtn.classList.add("active");
  }

  // Update public preview link
  const previewLink = document.getElementById("btnPreviewPublicPage");
  if (previewLink) {
    previewLink.href = PAGE_PREVIEW_URLS[pageKey] || 'index.html';
  }

  renderBannerEditor();
}

function renderBannerEditor() {
  const pageData = DataStore.getPage(currentBannerPage);
  if (!pageData) return;

  // Update indicator label
  const indEl = document.getElementById("previewPageIndicator");
  if (indEl) indEl.textContent = PAGE_LABELS[currentBannerPage] || pageData.name || currentBannerPage;

  // Populate form fields
  const badgeInp = document.getElementById("bannerBadgeInput");
  const titleInp = document.getElementById("bannerTitleInput");
  const subInp = document.getElementById("bannerSubtitleInput");
  const bgInp = document.getElementById("bannerBgInput");
  const ctaInp = document.getElementById("bannerCtaInput");

  if (badgeInp) badgeInp.value = pageData.badge || "";
  if (titleInp) titleInp.value = pageData.title || "";
  if (subInp) subInp.value = pageData.subtitle || "";
  if (bgInp) bgInp.value = pageData.bgImage || "";
  if (ctaInp) ctaInp.value = pageData.ctaText || "";

  updateLiveBannerPreview();
}

function updateLiveBannerPreview() {
  const badgeVal = (document.getElementById("bannerBadgeInput")?.value || "").trim();
  const titleVal = (document.getElementById("bannerTitleInput")?.value || "").trim();
  const subVal = (document.getElementById("bannerSubtitleInput")?.value || "").trim();
  const bgVal = (document.getElementById("bannerBgInput")?.value || "").trim();
  const ctaVal = (document.getElementById("bannerCtaInput")?.value || "").trim();

  // Preview elements
  const prevBadge = document.getElementById("prevBadge");
  const prevTitle = document.getElementById("prevTitle");
  const prevSub = document.getElementById("prevSubtitle");
  const prevCta = document.getElementById("prevCta");
  const prevFrame = document.getElementById("bannerLivePreview");

  if (prevBadge) prevBadge.textContent = badgeVal || "NHÃN NỔI BẬT";
  if (prevTitle) prevTitle.innerHTML = (titleVal || "Tiêu Đề Banner Trang").replace(/\n/g, "<br>");
  if (prevSub) prevSub.textContent = subVal || "Mô tả phụ cho trang...";
  if (prevCta) prevCta.textContent = ctaVal || "Hành động →";

  if (prevFrame) {
    if (bgVal) {
      prevFrame.style.backgroundImage = `url('${bgVal}')`;
    } else {
      prevFrame.style.backgroundImage = "none";
    }
  }
}

function applySampleImage(url) {
  const bgInp = document.getElementById("bannerBgInput");
  if (bgInp) {
    bgInp.value = url;
    updateLiveBannerPreview();
    if (url) {
      showToast("Đã chọn ảnh mẫu! Bấm 'Lưu & Cập Nhật' để áp dụng.");
    } else {
      showToast("Đã xóa ảnh banner (dùng nền tối mặc định). Bấm 'Lưu' để áp dụng.");
    }
  }
}

function handleSaveCurrentBanner(e) {
  e.preventDefault();
  const badge = document.getElementById("bannerBadgeInput")?.value || "";
  const title = document.getElementById("bannerTitleInput")?.value || "";
  const subtitle = document.getElementById("bannerSubtitleInput")?.value || "";
  const bgImage = document.getElementById("bannerBgInput")?.value || "";
  const ctaText = document.getElementById("bannerCtaInput")?.value || "";

  const updated = DataStore.updatePage(currentBannerPage, {
    badge,
    title,
    subtitle,
    bgImage,
    ctaText
  });

  if (updated) {
    showToast(`Đã lưu và cập nhật Banner ${PAGE_LABELS[currentBannerPage]} lên website!`);
  }
}

function resetCurrentBannerToDefault() {
  const defaultPresets = {
    'home': {
      badge: "ĐẠI LÝ CHÍNH HÃNG RICOH • HP • KYOCERA",
      title: "Nhà Cung Cấp Thiết Bị & Giải Pháp Công Nghệ Toàn Diện Cho Doanh Nghiệp",
      subtitle: "Chuyên sâu máy scan Ricoh, hạ tầng máy chủ HPE, máy in Kyocera và giải pháp số hoá tài liệu lưu trữ, chuyển đổi số DTI toàn diện.",
      bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Khám Phá Sản Phẩm"
    },
    'may-scan': {
      badge: "RICOH AUTHORIZED PARTNER VIETNAM",
      title: "Máy Scan Tài Liệu Ricoh Chuyên Dụng Tốc Độ Cao Cho Văn Phòng & Dự Án",
      subtitle: "Thuận Phát phân phối chính hãng 100% đầy đủ 34 dòng máy quét Ricoh fi Series và ScanSnap. Giải pháp scan tự động 2 mặt ADF, nhận dạng OCR tiếng Việt, chống nạp giấy đúp bằng sóng siêu âm, bảo hành chính hãng tận nơi 12-24 tháng.",
      bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Nhận báo giá dự án"
    },
    'ha-tang': {
      badge: "HPE AUTHORIZED PARTNER VIETNAM",
      title: "Hạ Tầng CNTT & Giải Pháp Máy Chủ HPE ProLiant Gen11",
      subtitle: "Cung cấp máy chủ HPE Gen11, giải pháp lưu trữ SAN/NAS, thiết bị mạng Cisco/Aruba và chiến lược an toàn dữ liệu 3-2-1 chống Ransomware 24/7.",
      bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Tư vấn hạ tầng server"
    },
    'giai-phap-so': {
      badge: "HỆ THỐNG CHUYỂN ĐỔI SỐ TOÀN DIỆN",
      title: "Hệ Thống Giải Pháp Số Hoá & Đánh Giá Năng Lực Số Doanh Nghiệp DTI",
      subtitle: "Cấu hình linh hoạt theo mô hình 3 cấp kết nối phần cứng máy scan Ricoh, máy chủ HP và giải pháp số hoá hồ sơ theo Thông tư 02/2019/TT-BNV.",
      bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Đăng ký tư vấn lộ trình"
    },
    'tin-tuc': {
      badge: "TRUNG TÂM KIẾN THỨC & DỊCH VỤ KỸ THUẬT",
      title: "Tin Tức, Cẩm Nang In Ấn & Dịch Vụ Kỹ Thuật Chuyên Sâu",
      subtitle: "Tổng hợp hướng dẫn lựa chọn máy scan, bảo trì bảo dưỡng máy in và giải pháp công nghệ văn phòng chuẩn hãng.",
      bgImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Khám phá bài viết"
    },
    'gioi-thieu': {
      badge: "VỀ THUẬN PHÁT TECHNOLOGY",
      title: "Đồng Hành Cùng Doanh Nghiệp & Khối Cơ Quan Trong Kỷ Nguyên Số",
      subtitle: "Hơn 10 năm kinh nghiệm trong lĩnh vực cung cấp thiết bị máy scan chuyên dụng, máy in và tích hợp giải pháp chuyển đổi số toàn diện tại Việt Nam.",
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Liên hệ hợp tác"
    },
    'lien-he': {
      badge: "HỖ TRỢ TƯ VẤN TRỰC TIẾP",
      title: "Liên Hệ Với Đội Ngũ Chuyên Gia Thuận Phát Technology",
      subtitle: "Chúng tôi sẵn sàng khảo sát hiện trạng, tư vấn cấu hình thiết bị và gửi bảng báo giá dự án cạnh tranh nhất trong vòng 15 phút.",
      bgImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Gửi yêu cầu tư vấn"
    }
  };

  const preset = defaultPresets[currentBannerPage];
  if (preset && confirm(`Khôi phục nội dung mặc định của ${PAGE_LABELS[currentBannerPage]}?`)) {
    DataStore.updatePage(currentBannerPage, preset);
    renderBannerEditor();
    showToast(`Đã khôi phục ${PAGE_LABELS[currentBannerPage]} về mặc định!`);
  }
}
