# IOE TypeScript Development Tools

Bộ công cụ phát triển cho dự án TypeScript theo chuẩn IOE INNOVATION Team.

## 📋 Danh sách công cụ

### 1. 🚀 Project Generator (`project-generator.js`)
Tạo dự án TypeScript mới với cấu trúc chuẩn IOE.

**Sử dụng:**
```bash
node tools/project-generator.js
```

**Tính năng:**
- Tạo cấu trúc thư mục theo chuẩn IOE
- Sinh tự động `package.json`, `tsconfig.json`, `.eslintrc.json`
- Tạo file README.md với hướng dẫn chi tiết
- Hỗ trợ nhiều loại dự án: API, WebApp, CLI, Library
- Cấu hình đầy đủ các development tools

### 2. 🏗️ Class Generator (`class-generator.js`)
Tạo class TypeScript với conventions IOE.

**Sử dụng:**
```bash
node tools/class-generator.js
```

**Tính năng:**
- Tạo class với prefix `IOE` theo chuẩn naming
- Sinh tự động JSDoc documentation
- Tạo file test tương ứng
- Hỗ trợ nhiều loại class: Service, Utility, Model, Controller, Repository, Middleware
- Include interface definitions khi cần thiết

### 3. 🔷 Interface Generator (`interface-generator.js`)
Tạo interface TypeScript với naming conventions IOE.

**Sử dụng:**
```bash
node tools/interface-generator.js
```

**Tính năng:**
- Tạo interface với prefix `I` và `IOE`
- Định nghĩa properties và methods chi tiết
- JSDoc documentation đầy đủ
- Hỗ trợ nhiều loại interface: Config, Model, Service, API, Repository, DTO
- Type safety và validation

### 4. 🔍 Lint Checker (`lint-checker.js`)
Kiểm tra code quality và IOE standards compliance.

**Sử dụng:**
```bash
node tools/lint-checker.js [project-path]
```

**Tính năng:**
- Kiểm tra IOE naming conventions
- Validate file headers và documentation
- Analyze project structure
- Report code quality metrics
- Đề xuất improvements và fixes

### 5. 🧪 Test Generator (`test-generator.js`)
Tạo test suite comprehensive cho TypeScript code.

**Sử dụng:**
```bash
node tools/test-generator.js
```

**Tính năng:**
- Analyze source code tự động
- Generate unit tests, integration tests, performance tests
- Include edge cases và error scenarios
- Test templates theo IOE standards
- Comprehensive test coverage

## 🛠️ Cài đặt và Sử dụng

### Yêu cầu hệ thống
- **Node.js:** >= 24.10.0
- **npm:** >= 9.0.0
- **Operating System:** Linux, macOS, Windows

### Cài đặt
1. Clone repository:
   ```bash
   git clone <repository-url>
   cd IOE_Coding_Standard_TSNode
   ```

2. Cài đặt dependencies (nếu cần):
   ```bash
   npm install
   ```

3. Chạy tools:
   ```bash
   # Project generator
   node tools/project-generator.js

   # Class generator
   node tools/class-generator.js

   # Interface generator
   node tools/interface-generator.js

   # Lint checker
   node tools/lint-checker.js

   # Test generator
   node tools/test-generator.js
   ```

## 📁 Cấu trúc Tools Directory

```
tools/
├── project-generator.js     # Tạo dự án mới
├── class-generator.js       # Tạo TypeScript classes
├── interface-generator.js   # Tạo TypeScript interfaces
├── lint-checker.js         # Kiểm tra code quality
├── test-generator.js       # Tạo test suites
└── README.md              # Documentation này
```

## 🎯 IOE Standards Compliance

Tất cả tools đều tuân thủ nghiêm ngặt các chuẩn sau:

### Naming Conventions
- **Classes:** `IOE` prefix (e.g., `IOEUserService`)
- **Interfaces:** `I` prefix với `IOE` (e.g., `IIOEUserModel`)
- **Enums:** `IOE` prefix (e.g., `IOEUserStatus`)
- **Constants:** `UPPER_SNAKE_CASE`
- **Variables/Functions:** `camelCase`

### File Structure
- Comprehensive file headers với metadata
- JSDoc documentation cho tất cả public members
- Consistent import/export patterns
- Proper error handling và logging

### Code Quality
- TypeScript strict mode enabled
- ESLint rules enforcement
- Prettier formatting
- Jest testing requirements
- Performance considerations

## 🚀 Workflow Recommendations

### 1. Tạo Dự Án Mới
```bash
# 1. Tạo project structure
node tools/project-generator.js

# 2. Chuyển vào project directory
cd your-project-name

# 3. Cài đặt dependencies
npm install

# 4. Start development
npm run dev
```

### 2. Phát Triển Features
```bash
# 1. Tạo interface cho data models
node ../tools/interface-generator.js

# 2. Tạo class implementation
node ../tools/class-generator.js

# 3. Generate comprehensive tests
node ../tools/test-generator.js

# 4. Run quality checks
node ../tools/lint-checker.js .
```

### 3. Quality Assurance
```bash
# Run all checks
npm run lint          # ESLint
npm run format:check  # Prettier
npm test             # Jest tests
npm run type-check   # TypeScript
node ../tools/lint-checker.js .  # IOE standards
```

## 🔧 Customization

### Extending Tools
Tools có thể được customize bằng cách:

1. **Fork và modify:** Copy tool và thay đổi theo nhu cầu
2. **Configuration files:** Thêm config files cho specific requirements
3. **Templates:** Tùy chỉnh templates trong source code
4. **Rules:** Adjust IOE rules trong `lint-checker.js`

### Adding New Tools
Để thêm tool mới:

1. Tạo file `.js` trong `tools/` directory
2. Follow IOE file header standards
3. Include comprehensive help và usage instructions
4. Add entry trong README này
5. Test thoroughly trước khi deploy

## 📚 Documentation

### Related Documents
- `../docs/CODING_GUIDELINES.md` - IOE TypeScript coding standards
- `../docs/FILE_STRUCTURE.md` - Project organization guidelines
- `../README.md` - Main project documentation
- `../package.json` - Dependencies và scripts

### External Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## 🤝 Contributing

### Development Guidelines
1. Follow IOE coding standards
2. Add comprehensive tests
3. Update documentation
4. Use semantic versioning
5. Submit pull requests với detailed descriptions

### Code Review Process
1. Self-review với lint-checker
2. Peer review
3. QA testing
4. Documentation review
5. Final approval by Project Leader

## 📄 License

MIT License - see LICENSE file for details.

## 🏢 IOE INNOVATION Team

**Contact:**
- Email: team@ioe.innovation
- Website: [IOE Innovation](https://ioe.innovation)

**Project Leader:**
- Responsible for tool maintenance và updates
- Final authority on coding standards
- Code review và approval

---

*Generated by IOE TypeScript Development Tools v1.0.0*