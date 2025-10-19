import type { DefineAPI, SDK } from "caido:plugin";

// Result type for error handling
export type Result<T> =
  | { kind: "Error"; error: string }
  | { kind: "Ok"; value: T };

// Base64 encoding/decoding
const base64Encode = (sdk: SDK, input: string): Result<string> => {
  try {
    const encoded = Buffer.from(input, 'utf8').toString('base64');
    sdk.console.log(`Base64 encoded: ${encoded}`);
    return { kind: "Ok", value: encoded };
  } catch (error) {
    return { kind: "Error", error: `Base64 encoding failed: ${error}` };
  }
};

const base64Decode = (sdk: SDK, input: string): Result<string> => {
  try {
    const decoded = Buffer.from(input, 'base64').toString('utf8');
    sdk.console.log(`Base64 decoded: ${decoded}`);
    return { kind: "Ok", value: decoded };
  } catch (error) {
    return { kind: "Error", error: `Base64 decoding failed: ${error}` };
  }
};

// Base64 clean encoding (removes padding)
const base64CleanEncode = (sdk: SDK, input: string): Result<string> => {
  try {
    const encoded = Buffer.from(input, 'utf8').toString('base64');
    // Remove padding characters (=)
    const clean = encoded.replace(/=+$/, '');
    sdk.console.log(`Base64 clean encoded: ${clean}`);
    return { kind: "Ok", value: clean };
  } catch (error) {
    return { kind: "Error", error: `Base64 clean encoding failed: ${error}` };
  }
};

// URL encoding/decoding
const urlEncode = (sdk: SDK, input: string): Result<string> => {
  try {
    const encoded = encodeURIComponent(input);
    sdk.console.log(`URL encoded: ${encoded}`);
    return { kind: "Ok", value: encoded };
  } catch (error) {
    return { kind: "Error", error: `URL encoding failed: ${error}` };
  }
};

const urlDecode = (sdk: SDK, input: string): Result<string> => {
  try {
    const decoded = decodeURIComponent(input);
    sdk.console.log(`URL decoded: ${decoded}`);
    return { kind: "Ok", value: decoded };
  } catch (error) {
    return { kind: "Error", error: `URL decoding failed: ${error}` };
  }
};

// HTML encoding/decoding
const htmlEncode = (sdk: SDK, input: string): Result<string> => {
  try {
    const encoded = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\s/g, '&nbsp;');
    sdk.console.log(`HTML encoded: ${encoded}`);
    return { kind: "Ok", value: encoded };
  } catch (error) {
    return { kind: "Error", error: `HTML encoding failed: ${error}` };
  }
};

const htmlDecode = (sdk: SDK, input: string): Result<string> => {
  try {
    const decoded = input
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    sdk.console.log(`HTML decoded: ${decoded}`);
    return { kind: "Ok", value: decoded };
  } catch (error) {
    return { kind: "Error", error: `HTML decoding failed: ${error}` };
  }
};

// Hex encoding/decoding
const hexEncode = (sdk: SDK, input: string): Result<string> => {
  try {
    const encoded = Buffer.from(input, 'utf8').toString('hex');
    sdk.console.log(`Hex encoded: ${encoded}`);
    return { kind: "Ok", value: encoded };
  } catch (error) {
    return { kind: "Error", error: `Hex encoding failed: ${error}` };
  }
};

const hexDecode = (sdk: SDK, input: string): Result<string> => {
  try {
    const decoded = Buffer.from(input, 'hex').toString('utf8');
    sdk.console.log(`Hex decoded: ${decoded}`);
    return { kind: "Ok", value: decoded };
  } catch (error) {
    return { kind: "Error", error: `Hex decoding failed: ${error}` };
  }
};

// JSON formatting
const formatJson = (sdk: SDK, input: string): Result<string> => {
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    sdk.console.log(`JSON formatted`);
    return { kind: "Ok", value: formatted };
  } catch (error) {
    return { kind: "Error", error: `JSON formatting failed: ${error}` };
  }
};

// Minify JSON
const minifyJson = (sdk: SDK, input: string): Result<string> => {
  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    sdk.console.log(`JSON minified`);
    return { kind: "Ok", value: minified };
  } catch (error) {
    return { kind: "Error", error: `JSON minification failed: ${error}` };
  }
};

// Real MD5 implementation
const md5 = (input: string): string => {
  // MD5 constants
  const K = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];

  // Convert string to bytes using Buffer (Node.js compatible)
  const msg = Buffer.from(input, 'utf8');
  
  // Pre-processing: adding a single 1 bit
  const msgLength = msg.length;
  const msgBits = msgLength * 8;
  
  // Calculate padding length
  const paddingLength = 64 - ((msgLength + 9) % 64);
  const totalLength = msgLength + 1 + paddingLength + 8;
  
  // Create padded buffer
  const padded = new Uint8Array(totalLength);
  
  // Copy original message
  for (let i = 0; i < msgLength; i++) {
    padded[i] = msg[i];
  }
  
  // Append "1" bit (0x80)
  padded[msgLength] = 0x80;
  
  // Append length in bits as 64-bit little-endian integer
  const view = new DataView(padded.buffer);
  view.setUint32(totalLength - 8, msgBits & 0xffffffff, true);
  view.setUint32(totalLength - 4, Math.floor(msgBits / 0x100000000), true);
  
  // Initialize MD buffer
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  
  // Process the message in 512-bit chunks
  for (let chunk = 0; chunk < padded.length; chunk += 64) {
    const w = new Uint32Array(16);
    for (let i = 0; i < 16; i++) {
      const offset = chunk + i * 4;
      if (offset + 4 <= padded.length) {
        w[i] = view.getUint32(offset, true);
      } else {
        w[i] = 0;
      }
    }
    
    let a = h0, b = h1, c = h2, d = h3;
    
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) {
        f = (b & c) | ((~b) & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | ((~d) & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | (~d));
        g = (7 * i) % 16;
      }
      
      f = (f + a + K[i] + w[g]) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + ((f << s[i]) | (f >>> (32 - s[i])))) >>> 0;
    }
    
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
  }
  
  // Produce the final hash value as a 128-bit number
  const result = new Uint8Array(16);
  const resultView = new DataView(result.buffer);
  
  // Ensure we have enough space for 4 32-bit values
  if (result.length >= 16) {
    resultView.setUint32(0, h0, true);
    resultView.setUint32(4, h1, true);
    resultView.setUint32(8, h2, true);
    resultView.setUint32(12, h3, true);
  }
  
  // Convert to hex string
  return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join('');
};

// MD5 hashing (real implementation)
const md5Hash = (sdk: SDK, input: string): Result<string> => {
  try {
    const hash = md5(input);
    sdk.console.log(`MD5 hash: ${hash}`);
    return { kind: "Ok", value: hash };
  } catch (error) {
    return { kind: "Error", error: `MD5 hashing failed: ${error}` };
  }
};

// Real SHA1 implementation
const sha1 = (input: string): string => {
  // Convert string to bytes
  const msg = Buffer.from(input, 'utf8');
  
  // Pre-processing: adding a single 1 bit
  const msgLength = msg.length;
  const msgBits = msgLength * 8;
  
  // Calculate padding length
  const paddingLength = 64 - ((msgLength + 9) % 64);
  const totalLength = msgLength + 1 + paddingLength + 8;
  
  // Create padded buffer
  const padded = new Uint8Array(totalLength);
  
  // Copy original message
  for (let i = 0; i < msgLength; i++) {
    padded[i] = msg[i];
  }
  
  // Append "1" bit (0x80)
  padded[msgLength] = 0x80;
  
  // Append length in bits as 64-bit big-endian integer
  const view = new DataView(padded.buffer);
  view.setUint32(totalLength - 8, Math.floor(msgBits / 0x100000000), false);
  view.setUint32(totalLength - 4, msgBits & 0xffffffff, false);
  
  // Initialize SHA1 buffer
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;
  
  // Process the message in 512-bit chunks
  for (let chunk = 0; chunk < padded.length; chunk += 64) {
    const w = new Uint32Array(80);
    
    // Break chunk into sixteen 32-bit big-endian words
    for (let i = 0; i < 16; i++) {
      const offset = chunk + i * 4;
      if (offset + 4 <= padded.length) {
        w[i] = view.getUint32(offset, false);
      } else {
        w[i] = 0;
      }
    }
    
    // Extend the sixteen 32-bit words into eighty 32-bit words
    for (let i = 16; i < 80; i++) {
      w[i] = ((w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16]) << 1) | ((w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16]) >>> 31);
    }
    
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    
    // Main loop
    for (let i = 0; i < 80; i++) {
      let f, k;
      if (i < 20) {
        f = (b & c) | ((~b) & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      
      const temp = ((a << 5) | (a >>> 27)) + f + e + k + w[i];
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }
    
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }
  
  // Produce the final hash value as a 160-bit number
  const result = new Uint8Array(20);
  const resultView = new DataView(result.buffer);
  resultView.setUint32(0, h0, false);
  resultView.setUint32(4, h1, false);
  resultView.setUint32(8, h2, false);
  resultView.setUint32(12, h3, false);
  resultView.setUint32(16, h4, false);
  
  // Convert to hex string
  return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join('');
};

// SHA1 hashing (real implementation)
const sha1Hash = (sdk: SDK, input: string): Result<string> => {
  try {
    const hash = sha1(input);
    sdk.console.log(`SHA1 hash: ${hash}`);
    return { kind: "Ok", value: hash };
  } catch (error) {
    return { kind: "Error", error: `SHA1 hashing failed: ${error}` };
  }
};

// Real SHA256 implementation
const sha256 = (input: string): string => {
  // SHA256 constants
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  // Convert string to bytes
  const msg = Buffer.from(input, 'utf8');
  
  // Pre-processing
  const msgLength = msg.length;
  const msgBits = msgLength * 8;
  
  // Calculate padding length
  const paddingLength = 64 - ((msgLength + 9) % 64);
  const totalLength = msgLength + 1 + paddingLength + 8;
  
  // Create padded buffer
  const padded = new Uint8Array(totalLength);
  
  // Copy original message
  for (let i = 0; i < msgLength; i++) {
    padded[i] = msg[i];
  }
  
  // Append "1" bit (0x80)
  padded[msgLength] = 0x80;
  
  // Append length in bits as 64-bit big-endian integer
  const view = new DataView(padded.buffer);
  view.setUint32(totalLength - 8, Math.floor(msgBits / 0x100000000), false);
  view.setUint32(totalLength - 4, msgBits & 0xffffffff, false);
  
  // Initialize SHA256 buffer
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  
  // Process the message in 512-bit chunks
  for (let chunk = 0; chunk < padded.length; chunk += 64) {
    const w = new Uint32Array(64);
    
    // Break chunk into sixteen 32-bit big-endian words
    for (let i = 0; i < 16; i++) {
      const offset = chunk + i * 4;
      if (offset + 4 <= padded.length) {
        w[i] = view.getUint32(offset, false);
      } else {
        w[i] = 0;
      }
    }
    
    // Extend the sixteen 32-bit words into sixty-four 32-bit words
    for (let i = 16; i < 64; i++) {
      const s0 = ((w[i-15] >>> 7) | (w[i-15] << 25)) ^ ((w[i-15] >>> 18) | (w[i-15] << 14)) ^ (w[i-15] >>> 3);
      const s1 = ((w[i-2] >>> 17) | (w[i-2] << 15)) ^ ((w[i-2] >>> 19) | (w[i-2] << 13)) ^ (w[i-2] >>> 10);
      w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
    }
    
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    
    // Main loop
    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }
    
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }
  
  // Produce the final hash value as a 256-bit number
  const result = new Uint8Array(32);
  const resultView = new DataView(result.buffer);
  resultView.setUint32(0, h0, false);
  resultView.setUint32(4, h1, false);
  resultView.setUint32(8, h2, false);
  resultView.setUint32(12, h3, false);
  resultView.setUint32(16, h4, false);
  resultView.setUint32(20, h5, false);
  resultView.setUint32(24, h6, false);
  resultView.setUint32(28, h7, false);
  
  // Convert to hex string
  return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join('');
};

// SHA256 hashing (real implementation)
const sha256Hash = (sdk: SDK, input: string): Result<string> => {
  try {
    const hash = sha256(input);
    sdk.console.log(`SHA256 hash: ${hash}`);
    return { kind: "Ok", value: hash };
  } catch (error) {
    return { kind: "Error", error: `SHA256 hashing failed: ${error}` };
  }
};


// ROT13 encoding/decoding
const rot13Encode = (sdk: SDK, input: string): Result<string> => {
  try {
    const encoded = input.replace(/[a-zA-Z]/g, (char) => {
      const code = char.charCodeAt(0);
      const start = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - start + 13) % 26) + start);
    });
    sdk.console.log(`ROT13 encoded: ${encoded}`);
    return { kind: "Ok", value: encoded };
  } catch (error) {
    return { kind: "Error", error: `ROT13 encoding failed: ${error}` };
  }
};

// Binary encoding
const binaryEncode = (sdk: SDK, input: string): Result<string> => {
  try {
    const encoded = input.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
    sdk.console.log(`Binary encoded: ${encoded}`);
    return { kind: "Ok", value: encoded };
  } catch (error) {
    return { kind: "Error", error: `Binary encoding failed: ${error}` };
  }
};

// Binary decoding
const binaryDecode = (sdk: SDK, input: string): Result<string> => {
  try {
    const decoded = input.split(' ').map(binary => 
      String.fromCharCode(parseInt(binary, 2))
    ).join('');
    sdk.console.log(`Binary decoded: ${decoded}`);
    return { kind: "Ok", value: decoded };
  } catch (error) {
    return { kind: "Error", error: `Binary decoding failed: ${error}` };
  }
};

// Get available conversion types
const getConversionTypes = (sdk: SDK): Result<Array<{id: string, name: string, description: string}>> => {
  const types = [
    { id: "base64-encode", name: "Base64 Encode", description: "Encode text to Base64" },
    { id: "base64-decode", name: "Base64 Decode", description: "Decode Base64 to text" },
    { id: "base64-clean-encode", name: "Base64 Clean Encode", description: "Encode text to Base64 (remove padding)" },
    { id: "url-encode", name: "URL Encode", description: "Encode text for URL parameters" },
    { id: "url-decode", name: "URL Decode", description: "Decode URL-encoded text" },
    { id: "html-encode", name: "HTML Encode", description: "Encode text for HTML" },
    { id: "html-decode", name: "HTML Decode", description: "Decode HTML entities" },
    { id: "hex-encode", name: "Hex Encode", description: "Encode text to hexadecimal" },
    { id: "hex-decode", name: "Hex Decode", description: "Decode hexadecimal to text" },
    { id: "binary-encode", name: "Binary Encode", description: "Encode text to binary" },
    { id: "binary-decode", name: "Binary Decode", description: "Decode binary to text" },
    { id: "rot13", name: "ROT13", description: "ROT13 cipher (encode/decode)" },
    { id: "md5", name: "MD5", description: "Generate MD5 hash" },
    { id: "sha1", name: "SHA1", description: "Generate SHA1 hash" },
    { id: "sha256", name: "SHA2-256", description: "Generate SHA256 hash" },
    { id: "json-format", name: "JSON Format", description: "Format JSON with indentation" },
    { id: "json-minify", name: "JSON Minify", description: "Minify JSON (remove whitespace)" }
  ];
  
  sdk.console.log(`Available conversion types: ${types.length}`);
  return { kind: "Ok", value: types };
};

// Per-line conversion function
const convertPerLine = (sdk: SDK, input: string, conversionType: string): Result<string> => {
  try {
    const lines = input.split('\n');
    const results = lines.map(line => {
      const result = convertSingle(sdk, line.trim(), conversionType);
      return result.kind === "Ok" ? result.value : `ERROR: ${result.error}`;
    });
    return { kind: "Ok", value: results.join('\n') };
  } catch (error) {
    return { kind: "Error", error: `Per-line conversion failed: ${error}` };
  }
};

// Single conversion function
const convertSingle = (sdk: SDK, input: string, conversionType: string): Result<string> => {
  sdk.console.log(`Converting with type: ${conversionType}`);
  
  switch (conversionType) {
    case "base64-encode":
      return base64Encode(sdk, input);
    case "base64-decode":
      return base64Decode(sdk, input);
    case "base64-clean-encode":
      return base64CleanEncode(sdk, input);
    case "url-encode":
      return urlEncode(sdk, input);
    case "url-decode":
      return urlDecode(sdk, input);
    case "html-encode":
      return htmlEncode(sdk, input);
    case "html-decode":
      return htmlDecode(sdk, input);
    case "hex-encode":
      return hexEncode(sdk, input);
    case "hex-decode":
      return hexDecode(sdk, input);
    case "binary-encode":
      return binaryEncode(sdk, input);
    case "binary-decode":
      return binaryDecode(sdk, input);
    case "rot13":
      return rot13Encode(sdk, input);
    case "md5":
      return md5Hash(sdk, input);
    case "sha1":
      return sha1Hash(sdk, input);
    case "sha256":
      return sha256Hash(sdk, input);
    case "json-format":
      return formatJson(sdk, input);
    case "json-minify":
      return minifyJson(sdk, input);
    default:
      return { kind: "Error", error: `Unknown conversion type: ${conversionType}` };
  }
};

// Apply prefix/suffix to text
const applyPrefixSuffix = (sdk: SDK, input: string, prefix: string, suffix: string, perLine: boolean): Result<string> => {
  try {
    if (perLine) {
      const lines = input.split('\n');
      const processedLines = lines.map(line => `${prefix}${line}${suffix}`);
      return { kind: "Ok", value: processedLines.join('\n') };
    } else {
      return { kind: "Ok", value: `${prefix}${input}${suffix}` };
    }
  } catch (error) {
    return { kind: "Error", error: `Prefix/suffix application failed: ${error}` };
  }
};

// Handle file upload
const handleFileUpload = (sdk: SDK, fileContent: string, fileName: string): Result<string> => {
  try {
    sdk.console.log(`File uploaded: ${fileName}, size: ${fileContent.length} characters`);
    return { kind: "Ok", value: fileContent };
  } catch (error) {
    return { kind: "Error", error: `File upload failed: ${error}` };
  }
};

// Get Caido stored files (placeholder implementation)
const getCaidoFiles = (sdk: SDK): Result<Array<{id: string, name: string, size: number}>> => {
  try {
    // This is a placeholder - actual implementation would use Caido SDK file access methods
    sdk.console.log("Getting Caido stored files (placeholder)");
    const files = [
      { id: "1", name: "example.txt", size: 1024 },
      { id: "2", name: "data.json", size: 2048 }
    ];
    return { kind: "Ok", value: files };
  } catch (error) {
    return { kind: "Error", error: `Failed to get Caido files: ${error}` };
  }
};

// Read Caido file content (placeholder implementation)
const readCaidoFile = (sdk: SDK, fileId: string): Result<string> => {
  try {
    // This is a placeholder - actual implementation would use Caido SDK file access methods
    sdk.console.log(`Reading Caido file: ${fileId}`);
    return { kind: "Ok", value: `Content of file ${fileId} (placeholder)` };
  } catch (error) {
    return { kind: "Error", error: `Failed to read Caido file: ${error}` };
  }
};

// Main conversion function
const convert = (sdk: SDK, input: string, conversionType: string, perLine: boolean = false, prefix: string = "", suffix: string = ""): Result<string> => {
  // First apply prefix/suffix if provided
  let processedInput = input;
  if (prefix || suffix) {
    const prefixSuffixResult = applyPrefixSuffix(sdk, input, prefix, suffix, perLine);
    if (prefixSuffixResult.kind === "Error") {
      return prefixSuffixResult;
    }
    processedInput = prefixSuffixResult.value;
  }

  // Then perform the conversion
  if (perLine) {
    return convertPerLine(sdk, processedInput, conversionType);
  }
  return convertSingle(sdk, processedInput, conversionType);
};

export type API = DefineAPI<{
  convert: typeof convert;
  getConversionTypes: typeof getConversionTypes;
  handleFileUpload: typeof handleFileUpload;
  getCaidoFiles: typeof getCaidoFiles;
  readCaidoFile: typeof readCaidoFile;
}>;

export function init(sdk: SDK<API>) {
  sdk.api.register("convert", convert);
  sdk.api.register("getConversionTypes", getConversionTypes);
  sdk.api.register("handleFileUpload", handleFileUpload);
  sdk.api.register("getCaidoFiles", getCaidoFiles);
  sdk.api.register("readCaidoFile", readCaidoFile);
}
