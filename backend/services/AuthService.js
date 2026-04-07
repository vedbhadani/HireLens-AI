const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/AuthRepository');

class AuthService {
  generateAccessToken(userId, role) {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
  }

  _refreshTokenExpiry() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    return expiresAt;
  }

  async register(name, email, password, role) {
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await authRepository.createUser({
      name,
      email,
      password,
      role,
    });

    const accessToken = this.generateAccessToken(user._id, user.role);
    const refreshToken = this.generateRefreshToken(user._id);

    const expiresAt = this._refreshTokenExpiry();

    await authRepository.saveRefreshToken(user._id, refreshToken, expiresAt);

    return { user, accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const accessToken = this.generateAccessToken(user._id, user.role);
    const refreshToken = this.generateRefreshToken(user._id);

    const expiresAt = this._refreshTokenExpiry();

    await authRepository.saveRefreshToken(user._id, refreshToken, expiresAt);

    return { user, accessToken, refreshToken };
  }

  async refreshToken(token) {
    const savedToken = await authRepository.findRefreshToken(token);
    if (!savedToken) {
      throw new Error('Invalid or expired refresh token');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await authRepository.findUserById(decoded.id);

    await authRepository.revokeRefreshToken(token);

    const newAccessToken = this.generateAccessToken(user._id, user.role);
    const newRefreshToken = this.generateRefreshToken(user._id);

    const expiresAt = this._refreshTokenExpiry();

    await authRepository.saveRefreshToken(user._id, newRefreshToken, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(token) {
    await authRepository.revokeRefreshToken(token);
  }
}

module.exports = new AuthService();
