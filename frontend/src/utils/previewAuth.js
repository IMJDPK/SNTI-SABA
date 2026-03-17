export function isPreviewAuthEnabled() {
  const flag = import.meta.env.VITE_DISABLE_AUTH_FOR_TESTING;
  return flag === 'true';
}
