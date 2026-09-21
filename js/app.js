/**
 * THUANPHAT8.VN - JAVASCRIPT APPLICATION CORE (ENHANCED)
 * SPA Routing, DTI Assessment Quiz, Radar Canvas Chart,
 * Dynamic DataStore Sync (Solutions, Articles & Site Settings),
 * Form Validation & CRM Lead Persistence
 */

// ============================================================
// 1. DTI ASSESSMENT DATA (15 Questions, 5 Pillars - QĐ 1726/QĐ-BTTTT)
// ============================================================
const DTI_PILLARS = [
  {
    id: "pillar1",
    name: "Chiến lược & Định hướng số",
    shortName: "Chiến lược",
    questions: [
      {
        id: "q1",
        text: "Tổ chức/Doanh nghiệp của bạn đã ban hành chiến lược hoặc kế hoạch chuyển đổi số bằng văn bản chưa?",
        options: [
          { text: "Chưa có định hướng cụ thể hoặc chỉ mới thảo luận miệng", score: 1 },
          { text: "Đang nghiên cứu và xây dựng dự thảo kế hoạch", score: 2 },
          { text: "Đã ban hành kế hoạch ngắn hạn 1-2 năm cho từng phòng ban", score: 3 },
          { text: "Đã có chiến lược dài hạn 3-5 năm được phê duyệt và phổ biến", score: 4 },
          { text: "Chiến lược CĐS gắn liền với mục tiêu kinh doanh, có KPI đo lường định kỳ", score: 5 }
        ]
      },
      {
        id: "q2",
        text: "Mức độ ưu tiên ngân sách hàng năm dành cho công nghệ và chuyển đổi số?",
        options: [
          { text: "Dưới 1% doanh thu/ngân sách hoặc không có mục riêng", score: 1 },
          { text: "Khoảng 1% - 2%, chỉ chi trả cho bảo trì phần cứng tối thiểu", score: 2 },
          { text: "Từ 2% - 4%, có quỹ đầu tư mua sắm thiết bị scan, máy chủ", score: 3 },
          { text: "Từ 4% - 6%, phân bổ rõ cho phần mềm, đào tạo và hạ tầng", score: 4 },
          { text: "Trên 6% với ngân sách chiến lược cam kết dài hạn", score: 5 }
        ]
      },
      {
        id: "q3",
        text: "Vai trò của lãnh đạo cao nhất đối với các dự án công nghệ?",
        options: [
          { text: "Uỷ quyền hoàn toàn cho bộ phận IT xử lý đơn lẻ", score: 1 },
          { text: "Lắng nghe báo cáo nhưng ít khi trực tiếp tham gia chỉ đạo", score: 2 },
          { text: "Trực tiếp phê duyệt các dự án mua sắm quan trọng", score: 3 },
          { text: "Là trưởng ban chỉ đạo CĐS, đôn đốc tiến độ hàng tháng", score: 4 },
          { text: "Tiên phong ứng dụng công cụ số, thúc đẩy đổi mới sáng tạo toàn diện", score: 5 }
        ]
      }
    ]
  },
  {
    id: "pillar2",
    name: "Khách hàng & Dịch vụ số",
    shortName: "Dịch vụ số",
    questions: [
      {
        id: "q4",
        text: "Kênh tương tác và cung cấp dịch vụ đến người dân/khách hàng hiện tại?",
        options: [
          { text: "Chủ yếu trực tiếp tại quầy hoặc giấy tờ truyền thống", score: 1 },
          { text: "Có số điện thoại hotline và email nhưng tiếp nhận thủ công", score: 2 },
          { text: "Có website giới thiệu thông tin và cổng tiếp nhận hồ sơ cơ bản", score: 3 },
          { text: "Hệ thống đa kênh (Website, Cổng dịch vụ công/App, Zalo OA)", score: 4 },
          { text: "Nền tảng tự phục vụ thông minh, tra cứu kết quả tức thì 24/7", score: 5 }
        ]
      },
      {
        id: "q5",
        text: "Mức độ số hoá trải nghiệm và thời gian xử lý yêu cầu khách hàng?",
        options: [
          { text: "Thời gian tra cứu hồ sơ giấy mất từ 1 - 3 ngày", score: 1 },
          { text: "Tra cứu mất nửa ngày do tài liệu lưu phân tán nhiều kho", score: 2 },
          { text: "Đã có file scan sơ bộ, tra cứu mất 10 - 30 phút", score: 3 },
          { text: "Hệ thống số hoá OCR, tra cứu hồ sơ hoàn tất dưới 1 phút", score: 4 },
          { text: "Tra cứu tức thì trong 3 giây theo từ khoá và số định danh", score: 5 }
        ]
      },
      {
        id: "q6",
        text: "Đo lường và khảo sát mức độ hài lòng của khách hàng/người dân?",
        options: [
          { text: "Không thực hiện hoặc chỉ ghi nhận khi có khiếu nại", score: 1 },
          { text: "Khảo sát qua phiếu giấy tại bàn giao dịch", score: 2 },
          { text: "Khảo sát định kỳ qua biểu mẫu online hoặc email", score: 3 },
          { text: "Tự động chấm điểm điện tử ngay sau khi hoàn tất giao dịch", score: 4 },
          { text: "Phân tích tự động dữ liệu phản hồi, có cảnh báo cải tiến liên tục", score: 5 }
        ]
      }
    ]
  },
  {
    id: "pillar3",
    name: "Quy trình nội bộ & Số hoá tài liệu",
    shortName: "Quy trình số",
    questions: [
      {
        id: "q7",
        text: "Tỷ lệ tài liệu, văn bản hành chính được số hoá và lưu trữ điện tử?",
        options: [
          { text: "Dưới 10%, hoàn toàn phụ thuộc vào kho hồ sơ giấy", score: 1 },
          { text: "Từ 10% - 30%, mới scan một phần văn bản đi/đến", score: 2 },
          { text: "Từ 30% - 60%, đã số hoá hồ sơ lưu trữ quan trọng", score: 3 },
          { text: "Từ 60% - 85%, ứng dụng máy scan chuyên dụng ADF tốc độ cao", score: 4 },
          { text: "Trên 85%, đạt chuẩn Thông tư 02/2019/TT-BNV, văn phòng không giấy", score: 5 }
        ]
      },
      {
        id: "q8",
        text: "Mức độ ứng dụng chữ ký số và luân chuyển văn bản điện tử?",
        options: [
          { text: "Vẫn ký tay và đóng dấu mực đỏ 100% hồ sơ vật lý", score: 1 },
          { text: "Ký số cho một số tờ trình nội bộ nhưng vẫn in lưu bản cứng", score: 2 },
          { text: "Ứng dụng chữ ký số USB token cho ban lãnh đạo", score: 3 },
          { text: "Chữ ký số tập trung (HSM/Cloud), trình ký online qua e-Office", score: 4 },
          { text: "Toàn bộ quy trình phê duyệt khép kín, liên thông điện tử tự động", score: 5 }
        ]
      },
      {
        id: "q9",
        text: "Mức độ tự động hoá các quy trình tác nghiệp liên phòng ban?",
        options: [
          { text: "Giao tiếp rời rạc qua giấy tờ, sổ theo dõi thủ công", score: 1 },
          { text: "Dùng các nhóm chat (Zalo, Skype) chưa có chuẩn hoá", score: 2 },
          { text: "Có phần mềm quản lý tác nghiệp nhưng còn nhiều điểm nghẽn", score: 3 },
          { text: "Quy trình liên kết chặt chẽ trên ERP / hệ thống một cửa điện tử", score: 4 },
          { text: "Tự động kích hoạt quy trình theo sự kiện (BPM/RPA), giám sát Real-time", score: 5 }
        ]
      }
    ]
  },
  {
    id: "pillar4",
    name: "Hạ tầng CNTT & An toàn thông tin",
    shortName: "Hạ tầng & ATTT",
    questions: [
      {
        id: "q10",
        text: "Hạ tầng máy chủ, thiết bị mạng và lưu trữ dữ liệu của đơn vị?",
        options: [
          { text: "Dùng PC văn phòng thông thường làm máy chủ tạm thời", score: 1 },
          { text: "Có máy chủ vật lý riêng lẻ nhưng chưa có phòng máy chuẩn", score: 2 },
          { text: "Máy chủ chuyên dụng (HP/Dell), có thiết bị lưu trữ NAS cơ bản", score: 3 },
          { text: "Trung tâm dữ liệu mini đạt chuẩn, phân vùng mạng an ninh (VLAN/Firewall)", score: 4 },
          { text: "Mô hình lai Hybrid Cloud, dự phòng cao HA, tự động sao lưu đa điểm", score: 5 }
        ]
      },
      {
        id: "q11",
        text: "Chính sách sao lưu dữ liệu (Backup) và phòng chống thảm hoạ (DR)?",
        options: [
          { text: "Không sao lưu hoặc sao lưu ngẫu hứng ra ổ cứng di động", score: 1 },
          { text: "Sao lưu định kỳ hàng tháng nhưng chưa từng thử nghiệm phục hồi", score: 2 },
          { text: "Sao lưu tự động hàng tuần lên thiết bị lưu trữ thứ cấp", score: 3 },
          { text: "Quy tắc Backup 3-2-1 tự động mỗi ngày, có kiểm thử phục hồi", score: 4 },
          { text: "Hệ thống sao lưu liên tục RPO dưới 15 phút, dự phòng thảm hoạ song song", score: 5 }
        ]
      },
      {
        id: "q12",
        text: "Biện pháp an toàn an ninh mạng và phân quyền truy cập thông tin?",
        options: [
          { text: "Chưa có tường lửa hoặc chỉ dùng phần mềm diệt virus miễn phí", score: 1 },
          { text: "Có tường lửa cơ bản nhưng dùng chung tài khoản nội bộ", score: 2 },
          { text: "Phân quyền theo vai trò (RBAC), có chính sách mật khẩu bắt buộc", score: 3 },
          { text: "Tường lửa thế hệ mới (Next-Gen Firewall), VPN an toàn khi làm việc từ xa", score: 4 },
          { text: "Tuân thủ tiêu chuẩn an toàn thông tin cấp độ nhà nước, mã hoá AES-256", score: 5 }
        ]
      }
    ]
  },
  {
    id: "pillar5",
    name: "Nhân lực số & Văn hóa doanh nghiệp",
    shortName: "Nhân lực số",
    questions: [
      {
        id: "q13",
        text: "Kỹ năng sử dụng các thiết bị số hoá và phần mềm nghiệp vụ của nhân sự?",
        options: [
          { text: "Cán bộ nhân viên ngại thay đổi, thích dùng văn bản giấy", score: 1 },
          { text: "Thao tác thành thạo tin học văn phòng cơ bản, lúng túng khi dùng phần mềm mới", score: 2 },
          { text: "Đã làm chủ các phần mềm quản lý văn bản và thiết bị scan thông thường", score: 3 },
          { text: "Thành thạo công cụ số hoá nâng cao, xử lý OCR và quản trị dữ liệu", score: 4 },
          { text: "Tự chủ giải quyết sự cố, chủ động đề xuất giải pháp cải tiến công nghệ", score: 5 }
        ]
      },
      {
        id: "q14",
        text: "Chương trình đào tạo và phổ biến kiến thức số hoá cho nhân sự?",
        options: [
          { text: "Chưa có chương trình đào tạo nào về công nghệ trong 12 tháng qua", score: 1 },
          { text: "Chỉ hướng dẫn truyền miệng khi có người mới gia nhập", score: 2 },
          { text: "Có các buổi hướng dẫn khi đơn vị triển khai phần mềm/máy móc mới", score: 3 },
          { text: "Kế hoạch đào tạo kỹ năng số và an toàn thông tin định kỳ hàng quý", score: 4 },
          { text: "Khung năng lực số chuẩn hoá, kiểm tra đánh giá năng lực công nghệ thường niên", score: 5 }
        ]
      },
      {
        id: "q15",
        text: "Đội ngũ chuyên trách CNTT hoặc đối tác đồng hành kỹ thuật?",
        options: [
          { text: "Không có nhân sự IT, khi hỏng hóc gọi thợ ngoài", score: 1 },
          { text: "Có 1 nhân sự kiêm nhiệm hỗ trợ kỹ thuật văn phòng", score: 2 },
          { text: "Có đội ngũ IT nội bộ xử lý sự cố hàng ngày", score: 3 },
          { text: "Hợp tác chặt chẽ với đối tác công nghệ chuyên nghiệp (như Thuận Phát)", score: 4 },
          { text: "Bộ phận IT chiến lược kết hợp mạng lưới chuyên gia công nghệ cao cấp", score: 5 }
        ]
      }
    ]
  }
];

// ============================================================
// 2. APPLICATION STATE
// ============================================================
const AppState = {
  currentScreen: "screen1",
  answers: {},
  dtiScores: {
    pillar1: 0,
    pillar2: 0,
    pillar3: 0,
    pillar4: 0,
    pillar5: 0,
    total: 0
  }
};

// ============================================================
// 3. DYNAMIC DATA STORE INTEGRATION (SOLUTIONS, ARTICLES & SETTINGS)
// ============================================================
function applySiteSettings() {
  if (typeof DataStore === "undefined") return;
  const s = DataStore.getSettings();

  // Hero Title
  const heroTitleEl = document.getElementById("heroMainTitle");
  if (heroTitleEl && s.heroTitle) {
    heroTitleEl.innerHTML = s.heroTitle.replace(/\n/g, "<br>");
  }

  // Hero Desc
  const heroDescEl = document.getElementById("heroMainDesc");
  if (heroDescEl && s.heroDesc) {
    heroDescEl.textContent = s.heroDesc;
  }

  // Partner Badge
  const badgeEl = document.querySelector(".partner-badge span:last-child");
  if (badgeEl && s.partnerBadge) {
    badgeEl.textContent = s.partnerBadge.replace(/^•\s*/, "");
  }

  // Hotline
  const hotlineEls = document.querySelectorAll(".header-contact span, .contact-hotline-val");
  hotlineEls.forEach(el => {
    if (s.hotline) el.textContent = s.hotline;
  });

  // Stats Bar
  if (s.stats) {
    const statItems = document.querySelectorAll(".stat-item");
    if (statItems.length >= 4) {
      if (s.stats.clients) statItems[0].querySelector(".stat-number").textContent = s.stats.clients;
      if (s.stats.experience) statItems[1].querySelector(".stat-number").textContent = s.stats.experience;
      if (s.stats.satisfaction) statItems[2].querySelector(".stat-number").textContent = s.stats.satisfaction;
      if (s.stats.support) statItems[3].querySelector(".stat-number").textContent = s.stats.support;
    }
  }
}

function renderDynamicSolutions() {
  if (typeof DataStore === "undefined") return;
  const container = document.getElementById("dynamicSolutionsGrid");
  if (!container) return;

  const solutions = DataStore.getSolutions();
  container.innerHTML = solutions.map(sol => `
    <article class="card-category ${sol.id === 'sol-1' ? 'featured' : ''}" onclick="handleSolutionCardClick('${sol.id}', '${sol.screenTarget || 'quickConsultModal'}')">
      <div class="card-header-row">
        <div class="card-icon-box">${sol.icon || '💼'}</div>
        <span class="badge-tag ${sol.tagClass || 'badge-popular'}">${sol.tag || 'Nổi bật'}</span>
      </div>
      <h3 class="card-title">${sol.title}</h3>
      <p class="card-description">${sol.description}</p>
      <div class="card-features-list">
        ${(sol.features || []).map(f => `<div class="card-feature-item">${f}</div>`).join("")}
      </div>
      <div class="card-action-link">
        <span>${sol.actionText || 'Khám phá giải pháp →'}</span>
      </div>
    </article>
  `).join("");
}

function handleSolutionCardClick(solId, target) {
  if (target === "screen2") {
    switchScreen("screen2");
  } else if (target === "screen3") {
    switchScreen("screen3");
  } else {
    openModal("quickConsultModal");
  }
}

function renderDynamicArticles() {
  if (typeof DataStore === "undefined") return;
  const container = document.getElementById("dynamicArticlesGrid");
  if (!container) return;

  const posts = DataStore.getPosts().filter(p => p.status === "published");
  container.innerHTML = posts.slice(0, 3).map(post => `
    <article class="card-category" onclick="openArticleModal('${post.id}')" style="cursor: pointer;">
      <div style="height: 140px; border-radius: 8px; overflow: hidden; margin-bottom: 16px; background: #eee;">
        <img src="${post.thumbnail || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600'}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
        <span style="font-size: 11px; font-weight: 700; color: var(--primary-gold); background: var(--gold-tint); padding: 2px 8px; border-radius: 4px;">${post.pillar || 'Bài viết'}</span>
        <span style="font-size: 12px; color: #888;">${post.date}</span>
      </div>
      <h3 class="card-title" style="font-size: 17px; line-height: 1.35; margin-bottom: 8px;">${post.title}</h3>
      <p class="card-description" style="font-size: 13.5px; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">${post.excerpt}</p>
      <div class="card-action-link" style="margin-top: auto;">
        <span>Đọc bài viết chi tiết →</span>
      </div>
    </article>
  `).join("");
}

function openArticleModal(postId) {
  if (typeof DataStore === "undefined") return;
  const post = DataStore.getPostById(postId);
  if (!post) return;

  const modal = document.getElementById("articleReaderModal");
  if (!modal) return;

  document.getElementById("modalArticleTitle").textContent = post.title;
  document.getElementById("modalArticlePillar").textContent = post.pillar || "Bài viết chuyên sâu";
  document.getElementById("modalArticleDate").textContent = `Ngày đăng: ${post.date}`;
  document.getElementById("modalArticleAuthor").textContent = `Tác giả: ${post.author || 'Thuận Phát Technology'}`;
  document.getElementById("modalArticleBody").innerHTML = post.content || `<p>${post.excerpt}</p>`;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeArticleModal() {
  const modal = document.getElementById("articleReaderModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// ============================================================
// 4. ROUTER / SCREEN SWITCHER (ALL 7 SITEMAP SCREENS)
// ============================================================
function switchScreen(screenId, updateHash = true) {
  const validScreens = [
    "screen-home",
    "screen-may-scan",
    "screen-ha-tang",
    "screen1",
    "screen2",
    "screen3",
    "screen-gioi-thieu",
    "screen-lien-he"
  ];
  if (!validScreens.includes(screenId)) {
    screenId = "screen-home";
  }

  AppState.currentScreen = screenId;
  if (updateHash) {
    const screenToHash = {
      "screen-home": "#trang-chu",
      "screen-may-scan": "#may-scan",
      "screen-ha-tang": "#ha-tang-cntt",
      "screen1": "#giai-phap-chuyen-doi-so",
      "screen2": "#so-hoa-tai-lieu",
      "screen3": "#danh-gia-dti",
      "screen-gioi-thieu": "#gioi-thieu",
      "screen-lien-he": "#lien-he"
    };
    if (screenToHash[screenId]) {
      history.replaceState(null, null, screenToHash[screenId]);
    }
  }

  // Toggle active screen visibility
  validScreens.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === screenId) {
        el.classList.add("active-screen");
      } else {
        el.classList.remove("active-screen");
      }
    }
  });

  // Update Navigation Active State
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.classList.remove("active", "active-pill");
  });

  const navMap = {
    "screen-home": "nav-home",
    "screen-may-scan": "nav-scan",
    "screen-ha-tang": "nav-infra",
    "screen1": "nav-cds",
    "screen2": "nav-cds",
    "screen3": "nav-cds",
    "screen-gioi-thieu": "nav-about",
    "screen-lien-he": "nav-contact"
  };

  const activeLinkId = navMap[screenId];
  if (activeLinkId) {
    const activeLink = document.getElementById(activeLinkId);
    if (activeLink) activeLink.classList.add("active-pill");
  }

  // Update hero breadcrumbs if visible
  const breadcrumbCurrent = document.getElementById("heroBreadcrumbCurrent");
  if (breadcrumbCurrent) {
    const titleMap = {
      "screen-home": "Trang chủ",
      "screen-may-scan": "Máy scan chuyên dụng",
      "screen-ha-tang": "Hạ tầng CNTT doanh nghiệp",
      "screen1": "Giải pháp chuyển đổi số",
      "screen2": "Số hoá tài liệu hành chính công",
      "screen3": "Đánh giá mức độ chuyển đổi số (DTI)",
      "screen-gioi-thieu": "Giới thiệu Thuận Phát",
      "screen-lien-he": "Liên hệ"
    };
    breadcrumbCurrent.textContent = titleMap[screenId] || "Trang chủ";
  }

  // Update Visual Page Builder direct link based on current screen
  const builderPageMap = {
    "screen-home": "home",
    "screen-may-scan": "may-scan",
    "screen-ha-tang": "ha-tang-cntt",
    "screen1": "giai-phap-chuyen-doi-so",
    "screen2": "so-hoa-tai-lieu",
    "screen3": "dti",
    "screen-gioi-thieu": "gioi-thieu",
    "screen-lien-he": "lien-he"
  };
  const builderLinkEl = document.getElementById("headerBuilderLink");
  if (builderLinkEl) {
    const targetPage = builderPageMap[screenId] || "home";
    builderLinkEl.href = `builder.html?page=${targetPage}`;
  }

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Update hash without jump
  const hashMapping = {
    "screen-home": "#trang-chu",
    "screen-may-scan": "#may-scan",
    "screen-ha-tang": "#ha-tang-cntt",
    "screen1": "#giai-phap-chuyen-doi-so",
    "screen2": "#so-hoa-tai-lieu",
    "screen3": "#danh-gia-dti",
    "screen-gioi-thieu": "#gioi-thieu",
    "screen-lien-he": "#lien-he"
  };
  if (history.pushState) {
    history.pushState(null, null, hashMapping[screenId] || "#trang-chu");
  }

  if (screenId === "screen3") {
    setTimeout(renderRadarChart, 100);
  }
}

function handleInitialRoute() {
  const hash = (window.location.hash || "").toLowerCase();
  if (hash === "#may-scan" || hash.includes("may-scan")) {
    switchScreen("screen-may-scan", false);
  } else if (hash === "#ha-tang-cntt" || hash.includes("ha-tang")) {
    switchScreen("screen-ha-tang", false);
  } else if (hash === "#so-hoa-tai-lieu" || hash.includes("so-hoa")) {
    switchScreen("screen2", false);
  } else if (hash === "#danh-gia-dti" || hash.includes("dti") || hash.includes("danh-gia")) {
    switchScreen("screen3", false);
  } else if (hash === "#giai-phap-chuyen-doi-so" || hash.includes("chuyen-doi-so")) {
    switchScreen("screen1", false);
  } else if (hash === "#gioi-thieu" || hash.includes("gioi-thieu")) {
    switchScreen("screen-gioi-thieu", false);
  } else if (hash === "#lien-he" || hash.includes("lien-he")) {
    switchScreen("screen-lien-he", false);
  } else if (hash === "#san-pham" || hash.includes("san-pham")) {
    switchScreen("screen-home", false);
    setTimeout(() => {
      const el = document.getElementById("san-pham-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  } else {
    switchScreen("screen-home", false);
  }
}

// ============================================================
// 5. DTI ASSESSMENT BUILDER & LOGIC
// ============================================================
function buildDtiAccordion() {
  const container = document.getElementById("dtiAccordionContainer");
  if (!container) return;

  container.innerHTML = "";

  DTI_PILLARS.forEach((pillar, pIdx) => {
    const group = document.createElement("div");
    group.className = `pillar-group ${pIdx === 0 ? "active" : ""}`;
    group.id = `group-${pillar.id}`;

    const header = document.createElement("div");
    header.className = "pillar-header";
    header.innerHTML = `
      <div class="pillar-title-wrap">
        <div class="pillar-num">${pIdx + 1}</div>
        <div class="pillar-title">${pillar.name}</div>
      </div>
      <div class="pillar-chevron">▼</div>
    `;

    header.addEventListener("click", () => {
      group.classList.toggle("active");
    });

    const body = document.createElement("div");
    body.className = "pillar-body";

    pillar.questions.forEach((q, qIdx) => {
      const qItem = document.createElement("div");
      qItem.className = "question-item";

      const title = document.createElement("div");
      title.className = "question-title";
      title.textContent = `Câu ${pIdx * 3 + qIdx + 1}: ${q.text}`;
      qItem.appendChild(title);

      const optionsList = document.createElement("div");
      optionsList.className = "options-list";

      q.options.forEach(opt => {
        const label = document.createElement("label");
        label.className = "option-label";
        label.id = `lbl-${q.id}-${opt.score}`;

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = q.id;
        radio.value = opt.score;

        radio.addEventListener("change", () => {
          handleAnswerSelect(pillar.id, q.id, opt.score);
        });

        const spanText = document.createElement("span");
        spanText.textContent = `${opt.score} điểm: ${opt.text}`;

        label.appendChild(radio);
        label.appendChild(spanText);
        optionsList.appendChild(label);
      });

      qItem.appendChild(optionsList);
      body.appendChild(qItem);
    });

    group.appendChild(header);
    group.appendChild(body);
    container.appendChild(group);
  });
}

function handleAnswerSelect(pillarId, questionId, score) {
  AppState.answers[questionId] = score;

  const options = document.getElementsByName(questionId);
  options.forEach(opt => {
    const parentLabel = opt.closest(".option-label");
    if (parentLabel) {
      if (opt.checked) {
        parentLabel.classList.add("selected");
      } else {
        parentLabel.classList.remove("selected");
      }
    }
  });

  recalculateDtiScore();
}

function recalculateDtiScore() {
  const totalQuestions = 15;
  const answeredCount = Object.keys(AppState.answers).length;

  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const progressFill = document.getElementById("dtiProgressFill");
  const progressText = document.getElementById("dtiProgressCount");

  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (progressText) progressText.textContent = `${answeredCount}/${totalQuestions} câu (${progressPercent}%)`;

  let grandTotalRaw = 0;
  DTI_PILLARS.forEach(pillar => {
    let pillarRaw = 0;
    pillar.questions.forEach(q => {
      pillarRaw += AppState.answers[q.id] || 0;
    });
    grandTotalRaw += pillarRaw;
    AppState.dtiScores[pillar.id] = Math.round((pillarRaw / 15) * 100);
  });

  const finalTotal = Math.round((grandTotalRaw / 75) * 100);
  AppState.dtiScores.total = finalTotal;

  const totalScoreVal = document.getElementById("dtiTotalScoreVal");
  const scoreLevelName = document.getElementById("dtiScoreLevelName");
  const scoreLevelDesc = document.getElementById("dtiScoreLevelDesc");

  if (totalScoreVal) totalScoreVal.textContent = finalTotal;

  let levelName = "Cấp 1: Khởi động";
  let levelDesc = "Đơn vị đang ở giai đoạn sơ khởi, cần nhanh chóng chuẩn hoá số hoá hồ sơ và xây dựng hạ tầng CNTT tối thiểu.";

  if (finalTotal >= 80) {
    levelName = "Cấp 4: Dẫn đầu";
    levelDesc = "Đơn vị có mức độ chuyển đổi số toàn diện xuất sắc, quy trình tự động hóa cao và văn hóa số vững mạnh.";
  } else if (finalTotal >= 60) {
    levelName = "Cấp 3: Nâng cao";
    levelDesc = "Đơn vị đã số hoá hầu hết các quy trình và tài liệu, cần tối ưu liên thông dữ liệu và an toàn thông tin chuyên sâu.";
  } else if (finalTotal >= 40) {
    levelName = "Cấp 2: Đang hình thành";
    levelDesc = "Đã có các ứng dụng công nghệ cơ bản nhưng còn phân tán, cần mở rộng số hoá hồ sơ đạt chuẩn Cục Văn thư Lưu trữ.";
  }

  if (scoreLevelName) scoreLevelName.textContent = levelName;
  if (scoreLevelDesc) scoreLevelDesc.textContent = levelDesc;

  renderRadarChart();
}

function setSampleAnswers() {
  const sampleValues = {
    q1: 3, q2: 2, q3: 3,
    q4: 3, q5: 2, q6: 2,
    q7: 3, q8: 2, q9: 2,
    q10: 3, q11: 2, q12: 3,
    q13: 2, q14: 2, q15: 3
  };

  Object.entries(sampleValues).forEach(([qId, val]) => {
    AppState.answers[qId] = val;
    const radio = document.querySelector(`input[name="${qId}"][value="${val}"]`);
    if (radio) {
      radio.checked = true;
      const lbl = radio.closest(".option-label");
      if (lbl) lbl.classList.add("selected");
    }
  });

  recalculateDtiScore();
}

// ============================================================
// 6. RADAR / SPIDER CHART CANVAS ENGINE
// ============================================================
function renderRadarChart() {
  const canvas = document.getElementById("dtiRadarCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 34;

  ctx.clearRect(0, 0, width, height);

  const pillars = DTI_PILLARS;
  const numAxes = pillars.length;
  const angleStep = (Math.PI * 2) / numAxes;
  const startAngle = -Math.PI / 2;

  const levels = 5;
  for (let lvl = 1; lvl <= levels; lvl++) {
    const lvlRadius = (radius / levels) * lvl;
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + Math.cos(angle) * lvlRadius;
      const y = centerY + Math.sin(angle) * lvlRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = lvl === levels ? "#d5cec2" : "#eae7e0";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#e2ded5";
    ctx.stroke();

    const labelDistance = radius + 22;
    const lx = centerX + Math.cos(angle) * labelDistance;
    const ly = centerY + Math.sin(angle) * labelDistance;
    ctx.fillStyle = "#3c3a37";
    ctx.fillText(pillars[i].shortName, lx, ly);
  }

  const dataPoints = [];
  pillars.forEach((p, i) => {
    const scoreVal = AppState.dtiScores[p.id] || 20;
    const scaledR = (radius * Math.max(scoreVal, 10)) / 100;
    const angle = startAngle + i * angleStep;
    const px = centerX + Math.cos(angle) * scaledR;
    const py = centerY + Math.sin(angle) * scaledR;
    dataPoints.push({ x: px, y: py, val: scoreVal });
  });

  ctx.beginPath();
  dataPoints.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.closePath();

  ctx.fillStyle = "rgba(197, 155, 39, 0.28)";
  ctx.fill();

  ctx.strokeStyle = "#c59b27";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  dataPoints.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#c59b27";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// ============================================================
// 7. FORMS VALIDATION & CRM LEAD PERSISTENCE
// ============================================================
function initForms() {
  // Screen 2 Main Consultation Form
  const consultForm = document.getElementById("projectConsultForm");
  if (consultForm) {
    consultForm.addEventListener("submit", e => {
      e.preventDefault();
      handleFormSubmit(consultForm, "formSuccessBox", "formInputsArea");
    });
  }

  // Quick Modal Form
  const modalForm = document.getElementById("quickConsultModalForm");
  if (modalForm) {
    modalForm.addEventListener("submit", e => {
      e.preventDefault();
      handleFormSubmit(modalForm, "modalSuccessBox", "modalInputsArea");
    });
  }

  // Direct Contact Page Form
  const contactForm = document.getElementById("contactFormDirect");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      handleFormSubmit(contactForm, "contactSuccessBox", "contactInputsArea");
    });
  }
}

function handleFormSubmit(formEl, successBoxId, inputsAreaId) {
  let hasError = false;

  const fullname = formEl.querySelector("[name='fullname']");
  const phone = formEl.querySelector("[name='phone']");
  const email = formEl.querySelector("[name='email']");
  const org = formEl.querySelector("[name='organization']");
  const docVol = formEl.querySelector("[name='documentVolume']");
  const notes = formEl.querySelector("[name='notes']");

  if (fullname) {
    if (!fullname.value.trim()) {
      showInputError(fullname, "Vui lòng nhập họ và tên");
      hasError = true;
    } else {
      clearInputError(fullname);
    }
  }

  if (phone) {
    const phoneRegex = /(84|0[3|5|7|8|9|2])+([0-9]{8,9})\b/;
    if (!phone.value.trim()) {
      showInputError(phone, "Vui lòng nhập số điện thoại liên hệ");
      hasError = true;
    } else if (!phoneRegex.test(phone.value.trim().replace(/\s+/g, ''))) {
      showInputError(phone, "Số điện thoại không đúng định dạng (VD: 0912345678)");
      hasError = true;
    } else {
      clearInputError(phone);
    }
  }

  if (hasError) return;

  // Persist Lead into DataStore (CRM)
  let savedLead = null;
  if (typeof DataStore !== "undefined") {
    savedLead = DataStore.addLead({
      fullname: fullname ? fullname.value.trim() : "Khách hàng",
      phone: phone ? phone.value.trim() : "",
      email: email ? email.value.trim() : "",
      organization: org ? org.value.trim() : "Cơ quan / DN",
      documentVolume: docVol ? docVol.value : "",
      notes: notes ? notes.value.trim() : "Gửi yêu cầu từ website"
    });
  }

  // Show Success Box
  const inputsArea = document.getElementById(inputsAreaId);
  const successBox = document.getElementById(successBoxId);

  // 1. Send Instant Email Notification via FormSubmit.co
  const targetEmail = "contact@thuanphat8.vn";
  const emailPayload = {
    _subject: `[Thuận Phát] Khách hàng yêu cầu tư vấn: ${fullname ? fullname.value : 'Khách hàng'} - SĐT: ${phone ? phone.value : ''}`,
    _template: "table",
    "Họ và tên": fullname ? fullname.value.trim() : "",
    "Số điện thoại": phone ? phone.value.trim() : "",
    "Email": email ? email.value.trim() : "Chưa nhập",
    "Cơ quan / Đơn vị": org ? org.value.trim() : "Chưa nhập",
    "Khối lượng / Yêu cầu": docVol ? docVol.value : (notes ? notes.value.trim() : "Yêu cầu báo giá / tư vấn giải pháp"),
    "Thời gian gửi": new Date().toLocaleString("vi-VN"),
    "Mã hồ sơ": savedLead ? savedLead.refCode : "TP-" + Math.floor(100000 + Math.random() * 900000)
  };

  try {
    fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(emailPayload)
    }).catch(err => console.log("Email dispatch:", err));
  } catch (e) {}

  // 2. Show Success Box with instant Zalo & Call buttons
  if (inputsArea) inputsArea.style.display = "none";
  if (successBox) {
    successBox.classList.add("visible");
    const codeSpan = successBox.querySelector(".consult-ref-code");
    if (codeSpan) {
      codeSpan.textContent = savedLead ? savedLead.refCode : "TP-" + Math.floor(100000 + Math.random() * 900000);
    }

    // Append direct support buttons if not present
    if (!successBox.querySelector(".success-direct-actions")) {
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "success-direct-actions";
      actionsDiv.style.cssText = "margin-top: 18px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;";
      actionsDiv.innerHTML = `
        <a href="https://zalo.me/0903233085" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; background: #0068ff; color: #fff; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none;">
          <span>💬 Nhắn Zalo ngay (090 323 3085)</span>
        </a>
        <a href="tel:0903233085" style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; background: #1b8046; color: #fff; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none;">
          <span>📞 Gọi hotline trực tiếp</span>
        </a>
      `;
      successBox.appendChild(actionsDiv);
    }
  }
}

function showInputError(inputEl, msg) {
  inputEl.classList.add("error");
  const errEl = inputEl.parentElement.querySelector(".form-error-msg");
  if (errEl) {
    errEl.textContent = msg;
    errEl.classList.add("visible");
  }
}

function clearInputError(inputEl) {
  inputEl.classList.remove("error");
  const errEl = inputEl.parentElement.querySelector(".form-error-msg");
  if (errEl) {
    errEl.classList.remove("visible");
  }
}

// ============================================================
// 8. MODALS & POPUPS
// ============================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// ============================================================
// 9. GLOBAL INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobileMenuToggle");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      document.body.classList.toggle("mobile-menu-active");
    });
  }

  // Header scroll shadow effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });

  // Apply dynamic content from DataStore
  applySiteSettings();
  renderDynamicSolutions();
  renderDynamicArticles();
  renderDynamicProducts();
  if (typeof DataStore !== "undefined" && DataStore.syncProductsFromRemote) {
    DataStore.syncProductsFromRemote().then(() => {
      renderDynamicProducts();
    });
  }

  // Build Quiz and setup sample answers
  buildDtiAccordion();
  setSampleAnswers();

  // Setup forms
  initForms();

  // Handle route
  handleInitialRoute();

  // Listen to popstate (back/forward button)
  window.addEventListener("popstate", handleInitialRoute);

  // Floating Help Button
  const floatingHelp = document.getElementById("floatingHelpBtn");
  if (floatingHelp) {
    floatingHelp.addEventListener("click", () => {
      openModal("quickHelpModal");
    });
  }

  // Export PDF Button (Screen 3)
  const exportPdfBtn = document.getElementById("btnExportPdf");
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Download Checklist Button
  const downloadChecklistBtn = document.getElementById("btnDownloadChecklist");
  if (downloadChecklistBtn) {
    downloadChecklistBtn.addEventListener("click", () => {
      alert("Hệ thống đang xuất bản tệp 'Checklist_Chuyen_Doi_So_DTI_ThuanPhat.pdf'. Bản in sẽ được mở ngay.");
      window.print();
    });
  }

  // Close modals on clicking backdrop
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
});

// ============================================================
// DYNAMIC PRODUCTS RENDERING (ALL 96 CRAWLED PRODUCTS)
// ============================================================
let currentProductCategory = 'all';
let currentProductSearch = '';
let currentProductsLimit = 12;

function renderDynamicProducts() {
  if (typeof DataStore === "undefined") return;
  const container = document.getElementById("dynamicProductsGrid");
  if (!container) return;

  let prods = DataStore.getProducts();
  if (currentProductCategory !== 'all') {
    prods = prods.filter(p => p.category === currentProductCategory);
  }
  if (currentProductSearch.trim()) {
    const q = currentProductSearch.toLowerCase().trim();
    prods = prods.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.slug && p.slug.toLowerCase().includes(q)));
  }

  const visibleProds = prods.slice(0, currentProductsLimit);
  
  if (visibleProds.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
        <div style="font-size: 40px; margin-bottom: 8px;">🔍</div>
        <p style="font-weight: 600; font-size: 16px;">Không tìm thấy sản phẩm phù hợp</p>
        <p style="font-size: 13px;">Vui lòng thử với từ khóa khác hoặc bấm chọn "Tất cả sản phẩm".</p>
      </div>
    `;
    const loadMoreBtn = document.getElementById("loadMoreProductsContainer");
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    return;
  }

  container.innerHTML = visibleProds.map(p => `
    <div class="product-item-card" style="display: flex; flex-direction: column;">
      <div class="product-card-img" style="background: #ffffff; height: 180px; display: flex; align-items: center; justify-content: center; position: relative; border-radius: 8px; overflow: hidden; padding: 12px; border: 1px solid #f1f5f9;">
        <span class="badge-tag badge-popular" style="position: absolute; top: 8px; left: 8px; font-size: 11px;">
          ${p.category === 'may-scan' ? 'Máy Scan' : (p.category === 'may-in-kyocera' ? 'Máy In' : 'Photocopy')}
        </span>
        <img src="${p.image || 'favicon.svg'}" alt="${p.name}" style="max-height: 140px; max-width: 100%; object-fit: contain;" onerror="this.src='favicon.svg'">
      </div>
      <h4 style="font-size: 15px; font-weight: 700; margin: 12px 0 4px; line-height: 1.3; min-height: 38px;">${p.name}</h4>
      <span style="font-size: 12.5px; color: #b45309; font-weight: 700; margin-bottom: 6px; display: block;">${p.price && p.price !== '0' ? p.price : 'Liên hệ báo giá'}</span>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 34px;">
        ${p.excerpt || 'Sản phẩm chính hãng phân phối bởi Công ty TNHH Công nghệ Thuận Phát.'}
      </p>
      <button class="btn-primary-gold" style="padding: 8px 12px; font-size: 12.5px; justify-content: center; margin-top: auto; cursor: pointer;" onclick="openConsultForProduct('${(p.name || '').replace(/'/g, "\\\'")} - ${p.price || ''}')">
        Nhận báo giá
      </button>
    </div>
  `).join("");

  const loadMoreBtn = document.getElementById("loadMoreProductsContainer");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = currentProductsLimit >= prods.length ? "none" : "block";
  }
}

function filterProducts(cat, btn) {
  currentProductCategory = cat;
  currentProductsLimit = 12;
  document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderDynamicProducts();
}

function handleProductSearch(val) {
  currentProductSearch = val;
  currentProductsLimit = 12;
  renderDynamicProducts();
}

function loadMoreProducts() {
  currentProductsLimit += 12;
  renderDynamicProducts();
}

function openConsultForProduct(productName) {
  openModal('quickConsultModal');
  const noteField = document.querySelector('#quickConsultModalForm textarea[name="notes"]') ||
                    document.querySelector('#quickConsultModalForm input[name="product"]') ||
                    document.querySelector('#quickConsultModalForm input[name="fullname"]');
  if (noteField && noteField.tagName === 'TEXTAREA') {
    noteField.value = "Tôi quan tâm đến: " + productName;
  }
}

window.addEventListener("hashchange", handleInitialRoute);
