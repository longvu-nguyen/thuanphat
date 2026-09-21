const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  console.log("--- BẮT ĐẦU CÀO DỮ LIỆU TỰ ĐỘNG TỪ THUANPHAT8.VN ---");
  const categories = [
    { slug: 'may-scan', name: 'Máy scan Ricoh', maxPages: 4 },
    { slug: 'may-in-kyocera', name: 'Máy in Kyocera', maxPages: 3 },
    { slug: 'may-photocopy-kyocera', name: 'Máy photocopy Kyocera', maxPages: 3 },
    { slug: 'may-photocopy-ricoh', name: 'Máy photocopy Ricoh', maxPages: 6 }
  ];

  const productsMap = new Map();

  for (const cat of categories) {
    console.log(`Đang cào danh mục: ${cat.name}...`);
    for (let p = 1; p <= cat.maxPages; p++) {
      const url = `https://thuanphat8.vn/${cat.slug}?page=${p}`;
      const html = await fetchUrl(url);
      if (!html) break;

      // Extract cards
      const cardRegex = /<div[^>]*class=["'][^"']*product-item[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;
      let cardMatch;
      let foundInPage = 0;

      while ((cardMatch = cardRegex.exec(html)) !== null) {
        const cardHtml = cardMatch[0];
        
        // Link and url
        const linkM = cardHtml.match(/href=["'](https:\/\/thuanphat8\.vn\/[^"']+\.html)["']/i);
        if (!linkM) continue;
        const prodUrl = linkM[1];

        // Title
        const titleM = cardHtml.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i) ||
                       cardHtml.match(/<a[^>]*title=["']([^"']+)["']/i);
        let name = titleM ? titleM[1].replace(/<[^>]+>/g, '').trim() : '';

        // Image
        const imgM = cardHtml.match(/src=["']([^"']+)["']/i);
        const image = imgM ? imgM[1] : '';

        // Price
        let price = 'Liên hệ';
        const priceM = cardHtml.match(/([0-9]{1,3}(?:,[0-9]{3})+)\s*đ/i) ||
                       cardHtml.match(/([0-9]{1,3}(?:\.[0-9]{3})+)\s*đ/i);
        if (priceM) {
          price = priceM[1].replace(/,/g, '.') + ' đ';
        }

        // Excerpt
        const pM = cardHtml.match(/<p[^>]*class=["'][^"']*desc[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) ||
                   cardHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const excerpt = pM ? pM[1].replace(/<[^>]+>/g, '').trim() : '';

        if (name && !productsMap.has(prodUrl)) {
          productsMap.set(prodUrl, {
            id: 'tp-' + prodUrl.split('/').pop().replace('.html', ''),
            name: name,
            slug: prodUrl.split('/').pop().replace('.html', ''),
            category: cat.slug,
            categoryName: cat.name,
            price: price,
            stock: 10,
            status: 'in_stock',
            image: image,
            excerpt: excerpt,
            url: prodUrl
          });
          foundInPage++;
        }
      }

      console.log(` - Trang ${p}: tìm thấy ${foundInPage} sản phẩm.`);
      if (foundInPage === 0) break; // No more items
    }
  }

  console.log(`\nTổng số sản phẩm thu thập từ các danh mục: ${productsMap.size}`);

  // Also check remaining URLs in sitemap-products.xml
  try {
    const sitemapXml = fs.readFileSync('E:/congty/Code/thuanphat/sitemap-products.xml', 'utf8');
    const urlMatches = sitemapXml.match(/<loc>(https:\/\/thuanphat8\.vn\/[^<]+\.html)<\/loc>/gi) || [];
    const allUrls = urlMatches.map(m => m.replace(/<\/?loc>/g, '').trim());
    console.log(`Số URL trong sitemap-products.xml: ${allUrls.length}`);

    let extraCount = 0;
    for (const u of allUrls) {
      if (!productsMap.has(u)) {
        // Fetch product page directly
        const prodHtml = await fetchUrl(u);
        if (!prodHtml) continue;

        const getM = (re, def = '') => {
          const m = prodHtml.match(re);
          return m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : def;
        };

        const h1 = getM(/<h1[^>]*>([\s\S]*?)<\/h1>/i, '');
        const titleTag = getM(/<title>([\s\S]*?)<\/title>/i, '');
        let name = h1 || titleTag.split('-')[0].trim();
        const ogImg = getM(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i, '');
        const ogDesc = getM(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i, '');

        let category = 'may-scan';
        const uLower = u.toLowerCase();
        if (uLower.includes('photocopy')) {
          category = uLower.includes('kyocera') ? 'may-photocopy-kyocera' : 'may-photocopy-ricoh';
        } else if (uLower.includes('may-in')) {
          category = 'may-in-kyocera';
        }

        if (name) {
          productsMap.set(u, {
            id: 'tp-' + u.split('/').pop().replace('.html', ''),
            name: name,
            slug: u.split('/').pop().replace('.html', ''),
            category: category,
            price: 'Liên hệ',
            stock: 10,
            status: 'in_stock',
            image: ogImg,
            excerpt: ogDesc,
            url: u
          });
          extraCount++;
        }
      }
    }
    console.log(`Thu thập bổ sung trực tiếp từ sitemap: ${extraCount} sản phẩm.`);
  } catch (err) {
    console.error('Lỗi khi đọc sitemap:', err);
  }

  const allProducts = Array.from(productsMap.values());
  console.log(`\n🎉 HOÀN TẤT: Tổng cộng ${allProducts.length} sản phẩm thực tế!`);

  if (!fs.existsSync('E:/congty/Code/thuanphat/data')) {
    fs.mkdirSync('E:/congty/Code/thuanphat/data', { recursive: true });
  }

  fs.writeFileSync(
    'E:/congty/Code/thuanphat/data/products.json',
    JSON.stringify(allProducts, null, 2),
    'utf8'
  );
  console.log('Đã lưu file: E:/congty/Code/thuanphat/data/products.json');
}

run();
