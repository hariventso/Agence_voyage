/**
 * @file useTranslate.js
 * @description Hook custom pour traduire n'importe quel texte instantanément
 */
import { useContext, useCallback } from 'react';
import { TranslationContext } from './TranslationContextValue';

export const useTranslate = () => {
  const { currentLanguage, translations, requestTranslation } = useContext(TranslationContext);

  const t = useCallback((text) => {
    if (!text || currentLanguage === 'fr') return text;
    
    if (translations[text]) {
      return translations[text];
    }
    
    requestTranslation(text);
    return text;
  }, [currentLanguage, translations, requestTranslation]);

  return { t, currentLanguage };
};
