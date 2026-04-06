const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

class AuthRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async saveRefreshToken(userId, token, expiresAt) {
    const refreshToken = new RefreshToken({ userId, token, expiresAt });
    return await refreshToken.save();
  }

  async findRefreshToken(token) {
    return await RefreshToken.findOne({ token, isRevoked: false });
  }

  async revokeRefreshToken(token) {
    return await RefreshToken.updateOne({ token }, { isRevoked: true });
  }

  async revokeAllUserTokens(userId) {
    return await RefreshToken.updateMany({ userId }, { isRevoked: true });
  }
}

module.exports = new AuthRepository();
