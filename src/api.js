// GANTI URL INI dengan URL InfinityFree kamu (contoh: http://niko.infinityfreeapp.com/backend)
export const API_BASE_URL = "https://finedu-backend-production.up.railway.app";

export const getApiUrl = (endpoint) => {
    // Pastikan endpoint diawali dengan / jika belum ada
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
};
