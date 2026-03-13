export function isPreviewAuthEnabled() {
  const flag = import.meta.env.VITE_DISABLE_AUTH_FOR_TESTING;

  if (flag === 'true') return true;
  if (flag === 'false') return false;

  return import.meta.env.MODE !== 'production';
}
