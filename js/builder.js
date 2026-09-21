/**
 * THUANPHAT8.VN - VISUAL PAGE BUILDER CONTROLLER
 * Full Drag-and-Drop, Grid Wireframe Insertions, Inline Editing & AI Assistance
 */

// ============================================================
// AUTHENTICATION ROUTE GUARD
// ============================================================
if (typeof DataStore !== "undefined" && DataStore.auth) {
  if (!DataStore.auth.isAuthenticated()) {
    window.location.href = "login.html?redirect=builder.html";
  }
}

const PageBuilder = {
  currentDevice: "desktop",
  currentPage: "home",
  activeTab: "add",
  selectedElement: null,
  history: [],
  historyIndex: -1,
  maxHistory: 30,

  init() {
    // Check URL query param e.g. ?page=may-scan
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page") || "home";
    this.currentPage = pageParam;
    
    const pageSelect = document.getElementById("builderCurrentPageSelect");
    if (pageSelect) pageSelect.value = pageParam;

    this.bindTopBarEvents();
    this.bindSidebarTabs();
    this.bindCanvasEvents();
    this.bindKeyboardShortcuts();
    this.loadPageContent(pageParam);
  },

  // ============================================================
  // 1. TOPBAR & RESPONSIVE VIEWPORT CONTROLS
  // ============================================================
  bindTopBarEvents() {
    // Device viewport switcher buttons
    document.querySelectorAll(".device-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".device-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const device = btn.dataset.device;
        this.setDeviceViewport(device);
      });
    });

    // Undo / Redo
    const undoBtn = document.getElementById("btnUndo");
    const redoBtn = document.getElementById("btnRedo");
    if (undoBtn) undoBtn.addEventListener("click", () => this.undo());
    if (redoBtn) redoBtn.addEventListener("click", () => this.redo());

    // Save Page
    const saveBtn = document.getElementById("btnSavePage");
    if (saveBtn) saveBtn.addEventListener("click", () => this.savePage());

    // Preview Mode
    const previewBtn = document.getElementById("btnPreviewMode");
    if (previewBtn) previewBtn.addEventListener("click", () => this.togglePreviewMode());

    // AI Sparkle Assistant
    const aiBtn = document.getElementById("btnAiAssist");
    if (aiBtn) aiBtn.addEventListener("click", () => this.triggerAiSectionImprovement());
  },

  setDeviceViewport(device) {
    this.currentDevice = device;
    const viewport = document.getElementById("builderCanvasViewport");
    if (!viewport) return;

    viewport.className = `builder-canvas-viewport view-${device}`;
    this.showToast(`📱 Chuyển chế độ hiển thị: ${this.getDeviceLabel(device)}`);
  },

  getDeviceLabel(device) {
    const labels = {
      desktop: "Màn hình lớn (100%)",
      laptop: "Laptop (1200px)",
      tablet: "Máy tính bảng (768px)",
      mobile: "Điện thoại (375px)"
    };
    return labels[device] || device;
  },

  // ============================================================
  // 2. SIDEBAR TABS & ACCORDION
  // ============================================================
  bindSidebarTabs() {
    document.querySelectorAll(".sidebar-tab-btn").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        document.querySelectorAll(".sidebar-tab-btn").forEach(b => b.classList.remove("active"));
        tabBtn.classList.add("active");

        const targetTab = tabBtn.dataset.tab;
        this.activeTab = targetTab;

        document.querySelectorAll(".sidebar-content-pane").forEach(pane => {
          pane.classList.toggle("active", pane.id === `paneTab_${targetTab}`);
        });

        if (targetTab === "layers") {
          this.renderLayersTree();
        }
      });
    });

    // Wireframe layout clicks
    document.querySelectorAll(".wireframe-card").forEach(card => {
      card.addEventListener("click", () => {
        const layoutType = card.dataset.layout;
        this.insertGridLayout(layoutType);
      });
    });

    // Basic Elements click
    document.querySelectorAll(".element-item-card").forEach(card => {
      card.addEventListener("click", () => {
        const elemType = card.dataset.element;
        this.insertElement(elemType);
      });
    });

    // Search filter
    const searchInput = document.getElementById("sidebarSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".wireframe-card, .element-item-card").forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? "flex" : "none";
        });
      });
    }
  },

  // ============================================================
  // 3. CANVAS EDITING & SELECTION
  // ============================================================
  bindCanvasEvents() {
    const canvas = document.getElementById("builderCanvasContent");
    if (!canvas) return;

    // Click on canvas elements to select
    canvas.addEventListener("click", (e) => {
      const targetBlock = e.target.closest(".builder-section-block, .builder-row, .builder-column-box, .cyber-hero-section");
      if (targetBlock) {
        e.stopPropagation();
        this.selectElement(targetBlock);
      }
    });

    // Inline typing listener
    canvas.addEventListener("input", (e) => {
      if (e.target.isContentEditable) {
        this.pushHistoryState();
      }
    });
  },

  selectElement(el) {
    // Clear previous selection
    document.querySelectorAll(".is-selected").forEach(item => item.classList.remove("is-selected"));
    
    this.selectedElement = el;
    el.classList.add("is-selected");

    // Enable contenteditable on editable text items
    const textElements = el.querySelectorAll("h1, h2, h3, h4, p, a, span, button");
    textElements.forEach(t => {
      t.contentEditable = "true";
      t.spellcheck = false;
    });

    // Switch to Inspector Tab
    this.switchToTab("inspector");
    this.populateInspector(el);
  },

  switchToTab(tabName) {
    const btn = document.querySelector(`.sidebar-tab-btn[data-tab="${tabName}"]`);
    if (btn) btn.click();
  },

  // ============================================================
  // 4. GRID LAYOUT INSERTION (1-4 CỘT, 2-8, 3-7)
  // ============================================================
  insertGridLayout(layoutType) {
    const canvas = document.getElementById("builderCanvasContent");
    if (!canvas) return;

    let rowHtml = "";

    switch (layoutType) {
      case "1-col":
        rowHtml = `
          <div class="builder-row builder-section-block" data-name="Khối 1 Cột">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, -1)">⬆️</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, 1)">⬇️</button>
            </div>
            <div class="col-12 builder-column-box">
              <h3 style="font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Tiêu đề Khối Nội Dung Mới</h3>
              <p style="color: #64748b; line-height: 1.6;">Nhấp đúp chuột vào đây để nhập nội dung giới thiệu giải pháp số hoá hoặc tài liệu của doanh nghiệp bạn.</p>
            </div>
          </div>
        `;
        break;

      case "2-col":
        rowHtml = `
          <div class="builder-row builder-section-block" data-name="Khối 2 Cột Cân Bằng">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, -1)">⬆️</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, 1)">⬇️</button>
            </div>
            <div class="col-6 builder-column-box">
              <h4 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Cột Trái: Máy Scan Tốc Độ Cao</h4>
              <p style="color: #64748b; font-size: 13.5px;">Phân phối chính hãng dòng Ricoh fi-8170 tốc độ 70ppm/140ipm.</p>
            </div>
            <div class="col-6 builder-column-box">
              <h4 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Cột Phải: Phần Mềm OCR Bóc Tách</h4>
              <p style="color: #64748b; font-size: 13.5px;">Tích hợp AI OCR nhận diện tiếng Việt chính xác tới 99,8%.</p>
            </div>
          </div>
        `;
        break;

      case "3-col":
        rowHtml = `
          <div class="builder-row builder-section-block" data-name="Khối 3 Cột">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, -1)">⬆️</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, 1)">⬇️</button>
            </div>
            <div class="col-4 builder-column-box">
              <div style="font-size: 24px; margin-bottom: 6px;">⚡</div>
              <h5 style="font-size: 15px; font-weight: 700;">Tốc Độ Vượt Trội</h5>
              <p style="font-size: 12.5px; color: #64748b;">Xử lý hàng chục ngàn trang tài liệu mỗi ngày.</p>
            </div>
            <div class="col-4 builder-column-box">
              <div style="font-size: 24px; margin-bottom: 6px;">🔒</div>
              <h5 style="font-size: 15px; font-weight: 700;">Bảo Mật Tiêu Chuẩn</h5>
              <p style="font-size: 12.5px; color: #64748b;">Mã hóa dữ liệu lưu trữ theo Thông tư 02/2019/TT-BNV.</p>
            </div>
            <div class="col-4 builder-column-box">
              <div style="font-size: 24px; margin-bottom: 6px;">🤖</div>
              <h5 style="font-size: 15px; font-weight: 700;">Trí Tuệ Nhân Tạo</h5>
              <p style="font-size: 12.5px; color: #64748b;">Tự động phân loại tài liệu thông minh.</p>
            </div>
          </div>
        `;
        break;

      case "4-col":
        rowHtml = `
          <div class="builder-row builder-section-block" data-name="Khối 4 Cột">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, -1)">⬆️</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, 1)">⬇️</button>
            </div>
            <div class="col-3 builder-column-box"><strong style="font-size: 22px; color: #f97316;">500+</strong><p style="font-size: 12px; color: #64748b;">Khách hàng</p></div>
            <div class="col-3 builder-column-box"><strong style="font-size: 22px; color: #f97316;">12+</strong><p style="font-size: 12px; color: #64748b;">Năm kinh nghiệm</p></div>
            <div class="col-3 builder-column-box"><strong style="font-size: 22px; color: #f97316;">98%</strong><p style="font-size: 12px; color: #64748b;">Hài lòng</p></div>
            <div class="col-3 builder-column-box"><strong style="font-size: 22px; color: #f97316;">24/7</strong><p style="font-size: 12px; color: #64748b;">Hỗ trợ kỹ thuật</p></div>
          </div>
        `;
        break;

      case "2-8-col":
      case "8-2-col":
      case "3-7-col":
      case "7-3-col":
        rowHtml = `
          <div class="builder-row builder-section-block" data-name="Khối Tỉ Lệ Tùy Chỉnh">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, -1)">⬆️</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, 1)">⬇️</button>
            </div>
            <div class="col-3-7 builder-column-box">
              <span style="font-size: 11px; font-weight: 700; color: #f97316; text-transform: uppercase;">Tiêu điểm</span>
              <h4 style="font-size: 17px; font-weight: 800;">Chuyển Đổi Số Toàn Diện</h4>
            </div>
            <div class="col-7-3 builder-column-box">
              <p style="color: #475569; font-size: 13.5px; line-height: 1.6;">Cung cấp giải pháp trọn gói từ thiết bị scan tài liệu chuyên dụng, máy chủ lưu trữ an toàn đến đào tạo vận hành cho cơ quan và doanh nghiệp.</p>
            </div>
          </div>
        `;
        break;

      default:
        rowHtml = `<div class="builder-row builder-section-block"><div class="col-12 builder-column-box"><p>Khối mới</p></div></div>`;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rowHtml.trim();
    const newSection = tempDiv.firstElementChild;
    canvas.appendChild(newSection);

    this.selectElement(newSection);
    newSection.scrollIntoView({ behavior: "smooth", block: "center" });
    this.pushHistoryState();
    this.showToast(`✨ Đã thêm layout: ${layoutType}`);
  },

  // ============================================================
  // 5. INSERT BASIC ELEMENTS
  // ============================================================
  insertElement(elemType) {
    if (!this.selectedElement) {
      const firstCol = document.querySelector(".builder-column-box");
      if (firstCol) this.selectedElement = firstCol;
      else {
        this.insertGridLayout("1-col");
        return;
      }
    }

    const targetContainer = this.selectedElement.classList.contains("builder-column-box") 
      ? this.selectedElement 
      : (this.selectedElement.querySelector(".builder-column-box") || this.selectedElement);

    let html = "";
    switch (elemType) {
      case "heading":
        html = `<h2 style="font-size: 28px; font-weight: 800; color: #1e293b; margin-bottom: 12px;" contenteditable="true">Tiêu Đề Đột Phá Công Nghệ</h2>`;
        break;
      case "text":
        html = `<p style="font-size: 14px; color: #64748b; line-height: 1.65; margin-bottom: 14px;" contenteditable="true">Đoạn văn bản mô tả chi tiết giá trị của giải pháp số hoá giúp giảm 70% thời gian xử lý thủ tục hành chính công.</p>`;
        break;
      case "button":
        html = `<a href="#contact" class="cyber-cta-btn" style="background: #f97316; color: #ffffff; border: none; padding: 10px 20px;" contenteditable="true">Đăng Ký Tư Vấn Ngay ➔</a>`;
        break;
      case "image":
        html = `<img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800" alt="Giải pháp số hoá" style="width: 100%; border-radius: 8px; margin-bottom: 12px;">`;
        break;
    }

    const div = document.createElement("div");
    div.innerHTML = html.trim();
    const newEl = div.firstElementChild;
    targetContainer.appendChild(newEl);

    this.pushHistoryState();
    this.showToast(`Đã thêm phần tử: ${elemType}`);
  },

  // Section quick actions
  duplicateSection(btn) {
    const section = btn.closest(".builder-section-block");
    if (!section) return;
    const clone = section.cloneNode(true);
    section.parentNode.insertBefore(clone, section.nextSibling);
    this.selectElement(clone);
    this.pushHistoryState();
    this.showToast("Đã nhân bản khối nội dung!");
  },

  deleteSection(btn) {
    const section = btn.closest(".builder-section-block");
    if (!section) return;
    if (confirm("Bạn có chắc muốn xóa khối này?")) {
      section.remove();
      this.pushHistoryState();
      this.showToast("Đã xóa khối thành công.");
    }
  },

  moveSection(btn, direction) {
    const section = btn.closest(".builder-section-block");
    if (!section) return;
    if (direction === -1 && section.previousElementSibling) {
      section.parentNode.insertBefore(section, section.previousElementSibling);
    } else if (direction === 1 && section.nextElementSibling) {
      section.parentNode.insertBefore(section.nextElementSibling, section);
    }
    this.pushHistoryState();
  },

  // ============================================================
  // 6. INSPECTOR TAB POPULATOR
  // ============================================================
  populateInspector(el) {
    const titleInput = document.getElementById("inspectorElementTitle");
    const colorInput = document.getElementById("inspectorTextColor");
    const bgInput = document.getElementById("inspectorBgColor");
    const paddingInput = document.getElementById("inspectorPadding");

    if (titleInput) {
      titleInput.value = el.dataset.name || el.tagName.toLowerCase();
    }
    if (colorInput) {
      colorInput.value = rgbToHex(window.getComputedStyle(el).color) || "#1e293b";
    }
    if (bgInput) {
      bgInput.value = rgbToHex(window.getComputedStyle(el).backgroundColor) || "#ffffff";
    }
    if (paddingInput) {
      paddingInput.value = window.getComputedStyle(el).paddingTop || "24px";
    }
  },

  updateInspectorProperty(prop, value) {
    if (!this.selectedElement) return;

    switch (prop) {
      case "color":
        this.selectedElement.style.color = value;
        break;
      case "backgroundColor":
        this.selectedElement.style.backgroundColor = value;
        break;
      case "padding":
        this.selectedElement.style.padding = value;
        break;
    }
    this.pushHistoryState();
  },

  // ============================================================
  // 7. LAYERS TREE (TAB NỘI DUNG)
  // ============================================================
  renderLayersTree() {
    const layersList = document.getElementById("builderLayersList");
    if (!layersList) return;

    const sections = document.querySelectorAll(".builder-section-block, .cyber-hero-section");
    layersList.innerHTML = Array.from(sections).map((sec, idx) => `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;" onclick="PageBuilder.selectElementByIndex(${idx})">
        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">📌 ${sec.dataset.name || `Khối ${idx + 1}`}</span>
        <span style="font-size: 11px; color: #94a3b8;">${sec.className.includes("cyber-hero") ? "Hero Banner" : "Row"}</span>
      </div>
    `).join("");
  },

  selectElementByIndex(idx) {
    const sections = document.querySelectorAll(".builder-section-block, .cyber-hero-section");
    if (sections[idx]) {
      this.selectElement(sections[idx]);
      sections[idx].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },

  // ============================================================
  // 8. AI ASSISTANT INTEGRATION
  // ============================================================
  triggerAiSectionImprovement() {
    this.showToast("⏳ Trợ lý AI đang tối ưu hóa câu từ và bố cục Hero...");
    setTimeout(() => {
      const heroTitle = document.querySelector(".cyber-hero-title");
      const heroDesc = document.querySelector(".cyber-hero-desc");
      
      if (heroTitle) {
        heroTitle.textContent = "GIẢI PHÁP SỐ HÓA & TRÍ TUỆ NHÂN TẠO HÀNG ĐẦU VIỆT NAM";
      }
      if (heroDesc) {
        heroDesc.textContent = "Tiên phong ứng dụng công nghệ AI và Computer Vision đạt chuẩn Quyết định 1726/QĐ-BTTTT, giúp tự động hóa 100% quy trình xử lý hồ sơ tài liệu.";
      }
      this.pushHistoryState();
      this.showToast("✨ AI đã nâng cấp nội dung Hero Banner sắc bén & chuẩn SEO!");
    }, 600);
  },

  // ============================================================
  // 9. HISTORY UNDO / REDO & PERSISTENCE
  // ============================================================
  loadInitialCanvasState() {
    const canvas = document.getElementById("builderCanvasContent");
    if (canvas) {
      this.history.push(canvas.innerHTML);
      this.historyIndex = 0;
    }
  },

  pushHistoryState() {
    const canvas = document.getElementById("builderCanvasContent");
    if (!canvas) return;

    // Truncate future if redo path exists
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    this.history.push(canvas.innerHTML);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    this.updateUndoRedoBtns();
  },

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const canvas = document.getElementById("builderCanvasContent");
      if (canvas) canvas.innerHTML = this.history[this.historyIndex];
      this.updateUndoRedoBtns();
      this.showToast("↶ Đã hoàn tác thao tác");
    }
  },

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const canvas = document.getElementById("builderCanvasContent");
      if (canvas) canvas.innerHTML = this.history[this.historyIndex];
      this.updateUndoRedoBtns();
      this.showToast("↷ Đã làm lại thao tác");
    }
  },

  updateUndoRedoBtns() {
    const undoBtn = document.getElementById("btnUndo");
    const redoBtn = document.getElementById("btnRedo");
    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  },

  // ============================================================
  // 10. MULTI-PAGE BUILDER ENGINE (DÙNG CHO TOÀN BỘ WEBSITE)
  // ============================================================
  switchPage(newPageId) {
    const canvas = document.getElementById("builderCanvasContent");
    if (canvas) {
      // Auto save current page before switching
      localStorage.setItem("thuanphat_builder_page_" + this.currentPage, canvas.innerHTML);
    }

    this.currentPage = newPageId;
    const pageSelect = document.getElementById("builderCurrentPageSelect");
    if (pageSelect) pageSelect.value = newPageId;

    this.loadPageContent(newPageId);
  },

  getPageName(pageId) {
    const names = {
      "home": "Trang chủ (/)",
      "may-scan": "Máy scan chuyên dụng (/may-scan/)",
      "ha-tang-cntt": "Hạ tầng CNTT (/ha-tang-cntt/)",
      "giai-phap-chuyen-doi-so": "Giải pháp CĐS (/giai-phap-chuyen-doi-so/)",
      "so-hoa-tai-lieu": "Số hoá hồ sơ tài liệu (/so-hoa-tai-lieu/)",
      "dti": "Bộ công cụ Khảo sát DTI (/dti/)",
      "gioi-thieu": "Giới thiệu Thuận Phát (/gioi-thieu)",
      "lien-he": "Liên hệ & Báo giá (/lien-he)"
    };
    return names[pageId] || pageId;
  },

  loadPageContent(pageId) {
    const canvas = document.getElementById("builderCanvasContent");
    if (!canvas) return;

    const saved = localStorage.getItem("thuanphat_builder_page_" + pageId);
    if (saved) {
      canvas.innerHTML = saved;
    } else {
      canvas.innerHTML = this.getPageDefaultTemplate(pageId);
    }

    // Enable contenteditable on editable text items
    canvas.querySelectorAll("h1, h2, h3, h4, p, a, span, button").forEach(t => {
      t.contentEditable = "true";
      t.spellcheck = false;
    });

    // Reset history
    this.history = [canvas.innerHTML];
    this.historyIndex = 0;
    this.updateUndoRedoBtns();

    this.showToast(`📄 Đã mở: ${this.getPageName(pageId)}`);
  },

  savePage() {
    const canvas = document.getElementById("builderCanvasContent");
    if (!canvas) return;

    const htmlContent = canvas.innerHTML;
    // Save to LocalStorage specifically for this page
    localStorage.setItem("thuanphat_builder_page_" + this.currentPage, htmlContent);

    // Sync Hero title with DataStore settings if editing homepage
    if (this.currentPage === "home") {
      const heroTitleEl = canvas.querySelector(".cyber-hero-title");
      const heroDescEl = canvas.querySelector(".cyber-hero-desc");
      if (window.DataStore && heroTitleEl && heroDescEl) {
        const curSettings = DataStore.getSettings();
        curSettings.heroTitle = heroTitleEl.textContent.trim();
        curSettings.heroDesc = heroDescEl.textContent.trim();
        DataStore.saveSettings(curSettings);
      }
    }

    this.showToast(`💾 Đã lưu toàn bộ nội dung [${this.getPageName(this.currentPage)}] thành công!`);
  },

  getPageDefaultTemplate(pageId) {
    switch (pageId) {
      case "may-scan":
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Máy Scan Chuyên Dụng" style="background-color: #0b1528;">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">DANH MỤC SẢN PHẨM CHÍNH HÃNG</span>
                <h1 class="cyber-hero-title" contenteditable="true">MÁY SCAN TÀI LIỆU CHUYÊN DỤNG RICOH & FUJITSU</h1>
                <p class="cyber-hero-desc" contenteditable="true">Phân phối các dòng máy quét 2 mặt tự động tốc độ cao từ 40ppm đến 140ppm, cảm biến chống kẹt giấy siêu âm iSOP, bảo hành chính hãng 24 tháng.</p>
                <a href="#contact" class="cyber-cta-btn" contenteditable="true">NHẬN BÁO GIÁ ĐẠI LÝ ➔</a>
              </div>
            </div>
          </section>
          <div class="builder-row builder-section-block" data-name="Lưới 3 Dòng Máy Scan Nổi Bật">
            <div class="col-4 builder-column-box">
              <h3 style="font-size: 18px; font-weight: 700;">Ricoh fi-8170</h3>
              <p style="color: #64748b; font-size: 13px;">Tốc độ: 70 ppm / 140 ipm. Khay nạp: 100 tờ. Giá: 24.500.000 đ</p>
            </div>
            <div class="col-4 builder-column-box">
              <h3 style="font-size: 18px; font-weight: 700;">Ricoh fi-8290</h3>
              <p style="color: #64748b; font-size: 13px;">Tốc độ: 90 ppm / 180 ipm. Quét ADF kết hợp mặt kính phẳng Flatbed.</p>
            </div>
            <div class="col-4 builder-column-box">
              <h3 style="font-size: 18px; font-weight: 700;">ScanSnap iX1600</h3>
              <p style="color: #64748b; font-size: 13px;">Tốc độ: 40 ppm. Kết nối Wi-Fi, màn hình cảm ứng 4.3 inch.</p>
            </div>
          </div>
        `;

      case "ha-tang-cntt":
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Hạ Tầng CNTT" style="background-color: #0f172a;">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">DỊCH VỤ TRỌN GÓI</span>
                <h1 class="cyber-hero-title" contenteditable="true">HẠ TẦNG CNTT DOANH NGHIỆP & HÀNH CHÍNH CÔNG</h1>
                <p class="cyber-hero-desc" contenteditable="true">Tư vấn, thiết kế và thi công hệ thống máy chủ HPE Server, mạng lưu trữ SAN/NAS an toàn dữ liệu, sao lưu tự động và bảo mật đa lớp.</p>
                <a href="#contact" class="cyber-cta-btn" contenteditable="true">ĐĂNG KÝ KHẢO SÁT HẠ TẦNG ➔</a>
              </div>
            </div>
          </section>
        `;

      case "giai-phap-chuyen-doi-so":
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Chuyển Đổi Số" style="background-color: #091e3a;">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">TRỌNG TÂM PILLAR P6</span>
                <h1 class="cyber-hero-title" contenteditable="true">GIẢI PHÁP CHUYỂN ĐỔI SỐ TOÀN DIỆN</h1>
                <p class="cyber-hero-desc" contenteditable="true">Hệ sinh thái giải pháp số hóa toàn trình: Logistics CĐS, Văn phòng số e-Office, Số hóa hồ sơ lưu trữ và Bộ công cụ đánh giá DTI theo Quyết định 1726/QĐ-BTTTT.</p>
                <a href="#contact" class="cyber-cta-btn" contenteditable="true">KHÁM PHÁ 7 GIẢI PHÁP ➔</a>
              </div>
            </div>
          </section>
        `;

      case "so-hoa-tai-lieu":
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Số Hoá Tài Liệu" style="background-color: #111827;">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">TIÊU CHUẨN THÔNG TƯ 02/2019/TT-BNV</span>
                <h1 class="cyber-hero-title" contenteditable="true">DỊCH VỤ SỐ HOÁ HỒ SƠ TÀI LIỆU LƯU TRỮ</h1>
                <p class="cyber-hero-desc" contenteditable="true">Quy trình bóc tách tài liệu chuẩn lưu trữ nhà nước, ứng dụng AI OCR nhận diện tiếng Việt chính xác 99.8%, lập chỉ mục và lưu trữ lâu dài an toàn.</p>
                <a href="#contact" class="cyber-cta-btn" contenteditable="true">TƯ VẤN QUY TRÌNH SỐ HOÁ ➔</a>
              </div>
            </div>
          </section>
        `;

      case "dti":
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Khảo Sát DTI" style="background-color: #0c2340;">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">QUYẾT ĐỊNH 1726/QĐ-BTTTT</span>
                <h1 class="cyber-hero-title" contenteditable="true">BỘ CÔNG CỤ ĐÁNH GIÁ MỨC ĐỘ CHUYỂN ĐỔI SỐ (DTI)</h1>
                <p class="cyber-hero-desc" contenteditable="true">Trắc nghiệm trực tuyến 6 trụ cột DTI, tự động tính điểm và vẽ biểu đồ Radar Spider Chart trực quan giúp định hình lộ trình số hoá phù hợp.</p>
                <a href="index.html#quiz" class="cyber-cta-btn" contenteditable="true">BẮT ĐẦU ĐÁNH GIÁ NGAY ➔</a>
              </div>
            </div>
          </section>
        `;

      case "gioi-thieu":
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Giới Thiệu" style="background-color: #1e1e24;">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">VỀ CHÚNG TÔI</span>
                <h1 class="cyber-hero-title" contenteditable="true">THUẬN PHÁT TECHNOLOGY — 12+ NĂM TIÊN PHONG SỐ HOÁ</h1>
                <p class="cyber-hero-desc" contenteditable="true">Đối tác ủy quyền chính hãng của Ricoh, Fujitsu và Hewlett Packard Enterprise (HPE) tại Việt Nam, đã triển khai thành công hơn 500+ dự án công và tư.</p>
                <a href="#contact" class="cyber-cta-btn" contenteditable="true">LIÊN HỆ ĐỐI TÁC ➔</a>
              </div>
            </div>
          </section>
        `;

      case "lien-he":
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Liên Hệ" style="background-color: #1a202c;">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">HỖ TRỢ 24/7</span>
                <h1 class="cyber-hero-title" contenteditable="true">LIÊN HỆ TƯ VẤN & BÁO GIÁ THIẾT BỊ SỐ HOÁ</h1>
                <p class="cyber-hero-desc" contenteditable="true">Trụ sở Hà Nội: Số 32, Ngõ 42, Phố Triều Khúc, Thanh Xuân. Hotline: 0901 234 567. Email: contact@thuanphat8.vn.</p>
                <a href="tel:0901234567" class="cyber-cta-btn" contenteditable="true">GỌI HOTLINE NGAY ➔</a>
              </div>
            </div>
          </section>
        `;

      default: // home
        return `
          <section class="cyber-hero-section builder-section-block is-selected" data-name="Hero Section Số Hóa AI">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, -1)">⬆️</button>
              <button class="floating-tool-btn" onclick="PageBuilder.moveSection(this, 1)">⬇️</button>
            </div>
            <div class="cyber-hero-bg-network"></div>
            <div class="cyber-hero-content">
              <div class="builder-highlight-box">
                <span class="cyber-brand-label" contenteditable="true">THUẬN PHÁT</span>
                <h1 class="cyber-hero-title" contenteditable="true">GIẢI PHÁP SỐ HÓA<br>HÀNG ĐẦU VIỆT NAM</h1>
                <p class="cyber-hero-desc" contenteditable="true">Cung cấp công cụ cho các doanh nghiệp tăng tốc chuyển đổi số và tự động hóa thông minh bằng cách sử dụng công nghệ AI và Computer Vision tiên phong của chúng tôi.</p>
                <div>
                  <a href="#contact" class="cyber-cta-btn" contenteditable="true">
                    <span>KHÁM PHÁ NGAY</span>
                    <span>⟶</span>
                  </a>
                </div>
              </div>
              <div class="cyber-slider-counter">
                <span>02</span>
                <div class="cyber-slider-bar"></div>
                <span>02</span>
                <div class="cyber-slider-arrows">
                  <span>←</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </section>
          <div class="builder-row builder-section-block" data-name="Khối 3 Cột Tính Năng">
            <div class="floating-element-toolbar">
              <button class="floating-tool-btn" onclick="PageBuilder.duplicateSection(this)">📋 Nhân bản</button>
              <button class="floating-tool-btn" onclick="PageBuilder.deleteSection(this)">🗑️ Xóa</button>
            </div>
            <div class="col-4 builder-column-box">
              <div style="font-size: 26px; margin-bottom: 8px;">🖨️</div>
              <h3 style="font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 6px;" contenteditable="true">Máy Scan Ricoh Chính Hãng</h3>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6;" contenteditable="true">Tốc độ quét siêu tốc 70ppm/140ipm, cảm biến chống dính giấy thông minh bảo vệ hồ sơ tuyệt đối.</p>
            </div>
            <div class="col-4 builder-column-box">
              <div style="font-size: 26px; margin-bottom: 8px;">🧠</div>
              <h3 style="font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 6px;" contenteditable="true">AI OCR Bóc Tách Dữ Liệu</h3>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6;" contenteditable="true">Nhận diện tiếng Việt và các biểu mẫu hành chính phức tạp với độ chuẩn xác lên đến 99,8%.</p>
            </div>
            <div class="col-4 builder-column-box">
              <div style="font-size: 26px; margin-bottom: 8px;">📊</div>
              <h3 style="font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 6px;" contenteditable="true">Chuẩn Đánh Giá DTI</h3>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6;" contenteditable="true">Bộ giải pháp đạt chuẩn Quyết định 1726/QĐ-BTTTT và Thông tư 02/2019/TT-BNV.</p>
            </div>
          </div>
        `;
    }
  },

  togglePreviewMode() {
    window.open("index.html", "_blank");
  },

  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        this.savePage();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        this.redo();
      }
    });
  },

  showToast(message) {
    let toast = document.getElementById("builderToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "builderToast";
      toast.className = "builder-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }
};

// Helper color converter
function rgbToHex(rgb) {
  if (!rgb || !rgb.startsWith("rgb")) return rgb;
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length < 3) return "#ffffff";
  return "#" + rgbValues.slice(0, 3).map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Initializer
document.addEventListener("DOMContentLoaded", () => {
  PageBuilder.init();
});
