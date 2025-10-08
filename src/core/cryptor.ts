import { createHash } from 'node:crypto';

/**
 * 异或加密解密工具类
 */
class Cryptor {
  private readonly keyStream: Uint8Array;

  /**
   * 创建异或加密实例
   * @param key - 用于生成密钥流的密钥
   */
  constructor(key: string) {
    // 从密钥生成随机种子
    const hash = createHash('sha256').update(key).digest();
    let seed = 0;
    for (let i = 0; i < hash.length; i++) {
      seed = (seed * 31 + hash[i]) >>> 0;
    }

    // 生成密钥流（32KB应该足够大多数配置使用）
    this.keyStream = new Uint8Array(32768);

    // 使用线性同余生成器生成密钥流
    for (let i = 0; i < this.keyStream.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      this.keyStream[i] = seed & 0xff;
    }
  }

  /**
   * 使用异或加密字符串
   * @param buffer - 要加密的buffer
   * @returns 加密后的字符串（base64编码）
   */
  encrypt(buffer: Buffer): string {
    const result = Buffer.alloc(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
      // 使用密钥流进行XOR操作
      const keyByte = this.keyStream[i % this.keyStream.length];
      result[i] = buffer[i] ^ keyByte;
    }

    // 返回base64编码的结果
    return result.toString('base64');
  }

  /**
   * 使用异或解密字符串
   * @param encryptedText - 加密的文本（base64编码）
   * @returns 解密后的Buffer
   */
  decrypt(encryptedText: string): Buffer {
    // 从base64解码
    const encryptedBuffer = Buffer.from(encryptedText, 'base64');
    const result = Buffer.alloc(encryptedBuffer.length);

    for (let i = 0; i < encryptedBuffer.length; i++) {
      // 使用密钥流进行XOR操作（XOR解密与加密相同）
      const keyByte = this.keyStream[i % this.keyStream.length];
      result[i] = encryptedBuffer[i] ^ keyByte;
    }

    return result;
  }
}
const cryptor = new Cryptor('saitamasaikou! by Kasukabe Tsumugi');
export default cryptor;
