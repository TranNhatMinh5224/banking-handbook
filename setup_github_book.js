const fs = require('fs');
const path = require('path');

const dir = __dirname;
const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md' && f !== '_sidebar.md' && f !== '_coverpage.md');

function parseNum(name) {
  const match = name.match(/^(\d+)(?:\.(\d+))?/);
  if (!match) return [999, 999];
  const major = parseInt(match[1], 10);
  const minor = match[2] !== undefined ? parseInt(match[2], 10) : 0;
  return [major, minor];
}

allFiles.sort((a, b) => {
  const [majA, minA] = parseNum(a);
  const [majB, minB] = parseNum(b);
  if (majA !== majB) return majA - majB;
  return minA - minB;
});

console.log('Total book files:', allFiles.length);

const chapterNames = {
  1: "Tổng Quan Lĩnh Vực Banking",
  2: "Phân Hệ Huy Động Vốn",
  3: "Phân Hệ Cho Vay",
  4: "Phân Hệ Thẻ (Cards)",
  5: "Thẩm Định Hồ Sơ Vay",
  6: "Quản Lý Rủi Ro Tín Dụng",
  7: "Tài Sản Bảo Đảm",
  8: "Phân Hệ Thanh Toán",
  9: "Phân Hệ Phí Dịch Vụ",
  10: "Mua Bán Vốn Nội Bộ (FTP)",
  11: "Thị Trường Tiền Tệ",
  12: "Phân Hệ Thu Hồi Nợ",
  13: "Ngân Hàng Đầu Tư (IB)",
  14: "Phân Hệ Ngoại Hối (FX)",
  15: "Tài Trợ Thương Mại (Trade Finance)",
  16: "Xử Lý Nợ Xấu (NPL)",
  17: "Bancassurance (Ngân Hàng - Bảo Hiểm)",
  18: "Ngân Hàng Số (Digital Banking)",
  19: "Kế Toán Ngân Hàng",
  20: "Quản Trị Rủi Ro Tổng Thể (ERM)",
  21: "Tuân Thủ AML & Định Danh KYC",
  22: "Quản Lý Kho Quỹ & Ngân Quỹ"
};

// 1. Update README.md with an interactive GitHub Master Index
let readme = `# 🏛️ CẨM NANG NGHIỆP VỤ NGÂN HÀNG TOÀN TẬP\n\n`;
readme += `> **Sách tra cứu nghiệp vụ ngân hàng thương mại, quản trị rủi ro & công nghệ tài chính.**  \n`;
readme += `> 💡 *Hướng dẫn đọc: Nhấp vào từng chương bên dưới để mở rộng danh sách bài và đọc trực tiếp ngay trên GitHub.*\n\n`;
readme += `---\n\n`;
readme += `## 📚 MỤC LỤC CHI TIẾT (22 CHƯƠNG & 148 BÀI)\n\n`;

// Group by major chapter
const chapters = {};
for (const f of allFiles) {
  const [maj, min] = parseNum(f);
  if (!chapters[maj]) chapters[maj] = [];
  chapters[maj].push(f);
}

for (let i = 1; i <= 22; i++) {
  const chFiles = chapters[i];
  if (!chFiles) continue;
  const chTitle = chapterNames[i] || `Chương ${i}`;
  const isOpen = (i === 1 || i === 2) ? ' open' : '';
  
  readme += `<details${isOpen}>\n`;
  readme += `<summary><b>📖 Chương ${i}: ${chTitle} (${chFiles.length} chuyên đề)</b></summary>\n\n`;
  for (const f of chFiles) {
    const title = f.replace(/\.md$/, '');
    const encoded = encodeURI(f);
    readme += `- [${title}](${encoded})\n`;
  }
  readme += `\n</details>\n\n`;
}

readme += `---\n\n`;
readme += `## 📌 Cấu Trúc Mỗi Phân Hệ (Từ Chương 2 đến 22)\n\n`;
readme += `Mỗi phân hệ lớn đều được chuẩn hóa thành 7 phần cốt lõi:\n`;
readme += `1. **.1. Giới thiệu tổng quan:** Bản chất phân hệ, vị trí trong hệ sinh thái ngân hàng.\n`;
readme += `2. **.2. Phân khúc đối tượng:** Khách hàng Cá nhân (Retail) vs Khách hàng Doanh nghiệp (Corporate).\n`;
readme += `3. **.3. Hạ tầng & Hệ thống:** Kiến trúc CNTT, Core Banking và thị trường liên kết.\n`;
readme += `4. **.4. Công thức & Cách tính:** Cách tính lãi, phí, định giá, trích lập dự phòng có ví dụ số học thực tế.\n`;
readme += `5. **.5. Ma trận Rủi ro:** Rủi ro vận hành, thị trường, thanh khoản và tuân thủ.\n`;
readme += `6. **.6. Góc khuất & Chiêu trò:** Bóc tách các thủ thuật, lách luật thực tế và phương pháp phát hiện.\n`;
readme += `7. **.7. Từ điển Thuật ngữ:** Hệ thống thuật ngữ chuyên ngành Việt - Anh chuẩn xác.\n`;

fs.writeFileSync(path.join(dir, 'README.md'), readme, 'utf8');
console.log('Updated README.md for GitHub reading');

// 2. Add Navigation Bar (Header + Footer) to each of the 148 files
let updatedFiles = 0;
for (let i = 0; i < allFiles.length; i++) {
  const filename = allFiles[i];
  const filepath = path.join(dir, filename);
  let content = fs.readFileSync(filepath, 'utf8');

  // Remove previous auto navigation if present
  content = content.replace(/^> 📍 \*\*\[📖 Mục Lục\]\(README\.md\)\*\*.*?\n---\n\n/s, '');
  content = content.replace(/\n\n---\n> 📍 \*\*\[📖 Về Mục Lục\]\(README\.md\)\*\*.*?$/s, '');

  const prev = i > 0 ? allFiles[i - 1] : null;
  const next = i < allFiles.length - 1 ? allFiles[i + 1] : null;

  let navTop = `> 📍 **[📖 Mục Lục Sách](README.md)**`;
  if (prev) {
    const prevTitle = prev.replace(/\.md$/, '');
    navTop += ` | [⬅️ ${prevTitle}](${encodeURI(prev)})`;
  }
  if (next) {
    const nextTitle = next.replace(/\.md$/, '');
    navTop += ` | [${nextTitle} ➡️](${encodeURI(next)})`;
  }
  navTop += `\n---\n\n`;

  let navBottom = `\n\n---\n> 📍 **[📖 Về Mục Lục Sách](README.md)**`;
  if (prev) {
    const prevTitle = prev.replace(/\.md$/, '');
    navBottom += ` | [⬅️ ${prevTitle}](${encodeURI(prev)})`;
  }
  if (next) {
    const nextTitle = next.replace(/\.md$/, '');
    navBottom += ` | [${nextTitle} ➡️](${encodeURI(next)})`;
  }

  const newContent = navTop + content.trim() + navBottom + '\n';
  fs.writeFileSync(filepath, newContent, 'utf8');
  updatedFiles++;
}

console.log('Added GitHub book navigation to', updatedFiles, 'files');
