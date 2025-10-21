import { ref } from 'vue'
import { useLanguage } from './useLanguage'

// Article language state (separate from interface language)
const currentArticleLanguage = ref(localStorage.getItem('articleLanguage') || 'en')

export function useArticleLanguage() {
  const { languageData } = useLanguage()

  const setArticleLanguage = (languageCode) => {
    currentArticleLanguage.value = languageCode
    localStorage.setItem('articleLanguage', languageCode)
  }

  const getArticleLanguageInfo = () => {
    const code = currentArticleLanguage.value
    return {
      code,
      name: languageData.getAutonym(code) || code,
      englishName: languageData.getLanguages()[code] || code,
      dir: languageData.getDir(code) || 'ltr',
      script: languageData.getScript(code) || 'Latin'
    }
  }

  // Get Wikipedia article URL for a given title and language
  const getWikipediaUrl = (title, languageCode = currentArticleLanguage.value) => {
    return `https://${languageCode}.wikipedia.org/wiki/${encodeURIComponent(title)}`
  }

  return {
    currentArticleLanguage,
    setArticleLanguage,
    getArticleLanguageInfo,
    getWikipediaUrl,
    languageData
  }
}
