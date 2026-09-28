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

  // Apply Banners & Titles across all pages
  applyPageBanners();
}

function applyPageBanners() {
  if (typeof DataStore === "undefined") return;
  const pages = DataStore.getPages();
  if (!pages || typeof pages !== "object") return;

  document.querySelectorAll("[data-hero-page]").forEach(heroEl => {
    const pageKey = heroEl.getAttribute("data-hero-page");
    const pageData = pages[pageKey];
    if (!pageData) return;

    // Background Image
    if (pageData.bgImage && pageData.bgImage.trim()) {
      heroEl.style.backgroundImage = `url('${pageData.bgImage.trim()}')`;
      heroEl.classList.add("has-bg-img");
    } else {
      heroEl.style.backgroundImage = "";
      heroEl.classList.remove("has-bg-img");
    }

    // Badge
    const badgeEl = heroEl.querySelector(".hero-badge-text");
    if (badgeEl && pageData.badge) {
      badgeEl.textContent = pageData.badge;
    }

    // Title
    const titleEl = heroEl.querySelector(".hero-page-title");
    if (titleEl && pageData.title) {
      titleEl.innerHTML = pageData.title.replace(/\n/g, "<br>");
    }

    // Subtitle / Description
    const descEl = heroEl.querySelector(".hero-page-desc");
    if (descEl && pageData.subtitle) {
      descEl.textContent = pageData.subtitle;
    }

    // CTA Text
    const ctaTextEl = heroEl.querySelector(".hero-cta-btn span:first-child");
    if (ctaTextEl && pageData.ctaText) {
      ctaTextEl.textContent = pageData.ctaText;
    }
  });
}

function getSolutionIconSvg(iconKey) {
  const icons = {
    'folder': `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>`,
    'bar-chart': `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><line x1="2" y1="20" x2="22" y2="20"></line></svg>`,
    'factory': `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H2v18z"></path><path d="M17 18h1"></path><path d="M12 18h1"></path><path d="M7 18h1"></path></svg>`,
    'rocket': `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>`,
    'server': `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    'truck': `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    'edit': `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`
  };
  return icons[iconKey] || `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`;
}

function renderDynamicSolutions() {
  if (typeof DataStore === "undefined") return;
  const container = document.getElementById("dynamicSolutionsGrid");
  if (!container) return;

  const solutions = DataStore.getSolutions();
  container.innerHTML = solutions.map(sol => `
    <article class="card-category ${sol.id === 'sol-1' ? 'featured' : ''}" onclick="handleSolutionCardClick('${sol.id}', '${sol.screenTarget || 'quickConsultModal'}')">
      <div class="card-header-row">
        <div class="card-icon-box">${getSolutionIconSvg(sol.icon)}</div>
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
    <article class="card-category" onclick="openArticleModal('${post.id}')" style="cursor: pointer; display: flex; flex-direction: column;">
      <div style="height: 160px; border-radius: 8px; overflow: hidden; margin-bottom: 16px; background: #f1f5f9;">
        <img src="${post.thumbnail || post.image || 'https://thuanphat8.vn/thumbnails/posts/medium/uploads/pexels-photo-9301887.jpeg'}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://thuanphat8.vn/thumbnails/posts/medium/uploads/pexels-photo-9301887.jpeg'">
      </div>
      <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center; justify-content: space-between;">
        <span style="font-size: 11px; font-weight: 700; color: #b45309; background: #fef3c7; padding: 3px 8px; border-radius: 4px;">${post.categoryName || post.pillar || 'Tin tức'}</span>
        <span style="font-size: 12px; color: #64748b;">${post.date}</span>
      </div>
      <h3 class="card-title" style="font-size: 16px; line-height: 1.35; margin-bottom: 8px;">${post.title}</h3>
      <p class="card-description" style="font-size: 13px; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; color: #475569; margin-bottom: 14px;">${post.excerpt}</p>
      <div class="card-action-link" style="margin-top: auto; color: #b45309; font-weight: 600; font-size: 13px;">
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
  document.getElementById("modalArticlePillar").textContent = post.categoryName || post.pillar || "Dịch Vụ Kỹ Thuật";
  document.getElementById("modalArticleDate").textContent = `Ngày đăng: ${post.date}`;
  document.getElementById("modalArticleAuthor").textContent = `Tác giả: ${post.author || 'Thuận Phát Technology'}`;
  
  const coverWrap = document.getElementById("modalArticleCoverWrap");
  const coverImg = document.getElementById("modalArticleCover");
  if (coverWrap && coverImg) {
    const imgSrc = post.image || post.thumbnail;
    if (imgSrc) {
      coverImg.src = imgSrc;
      coverWrap.style.display = "block";
    } else {
      coverWrap.style.display = "none";
    }
  }

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
// 4. ROUTER / SCREEN SWITCHER (ALL SITEMAP SCREENS)
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
    "screen-lien-he",
    "screen-tin-tuc"
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
      "screen-lien-he": "#lien-he",
      "screen-tin-tuc": "#tin-tuc"
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
    "screen-lien-he": "nav-contact",
    "screen-tin-tuc": "nav-news"
  };

  const activeLinkId = navMap[screenId];
  if (activeLinkId) {
    const activeLink = document.getElementById(activeLinkId);
    if (activeLink) activeLink.classList.add("active-pill");
  }

  // Lifecycle hooks for specific screens
  if (screenId === "screen-tin-tuc") {
    renderNewsPosts();
  } else if (screenId === "screen-may-scan") {
    renderScanProducts();
  }

  // Update hero breadcrumbs if visible
  const breadcrumbCurrent = document.getElementById("heroBreadcrumbCurrent");
  if (breadcrumbCurrent) {
    const titleMap = {
      "screen-home": "Trang chủ",
      "screen-may-scan": "Máy scan chuyên dụng Ricoh",
      "screen-ha-tang": "Hạ tầng CNTT doanh nghiệp",
      "screen1": "Giải pháp chuyển đổi số",
      "screen2": "Số hoá tài liệu hành chính công",
      "screen3": "Đánh giá mức độ chuyển đổi số (DTI)",
      "screen-gioi-thieu": "Giới thiệu Thuận Phát",
      "screen-lien-he": "Liên hệ",
      "screen-tin-tuc": "Dịch vụ kỹ thuật & Thiết bị in ấn"
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
    "screen-lien-he": "lien-he",
    "screen-tin-tuc": "tin-tuc"
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
    "screen-lien-he": "#lien-he",
    "screen-tin-tuc": "#tin-tuc"
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
  } else if (hash === "#tin-tuc" || hash.includes("tin-tuc") || hash.includes("dich-vu-ky-thuat") || hash.includes("thiet-bi-in-an")) {
    switchScreen("screen-tin-tuc", false);
    if (hash.includes("dich-vu-ky-thuat")) {
      setTimeout(() => filterNewsCategory("dich-vu-ky-thuat"), 50);
    } else if (hash.includes("thiet-bi-in-an")) {
      setTimeout(() => filterNewsCategory("thiet-bi-in-an"), 50);
    }
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

  // Button loading animation effect
  const submitBtn = formEl.querySelector("button[type='submit']");
  const originalBtnContent = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.classList.add("is-loading");
    submitBtn.innerHTML = '<span class="form-spinner"></span> Đang gửi yêu cầu...';
  }

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

  // Smooth delay for micro-interaction feel
  setTimeout(() => {
    if (submitBtn) {
      submitBtn.classList.remove("is-loading");
      submitBtn.innerHTML = originalBtnContent;
    }

    const inputsArea = document.getElementById(inputsAreaId);
    const successBox = document.getElementById(successBoxId);

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
          <a href="https://zalo.me/0903233085" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: #0068ff; color: #fff; border-radius: 8px; font-weight: 600; font-size: 13.5px; text-decoration: none; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Nhắn Zalo hỗ trợ (090 323 3085)</span>
          </a>
          <a href="tel:0903233085" style="display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: #1b8046; color: #fff; border-radius: 8px; font-weight: 600; font-size: 13.5px; text-decoration: none; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>Gọi hotline trực tiếp</span>
          </a>
        `;
        successBox.appendChild(actionsDiv);
      }
    }

    // Reset form
    formEl.reset();
  }, 450);
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

  // Scroll Reveal Animations
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".pillar-feature-card, .infra-package-card, .contact-info-card, .form-wrapper, .testimonial-card, .stat-item").forEach(el => {
      el.classList.add("tp-reveal");
      revealObserver.observe(el);
    });
  }
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
        <div style="margin-bottom: 12px; color: #94a3b8;">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
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

// ============================================================
// NEWS & TECHNICAL SERVICES SECTION (CRAWLED POSTS)
// ============================================================
let currentNewsCategory = 'all';
let currentNewsSearch = '';

function renderNewsPosts() {
  if (typeof DataStore === "undefined") return;
  const container = document.getElementById("newsPostsGrid");
  if (!container) return;

  const allPosts = DataStore.getPosts().filter(p => p.status === "published");
  
  // Update counts on filter tabs
  const countAll = document.getElementById("count-news-all");
  const countDvkt = document.getElementById("count-news-dvkt");
  const countTbia = document.getElementById("count-news-tbia");
  if (countAll) countAll.textContent = allPosts.length;
  if (countDvkt) countDvkt.textContent = allPosts.filter(p => p.category === "dich-vu-ky-thuat").length;
  if (countTbia) countTbia.textContent = allPosts.filter(p => p.category === "thiet-bi-in-an").length;

  let filtered = allPosts;
  if (currentNewsCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentNewsCategory);
  }
  if (currentNewsSearch.trim()) {
    const q = currentNewsSearch.toLowerCase().trim();
    filtered = filtered.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) || 
      (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }

  // Update hero header according to selected category
  const titleEl = document.getElementById("newsScreenTitle");
  const descEl = document.getElementById("newsScreenDesc");
  const breadcrumbEl = document.getElementById("newsBreadcrumb");
  if (titleEl && descEl && breadcrumbEl) {
    if (currentNewsCategory === 'dich-vu-ky-thuat') {
      titleEl.textContent = "Dịch Vụ Kỹ Thuật";
      descEl.textContent = "Hướng dẫn sửa chữa, bảo dưỡng máy in và máy scan, mẹo xử lý lỗi in ấn DIY và tối ưu hóa chi phí in ấn vận hành.";
      breadcrumbEl.textContent = "Dịch Vụ Kỹ Thuật";
    } else if (currentNewsCategory === 'thiet-bi-in-an') {
      titleEl.textContent = "Thiết Bị In Ấn & Số Hóa";
      descEl.textContent = "Cẩm nang chọn mua máy scan, đánh giá top máy in văn phòng, thương hiệu uy tín và xu hướng công nghệ in mới nhất.";
      breadcrumbEl.textContent = "Thiết Bị In Ấn";
    } else {
      titleEl.textContent = "Dịch Vụ Kỹ Thuật & Thiết Bị In Ấn";
      descEl.textContent = "Tổng hợp kiến thức chuyên môn, hướng dẫn vận hành, cài đặt và bảo dưỡng máy in, máy scan chuyên dụng cùng cẩm nang tối ưu hóa chi phí in ấn cho doanh nghiệp.";
      breadcrumbEl.textContent = "Tin Tức & Dịch Vụ";
    }
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #64748b;">
        <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 12px; color: #94a3b8;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <p style="font-weight: 700; font-size: 17px; color: #1e293b; margin-bottom: 6px;">Không tìm thấy bài viết phù hợp</p>
        <p style="font-size: 14px;">Vui lòng thử tìm kiếm với từ khóa khác hoặc bấm chọn "Tất cả bài viết".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => `
    <article class="post-item-card" onclick="openArticleModal('${post.id}')">
      <div class="post-item-thumb-box">
        <span class="post-item-category-tag">
          ${post.categoryName || (post.category === 'dich-vu-ky-thuat' ? 'Dịch Vụ Kỹ Thuật' : 'Thiết Bị In Ấn')}
        </span>
        <img src="${post.thumbnail || post.image || 'https://thuanphat8.vn/thumbnails/posts/medium/uploads/pexels-photo-9301887.jpeg'}" alt="${post.title}" loading="lazy" onerror="this.src='https://thuanphat8.vn/thumbnails/posts/medium/uploads/pexels-photo-9301887.jpeg'">
      </div>
      <div class="post-item-body">
        <div class="post-item-meta">
          <span>${post.date || '18/07/2025'}</span>
          <span>•</span>
          <span>${post.author || 'Thuận Phát'}</span>
        </div>
        <h3 class="post-item-title">${post.title}</h3>
        <p class="post-item-excerpt">${post.excerpt || ''}</p>
        <div class="post-item-footer">
          <span>Xem chi tiết bài viết →</span>
        </div>
      </div>
    </article>
  `).join("");
}

function filterNewsCategory(cat, btn) {
  currentNewsCategory = cat;
  document.querySelectorAll('#screen-tin-tuc .filter-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const tabMap = {
      'all': 'tab-news-all',
      'dich-vu-ky-thuat': 'tab-news-dvkt',
      'thiet-bi-in-an': 'tab-news-tbia'
    };
    const targetTab = document.getElementById(tabMap[cat]);
    if (targetTab) targetTab.classList.add('active');
  }
  renderNewsPosts();
}

function handleNewsSearch(val) {
  currentNewsSearch = val || '';
  renderNewsPosts();
}

// ============================================================
// SCANNER PRODUCTS CATALOG (34 RICOH SCANNER MODELS)
// ============================================================
let currentScanCategory = 'all';
let currentScanSearch = '';
let currentScanLimit = 12;

function renderScanProducts() {
  if (typeof DataStore === "undefined") return;
  const container = document.getElementById("scannerProductsGrid");
  if (!container) return;

  const allProds = DataStore.getProducts();
  const allScans = allProds.filter(p => p.category === 'may-scan');

  // Count by categories
  const countAll = document.getElementById("count-scan-all");
  const countFi = document.getElementById("count-scan-fi");
  const countScansnap = document.getElementById("count-scan-scansnap");
  const countInd = document.getElementById("count-scan-ind");

  const fiList = allScans.filter(p => {
    const n = (p.name || '').toLowerCase();
    return n.includes('fi-8') || n.includes('fi-7') || n.includes('fi-6');
  });
  const ssList = allScans.filter(p => {
    const n = (p.name || '').toLowerCase();
    return n.includes('scansnap') || n.includes('ix') || n.includes('sv600');
  });
  const indList = allScans.filter(p => {
    const n = (p.name || '').toLowerCase();
    return n.includes('7900') || n.includes('7800') || n.includes('7700') || n.includes('8950') || n.includes('8930') || n.includes('8820');
  });

  if (countAll) countAll.textContent = allScans.length;
  if (countFi) countFi.textContent = fiList.length;
  if (countScansnap) countScansnap.textContent = ssList.length;
  if (countInd) countInd.textContent = indList.length;

  let filtered = allScans;
  if (currentScanCategory === 'fi-series') {
    filtered = fiList;
  } else if (currentScanCategory === 'scansnap') {
    filtered = ssList;
  } else if (currentScanCategory === 'industrial') {
    filtered = indList;
  }

  if (currentScanSearch.trim()) {
    const q = currentScanSearch.toLowerCase().trim();
    filtered = filtered.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.slug && p.slug.toLowerCase().includes(q)) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }

  const visibleScans = filtered.slice(0, currentScanLimit);

  if (visibleScans.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: #64748b;">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 12px; color: #94a3b8;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <p style="font-weight: 700; font-size: 16px; color: #1e293b; margin-bottom: 6px;">Không tìm thấy máy scan theo yêu cầu</p>
        <p style="font-size: 13.5px;">Vui lòng thử tìm kiếm mã model khác (vd: fi-8170, iX1600...) hoặc chọn "Tất cả máy scan".</p>
      </div>
    `;
    const loadMoreBtn = document.getElementById("loadMoreScannersContainer");
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    return;
  }

  container.innerHTML = visibleScans.map(p => {
    const isScanSnap = (p.name || '').toLowerCase().includes('scansnap');
    const isIndustrial = (p.name || '').toLowerCase().includes('7900') || (p.name || '').toLowerCase().includes('7800') || (p.name || '').toLowerCase().includes('8950');
    const badgeText = isIndustrial ? 'Công Nghiệp' : (isScanSnap ? 'Để Bàn' : 'ADF Tốc Độ Cao');

    return `
      <div class="product-item-card" style="display: flex; flex-direction: column; background: #ffffff; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.03); transition: all 0.25s ease;">
        <div style="background: #ffffff; height: 180px; display: flex; align-items: center; justify-content: center; position: relative; border-radius: 8px; overflow: hidden; padding: 10px; margin-bottom: 12px; border: 1px solid #f8fafc;">
          <span style="position: absolute; top: 8px; left: 8px; font-size: 10.5px; font-weight: 700; background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
            ${badgeText}
          </span>
          <img src="${p.image || 'favicon.svg'}" alt="${p.name}" style="max-height: 140px; max-width: 100%; object-fit: contain;" onerror="this.src='favicon.svg'">
        </div>
        <h4 style="font-size: 15.5px; font-weight: 700; color: #0f172a; margin-bottom: 6px; line-height: 1.35; min-height: 42px;">${p.name}</h4>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 12.5px; color: #b45309; font-weight: 700;">${p.price && p.price !== '0' ? p.price : 'Liên hệ báo giá'}</span>
          <span style="font-size: 11px; color: #16a34a; background: #dcfce7; font-weight: 600; padding: 2px 6px; border-radius: 4px;">Mới 100% chính hãng</span>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 14px; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 35px;">
          ${p.excerpt || 'Máy scan chuyên dụng thương hiệu Ricoh chính hãng, phân phối và bảo hành tận nơi bởi Thuận Phát.'}
        </p>
        <div style="margin-top: auto; display: flex; gap: 8px;">
          <button class="btn-primary-gold" style="flex: 1; padding: 9px 12px; font-size: 12.5px; justify-content: center; cursor: pointer;" onclick="openConsultForProduct('${(p.name || '').replace(/'/g, "\\\'")}')">
            Nhận báo giá
          </button>
          <a href="tel:0903726554" style="background: #f1f5f9; color: #334155; padding: 9px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;" title="Gọi tư vấn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
        </div>
      </div>
    `;
  }).join("");

  const loadMoreBtn = document.getElementById("loadMoreScannersContainer");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = currentScanLimit >= filtered.length ? "none" : "block";
  }
}

function filterScanCategory(cat, btn) {
  currentScanCategory = cat;
  currentScanLimit = 12;
  document.querySelectorAll('#scannerCatalogSection .filter-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderScanProducts();
}

function handleScanSearch(val) {
  currentScanSearch = val || '';
  currentScanLimit = 12;
  renderScanProducts();
}

function loadMoreScanners() {
  currentScanLimit += 12;
  renderScanProducts();
}

// Initial renders on page load
document.addEventListener("DOMContentLoaded", () => {
  if (typeof applySiteSettings === "function") applySiteSettings();
  if (typeof applyPageBanners === "function") applyPageBanners();
  renderScanProducts();
  renderNewsPosts();
  if (typeof renderDynamicProducts === "function") renderDynamicProducts();
  if (typeof renderDynamicArticles === "function") renderDynamicArticles();
  if (typeof renderDynamicSolutions === "function") renderDynamicSolutions();
});

// Realtime sync from Admin CMS changes
window.addEventListener("tp:datasync", () => {
  if (typeof applySiteSettings === "function") applySiteSettings();
  if (typeof applyPageBanners === "function") applyPageBanners();
  if (typeof renderScanProducts === "function") renderScanProducts();
  if (typeof renderNewsPosts === "function") renderNewsPosts();
  if (typeof renderDynamicProducts === "function") renderDynamicProducts();
  if (typeof renderDynamicArticles === "function") renderDynamicArticles();
  if (typeof renderDynamicSolutions === "function") renderDynamicSolutions();
});

window.addEventListener("hashchange", handleInitialRoute);


