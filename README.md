# 🔄 Caido Converter Plugin

A powerful data converter plugin for Caido that provides encoding, decoding, and transformation capabilities.


###  **Encoding & Decoding**
- **Base64** - Standard Base64 encoding/decoding with clean option (no padding)
- **URL** - URL parameter encoding/decoding for web applications
- **HTML** - HTML entity encoding/decoding for web content
- **Hex** - Hexadecimal encoding/decoding for binary data
- **Binary** - Binary string encoding/decoding


### Basic Conversion
1. **Select Conversion Type** - Choose from the dropdown menu
2. **Enter Input** - Type or paste your data in the input area
3. **Convert** - Click the "Convert" button
4. **Copy Result** - Use the "Copy" button to copy the output

### Prefix/Suffix Editor
- **Enable Editor** - Check "Use Prefix" or "Use Suffix"
- **Add Text** - Enter your prefix/suffix in the text areas
- **Live Preview** - See the preview directly in the input window
- **Apply** - The prefix/suffix is applied before conversion

### File Upload
- **Upload Button** - Click "Upload" in the header
- **Select File** - Choose a text file from your computer
- **Auto-Fill** - File content is automatically loaded into the first input

## 📋 Supported Conversions

| Type | Input | Output | Example |
|------|-------|--------|---------|
| **Base64 Encode** | `Hello World!` | `SGVsbG8gV29ybGQh` | Standard Base64 |
| **Base64 Clean Encode** | `Hello World!` | `SGVsbG8gV29ybGQh` | No padding |
| **Base64 Decode** | `SGVsbG8gV29ybGQh` | `Hello World!` | Decode Base64 |
| **URL Encode** | `Hello World!` | `Hello%20World!` | URL safe |
| **URL Decode** | `Hello%20World!` | `Hello World!` | Decode URL |
| **HTML Encode** | `<script>` | `&lt;script&gt;` | HTML entities |
| **HTML Decode** | `&lt;script&gt;` | `<script>` | Decode HTML |
| **Hex Encode** | `Hello` | `48656c6c6f` | Hexadecimal |
| **Hex Decode** | `48656c6c6f` | `Hello` | Decode hex |
| **Binary Encode** | `Hi` | `01001000 01101001` | Binary string |
| **Binary Decode** | `01001000 01101001` | `Hi` | Decode binary |
| **ROT13** | `Hello` | `Uryyb` | Caesar cipher |
| **MD5** | `123456` | `e10adc3949ba59abbe56e057f20f883e` | 128-bit hash |
| **SHA1** | `Hello World!` | `2ef7bde608ce5404e97d5f042f95f89f1c232871` | 160-bit hash |
| **SHA2-256** | `Hello World!` | `dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b92188c4c5d4c0a6c` | 256-bit hash |


### Building
```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm build

# Development mode
pnpm dev
```


*Feel free to contribute or ask for new conversion types!*
