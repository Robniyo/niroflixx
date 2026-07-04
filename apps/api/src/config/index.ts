export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'niroflixx-dev-secret-key-change-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'niroflixx-dev-refresh-secret',
  jwtExpiresIn: '24h',
  jwtRefreshExpiresIn: '7d',
  bcryptRounds: 12,
};