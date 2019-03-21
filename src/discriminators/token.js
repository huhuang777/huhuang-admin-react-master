
import { TOKEN } from '../constants/auth';

// 检查 token 的存在和有效性
export const checkTokenIsOk = () => {
  const token= localStorage.getItem(TOKEN);
  const tokenIsOk = token && token.split('.').length === 3;
  return tokenIsOk;
};
