import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from '../../../src/auth/services/encryption.service';
import * as bcrypt from 'bcrypt';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'password123';
      const hash = await service.hash(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);

      const isMatch = await bcrypt.compare(password, hash);
      expect(isMatch).toBe(true);
    });
  });

  describe('compare', () => {
    it('should return true for valid password', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);

      const result = await service.compare(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash('different', 10);

      const result = await service.compare(password, hash);
      expect(result).toBe(false);
    });
  });
});
