# IOE INNOVATION Team - Official Coding Standards

## Tổng quan
Đây là repository chính thức về tiêu chuẩn lập trình của IOE INNOVATION Team, được thiết kế để đảm bảo tính nhất quán, chất lượng và khả năng bảo trì của mã nguồn trong các dự án embedded systems và phần mềm.

## Cấu trúc dự án

```
IOE_Coding_Standard/
├── README.md                    # Tài liệu chính
├── Makefile                     # Build system với nhiều targets
├── main.c                       # Ứng dụng chính (Project Leader only)
├── src/                         # Source code modules
│   └── led_controller.c        # LED control module (renamed from ioe_led.c)
├── include/                     # Header files
│   ├── led_controller.h        # LED controller interface (renamed from ioe_led.h)
│   └── common.h                # Common definitions (renamed from ioe_common.h)
├── examples/                    # Các ví dụ thực tế
│   ├── basic_led_blink/        # Ví dụ LED cơ bản
│   ├── button_interrupt/       # Ví dụ interrupt handling
│   └── advanced_demo/          # Demo tính năng nâng cao
├── templates/                   # Templates cho development
│   ├── template.c              # Template file .c
│   ├── template.h              # Template file .h
│   └── project_template/       # Template cho dự án mới
├── docs/                        # Tài liệu chi tiết
│   ├── CODING_GUIDELINES.md    # Hướng dẫn coding standards
│   ├── FILE_STRUCTURE.md       # Cấu trúc file và project
│   ├── MAKEFILE_GUIDE.md       # Hướng dẫn sử dụng Makefile
│   └── DOXYGEN_GUIDE.md        # Hướng dẫn documentation
└── tools/                       # Các công cụ hỗ trợ
    ├── format_check.sh         # Script kiểm tra format
    ├── static_analysis.sh      # Script phân tích code
    └── project_generator.py    # Tool tạo project mới
```

## Tính năng chính

### 1. Coding Standards được áp dụng
- **General Information Header**: Mỗi file có header thông tin đầy đủ về project, mô tả, tác giả
- **Modular Organization**: Chia code thành các section và module rõ ràng
- **Subject_Verb Naming Convention**: Convention Subject_Verb (S_V) cho functions và variables
- **Professional Documentation**: Sử dụng Doxygen style comments
- **Error Handling**: Proper error handling và input validation
- **C++ Compatibility**: Hỗ trợ extern "C" wrapper cho C++
- **Industrial Standard**: Tên file và function theo chuẩn công nghiệp, không dùng prefix

### 2. Build System
- **Multi-target Makefile**: Hỗ trợ build, clean, format, analysis
- **Flexible Compilation**: Hỗ trợ cả GCC và ARM-GCC
- **Automatic Dependencies**: Tự động detect và link các module
- **Code Quality Tools**: Tích hợp clang-format, cppcheck

### 3. Project Structure
- **Separation of Concerns**: Tách biệt source, headers, examples
- **Template System**: Cung cấp templates để tạo files/projects mới
- **Documentation**: Tài liệu chi tiết cho từng aspect
- **Tools Integration**: Scripts và tools hỗ trợ development

## Hướng dẫn sử dụng

### Yêu cầu hệ thống
- **Compiler**: GCC 7.0+ hoặc ARM-GCC (cho embedded)
- **Build Tools**: Make, clang-format, cppcheck (optional)
- **Documentation**: Doxygen (optional, cho generate docs)

### Quick Start
1. **Clone/Copy repository**:
   ```bash
   cd your_workspace
   cp -r IOE_Coding_Standard/ your_project_name/
   ```

2. **Build demo project**:
   ```bash
   cd IOE_Coding_Standard/
   make all
   ```

3. **Run examples**:
   ```bash
   ./main
   ```

4. **Format code**:
   ```bash
   make format
   ```

5. **Run static analysis**:
   ```bash
   make check
   ```

### Targets có sẵn trong Makefile
- `make all` - Build toàn bộ project
- `make clean` - Xóa các file build
- `make format` - Format code theo standards
- `make check` - Chạy static analysis
- `make docs` - Generate documentation
- `make examples` - Build các examples
- `make help` - Hiển thị help

## Sử dụng Templates

### Tạo file mới từ template
```bash
# Copy template và rename
cp templates/template.c src/your_module.c
cp templates/template.h include/your_module.h

# Hoặc sử dụng script
./tools/project_generator.py --module your_module
```

### Tạo project mới
```bash
./tools/project_generator.py --project your_project_name
```

## Guidelines quan trọng

### 1. File Header Requirements
Mọi file .c và .h phải có General Information header bao gồm:
- Project name và description
- File name và mô tả chức năng
- Author information
- Creation date và last update
- Version/revision information
- Copyright và license (nếu có)

### 2. Code Organization
- Sử dụng consistent section headers
- Tách biệt public/private functions
- Group related functionality
- Proper include organization
- Clear variable declarations

### 3. Naming Conventions
- Modules: `ioe_` prefix (ví dụ: `ioe_led`, `ioe_button`)
- Functions: `ModuleName_FunctionName` (ví dụ: `LED_Init`, `Button_IsPressed`)
- Constants: `UPPER_CASE_WITH_UNDERSCORES`
- Variables: `snake_case` hoặc `camelCase` (consistent trong project)

## Tài liệu tham khảo

- [Coding Guidelines](docs/CODING_GUIDELINES.md) - Chi tiết về coding standards
- [File Structure Guide](docs/FILE_STRUCTURE.md) - Hướng dẫn tổ chức files
- [Makefile Guide](docs/MAKEFILE_GUIDE.md) - Sử dụng build system
- [Doxygen Guide](docs/DOXYGEN_GUIDE.md) - Viết documentation

## Liên kết hữu ích
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/index.vi_VN.html)
- [Layer Protocol Guide](https://talucgiahoang.com/blog/khai-niem-lap-trinh-portable-firmware-phan-3/)
- [Embedded C Coding Standard](https://www.barr.com/embedded-c-coding-standard)

## Đóng góp

Để đóng góp vào coding standards:
1. Tạo branch mới từ `develop`
2. Implement changes theo standards hiện tại
3. Test với `make all` và `make check`
4. Tạo pull request với mô tả chi tiết

## Liên hệ

**IOE INNOVATION Team**
- Email: [team@ioe.innovation](mailto:team@ioe.innovation)
- Repository: [IOE Coding Standards](https://github.com/ioe-innovation/coding-standards)

---
*Last Updated: 2025-10-23*
*Version: 1.0.0*