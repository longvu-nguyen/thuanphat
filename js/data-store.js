/**
 * THUANPHAT8.VN - CENTRAL DATA STORE
 * Quản lý dữ liệu tập trung, đồng bộ 2 chiều Realtime giữa Trang Chủ (index.html) và Trang Quản Trị (admin.html).
 * Dữ liệu được nạp từ các file json trong data/ và lưu trữ linh hoạt tại localStorage.
 */

const TP_STORAGE = {
  PRODUCTS: "thuanphat_products_v2",
  POSTS: "thuanphat_posts_v2",
  SOLUTIONS: "thuanphat_solutions_v2",
  SETTINGS: "thuanphat_settings_v2",
  LEADS: "thuanphat_leads_v2",
  ADMINS: "thuanphat_admins_v2",
  CURRENT_ADMIN: "thuanphat_current_admin_v2"
};

const DataStore = {
  channel: null,

  init() {
    this.initRealtimeChannel();
    this.ensureDataLoaded();
  },

  initRealtimeChannel() {
    try {
      if (typeof BroadcastChannel !== "undefined" && !this.channel) {
        this.channel = new BroadcastChannel("tp_cms_sync");
        this.channel.onmessage = (event) => {
          if (event && event.data) {
            this.handleRemoteSync(event.data);
          }
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel not available:", e);
    }
  },

  broadcast(type, payload) {
    try {
      if (this.channel) {
        this.channel.postMessage({ type, payload, timestamp: Date.now() });
      }
    } catch (e) {}
  },

  handleRemoteSync(data) {
    // Notify listeners (UI auto re-render)
    window.dispatchEvent(new CustomEvent("tp:datasync", { detail: data }));
  },

  // Ensure default data exists in localStorage
  async ensureDataLoaded() {
    if (!localStorage.getItem(TP_STORAGE.PRODUCTS)) {
      await this.loadDefaultFromJSON("products", "./data/products.json", TP_STORAGE.PRODUCTS);
    }
    if (!localStorage.getItem(TP_STORAGE.POSTS)) {
      await this.loadDefaultFromJSON("posts", "./data/posts.json", TP_STORAGE.POSTS);
    }
    if (!localStorage.getItem(TP_STORAGE.SOLUTIONS)) {
      await this.loadDefaultFromJSON("solutions", "./data/solutions.json", TP_STORAGE.SOLUTIONS);
    }
    const currSettings = this.getSettings();
    if (!currSettings || !currSettings.pages) {
      await this.loadDefaultFromJSON("settings", "./data/settings.json", TP_STORAGE.SETTINGS);
    }
    if (!localStorage.getItem(TP_STORAGE.ADMINS)) {
      localStorage.setItem(TP_STORAGE.ADMINS, JSON.stringify([
        {
          id: "admin-1",
          username: "admin",
          password: "admin123",
          fullname: "Quản Trị Viên Tối Cao",
          role: "super_admin",
          roleLabel: "Super Admin (Toàn quyền)",
          createdAt: new Date().toISOString()
        },
        {
          id: "admin-2",
          username: "editor",
          password: "editor123",
          fullname: "Biên Tập Viên Content",
          role: "editor",
          roleLabel: "Biên Tập Viên (Content / SEO)",
          createdAt: new Date().toISOString()
        },
        {
          id: "admin-3",
          username: "quyen_seo",
          password: "seo123",
          fullname: "Quyên (SEO Specialist)",
          role: "editor",
          roleLabel: "Biên Tập Viên (Content / SEO)",
          createdAt: new Date().toISOString()
        }
      ]));
    }
    if (!localStorage.getItem(TP_STORAGE.LEADS)) {
      localStorage.setItem(TP_STORAGE.LEADS, JSON.stringify([
        {
          id: "lead-1",
          fullname: "Nguyễn Văn Tuấn",
          phone: "0912 345 678",
          email: "tuannv@sme-corp.vn",
          company: "Công ty Cổ phần Vận tải Á Châu",
          service: "Máy scan Ricoh fi-8170 (2 chiếc)",
          notes: "Cần báo giá dự án và hợp đồng cho văn phòng mới",
          status: "new",
          date: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: "lead-2",
          fullname: "Trần Thị Mai Lan",
          phone: "0988 776 655",
          email: "lan.tran@hcm-edu.vn",
          company: "Trường Quốc tế Saigon Gateway",
          service: "Dịch Vụ Kỹ Thuật & Bảo Dưỡng Máy In",
          notes: "Cần khảo sát bảo trì hệ thống 12 máy in văn phòng định kỳ hàng tháng",
          status: "contacted",
          date: new Date(Date.now() - 86400000).toISOString()
        }
      ]));
    }
  },

  async loadDefaultFromJSON(key, url, storageKey) {
    try {
      const res = await fetch(url + "?v=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn("Could not fetch " + url + ", fallback to empty array");
    }
    return null;
  },

  // ==========================================
  // 1. PRODUCTS CRUD
  // ==========================================
  getProducts() {
    try {
      const raw = localStorage.getItem(TP_STORAGE.PRODUCTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveProducts(products) {
    localStorage.setItem(TP_STORAGE.PRODUCTS, JSON.stringify(products));
    this.broadcast("PRODUCTS_UPDATED", { count: products.length });
  },

  saveProduct(item) {
    const prods = this.getProducts();
    const idx = prods.findIndex(p => p.id === item.id);
    if (idx >= 0) {
      prods[idx] = { ...prods[idx], ...item, updatedAt: new Date().toISOString() };
    } else {
      item.id = item.id || "tp-prod-" + Date.now();
      prods.unshift(item);
    }
    this.saveProducts(prods);
    return item;
  },

  deleteProduct(id) {
    let prods = this.getProducts();
    prods = prods.filter(p => p.id !== id);
    this.saveProducts(prods);
  },

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  },

  // ==========================================
  // 2. POSTS / NEWS CRUD
  // ==========================================
  getPosts() {
    try {
      const raw = localStorage.getItem(TP_STORAGE.POSTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  savePosts(posts) {
    localStorage.setItem(TP_STORAGE.POSTS, JSON.stringify(posts));
    this.broadcast("POSTS_UPDATED", { count: posts.length });
  },

  savePost(item) {
    const posts = this.getPosts();
    const idx = posts.findIndex(p => p.id === item.id);
    if (idx >= 0) {
      posts[idx] = { ...posts[idx], ...item, updatedAt: new Date().toISOString() };
    } else {
      item.id = item.id || "post-" + Date.now();
      item.views = item.views || 1;
      item.status = item.status || "published";
      item.date = item.date || new Date().toISOString().split("T")[0];
      posts.unshift(item);
    }
    this.savePosts(posts);
    return item;
  },

  deletePost(id) {
    let posts = this.getPosts();
    posts = posts.filter(p => p.id !== id);
    this.savePosts(posts);
  },

  getPostById(id) {
    return this.getPosts().find(p => p.id === id) || null;
  },

  // ==========================================
  // 3. LEADS & CONTACTS CRM
  // ==========================================
  getLeads() {
    try {
      const raw = localStorage.getItem(TP_STORAGE.LEADS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveLeads(leads) {
    localStorage.setItem(TP_STORAGE.LEADS, JSON.stringify(leads));
    this.broadcast("LEADS_UPDATED", { count: leads.length });
  },

  addLead(leadData) {
    const leads = this.getLeads();
    const newLead = {
      id: "lead-" + Date.now(),
      fullname: leadData.fullname || "Khách hàng liên hệ",
      phone: leadData.phone || "",
      email: leadData.email || "",
      company: leadData.company || "",
      service: leadData.service || leadData.solutionCategory || "Tư vấn tổng quát",
      notes: leadData.notes || "",
      status: "new",
      date: new Date().toISOString()
    };
    leads.unshift(newLead);
    this.saveLeads(leads);
    this.broadcast("NEW_LEAD", newLead);
    return newLead;
  },

  updateLeadStatus(id, newStatus) {
    const leads = this.getLeads();
    const item = leads.find(l => l.id === id);
    if (item) {
      item.status = newStatus;
      this.saveLeads(leads);
    }
  },

  deleteLead(id) {
    let leads = this.getLeads();
    leads = leads.filter(l => l.id !== id);
    this.saveLeads(leads);
  },

  // ==========================================
  // 4. SETTINGS
  // ==========================================
  getSettings() {
    try {
      const raw = localStorage.getItem(TP_STORAGE.SETTINGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.pages) return parsed;
      }
      const defaultSettings = {
        companyName: "CÔNG TY TNHH THƯƠNG MẠI ĐẦU TƯ VÀ SẢN XUẤT THUẬN PHÁT",
        brandName: "THUẬN PHÁT TECHNOLOGY",
        hotline: "0903 726 554",
        email: "contact@thuanphat8.vn",
        logoUrl: "assets/logo.png",
        pages: {
          "home": {
            name: "Trang Chủ",
            badge: "ĐẠI LÝ CHÍNH HÃNG RICOH • HP • KYOCERA",
            title: "Nhà Cung Cấp Thiết Bị & Giải Pháp Công Nghệ Toàn Diện Cho Doanh Nghiệp",
            subtitle: "Chuyên sâu máy scan Ricoh, hạ tầng máy chủ HPE, máy in Kyocera và giải pháp số hoá tài liệu lưu trữ, chuyển đổi số DTI toàn diện.",
            bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
            banners: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"],
            ctaText: "Khám Phá Sản Phẩm"
          },
          "may-scan": {
            name: "Máy Scan Ricoh",
            badge: "RICOH AUTHORIZED PARTNER VIETNAM",
            title: "Máy Scan Tài Liệu Ricoh Chuyên Dụng Tốc Độ Cao Cho Văn Phòng & Dự Án",
            subtitle: "Thuận Phát phân phối chính hãng 100% đầy đủ 34 dòng máy quét Ricoh fi Series và ScanSnap. Giải pháp scan tự động 2 mặt ADF, nhận dạng OCR tiếng Việt, chống nạp giấy đúp bằng sóng siêu âm, bảo hành chính hãng tận nơi 12-24 tháng.",
            bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
            banners: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"],
            ctaText: "Nhận báo giá dự án"
          },
          "ha-tang": {
            name: "Hạ Tầng CNTT",
            badge: "HPE AUTHORIZED PARTNER VIETNAM",
            title: "Hạ Tầng CNTT & Giải Pháp Máy Chủ HPE ProLiant Gen11",
            subtitle: "Cung cấp máy chủ HPE Gen11, giải pháp lưu trữ SAN/NAS, thiết bị mạng Cisco/Aruba và chiến lược an toàn dữ liệu 3-2-1 chống Ransomware 24/7.",
            bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
            banners: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80"],
            ctaText: "Tư vấn hạ tầng server"
          },
          "giai-phap-so": {
            name: "Giải Pháp Số & DTI",
            badge: "HỆ THỐNG CHUYỂN ĐỔI SỐ TOÀN DIỆN",
            title: "Hệ Thống Giải Pháp Số Hoá & Đánh Giá Năng Lực Số Doanh Nghiệp DTI",
            subtitle: "Cấu hình linh hoạt theo mô hình 3 cấp kết nối phần cứng máy scan Ricoh, máy chủ HP và giải pháp số hoá hồ sơ theo Thông tư 02/2019/TT-BNV.",
            bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
            banners: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"],
            ctaText: "Đăng ký tư vấn lộ trình"
          },
          "tin-tuc": {
            name: "Tin Tức & Dịch Vụ",
            badge: "TRUNG TÂM KIẾN THỨC & DỊCH VỤ KỸ THUẬT",
            title: "Tin Tức, Cẩm Nang In Ấn & Dịch Vụ Kỹ Thuật Chuyên Sâu",
            subtitle: "Tổng hợp hướng dẫn lựa chọn máy scan, bảo trì bảo dưỡng máy in và giải pháp công nghệ văn phòng chuẩn hãng.",
            bgImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80",
            banners: ["https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80"],
            ctaText: "Khám phá bài viết"
          },
          "gioi-thieu": {
            name: "Giới Thiệu",
            badge: "VỀ THUẬN PHÁT TECHNOLOGY",
            title: "Đồng Hành Cùng Doanh Nghiệp & Khối Cơ Quan Trong Kỷ Nguyên Số",
            subtitle: "Hơn 10 năm kinh nghiệm trong lĩnh vực cung cấp thiết bị máy scan chuyên dụng, máy in và tích hợp giải pháp chuyển đổi số toàn diện tại Việt Nam.",
            bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
            banners: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"],
            ctaText: "Liên hệ hợp tác"
          },
          "lien-he": {
            name: "Liên Hệ",
            badge: "HỖ TRỢ TƯ VẤN TRỰC TIẾP",
            title: "Liên Hệ Với Đội Ngũ Chuyên Gia Thuận Phát Technology",
            subtitle: "Chúng tôi sẵn sàng khảo sát hiện trạng, tư vấn cấu hình thiết bị và gửi bảng báo giá dự án cạnh tranh nhất trong vòng 15 phút.",
            bgImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80",
            banners: ["https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80"],
            ctaText: "Gửi yêu cầu tư vấn"
          }
        }
      };
      this.saveSettings(defaultSettings);
      return defaultSettings;
    } catch (e) {
      return {};
    }
  },

  saveSettings(settings) {
    localStorage.setItem(TP_STORAGE.SETTINGS, JSON.stringify(settings));
    this.broadcast("SETTINGS_UPDATED", settings);
  },

  // Banner & Pages management
  getPages() {
    const s = this.getSettings();
    return s.pages || {};
  },

  getPage(pageKey) {
    const pages = this.getPages();
    const p = pages[pageKey];
    if (p) {
      if (!Array.isArray(p.banners)) {
        p.banners = p.bgImage ? [p.bgImage] : [];
      }
    }
    return p || null;
  },

  updatePage(pageKey, pageData) {
    const s = this.getSettings();
    if (!s.pages) s.pages = {};
    const existing = s.pages[pageKey] || {};
    
    // Maintain banners array
    let banners = Array.isArray(pageData.banners) ? pageData.banners : (Array.isArray(existing.banners) ? existing.banners : []);
    if (pageData.bgImage && !banners.includes(pageData.bgImage)) {
      banners.unshift(pageData.bgImage);
    }

    s.pages[pageKey] = {
      ...existing,
      ...pageData,
      banners
    };
    this.saveSettings(s);
    this.broadcast("PAGE_UPDATED", { pageKey, pageData: s.pages[pageKey] });
    return s.pages[pageKey];
  },

  addPageBanner(pageKey, imageUrl) {
    if (!imageUrl) return null;
    const p = this.getPage(pageKey);
    if (!p) return null;
    const banners = Array.isArray(p.banners) ? [...p.banners] : [];
    if (!banners.includes(imageUrl)) {
      banners.unshift(imageUrl);
    }
    return this.updatePage(pageKey, { bgImage: imageUrl, banners });
  },

  setPageActiveBanner(pageKey, imageUrl) {
    return this.updatePage(pageKey, { bgImage: imageUrl });
  },

  removePageBanner(pageKey, imageUrl) {
    const p = this.getPage(pageKey);
    if (!p) return null;
    let banners = (p.banners || []).filter(u => u !== imageUrl);
    let bgImage = p.bgImage === imageUrl ? (banners[0] || "") : p.bgImage;
    return this.updatePage(pageKey, { bgImage, banners });
  },

  // ==========================================
  // ADMIN AUTHENTICATION & ROLES
  // ==========================================
  getAdmins() {
    try {
      const raw = localStorage.getItem(TP_STORAGE.ADMINS);
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      const defaultAdmins = [
        {
          id: "admin-1",
          username: "admin",
          password: "admin123",
          fullname: "Quản Trị Viên Tối Cao",
          role: "super_admin",
          roleLabel: "Super Admin (Toàn quyền)",
          createdAt: "2026-01-01T00:00:00.000Z"
        },
        {
          id: "admin-2",
          username: "editor",
          password: "editor123",
          fullname: "Biên Tập Viên Content",
          role: "editor",
          roleLabel: "Biên Tập Viên (Content / SEO)",
          createdAt: "2026-01-01T00:00:00.000Z"
        },
        {
          id: "admin-3",
          username: "quyen_seo",
          password: "seo123",
          fullname: "Quyên (SEO Specialist)",
          role: "editor",
          roleLabel: "Biên Tập Viên (Content / SEO)",
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ];
      this.saveAdmins(defaultAdmins);
      return defaultAdmins;
    } catch (e) {
      return [
        {
          id: "admin-1",
          username: "admin",
          password: "admin123",
          fullname: "Quản Trị Viên Tối Cao",
          role: "super_admin",
          roleLabel: "Super Admin (Toàn quyền)"
        }
      ];
    }
  },

  saveAdmins(admins) {
    localStorage.setItem(TP_STORAGE.ADMINS, JSON.stringify(admins));
  },

  loginAdmin(username, password) {
    const cleanUser = (username || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();
    const admins = this.getAdmins();
    const found = admins.find(a => a.username.toLowerCase() === cleanUser && a.password === cleanPass);
    if (found) {
      const role = found.role || "super_admin";
      const sessionUser = {
        id: found.id,
        username: found.username,
        fullname: found.fullname || "Quản Trị Viên",
        role: role,
        roleLabel: found.roleLabel || (role === "editor" ? "Biên Tập Viên (Content / SEO)" : "Super Admin (Toàn quyền)"),
        loginAt: new Date().toISOString()
      };
      sessionStorage.setItem(TP_STORAGE.CURRENT_ADMIN, JSON.stringify(sessionUser));
      localStorage.setItem(TP_STORAGE.CURRENT_ADMIN, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }
    return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
  },

  registerAdmin({ username, password, fullname, role }) {
    const cleanUser = (username || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();
    const cleanName = (fullname || "").trim();
    const userRole = role === "super_admin" ? "super_admin" : "editor";
    const userRoleLabel = userRole === "super_admin" ? "Super Admin (Toàn quyền)" : "Biên Tập Viên (Content / SEO)";

    if (!cleanUser || !cleanPass) {
      return { success: false, message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!" };
    }
    if (cleanPass.length < 6) {
      return { success: false, message: "Mật khẩu phải từ 6 ký tự trở lên!" };
    }

    const admins = this.getAdmins();
    if (admins.some(a => a.username.toLowerCase() === cleanUser)) {
      return { success: false, message: "Tên đăng nhập này đã được sử dụng!" };
    }

    const newAdmin = {
      id: "admin-" + Date.now(),
      username: cleanUser,
      password: cleanPass,
      fullname: cleanName || cleanUser,
      role: userRole,
      roleLabel: userRoleLabel,
      createdAt: new Date().toISOString()
    };
    admins.push(newAdmin);
    this.saveAdmins(admins);
    return { success: true, user: newAdmin };
  },

  deleteAdmin(id) {
    const current = this.getCurrentAdmin();
    if (!current || current.role !== "super_admin") {
      return { success: false, message: "Chỉ Super Admin mới có quyền xóa tài khoản quản trị!" };
    }
    if (current.id === id) {
      return { success: false, message: "Không thể tự xóa tài khoản đang đăng nhập!" };
    }
    let admins = this.getAdmins();
    admins = admins.filter(a => a.id !== id);
    this.saveAdmins(admins);
    return { success: true };
  },

  getCurrentAdmin() {
    try {
      const raw = sessionStorage.getItem(TP_STORAGE.CURRENT_ADMIN) || localStorage.getItem(TP_STORAGE.CURRENT_ADMIN);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  logoutAdmin() {
    sessionStorage.removeItem(TP_STORAGE.CURRENT_ADMIN);
    localStorage.removeItem(TP_STORAGE.CURRENT_ADMIN);
  },

  // ==========================================
  // 5. SOLUTIONS
  // ==========================================
  getSolutions() {
    try {
      const raw = localStorage.getItem(TP_STORAGE.SOLUTIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  // ==========================================
  // 6. BACKUP & RESTORE DATA (JSON EXPORT/IMPORT)
  // ==========================================
  exportAllData() {
    return {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      posts: this.getPosts(),
      solutions: this.getSolutions(),
      settings: this.getSettings(),
      leads: this.getLeads()
    };
  },

  importAllData(dataObj) {
    if (!dataObj || typeof dataObj !== "object") return false;
    if (Array.isArray(dataObj.products)) this.saveProducts(dataObj.products);
    if (Array.isArray(dataObj.posts)) this.savePosts(dataObj.posts);
    if (dataObj.settings) this.saveSettings(dataObj.settings);
    if (Array.isArray(dataObj.leads)) this.saveLeads(dataObj.leads);
    return true;
  },

  async resetToDefault() {
    localStorage.removeItem(TP_STORAGE.PRODUCTS);
    localStorage.removeItem(TP_STORAGE.POSTS);
    localStorage.removeItem(TP_STORAGE.SOLUTIONS);
    localStorage.removeItem(TP_STORAGE.SETTINGS);
    localStorage.removeItem(TP_STORAGE.LEADS);
    await this.ensureDataLoaded();
    this.broadcast("DATABASE_RESET", {});
  }
};

// Auto initialize on load
DataStore.init();

// Support CommonJS for node testing if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = DataStore;
}
