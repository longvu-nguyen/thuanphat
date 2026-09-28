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
  // Quyền hạn: Editor không thể truy cập Cài đặt hệ thống
  if (tabId === 'tab-settings') {
    const current = DataStore.getCurrentAdmin();
    if (!current || current.role !== 'super_admin') {
      showToast("Chỉ Super Admin mới có quyền truy cập Cấu Hình & Sao Lưu!");
      return;
    }
  }

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
  if (tabId === 'tab-settings') {
    loadSettingsForm();
    renderAdminUsersTable();
  }
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
    let catBadge = '';
    if (post.category === 'dich-vu-ky-thuat') {
      catBadge = '<span class="tag-badge tag-dvkt">Dịch Vụ Kỹ Thuật</span>';
    } else if (post.category === 'may-scan') {
      catBadge = '<span class="tag-badge" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a;">Máy Scan Ricoh</span>';
    } else if (post.category === 'giai-phap-chuyen-doi-so') {
      catBadge = '<span class="tag-badge" style="background:#ede9fe; color:#6d28d9; border:1px solid #ddd6fe;">Chuyển Đổi Số</span>';
    } else if (post.category === 'ha-tang-cntt') {
      catBadge = '<span class="tag-badge" style="background:#e0e7ff; color:#3730a3; border:1px solid #c7d2fe;">Hạ Tầng CNTT</span>';
    } else {
      catBadge = '<span class="tag-badge tag-tbia">Thiết Bị In Ấn</span>';
    }

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

  // Reset AI Assistant Panel
  const aiPanel = document.getElementById("aiWriterPanel");
  const btnToggle = document.getElementById("btnToggleAiPanel");
  if (aiPanel) aiPanel.style.display = "none";
  if (btnToggle) btnToggle.textContent = "Mở AI Assistant ▾";

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

// ============================================================
// AI SEO WRITING ASSISTANT CONTROLLER
// ============================================================
function toggleAiWriterPanel() {
  const panel = document.getElementById("aiWriterPanel");
  const btn = document.getElementById("btnToggleAiPanel");
  if (!panel) return;
  const isHidden = panel.style.display === "none" || !panel.style.display;
  panel.style.display = isHidden ? "block" : "none";
  if (btn) btn.textContent = isHidden ? "Đóng AI Assistant ▴" : "Mở AI Assistant ▾";
}

const AI_PRESET_MAP = {
  'may-scan-tai-lieu-la-gi-cam-nang-chon-mua-may-scan-cho-van-phong-doanh-nghiep': {
    topic: "Cẩm nang chọn mua máy scan văn phòng và doanh nghiệp toàn diện 2026",
    category: "may-scan",
    type: "pillar"
  },
  'so-sanh-may-scan-ricoh-fi-7000-vs-fi-8000-series': {
    topic: "So sánh chi tiết máy scan Ricoh fi-7000 Series vs fi-8000 Series: Nâng cấp nào đáng giá?",
    category: "may-scan",
    type: "comparison"
  },
  'giai-phap-may-scan-toc-do-cao-2-mat-tu-dong-adf': {
    topic: "Giải pháp máy scan tài liệu 2 mặt tự động ADF tốc độ cao cho văn phòng bận rộn",
    category: "may-scan",
    type: "solution"
  },
  'giai-phap-ha-tang-cntt-tron-goi-cho-doanh-nghiep': {
    topic: "Giải pháp hạ tầng CNTT trọn gói cho doanh nghiệp vừa và nhỏ (SME)",
    category: "ha-tang-cntt",
    type: "solution"
  },
  'ha-tang-cntt-cho-hanh-chinh-cong-va-co-so-y-te': {
    topic: "Mô hình hạ tầng CNTT & máy chủ chuyên dụng cho cơ sở y tế và khối cơ quan nhà nước",
    category: "ha-tang-cntt",
    type: "pillar"
  },
  'so-hoa-tai-lieu-hanh-chinh-cong': {
    topic: "Giải pháp số hóa hồ sơ tài liệu hành chính công theo Thông tư 02/2019/TT-BNV",
    category: "giai-phap-chuyen-doi-so",
    type: "solution"
  },
  'bo-chi-so-danh-gia-muc-do-chuyen-doi-so-doanh-nghiep-dti': {
    topic: "Hướng dẫn tự đánh giá mức độ chuyển đổi số doanh nghiệp theo Bộ chỉ số DTI Bộ TT&TT",
    category: "giai-phap-chuyen-doi-so",
    type: "pillar"
  },
  'may-chu-hp-cho-doanh-nghiep-vua-va-nho': {
    topic: "Tư vấn chọn mua máy chủ HPE ProLiant Gen11 tối ưu chi phí cho doanh nghiệp SME",
    category: "ha-tang-cntt",
    type: "comparison"
  }
};

function applyAiPresetTopic(val) {
  if (!val || !AI_PRESET_MAP[val]) return;
  const item = AI_PRESET_MAP[val];
  const topicInp = document.getElementById("aiTopicInput");
  const catInp = document.getElementById("postCategory");
  const typeInp = document.getElementById("aiContentType");

  if (topicInp) topicInp.value = item.topic;
  if (catInp) catInp.value = item.category;
  if (typeInp) typeInp.value = item.type;
}

function generateAiPostContent() {
  const topic = (document.getElementById("aiTopicInput")?.value || "").trim();
  const contentType = document.getElementById("aiContentType")?.value || "pillar";
  const tone = document.getElementById("aiTone")?.value || "expert";
  const statusEl = document.getElementById("aiGeneratingStatus");

  if (!topic) {
    alert("Vui lòng nhập từ khóa hoặc chọn chủ đề mẫu từ Sitemap trước khi tạo!");
    return;
  }

  if (statusEl) statusEl.style.display = "inline-block";

  setTimeout(() => {
    // Generate SEO Title
    let title = "";
    let excerpt = "";
    let category = "may-scan";
    let imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

    const isScanner = topic.toLowerCase().includes("scan") || topic.toLowerCase().includes("ricoh");
    const isServer = topic.toLowerCase().includes("hạ tầng") || topic.toLowerCase().includes("máy chủ") || topic.toLowerCase().includes("hp");
    const isDigital = topic.toLowerCase().includes("số hóa") || topic.toLowerCase().includes("chuyển đổi số") || topic.toLowerCase().includes("dti");

    if (isScanner) {
      category = "may-scan";
      imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
    } else if (isServer) {
      category = "ha-tang-cntt";
      imageUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80";
    } else if (isDigital) {
      category = "giai-phap-chuyen-doi-so";
      imageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";
    }

    if (contentType === "comparison") {
      title = `${topic} — Phân Tích Kỹ Thuật & Tư Vấn Chi Tiết`;
      excerpt = `So sánh chi tiết hiệu năng, công nghệ chống kẹt giấy, cảm biến quét ảnh và chi phí đầu tư nhằm giúp doanh nghiệp lựa chọn thiết bị phù hợp ngân sách.`;
    } else if (contentType === "solution") {
      title = `${topic}: Mô Hình Tối Ưu Hiệu Quả & Chi Phí Cho Doanh Nghiệp`;
      excerpt = `Giải pháp công nghệ chuyên sâu từ Thuận Phát Technology, giúp tự động hóa quy trình lưu trữ, nâng cao năng suất và bảo mật thông tin toàn diện.`;
    } else {
      title = `${topic} (Cập Nhật Chuẩn Hãng Mới Nhất)`;
      excerpt = `Cẩm nang toàn diện tổng hợp các tiêu chí cốt lõi, so sánh cấu hình kỹ thuật và hướng dẫn chọn mua thiết bị công nghệ chính hãng từ chuyên gia Thuận Phát.`;
    }

    // Generate Rich HTML Content
    const htmlContent = `
<p><strong>${excerpt}</strong> Trong bối cảnh chuyển đổi số đang diễn ra mạnh mẽ tại các cơ quan ban ngành và doanh nghiệp Việt Nam, việc trang bị hệ sinh thái thiết bị chuyên dụng đóng vai trò quyết định đến năng suất vận hành và an toàn dữ liệu số.</p>

<div class="toc-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
  <strong style="color: #0f172a; font-size: 14px; display: block; margin-bottom: 8px;">Nội dung chính trong bài viết:</strong>
  <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #475569; line-height: 1.8;">
    <li>1. Tổng quan thị trường &amp; Bối cảnh ứng dụng thực tế</li>
    <li>2. Các tiêu chí kỹ thuật cốt lõi doanh nghiệp cần lưu ý</li>
    <li>3. Bảng so sánh thông số &amp; Đánh giá chuyên sâu</li>
    <li>4. Lời khuyên từ chuyên gia công nghệ Thuận Phát</li>
    <li>5. Chính sách phân phối, bảo hành chính hãng và hỗ trợ dự án</li>
  </ul>
</div>

<h2>1. Tổng quan thị trường &amp; Bối cảnh ứng dụng thực tế</h2>
<p>Khi dữ liệu trở thành tài sản trọng yếu của tổ chức, việc chuyển đổi từ tài liệu giấy sang định dạng số (PDF/A, TIFF độ phân giải cao) hoặc nâng cấp hạ tầng xử lý dữ liệu tập trung không còn là lựa chọn mà đã trở thành yêu cầu cấp thiết. Đối với các đơn vị xử lý hàng nghìn trang hồ sơ mỗi ngày, việc lựa chọn đúng thiết bị mang lại lợi ích kép: vừa cắt giảm 60% thời gian xử lý thủ công, vừa triệt tiêu rủi ro thất lạc chứng từ.</p>

<h2>2. Các tiêu chí kỹ thuật cốt lõi doanh nghiệp cần quan tâm</h2>
<p>Dựa trên kinh nghiệm hơn 10 năm tư vấn và triển khai cho các tập đoàn tài chính, bệnh viện và cơ quan hành chính công, đội ngũ chuyên gia Thuận Phát khuyến nghị đánh giá kỹ 4 yếu tố sau:</p>
<ul>
  <li><strong>Công suất thiết kế &amp; Tốc độ xử lý:</strong> Phải đáp ứng được chu kỳ tải cao điểm (Duty Cycle) mà không phát sinh hiện tượng quá nhiệt hay kẹt giấy cơ học.</li>
  <li><strong>Công nghệ nhận dạng hình ảnh &amp; Cảm biến:</strong> Ứng dụng cảm biến Clear Image Capture (CIC) hoặc CIS đa điểm giúp văn bản sắc nét ngay cả khi quét tài liệu cũ, mờ, giấy mỏng.</li>
  <li><strong>Khả năng chống nạp giấy đúp bằng sóng siêu âm:</strong> Tự động phát hiện 2 tờ giấy dính vào nhau và ngắt khay nạp để bảo vệ toàn vẹn tài liệu gốc.</li>
  <li><strong>Khả năng tích hợp phần mềm số hóa (OCR &amp; DMS):</strong> Tương thích hoàn toàn với các phần mềm quản lý lưu trữ, hỗ trợ bóc tách dữ liệu tiếng Việt chính xác tới 99.8%.</li>
</ul>

<h2>3. Bảng so sánh thông số kỹ thuật chi tiết</h2>
<div class="table-responsive" style="overflow-x: auto; margin: 20px 0;">
  <table class="cms-table" style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
    <thead>
      <tr style="background: #f1f5f9;">
        <th style="padding: 10px; border: 1px solid #cbd5e1;">Tiêu Chí Kỹ Thuật</th>
        <th style="padding: 10px; border: 1px solid #cbd5e1;">Dòng Tiêu Chuẩn / Văn Phòng SME</th>
        <th style="padding: 10px; border: 1px solid #cbd5e1;">Dòng Chuyên Dụng / Dự Án Số Hóa Lớn</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">Tốc độ quét (ADF 2 mặt)</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">40 - 50 trang/phút (80 - 100 ảnh/phút)</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">70 - 140 trang/phút (140 - 280 ảnh/phút)</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">Dung lượng khay nạp ADF</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">50 - 80 tờ tự động</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">100 - 500 tờ liên tục</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">Cảm biến chống nạp giấy đúp</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">Cảm biến quang học tiêu chuẩn</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">Cảm biến sóng siêu âm đa điểm chuyên dụng</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">Kết nối &amp; Quản trị</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">USB 3.2 Gen 1</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1;">USB 3.2 + Gigabit Ethernet (LAN quét qua mạng)</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="expert-callout" style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 24px 0;">
  <strong style="color: #3730a3; display: block; margin-bottom: 4px;">💡 Lời khuyên từ Chuyên Gia Thuận Phát Technology:</strong>
  <span style="color: #4338ca; font-size: 13.5px; line-height: 1.6;">"Đừng chỉ nhìn vào tốc độ danh định trên catalogue. Đối với dự án số hóa thực tế, độ ổn định của hệ thống cuốn giấy cơ học và khả năng nhận diện tài liệu đa định dạng (từ giấy than mỏng đến thẻ căn cước gắn chip) mới là yếu tố quyết định tới chi phí vận hành lâu dài."</span>
</div>

<h2>4. Quy trình tư vấn &amp; Chính sách bảo hành chính hãng</h2>
<p>Khi mua thiết bị hoặc hợp tác giải pháp cùng Thuận Phát Technology, khách hàng được bảo đảm quyền lợi tối đa:</p>
<ul>
  <li><strong>100% Sản phẩm chính hãng:</strong> Cung cấp đầy đủ giấy chứng nhận nguồn gốc xuất xứ (CO) và chứng nhận chất lượng (CQ).</li>
  <li><strong>Khảo sát &amp; Trải nghiệm Demo tận nơi:</strong> Hỗ trợ mang thiết bị mẫu chạy thử trực tiếp trên mẫu hồ sơ thực tế của doanh nghiệp trước khi ký hợp đồng.</li>
  <li><strong>Bảo hành chính hãng 12 - 24 tháng:</strong> Đội ngũ kỹ sư trực tiếp hỗ trợ kỹ thuật 24/7, cam kết đổi máy dự phòng trong trường hợp bảo trì dự án lớn.</li>
</ul>

<div class="cta-box" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 24px; border-radius: 12px; margin-top: 30px; text-align: center;">
  <h3 style="color: #f59e0b; margin-bottom: 8px; font-size: 18px;">Bạn Cần Tư Vấn Thiết Bị &amp; Nhận Báo Giá Dự Án?</h3>
  <p style="color: #cbd5e1; font-size: 13.5px; margin-bottom: 16px;">Liên hệ ngay với bộ phận kỹ thuật Thuận Phát để nhận tư vấn cấu hình tối ưu và chính sách giá đại lý tốt nhất.</p>
  <a href="tel:0903726554" style="background: #f59e0b; color: #ffffff; padding: 10px 24px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Hotline: 0903 726 554 (Tư vấn 24/7)</a>
</div>
`;

    // Fill form
    document.getElementById("postTitle").value = title;
    document.getElementById("postCategory").value = category;
    document.getElementById("postImage").value = imageUrl;
    document.getElementById("postExcerpt").value = excerpt;
    document.getElementById("postContent").value = htmlContent.trim();

    if (statusEl) statusEl.style.display = "none";
    showToast("✨ AI đã tạo bài viết chuẩn SEO thành công! Kiểm tra lại thông tin và bấm 'Xuất Bản'.");

    // Smooth scroll down to preview
    document.getElementById("postTitle")?.focus();
  }, 450);
}

function handleSavePost(e) {
  e.preventDefault();
  const id = document.getElementById("postEditId").value;
  const title = document.getElementById("postTitle").value.trim();
  const category = document.getElementById("postCategory").value;
  
  const catNameMap = {
    'dich-vu-ky-thuat': 'Dịch Vụ Kỹ Thuật',
    'thiet-bi-in-an': 'Thiết Bị In Ấn',
    'giai-phap-chuyen-doi-so': 'Giải Pháp Chuyển Đổi Số',
    'may-scan': 'Máy Scan Ricoh',
    'ha-tang-cntt': 'Hạ Tầng CNTT & Server'
  };
  const categoryName = catNameMap[category] || 'Tin Tức & Dịch Vụ';
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
// 6. ADMIN AUTHENTICATION & ROLE MANAGEMENT CONTROLLER
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
    
    const isSuper = currentAdmin.role === "super_admin";
    if (roleEl) {
      roleEl.innerHTML = isSuper 
        ? `<span class="topbar-role-badge role-super-admin">Super Admin (Toàn quyền)</span>` 
        : `<span class="topbar-role-badge role-editor">Biên Tập Viên (Content / SEO)</span>`;
    }
    if (avatarEl) {
      const parts = (currentAdmin.fullname || currentAdmin.username).trim().split(" ");
      avatarEl.textContent = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    }

    // Role-based visibility
    const settingsNavBtn = document.querySelector(`.cms-nav-item[data-tab="tab-settings"]`);
    const allSectionTitles = document.querySelectorAll(".nav-section-title");
    const sysSectionTitle = allSectionTitles.length > 1 ? allSectionTitles[1] : null;

    if (!isSuper) {
      if (settingsNavBtn) settingsNavBtn.style.display = "none";
      if (sysSectionTitle) sysSectionTitle.style.display = "none";
      if (currentAdminTab === 'tab-settings') {
        switchAdminTab('tab-dashboard');
      }
    } else {
      if (settingsNavBtn) settingsNavBtn.style.display = "flex";
      if (sysSectionTitle) sysSectionTitle.style.display = "block";
      renderAdminUsersTable();
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
  const role = document.getElementById("authRegRole")?.value || "editor";

  if (password !== confirmPass) {
    alert("Mật khẩu xác nhận không khớp, vui lòng nhập lại!");
    return;
  }

  const res = DataStore.registerAdmin({ username, password, fullname, role });
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

function renderAdminUsersTable() {
  const tbody = document.getElementById("adminUsersTableBody");
  if (!tbody) return;

  const admins = DataStore.getAdmins();
  const currentAdmin = DataStore.getCurrentAdmin();

  tbody.innerHTML = admins.map(admin => {
    const isCurrent = currentAdmin && currentAdmin.id === admin.id;
    const isSuper = admin.role === "super_admin";
    const roleBadge = isSuper
      ? `<span class="role-badge role-super-admin">👑 Super Admin</span>`
      : `<span class="role-badge role-editor">✍️ Biên Tập Viên (SEO)</span>`;

    const createdDate = admin.createdAt ? new Date(admin.createdAt).toLocaleDateString("vi-VN") : "Hệ thống";

    return `
      <tr>
        <td>
          <strong style="color: #0f172a;">${admin.fullname || admin.username}</strong>
          ${isCurrent ? '<span style="font-size: 11px; color: #047857; margin-left: 6px; font-weight: 700;">(Đang đăng nhập)</span>' : ''}
        </td>
        <td><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #475569;">${admin.username}</code></td>
        <td>${roleBadge}</td>
        <td style="color: #64748b; font-size: 12.5px;">${createdDate}</td>
        <td style="text-align: right;">
          ${isCurrent || admin.id === "admin-1"
            ? '<span style="font-size: 11.5px; color: #94a3b8; font-style: italic;">Mặc định</span>'
            : `<button class="btn-action-sm btn-action-delete" onclick="handleDeleteAdminUser('${admin.id}', '${admin.username}')">Xóa quyền</button>`
          }
        </td>
      </tr>
    `;
  }).join("");
}

function handleDeleteAdminUser(id, username) {
  if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}" không?`)) {
    const res = DataStore.deleteAdmin(id);
    if (res.success) {
      renderAdminUsersTable();
      showToast(`Đã xóa tài khoản "${username}" thành công!`);
    } else {
      alert(res.message);
    }
  }
}

// ============================================================
// 7. BANNER & MULTI-IMAGE GALLERY MANAGER CONTROLLER
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
  renderBannerThumbnailsGrid();
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

// ----------------------------------------------------
// MULTI-BANNER GALLERY & UPLOAD LOGIC
// ----------------------------------------------------
function handleBannerFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP)!");
    return;
  }

  // Read as Data URL (Base64)
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const bgInp = document.getElementById("bannerBgInput");
    if (bgInp) bgInp.value = dataUrl;

    // Automatically add to page gallery
    DataStore.addPageBanner(currentBannerPage, dataUrl);
    updateLiveBannerPreview();
    renderBannerThumbnailsGrid();
    showToast("Đã tải ảnh lên thành công! Bấm 'Lưu' để cập nhật ra website.");
  };
  reader.readAsDataURL(file);
}

function addCurrentBannerToGallery() {
  const bgInp = document.getElementById("bannerBgInput");
  const url = bgInp ? bgInp.value.trim() : "";
  if (!url) {
    alert("Vui lòng nhập đường dẫn ảnh hoặc tải ảnh lên trước khi thêm vào bộ sưu tập!");
    return;
  }
  DataStore.addPageBanner(currentBannerPage, url);
  renderBannerThumbnailsGrid();
  showToast("Đã lưu ảnh vào bộ sưu tập banner của trang này!");
}

function renderBannerThumbnailsGrid() {
  const grid = document.getElementById("bannerThumbnailsGrid");
  const countEl = document.getElementById("bannerGalleryCount");
  if (!grid) return;

  const pageData = DataStore.getPage(currentBannerPage);
  const banners = (pageData && Array.isArray(pageData.banners)) ? pageData.banners : (pageData && pageData.bgImage ? [pageData.bgImage] : []);
  const activeBanner = pageData ? pageData.bgImage : "";

  if (countEl) countEl.textContent = banners.length;

  if (banners.length === 0) {
    grid.innerHTML = `<span style="font-size: 12px; color: #94a3b8; font-style: italic; grid-column: 1 / -1;">Chưa có ảnh nào trong bộ sưu tập. Hãy dán link hoặc bấm 'Tải Ảnh Từ Máy'.</span>`;
    return;
  }

  grid.innerHTML = banners.map((url, idx) => {
    const isActive = (url === activeBanner);
    return `
      <div class="banner-thumb-item ${isActive ? 'active' : ''}" style="background-image: url('${url}')" onclick="selectActiveBannerImage('${url}')" title="Bấm để chọn làm banner chính">
        ${isActive ? '<span class="thumb-active-badge">Đang Dùng</span>' : ''}
        <button type="button" class="thumb-delete-btn" onclick="event.stopPropagation(); removeBannerImage('${url}')" title="Xóa ảnh khỏi bộ sưu tập">✕</button>
      </div>
    `;
  }).join("");
}

function selectActiveBannerImage(url) {
  const bgInp = document.getElementById("bannerBgInput");
  if (bgInp) bgInp.value = url;
  DataStore.setPageActiveBanner(currentBannerPage, url);
  updateLiveBannerPreview();
  renderBannerThumbnailsGrid();
  showToast("Đã chọn ảnh làm banner chính! Bấm 'Lưu' để cập nhật trang.");
}

function removeBannerImage(url) {
  if (confirm("Bạn có chắc chắn muốn xóa ảnh này khỏi bộ sưu tập banner?")) {
    DataStore.removePageBanner(currentBannerPage, url);
    renderBannerEditor();
    showToast("Đã xóa ảnh khỏi bộ sưu tập!");
  }
}

function applySampleImage(url) {
  const bgInp = document.getElementById("bannerBgInput");
  if (bgInp) {
    bgInp.value = url;
    if (url) {
      DataStore.addPageBanner(currentBannerPage, url);
    }
    updateLiveBannerPreview();
    renderBannerThumbnailsGrid();
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
    renderBannerThumbnailsGrid();
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
