import { getUserByUsername } from '../models/userModel.js';
import { logInfo, logError } from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();

export const login = async (c) => {
  try {
    const { username, password } = await c.req.json();
    const user = await getUserByUsername(username);

    if (!user) {
      logInfo(`Login gagal: user ${username} tidak ditemukan.`);
      return c.json({ success: false, error: 'User tidak ditemukan' }, 404);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      logInfo(`Login gagal: password salah untuk user ${username}.`);
      return c.json({ success: false, error: 'Password salah' }, 401);
    }

    const token = process.env.TOKEN || 'default-token';

    logInfo(`Login berhasil untuk user ${username}`);
    return c.json({
      success: true,
      token: token,
      user: {
        id: user.nik.toString(),
        username: user.username
      }
    });

  } catch (error) {
    logError(`Login error: ${error.message}`);
    return c.json({ success: false, error: 'Terjadi kesalahan saat login' }, 500);
  }
};