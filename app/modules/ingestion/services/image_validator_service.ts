export interface ImageValidationResult {
  valid: boolean;
  code?: string;
  issue?: string;
  width?: number;
  height?: number;
  format?: string;
}

export function validateImageBuffer(buffer: Buffer, filename: string): ImageValidationResult {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (!ext || !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return {
      valid: false,
      code: 'FORBIDDEN_EXTENSION',
      issue: `File extension '.${ext}' is not permitted. Only jpg, jpeg, png, webp are allowed.`,
    };
  }

  // Reject SVG disguises or XML content
  const preview = buffer.slice(0, 100).toString('utf8').toLowerCase();
  if (preview.includes('<svg') || preview.includes('<?xml') || preview.includes('<!doctype svg')) {
    return {
      valid: false,
      code: 'FORBIDDEN_EXTENSION',
      issue: 'SVG format is forbidden for security reasons.',
    };
  }

  if (buffer.length < 16) {
    return {
      valid: false,
      code: 'SIGNATURE_MISMATCH',
      issue: 'File is too small to contain a valid image binary header.',
    };
  }

  let detectedFormat: 'jpeg' | 'png' | 'webp' | null = null;
  let width = 0;
  let height = 0;

  // 1. Check PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    detectedFormat = 'png';
    if (buffer.length >= 24) {
      width = buffer.readUInt32BE(16);
      height = buffer.readUInt32BE(20);
    }
  }
  // 2. Check JPEG
  else if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    detectedFormat = 'jpeg';
    // Parse JPEG markers for SOF0/SOF2 (Start of Frame)
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      if (!marker) break;
      // SOF markers: 0xC0 through 0xC3, 0xC5 through 0xC7, 0xC9 through 0xCB, 0xCD through 0xCF
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        if (offset + 9 < buffer.length) {
          height = buffer.readUInt16BE(offset + 5);
          width = buffer.readUInt16BE(offset + 7);
          break;
        }
      }
      if (marker === 0xd9) break; // EOI
      if (offset + 4 > buffer.length) break;
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }
  // 3. Check WEBP
  else if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    detectedFormat = 'webp';
    const subchunk = buffer.toString('ascii', 12, 16);
    if (subchunk === 'VP8 ' && buffer.length >= 30) {
      width = buffer.readUInt16LE(26) & 0x3fff;
      height = buffer.readUInt16LE(28) & 0x3fff;
    } else if (subchunk === 'VP8L' && buffer.length >= 25) {
      const b0 = buffer[21]!;
      const b1 = buffer[22]!;
      const b2 = buffer[23]!;
      const b3 = buffer[24]!;
      width = 1 + (((b1 & 0x3f) << 8) | b0);
      height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    } else if (subchunk === 'VP8X' && buffer.length >= 30) {
      width = 1 + buffer.readUIntLE(24, 3);
      height = 1 + buffer.readUIntLE(27, 3);
    }
  }

  // Check signature match with extension
  if (!detectedFormat) {
    return {
      valid: false,
      code: 'SIGNATURE_MISMATCH',
      issue: `Binary signature does not match image format for '${filename}'.`,
    };
  }

  const isJpegExt = ext === 'jpg' || ext === 'jpeg';
  if ((detectedFormat === 'jpeg' && !isJpegExt) || (detectedFormat !== 'jpeg' && detectedFormat !== ext)) {
    return {
      valid: false,
      code: 'SIGNATURE_MISMATCH',
      issue: `Binary signature (${detectedFormat}) does not match file extension '.${ext}'.`,
    };
  }

  // Dimension validations
  if (width <= 0 || height <= 0) {
    return {
      valid: false,
      code: 'IMAGE_INVALID',
      issue: 'Could not parse valid image dimensions from file header.',
    };
  }

  const MAX_DIM = 4000;
  const MAX_PIXELS = 16_000_000; // 16 megapixels

  if (width > MAX_DIM || height > MAX_DIM) {
    return {
      valid: false,
      code: 'IMAGE_INVALID',
      issue: `Image dimensions ${width}x${height} exceed maximum permitted size of ${MAX_DIM}x${MAX_DIM} pixels.`,
      width,
      height,
    };
  }

  if (width * height > MAX_PIXELS) {
    return {
      valid: false,
      code: 'IMAGE_INVALID',
      issue: `Image size of ${(width * height) / 1_000_000} MP exceeds maximum allowed resolution of 16 megapixels.`,
      width,
      height,
    };
  }

  return {
    valid: true,
    format: detectedFormat,
    width,
    height,
  };
}
