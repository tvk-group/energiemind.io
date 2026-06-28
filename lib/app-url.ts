const DEFAULT_APP_URL = "https://app.energiemind.io";

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_SUBDOMAIN_URL || DEFAULT_APP_URL;
}

export function isAppHost(host: string) {
  const normalized = host.split(":")[0].toLowerCase();
  return (
    normalized === "app.energiemind.io" ||
    normalized === "app.localhost" ||
    normalized.startsWith("app.")
  );
}

export function getLoginPath(host?: string) {
  if (host && isAppHost(host)) return "/login/";
  return "/en/login/";
}

export function getPanelPath(host?: string) {
  if (host && isAppHost(host)) return "/";
  return "/panel/";
}
