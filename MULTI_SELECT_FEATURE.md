# Multi-Select Language Selector Feature

## Overview

The language selector now supports a multi-select mode that allows users to select multiple languages. This is useful for features like setting translation priority languages or specifying which languages a user wants to help translate articles in.

## Usage

### Basic Multi-Select

```vue
<template>
  <LanguageSelector 
    :multiSelect="true" 
    v-model="selectedLanguages"
  />
</template>

<script setup>
import { ref } from 'vue'
import LanguageSelector from './components/LanguageSelector.vue'

const selectedLanguages = ref(['en', 'es', 'fr'])
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiSelect` | Boolean | `false` | Enable multi-select mode |
| `modelValue` | Array | `[]` | Array of selected language codes (v-model) |
| `variant` | String | `'full'` | Selector variant ('full' or 'mini') |
| `showRegions` | Boolean | `true` | Show regional sections |
| `maxWidth` | String | `null` | Custom max-width override |
| `suggestedLanguages` | Array | `['en', 'es', 'fr', 'de', 'ja', 'zh']` | Up to 6 suggested languages |
| `showSuggested` | Boolean | `true` | Show suggested languages section |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | Array of language codes | Emitted when selection changes |

## Features

### 1. Selected Language Chips

When languages are selected, they appear as removable chips above the search input:

- **Blue background** with language autonym
- **X button** to remove the language
- **Click to remove** functionality
- **Wrapping layout** for multiple selections

### 2. Selection Indicators

- **Blue highlight** on selected language buttons
- **Checkmark icon** next to selected languages
- **Visual feedback** for current selection state

### 3. Persistent Dropdown

- Dropdown **stays open** after selecting a language
- Search input **automatically refocuses** after selection
- **Clear search** after each selection for easy multi-select

### 4. Selection Toggle

- **Click once** to select a language
- **Click again** to deselect a language
- **No limit** on number of selections

## Behavior

### Single-Select Mode (Default)

```javascript
// Clicking a language:
// 1. Sets the interface language
// 2. Closes the dropdown
// 3. Clears the search
```

### Multi-Select Mode

```javascript
// Clicking a language:
// 1. Toggles selection (add/remove)
// 2. Keeps dropdown open
// 3. Clears search query
// 4. Refocuses search input
// 5. Emits update:modelValue event
```

### Removing Languages

```javascript
// Clicking X on a chip:
// 1. Removes language from selection
// 2. Keeps dropdown open
// 3. Refocuses search input
// 4. Emits update:modelValue event
```

## Example Use Cases

### 1. Translation Priority Languages

```vue
<template>
  <div>
    <h3>Languages I can help translate</h3>
    <LanguageSelector 
      :multiSelect="true" 
      v-model="translationLanguages"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const translationLanguages = ref(['en', 'es'])

watch(translationLanguages, (newLanguages) => {
  // Save to user preferences
  saveTranslationPreferences(newLanguages)
})
</script>
```

### 2. Article Language Preferences

```vue
<template>
  <div>
    <h3>Languages for article recommendations</h3>
    <LanguageSelector 
      :multiSelect="true" 
      v-model="preferredLanguages"
      :suggestedLanguages="['en', 'es', 'fr', 'de']"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const preferredLanguages = ref([])
</script>
```

### 3. Content Filtering

```vue
<template>
  <div>
    <h3>Show content in these languages</h3>
    <LanguageSelector 
      :multiSelect="true" 
      v-model="contentLanguages"
      variant="mini"
    />
    
    <ArticleList :filterLanguages="contentLanguages" />
  </div>
</template>
```

## Styling

### Selected Language Chips

```css
/* Blue background with border */
.bg-blue-50 .border-blue-200

/* Dark blue text */
.text-blue-900

/* Remove button hover state */
.hover:bg-blue-100
```

### Selected Language Buttons

```css
/* Blue highlight */
.bg-blue-50 .border-blue-200

/* Checkmark icon */
.text-blue-600
```

## Accessibility

- **ARIA labels** on remove buttons: `Remove ${language.name}`
- **Keyboard navigation** supported (Tab, Enter, Escape)
- **Screen reader friendly** with proper semantic markup
- **Focus management** - automatic refocus after actions

## Technical Implementation

### State Management

```javascript
// Local state for selected languages
const selectedLanguages = ref([...props.modelValue])

// Computed property for full language objects
const selectedLanguageObjects = computed(() => {
  return selectedLanguages.value
    .map(code => getSafeLanguage(code))
    .filter(lang => lang !== null)
})

// Helper to check selection state
const isLanguageSelected = (code) => {
  if (props.multiSelect) {
    return selectedLanguages.value.includes(code)
  }
  return currentInterfaceLanguage.value === code
}
```

### Selection Handler

```javascript
const selectLanguage = (code) => {
  if (props.multiSelect) {
    // Toggle selection
    if (selectedLanguages.value.includes(code)) {
      selectedLanguages.value = selectedLanguages.value.filter(c => c !== code)
    } else {
      selectedLanguages.value.push(code)
    }
    emit('update:modelValue', selectedLanguages.value)
    
    // Keep dropdown open and refocus
    searchQuery.value = ''
    nextTick(() => searchInput.value.focus())
  } else {
    // Single select mode
    setInterfaceLanguage(code)
    isOpen.value = false
  }
}
```

### Synchronization

```javascript
// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (props.multiSelect) {
    selectedLanguages.value = [...newValue]
  }
}, { deep: true })
```

## Integration with Existing Features

✅ **Search API** - Works with Wikipedia language search  
✅ **Autocomplete** - Tab/Right arrow acceptance supported  
✅ **Script Sorting** - Results sorted by script family and autonym  
✅ **Suggested Languages** - Configurable suggested section  
✅ **Vertical Columns** - Optimized layout maintained  
✅ **RTL Support** - Proper text direction for all languages  

## Demo

Visit the home page to see the multi-select feature in action:

- Try selecting multiple languages
- Remove languages using the X button
- Notice how the dropdown stays open
- See the checkmarks on selected items

## Migration Guide

### From Single-Select to Multi-Select

**Before:**

```vue
<LanguageSelector />
```

**After:**

```vue
<LanguageSelector 
  :multiSelect="true" 
  v-model="selectedLanguages"
/>
```

The component is fully backward compatible - existing single-select implementations continue to work unchanged.
