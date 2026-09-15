import sharp from 'sharp';

export async function processReceiptForOcr(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .grayscale()
    .linear(1.5, 0) // Increases contrast by 1.5x
    .jpeg({ quality: 90 })
    .toBuffer();
}