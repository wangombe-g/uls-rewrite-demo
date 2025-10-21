# Universal Language Selector - Implementation Guide

## Overview
This application implements a multi-language interface selector using the Wikimedia language-data package. Users can switch the interface language from a dropdown in the navigation bar.

## Features Implemented

### 1. **Language Selector Component** (`src/components/LanguageSelector.vue`)
- Dropdown interface with search functionality
- Displays languages in their native scripts (autonyms)
- Shows both native and English names
- Supports searching by language name or code
- Visual indicator for currently selected language
- Responsive design with Tailwind CSS

### 2. **Navigation Bar** (`src/components/Navbar.vue`)
- Clean, modern navbar with logo
- Integrated language selector in the top-right
- Responsive layout

### 3. **Language Management** (`src/composables/useLanguage.js`)
- Vue composable for centralized language state management
- Integration with `@wikimedia/language-data` package
- Features:
  - Get all available languages (300+ languages)
  - Get common interface languages
  - Get language autonyms (native names)
  - Get text direction (LTR/RTL)
  - Get language scripts
  - Translation system for UI strings
  - Persistent language selection (localStorage)
  - Automatic RTL support

### 4. **Multi-language UI Translations**
Currently supported interface languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)
- Chinese (zh)
- Arabic (ar)
- Russian (ru)

## Technical Implementation

### Dependencies
- **Vue 3**: Frontend framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **@wikimedia/language-data**: Official Wikimedia language data package

### Key Features

#### 1. Wikimedia Language Data Integration
```javascript
import languageData from '@wikimedia/language-data'

// Get all available languages
const languages = languageData.getLanguages()

// Get native name (autonym)
const autonym = languageData.getAutonym('es') // Returns "español"

// Get text direction
const dir = languageData.getDir('ar') // Returns "rtl"

// Get script system
const script = languageData.getScript('ja') // Returns "Jpan"
```

#### 2. Reactive Language Selection
- Language preference is stored in localStorage
- Changes persist across page reloads
- Updates HTML `lang` and `dir` attributes automatically

#### 3. RTL Support
- Automatic detection and switching for RTL languages
- Proper rendering of Arabic, Hebrew, Persian, etc.
- Direction changes applied to document root

#### 4. Search Functionality
- Real-time filtering of languages
- Search by native name, English name, or language code
- Case-insensitive matching

## File Structure

```
src/
├── components/
│   ├── Navbar.vue              # Navigation bar with language selector
│   ├── LanguageSelector.vue    # Language dropdown component
│   └── HelloWorld.vue          # (original demo component)
├── composables/
│   └── useLanguage.js          # Language management composable
├── App.vue                      # Main application component
├── main.js                      # Application entry point
└── style.css                    # Global styles (Tailwind)
```

## Usage

### Running the Application
```bash
npm install
npm run dev
```

Visit: `http://localhost:5173`

### Using the Language Selector
1. Click the language button in the top-right of the navbar
2. Search for a language by typing in the search box
3. Click a language to select it
4. The interface will update immediately
5. Your selection is saved automatically

### Adding More UI Translations
Edit `src/composables/useLanguage.js`:

```javascript
const translations = {
  // Add new language
  'pt': {
    languageSelector: 'Idioma',
    interfaceLanguage: 'Idioma da interface',
    searchLanguages: 'Pesquisar idiomas...',
    // ... add all keys
  }
}
```

### Using the Language System in Components
```vue
<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t, currentInterfaceLanguage, setInterfaceLanguage } = useLanguage()
</script>

<template>
  <div>
    <h1>{{ t('interfaceLanguage') }}</h1>
    <p>Current: {{ currentInterfaceLanguage }}</p>
  </div>
</template>
```

## Next Steps

### For Article Language Selection
To add Wikipedia article language selection:

1. Create a separate `useArticleLanguage` composable
2. Add an article language selector component
3. Use the same Wikimedia language-data for consistency
4. Implement article fetching based on selected language

### Recommended Enhancements
- Add language groups/regions for better organization
- Implement recently used languages
- Add language suggestions based on browser locale
- Create language settings page with more options
- Add keyboard shortcuts for language switching
- Implement language-specific fonts loading

## API Reference

### `useLanguage()` Composable

**Returns:**
- `currentInterfaceLanguage`: Ref<string> - Current language code
- `availableLanguages`: ComputedRef<Array> - All available languages
- `interfaceLanguages`: ComputedRef<Array> - Common interface languages
- `setInterfaceLanguage(code)`: Function - Change interface language
- `getCurrentLanguageInfo`: ComputedRef<Object> - Current language details
- `t(key)`: Function - Translate UI string
- `languageData`: Object - Direct access to Wikimedia language-data

## Resources
- [Wikimedia Language Data](https://github.com/wikimedia/language-data)
- [Language Data Documentation](https://language-data.readthedocs.io/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
