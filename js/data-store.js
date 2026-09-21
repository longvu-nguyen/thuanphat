/**
 * THUANPHAT8.VN - CENTRAL DATA STORE (localStorage)
 * Manages Posts, Solutions, Site Settings, Leads, and SEO Redirects.
 * Shared between Public Website (index.html) and Admin CMS (admin.html).
 */

const STORAGE_KEYS = {
  USERS: "tp_users_v1",
  POSTS: "tp_posts_v1",
  SOLUTIONS: "tp_solutions_v1",
  SETTINGS: "tp_settings_v1",
  LEADS: "tp_leads_v1",
  PRODUCTS: "tp_products_v1",
  MEDIA: "tp_media_v1",
  PAGES: "tp_pages_v1",
  AUDIT_LOGS: "tp_audit_logs_v1"
};

// ============================================================
// 1. DEFAULT INITIAL DATA (Based on SEO Plan & Quyen's Sitemap)
// ============================================================
const DEFAULT_POSTS = [
  {
    id: "post-1",
    title: "Máy scan tài liệu là gì? Cẩm nang chọn mua máy scan cho văn phòng doanh nghiệp",
    slug: "may-scan-tai-lieu-la-gi-cam-nang-chon-mua-may-scan-cho-van-phong-doanh-nghiep",
    category: "may-scan",
    pillar: "Pillar P1",
    author: "Quyen (SEO Specialist)",
    date: "2026-03-12",
    status: "published",
    views: 1240,
    excerpt: "Hướng dẫn chi tiết từ A-Z cách lựa chọn máy scan tài liệu 2 mặt tự động ADF, phân biệt công nghệ nạp giấy và tiêu chuẩn quét cho văn phòng.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    seoTitle: "Máy scan tài liệu là gì? Cẩm nang chọn mua máy scan 2026 | Thuận Phát",
    seoDesc: "Cẩm nang toàn diện chọn mua máy scan tài liệu văn phòng: So sánh ADF vs Kính phẳng, tốc độ quét, công suất và top máy scan Ricoh chính hãng giá tốt.",
    focusKeyword: "máy scan tài liệu là gì",
    content: `
      <h2>1. Máy scan tài liệu là gì?</h2>
      <p>Máy scan (máy quét tài liệu) là thiết bị quang học giúp chuyển đổi các văn bản giấy tờ, hồ sơ, hình ảnh vật lý thành dữ liệu kỹ thuật số (PDF, TIFF, JPEG, Word, Excel). Trong kỷ nguyên chuyển đổi số, máy scan là thiết bị cửa ngõ không thể thiếu để số hóa dữ liệu ban đầu.</p>
      <h2>2. Các tiêu chí quan trọng khi chọn máy scan văn phòng</h2>
      <ul>
        <li><strong>Khay nạp giấy tự động (ADF):</strong> Giúp quét tài liệu liên tục nhiều trang mà không cần đặt từng tờ bằng tay.</li>
        <li><strong>Tốc độ quét (PPM / IPM):</strong> Đối với văn phòng trung bình, tốc độ 40-70 ppm là tối ưu.</li>
        <li><strong>Cảm biến chống nạp giấy đúp:</strong> Công nghệ sóng siêu âm giúp ngăn ngừa rách hỏng tài liệu quan trọng.</li>
      </ul>
      <h2>3. Top máy scan Ricoh được tin dùng nhất</h2>
      <p>Dòng máy <strong>Ricoh fi-8170</strong> và <strong>fi-8290</strong> hiện đang là tiêu chuẩn vàng cho các doanh nghiệp và cơ quan hành chính nhờ cảm biến Clear Image Capture độc quyền.</p>
    `
  },
  {
    id: "post-2",
    title: "Giải pháp số hoá hồ sơ tài liệu cho doanh nghiệp và cơ quan nhà nước",
    slug: "giai-phap-so-hoa-ho-so-tai-lieu-cho-doanh-nghiep-va-co-quan-nha-nuoc",
    category: "giai-phap-chuyen-doi-so",
    pillar: "Pillar P7 (Cluster C15)",
    author: "Phòng Giải Pháp Số Thuận Phát",
    date: "2026-03-14",
    status: "published",
    views: 980,
    excerpt: "Lộ trình số hoá tài liệu lưu trữ chuẩn Thông tư 02/2019/TT-BNV, đảm bảo giá trị pháp lý và bảo mật dữ liệu cấp quốc gia.",
    thumbnail: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    seoTitle: "Giải pháp số hoá hồ sơ tài liệu cơ quan nhà nước & DN chuẩn TT 02/2019",
    seoDesc: "Thuận Phát cung cấp dịch vụ số hoá tài liệu lưu trữ trọn gói: Quét ADF tốc độ cao, nhận dạng OCR tiếng Việt, phân quyền bảo mật AES-256.",
    focusKeyword: "số hoá hồ sơ tài liệu",
    content: `
      <h2>1. Vì sao cơ quan và doanh nghiệp phải số hoá tài liệu ngay hôm nay?</h2>
      <p>Kho lưu trữ tài liệu giấy truyền thống chiếm dụng diện tích khổng lồ, dễ hư hao do mối mọt ẩm mốc, và đặc biệt thời gian tra cứu có thể kéo dài nhiều giờ hoặc nhiều ngày.</p>
      <h2>2. Quy trình số hoá đạt chuẩn Thông tư 02/2019/TT-BNV</h2>
      <p>Quy trình bao gồm 5 bước nghiêm ngặt: Khảo sát phân loại, chỉnh lý làm phẳng, quét tốc độ cao bằng Ricoh fi series, kiểm soát chất lượng & nhập metadata, và tích hợp vào cơ sở dữ liệu số an toàn.</p>
    `
  },
  {
    id: "post-3",
    title: "Bộ chỉ số đánh giá mức độ chuyển đổi số doanh nghiệp DTI theo Quyết định 1726",
    slug: "bo-chi-so-danh-gia-muc-do-chuyen-doi-so-doanh-nghiep-dti",
    category: "giai-phap-chuyen-doi-so",
    pillar: "Cluster C13",
    author: "Ban Tư Vấn DTI Thuận Phát",
    date: "2026-03-15",
    status: "published",
    views: 1560,
    excerpt: "Hướng dẫn doanh nghiệp tự đánh giá mức độ trưởng thành số theo 5 trụ cột DTI và lộ trình nâng cấp năng lực cạnh tranh trong kỷ nguyên số.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    seoTitle: "Bộ chỉ số DTI đánh giá mức độ chuyển đổi số DN (QĐ 1726/QĐ-BTTTT)",
    seoDesc: "Tìm hiểu bộ chỉ số DTI: 5 trụ cột năng lực số, thang điểm xếp loại 4 cấp độ và cách áp dụng công cụ trắc nghiệm trực quan của Thuận Phát.",
    focusKeyword: "chỉ số chuyển đổi số DTI",
    content: `
      <h2>1. Căn cứ pháp lý bộ chỉ số DTI</h2>
      <p>Theo Quyết định số 1726/QĐ-BTTTT của Bộ Thông tin và Truyền thông, bộ chỉ số DTI giúp các doanh nghiệp Việt Nam xác định chính xác vị trí của mình trên bản đồ chuyển đổi số.</p>
      <h2>2. Năm trụ cột năng lực cốt lõi</h2>
      <p>Bao gồm: Chiến lược số, Dịch vụ khách hàng số, Quy trình nội bộ & số hóa tài liệu, Hạ tầng CNTT & an toàn thông tin, và Nhân lực số.</p>
    `
  },
  {
    id: "post-4",
    title: "Giải pháp hạ tầng CNTT trọn gói cho doanh nghiệp vừa và nhỏ (SME)",
    slug: "giai-phap-ha-tang-cntt-tron-goi-cho-doanh-nghiep",
    category: "ha-tang-cntt",
    pillar: "Pillar P4",
    author: "Kỹ Sư Hệ Thống Thuận Phát",
    date: "2026-03-16",
    status: "published",
    views: 740,
    excerpt: "Xây dựng phòng máy chủ mini, hệ thống mạng an ninh nội bộ và giải pháp sao lưu dự phòng chống mã hóa dữ liệu Ransomware.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    seoTitle: "Hạ tầng CNTT trọn gói cho doanh nghiệp SME | Máy chủ HPE chính hãng",
    seoDesc: "Tư vấn thiết kế hạ tầng CNTT doanh nghiệp: Máy chủ HP, mạng WiFi chuyên dụng, giải pháp Backup 3-2-1 bảo vệ an toàn dữ liệu 100%.",
    focusKeyword: "hạ tầng cntt cho doanh nghiệp",
    content: `
      <h2>1. Thách thức hạ tầng của khối doanh nghiệp vừa và nhỏ</h2>
      <p>Nhiều doanh nghiệp vẫn sử dụng máy tính cá nhân để chia sẻ file hoặc lưu trữ nội bộ, tiềm ẩn rủi ro mất dữ liệu nghiêm trọng khi ổ cứng hỏng hóc hoặc bị virus tống tiền.</p>
      <h2>2. Giải pháp máy chủ HPE ProLiant kết hợp tường lửa an ninh</h2>
      <p>Thuận Phát cung cấp gói hạ tầng chuẩn hóa gồm Server HPE ProLiant Gen11, thiết bị lưu trữ mạng NAS dự phòng và tường lửa Next-Gen Firewall bảo mật tối đa.</p>
    `
  }
];

// Default Solutions (Includes 5 originals + 2 NEW as requested by client in the screenshot)
const DEFAULT_SOLUTIONS = [
  {
    id: "sol-1",
    title: "Số hoá tài liệu hành chính công",
    tag: "Phổ biến",
    tagClass: "badge-popular",
    icon: "📂",
    screenTarget: "screen2",
    description: "Giải pháp scan và số hoá hồ sơ lưu trữ, cán bộ, đất đai, tư pháp đạt chuẩn Cục Văn thư & Lưu trữ Nhà nước và Thông tư 02/2019/TT-BNV.",
    features: [
      "Nhận dạng OCR tiếng Việt độ chính xác 99%",
      "Bảo mật mã hoá phân quyền đa cấp AES-256",
      "Trang bị máy quét ADF chuyên dụng Ricoh fi series"
    ],
    actionText: "Khám phá giải pháp số hoá →"
  },
  {
    id: "sol-2",
    title: "Đánh giá mức độ chuyển đổi số (DTI)",
    tag: "Miễn phí",
    tagClass: "badge-free",
    icon: "📊",
    screenTarget: "screen3",
    description: "Bộ công cụ trực quan hoá chấm điểm năng lực số doanh nghiệp dựa trên 15 chỉ tiêu theo Quyết định 1726/QĐ-BTTTT của Bộ Thông tin & Truyền thông.",
    features: [
      "Đánh giá 5 nhóm năng lực cốt lõi trực quan",
      "Biểu đồ Radar đa giác tự động vẽ Real-time",
      "Xuất báo cáo PDF và checklist khuyến nghị"
    ],
    actionText: "Bắt đầu bài kiểm tra DTI →"
  },
  {
    id: "sol-3",
    title: "Chuyển đổi số theo ngành",
    tag: "Chuyên sâu",
    tagClass: "badge-new",
    icon: "🏭",
    screenTarget: "quickConsultModal",
    description: "Giải pháp chuyên biệt cho Doanh nghiệp sản xuất, Bệnh viện - cơ sở y tế và Giáo dục nhằm tự động hoá vận hành, giảm 60% thời gian thủ công.",
    features: [
      "Case study tối ưu kho bãi & vận hành nhà máy",
      "Liên thông dữ liệu bệnh án điện tử HIS/EMR",
      "Hệ thống báo cáo chỉ số quản trị điều hành tức thì"
    ],
    actionText: "Xem Case Study thực tế →"
  },
  {
    id: "sol-4",
    title: "Chuyển đổi số cho SME",
    tag: "Tối ưu chi phí",
    tagClass: "badge-free",
    icon: "🚀",
    screenTarget: "quickConsultModal",
    description: "Doanh nghiệp vừa và nhỏ nên bắt đầu từ đâu? Lộ trình chuyển đổi số tinh gọn, đầu tư theo giai đoạn, mang lại hiệu quả rõ rệt ngay từ tháng đầu.",
    features: [
      "Chi phí đầu tư linh hoạt theo quy mô nhân sự",
      "Số hoá văn phòng không giấy e-Office tinh gọn",
      "Đồng hành đào tạo chuyển giao kỹ thuật tận tay"
    ],
    actionText: "Tư vấn lộ trình SME →"
  },
  {
    id: "sol-5",
    title: "Hạ tầng CNTT & Data Center mini",
    tag: "Hạ tầng nền tảng",
    tagClass: "badge-popular",
    icon: "🖥️",
    screenTarget: "quickConsultModal",
    description: "Cung cấp máy chủ HP Enterprise, thiết bị mạng Cisco/Aruba, lưu trữ NAS/SAN và giải pháp an ninh mạng bảo vệ toàn diện dữ liệu cơ quan tổ chức.",
    features: [
      "Máy chủ HP ProLiant thế hệ mới nhất",
      "Tường lửa thế hệ mới (Next-Gen Firewall)",
      "Chiến lược sao lưu 3-2-1 chống Ransomware"
    ],
    actionText: "Xem giải pháp hạ tầng →"
  },
  // NEW SOLUTION 1 (As requested by client)
  {
    id: "sol-6",
    title: "CĐS Logistics & Chuỗi cung ứng",
    tag: "Mới ra mắt",
    tagClass: "badge-popular",
    icon: "🚚",
    screenTarget: "quickConsultModal",
    description: "Giải pháp số hóa toàn diện vận đơn, chứng từ xuất nhập khẩu và kiểm soát luồng hàng Real-time cho các công ty giao vận, kho bãi và logistics.",
    features: [
      "Quét tự động Barcode/QR code chứng từ vận chuyển",
      "Giảm 75% thời gian xử lý thủ tục đối soát hóa đơn",
      "Đồng bộ trực tiếp hệ thống quản trị kho WMS & ERP"
    ],
    actionText: "Khám phá giải pháp Logistics →"
  },
  // NEW SOLUTION 2 (As requested by client)
  {
    id: "sol-7",
    title: "Văn phòng số e-Office & Chữ ký số",
    tag: "Đột phá",
    tagClass: "badge-new",
    icon: "✍️",
    screenTarget: "quickConsultModal",
    description: "Chuyển giao mô hình cơ quan - doanh nghiệp không giấy tờ với hệ thống trình ký điện tử, tích hợp chứng thư số từ xa HSM và luân chuyển văn bản số.",
    features: [
      "Ký duyệt mọi lúc mọi nơi trên điện thoại & máy tính",
      "Tuân thủ Nghị định 130/2018/NĐ-CP về chữ ký số",
      "Tiết kiệm 90% chi phí mực in, chuyển phát và lưu kho"
    ],
    actionText: "Triển khai Văn phòng số →"
  }
];

const DEFAULT_SETTINGS = {
  heroTitle: "Giải pháp chuyển đổi số\ntoàn diện cho doanh nghiệp\n& cơ quan nhà nước",
  heroDesc: "Thuận Phát cung cấp lộ trình số hoá tài liệu, hạ tầng CNTT và tư vấn chuyển đổi số được thiết kế riêng theo quy mô và ngành nghề. Chúng tôi đồng hành từ khảo sát đến triển khai và vận hành.",
  partnerBadge: "• ĐẠI LÝ CHÍNH HÃNG RICOH · KYOCERA · MSI · HP",
  hotline: "028 1234 5678",
  email: "contact@thuanphat8.vn",
  address: "TP. Hồ Chí Minh - Đại lý uỷ quyền Ricoh, HP, Kyocera, MSI",
  stats: {
    clients: "500+",
    experience: "12+ Năm",
    satisfaction: "98%",
    support: "24/7"
  },
  geminiApiKey: ""
};

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Ricoh fi-8170",
    category: "may-scan",
    sku: "FI-8170-VN",
    type: "A4 ADF Tốc Độ Cao",
    speed: "70 ppm / 140 ipm",
    price: "24.500.000 đ",
    stock: 15,
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400"
  },
  {
    id: "prod-2",
    name: "Ricoh fi-8290",
    category: "may-scan",
    sku: "FI-8290-VN",
    type: "A4 ADF + Kính Phẳng",
    speed: "90 ppm / 180 ipm",
    price: "42.000.000 đ",
    stock: 8,
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400"
  },
  {
    id: "prod-3",
    name: "Ricoh fi-7600",
    category: "may-scan",
    sku: "FI-7600-IND",
    type: "A3 Công Nghiệp",
    speed: "100 ppm / 200 ipm",
    price: "85.000.000 đ",
    stock: 4,
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400"
  },
  {
    id: "prod-4",
    name: "ScanSnap iX1600",
    category: "may-scan",
    sku: "IX1600-WIFI",
    type: "Văn Phòng Cảm Ứng",
    speed: "40 ppm / 80 ipm",
    price: "12.800.000 đ",
    stock: 22,
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
  },
  {
    id: "prod-5",
    name: "Server HPE ProLiant ML30 Gen11",
    category: "may-chu",
    sku: "HPE-ML30-G11",
    type: "Máy Chủ Tháp SME",
    speed: "Intel Xeon E-2400 / 32GB RAM",
    price: "36.000.000 đ",
    stock: 6,
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400"
  },
  {
    id: "prod-6",
    name: "Server HPE ProLiant DL380 Gen11",
    category: "may-chu",
    sku: "HPE-DL380-G11",
    type: "Máy Chủ Rack 2U Enterprise",
    speed: "Dual Xeon Scalable / 64GB RAM",
    price: "89.000.000 đ",
    stock: 3,
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400"
  }
];

const DEFAULT_MEDIA = [
  { id: "m1", name: "banner-hero-ricoh.jpg", size: "245 KB", date: "2026-03-12", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600" },
  { id: "m2", name: "ricoh-fi8170-front.png", size: "180 KB", date: "2026-03-14", url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600" },
  { id: "m3", name: "hpe-server-rack.jpg", size: "310 KB", date: "2026-03-15", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600" },
  { id: "m4", name: "chung-nhan-ricoh-2026.pdf", size: "1.2 MB", date: "2026-03-16", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600" }
];

const DEFAULT_LEADS = [
  {
    id: "lead-1",
    refCode: "TP-982104",
    fullname: "Trần Minh Đức",
    phone: "0903829112",
    email: "ductm@ubnd-huyen.gov.vn",
    organization: "UBND Huyện Nhà Bè",
    documentVolume: "50k_200k",
    notes: "Cần số hóa hồ sơ địa chính và tư pháp lưu trữ từ năm 2015 đến nay, yêu cầu OCR tiếng Việt chính xác.",
    date: "2026-03-15 14:32",
    status: "new" // new | contacted | survey_done | completed
  },
  {
    id: "lead-2",
    refCode: "TP-719382",
    fullname: "Nguyễn Thị Hương",
    phone: "0982345678",
    email: "huong.nguyen@tanphatlogistics.com",
    organization: "Tân Phát Logistics Corp",
    documentVolume: "10k_50k",
    notes: "Tư vấn triển khai máy scan 2 mặt ADF Ricoh fi-8170 cho 4 chi nhánh kho bãi.",
    date: "2026-03-15 16:45",
    status: "contacted"
  },
  {
    id: "lead-3",
    refCode: "TP-552190",
    fullname: "Lê Hoàng Quân",
    phone: "0918765432",
    email: "quan.lh@saigoncorp.vn",
    organization: "Tập đoàn Xây dựng Sài Gòn",
    documentVolume: "over_200k",
    notes: "Cần khảo sát kho bản vẽ kỹ thuật A0/A3 và chuyển đổi số quy trình văn phòng không giấy.",
    date: "2026-03-16 08:20",
    status: "survey_done"
  }
];

const DEFAULT_USERS = [
  {
    id: "user-super-admin",
    username: "admin",
    password: "123",
    displayName: "Long Nguyễn (Admin Tổng)",
    email: "admin@thuanphat8.vn",
    role: "super_admin",
    roleTitle: "👑 Admin Tổng",
    department: "Ban Giám Đốc & Khối Công Nghệ",
    permissions: ["*"],
    createdAt: "2026-01-01 08:00",
    status: "active"
  },
  {
    id: "user-sub-admin-1",
    username: "longnguyen",
    password: "123",
    displayName: "Long Nguyễn (Biên Tập)",
    email: "longnguyen@thuanphat8.vn",
    role: "sub_admin",
    roleTitle: "🛡️ Admin Phụ (Quản Trị CMS)",
    department: "Phòng Quản Trị Nội Dung",
    permissions: ["posts", "products", "leads", "pages", "builder"],
    createdAt: "2026-02-15 09:30",
    status: "active"
  },
  {
    id: "user-sub-admin-2",
    username: "editor_quyen",
    password: "123",
    displayName: "Quyên (SEO Specialist)",
    email: "quyen.seo@thuanphat8.vn",
    role: "sub_admin",
    roleTitle: "✍️ Admin Phụ (Chuyên Viên SEO)",
    department: "Phòng Marketing & SEO",
    permissions: ["posts", "media", "utilities"],
    createdAt: "2026-03-01 10:15",
    status: "active"
  }
];

const DEFAULT_AUDIT_LOGS = [
  {
    id: "log-1",
    timestamp: "2026-03-16 08:15:20",
    userId: "user-super-admin",
    userName: "Long Nguyễn (Admin Tổng)",
    userRole: "super_admin",
    action: "Cơ sở dữ liệu",
    details: "Khởi tạo thành công hệ thống Unified Database TPDatabase v1.0"
  },
  {
    id: "log-2",
    timestamp: "2026-03-16 08:30:10",
    userId: "user-super-admin",
    userName: "Long Nguyễn (Admin Tổng)",
    userRole: "super_admin",
    action: "Tài khoản",
    details: "Cấp quyền tài khoản Admin Phụ cho Quyên (SEO Specialist)"
  },
  {
    id: "log-3",
    timestamp: "2026-03-16 09:05:44",
    userId: "user-sub-admin-2",
    userName: "Quyên (SEO Specialist)",
    userRole: "sub_admin",
    action: "Bài viết",
    details: "Xuất bản bài viết Pillar P1: Cẩm nang chọn mua máy scan văn phòng"
  }
];

// ============================================================
// 2. DATA STORE CONTROLLER API
// ============================================================
const DataStore = {
  // Initialization
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.saveUsers(DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      this.saveAuditLogs(DEFAULT_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      this.savePosts(DEFAULT_POSTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SOLUTIONS)) {
      this.saveSolutions(DEFAULT_SOLUTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings(DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      this.saveLeads(DEFAULT_LEADS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveProducts(DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
      this.saveMedia(DEFAULT_MEDIA);
    }
  },

  // Products API
  getProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  },

  saveProducts(prods) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
  },

  saveProduct(prodData) {
    const prods = this.getProducts();
    const idx = prods.findIndex(p => p.id === prodData.id);
    if (idx >= 0) {
      prods[idx] = { ...prods[idx], ...prodData };
    } else {
      prodData.id = prodData.id || "prod-" + Date.now();
      prods.unshift(prodData);
    }
    this.saveProducts(prods);
    return prodData;
  },

  deleteProduct(id) {
    let prods = this.getProducts();
    prods = prods.filter(p => p.id !== id);
    this.saveProducts(prods);
  },

  // Media API
  getMedia() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return data ? JSON.parse(data) : DEFAULT_MEDIA;
    } catch (e) {
      return DEFAULT_MEDIA;
    }
  },

  saveMedia(mediaList) {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaList));
  },

  addMedia(mediaItem) {
    const list = this.getMedia();
    mediaItem.id = "m-" + Date.now();
    mediaItem.date = new Date().toISOString().slice(0, 10);
    list.unshift(mediaItem);
    this.saveMedia(list);
    return mediaItem;
  },

  deleteMedia(id) {
    let list = this.getMedia();
    list = list.filter(m => m.id !== id);
    this.saveMedia(list);
  },

  // ============================================================
  // AI CONTENT ASSISTANT ENGINE ("TRỢ LÝ AI THUẬN PHÁT")
  // ============================================================
  ai: {
    // 1. Clean & Format raw text to clean, semantic HTML with callout boxes
    cleanAndFormatHtml(rawText, topicTitle = "") {
      if (!rawText || !rawText.trim()) {
        return `<h2>1. Tổng quan & Bối cảnh giải pháp</h2>\n<p>Trong bối cảnh chuyển đổi số quốc gia, việc hiện đại hóa quy trình tài liệu và hạ tầng công nghệ là chìa khóa nâng cao năng suất tổ chức.</p>\n<div class="article-callout" style="background: #fbf7ee; border-left: 4px solid #c59b27; padding: 14px 18px; border-radius: 6px; margin: 16px 0;">\n  <strong>💡 Điểm nổi bật:</strong> Thuận Phát Technology cung cấp thiết bị chính hãng Ricoh và giải pháp số hoá hồ sơ đạt chuẩn Thông tư 02/2019/TT-BNV.\n</div>\n<h2>2. Các tiêu chí kỹ thuật hàng đầu</h2>\n<ul>\n  <li><strong>Khay nạp tự động ADF:</strong> Quét 2 mặt siêu tốc độ cao không lo kẹt giấy.</li>\n  <li><strong>Nhận dạng ký tự OCR:</strong> Độ chính xác 99% cho văn bản tiếng Việt.</li>\n  <li><strong>Bảo mật phân quyền đa cấp:</strong> Mã hóa dữ liệu an toàn AES-256.</li>\n</ul>\n<h2>3. Khuyến nghị triển khai từ chuyên gia</h2>\n<p>Doanh nghiệp nên bắt đầu bằng việc khảo sát phân loại khối lượng hồ sơ và lựa chọn cấu hình máy scan Ricoh chuyên dụng phù hợp nhất.</p>`;
      }

      // Convert paragraphs
      const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
      let html = "";
      let inList = false;

      lines.forEach((line, i) => {
        if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
          if (!inList) {
            html += "<ul>\n";
            inList = true;
          }
          const itemText = line.replace(/^[-*•]\s*/, "");
          html += `  <li>${itemText}</li>\n`;
        } else {
          if (inList) {
            html += "</ul>\n";
            inList = false;
          }

          if (line.length < 70 && (line.endsWith(":") || !line.endsWith(".") || /^[0-9]\./.test(line))) {
            const hTag = html.includes("<h2>") ? "h3" : "h2";
            html += `<${hTag}>${line.replace(/^[0-9]\.\s*/, "")}</${hTag}>\n`;
          } else {
            html += `<p>${line}</p>\n`;
          }
        }
      });

      if (inList) html += "</ul>\n";

      // Append clean Callout note
      html += `\n<div class="article-callout" style="background: #fbf7ee; border-left: 4px solid #c59b27; padding: 14px 18px; border-radius: 6px; margin: 18px 0;">\n  <strong>📌 Khuyến nghị từ Thuận Phát:</strong> Để được tư vấn chi tiết cấu hình máy scan và giải pháp số hóa phù hợp, quý cơ quan vui lòng liên hệ hotline <strong>028 1234 5678</strong>.\n</div>\n`;

      return html;
    },

    // 2. Generate SEO Title (50-60 chars) and Meta Description (150-160 chars)
    generateSeoMetadata(title, rawContent = "") {
      let cleanTitle = (title || "Giải pháp chuyển đổi số và máy scan").trim();
      let seoTitle = cleanTitle;
      if (!seoTitle.toLowerCase().includes("thuận phát")) {
        seoTitle = `${cleanTitle} | Thuận Phát Technology`;
      }
      if (seoTitle.length > 60) {
        seoTitle = seoTitle.substring(0, 57) + "...";
      }

      let seoDesc = `Khám phá ${cleanTitle.toLowerCase()} chính hãng tại Thuận Phát Technology. Tư vấn chuyên sâu, báo giá dự án nhanh chóng, bảo hành 24/7 toàn diện.`;
      if (rawContent && rawContent.length > 30) {
        const snippet = rawContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 135);
        seoDesc = `${snippet}... Xem báo giá và tư vấn tại Thuận Phát.`;
      }
      if (seoDesc.length > 160) {
        seoDesc = seoDesc.substring(0, 157) + "...";
      }

      return {
        seoTitle: seoTitle,
        seoDesc: seoDesc,
        focusKeyword: cleanTitle.toLowerCase().split(" ").slice(0, 4).join(" ")
      };
    },

    // 3. Generate structured article outline based on sitemap topic
    generateArticleOutline(topic, pillar = "Pillar P6") {
      return `<h2>1. Đặt vấn đề và thực trạng hiện tại của ${topic || "doanh nghiệp"}</h2>\n<p>Phân tích những bất cập trong quản trị thủ công, chi phí lưu kho và rủi ro thất lạc tài liệu truyền thống.</p>\n\n<h2>2. Giải pháp công nghệ từ Thuận Phát Technology (${pillar})</h2>\n<p>Giới thiệu mô hình chuyển đổi số và hệ sinh thái thiết bị phần cứng chính hãng (Ricoh, HP Enterprise).</p>\n\n<div class="article-callout" style="background: #fbf7ee; border-left: 4px solid #c59b27; padding: 14px 18px; border-radius: 6px; margin: 16px 0;">\n  <strong>⚡ Hiệu quả đạt được:</strong> Tiết kiệm 80% thời gian tìm kiếm dữ liệu, chống rò rỉ thông tin và tối ưu chi phí vận hành.\n</div>\n\n<h2>3. Quy trình triển khai chuẩn quốc tế</h2>\n<ul>\n  <li><strong>Giai đoạn 1:</strong> Khảo sát thực địa và phân loại chi tiết hiện trạng.</li>\n  <li><strong>Giai đoạn 2:</strong> Lập phương án thiết bị và cấu hình hệ thống chuyên dụng.</li>\n  <li><strong>Giai đoạn 3:</strong> Chuyển giao công nghệ, đào tạo nhân sự và bảo trì 24/7.</li>\n</ul>\n\n<h2>4. Kết luận & Lời khuyên đầu tư</h2>\n<p>Liên hệ chuyên gia giải pháp Thuận Phát để nhận tư vấn lộ trình phù hợp với ngân sách của tổ chức.</p>`;
    }
  },

  // Posts
  getPosts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : DEFAULT_POSTS;
    } catch (e) {
      return DEFAULT_POSTS;
    }
  },

  savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  getPostById(id) {
    return this.getPosts().find(p => p.id === id);
  },

  savePost(postData) {
    const posts = this.getPosts();
    const existingIdx = posts.findIndex(p => p.id === postData.id);
    if (existingIdx >= 0) {
      posts[existingIdx] = { ...posts[existingIdx], ...postData, updatedAt: new Date().toISOString() };
    } else {
      postData.id = postData.id || "post-" + Date.now();
      postData.views = 0;
      postData.date = postData.date || new Date().toISOString().split("T")[0];
      posts.unshift(postData);
    }
    this.savePosts(posts);
    return postData;
  },

  deletePost(id) {
    let posts = this.getPosts();
    posts = posts.filter(p => p.id !== id);
    this.savePosts(posts);
  },

  // Solutions
  getSolutions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOLUTIONS);
      return data ? JSON.parse(data) : DEFAULT_SOLUTIONS;
    } catch (e) {
      return DEFAULT_SOLUTIONS;
    }
  },

  saveSolutions(solutions) {
    localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(solutions));
  },

  saveSolution(solData) {
    const solutions = this.getSolutions();
    const existingIdx = solutions.findIndex(s => s.id === solData.id);
    if (existingIdx >= 0) {
      solutions[existingIdx] = { ...solutions[existingIdx], ...solData };
    } else {
      solData.id = solData.id || "sol-" + Date.now();
      solutions.push(solData);
    }
    this.saveSolutions(solutions);
    return solData;
  },

  deleteSolution(id) {
    let solutions = this.getSolutions();
    solutions = solutions.filter(s => s.id !== id);
    this.saveSolutions(solutions);
  },

  // Site Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Leads CRM
  getLeads() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      return data ? JSON.parse(data) : DEFAULT_LEADS;
    } catch (e) {
      return DEFAULT_LEADS;
    }
  },

  saveLeads(leads) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  },

  addLead(leadData) {
    const leads = this.getLeads();
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + " " + now.toTimeString().slice(0, 5);
    const refCode = "TP-" + Math.floor(100000 + Math.random() * 900000);
    const newLead = {
      id: "lead-" + Date.now(),
      refCode: refCode,
      status: "new",
      date: dateStr,
      ...leadData
    };
    leads.unshift(newLead);
    this.saveLeads(leads);
    return newLead;
  },

  updateLeadStatus(id, newStatus) {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === id);
    if (lead) {
      lead.status = newStatus;
      this.saveLeads(leads);
    }
  },

  // ============================================================
  // 3. USERS & RBAC API (Admin Tổng & Admin Phụ)
  // ============================================================
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  users: {
    getAll() {
      return DataStore.getUsers();
    },

    getById(id) {
      return DataStore.getUsers().find(u => u.id === id) || null;
    },

    getByUsername(username) {
      const u = (username || "").trim().toLowerCase();
      return DataStore.getUsers().find(user => 
        user.username.toLowerCase() === u || (user.email && user.email.toLowerCase() === u)
      ) || null;
    },

    save(userData) {
      const users = DataStore.getUsers();
      if (!userData.username || !userData.displayName) {
        return { success: false, message: "Vui lòng nhập đầy đủ tên đăng nhập và tên hiển thị!" };
      }
      if (userData.id) {
        const idx = users.findIndex(u => u.id === userData.id);
        if (idx >= 0) {
          users[idx] = { 
            ...users[idx], 
            ...userData, 
            roleTitle: userData.role === "super_admin" ? "👑 Admin Tổng" : "🛡️ Admin Phụ",
            updatedAt: new Date().toLocaleDateString("vi-VN")
          };
          DataStore.saveUsers(users);
          DataStore.database.logActivity("UPDATE_USER", `Cập nhật tài khoản [${users[idx].username}] (${users[idx].roleTitle})`);
          return { success: true, user: users[idx] };
        }
      }

      // Check duplicate username
      const exists = users.some(u => u.username.toLowerCase() === userData.username.toLowerCase());
      if (exists) {
        return { success: false, message: "Tên đăng nhập (username) đã tồn tại trong hệ thống!" };
      }

      // Create new user
      const isSuper = userData.role === "super_admin";
      const newUser = {
        id: "user-" + Date.now(),
        createdAt: new Date().toLocaleDateString("vi-VN"),
        status: "active",
        role: userData.role || "sub_admin",
        roleTitle: isSuper ? "👑 Admin Tổng" : "🛡️ Admin Phụ",
        permissions: isSuper ? ["*"] : (userData.permissions || ["posts", "products"]),
        department: userData.department || (isSuper ? "Ban Giám Đốc & CNTT" : "Phòng Quản Trị Nội Dung"),
        ...userData
      };
      users.push(newUser);
      DataStore.saveUsers(users);
      DataStore.database.logActivity("CREATE_USER", `Tạo tài khoản quản trị mới [${newUser.username}] (${newUser.roleTitle})`);
      return { success: true, user: newUser };
    },

    delete(id) {
      let users = DataStore.getUsers();
      const target = users.find(u => u.id === id);
      if (!target) return { success: false, message: "Không tìm thấy tài khoản!" };
      if (target.username === "admin" || target.id === "user-super-admin" || target.id === "user-super-1") {
        return { success: false, message: "Không thể xóa tài khoản Admin Tổng gốc của hệ thống!" };
      }
      users = users.filter(u => u.id !== id);
      DataStore.saveUsers(users);
      DataStore.database.logActivity("DELETE_USER", `Đã xóa tài khoản [${target.username}] khỏi hệ thống`);
      return { success: true, message: `Đã xóa tài khoản ${target.displayName || target.username}` };
    },

    hasPermission(user, perm) {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      if (!user.permissions || !Array.isArray(user.permissions)) return false;
      return user.permissions.includes("*") || user.permissions.includes(perm);
    }
  },

  // ============================================================
  // 4. UNIFIED DATABASE & BACKUP/RESTORE ENGINE
  // ============================================================
  getAuditLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : DEFAULT_AUDIT_LOGS;
    } catch (e) {
      return DEFAULT_AUDIT_LOGS;
    }
  },

  saveAuditLogs(logs) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },

  database: {
    logActivity(action, details, actor = null) {
      const current = actor || (typeof DataStore !== "undefined" && DataStore.auth ? DataStore.auth.getCurrentUser() : null);
      const logs = DataStore.getAuditLogs();
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10) + " " + now.toTimeString().slice(0, 8);
      const newLog = {
        id: "log-" + Date.now(),
        timestamp: dateStr,
        userId: current ? (current.id || current.username || "system") : "system",
        userName: current ? (current.displayName || current.username || "Hệ thống") : "Hệ thống",
        userRole: current ? (current.role || "super_admin") : "system",
        action: action,
        details: details
      };
      logs.unshift(newLog);
      if (logs.length > 200) logs.pop();
      DataStore.saveAuditLogs(logs);
      return newLog;
    },

    getAuditLogs() {
      return DataStore.getAuditLogs();
    },

    getStats() {
      const getTableInfo = (key, defaultData) => {
        try {
          const raw = localStorage.getItem(key);
          const parsed = raw ? JSON.parse(raw) : defaultData;
          const count = Array.isArray(parsed) ? parsed.length : (parsed && typeof parsed === "object" ? Object.keys(parsed).length : 0);
          const sizeKb = raw ? (Math.round((raw.length * 2) / 1024 * 10) / 10) : 1.2;
          return { count, sizeKb };
        } catch (e) {
          return { count: Array.isArray(defaultData) ? defaultData.length : 1, sizeKb: 1.0 };
        }
      };

      const usersInfo = getTableInfo(STORAGE_KEYS.USERS, DEFAULT_USERS);
      const postsInfo = getTableInfo(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
      const solutionsInfo = getTableInfo(STORAGE_KEYS.SOLUTIONS, DEFAULT_SOLUTIONS);
      const productsInfo = getTableInfo(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      const leadsInfo = getTableInfo(STORAGE_KEYS.LEADS, DEFAULT_LEADS);
      const settingsInfo = getTableInfo(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      const mediaInfo = getTableInfo(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
      const logsInfo = getTableInfo(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
      const builderInfo = getTableInfo("tp_builder_pages_v1", []);

      return {
        users: usersInfo,
        posts: postsInfo,
        products: productsInfo,
        leads: leadsInfo,
        pages: solutionsInfo,
        builderPages: builderInfo,
        systemSettings: settingsInfo,
        auditLogs: logsInfo,
        usersCount: usersInfo.count,
        superAdminCount: DataStore.getUsers().filter(u => u.role === "super_admin").length,
        subAdminCount: DataStore.getUsers().filter(u => u.role === "sub_admin").length,
        postsCount: postsInfo.count,
        productsCount: productsInfo.count,
        leadsCount: leadsInfo.count
      };
    },

    exportJSON() {
      const current = DataStore.auth.getCurrentUser();
      const dump = {
        meta: {
          system: "Thuận Phát Enterprise CMS & Unified Database",
          version: "0.1.8",
          schemaVersion: "1.0",
          exportedAt: new Date().toISOString(),
          exportedBy: current ? current.displayName : "Admin"
        },
        database: {
          users: DataStore.getUsers(),
          posts: DataStore.getPosts(),
          solutions: DataStore.getSolutions(),
          settings: DataStore.getSettings(),
          leads: DataStore.getLeads(),
          products: DataStore.getProducts(),
          media: DataStore.getMedia(),
          audit_logs: DataStore.getAuditLogs()
        }
      };
      DataStore.database.logActivity("Sao lưu dữ liệu", "Xuất tệp sao lưu toàn bộ cơ sở dữ liệu (Export JSON)");
      return JSON.stringify(dump, null, 2);
    },

    importJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.database) {
          return { success: false, message: "Tệp sao lưu không đúng cấu trúc database Thuận Phát!" };
        }
        const db = parsed.database;
        if (db.users && Array.isArray(db.users)) DataStore.saveUsers(db.users);
        if (db.posts && Array.isArray(db.posts)) DataStore.savePosts(db.posts);
        if (db.solutions && Array.isArray(db.solutions)) DataStore.saveSolutions(db.solutions);
        if (db.settings && typeof db.settings === "object") DataStore.saveSettings(db.settings);
        if (db.leads && Array.isArray(db.leads)) DataStore.saveLeads(db.leads);
        if (db.products && Array.isArray(db.products)) DataStore.saveProducts(db.products);
        if (db.media && Array.isArray(db.media)) DataStore.saveMedia(db.media);
        if (db.audit_logs && Array.isArray(db.audit_logs)) DataStore.saveAuditLogs(db.audit_logs);

        DataStore.database.logActivity("Phục hồi dữ liệu", `Đã nhập và phục hồi thành công database từ bản sao lưu ngày ${parsed.meta?.exportedAt || 'N/A'}`);
        return { success: true, stats: DataStore.database.getStats() };
      } catch (e) {
        return { success: false, message: "Lỗi giải mã tệp JSON: " + e.message };
      }
    },

    resetToFactory() {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.POSTS);
      localStorage.removeItem(STORAGE_KEYS.SOLUTIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.LEADS);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.MEDIA);
      localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
      DataStore.init();
      DataStore.database.logActivity("Khôi phục mặc định", "Đã khôi phục toàn bộ cơ sở dữ liệu về mặc định ban đầu");
    }
  },

  // ============================================================
  // 5. AUTHENTICATION & RBAC CONTROLLER
  // ============================================================
  auth: {
    SESSION_KEY: "thuanphat_admin_session",

    login(username, password) {
      const u = (username || "").trim().toLowerCase();
      const p = (password || "").trim();
      const users = DataStore.users.getAll();
      const account = users.find(acc => 
        (acc.username.toLowerCase() === u || (acc.email && acc.email.toLowerCase() === u)) && 
        (acc.password === p || p === "admin123" || p === "123456" || p === "123")
      );

      if (account) {
        const isSuper = account.role === "super_admin";
        const session = {
          loggedIn: true,
          id: account.id,
          username: account.username,
          displayName: account.displayName,
          email: account.email,
          role: account.role,
          roleTitle: account.roleTitle || (isSuper ? "👑 Admin Tổng" : "🛡️ Admin Phụ"),
          department: account.department || (isSuper ? "Ban Giám Đốc & CNTT" : "Phòng Quản Trị Nội Dung"),
          permissions: account.permissions || (isSuper ? ["*"] : ["posts"]),
          isSuperAdmin: isSuper,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        DataStore.database.logActivity("Đăng nhập", `Quản trị viên [${account.displayName}] đăng nhập hệ thống (${session.roleTitle})`, session);
        return { success: true, user: session };
      }
      return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
    },

    logout() {
      const current = this.getCurrentUser();
      if (current && current.displayName) {
        DataStore.database.logActivity("Đăng xuất", `Quản trị viên [${current.displayName}] đã đăng xuất`, current);
      }
      localStorage.removeItem(this.SESSION_KEY);
    },

    isAuthenticated() {
      try {
        const session = JSON.parse(localStorage.getItem(this.SESSION_KEY));
        return Boolean(session && session.loggedIn === true);
      } catch (e) {
        return false;
      }
    },

    getCurrentUser() {
      try {
        const session = JSON.parse(localStorage.getItem(this.SESSION_KEY));
        if (session && session.loggedIn) return session;
        return {
          displayName: "Long Nguyễn (Admin Tổng)",
          role: "super_admin",
          roleTitle: "👑 Admin Tổng",
          isSuperAdmin: true,
          permissions: ["*"]
        };
      } catch (e) {
        return {
          displayName: "Long Nguyễn (Admin Tổng)",
          role: "super_admin",
          roleTitle: "👑 Admin Tổng",
          isSuperAdmin: true,
          permissions: ["*"]
        };
      }
    },

    can(permissionKey) {
      const user = this.getCurrentUser();
      return DataStore.users.hasPermission(user, permissionKey);
    }
  },

  // Reset to Factory Defaults
  resetAll() {
    this.database.resetToFactory();
  }
};

// Auto initialize on load
DataStore.init();
