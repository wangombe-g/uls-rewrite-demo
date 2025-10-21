import { ref, computed } from 'vue'
import languageData from '@wikimedia/language-data'

// Interface language state
const currentInterfaceLanguage = ref(localStorage.getItem('interfaceLanguage') || 'en')

// UI translations
const translations = {
  en: {
    languageSelector: 'Language',
    interfaceLanguage: 'Interface Language',
    searchLanguages: 'Search languages...',
    selectLanguage: 'Select a language',
    wikipediaLanguageSelector: 'Language Selector',
    changeLanguage: 'Change Language'
  },
  es: {
    languageSelector: 'Idioma',
    interfaceLanguage: 'Idioma de la interfaz',
    searchLanguages: 'Buscar idiomas...',
    selectLanguage: 'Seleccionar un idioma',
    wikipediaLanguageSelector: 'Selector de idioma de',
    changeLanguage: 'Cambiar idioma'
  },
  fr: {
    languageSelector: 'Langue',
    interfaceLanguage: 'Langue de l\'interface',
    searchLanguages: 'Rechercher des langues...',
    selectLanguage: 'Sélectionner une langue',
    wikipediaLanguageSelector: 'Sélecteur de langue ',
    changeLanguage: 'Changer de langue'
  },
  de: {
    languageSelector: 'Sprache',
    interfaceLanguage: 'Oberflächensprache',
    searchLanguages: 'Sprachen suchen...',
    selectLanguage: 'Eine Sprache auswählen',
    wikipediaLanguageSelector: 'Sprachauswahl',
    changeLanguage: 'Sprache ändern'
  },
  ja: {
    languageSelector: '言語',
    interfaceLanguage: 'インターフェース言語',
    searchLanguages: '言語を検索...',
    selectLanguage: '言語を選択',
    wikipediaLanguageSelector: '言語セレクター',
    changeLanguage: '言語を変更'
  },
  zh: {
    languageSelector: '语言',
    interfaceLanguage: '界面语言',
    searchLanguages: '搜索语言...',
    selectLanguage: '选择语言',
    wikipediaLanguageSelector: '语言选择器',
    changeLanguage: '更改语言'
  },
  ar: {
    languageSelector: 'اللغة',
    interfaceLanguage: 'لغة الواجهة',
    searchLanguages: 'البحث عن اللغات...',
    selectLanguage: 'اختر لغة',
    wikipediaLanguageSelector: 'محدد لغة ويكيبيديا',
    changeLanguage: 'تغيير اللغة'
  },
  ru: {
    languageSelector: 'Язык',
    interfaceLanguage: 'Язык интерфейса',
    searchLanguages: 'Поиск языков...',
    selectLanguage: 'Выберите язык',
    wikipediaLanguageSelector: 'Выбор языка Википедии',
    changeLanguage: 'Изменить язык'
  }
}

export function useLanguage() {
  // Get all available languages from wikimedia language-data
  const availableLanguages = computed(() => {
    const languages = languageData.getLanguages()
    return Object.keys(languages).map(code => {
      const autonym = languageData.getAutonym(code)
      const englishName = languages[code]
      
      // Extract string values from arrays if needed
      const autonymStr = Array.isArray(autonym) ? autonym[autonym.length - 1] : autonym
      const englishNameStr = Array.isArray(englishName) ? englishName[englishName.length - 1] : englishName
      
      // Skip languages without proper names
      if (!autonymStr && !englishNameStr) return null
      
      return {
        code,
        name: autonymStr || englishNameStr || code,
        englishName: englishNameStr || autonymStr || code,
        dir: languageData.getDir(code) || 'ltr',
        script: languageData.getScript(code) || 'Latin'
      }
    }).filter(lang => lang !== null) // Remove null entries
      .sort((a, b) => a.name.localeCompare(b.name))
  })

  // Get specific languages for common interface languages
  const interfaceLanguages = computed(() => {
    const commonCodes = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ar', 'ru', 'it', 'pt', 'nl', 'pl', 'sv', 'ko', 'hi']
    return commonCodes.map(code => {
      const autonym = languageData.getAutonym(code)
      const languages = languageData.getLanguages()
      const englishName = languages[code]
      
      // Extract string values from arrays if needed
      const autonymStr = Array.isArray(autonym) ? autonym[autonym.length - 1] : autonym
      const englishNameStr = Array.isArray(englishName) ? englishName[englishName.length - 1] : englishName
      
      return {
        code,
        name: autonymStr || englishNameStr || code,
        englishName: englishNameStr || autonymStr || code,
        dir: languageData.getDir(code) || 'ltr',
        script: languageData.getScript(code) || 'Latin'
      }
    }).filter(lang => lang.name) // Keep languages with valid names
  })

  const setInterfaceLanguage = (languageCode) => {
    currentInterfaceLanguage.value = languageCode
    localStorage.setItem('interfaceLanguage', languageCode)
    
    // Update HTML dir attribute for RTL languages
    const dir = languageData.getDir(languageCode) || 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', languageCode)
  }

  const t = (key) => {
    const lang = currentInterfaceLanguage.value
    return translations[lang]?.[key] || translations['en'][key] || key
  }

  const getCurrentLanguageInfo = computed(() => {
    const code = currentInterfaceLanguage.value
    return {
      code,
      name: languageData.getAutonym(code) || code,
      englishName: languageData.getLanguages()[code] || code,
      dir: languageData.getDir(code) || 'ltr',
      script: languageData.getScript(code) || 'Latin'
    }
  })

  // Get languages by script
  const getLanguagesByScript = (scriptName) => {
    return availableLanguages.value.filter(lang => 
      lang.script.toLowerCase() === scriptName.toLowerCase()
    )
  }

  // Get languages by region (helper function)
  const getLanguagesByRegion = (regionName) => {
    // Regional language mappings
    const regionMappings = {
      'europe': ['en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'pl', 'nl', 'uk', 'cs', 'sv', 'no', 'da', 'fi', 'el', 'ro', 'hu', 'bg', 'hr', 'sk', 'lt', 'lv', 'et', 'sl', 'is', 'ga', 'cy', 'sq', 'mk', 'bs', 'sr', 'be'],
      'asia': ['zh', 'ja', 'ko', 'hi', 'bn', 'pa', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'th', 'vi', 'id', 'ms', 'tl', 'ur', 'fa', 'ps', 'km', 'lo', 'my', 'ne', 'si', 'ka', 'hy', 'az', 'uz', 'kk', 'mn'],
      'africa': ['ar', 'sw', 'ha', 'yo', 'ig', 'zu', 'xh', 'am', 'so', 'mg', 'rw', 'ny', 'sn', 'st', 'tn', 'ts'],
      'americas': ['en', 'es', 'pt', 'fr', 'qu', 'gn', 'ay', 'ht'],
      'oceania': ['en', 'mi', 'sm', 'to', 'ty', 'fj'],
      'middle-east': ['ar', 'he', 'fa', 'tr', 'ku', 'az', 'ckb']
    }
    
    const codes = regionMappings[regionName.toLowerCase()] || []
    return availableLanguages.value.filter(lang => codes.includes(lang.code))
  }

  // Get languages by direction (LTR/RTL)
  const getLanguagesByDirection = (direction) => {
    return availableLanguages.value.filter(lang => 
      lang.dir.toLowerCase() === direction.toLowerCase()
    )
  }

  // Initialize direction on first load
  const dir = languageData.getDir(currentInterfaceLanguage.value) || 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', currentInterfaceLanguage.value)

  return {
    currentInterfaceLanguage,
    availableLanguages,
    interfaceLanguages,
    setInterfaceLanguage,
    getCurrentLanguageInfo,
    getLanguagesByScript,
    getLanguagesByRegion,
    getLanguagesByDirection,
    t,
    languageData
  }
}
