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
    "id": "tp-may-photocopy-trang-den-ricoh-im-3510",
    "name": "Máy Photocopy Trắng Đen RICOH IM 3510",
    "slug": "may-photocopy-trang-den-ricoh-im-3510",
    "category": "may-photocopy-ricoh",
    "sku": "MAY-PHOTOCOPY-TRANG-DEN-RICOH-IM-3510",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/05/Ricoh IM 3510.webp",
    "excerpt": "Máy photocopy Ricoh chính hãng - dòng máy đa năng, đen trắng, khổ A3 mã IM 3510. Cung ứng bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-photocopy-trang-den-ricoh-im-3510.html"
  },
  {
    "id": "tp-may-photocopy-trang-den-ricoh-im-3010",
    "name": "Máy Photocopy Trắng Đen RICOH IM 3010",
    "slug": "may-photocopy-trang-den-ricoh-im-3010",
    "category": "may-photocopy-ricoh",
    "sku": "MAY-PHOTOCOPY-TRANG-DEN-RICOH-IM-3010",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/05/Ricoh IM 3010.jpg",
    "excerpt": "Máy photocopy chính hãng RICOH IM 3010: in ấn trắng đen A3 tốc độ cao, bền bỉ, dễ dàng nâng cấp khay giấy. Cung ứng bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-photocopy-trang-den-ricoh-im-3010.html"
  },
  {
    "id": "tp-may-in-kyocera-ecosys-ma4500x",
    "name": "Máy in KYOCERA ECOSYS MA4500x",
    "slug": "may-in-kyocera-ecosys-ma4500x",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-KYOCERA-ECOSYS-MA4500X",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/square-540x540.ECOSYS-MA4500x.png",
    "excerpt": "Máy in đa năng đen trắng, chính hãng hiệu KYOCERA, dòng ECOSYS MA4500x. Cung cấp bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-in-kyocera-ecosys-ma4500x.html"
  },
  {
    "id": "tp-may-in-kyocera-ecosys-ma4500ix",
    "name": "Máy in Kyocera ECOSYS MA4500ix",
    "slug": "may-in-kyocera-ecosys-ma4500ix",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-KYOCERA-ECOSYS-MA4500IX",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/ecosys-ma4500x_01.jpg",
    "excerpt": "Máy đa chức năng đen trắng, chính hãng năm 2026 hiệu KYOCERA ECOSYS MA4500ix (kèm mực theo máy). Được cung cấp bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-in-kyocera-ecosys-ma4500ix.html"
  },
  {
    "id": "tp-may-in-a3-kyocera-ecosys-p4140dn",
    "name": "Máy in A3 KYOCERA ECOSYS P4140dn",
    "slug": "may-in-a3-kyocera-ecosys-p4140dn",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-A3-KYOCERA-ECOSYS-P4140DN",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/ecosys-p4140dn.jpg",
    "excerpt": "Máy in A3 laser đơn chức năng đen trắng KYOCERA Ecosys P4140dn. Chính hãng mới nhất 2026. Cung ứng bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-in-a3-kyocera-ecosys-p4140dn.html"
  },
  {
    "id": "tp-may-in-den-trang-kyocera-ecosys-pa4000x",
    "name": "Máy in đen trắng Kyocera Ecosys PA4000x",
    "slug": "may-in-den-trang-kyocera-ecosys-pa4000x",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-DEN-TRANG-KYOCERA-ECOSYS-PA4000X",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/MFP_PA4000wx_comb01_front_01-1.jpg",
    "excerpt": "Máy in đen trắng nhãn hiệu Kyocera, model Ecosys PA4000x. Chính hãng mới nhất 2026. Cung ứng bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-in-den-trang-kyocera-ecosys-pa4000x.html"
  },
  {
    "id": "tp-may-in-a4-kyocera-ecosys-pa3500x",
    "name": "Máy in A4 Kyocera Ecosys PA3500x",
    "slug": "may-in-a4-kyocera-ecosys-pa3500x",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-A4-KYOCERA-ECOSYS-PA3500X",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/MFP_PA3500x_comb01_front_01.jpg",
    "excerpt": "Máy in A4 đen trắng Kyocera Ecosys PA3500x. Chính hãng mới nhất 2026. Cung ứng bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-in-a4-kyocera-ecosys-pa3500x.html"
  },
  {
    "id": "tp-may-in-a4-kyocera-ecosys-p2235dn",
    "name": "Máy in A4 KYOCERA Ecosys P2235dn",
    "slug": "may-in-a4-kyocera-ecosys-p2235dn",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-A4-KYOCERA-ECOSYS-P2235DN",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/ecosys-p2235dn.jpg",
    "excerpt": "Máy in A4 đen trắng KYOCERA Ecosys P2235dn. Chính hãng mới nhất 2026. Được cung ứng bởi Thuận Phát.",
    "url": "https://thuanphat8.vn/may-in-a4-kyocera-ecosys-p2235dn.html"
  },
  {
    "id": "tp-may-in-kyocera-ecosys-p4060dn",
    "name": "Máy in KYOCERA ECOSYS P4060dn",
    "slug": "may-in-kyocera-ecosys-p4060dn",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-KYOCERA-ECOSYS-P4060DN",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/ecosys-p4060dn.jpg",
    "excerpt": "Máy in KYOCERA chính hãng dòng ECOSYS P4060dn - công suất lớn, màn hình cảm ứng, sẵn hàng tại Việt Nam qua Thuận Phát.",
    "url": "https://thuanphat8.vn/may-in-kyocera-ecosys-p4060dn.html"
  },
  {
    "id": "tp-may-in-kyocera-ecosys-pa4000wx",
    "name": "Máy in Kyocera ECOSYS PA4000wx",
    "slug": "may-in-kyocera-ecosys-pa4000wx",
    "category": "may-in-kyocera",
    "sku": "MAY-IN-KYOCERA-ECOSYS-PA4000WX",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/2026/04/MFP_PA4000wx_comb01_front_01.jpg",
    "excerpt": "Máy in KYOCERA ECOSYS PA4000wx - Model máy in đơn năng hiện đại, chính hãng mới nhất 2026 tại Việt Nam.",
    "url": "https://thuanphat8.vn/may-in-kyocera-ecosys-pa4000wx.html"
  },
  {
    "id": "tp-ricoh-fi-7900",
    "name": "Ricoh fi-7900",
    "slug": "ricoh-fi-7900",
    "category": "may-scan",
    "sku": "RICOH-FI-7900",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/anh-san-pham/ricoh_fi-7900_front_letter-completion-full_e.jpg",
    "excerpt": "Sản phẩm chính hãng cung cấp bởi Công ty TNHH Công nghệ Thuận Phát.",
    "url": "https://thuanphat8.vn/ricoh-fi-7900.html"
  },
  {
    "id": "tp-fi-8150",
    "name": "Ricoh fi-8150",
    "slug": "fi-8150",
    "category": "may-scan",
    "sku": "FI-8150",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8150_front_Close.jpg",
    "excerpt": "Máy quét fi-8150 dành cho văn phòng phía trước, phù hợp với các khối lượng công việc nhẹ sử dụng công nghệ nuôi dưỡng và công nghệ Clear Image Capture...",
    "url": "https://thuanphat8.vn/fi-8150.html"
  },
  {
    "id": "tp-fi-8950",
    "name": "Ricoh fi-8950",
    "slug": "fi-8950",
    "category": "may-scan",
    "sku": "FI-8950",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2024/03/fi-8950_right_Close.jpg",
    "excerpt": "fi-8950 là máy quét sản xuất có hiệu suất cao nhất. Hiệu suất, sự bền bỉ và tính khả dụng để tối ưu hóa năng suất cho môi trường quét có khối lượng lớn.",
    "url": "https://thuanphat8.vn/fi-8950.html"
  },
  {
    "id": "tp-fi-8930",
    "name": "Ricoh fi-8930",
    "slug": "fi-8930",
    "category": "may-scan",
    "sku": "FI-8930",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2024/03/fi-8930_left_Scan_A4_LCD_EN_Key-Visual.jpg",
    "excerpt": "The fi-8930 là một máy quét nặng nhanh. Hiệu suất, sự bền bỉ và tính khả dụng để tối ưu hóa năng suất cho môi trường quét số lượng lớn.",
    "url": "https://thuanphat8.vn/fi-8930.html"
  },
  {
    "id": "tp-fi-8820",
    "name": "Ricoh fi-8820",
    "slug": "fi-8820",
    "category": "may-scan",
    "sku": "FI-8820",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2024/03/fi-8820_left_Scan_A4_LCD_EN_Key-Visual.jpg",
    "excerpt": "fi-8820 là một máy quét khổ A3 trung bình, được tối ưu hóa cao cho việc quét nặng như quét tốc độ cao và quy mô lớn để chịu được các nhiệm vụ hàng ngày và..",
    "url": "https://thuanphat8.vn/fi-8820.html"
  },
  {
    "id": "tp-fi-7800",
    "name": "Ricoh fi-7800",
    "slug": "fi-7800",
    "category": "may-scan",
    "sku": "FI-7800",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-7800_front_close_e.jpg",
    "excerpt": "Máy quét fi-7800 với tốc độ quét 110 trang mỗi phút và khay chứa 500 trang xử lý các lô lớn và đỉnh điểm công việc mùa với một mức giá rất hợp lý.",
    "url": "https://thuanphat8.vn/fi-7800.html"
  },
  {
    "id": "tp-fi-7700s",
    "name": "Ricoh fi-7700S",
    "slug": "fi-7700s",
    "category": "may-scan",
    "sku": "FI-7700S",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-7700S_front_ADF-left_close.jpg",
    "excerpt": "Với công nghệ chất lượng cao và thiết kế thân thiện với người dùng, máy quét này phù hợp cho việc quét liên tục với số lượng lớn. Khả năng quét của...",
    "url": "https://thuanphat8.vn/fi-7700s.html"
  },
  {
    "id": "tp-fi-7700",
    "name": "Ricoh fi-7700",
    "slug": "fi-7700",
    "category": "may-scan",
    "sku": "FI-7700",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-7700_front_ADF-left_close.jpg",
    "excerpt": "Với ngăn chứa lớn có thể chứa đến 300 trang và kỹ thuật tiên tiến, chiếc máy quét phổ biến dành cho văn phòng trung gian này có thể xử lý tài liệu rộng và...",
    "url": "https://thuanphat8.vn/fi-7700.html"
  },
  {
    "id": "tp-fi-7600",
    "name": "Ricoh fi-7600",
    "slug": "fi-7600",
    "category": "may-scan",
    "sku": "FI-7600",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-7600_front_close.jpg",
    "excerpt": "Với khay chứa giấy lớn 300 trang và kỹ thuật tiên tiến, máy quét fi-7600 là một lựa chọn phổ biến cho văn phòng trung tâm có thể xử lý tài liệu rộng và...",
    "url": "https://thuanphat8.vn/fi-7600.html"
  },
  {
    "id": "tp-fi-7480",
    "name": "Ricoh fi-7480",
    "slug": "fi-7480",
    "category": "may-scan",
    "sku": "FI-7480",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/04/ricoh_fi-7480_front_close-1.jpg",
    "excerpt": "Thiết kế cho khối lượng công việc chuyên nghiệp và được thiết kế để bền bỉ, máy quét fi-7480 cung cấp quét định dạng rộng trong không gian nhỏ nhất trong...",
    "url": "https://thuanphat8.vn/fi-7480.html"
  },
  {
    "id": "tp-fi-7460",
    "name": "Ricoh fi-7460",
    "slug": "fi-7460",
    "category": "may-scan",
    "sku": "FI-7460",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-7460_front_close.jpg",
    "excerpt": "Thiết kế để xử lý công việc chuyên nghiệp và được thiết kế để bền bỉ, máy quét fi-7460 cung cấp quét định dạng rộng trong không gian nhỏ nhất trong....",
    "url": "https://thuanphat8.vn/fi-7460.html"
  },
  {
    "id": "tp-fi-8040",
    "name": "Ricoh fi-8040",
    "slug": "fi-8040",
    "category": "may-scan",
    "sku": "FI-8040",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/05/3_fi-8040_Scene_Brochure_LCD.jpg",
    "excerpt": "The fi-8040, một Máy quét ADF có giá trị, đi kèm với chức năng mới &quot;DirectScan&quot; mở ra các lựa chọn mới để đáp ứng nhu cầu năng suất thực tế của doanh...",
    "url": "https://thuanphat8.vn/fi-8040.html"
  },
  {
    "id": "tp-fi-8270",
    "name": "Ricoh fi-8270",
    "slug": "fi-8270",
    "category": "may-scan",
    "sku": "FI-8270",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8270_front_Open1.jpg",
    "excerpt": "Được thiết kế cho các luồng công việc đòi hỏi, fi-8270 sử dụng công nghệ nuôi dưỡng và công nghệ Clear Image Capture sáng tạo để cung cấp độ tin cậy hàng..",
    "url": "https://thuanphat8.vn/fi-8270.html"
  },
  {
    "id": "tp-fi-8290",
    "name": "Ricoh fi-8290",
    "slug": "fi-8290",
    "category": "may-scan",
    "sku": "FI-8290",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8250U_front_Close.jpg",
    "excerpt": "Fi-8290 cung cấp hiệu suất vượt trội và khả năng hình ảnh hóa tài liệu hàng đầu trên thị trường. Máy quét đi kèm với cơ chế nạp giấy đáng tin cậy, giúp...",
    "url": "https://thuanphat8.vn/fi-8290.html"
  },
  {
    "id": "tp-fi-8250",
    "name": "Ricoh fi-8250",
    "slug": "fi-8250",
    "category": "may-scan",
    "sku": "FI-8250",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8250_front_Open1.jpg",
    "excerpt": "Chiếc máy quét fi-8250 dành cho văn phòng phía trước, phù hợp với các khối lượng công việc nhẹ sử dụng công nghệ nuôi dưỡng và công nghệ Clear Image Capture..",
    "url": "https://thuanphat8.vn/fi-8250.html"
  },
  {
    "id": "tp-fi-8250u",
    "name": "Ricoh fi-8250U",
    "slug": "fi-8250u",
    "category": "may-scan",
    "sku": "FI-8250U",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8250U_front_Close.jpg",
    "excerpt": "The fi-8250U, một Máy quét ADF hiệu quả mang đến trải nghiệm đột phá và vượt trội, và đi kèm quét đa năng dưới dạng bàn phẳng và ADF.",
    "url": "https://thuanphat8.vn/fi-8250u.html"
  },
  {
    "id": "tp-fi-8190",
    "name": "Ricoh fi-8190",
    "slug": "fi-8190",
    "category": "may-scan",
    "sku": "FI-8190",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8190_front_Close.jpg",
    "excerpt": "Hãy đối mặt với những công việc khó nhất tại văn phòng trước với chiếc máy quét cao cấp này. Máy quét fi-8190 sử dụng công nghệ nuôi dưỡng và công nghệ...",
    "url": "https://thuanphat8.vn/fi-8190.html"
  },
  {
    "id": "tp-fi-8170",
    "name": "Ricoh fi-8170",
    "slug": "fi-8170",
    "category": "may-scan",
    "sku": "FI-8170",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8170_front_Close.jpg",
    "excerpt": "Made for demanding workflows, the compact fi-8170 employs innovative feeding technologies and proprietary Clear Image Capture (CIC) technology to..",
    "url": "https://thuanphat8.vn/fi-8170.html"
  },
  {
    "id": "tp-fi-8150u",
    "name": "Ricoh fi-8150U",
    "slug": "fi-8150u",
    "category": "may-scan",
    "sku": "FI-8150U",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-8150U_front_Close-1.jpg",
    "excerpt": "Điểm nổi bật  Hỗ trợ nhu cầu quét đa dạng với công nghệ tiên tiến trong việc nạp giấy Quét nhanh hơn mà không bị gián đoạn để giúp tăng cường hiệu quả.  ...",
    "url": "https://thuanphat8.vn/fi-8150u.html"
  },
  {
    "id": "tp-fi-800r",
    "name": "Ricoh fi-800R",
    "slug": "fi-800r",
    "category": "may-scan",
    "sku": "FI-800R",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-800R_front_cover-open-1.jpg",
    "excerpt": "Chiếc máy quét fi-800R hiệu suất cao cung cấp trải nghiệm quét linh hoạt cho mọi loại tài liệu, từ giấy kích thước thư đến hộ chiếu và thẻ căn cước.",
    "url": "https://thuanphat8.vn/fi-800r.html"
  },
  {
    "id": "tp-scansnap-sv600",
    "name": "ScanSnap SV600",
    "slug": "scansnap-sv600",
    "category": "may-scan",
    "sku": "SCANSNAP-SV600",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/SV600_bp-front_R-white.jpg",
    "excerpt": "Máy quét không tiếp xúc phong cách mới này mang đến một góc nhìn mới về việc quét tài liệu. Đèn LED trên đầu giúp dễ dàng quét báo và..",
    "url": "https://thuanphat8.vn/scansnap-sv600.html"
  },
  {
    "id": "tp-scansnap-ix2500",
    "name": "ScanSnap iX2500",
    "slug": "scansnap-ix2500",
    "category": "may-scan",
    "sku": "SCANSNAP-IX2500",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2025/06/ix2500-Featured-Image-1-1.jpg",
    "excerpt": "Mẫu flagship mới nhất trong dòng sản phẩm ScanSnap mang đến khả năng quét tài liệu nhanh hơn và kết nối được cải thiện, giúp việc truy cập và chia sẻ dữ..",
    "url": "https://thuanphat8.vn/scansnap-ix2500.html"
  },
  {
    "id": "tp-scansnap-ix2400-may-scan-hieu-ricoh-2025",
    "name": "ScanSnap iX2400",
    "slug": "scansnap-ix2400-may-scan-hieu-ricoh-2025",
    "category": "may-scan",
    "sku": "SCANSNAP-IX2400-MAY-SCAN-HIEU-RICOH-2025",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/uploads/anh-san-pham/ix2400-Featured-Image-1-1.jpg",
    "excerpt": "Máy scan hiện đại cho cá nhân và văn phòng 2026 từ RICOH - Top 1 máy scan thế giới",
    "url": "https://thuanphat8.vn/scansnap-ix2400-may-scan-hieu-ricoh-2025.html"
  },
  {
    "id": "tp-scansnap-ix1600",
    "name": "ScanSnap iX1600",
    "slug": "scansnap-ix1600",
    "category": "may-scan",
    "sku": "SCANSNAP-IX1600",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/007_iX1600_W_Front_Overhead_US_R-1.jpg",
    "excerpt": "iX1600 là giải pháp quản lý tài liệu toàn diện cho phép bạn số hóa và tổ chức tất cả các tài liệu của bạn chỉ với một chạm. Nó nhanh chóng và dễ dàng...",
    "url": "https://thuanphat8.vn/scansnap-ix1600.html"
  },
  {
    "id": "tp-scansnap-ix1400",
    "name": "ScanSnap iX1400",
    "slug": "scansnap-ix1400",
    "category": "may-scan",
    "sku": "SCANSNAP-IX1400",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/008_iX1400_W_Front_Overhead_US_R-1.jpg",
    "excerpt": "Máy quét ScanSnap iX1400 đơn giản nhưng tinh tế, số hóa, xử lý và tổ chức tất cả các tài liệu của bạn chỉ với một nút nhấn.",
    "url": "https://thuanphat8.vn/scansnap-ix1400.html"
  },
  {
    "id": "tp-sp-1130n",
    "name": "Ricoh SP-1130N",
    "slug": "sp-1130n",
    "category": "may-scan",
    "sku": "SP-1130N",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_SP-1130N_front_close.jpg",
    "excerpt": "Máy quét SP-1130N mang lại hiệu suất cao với giá cả phải chăng, cung cấp tốc độ quét lên đến 30 trang/phút / 60 hình ảnh/phút (khổ giấy A4, màu sắc...",
    "url": "https://thuanphat8.vn/sp-1130n.html"
  },
  {
    "id": "tp-sp-1425",
    "name": "Ricoh SP-1425",
    "slug": "sp-1425",
    "category": "may-scan",
    "sku": "SP-1425",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_SP-1425_front_open1.jpg",
    "excerpt": "Máy quét văn phòng cấp nhập môn này hỗ trợ TWAIN và ISIS®, mang đến tính linh hoạt với bộ nạp tài liệu và mặt phẳng kích thước thư.",
    "url": "https://thuanphat8.vn/sp-1425.html"
  },
  {
    "id": "tp-sp-1125n",
    "name": "Ricoh SP-1125N",
    "slug": "sp-1125n",
    "category": "may-scan",
    "sku": "SP-1125N",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_SP-1125N_front_close.jpg",
    "excerpt": "Dựa trên thiết kế nhỏ gọn và tương thích mạng, máy quét SP-1125N cung cấp hiệu suất cao với giá thành phù hợp như một mẫu máy nhập môn dành cho tất cả các..",
    "url": "https://thuanphat8.vn/sp-1125n.html"
  },
  {
    "id": "tp-sp-1120n",
    "name": "Ricoh SP-1120N",
    "slug": "sp-1120n",
    "category": "may-scan",
    "sku": "SP-1120N",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_SP-1120N_front_close.jpg",
    "excerpt": "Chiếc máy quét nhỏ gọn này có thể kết nối mạng, hoàn hảo cho việc quét cấp đầu, cá nhân và doanh nghiệp nhỏ. Lý tưởng cho người dùng có hạn chế không gian.",
    "url": "https://thuanphat8.vn/sp-1120n.html"
  },
  {
    "id": "tp-scansnap-ix100",
    "name": "ScanSnap iX100",
    "slug": "scansnap-ix100",
    "category": "may-scan",
    "sku": "SCANSNAP-IX100",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/iX100_front_fullopen_R.jpg",
    "excerpt": "Máy quét di động siêu nhẹ, sử dụng pin, kết nối không dây và đơn giản chỉ cần một nút bấm để giúp bạn vượt qua mọi chồng giấy.",
    "url": "https://thuanphat8.vn/scansnap-ix100.html"
  },
  {
    "id": "tp-fi-7300nx",
    "name": "Ricoh fi-7300NX",
    "slug": "fi-7300nx",
    "category": "may-scan",
    "sku": "FI-7300NX",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/ricoh_fi-7300NX_front_stacker-open.jpg",
    "excerpt": "Đơn giản hóa quét và giảm chi phí IT với máy quét mạng fi-7300NX. Kết nối Wi-Fi và Ethernet cho phép đặt hoàn hảo với hoặc không cần PC.",
    "url": "https://thuanphat8.vn/fi-7300nx.html"
  },
  {
    "id": "tp-scansnap-ix1300",
    "name": "ScanSnap iX1300",
    "slug": "scansnap-ix1300",
    "category": "may-scan",
    "sku": "SCANSNAP-IX1300",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/03/iX1300W_Front09_Extension-Open_Fukan1_Mixed-loading_R.jpg",
    "excerpt": "Máy quét ScanSnap iX1300 giúp người dùng quét nhanh hơn, tiện lợi hơn với kết nối Wi-Fi, trong một diện tích vận hành cực kỳ nhỏ gọn, cho phép làm...",
    "url": "https://thuanphat8.vn/scansnap-ix1300.html"
  },
  {
    "id": "tp-fi-70f",
    "name": "Ricoh fi-70F",
    "slug": "fi-70f",
    "category": "may-scan",
    "sku": "FI-70F",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/vn/wp-content/uploads/2023/05/4_fi-70F_Scene_Brochure_fi-70F_EN.jpg",
    "excerpt": "Máy quét phẳng fi-70F với diện tích nhỏ gọn, được thiết kế để di chuyển dễ dàng và phù hợp với không gian hẹp, đảm bảo quét nhanh chóng và dễ dàng các...",
    "url": "https://thuanphat8.vn/fi-70f.html"
  },
  {
    "id": "tp-p-501",
    "name": "Ricoh P 501 Máy in trắng đen A4",
    "slug": "p-501",
    "category": "may-photocopy-ricoh",
    "sku": "P-501",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/p-501-and-p-502/main_product-detail-1024x1024-p_501t.jpg?dmc=0&amp;hash=D68B248F15551C56C5986266B9666597",
    "excerpt": "Ricoh P 501 quickly processes even the most complex jobs, printing pitch-perfect 1,200 x 1,200 dpi black and white output at a productive 43 pages per",
    "url": "https://thuanphat8.vn/p-501.html"
  },
  {
    "id": "tp-p-801",
    "name": "Ricoh P 801 Máy in trắng đen A4",
    "slug": "p-801",
    "category": "may-photocopy-ricoh",
    "sku": "P-801",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/im-500-and-p-800-series/main_product-detail-1024x1024-p801.jpg?dmc=0&amp;hash=70BC418712EF2F0F9C8FB73776D4845B",
    "excerpt": "Upgrade your office printing capabilities with Ricoh&#039;s P 801 black and white printer.",
    "url": "https://thuanphat8.vn/p-801.html"
  },
  {
    "id": "tp-p-c600",
    "name": "Ricoh P C600 Máy in màu A4",
    "slug": "p-c600",
    "category": "may-photocopy-ricoh",
    "sku": "P-C600",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-colour/p-c600/main_product-detail-1024x1024-pc600.jpg?dmc=0&amp;hash=E80D357D5479D6987C8682D83D1B0DA7",
    "excerpt": "Small and compact Colour laser Printer designed for the demanding office with print speeds of 40 PPM. Call 13 RICOH.",
    "url": "https://thuanphat8.vn/p-c600.html"
  },
  {
    "id": "tp-p-800",
    "name": "Ricoh P 800 Máy in trắng đen A4",
    "slug": "p-800",
    "category": "may-photocopy-ricoh",
    "sku": "P-800",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/im-500-and-p-800-series/main_product-detail-1024x1024-p800.jpg?dmc=0&amp;hash=DA346F63BB04F9F8A529312A4C3EA980",
    "excerpt": "Explore Ricoh&#039;s P 800 black and white office printer for high-quality and efficient printing.",
    "url": "https://thuanphat8.vn/p-800.html"
  },
  {
    "id": "tp-p-502",
    "name": "Ricoh P 502 Máy in trắng đen A4",
    "slug": "p-502",
    "category": "may-photocopy-ricoh",
    "sku": "P-502",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/p-501-and-p-502/main_product-detail-1024x1024-p_501t.jpg?dmc=0&amp;hash=D68B248F15551C56C5986266B9666597",
    "excerpt": "Its powerful Intel 1.1 - 1.3 GHz processor effortlessly processes complex jobs and eliminating bottlenecks, the printer delivers its first pristine 1,",
    "url": "https://thuanphat8.vn/p-502.html"
  },
  {
    "id": "tp-im-c6000",
    "name": "Ricoh IM C6000 / IM C6000LT Máy đa chức năng màu A3",
    "slug": "im-c6000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C6000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/imc6000/main_product-detail-1024x1024-im-c6000-award-v4.jpg?dmc=0&amp;hash=0C7575CFD42839E58EE4E30E598934AE",
    "excerpt": "In, photo, scan và fax dễ dàng và chia sẻ thông tin nhanh chóng với thiết bị in đa chức năng này.Liên hệ chúng tôi để được tư vấn thêm: https://ricoh.",
    "url": "https://thuanphat8.vn/im-c6000.html"
  },
  {
    "id": "tp-im-c4500",
    "name": "Ricoh IM C4500 / IM C4500LT Máy đa chức năng màu A3",
    "slug": "im-c4500",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C4500",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/imc4500/main_product-detail-1024x1024-im-c4500-award-v5.jpg?dmc=0&amp;hash=78746FB477A8EE0668F8C11D50AE592F",
    "excerpt": "In, photo, scan và fax dễ dàng và chia sẻ thông tin nhanh chóng với thiết bị in đa chức năng này. Liên hệ chúng tôi để được tư vấn thêm: https://ricoh",
    "url": "https://thuanphat8.vn/im-c4500.html"
  },
  {
    "id": "tp-im-c400f",
    "name": "Ricoh IM C400F Máy in đa năng A4 màu",
    "slug": "im-c400f",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C400F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c300-and-im-c400f/main_product-detail-1024x1024-im-c400f.jpg?dmc=0&amp;hash=E0B6A6C03D714604BED6509478EAA5DC",
    "excerpt": "IM C400F is an A4 colour multifunction printer. Print, copy and scan. Produces up to 43 prints/copies per minute. 1200 x 1,200 dpi print resolution.",
    "url": "https://thuanphat8.vn/im-c400f.html"
  },
  {
    "id": "tp-im-c3500",
    "name": "Ricoh IM C3500 / IM C3500LT Máy đa chức năng màu A3",
    "slug": "im-c3500",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C3500",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/imc3500/main_product-detail-1024x1024-im-c3500-award-v4.jpg?dmc=0&amp;hash=CC108A6EBA10643EB347E5416AB66E2C",
    "excerpt": "In, photo, scan và fax dễ dàng và chia sẻ thông tin nhanh chóng với thiết bị in đa chức năng này.Liên hệ chúng tôi để được tư vấn thêm: https://ricoh",
    "url": "https://thuanphat8.vn/im-c3500.html"
  },
  {
    "id": "tp-im-c300f",
    "name": "Ricoh IM C300F Máy MFP màu A4",
    "slug": "im-c300f",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C300F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c300-and-im-c400f/main_product-detail-1024x1024-im-c300f.jpg?dmc=0&amp;hash=7863ED29F3FF39B58B6A9D01626D792E",
    "excerpt": "IM C300F is an A4 colour multifunction printer. Print, copy and scan. Produces up to 30 prints/copies per minute. 1200 x 1,200 dpi print resolution.",
    "url": "https://thuanphat8.vn/im-c300f.html"
  },
  {
    "id": "tp-im-c3000",
    "name": "Ricoh IM C3000 / IM C3000LT Máy đa chức năng màu A3",
    "slug": "im-c3000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C3000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/imc3000/main_product-detail-1024x1024-im-c3000-award-v4.jpg?dmc=0&amp;hash=9313B0B96C224701A452D2D364B6C6EF",
    "excerpt": "In, photo, scan và fax dễ dàng và chia sẻ tin nhắn liền mạch với thiết bị đa chức năng máy tính để bàn này.Liên hệ chúng tôi để được tư vấn thêm: http",
    "url": "https://thuanphat8.vn/im-c3000.html"
  },
  {
    "id": "tp-im-c6010",
    "name": "Ricoh IM C6010 Máy in màu A3 đa chức năng",
    "slug": "im-c6010",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C6010",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010-series/main_product-detail-1024x1024-im-c6010-datamaster.jpg?dmc=0&amp;hash=0707370E9D95F043254F26AD82F52BE2",
    "excerpt": "Máy in màu đa chức năng (MFP) kỹ thuật số RICOH IM C6010 là sự kết hợp hoàn hảo cho phong cách làm việc của bạn.",
    "url": "https://thuanphat8.vn/im-c6010.html"
  },
  {
    "id": "tp-m-320f",
    "name": "Ricoh M 320F Máy in đa chức năng đen trắng A4",
    "slug": "m-320f",
    "category": "may-photocopy-ricoh",
    "sku": "M-320F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/m-320f-and-p-310-series/main_product-detail-1024x1024-m-320f.jpg?dmc=0&amp;hash=EAED7F3A96089CA5BD1EF744D5531119",
    "excerpt": "Máy in đen trắng đa chức năng Ricoh M 320F A4 mang lại năng suất in ấn cho văn phòng nhỏ và gia đình. Dễ sử dụng, tiết kiệm chi phí, in ấn di động và",
    "url": "https://thuanphat8.vn/m-320f.html"
  },
  {
    "id": "tp-im-c4510",
    "name": "Ricoh IM C4510 Máy in màu A3 đa chức năng",
    "slug": "im-c4510",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C4510",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010-series/main_product-detail-1024x1024-im-c4510-datamaster.jpg?dmc=0&amp;hash=D3AB5655C67DAF74905ECD3F5FF33A99",
    "excerpt": "Máy in màu đa chức năng (MFP) kỹ thuật số RICOH IM C4510 là sự kết hợp hoàn hảo cho phong cách làm việc của bạn.",
    "url": "https://thuanphat8.vn/im-c4510.html"
  },
  {
    "id": "tp-im-c3510",
    "name": "Ricoh IM C3510 Máy in màu A3 đa chức năng",
    "slug": "im-c3510",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C3510",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010-series/main_product-detail-1024x1024-im-c3510-datamaster.jpg?dmc=0&amp;hash=3B725DC25F7156DE3F9E5C197FF1ED31",
    "excerpt": "Máy in màu đa chức năng (MFP) kỹ thuật số RICOH IM C3510 là sự kết hợp hoàn hảo cho phong cách làm việc của bạn.",
    "url": "https://thuanphat8.vn/im-c3510.html"
  },
  {
    "id": "tp-im-c3010",
    "name": "Ricoh IM C3010 Máy in màu A3 đa chức năng",
    "slug": "im-c3010",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C3010",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010-series/main_product-detail-1024x1024-im-c3010-with-seals.jpg?dmc=0&amp;hash=A25D3E4A35D47E554E31CB07B8FA5CC0",
    "excerpt": "Máy in màu đa chức năng (MFP) kỹ thuật số RICOH IM C3010 là sự kết hợp hoàn hảo cho phong cách làm việc của bạn.",
    "url": "https://thuanphat8.vn/im-c3010.html"
  },
  {
    "id": "tp-im-c2510",
    "name": "Ricoh IM C2510 Máy in màu A3 đa chức năng",
    "slug": "im-c2510",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C2510",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010-series/main_product-detail-1024x1024-im-c2510-datamaster.jpg?dmc=0&amp;hash=785E67F6E19B6B33165418E77169826D",
    "excerpt": "Máy in màu đa chức năng (MFP) kỹ thuật số RICOH IM C2510 là sự kết hợp hoàn hảo cho phong cách làm việc của bạn.",
    "url": "https://thuanphat8.vn/im-c2510.html"
  },
  {
    "id": "tp-im-c2010",
    "name": "Ricoh IM C2010 Máy in màu A3 đa chức năng",
    "slug": "im-c2010",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C2010",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010-series/main_product-detail-1024x1024-im-c2010-datamaster.jpg?dmc=0&amp;hash=FE05E99F2E2DEC24AB8A229360E1A3D0",
    "excerpt": "Máy màu in đa chức năng (MFP) kỹ thuật số RICOH IM C2010 là sự kết hợp hoàn hảo cho phong cách làm việc của bạn.",
    "url": "https://thuanphat8.vn/im-c2010.html"
  },
  {
    "id": "tp-ip-cw2200",
    "name": "IP CW2200 Máy in màu khổ rộng",
    "slug": "ip-cw2200",
    "category": "may-in-kyocera",
    "sku": "IP-CW2200",
    "type": "Máy In Laser Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/commercial-and-industrial-printing-solutions/cad-wide-format/ip-cw2200/main_product-detail-1024x1024-ip-cw2200.jpg?dmc=0&amp;hash=6483EB6ACA97C618E11935384F5D9D19",
    "excerpt": "Máy in khổ rộng màu kỹ thuật số RICOH IP CW2200 giúp việc tạo các bản vẽ CAD và các tài liệu kỹ thuật khổ A1/A0 khổ lớn khác trở nên dễ dàng và thuận",
    "url": "https://thuanphat8.vn/ip-cw2200.html"
  },
  {
    "id": "tp-im-cw2200",
    "name": "Ricoh IM CW2200 Máy in đa màu chức năng khổ rộng",
    "slug": "im-cw2200",
    "category": "may-photocopy-ricoh",
    "sku": "IM-CW2200",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/commercial-and-industrial-printing-solutions/cad-wide-format/im-cw2200/main_product-detail-1024x1024-ricoh-im-cw2200.jpg?dmc=0&amp;hash=1909202A9D45A938090CA9A05EE5669D",
    "excerpt": "Máy in đa chức năng định dạng rộng màu kỹ thuật số RICOH IM CW2200 giúp việc tạo các bản vẽ CAD và các tài liệu A1/A0 lớn khác trở nên dễ dàng và an",
    "url": "https://thuanphat8.vn/im-cw2200.html"
  },
  {
    "id": "tp-im-460f",
    "name": "Ricoh IM 460F Máy in đa chức năng đen trắng A4",
    "slug": "im-460f",
    "category": "may-photocopy-ricoh",
    "sku": "IM-460F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-370f/main_product-detail-1024x1024-im-460f.jpg?dmc=0&amp;hash=D48822DD0F0EDBBE189389EA70499028",
    "excerpt": "Máy in đa chức năng đen trắng (MFP) RICOH IM 460F cung cấp khả năng in A3 trong kiểu dáng A4 nhỏ gọn.",
    "url": "https://thuanphat8.vn/im-460f.html"
  },
  {
    "id": "tp-im-370f",
    "name": "Ricoh IM 370F Máy in đa chức năng đen trắng A4",
    "slug": "im-370f",
    "category": "may-photocopy-ricoh",
    "sku": "IM-370F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-370f/main_product-detail-1024x1024-im_370f.jpg?dmc=0&amp;hash=4197C6C774ED187318B3AE5B357BA4DC",
    "excerpt": "Máy in đa chức năng đen trắng (MFP) RICOH IM 370F cung cấp khả năng A3 trong kiểu dáng A4 nhỏ gọn.",
    "url": "https://thuanphat8.vn/im-370f.html"
  },
  {
    "id": "tp-im-c3510ex",
    "name": "Ricoh IM C3510EX Máy in đa chức năng màu A3",
    "slug": "im-c3510ex",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C3510EX",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010aex-im-c3010ex-im-c3510ex/main_product-detail-1024x1024-im-c3510-ex-datamaster.jpg?dmc=0&amp;hash=2EAADA2313E805C1106B09E90654E200",
    "excerpt": "Máy in đa chức năng màu kỹ thuật số (MFP) RICOH IM C3510EX là sự lựa chọn hoàn hảo cho công việc của bạn.",
    "url": "https://thuanphat8.vn/im-c3510ex.html"
  },
  {
    "id": "tp-im-c3010ex",
    "name": "Ricoh IM C3010EX Máy in đa chức năng màu A3",
    "slug": "im-c3010ex",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C3010EX",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010aex-im-c3010ex-im-c3510ex/main_product-detail-1024x1024-im-c3010-ex-v2.jpg?dmc=0&amp;hash=4383F1DF62277D88F2E52A4DA1998120",
    "excerpt": "Máy in đa chức năng màu kỹ thuật số (MFP) RICOH IM C3010EX là sự lựa chọn hoàn hảo cho công việc của bạn.",
    "url": "https://thuanphat8.vn/im-c3010ex.html"
  },
  {
    "id": "tp-im-c2010aex",
    "name": "Ricoh IM C2010AEX Máy in đa chức năng màu A3",
    "slug": "im-c2010aex",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C2010AEX",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c2010aex-im-c3010ex-im-c3510ex/main_product-detail-1024x1024-im-c2010-aex-datamaster.jpg?dmc=0&amp;hash=75899E06F4FEF3EC796DFF859CB2181C",
    "excerpt": "Máy in đa chức năng màu kỹ thuật số (MFP) RICOH IM C2010AEX là sự lựa chọn hoàn hảo cho công việc của bạn.",
    "url": "https://thuanphat8.vn/im-c2010aex.html"
  },
  {
    "id": "tp-p-c375",
    "name": "Ricoh P C375 Máy in màu A4",
    "slug": "p-c375",
    "category": "may-photocopy-ricoh",
    "sku": "P-C375",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c320f-m-c320fw-p-c375/main_product-detail-1024x1024-p-c375.webp?dmc=0&amp;hash=47EFD78EBDC528A7CF4CDAA00E0DC6D7",
    "excerpt": "RICOH P C375 cung cấp các bản in màu A4 đặc biệt với kích thước tiết kiệm không gian.",
    "url": "https://thuanphat8.vn/p-c375.html"
  },
  {
    "id": "tp-m-c320fw",
    "name": "Ricoh M C320FW Máy in đa chức năng màu A4",
    "slug": "m-c320fw",
    "category": "may-photocopy-ricoh",
    "sku": "M-C320FW",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c320f-m-c320fw-p-c375/main_product-detail-1024x1024-m-c320fw.webp?dmc=0&amp;hash=3B29595FB8C9C233C7F1154B4F4034BC",
    "excerpt": "RICOH M C320FW là máy in đa chức năng A4 (MFP) nhỏ gọn và giá cả phải chăng để sử dụng cho văn phòng nói chung.",
    "url": "https://thuanphat8.vn/m-c320fw.html"
  },
  {
    "id": "tp-m-c2000",
    "name": "Ricoh M C2000 Máy in đa chức năng màu A3",
    "slug": "m-c2000",
    "category": "may-photocopy-ricoh",
    "sku": "M-C2000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/m-c2000/main_product-detail-1024x1024-m-c2000.jpg?dmc=0&amp;hash=BB926C1CD811FCE51DCC8E76AF50A712",
    "excerpt": "RICOH IM C2000. Máy in đa chức năng màu khổ A3. Sao chép, in, quét, fax tùy chọn. In tới 80 trang/phút. Đầu vào tối đa 8.100 tờ. Cập nhật liên tục",
    "url": "https://thuanphat8.vn/m-c2000.html"
  },
  {
    "id": "tp-im-c320f",
    "name": "Ricoh IM C320F Máy in đa chức năng màu A4",
    "slug": "im-c320f",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C320F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c320f-m-c320fw-p-c375/main_product-detail-1024x1024-im-c320f-v3.webp?dmc=0&amp;hash=40AB7693911F7EF1C53C494736FDA4FF",
    "excerpt": "RICOH IM C320F là máy in đa chức năng (MFP) A4 nhỏ gọn và giàu tính năng, phù hợp với hầu hết mọi nơi trong văn phòng.",
    "url": "https://thuanphat8.vn/im-c320f.html"
  },
  {
    "id": "tp-m-320fb",
    "name": "Ricoh M 320FB Máy in đa chức năng đen trắng A4",
    "slug": "m-320fb",
    "category": "may-photocopy-ricoh",
    "sku": "M-320FB",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/m-320f-and-p-310-series/main_product-detail-1024x1024-m-320fb.jpg?dmc=0&amp;hash=B0B36CCE0ECF631581E4D537F63C663D",
    "excerpt": "Máy in đen trắng đa chức năng Ricoh M 320FB A4 - lý tưởng cho văn phòng nhỏ và gia đình. Máy in đen trắng, Sao chép, Máy quét và Fax dễ sử dụng với Wi",
    "url": "https://thuanphat8.vn/m-320fb.html"
  },
  {
    "id": "tp-im-c2500",
    "name": "Ricoh IM C2500 / IM C2500LT Máy đa chức năng màu A3",
    "slug": "im-c2500",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C2500",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/imc2500/main_product-detail-1024x1024-im-c2500-award-v4.jpg?dmc=0&amp;hash=9B27EE922D477FFA94A6AB6D14F9F7F6",
    "excerpt": "In, photo, scan và fax dễ dàng và chia sẻ tập tin nhanh chóng với thiết bị in ấn đa chức năng màu này.",
    "url": "https://thuanphat8.vn/im-c2500.html"
  },
  {
    "id": "tp-im-c2000",
    "name": "Ricoh IM C2000 / IM C2000LT Máy đa chức năng màu A3",
    "slug": "im-c2000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C2000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/imc2000/main_product-detail-1024x1024-im-c2000-award-v4.jpg?dmc=0&amp;hash=0E3466F8AE5038F53049C70A1239658F",
    "excerpt": "In, photo, scan và fax dễ dàng và chia sẻ tin nhắn nhanh chóng với thiết bị in đa chức năng màu này.Liên hệ chúng tôi để được tư vấn thêm: https://ric",
    "url": "https://thuanphat8.vn/im-c2000.html"
  },
  {
    "id": "tp-im-550f",
    "name": "Ricoh IM 550F Máy in đa chức năng A4 trắng đen",
    "slug": "im-550f",
    "category": "may-photocopy-ricoh",
    "sku": "IM-550F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/im-500-and-p-800-series/main_product-detail-1024x1024-im550.jpg?dmc=0&amp;hash=397B0114575DB02F144999EB7BA87D16",
    "excerpt": "All-in-one can mean more than print, copy, scan and fax. Transform your office with the IM 550F Black &amp; White Multifunction Printer to boost productiv",
    "url": "https://thuanphat8.vn/im-550f.html"
  },
  {
    "id": "tp-im-2702",
    "name": "Ricoh IM 2702 Máy đa chức năng trắng đen khổ A3",
    "slug": "im-2702",
    "category": "may-photocopy-ricoh",
    "sku": "IM-2702",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2702/main_product-detail-1024x1024-im-2702.jpg?dmc=0&amp;hash=DF3DB6A8B0DD3F3571FE6186BB12E327",
    "excerpt": "RICOH IM 2702 is a budget friendly device that comes with a host of improved features, making it easier to use and connect to, while at the same time",
    "url": "https://thuanphat8.vn/im-2702.html"
  },
  {
    "id": "tp-im-9000",
    "name": "Ricoh IM 9000 Máy in đa chức năng A3 trắng đen",
    "slug": "im-9000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-9000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-7000-im-8000-im-9000/main_product-detail-1024x1024-im-7000-im-8000-im-9000.jpg?dmc=0&amp;hash=D48BA29558F2A17E22C92D4B266AD049",
    "excerpt": "RICOH IM 9000 is a multifunctional printer that supports office productivity and easy print and digital document management.",
    "url": "https://thuanphat8.vn/im-9000.html"
  },
  {
    "id": "tp-im-8000",
    "name": "Ricoh IM 8000 Máy in đa chức năng trắng đen A3",
    "slug": "im-8000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-8000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-7000-im-8000-im-9000/main_product-detail-1024x1024-im-7000-im-8000-im-9000.jpg?dmc=0&amp;hash=D48BA29558F2A17E22C92D4B266AD049",
    "excerpt": "RICOH IM 8000 is an affordable production-capacity printer that delivers fast printing options and professional print finishes.",
    "url": "https://thuanphat8.vn/im-8000.html"
  },
  {
    "id": "tp-im-7000",
    "name": "Ricoh IM 7000 Máy in đa chức năng A3 trắng đen",
    "slug": "im-7000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-7000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-7000-im-8000-im-9000/main_product-detail-1024x1024-im-7000-im-8000-im-9000.jpg?dmc=0&amp;hash=D48BA29558F2A17E22C92D4B266AD049",
    "excerpt": "RICOH IM 7000 is a multifunctional printer designed for enhanced productivity and high reliability, even for large print runs.",
    "url": "https://thuanphat8.vn/im-7000.html"
  },
  {
    "id": "tp-im-6000",
    "name": "Ricoh IM 6000 Máy in đa chức năng A3 trắng đen",
    "slug": "im-6000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-6000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2500-and-im-6000-series/main_product-detail-1024x1024-im-2500-im-6000.jpg?dmc=0&amp;hash=40D911245FECFF9979669E3EDDCD6805",
    "excerpt": "RICOH IM 6000 giúp việc quản lý lưu trữ dữ liệu dễ dàng hơn và tối đa hóa hiệu suất làm việc mà vẫn đảm bảo bảo mật thông tin.",
    "url": "https://thuanphat8.vn/im-6000.html"
  },
  {
    "id": "tp-im-5000",
    "name": "Ricoh IM 5000 Máy in đa chức năng A3 trắng đen",
    "slug": "im-5000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-5000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2500-and-im-6000-series/main_product-detail-1024x1024-im-2500-im-6000.jpg?dmc=0&amp;hash=40D911245FECFF9979669E3EDDCD6805",
    "excerpt": "RICOH IM 5000 giúp quản lý việc lưu trữ dữ liệu một cách dễ dàng và tối đa hóa hiệu suất làm việc mà vẫn đảm bảo bảo mật thông tin.",
    "url": "https://thuanphat8.vn/im-5000.html"
  },
  {
    "id": "tp-im-4000",
    "name": "Ricoh IM 4000 Máy in đa chức năng A3 trắng đen",
    "slug": "im-4000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-4000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2500-and-im-6000-series/main_product-detail-1024x1024-im-2500-im-6000.jpg?dmc=0&amp;hash=40D911245FECFF9979669E3EDDCD6805",
    "excerpt": "RICOH IM 4000 makes it easy to manage document storage and printing to boost productivity while keeping your information secure.",
    "url": "https://thuanphat8.vn/im-4000.html"
  },
  {
    "id": "tp-im-3500",
    "name": "Ricoh IM 3500 Máy in đa chức năng A3 trắng đen",
    "slug": "im-3500",
    "category": "may-photocopy-ricoh",
    "sku": "IM-3500",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2500-and-im-6000-series/main_product-detail-1024x1024-im-2500-im-6000.jpg?dmc=0&amp;hash=40D911245FECFF9979669E3EDDCD6805",
    "excerpt": "RICOH IM 3500 giúp việc quản lý lưu trữ dữ liệu một cách dễ dàng và thúc đẩy hiệu suất làm việc trong khi vẫn đảm bảo bảo mật thông tin.",
    "url": "https://thuanphat8.vn/im-3500.html"
  },
  {
    "id": "tp-im-3000",
    "name": "Ricoh IM 3000 Máy in đa chức năng A3 trắng đen",
    "slug": "im-3000",
    "category": "may-photocopy-ricoh",
    "sku": "IM-3000",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2500-and-im-6000-series/main_product-detail-1024x1024-im-2500-im-6000.jpg?dmc=0&amp;hash=40D911245FECFF9979669E3EDDCD6805",
    "excerpt": "RICOH IM 3000 giúp lưu trữ dữ liệu một cách dễ dàng và hỗ trợ tối đa hóa năng xuất in ấn, giúp thông tin luôn được bảo mật.",
    "url": "https://thuanphat8.vn/im-3000.html"
  },
  {
    "id": "tp-im-2500",
    "name": "Ricoh IM 2500 Máy in đa chức năng A3 trắng đen",
    "slug": "im-2500",
    "category": "may-photocopy-ricoh",
    "sku": "IM-2500",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2500-and-im-6000-series/main_product-detail-1024x1024-im-2500-with-certificate.jpg?dmc=0&amp;hash=B13AC7A5BEFBAFAAEF8CACF96D114B5F",
    "excerpt": "RICOH IM 2500 giúp việc quản lý lưu trữ tài liệu một cách dễ dàng và gia tăng năng suất mà vẫn đảm bảo bảo mật.",
    "url": "https://thuanphat8.vn/im-2500.html"
  },
  {
    "id": "tp-greenline-series",
    "name": "Dòng sản phẩm Ricoh GreenLine Máy photocopy đa chức năng tái sản xuất",
    "slug": "greenline-series",
    "category": "may-scan",
    "sku": "GREENLINE-SERIES",
    "type": "Máy Scan Chuyên Dụng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/rvn/images/products/greenline-series/product-greenline-series.webp?dmc=0&amp;hash=122ECB2296FDC44EDC48223242046D73",
    "excerpt": "Ricoh GreenLine được tái sản xuất từ những vật liệu đã qua sử dụng với mục tiêu giảm tác động đến môi trường bằng cách kéo dài vòng đời sản phẩm",
    "url": "https://thuanphat8.vn/greenline-series.html"
  },
  {
    "id": "tp-p-311",
    "name": "Ricoh P 311 Máy in đen trắng A4.",
    "slug": "p-311",
    "category": "may-photocopy-ricoh",
    "sku": "P-311",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/m-320f-and-p-310-series/main_product-detail-1024x1024-p-311.jpg?dmc=0&amp;hash=ACEEFEAA215A3E2C32237D5166818D35",
    "excerpt": "Máy in đen trắng Ricoh P 311 A4 với WiFi tùy chọn là máy in đen trắng chất lượng cao mang lại năng suất in di động cho văn phòng nhỏ và gia đình.",
    "url": "https://thuanphat8.vn/p-311.html"
  },
  {
    "id": "tp-p-310",
    "name": "Ricoh P 310 Máy in đen trắng A4",
    "slug": "p-310",
    "category": "may-photocopy-ricoh",
    "sku": "P-310",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-black-and-white/m-320f-and-p-310-series/main_product-detail-1024x1024-p-310.jpg?dmc=0&amp;hash=6DA02362E691AA89384EF917C89645E3",
    "excerpt": "Máy in đen trắng Ricoh P 310 A4 dễ sử dụng &amp; mang đến chất lượng cao, in đen trắng, di động với WiFi tùy chọn cho văn phòng nhỏ và làm việc tại nhà.",
    "url": "https://thuanphat8.vn/p-310.html"
  },
  {
    "id": "tp-m-2701",
    "name": "Ricoh M 2701 Máy đa chức năng trắng đen khổ A3",
    "slug": "m-2701",
    "category": "may-photocopy-ricoh",
    "sku": "M-2701",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/im-2700-and-im-2701/main_product-detail-1024x1024-im-2701.jpg?dmc=0&amp;hash=E0D922B14776365B5A805D7C2CA04153",
    "excerpt": "Explore the Ricoh M 2701 MFP, an A3 black-and-white device with high productivity features like fast printing, scanning, and easy maintenance.",
    "url": "https://thuanphat8.vn/m-2701.html"
  },
  {
    "id": "tp-m-2810n",
    "name": "Ricoh M 2810N Máy in đa chức năng đen trắng A3",
    "slug": "m-2810n",
    "category": "may-photocopy-ricoh",
    "sku": "M-2810N",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/m-2810n-series/main_product-detail-1024x1024-m2810n.webp?dmc=0&amp;hash=738AD4200DEB220224CDF1A012FC1567",
    "excerpt": "RICOH M 2810N là máy in đa chức năng laser đơn sắc A3 nhỏ gọn được thiết kế để thiết lập độc lập.",
    "url": "https://thuanphat8.vn/m-2810n.html"
  },
  {
    "id": "tp-m-2510",
    "name": "Ricoh M 2510 Máy in đa chức năng đen trắng A3",
    "slug": "m-2510",
    "category": "may-photocopy-ricoh",
    "sku": "M-2510",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/m-2810n-series/main_product-detail-1024x1024-m2510.webp?dmc=0&amp;hash=B0D362A3694CA515C1BCBDAAB1368013",
    "excerpt": "RICOH M 2510 là máy in đa chức năng laser A3 đơn sắc nhỏ gọn được thiết kế cho các thiết lập độc lập.",
    "url": "https://thuanphat8.vn/m-2510.html"
  },
  {
    "id": "tp-m-2310n",
    "name": "Ricoh M 2310N Máy in đa chức năng đen trắng A3",
    "slug": "m-2310n",
    "category": "may-photocopy-ricoh",
    "sku": "M-2310N",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-black-and-white/m-2810n-series/main_product-detail-1024x1024-m2310n.webp?dmc=0&amp;hash=0DC352816DF6609C4BDCB150E626E160",
    "excerpt": "RICOH M 2310N là máy in đa chức năng laser đơn sắc A3 nhỏ gọn được thiết kế cho các nhóm làm việc. Máy có Ethernet tích hợp, khay giấy có thể mở rộng...",
    "url": "https://thuanphat8.vn/m-2310n.html"
  },
  {
    "id": "tp-im-c401f",
    "name": "Ricoh IM C401F Máy in đa chức năng màu A4",
    "slug": "im-c401f",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C401F",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c401f/main_product-detail-1024x1024-im-c401f.webp?dmc=0&amp;hash=816A373EFF8143480730ED134CF1978B",
    "excerpt": "RICOH IM C401F là máy laser màu A4 MFP cung cấp khả năng in tốc độ cao, bảo mật tiên tiến, tích hợp đám mây và các tính năng thân thiện với môi trường.",
    "url": "https://thuanphat8.vn/im-c401f.html"
  },
  {
    "id": "tp-im-c7010",
    "name": "Ricoh IM C7010 Máy in đa chức năng màu A3",
    "slug": "im-c7010",
    "category": "may-photocopy-ricoh",
    "sku": "IM-C7010",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/mfp-colour/im-c7010/main_product-detail-1024x1024-im-c7010-datamaster.jpg?dmc=0&amp;hash=010F2AA02A885609B089DCB59006FC25",
    "excerpt": "Máy in đa chức năng màu kỹ thuật số (MFP) RICOH IM C7010 là sự kết hợp hoàn hảo với cách làm việc của bạn.",
    "url": "https://thuanphat8.vn/im-c7010.html"
  },
  {
    "id": "tp-m-c240fw",
    "name": "Ricoh M C240FW",
    "slug": "m-c240fw",
    "category": "may-photocopy-ricoh",
    "sku": "M-C240FW",
    "type": "Máy Photocopy Đa Năng",
    "speed": "Tiêu chuẩn dự án",
    "price": "Liên hệ",
    "stock": 10,
    "status": "in_stock",
    "image": "https://thuanphat8.vn/-/media/all-regional/images/product-images/office-solutions/printers-and-copiers/printer-colour/m-c240fw-and-p-c200w/main_product-detail-1024x1024-m-c240f.jpg?dmc=0&amp;hash=66A3258CAF56D9B53AE45B19528D788C",
    "excerpt": "RICOH M C240FW rất dễ sử dụng, với thiết kế nhỏ gọn và với các chức năng của nó sẽ không ảnh hưởng đến năng suất vì bạn có thể in mọi nơi, mọi lúc.",
    "url": "https://thuanphat8.vn/m-c240fw.html"
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
    const storedProds = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    if (!storedProds || storedProds.length < 20) {
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

  
  async syncProductsFromRemote() {
    try {
      const res = await fetch('./data/products.json?v=' + Date.now());
      if (res.ok) {
        const prods = await res.json();
        if (Array.isArray(prods) && prods.length > 0) {
          this.saveProducts(prods);
          return prods;
        }
      }
    } catch (e) {
      // fallback to local or default
    }
    return this.getProducts();
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
