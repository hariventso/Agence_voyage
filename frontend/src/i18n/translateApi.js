/**
 * @file translateApi.js
 * @description API de traduction automatique via Google Translate avec système de cache local
 */

const CACHE_KEY = 'app_translations_cache';

const getCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveCache = (cache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Erreur sauvegarde du cache de traduction", e);
  }
};

/**
 * Traduit un texte dynamiquement
 * @param {string} text - Texte à traduire
 * @param {string} targetLang - Langue cible (ex: 'en', 'ru')
 * @param {string} sourceLang - Langue source (par défaut 'fr')
 * @returns {Promise<string>}
 */
export const translateText = async (text, targetLang, sourceLang = 'fr') => {
  if (!text || targetLang === sourceLang) return text;

  const cache = getCache();
  const key = `${text}_${sourceLang}_${targetLang}`;
  
  if (cache[key]) return cache[key];

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Translation request failed");
    
    const data = await response.json();
    // Google returns data in a nested structure: [[[translatedText, originalText, null, null, 1]], null, "fr"]
    let translatedText = '';
    if (data && data[0] && Array.isArray(data[0])) {
      translatedText = data[0].map(item => item[0] || '').join('');
    } else {
      translatedText = text;
    }
    
    cache[key] = translatedText;
    saveCache(cache);
    
    return translatedText;
  } catch (error) {
    console.error("🌐 API Traduction indisponible. Fallback sur l'original.", error);
    return text; 
  }
};
