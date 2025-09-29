import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseUrl: process.env.ET_BASE_URL,
  teamName: process.env.ET_TEAM_NAME,
  clientId: process.env.ET_CLIENT_ID,
  clientSecret: process.env.ET_CLIENT_SECRET,
  username: process.env.ET_USERNAME,
  password: process.env.ET_PASSWORD,
  port: process.env.PORT || 3000,
};

export const ET_TEAM_API = `${config.baseUrl}/api/v1/teams/${config.teamName}`;
