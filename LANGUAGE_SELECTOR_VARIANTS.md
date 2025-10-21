# Language Selector Variants

The `LanguageSelector` component is configurable with different variants to fit various use cases in your application.

## Props

### `variant`

- **Type**: `String`
- **Default**: `'full'`
- **Options**: `'full'` | `'mini'`
- **Description**: Determines the layout and size of the language selector dropdown

### `multiSelect`

- **Type**: `Boolean`
- **Default**: `false`
- **Description**: Enable multi-select mode for selecting multiple languages

### `showSuggested`

- **Type**: `Boolean`
- **Default**: `true`
- **Description**: Whether to show the suggested languages section

### `suggestedLanguages`

- **Type**: `Array`
- **Default**: `['en', 'es', 'fr', 'de', 'ja', 'zh']`
- **Description**: Array of up to 6 language codes to display as suggestions

### `maxWidth`

- **Type**: `String`
- **Default**: `null`
- **Description**: Custom max-width override for the dropdown (e.g., `'400px'`, `'50vw'`)

### `modelValue`

- **Type**: `Array`
- **Default**: `[]`
- **Description**: Array of selected language codes (used with `multiSelect` mode and `v-model`)

## Variants

### Full Variant (Default)

The full variant displays a 512px dropdown with 3-column grid layout, organized by script family.

**Features:**

- 512px wide dropdown
- 3-column grid layout (5 items per column)
- Script family organization (Arabic, Cyrillic, Latin, CJK, etc.)
- Autonym sorting within each script group
- English name subtitles
- Suggested languages section (optional)
- Best for: Main navigation, settings pages, desktop interfaces

**Usage:**

```vue
<!-- Default full variant -->
<LanguageSelector />

<!-- Explicit full variant -->
<LanguageSelector variant="full" />

<!-- Full variant without suggested languages -->
<LanguageSelector variant="full" :showSuggested="false" />
```

### Mini Variant

The mini variant displays a compact 320px dropdown with single-column layout, perfect for mobile devices and tight spaces.

**Features:**

- 320px wide dropdown
- Single-column layout
- Script family organization (same as full variant)
- Autonym sorting
- English name subtitles
- Compact search results
- Best for: Mobile devices, article language selection, sidebars, tight spaces

**Usage:**

```vue
<!-- Mini variant -->
<LanguageSelector variant="mini" />

<!-- Mini variant with custom width -->
<LanguageSelector variant="mini" maxWidth="280px" />
```

## Examples

### Example 1: Main Navigation (Full)

```vue
<template>
  <nav class="navbar">
    <div class="logo">My Site</div>
    <LanguageSelector variant="full" />
  </nav>
</template>
```

### Example 2: Multi-Select for Translation Priorities

```vue
<template>
  <div class="settings">
    <label>Select your preferred languages for translations:</label>
    <LanguageSelector 
      variant="full"
      :multiSelect="true"
      v-model="preferredLanguages"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const preferredLanguages = ref(['en', 'es', 'fr'])
</script>
```

### Example 3: Mobile Sidebar (Mini)

```vue
<template>
  <aside class="mobile-sidebar">
    <div class="language-widget">
      <h3>Language</h3>
      <LanguageSelector variant="mini" />
    </div>
  </aside>
</template>
```

## Comparison Table

| Feature | Full Variant | Mini Variant |
|---------|-------------|--------------|
| Width | 512px | 320px |
| Grid Columns | 3 | 1 |
| Items per Column | 5 | All (single list) |
| Organization | Script family + autonym | Script family + autonym |
| English Names | Yes | Yes |
| Suggested Languages | Optional | Optional |
| Best For | Desktop nav, settings | Mobile, sidebars, tight spaces |

## Language Organization

Both variants organize languages using the same intelligent system:

### Script Family Sorting

Languages are grouped by their writing system:

- **Arabic script**: ar, fa, ur, etc.
- **Cyrillic script**: ru, uk, bg, etc.
- **Latin script**: en, es, fr, de, etc.
- **CJK scripts**: zh, ja, ko
- **And more**: Devanagari, Hebrew, Greek, etc.

### Autonym Sorting

Within each script family, languages are sorted alphabetically by their native name (autonym).

This provides a logical, culturally-aware organization that works globally.

## Search Features

Both variants include the same powerful search features:

- **Auto-focus**: Search input receives focus automatically
- **Prefix matching**: Case-insensitive prefix search
- **Wikipedia API**: Multilingual search (find "alemán" → German)
- **Type-ahead autocomplete**: Tab/Right arrow to complete
- **Debounced search**: 300ms delay for smooth performance
- **Priority ordering**: Exact matches, API results, prefix matches

## Responsive Behavior

Both variants are designed to stay within viewport bounds:

- **Full variant**: 512px width, never breaks layout
- **Mini variant**: 320px width, compact and mobile-friendly
- **Custom width**: Use `maxWidth` prop for fine-tuned control
- **Height constraint**: Max height of `calc(100vh - 100px)` with scroll

## Integration Tips

1. **Use Full variant** for primary interface language selection in navigation
2. **Use Mini variant** for mobile devices, sidebars, or article language switching
3. **Enable multi-select** for translation priority selection or content filtering
4. **Customize suggested languages** based on your audience demographics
5. **Use maxWidth** to adapt to your specific layout constraints

## Advanced Examples

### Dynamic Variant Based on Screen Size

```vue
<template>
  <LanguageSelector 
    :variant="isMobile ? 'mini' : 'full'"
    :show-regions="!isMobile"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
})
</script>
```

### Custom Styled Container

```vue
<template>
  <div class="custom-language-selector">
    <LanguageSelector 
      variant="mini"
      max-width="100%"
    />
  </div>
</template>

<style scoped>
.custom-language-selector {
  max-width: 300px;
  margin: 0 auto;
}
</style>
```

## Migration Guide

If you're upgrading from the previous version:

### Before

```vue
<LanguageSelector />
```

### After (Same behavior)

```vue
<LanguageSelector variant="full" />
```

### New Mini Selector

```vue
<LanguageSelector variant="mini" />
```

No breaking changes - the component defaults to `variant="full"` which maintains all previous functionality.
