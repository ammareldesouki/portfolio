import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { signToken } from '../config/jwt';

const userRepo = new UserRepository();

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    const token = signToken({ id: user._id.toString(), email: user.email });
    return {
      token,
      user: { id: user._id.toString(), email: user.email, displayName: user.displayName, avatar: user.avatar },
    };
  }
}
