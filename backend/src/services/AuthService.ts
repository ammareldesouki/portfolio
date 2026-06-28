import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { signToken } from '../config/jwt';

const userRepo = new UserRepository();

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = signToken({ userId: String(user._id), email: user.email });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
      },
    };
  }
}
