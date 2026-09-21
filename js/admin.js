/**
 * THUANPHAT8.VN - ADMIN CMS JAVASCRIPT CONTROLLER (V2 ENHANCED)
 * 9 Modules: Dashboard, Posts, Pages, Leads, Products, Utilities (AI & Sitemap), Media, Theme, Settings
 * Integrated AI Content Assistant ("Trợ Lý AI Thuận Phát") with Clean HTML & SEO Generator
 */

// ============================================================
// 0. AUTHENTICATION ROUTE GUARD
// ============================================================
if (typeof DataStore !== "undefined" && DataStore.auth) {
  if (!DataStore.auth.isAuthenticated()) {
    window.location.href = "login.html?redirect=admin.html";
  }
}

// ============================================================
// 1. ADMIN APPLICATION STATE
// ============================================================
const AdminApp = {
  currentTab: "dashboard",
  editingPostId: null,
  editingSolutionId: null,
  editingProductId: null,
  aiPendingResult: ""
};

// ============================================================
// 2. TAB & DROPDOWN ACCORDION SWITCHER
// ============================================================
function switchAdminTab(tabName, subTabName = null) {
  AdminApp.currentTab = tabName;

  // Update topbar title
  const titles = {
    dashboard: "Bảng Điều Khiển Tổng Quan",
    posts: "Quản Lý Bài Viết & Content (SEO Sitemap)",
    pages: "Quản Lý & Chỉnh Sửa Trang",
    leads: "Quản Lý Khách Hàng Tiềm Năng (Leads CRM)",
    products: "Quản Lý Sản Phẩm & Thiết Bị Chính Hãng",
    utilities: "Tiện Ích Hệ Thống & Cấu Hình Sitemap SEO",
    media: "Thư Viện Hình Ảnh & Tài Liệu",
    theme: "Tùy Biến Giao Diện & Banner Trang Chủ",
    settings: "Cài Đặt Hệ Thống & Kết Nối Gemini AI",
    users: "Quản Trị Phân Quyền & Cơ Sở Dữ Liệu"
  };

  const titleEl = document.getElementById("adminTopbarTitle");
  if (titleEl) titleEl.textContent = titles[tabName] || "Hệ Thống Quản Trị";

  // Update breadcrumb
  const breadcrumbEl = document.getElementById("adminBreadcrumbCurrent");
  if (breadcrumbEl) {
    const breadcrumbTitles = {
      dashboard: "Bảng điều khiển",
      posts: "Bài viết",
      pages: "Trang",
      leads: "Liên hệ",
      products: "Sản phẩm",
      utilities: "Tiện ích",
      media: "Media",
      theme: "Giao diện",
      settings: "Cài đặt",
      users: "Tài khoản & Database"
    };
    breadcrumbEl.textContent = breadcrumbTitles[tabName] || "Cài đặt";
  }

  // Deactivate all nav buttons
  document.querySelectorAll(".nav-item-btn, .nav-sub-item").forEach(btn => {
    btn.classList.remove("active");
  });

  // Activate parent button
  const parentBtn = document.querySelector(`.nav-item-btn[data-tab="${tabName}"]`);
  if (parentBtn) parentBtn.classList.add("active");

  // Activate sub-item if specified
  if (subTabName) {
    const subBtn = document.querySelector(`.nav-sub-item[data-sub="${subTabName}"]`);
    if (subBtn) subBtn.classList.add("active");
  }

  // Switch tab panes
  document.querySelectorAll(".admin-tab-pane").forEach(pane => {
    pane.classList.toggle("active", pane.id === `pane-${tabName}`);
  });

  // Trigger render functions
  switch (tabName) {
    case "dashboard": renderDashboard(); break;
    case "posts": renderPostsTable(); break;
    case "pages": renderPagesTable(); break;
    case "leads": renderLeadsTable(); break;
    case "products": renderProductsTable(); break;
    case "utilities": renderUtilities(); break;
    case "media": renderMediaLibrary(); break;
    case "theme": loadThemeSettings(); break;
    case "settings": loadSystemSettings(); break;
    case "users":
      renderAdminUsersTable();
      renderDatabaseStats();
      renderAuditLogs();
      if (subTabName) {
        if (subTabName === "users-all" || subTabName === "users-new") {
          switchUsersSubTab("users-list");
          if (subTabName === "users-new") openAdminUserModal(null);
        } else if (subTabName === "db-center") {
          switchUsersSubTab("db-center");
        } else if (subTabName === "audit-logs") {
          switchUsersSubTab("audit-logs");
        }
      }
      break;
  }
}

// Expand/Collapse dropdown in sidebar
function toggleSubmenu(parentWrapId) {
  const wrap = document.getElementById(parentWrapId);
  if (wrap) {
    wrap.classList.toggle("expanded");
  }
}

// ============================================================
// 3. DASHBOARD RENDERER
// ============================================================
function renderDashboard() {
  const posts = DataStore.getPosts();
  const leads = DataStore.getLeads();
  const prods = DataStore.getProducts();

  const totalPostsEl = document.getElementById("dashTotalPosts");
  const totalLeadsEl = document.getElementById("dashTotalLeads");
  const totalProdsEl = document.getElementById("dashTotalProducts");
  const totalViewsEl = document.getElementById("dashTotalViews");

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  if (totalPostsEl) totalPostsEl.textContent = posts.length;
  if (totalLeadsEl) totalLeadsEl.textContent = leads.length;
  if (totalProdsEl) totalProdsEl.textContent = prods.length;
  if (totalViewsEl) totalViewsEl.textContent = (totalViews + 4520).toLocaleString("vi-VN");

  renderAnalyticsChart();

  const recentLeadsBody = document.getElementById("dashRecentLeadsBody");
  if (recentLeadsBody) {
    recentLeadsBody.innerHTML = leads.slice(0, 5).map(l => `
      <tr>
        <td><strong>${l.refCode}</strong></td>
        <td>${l.fullname}</td>
        <td><a href="tel:${l.phone}" style="color: #6366f1; font-weight: 600;">📞 ${l.phone}</a></td>
        <td>${l.organization}</td>
        <td><span class="badge-status badge-lead-${l.status}">${getLeadStatusText(l.status)}</span></td>
        <td>${l.date}</td>
      </tr>
    `).join("");
  }
}

function renderAnalyticsChart() {
  const canvas = document.getElementById("adminAnalyticsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const views = [320, 480, 560, 620, 780, 890, 710];
  const maxVal = 1000;

  const padLeft = 40;
  const padBottom = 30;
  const chartW = w - padLeft - 20;
  const chartH = h - padBottom - 20;

  // Grid
  ctx.strokeStyle = "#e8ebf0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 20 + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    ctx.fillText(`${maxVal - (maxVal / 4) * i}`, 10, y + 3);
  }

  const stepX = chartW / (days.length - 1);
  const points = views.map((val, idx) => {
    const x = padLeft + idx * stepX;
    const y = 20 + chartH - (val / maxVal) * chartH;
    return { x, y, val };
  });

  // Gradient
  const grad = ctx.createLinearGradient(0, 20, 0, 20 + chartH);
  grad.addColorStop(0, "rgba(99, 102, 241, 0.3)");
  grad.addColorStop(1, "rgba(99, 102, 241, 0.0)");

  ctx.beginPath();
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.lineTo(points[points.length - 1].x, 20 + chartH);
  ctx.lineTo(points[0].x, 20 + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Points
  points.forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(days[i], pt.x, h - 8);
  });
}

// ============================================================
// 4. POSTS & CONTENT CMS (CHO BẠN CONTENT)
// ============================================================
function renderPostsTable() {
  const posts = DataStore.getPosts();
  const searchVal = (document.getElementById("postSearchInput")?.value || "").toLowerCase();
  const catVal = document.getElementById("postCategoryFilter")?.value || "all";

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchVal) || (p.focusKeyword || "").toLowerCase().includes(searchVal);
    const matchCat = catVal === "all" || p.category === catVal;
    return matchSearch && matchCat;
  });

  const tbody = document.getElementById("postsTableBody");
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888; padding: 30px;">Không tìm thấy bài viết nào phù hợp.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td style="max-width: 280px;">
        <strong style="color: #1e293b; display: block; margin-bottom: 2px;">${p.title}</strong>
        <span style="font-size: 11.5px; color: #888;">/${p.slug}</span>
      </td>
      <td><span style="font-size: 12px; font-weight: 600; color: #475569;">${getCategoryName(p.category)}</span></td>
      <td><span style="font-size: 11.5px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${p.pillar || "N/A"}</span></td>
      <td><span class="badge-status ${p.status === 'published' ? 'badge-published' : 'badge-draft'}">${p.status === 'published' ? 'Xuất bản' : 'Bản nháp'}</span></td>
      <td>${p.views || 0}</td>
      <td style="font-size: 12px; color: #64748b;">${p.date}</td>
      <td>
        <div class="action-btn-group">
          <button class="table-btn table-btn-edit" onclick="openPostEditor('${p.id}')">Sửa bài</button>
          <button class="table-btn table-btn-delete" onclick="handleDeletePost('${p.id}')">Xóa</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openPostEditor(postId) {
  AdminApp.editingPostId = postId;
  const modal = document.getElementById("postEditorModal");
  const modalTitle = document.getElementById("postEditorModalTitle");

  if (postId) {
    const post = DataStore.getPostById(postId);
    if (!post) return;
    if (modalTitle) modalTitle.textContent = "Chỉnh Sửa Bài Viết (SEO Content)";

    document.getElementById("postTitleInput").value = post.title || "";
    document.getElementById("postSlugInput").value = post.slug || "";
    document.getElementById("postCategorySelect").value = post.category || "may-scan";
    document.getElementById("postPillarSelect").value = post.pillar || "Pillar P1";
    document.getElementById("postExcerptInput").value = post.excerpt || "";
    document.getElementById("postThumbnailInput").value = post.thumbnail || "";
    document.getElementById("postContentInput").value = post.content || "";
    document.getElementById("postStatusSelect").value = post.status || "published";

    document.getElementById("postSeoTitleInput").value = post.seoTitle || post.title || "";
    document.getElementById("postSeoDescInput").value = post.seoDesc || post.excerpt || "";
    document.getElementById("postFocusKeywordInput").value = post.focusKeyword || "";
  } else {
    if (modalTitle) modalTitle.textContent = "Tạo Bài Viết Mới Chuẩn SEO (Dành Cho Bạn Content)";
    document.getElementById("postTitleInput").value = "";
    document.getElementById("postSlugInput").value = "";
    document.getElementById("postCategorySelect").value = "giai-phap-chuyen-doi-so";
    document.getElementById("postPillarSelect").value = "Pillar P6";
    document.getElementById("postExcerptInput").value = "";
    document.getElementById("postThumbnailInput").value = "";
    document.getElementById("postContentInput").value = "";
    document.getElementById("postStatusSelect").value = "published";

    document.getElementById("postSeoTitleInput").value = "";
    document.getElementById("postSeoDescInput").value = "";
    document.getElementById("postFocusKeywordInput").value = "";
  }

  updateSerpPreview();
  if (modal) modal.classList.add("open");
}

function closePostEditor() {
  const modal = document.getElementById("postEditorModal");
  if (modal) modal.classList.remove("open");
  AdminApp.editingPostId = null;
}

function savePostFromEditor() {
  const title = document.getElementById("postTitleInput").value.trim();
  if (!title) {
    alert("Vui lòng nhập Tiêu đề bài viết!");
    return;
  }

  let slug = document.getElementById("postSlugInput").value.trim();
  if (!slug) slug = generateSlug(title);

  const postData = {
    id: AdminApp.editingPostId,
    title: title,
    slug: slug,
    category: document.getElementById("postCategorySelect").value,
    pillar: document.getElementById("postPillarSelect").value,
    excerpt: document.getElementById("postExcerptInput").value.trim(),
    thumbnail: document.getElementById("postThumbnailInput").value.trim() || "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600",
    content: document.getElementById("postContentInput").value,
    status: document.getElementById("postStatusSelect").value,
    seoTitle: document.getElementById("postSeoTitleInput").value.trim() || title,
    seoDesc: document.getElementById("postSeoDescInput").value.trim() || document.getElementById("postExcerptInput").value.trim(),
    focusKeyword: document.getElementById("postFocusKeywordInput").value.trim()
  };

  DataStore.savePost(postData);
  closePostEditor();
  renderPostsTable();
  renderDashboard();
  showToast("Đã lưu bài viết thành công!");
}

function handleDeletePost(postId) {
  if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
    DataStore.deletePost(postId);
    renderPostsTable();
    renderDashboard();
    showToast("Đã xóa bài viết thành công.");
  }
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function updateSerpPreview() {
  const title = document.getElementById("postSeoTitleInput")?.value || document.getElementById("postTitleInput")?.value || "Tiêu đề bài viết SEO";
  const desc = document.getElementById("postSeoDescInput")?.value || document.getElementById("postExcerptInput")?.value || "Mô tả bài viết hiển thị trên Google...";
  const slug = document.getElementById("postSlugInput")?.value || "duong-dan-bai-viet";

  const serpTitle = document.getElementById("serpTitlePreview");
  const serpDesc = document.getElementById("serpDescPreview");
  const serpUrl = document.getElementById("serpUrlPreview");

  if (serpTitle) serpTitle.textContent = title;
  if (serpDesc) serpDesc.textContent = desc;
  if (serpUrl) serpUrl.textContent = `https://thuanphat8.vn/${slug}`;

  const titleCountEl = document.getElementById("seoTitleCount");
  const descCountEl = document.getElementById("seoDescCount");

  if (titleCountEl) {
    const tLen = title.length;
    titleCountEl.textContent = `${tLen}/60 ký tự`;
    titleCountEl.className = `char-counter ${tLen >= 45 && tLen <= 65 ? "good" : "warn"}`;
  }

  if (descCountEl) {
    const dLen = desc.length;
    descCountEl.textContent = `${dLen}/160 ký tự`;
    descCountEl.className = `char-counter ${dLen >= 120 && dLen <= 165 ? "good" : "warn"}`;
  }
}

function insertFormatting(tag) {
  const textarea = document.getElementById("postContentInput");
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  let replacement = "";

  switch (tag) {
    case "h2": replacement = `<h2>${selectedText || "Tiêu đề mục"}</h2>\n`; break;
    case "h3": replacement = `<h3>${selectedText || "Tiêu đề phụ"}</h3>\n`; break;
    case "b": replacement = `<strong>${selectedText || "chữ in đậm"}</strong>`; break;
    case "i": replacement = `<em>${selectedText || "chữ in nghiêng"}</em>`; break;
    case "ul": replacement = `<ul>\n  <li>${selectedText || "Mục 1"}</li>\n  <li>Mục 2</li>\n</ul>\n`; break;
    case "quote": replacement = `<blockquote>${selectedText || "Trích dẫn quan trọng..."}</blockquote>\n`; break;
    case "img": replacement = `<img src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=700" alt="${selectedText || "Mô tả ảnh"}">\n`; break;
  }

  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  textarea.focus();
}

function getCategoryName(cat) {
  const map = {
    "may-scan": "Máy scan",
    "ha-tang-cntt": "Hạ tầng CNTT",
    "giai-phap-chuyen-doi-so": "Giải pháp CĐS",
    "phan-phoi-thiet-bi": "Phân phối thiết bị"
  };
  return map[cat] || cat;
}

// ============================================================
// 5. TRỢ LÝ AI VIẾT BÀI & TỐI ƯU HÓA (AI CONTENT ASSISTANT)
// ============================================================
function openAiAssistant(mode = "general") {
  const modal = document.getElementById("aiAssistantModal");
  if (modal) modal.classList.add("open");

  const promptInput = document.getElementById("aiCustomPromptInput");
  if (promptInput) {
    if (mode === "clean") {
      promptInput.value = "Làm sạch và định dạng nội dung bài viết thành các thẻ H2, H3, gạch đầu dòng và hộp ghi chú đẹp mắt.";
    } else if (mode === "seo") {
      promptInput.value = "Tối ưu hóa SEO On-Page, tự động tạo Tiêu đề SEO và Meta Description cuốn hút chuẩn Google.";
    } else if (mode === "outline") {
      promptInput.value = "Lập dàn ý bài viết mới chi tiết theo cấu trúc Pillar/Cluster của Sitemap.";
    }
  }
}

function closeAiAssistant() {
  const modal = document.getElementById("aiAssistantModal");
  if (modal) modal.classList.remove("open");
}

function triggerAiAction(actionType) {
  const currentTitle = document.getElementById("postTitleInput")?.value || "Giải pháp số hoá tài liệu";
  const currentContent = document.getElementById("postContentInput")?.value || "";
  const pillar = document.getElementById("postPillarSelect")?.value || "Pillar P6";

  const resultBox = document.getElementById("aiResultContent");
  const applyBtn = document.getElementById("btnApplyAiResult");

  if (!resultBox) return;

  resultBox.innerHTML = `<span style="color: #6366f1;">⏳ Trợ lý AI đang phân tích bài viết và định dạng theo chuẩn chuyên gia Thuận Phát...</span>`;

  setTimeout(() => {
    let result = "";

    if (actionType === "clean_format") {
      result = DataStore.ai.cleanAndFormatHtml(currentContent, currentTitle);
      resultBox.textContent = result;
      AdminApp.aiPendingResult = { type: "content", value: result };
      showToast("✨ AI đã làm sạch và định dạng bài viết thành công!");
    } else if (actionType === "seo_meta") {
      const seoData = DataStore.ai.generateSeoMetadata(currentTitle, currentContent);
      resultBox.innerHTML = `
        <strong>🎯 Tiêu đề SEO đề xuất:</strong><br>${seoData.seoTitle} (${seoData.seoTitle.length} ký tự)<br><br>
        <strong>📝 Meta Description đề xuất:</strong><br>${seoData.seoDesc} (${seoData.seoDesc.length} ký tự)<br><br>
        <strong>🔑 Từ khóa chính (Focus Keyword):</strong><br>${seoData.focusKeyword}
      `;
      AdminApp.aiPendingResult = { type: "seo", value: seoData };
      showToast("🎯 AI đã tạo bộ thẻ SEO On-Page tối ưu!");
    } else if (actionType === "outline") {
      result = DataStore.ai.generateArticleOutline(currentTitle, pillar);
      resultBox.textContent = result;
      AdminApp.aiPendingResult = { type: "content", value: result };
      showToast("📝 AI đã lập dàn ý theo cấu trúc Pillar/Cluster!");
    } else {
      // General rewrite
      result = DataStore.ai.cleanAndFormatHtml(currentContent, currentTitle);
      resultBox.textContent = result;
      AdminApp.aiPendingResult = { type: "content", value: result };
      showToast("💎 AI đã trau chuốt văn phong thành công!");
    }

    if (applyBtn) applyBtn.style.display = "inline-flex";
  }, 500);
}

function applyAiResultToEditor() {
  if (!AdminApp.aiPendingResult) return;

  if (AdminApp.aiPendingResult.type === "content") {
    const contentInput = document.getElementById("postContentInput");
    if (contentInput) {
      contentInput.value = AdminApp.aiPendingResult.value;
      showToast("Đã chèn nội dung AI vào bài viết!");
    }
  } else if (AdminApp.aiPendingResult.type === "seo") {
    const seoTitle = document.getElementById("postSeoTitleInput");
    const seoDesc = document.getElementById("postSeoDescInput");
    const keyword = document.getElementById("postFocusKeywordInput");

    if (seoTitle) seoTitle.value = AdminApp.aiPendingResult.value.seoTitle;
    if (seoDesc) seoDesc.value = AdminApp.aiPendingResult.value.seoDesc;
    if (keyword) keyword.value = AdminApp.aiPendingResult.value.focusKeyword;

    updateSerpPreview();
    showToast("Đã cập nhật các thẻ SEO On-Page!");
  }

  closeAiAssistant();
}

// ============================================================
// 6. PAGES MANAGEMENT (QUẢN LÝ TẤT CẢ TRANG TRONG SITEMAP)
// ============================================================
function renderPagesTable() {
  const pages = [
    { title: "Trang chủ", slug: "/", type: "Trang tĩnh chính", status: "Hoạt động", updated: "2026-03-16" },
    { title: "Máy scan chuyên dụng", slug: "/may-scan/", type: "Danh mục sản phẩm", status: "Hoạt động", updated: "2026-03-16" },
    { title: "Hạ tầng CNTT", slug: "/ha-tang-cntt/", type: "Danh mục dịch vụ", status: "Hoạt động", updated: "2026-03-16" },
    { title: "Giải pháp chuyển đổi số (P6)", slug: "/giai-phap-chuyen-doi-so/", type: "Danh mục trọng tâm", status: "Hoạt động", updated: "2026-03-16" },
    { title: "Số hoá tài liệu hành chính (P7)", slug: "/so-hoa-tai-lieu-hanh-chinh-cong/", type: "Landing Page Pillar", status: "Hoạt động", updated: "2026-03-16" },
    { title: "Đánh giá mức độ CĐS DTI", slug: "/danh-gia-muc-do-chuyen-doi-so/", type: "Bộ công cụ DTI", status: "Hoạt động", updated: "2026-03-16" },
    { title: "Giới thiệu Thuận Phát", slug: "/gioi-thieu", type: "Trang công ty", status: "Hoạt động", updated: "2026-03-16" },
    { title: "Liên hệ & Bản đồ trụ sở", slug: "/lien-he", type: "Trang liên hệ", status: "Hoạt động", updated: "2026-03-16" }
  ];

  const tbody = document.getElementById("pagesTableBody");
  if (!tbody) return;

  tbody.innerHTML = pages.map(page => `
    <tr>
      <td><strong>${page.title}</strong></td>
      <td><code>${page.slug}</code></td>
      <td><span style="font-size: 12px; background: #e2e8f0; padding: 3px 8px; border-radius: 4px;">${page.type}</span></td>
      <td><span class="badge-status badge-published">${page.status}</span></td>
      <td>${page.updated}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          <a href="builder.html" target="_blank" class="table-btn" style="background-color: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; font-weight: 600;">🎨 Sửa bằng Builder</a>
          <a href="index.html" target="_blank" class="table-btn table-btn-edit">Xem trang ↗</a>
        </div>
      </td>
    </tr>
  `).join("");
}

// ============================================================
// 7. PRODUCTS MANAGEMENT (SẢN PHẨM MÁY SCAN & SERVER)
// ============================================================
function renderProductsTable() {
  const prods = DataStore.getProducts();
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;

  tbody.innerHTML = prods.map(prod => `
    <tr>
      <td>
        <img src="${prod.image}" alt="${prod.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd;">
      </td>
      <td>
        <strong>${prod.name}</strong>
        <span style="display: block; font-size: 11.5px; color: #64748b;">Mã: ${prod.sku}</span>
      </td>
      <td><span style="font-size: 12px; font-weight: 600; color: #475569;">${prod.type}</span></td>
      <td>${prod.speed}</td>
      <td style="font-weight: 700; color: #c59b27;">${prod.price}</td>
      <td><span class="badge-status badge-published">Còn ${prod.stock} máy</span></td>
      <td>
        <div class="action-btn-group">
          <button class="table-btn table-btn-edit" onclick="openProductEditor('${prod.id}')">Sửa</button>
          <button class="table-btn table-btn-delete" onclick="handleDeleteProduct('${prod.id}')">Xóa</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openProductEditor(prodId) {
  AdminApp.editingProductId = prodId;
  const modal = document.getElementById("productEditorModal");
  if (prodId) {
    const p = DataStore.getProducts().find(item => item.id === prodId);
    if (!p) return;
    document.getElementById("prodNameInput").value = p.name || "";
    document.getElementById("prodSkuInput").value = p.sku || "";
    document.getElementById("prodTypeInput").value = p.type || "";
    document.getElementById("prodSpeedInput").value = p.speed || "";
    document.getElementById("prodPriceInput").value = p.price || "";
    document.getElementById("prodStockInput").value = p.stock || 10;
  } else {
    document.getElementById("prodNameInput").value = "";
    document.getElementById("prodSkuInput").value = "";
    document.getElementById("prodTypeInput").value = "";
    document.getElementById("prodSpeedInput").value = "";
    document.getElementById("prodPriceInput").value = "";
    document.getElementById("prodStockInput").value = 10;
  }
  if (modal) modal.classList.add("open");
}

function closeProductEditor() {
  const modal = document.getElementById("productEditorModal");
  if (modal) modal.classList.remove("open");
  AdminApp.editingProductId = null;
}

function saveProductFromEditor() {
  const name = document.getElementById("prodNameInput").value.trim();
  if (!name) {
    alert("Vui lòng nhập tên sản phẩm!");
    return;
  }

  const prodData = {
    id: AdminApp.editingProductId,
    name: name,
    sku: document.getElementById("prodSkuInput").value.trim() || "SP-" + Date.now(),
    type: document.getElementById("prodTypeInput").value.trim() || "Thiết bị chính hãng",
    speed: document.getElementById("prodSpeedInput").value.trim() || "Chuẩn hãng",
    price: document.getElementById("prodPriceInput").value.trim() || "Liên hệ",
    stock: parseInt(document.getElementById("prodStockInput").value) || 5,
    category: "may-scan",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400"
  };

  DataStore.saveProduct(prodData);
  closeProductEditor();
  renderProductsTable();
  renderDashboard();
  showToast("Đã lưu thông tin sản phẩm thành công!");
}

function handleDeleteProduct(prodId) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    DataStore.deleteProduct(prodId);
    renderProductsTable();
    renderDashboard();
    showToast("Đã xóa sản phẩm.");
  }
}

// ============================================================
// 8. UTILITIES (TIỆN ÍCH, SITEMAP & 301 REDIRECTS)
// ============================================================
function renderUtilities() {
  const sitemapContainer = document.getElementById("sitemapPillarsViewer");
  if (!sitemapContainer) return;

  const sitemapItems = [
    { code: "Pillar P1", name: "Cẩm nang chọn mua máy scan văn phòng & DN", url: "/may-scan-tai-lieu-la-gi-cam-nang-chon-mua...", redirect: "301 từ 2 URL cũ" },
    { code: "Pillar P2", name: "So sánh Ricoh fi-7000 vs fi-8000 series", url: "/so-sanh-may-scan-ricoh-fi-7000-vs-fi-8000...", redirect: "Mới" },
    { code: "Pillar P3", name: "Giải pháp máy scan ADF tốc độ cao", url: "/giai-phap-may-scan-toc-do-cao-2-mat-tu-dong-adf", redirect: "Mới" },
    { code: "Pillar P4", name: "Giải pháp hạ tầng CNTT trọn gói cho SME", url: "/giai-phap-ha-tang-cntt-tron-goi-cho-doanh-nghiep", redirect: "Mới" },
    { code: "Pillar P5", name: "Hạ tầng CNTT hành chính công & cơ sở y tế", url: "/ha-tang-cntt-cho-hanh-chinh-cong-va-co-so-y-te", redirect: "Mới" },
    { code: "Pillar P6", name: "Giải pháp chuyển đổi số toàn diện", url: "/giai-phap-chuyen-doi-so/", redirect: "Trang danh mục gốc" },
    { code: "Pillar P7", name: "Số hoá hồ sơ tài liệu hành chính công", url: "/so-hoa-tai-lieu-hanh-chinh-cong/", redirect: "Pillar CĐS trọng tâm" }
  ];

  sitemapContainer.innerHTML = sitemapItems.map(item => `
    <div style="background: #ffffff; border: 1px solid var(--admin-border); border-radius: 8px; padding: 14px 18px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="font-size: 11px; font-weight: 700; background: var(--admin-gold-bg); color: var(--admin-gold); padding: 2px 6px; border-radius: 4px;">${item.code}</span>
        <strong style="font-size: 14px; margin-left: 8px; color: #1e293b;">${item.name}</strong>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">URL: <code>${item.url}</code></div>
      </div>
      <span style="font-size: 12px; font-weight: 600; color: #1860aa; background: #edf5fe; padding: 4px 10px; border-radius: 4px;">${item.redirect}</span>
    </div>
  `).join("");
}

// ============================================================
// 9. MEDIA LIBRARY (THƯ VIỆN HÌNH ẢNH)
// ============================================================
function renderMediaLibrary() {
  const mediaList = DataStore.getMedia();
  const grid = document.getElementById("mediaLibraryGrid");
  if (!grid) return;

  grid.innerHTML = mediaList.map(item => `
    <div style="background: #ffffff; border: 1px solid var(--admin-border); border-radius: 8px; overflow: hidden;">
      <div style="height: 120px; background: #eee;">
        <img src="${item.url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div style="padding: 10px 12px;">
        <strong style="font-size: 12.5px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</strong>
        <span style="font-size: 11.5px; color: #94a3b8;">${item.size} · ${item.date}</span>
      </div>
    </div>
  `).join("");
}

function handleAddMediaPrompt() {
  const url = prompt("Nhập URL hình ảnh bạn muốn thêm vào thư viện Media:", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600");
  if (url) {
    const name = prompt("Nhập tên tệp hình ảnh:", "hinh-anh-moi.jpg");
    DataStore.addMedia({
      name: name || "hinh-anh.jpg",
      size: "210 KB",
      url: url
    });
    renderMediaLibrary();
    showToast("Đã thêm hình ảnh vào thư viện!");
  }
}

// ============================================================
// 10. THEME & SETTINGS
// ============================================================
function loadThemeSettings() {
  const settings = DataStore.getSettings();
  document.getElementById("settingHeroTitle").value = settings.heroTitle || "";
  document.getElementById("settingHeroDesc").value = settings.heroDesc || "";
  document.getElementById("settingPartnerBadge").value = settings.partnerBadge || "";
  document.getElementById("settingHotline").value = settings.hotline || "";
  document.getElementById("settingEmail").value = settings.email || "";

  if (settings.stats) {
    document.getElementById("settingStatClients").value = settings.stats.clients || "500+";
    document.getElementById("settingStatExp").value = settings.stats.experience || "12+ Năm";
    document.getElementById("settingStatSat").value = settings.stats.satisfaction || "98%";
    document.getElementById("settingStatSupport").value = settings.stats.support || "24/7";
  }
}

function saveThemeSettingsForm() {
  const newSettings = {
    heroTitle: document.getElementById("settingHeroTitle").value.trim(),
    heroDesc: document.getElementById("settingHeroDesc").value.trim(),
    partnerBadge: document.getElementById("settingPartnerBadge").value.trim(),
    hotline: document.getElementById("settingHotline").value.trim(),
    email: document.getElementById("settingEmail").value.trim(),
    stats: {
      clients: document.getElementById("settingStatClients").value.trim(),
      experience: document.getElementById("settingStatExp").value.trim(),
      satisfaction: document.getElementById("settingStatSat").value.trim(),
      support: document.getElementById("settingStatSupport").value.trim()
    }
  };

  DataStore.saveSettings(newSettings);
  showToast("Đã lưu cấu hình giao diện thành công!");
}

function loadSystemSettings() {
  const settings = DataStore.getSettings();
  const apiKeyInput = document.getElementById("settingGeminiKey");
  if (apiKeyInput) {
    apiKeyInput.value = settings.geminiApiKey || "";
  }
}

function saveSystemSettings() {
  const settings = DataStore.getSettings();
  const apiKeyInput = document.getElementById("settingGeminiKey");
  if (apiKeyInput) {
    settings.geminiApiKey = apiKeyInput.value.trim();
    DataStore.saveSettings(settings);
    showToast("Đã lưu cài đặt và kết nối Gemini AI thành công!");
  }
}

// ============================================================
// 11. LEADS CRM
// ============================================================
function renderLeadsTable() {
  const leads = DataStore.getLeads();
  const filterStatus = document.getElementById("leadsFilterStatus")?.value || "all";

  const filtered = leads.filter(l => filterStatus === "all" || l.status === filterStatus);

  const tbody = document.getElementById("leadsTableBody");
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #888; padding: 30px;">Chưa có yêu cầu tư vấn nào phù hợp.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(l => `
    <tr>
      <td><strong>${l.refCode}</strong></td>
      <td><strong>${l.fullname}</strong></td>
      <td><a href="tel:${l.phone}" style="color: #6366f1; font-weight: 600;">📞 ${l.phone}</a></td>
      <td>${l.email || 'N/A'}</td>
      <td>${l.organization}</td>
      <td style="font-size: 12.5px;">${formatVolumeText(l.documentVolume)}</td>
      <td>
        <select class="filter-select" style="padding: 4px 8px; font-size: 12px;" onchange="handleLeadStatusChange('${l.id}', this.value)">
          <option value="new" ${l.status === 'new' ? 'selected' : ''}>Mới tiếp nhận</option>
          <option value="contacted" ${l.status === 'contacted' ? 'selected' : ''}>Đang tư vấn</option>
          <option value="survey_done" ${l.status === 'survey_done' ? 'selected' : ''}>Đã khảo sát</option>
          <option value="completed" ${l.status === 'completed' ? 'selected' : ''}>Thành công</option>
        </select>
      </td>
      <td style="font-size: 12px; color: #64748b;">${l.date}</td>
    </tr>
  `).join("");
}

function handleLeadStatusChange(leadId, newStatus) {
  DataStore.updateLeadStatus(leadId, newStatus);
  showToast("Đã cập nhật trạng thái khách hàng!");
  renderDashboard();
}

function exportLeadsToCsv() {
  const leads = DataStore.getLeads();
  let csv = "Mã hồ sơ,Họ tên,Số điện thoại,Email,Cơ quan / Doanh nghiệp,Khối lượng tài liệu,Ghi chú,Trạng thái,Ngày tạo\n";
  leads.forEach(l => {
    csv += `"${l.refCode}","${l.fullname}","${l.phone}","${l.email || ''}","${l.organization}","${l.documentVolume || ''}","${(l.notes || '').replace(/"/g, '""')}","${getLeadStatusText(l.status)}","${l.date}"\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Danh_Sach_Khach_Hang_ThuanPhat_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Đã xuất tệp CSV danh bạ khách hàng thành công!");
}

function getLeadStatusText(status) {
  const map = {
    new: "Mới tiếp nhận",
    contacted: "Đang tư vấn",
    survey_done: "Đã khảo sát",
    completed: "Thành công"
  };
  return map[status] || status;
}

function formatVolumeText(vol) {
  const map = {
    under_10k: "< 10.000 trang",
    "10k_50k": "10.000 - 50.000",
    "50k_200k": "50.000 - 200.000",
    over_200k: "> 200.000 trang"
  };
  return map[vol] || vol || "Chưa chọn";
}

// ============================================================
// 12. TOAST NOTIFICATIONS
// ============================================================
function showToast(message) {
  let toast = document.getElementById("adminToastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "adminToastNotification";
    toast.className = "admin-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ============================================================
// 13. DOM READY INITIALIZER
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Navigation parent click
  document.querySelectorAll(".nav-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      const parentWrap = btn.closest(".nav-parent-wrap");
      if (parentWrap && parentWrap.querySelector(".nav-submenu")) {
        parentWrap.classList.toggle("expanded");
      }
      switchAdminTab(tab);
    });
  });

  // Navigation sub-items click
  document.querySelectorAll(".nav-sub-item").forEach(subBtn => {
    subBtn.addEventListener("click", e => {
      e.stopPropagation();
      const parentTab = subBtn.dataset.parent;
      const subTab = subBtn.dataset.sub;
      if (subTab === "posts-new") {
        switchAdminTab("posts");
        openPostEditor(null);
      } else if (subTab === "posts-ai" || subTab === "util-ai") {
        switchAdminTab("posts");
        openAiAssistant("general");
      } else if (subTab === "products-new") {
        switchAdminTab("products");
        openProductEditor(null);
      } else {
        switchAdminTab(parentTab, subTab);
      }
    });
  });

  // Live SERP & Slug listener
  const titleInput = document.getElementById("postTitleInput");
  if (titleInput) {
    titleInput.addEventListener("input", () => {
      const slugInput = document.getElementById("postSlugInput");
      if (slugInput && !AdminApp.editingPostId) {
        slugInput.value = generateSlug(titleInput.value);
      }
      updateSerpPreview();
    });
  }

  const seoTitleInput = document.getElementById("postSeoTitleInput");
  const seoDescInput = document.getElementById("postSeoDescInput");
  const slugInput = document.getElementById("postSlugInput");
  if (seoTitleInput) seoTitleInput.addEventListener("input", updateSerpPreview);
  if (seoDescInput) seoDescInput.addEventListener("input", updateSerpPreview);
  if (slugInput) slugInput.addEventListener("input", updateSerpPreview);

  // Search & Filters in Posts Table
  const postSearch = document.getElementById("postSearchInput");
  const postFilter = document.getElementById("postCategoryFilter");
  if (postSearch) postSearch.addEventListener("input", renderPostsTable);
  if (postFilter) postFilter.addEventListener("change", renderPostsTable);

  const leadsFilter = document.getElementById("leadsFilterStatus");
  if (leadsFilter) leadsFilter.addEventListener("change", renderLeadsTable);

  // Default to Dashboard view
  switchAdminTab("dashboard");
});

// ============================================================
// 14. SETTINGS DETAILS MODAL CONTROLLER (13 MỤC CÀI ĐẶT)
// ============================================================
const SettingsConfigs = {
  "doc": {
    title: "Cấu Hình Đọc & Hiển Thị SEO",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Số bài viết hiển thị trên mỗi trang danh mục</label>
        <input type="number" id="cfgPostsPerPage" class="admin-input" value="10">
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Tùy chọn hiển thị nội dung</label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155; margin-bottom: 8px;">
          <input type="checkbox" id="cfgFullContent"> Hiển thị toàn văn bài viết thay vì đoạn tóm tắt
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155;">
          <input type="checkbox" id="cfgSearchIndexing" checked> Khuyến khích các công cụ tìm kiếm (Google) lập chỉ mục website này
        </label>
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Tự động ping XML Sitemap khi có bài viết mới</label>
        <select class="admin-select">
          <option value="enabled" selected>Bật (Gửi tín hiệu đến Google Search Console)</option>
          <option value="disabled">Tắt</option>
        </select>
      </div>
    `
  },
  "duong-dan": {
    title: "Cấu Hình Đường Dẫn Tĩnh (Permalinks)",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Cấu trúc đường dẫn URL</label>
        <select class="admin-select" id="cfgUrlStructure">
          <option value="pillar-cluster" selected>Chuẩn SEO 3 Cấp (Khuyên dùng): thuanphat8.vn/%category%/%postname%</option>
          <option value="plain">Cơ bản: thuanphat8.vn/?p=123</option>
          <option value="numeric">Theo số: thuanphat8.vn/archives/123</option>
        </select>
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Quy tắc tự động chuyển hướng 301</label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155;">
          <input type="checkbox" checked> Tự động duy trì 301-redirect từ các link máy scan cũ theo kế hoạch SEO
        </label>
      </div>
    `
  },
  "bai-viet": {
    title: "Cấu Hình Đăng Bài Viết",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Chuyên mục mặc định khi tạo mới</label>
        <select class="admin-select">
          <option value="giai-phap-chuyen-doi-so" selected>Giải pháp chuyển đổi số</option>
          <option value="may-scan">Máy scan</option>
          <option value="ha-tang-cntt">Hạ tầng CNTT</option>
        </select>
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Trạng thái xuất bản mặc định</label>
        <select class="admin-select">
          <option value="published" selected>Xuất bản ngay</option>
          <option value="draft">Lưu nháp</option>
        </select>
      </div>
    `
  },
  "bieu-mau": {
    title: "Cấu Hình Biểu Mẫu & Tiếp Nhận Khách Hàng",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Email tiếp nhận thông báo Leads mới</label>
        <input type="email" id="cfgLeadEmail" class="admin-input" value="contact@thuanphat8.vn">
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Số Hotline nhận tin nhắn tư vấn gấp</label>
        <input type="text" id="cfgLeadHotline" class="admin-input" value="0901 234 567">
      </div>
    `
  },
  "nhung": {
    title: "Cấu Hình Mã Nhúng Header & Body",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Google Analytics 4 (GA4 Measurement ID)</label>
        <input type="text" id="cfgGa4" class="admin-input" placeholder="G-XXXXXXXXXX" value="G-THUANPHAT2026">
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Mã theo dõi Google Tag Manager (GTM)</label>
        <input type="text" id="cfgGtm" class="admin-input" placeholder="GTM-XXXXXXX">
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Facebook Pixel ID</label>
        <input type="text" id="cfgFbPixel" class="admin-input" placeholder="1234567890">
      </div>
    `
  },
  "tien-te": {
    title: "Cấu Hình Định Dạng Tiền Tệ",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Đơn vị tiền tệ chính</label>
        <select class="admin-select" id="cfgCurrency">
          <option value="VND" selected>Việt Nam Đồng (đ / VNĐ)</option>
          <option value="USD">Đô la Mỹ ($)</option>
        </select>
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Vị trí ký hiệu tiền tệ</label>
        <select class="admin-select">
          <option value="after" selected>Sau số tiền (Ví dụ: 24.500.000 đ)</option>
          <option value="before">Trước số tiền (Ví dụ: đ 24.500.000)</option>
        </select>
      </div>
    `
  },
  "muc-luc": {
    title: "Cấu Hình Hiển Thị Mục Lục (Table of Contents)",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Tự động sinh mục lục</label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155;">
          <input type="checkbox" id="cfgAutoToc" checked> Tự động quét các thẻ H2, H3 trong bài viết để dựng mục lục
        </label>
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Tiêu đề khối mục lục</label>
        <input type="text" class="admin-input" value="Mục Lục Nội Dung Bài Viết">
      </div>
    `
  },
  "cta": {
    title: "Cấu Hình Nút Kêu Gọi Hành Động (CTA)",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Văn bản hiển thị trên nút CTA chính</label>
        <input type="text" id="cfgCtaText" class="admin-input" value="YÊU CẦU KHẢO SÁT & BÁO GIÁ">
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Đường dẫn khi click nút</label>
        <input type="text" class="admin-input" value="#contact">
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Link Zalo Official Account (OA)</label>
        <input type="text" class="admin-input" value="https://zalo.me/thuanphat">
      </div>
    `
  },
  "ngon-ngu": {
    title: "Cấu Hình Ngôn Ngữ & Múi Giờ Hệ Thống",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Ngôn ngữ mặc định</label>
        <select class="admin-select">
          <option value="vi" selected>Tiếng Việt (vi_VN)</option>
          <option value="en">English (en_US)</option>
        </select>
      </div>
      <div class="admin-form-group">
        <label class="admin-label">Múi giờ hệ thống</label>
        <select class="admin-select">
          <option value="Asia/Ho_Chi_Minh" selected>Asia/Ho_Chi_Minh (UTC+07:00)</option>
        </select>
      </div>
    `
  },
  "dich-thuat": {
    title: "Cấu Hình Dịch Thuật Nội Dung Đa Ngôn Ngữ",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Dịch tự động qua Trợ Lý AI</label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155;">
          <input type="checkbox" checked> Tự động tạo bản dịch Tiếng Anh cho các bài viết Pillar quan trọng
        </label>
      </div>
    `
  },
  "san-pham-hien-thi": {
    title: "Cấu Hình Nội Dung Hiển Thị Sản Phẩm",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Chế độ hiển thị giá máy scan</label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155; margin-bottom: 8px;">
          <input type="checkbox" checked> Hiển thị giá niêm yết công khai
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155;">
          <input type="checkbox" checked> Hiển thị huy hiệu tình trạng còn hàng (Stock Status)
        </label>
      </div>
    `
  },
  "san-pham-nang-cao": {
    title: "Cài Đặt Nâng Cao Sản Phẩm",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Thứ tự sắp xếp sản phẩm</label>
        <select class="admin-select">
          <option value="featured" selected>Sản phẩm nổi bật / Mới nhất trước</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
        </select>
      </div>
    `
  },
  "dia-diem-nhap": {
    title: "Nhập Hàng Loạt Địa Điểm & Chi Nhánh",
    html: `
      <div class="admin-form-group">
        <label class="admin-label">Chọn tệp Excel / CSV danh sách chi nhánh</label>
        <input type="file" class="admin-input" accept=".xlsx, .csv">
        <span style="font-size: 12px; color: #64748b; margin-top: 6px; display: block;">
          Hỗ trợ định dạng Excel (.xlsx, .xls) hoặc tệp CSV ngăn cách bởi dấu phẩy.
        </span>
      </div>
      <div style="margin-top: 10px;">
        <button type="button" class="table-btn table-btn-edit" onclick="showToast('Đã tải xuống file mẫu Excel!')">
          📥 Tải tệp mẫu Excel mẫu (.xlsx)
        </button>
      </div>
    `
  }
};

function openSettingDetail(key) {
  const config = SettingsConfigs[key];
  if (!config) return;

  const modal = document.getElementById("settingsDetailModal");
  const titleEl = document.getElementById("settingsDetailTitle");
  const bodyEl = document.getElementById("settingsDetailBody");

  if (titleEl) titleEl.textContent = config.title;
  if (bodyEl) bodyEl.innerHTML = config.html;
  if (modal) modal.classList.add("open");
}

function closeSettingDetail() {
  const modal = document.getElementById("settingsDetailModal");
  if (modal) modal.classList.remove("open");
}

function saveSettingDetail() {
  closeSettingDetail();
  showToast("💾 Đã lưu cấu hình cài đặt thành công!");
}

function toggleSidebarCollapse() {
  const sidebar = document.querySelector(".admin-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("collapsed");
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// ============================================================
// 15. USER PROFILE & AUTHENTICATION CONTROLLER (V2 RBAC)
// ============================================================
function initAdminAuthUI() {
  if (typeof DataStore === "undefined" || !DataStore.auth) return;
  const user = DataStore.auth.getCurrentUser();
  if (!user) return;

  const displayName = user.displayName || "Long Nguyen";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  const isSuper = user.role === "super_admin";
  const roleTitle = user.roleTitle || (isSuper ? "👑 Admin Tổng" : "🛡️ Admin Phụ");

  // Topbar elements
  const topbarName = document.getElementById("topbarUserName");
  const topbarAvatar = document.getElementById("topbarUserAvatar");
  if (topbarName) {
    topbarName.innerHTML = `<span>${displayName}</span> <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: ${isSuper ? '#fef3c7; color: #b45309;' : '#eff6ff; color: #1d4ed8;'} font-weight: 700;">${isSuper ? 'Admin Tổng' : 'Admin Phụ'}</span>`;
  }
  if (topbarAvatar) {
    topbarAvatar.textContent = initials;
    topbarAvatar.style.background = isSuper 
      ? "linear-gradient(135deg, #f59e0b, #d97706)" 
      : "linear-gradient(135deg, #3b82f6, #1d4ed8)";
    topbarAvatar.style.color = "#ffffff";
  }

  // Dropdown elements
  const dropName = document.getElementById("dropdownUserName");
  const dropRole = document.getElementById("dropdownUserRole");
  const dropEmail = document.getElementById("dropdownUserEmail");
  const dropAvatar = document.getElementById("dropdownUserAvatar");

  if (dropName) dropName.textContent = displayName;
  if (dropRole) dropRole.textContent = roleTitle;
  if (dropEmail) dropEmail.textContent = user.email || `${user.username}@thuanphat8.vn`;
  if (dropAvatar) {
    dropAvatar.textContent = initials;
    dropAvatar.style.background = isSuper 
      ? "linear-gradient(135deg, #f59e0b, #d97706)" 
      : "linear-gradient(135deg, #3b82f6, #1d4ed8)";
    dropAvatar.style.color = "#ffffff";
  }

  // Enforce RBAC on Sub Admin UI
  if (!isSuper) {
    const dangerZone = document.getElementById("superAdminDangerZone");
    if (dangerZone) dangerZone.style.display = "none";

    const btnResetFactory = document.getElementById("btnResetFactoryAction");
    if (btnResetFactory) btnResetFactory.style.display = "none";

    const btnImportDb = document.getElementById("btnImportDbAction");
    if (btnImportDb) {
      btnImportDb.disabled = true;
      btnImportDb.style.opacity = "0.5";
      btnImportDb.title = "Chỉ Admin Tổng mới có quyền phục hồi Database";
    }

    const btnAddAdmin = document.getElementById("btnAddNewAdmin");
    if (btnAddAdmin) {
      btnAddAdmin.disabled = true;
      btnAddAdmin.style.opacity = "0.5";
      btnAddAdmin.title = "Chỉ Admin Tổng mới có quyền thêm Quản trị viên";
    }
  }
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById("userProfileDropdown");
  const btn = document.getElementById("adminUserProfileBtn");
  if (!dropdown) return;

  const isOpen = dropdown.classList.contains("open");
  if (isOpen) {
    dropdown.classList.remove("open");
    if (btn) btn.classList.remove("active");
  } else {
    dropdown.classList.add("open");
    if (btn) btn.classList.add("active");
  }
}

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("userProfileDropdown");
  const wrapper = document.querySelector(".user-profile-wrapper");
  if (dropdown && dropdown.classList.contains("open")) {
    if (!wrapper || !wrapper.contains(e.target)) {
      dropdown.classList.remove("open");
      const btn = document.getElementById("adminUserProfileBtn");
      if (btn) btn.classList.remove("active");
    }
  }
});

function handleAdminLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị Thuận Phát?")) {
    if (typeof DataStore !== "undefined" && DataStore.auth) {
      DataStore.auth.logout();
    }
    showToast("🚪 Đã đăng xuất! Đang chuyển hướng...");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
  }
}

// ============================================================
// 16. USER ACCOUNTS & RBAC MANAGEMENT CONTROLLER
// ============================================================
let editingAdminUserId = null;

function switchUsersSubTab(subTabId, btnEl) {
  const buttons = document.querySelectorAll(".users-subtab-btn");
  buttons.forEach(b => b.classList.remove("active"));
  if (btnEl) {
    btnEl.classList.add("active");
  } else {
    const targetBtn = Array.from(buttons).find(b => b.getAttribute("onclick")?.includes(subTabId));
    if (targetBtn) targetBtn.classList.add("active");
  }

  const viewList = document.getElementById("usersSubViewList");
  const viewDb = document.getElementById("usersSubViewDatabase");
  const viewLogs = document.getElementById("usersSubViewAuditLogs");

  if (viewList) viewList.style.display = (subTabId === "users-list") ? "block" : "none";
  if (viewDb) viewDb.style.display = (subTabId === "db-center") ? "block" : "none";
  if (viewLogs) viewLogs.style.display = (subTabId === "audit-logs") ? "block" : "none";

  if (subTabId === "users-list") renderAdminUsersTable();
  else if (subTabId === "db-center") renderDatabaseStats();
  else if (subTabId === "audit-logs") renderAuditLogs();
}

function renderAdminUsersTable() {
  if (typeof DataStore === "undefined" || !DataStore.users) return;
  const tbody = document.getElementById("adminUsersTableBody");
  if (!tbody) return;

  const users = DataStore.users.getAll();
  const superCount = users.filter(u => u.role === "super_admin").length;
  const subCount = users.filter(u => u.role === "sub_admin").length;

  const superEl = document.getElementById("statSuperAdminCount");
  const subEl = document.getElementById("statSubAdminCount");
  if (superEl) superEl.textContent = superCount;
  if (subEl) subEl.textContent = subCount;

  const currentUser = DataStore.auth.getCurrentUser();
  const isCurrentSuper = currentUser && currentUser.role === "super_admin";

  const permLabels = {
    posts: "✍️ Bài viết",
    products: "🖨️ Sản phẩm",
    leads: "📞 CRM Leads",
    pages: "📄 Sửa trang",
    builder: "🎨 Page Builder",
    media: "🖼️ Media",
    utilities: "✨ Tiện ích AI"
  };

  tbody.innerHTML = users.map(u => {
    const isSuper = u.role === "super_admin";
    const initials = (u.displayName || u.username)
      .split(" ")
      .filter(Boolean)
      .map(w => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

    let permBadges = "";
    if (isSuper || (u.permissions && u.permissions.includes("*"))) {
      permBadges = `<span class="perm-tag perm-all">⚡ Toàn quyền hệ thống (*)</span>`;
    } else if (Array.isArray(u.permissions) && u.permissions.length > 0) {
      permBadges = u.permissions.map(p => `
        <span class="perm-tag">
          ${permLabels[p] || p}
        </span>
      `).join(" ");
    } else {
      permBadges = `<span class="perm-tag" style="background:#f1f5f9;color:#94a3b8;">Chưa cấp quyền</span>`;
    }

    const isRoot = u.id === "user-super-1" || u.username === "admin";
    
    let deleteBtnHtml = "";
    if (isRoot) {
      deleteBtnHtml = `<button type="button" class="table-btn table-btn-delete" disabled style="opacity: 0.45; cursor: not-allowed;" title="Tài khoản Admin Tổng gốc không thể xóa">🔒 Khóa</button>`;
    } else if (!isCurrentSuper) {
      deleteBtnHtml = `<button type="button" class="table-btn table-btn-delete" disabled style="opacity: 0.45; cursor: not-allowed;" title="Chỉ Admin Tổng mới được xóa tài khoản">🚫 Giới hạn</button>`;
    } else {
      deleteBtnHtml = `<button type="button" class="table-btn table-btn-delete" onclick="deleteAdminUser('${u.id}', '${u.displayName || u.username}')">🗑️ Xóa</button>`;
    }

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${isSuper ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              ${initials}
            </div>
            <div>
              <strong style="color: #0f172a; font-size: 13.5px;">${u.displayName}</strong>
              ${u.id === currentUser?.id ? '<span style="font-size: 10.5px; background: #e0e7ff; color: #4338ca; padding: 1px 5px; border-radius: 4px; margin-left: 4px; font-weight: 700;">Bạn</span>' : ''}
            </div>
          </div>
        </td>
        <td>
          <div><strong>@${u.username}</strong></div>
          <div style="font-size: 12px; color: #64748b;">${u.email || 'Chưa cập nhật'}</div>
        </td>
        <td>
          <span style="font-size: 12.5px; color: #475569;">${u.department || 'Ban Quản Trị'}</span>
        </td>
        <td>
          ${isSuper 
            ? '<span class="role-badge role-badge-super">👑 Admin Tổng</span>' 
            : '<span class="role-badge role-badge-sub">🛡️ Admin Phụ</span>'}
        </td>
        <td>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; max-width: 320px;">
            ${permBadges}
          </div>
        </td>
        <td style="font-size: 12px; color: #64748b;">
          ${u.createdAt || "16/09/2026"}
        </td>
        <td style="text-align: right;">
          <div class="action-btn-group" style="justify-content: flex-end;">
            <button type="button" class="table-btn table-btn-edit" onclick="openAdminUserModal('${u.id}')" title="Chỉnh sửa thông tin và quyền hạn">✏️ Sửa</button>
            ${deleteBtnHtml}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function openAdminUserModal(userId) {
  editingAdminUserId = userId;
  const modal = document.getElementById("adminUserModal");
  if (!modal) return;

  const modalTitle = document.getElementById("adminUserModalTitle");
  const modalIcon = document.getElementById("adminUserModalIcon");
  const editIdInput = document.getElementById("editUserId");
  const displayNameInput = document.getElementById("userDisplayNameInput");
  const departmentInput = document.getElementById("userDepartmentInput");
  const usernameInput = document.getElementById("userUsernameInput");
  const passwordInput = document.getElementById("userPasswordInput");
  const emailInput = document.getElementById("userEmailInput");
  const radioSuper = document.getElementById("roleRadioSuper");
  const radioSub = document.getElementById("roleRadioSub");

  if (userId) {
    const user = DataStore.users.getById(userId);
    if (!user) return;

    if (modalTitle) modalTitle.textContent = "Chỉnh Sửa Quản Trị Viên";
    if (modalIcon) modalIcon.textContent = "✏️";
    if (editIdInput) editIdInput.value = user.id;
    if (displayNameInput) displayNameInput.value = user.displayName || "";
    if (departmentInput) departmentInput.value = user.department || "";
    if (usernameInput) {
      usernameInput.value = user.username || "";
      usernameInput.readOnly = (user.id === "user-super-1" || user.username === "admin");
    }
    if (passwordInput) passwordInput.value = user.password || "";
    if (emailInput) emailInput.value = user.email || "";

    if (user.role === "super_admin") {
      if (radioSuper) radioSuper.checked = true;
    } else {
      if (radioSub) radioSub.checked = true;
    }

    const userPerms = Array.isArray(user.permissions) ? user.permissions : [];
    document.querySelectorAll(".user-perm-check").forEach(cb => {
      cb.checked = userPerms.includes(cb.value);
    });

  } else {
    if (modalTitle) modalTitle.textContent = "Thêm Quản Trị Viên Mới";
    if (modalIcon) modalIcon.textContent = "➕";
    if (editIdInput) editIdInput.value = "";
    if (displayNameInput) displayNameInput.value = "";
    if (departmentInput) departmentInput.value = "";
    if (usernameInput) {
      usernameInput.value = "";
      usernameInput.readOnly = false;
    }
    if (passwordInput) passwordInput.value = "";
    if (emailInput) emailInput.value = "";

    if (radioSub) radioSub.checked = true;

    document.querySelectorAll(".user-perm-check").forEach(cb => {
      cb.checked = ["posts", "products", "leads"].includes(cb.value);
    });
  }

  togglePermissionCheckboxes();
  modal.classList.add("open");
}

function closeAdminUserModal() {
  const modal = document.getElementById("adminUserModal");
  if (modal) modal.classList.remove("open");
  editingAdminUserId = null;
}

function togglePermissionCheckboxes() {
  const isSuper = document.getElementById("roleRadioSuper")?.checked;
  const permBox = document.getElementById("subAdminPermissionsBox");
  if (permBox) {
    if (isSuper) {
      permBox.style.opacity = "0.35";
      permBox.style.pointerEvents = "none";
    } else {
      permBox.style.opacity = "1";
      permBox.style.pointerEvents = "auto";
    }
  }
}

function saveAdminUserFromModal() {
  const displayName = document.getElementById("userDisplayNameInput")?.value.trim();
  const username = document.getElementById("userUsernameInput")?.value.trim().toLowerCase();
  const password = document.getElementById("userPasswordInput")?.value.trim();
  const department = document.getElementById("userDepartmentInput")?.value.trim() || "Ban Quản Trị";
  const email = document.getElementById("userEmailInput")?.value.trim();
  const isSuper = document.getElementById("roleRadioSuper")?.checked;

  if (!displayName) {
    alert("Vui lòng nhập Họ và tên hiển thị!");
    document.getElementById("userDisplayNameInput")?.focus();
    return;
  }
  if (!username) {
    alert("Vui lòng nhập Tên đăng nhập (username)!");
    document.getElementById("userUsernameInput")?.focus();
    return;
  }
  if (!password) {
    alert("Vui lòng nhập Mật khẩu cho tài khoản!");
    document.getElementById("userPasswordInput")?.focus();
    return;
  }

  const role = isSuper ? "super_admin" : "sub_admin";
  const roleTitle = isSuper ? "👑 Admin Tổng" : "🛡️ Admin Phụ";

  let permissions = [];
  if (isSuper) {
    permissions = ["*"];
  } else {
    document.querySelectorAll(".user-perm-check:checked").forEach(cb => {
      permissions.push(cb.value);
    });
  }

  const userData = {
    id: editingAdminUserId || null,
    username,
    password,
    displayName,
    department,
    email: email || `${username}@thuanphat8.vn`,
    role,
    roleTitle,
    permissions
  };

  const result = DataStore.users.save(userData);
  if (result.success) {
    showToast(`✅ Đã lưu tài khoản ${displayName} (${roleTitle}) thành công!`);
    closeAdminUserModal();
    renderAdminUsersTable();
    renderAuditLogs();
    renderDatabaseStats();
  } else {
    alert(`❌ Lỗi: ${result.message}`);
  }
}

function deleteAdminUser(userId, name) {
  if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản quản trị viên "${name}" khỏi hệ thống?\nHành động này không thể hoàn tác.`)) {
    return;
  }

  const result = DataStore.users.delete(userId);
  if (result.success) {
    showToast(`🗑️ ${result.message}`);
    renderAdminUsersTable();
    renderAuditLogs();
    renderDatabaseStats();
  } else {
    alert(`❌ Lỗi: ${result.message}`);
  }
}

// ============================================================
// 17. UNIFIED DATABASE CENTER & AUDIT LOGS CONTROLLER
// ============================================================
function renderDatabaseStats() {
  if (typeof DataStore === "undefined" || !DataStore.database) return;
  const grid = document.getElementById("dbTablesGrid");
  if (!grid) return;

  const stats = DataStore.database.getStats();

  const tableMeta = [
    { key: "users", name: "Tài khoản Quản trị", icon: "👥", keyName: "tp_users_v1", desc: "Admin Tổng, Admin Phụ & Phân quyền", unit: "tài khoản" },
    { key: "posts", name: "Bài viết & Tin tức", icon: "✍️", keyName: "tp_posts_v2", desc: "Nội dung chuẩn SEO, Pillar & Cluster", unit: "bài viết" },
    { key: "products", name: "Sản phẩm Máy Scan", icon: "🖨️", keyName: "tp_products_v2", desc: "Máy quét Ricoh / Fujitsu & Thông số", unit: "sản phẩm" },
    { key: "leads", name: "Khách hàng CRM", icon: "📞", keyName: "tp_leads_v2", desc: "Yêu cầu tư vấn & Khảo sát số hóa", unit: "yêu cầu" },
    { key: "pages", name: "Trang Tĩnh & Nội dung", icon: "📄", keyName: "tp_pages_v2", desc: "Giới thiệu, Giải pháp, Liên hệ", unit: "trang" },
    { key: "builderPages", name: "Page Builder Layouts", icon: "🎨", keyName: "tp_builder_pages_v1", desc: "Mẫu bố cục khối kéo thả trực quan", unit: "bố cục" },
    { key: "systemSettings", name: "Cấu hình Hệ thống", icon: "⚙️", keyName: "tp_system_settings_v1", desc: "SEO Global, Gemini AI Key, Liên hệ", unit: "mục cấu hình" },
    { key: "auditLogs", name: "Nhật ký Hoạt động", icon: "📜", keyName: "tp_audit_logs_v1", desc: "Ghi vết thao tác & bảo mật phân quyền", unit: "sự kiện" }
  ];

  grid.innerHTML = tableMeta.map(t => {
    const item = stats[t.key] || { count: 0, sizeKb: 0 };
    return `
      <div class="db-table-card">
        <div class="db-table-header">
          <span class="db-table-icon">${t.icon}</span>
          <span class="db-table-badge">${item.sizeKb} KB</span>
        </div>
        <div class="db-table-name">${t.name}</div>
        <div class="db-table-key">${t.keyName}</div>
        <div class="db-table-count">${item.count} <span>${t.unit}</span></div>
        <p style="font-size: 11.5px; color: #64748b; margin-top: 6px; line-height: 1.35;">${t.desc}</p>
      </div>
    `;
  }).join("");
}

function exportDatabaseBackup() {
  if (typeof DataStore === "undefined" || !DataStore.database) return;
  const jsonStr = DataStore.database.exportJSON();
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `thuanphat-database-backup-${dateStr}.json`;

  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`📥 Đã tải xuống tệp sao lưu: ${fileName}`);
}

function triggerDatabaseRestoreFile() {
  const currentUser = DataStore.auth?.getCurrentUser();
  if (currentUser && currentUser.role !== "super_admin") {
    alert("⚠️ QUYỀN HẠN TỐI CAO:\nChỉ có Admin Tổng (Super Admin) mới được phép phục hồi cơ sở dữ liệu!");
    return;
  }
  const fileInput = document.getElementById("dbRestoreFileInput");
  if (fileInput) fileInput.click();
}

function handleDatabaseRestoreFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const result = DataStore.database.importJSON(content);
      if (result.success) {
        showToast("✅ Phục hồi Database thành công! Đang tải lại dữ liệu...");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        alert("❌ Phục hồi thất bại: " + result.message);
      }
    } catch (err) {
      alert("❌ Tệp không hợp lệ: " + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function handleDatabaseFactoryReset() {
  const currentUser = DataStore.auth?.getCurrentUser();
  if (currentUser && currentUser.role !== "super_admin") {
    alert("⚠️ QUYỀN HẠN TỐI CAO:\nChỉ có Admin Tổng (Super Admin) mới được phép khôi phục dữ liệu mặc định!");
    return;
  }

  const confirm1 = confirm("⚠️ CẢNH BÁO TỐI CAO:\nBạn có chắc chắn muốn khôi phục toàn bộ Database về trạng thái mặc định ban đầu?\nMọi bài viết và chỉnh sửa tùy biến sẽ được đưa về mẫu chuẩn Thuận Phát.");
  if (!confirm1) return;

  const code = prompt("Để xác nhận, vui lòng gõ chính xác chữ: RESET");
  if (code !== "RESET") {
    alert("Thao tác đã bị hủy bỏ do mã xác nhận không chính xác.");
    return;
  }

  DataStore.database.resetToFactory();
  showToast("⚡ Đã khôi phục toàn bộ cơ sở dữ liệu về mặc định!");
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

function renderAuditLogs() {
  if (typeof DataStore === "undefined" || !DataStore.database) return;
  const tbody = document.getElementById("auditLogsTableBody");
  if (!tbody) return;

  const logs = DataStore.database.getAuditLogs();
  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 24px; color: #94a3b8;">Chưa có nhật ký hoạt động nào</td></tr>`;
    return;
  }

  const actionBadges = {
    "LOGIN": '<span style="background: #e0f2fe; color: #0369a1; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 11px;">ĐĂNG NHẬP</span>',
    "CREATE_USER": '<span style="background: #dcfce7; color: #15803d; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 11px;">THÊM ADMIN</span>',
    "UPDATE_USER": '<span style="background: #fef3c7; color: #b45309; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 11px;">SỬA ADMIN</span>',
    "DELETE_USER": '<span style="background: #fee2e2; color: #b91c1c; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 11px;">XÓA ADMIN</span>',
    "EXPORT_DATABASE": '<span style="background: #ecfdf5; color: #047857; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 11px;">SAO LƯU DB</span>',
    "IMPORT_DATABASE": '<span style="background: #eff6ff; color: #1d4ed8; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 11px;">PHỤC HỒI DB</span>',
    "FACTORY_RESET": '<span style="background: #fef2f2; color: #991b1b; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-size: 11px;">RESET GỐC</span>'
  };

  tbody.innerHTML = logs.map(l => {
    const actionBadge = actionBadges[l.action] || `<span style="background: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 4px; font-weight: 700; font-size: 11px;">${l.action}</span>`;
    return `
      <tr>
        <td style="font-size: 12px; color: #64748b; white-space: nowrap;">
          🕒 ${l.timestamp}
        </td>
        <td>
          <strong style="color: #1e293b; font-size: 13px;">${l.actor || 'Hệ thống'}</strong>
        </td>
        <td>
          ${actionBadge}
        </td>
        <td style="font-size: 12.5px; color: #334155;">
          ${l.details || ''}
        </td>
      </tr>
    `;
  }).join("");
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdminAuthUI);
} else {
  initAdminAuthUI();
}



