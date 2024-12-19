const CORS_PROXY = 'https://corsproxy.io/?';

export const proxyUrl = (url) => `${CORS_PROXY}${encodeURIComponent(url)}`;