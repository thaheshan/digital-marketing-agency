import { signAccessToken, signRefreshToken, JwtPayload } from "../../utils/jwt.util";
export const generateTokens = (payload: JwtPayload) => ({
  accessToken:  signAccessToken(payload),
  refreshToken: signRefreshToken(payload),
});
