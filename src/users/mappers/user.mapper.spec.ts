import { Role, User } from '@prisma/client';
import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  describe('toResponseDto', () => {
    it('should map User to UserResponseDto', () => {
      const result = UserMapper.toResponseDto(mockUser);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('toResponseDtoFromOmit', () => {
    it('should map Omit<User, "password"> to UserResponseDto', () => {
      const { password, ...userWithoutPassword } = mockUser;
      const result = UserMapper.toResponseDtoFromOmit(userWithoutPassword);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });
  });
});
