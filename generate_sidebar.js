const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md' && f !== '_sidebar.md' && f !== '_coverpage.md');

const chapterNames = {
  1: "Tổng quan Lĩnh vực Ngân hàng",
  2: "Phân hệ Huy động vốn",
  3: "Phân hệ Cho vay",
  4: "Phân hệ Thẻ",
  5: "Thẩm định hồ sơ vay",
  6: "Quản lý Rủi ro tín dụng",
  7: "Tài sản bảo đảm",
  8: "Phân hệ Thanh toán",
  9: "Phân hệ Phí dịch vụ",
  10: "Mua bán vốn nội bộ (FTP)",
  11: "Thị trường tiền tệ",
  12: "Phân hệ Thu hồi nợ",
  13: "Ngân hàng đầu tư (IB)",
  14: "Phân hệ Ngoại hối (FX)",
  15: "Tài trợ thương mại (Trade Finance)",
  16: "Xử lý nợ xấu",
  17: "Bancassurance (Ngân hàng - Bảo hiểm)",
  18: "Ngân hàng số (Digital Banking)",
  19: "Kế toán ngân hàng",
  20: "Quản trị rủi ro tổng thể (ERM)",
  21: "Tuân thủ AML & Định danh KYC",
  22: "Quản lý Kho quỹ & Ngân quỹ"
};

// Sort files numerically by the prefix (e.g., "1. ", "2.1. ", "10.4. ")
function parseNum(name) {
  const match = name.match(/^(\d+)(?:\.(\d+))?/);
  if (!match) return [999, 999];
  const major = parseInt(match[1], 10);
  const minor = match[2] !== undefined ? parseInt(match[2], 10) : 0;
  return [major, minor];
}

files.sort((a, b) => {
  const [majA, minA] = parseNum(a);
  const [majB, minB] = parseNum(b);
  if (majA !== majB) return majA - majB;
  return minA - minB;
});

// Group by major chapter
const chapters = {};
for (const f of files) {
  const [maj, min] = parseNum(f);
  if (!chapters[maj]) chapters[maj] = [];
  chapters[maj].push(f);
}

let sidebar = `- [📖 **Lời Mở Đầu & Hướng Dẫn**](README.md)\n\n`;

for (let i = 1; i <= 22; i++) {
  const chFiles = chapters[i];
  if (!chFiles) continue;
  const chTitle = chapterNames[i] || `Chương ${i}`;

  if (i === 1) {
    const f = chFiles[0];
    const encoded = encodeURI(f);
    const title = f.replace(/\.md$/, '');
    sidebar += `- **Chương 1: ${chTitle}**\n  - [${title}](${encoded})\n\n`;
  } else {
    sidebar += `- **Chương ${i}: ${chTitle}**\n`;
    for (const f of chFiles) {
      const encoded = encodeURI(f);
      const title = f.replace(/\.md$/, '');
      sidebar += `  - [${title}](${encoded})\n`;
    }
    sidebar += `\n`;
  }
}

fs.writeFileSync(path.join(dir, '_sidebar.md'), sidebar, 'utf8');
console.log('Generated _sidebar.md with', files.length, 'files');
