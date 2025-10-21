# Language Selector Demo Page

## Overview
The demo page provides an interactive playground to explore all language selector variations and configurations. Perfect for developers to experiment with different settings and copy ready-to-use code snippets.

## Access
Visit: **http://localhost:5173**

## Features

### 1. Interactive Configuration Panel
Left sidebar with all available options:

#### Variant Selection
- **Full** (512px width, 3 columns) - Default variant with full features
- **Mini** (320px width, 1 column) - Mobile-optimized compact variant

#### Feature Toggles
- **Multi-Select Mode** - Enable selecting multiple languages with checkmarks
- **Show Suggested Languages** - Display suggested languages section

#### Customization Options
- **Custom Max Width** - Override default width (e.g., 400px, 50vw, auto)
- **Suggested Languages** - Comma-separated language codes (max 6)

#### Quick Actions
- **Reset to Defaults** - Restore default configuration

### 2. Live Preview
Real-time preview of the language selector with current configuration:
- See changes instantly as you adjust settings
- Test all interactions (search, select, multi-select)
- View selected languages (multi-select mode)
- Current configuration summary

### 3. Auto-Generated Code Snippets
Copy-paste ready code for your application:

#### Template Code
```vue
<LanguageSelector
  variant="full"
  :multiSelect="true"
  v-model="selectedLanguages"
  :showSuggested="true"
  :suggestedLanguages="suggestedLanguages"
/>
```

#### Script Code
```javascript
<script setup>
import { ref } from 'vue'
import LanguageSelector from './components/LanguageSelector.vue'

const selectedLanguages = ref([])
const suggestedLanguages = ['en', 'es', 'fr', 'de', 'ja', 'zh']
</script>
```

#### Copy Button
One-click copy to clipboard with visual feedback

### 4. Feature Highlights
Visual cards showcasing key features:
- 🔍 **Smart Search** - Autocomplete and Wikipedia API integration
- 🌐 **Script Sorting** - Organized by script family
- ✅ **Multi-Select** - Multiple language selection
- 📱 **Responsive** - Adaptive layouts
- 🔄 **RTL Support** - Right-to-left languages
- ♿ **Accessible** - ARIA labels and keyboard navigation

### 5. Quick Examples
Pre-configured templates for common use cases:

#### Default Configuration
```javascript
{
  variant: 'full',
  multiSelect: false,
  showSuggested: true,
  maxWidth: '',
  suggestedLanguages: ['en', 'es', 'fr', 'de', 'ja', 'zh']
}
```

#### Multi-Select Priority Languages
```javascript
{
  variant: 'full',
  multiSelect: true,
  showSuggested: true,
  selectedLanguages: ['en', 'es', 'fr']
}
```

#### Minimal Setup
```javascript
{
  variant: 'full',
  multiSelect: false,
  showSuggested: false,
  maxWidth: '400px'
}
```

#### Mobile Optimized
```javascript
{
  variant: 'mini',
  multiSelect: false,
  showSuggested: true,
  suggestedLanguages: ['en', 'es', 'fr']
}
```

## Usage Workflow

### 1. Configure Your Selector
1. Select variant (full or mini)
2. Toggle multi-select if needed
3. Enable/disable regions and suggested languages
4. Set custom width if desired
5. Specify suggested languages

### 2. Preview & Test
1. Click the language selector to open dropdown
2. Test search functionality
3. Try selecting languages
4. Verify behavior matches requirements

### 3. Copy Code
1. Review generated code snippet
2. Click "Copy Code" button
3. Paste into your application
4. Adjust as needed

## Configuration Reference

### Props Available

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | String | `'full'` | Selector variant: 'full' or 'mini' |
| `multiSelect` | Boolean | `false` | Enable multi-select mode |
| `showRegions` | Boolean | `true` | Show regional sections (full only) |
| `showSuggested` | Boolean | `true` | Show suggested languages |
| `maxWidth` | String | `null` | Custom max-width override |
| `suggestedLanguages` | Array | `['en', 'es', ...]` | Up to 6 language codes |
| `modelValue` | Array | `[]` | Selected languages (multi-select) |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | Array | Emitted when selection changes (multi-select) |

## Example Use Cases

### Basic Interface Language Selector
```vue
<LanguageSelector />
```

### Translation Priority Languages
```vue
<LanguageSelector 
  :multiSelect="true" 
  v-model="translationLanguages"
/>
```

### Mobile Navbar
```vue
<LanguageSelector 
  variant="mini"
  :showSuggested="false"
/>
```

### Custom Width & Languages
```vue
<LanguageSelector 
  maxWidth="600px"
  :suggestedLanguages="['en', 'de', 'fr']"
/>
```

### Article Language Filter
```vue
<LanguageSelector 
  :multiSelect="true"
  v-model="contentLanguages"
  :showRegions="false"
/>
```

## Tips & Best Practices

### 1. Variant Selection
- Use **full variant** for desktop/tablet navigation bars
- Use **mini variant** for mobile devices or compact spaces
- Consider responsive design with conditional variant

### 2. Multi-Select
- Enable for translation preferences
- Enable for content filtering
- Keep single-select for interface language

### 3. Suggested Languages
- Include most commonly used languages
- Maximum of 6 for optimal UX
- Consider user demographics

### 4. Performance
- Component is optimized with debounced search (300ms)
- API calls are cached and deduplicated
- Virtual scrolling for large language lists

### 5. Accessibility
- Always provide proper labels
- Ensure keyboard navigation works
- Test with screen readers

## Troubleshooting

### Issue: Code doesn't work
**Solution**: Make sure to import the component and composable correctly

### Issue: Selected languages not updating
**Solution**: Use `v-model` for multi-select mode

### Issue: Custom width not applying
**Solution**: Ensure the value includes units (e.g., 'px', '%', 'vw')

### Issue: Suggested languages not showing
**Solution**: Check that `showSuggested` is `true` and array is not empty

## Demo Page Structure

```
┌─────────────────────────────────────────┐
│           Navigation Bar                │
├──────────────┬──────────────────────────┤
│              │                          │
│ Config Panel │   Live Preview           │
│              │                          │
│ - Variant    │   [Language Selector]    │
│ - Multi      │                          │
│ - Regions    │   Selected Languages     │
│ - Suggested  │   Configuration Summary  │
│ - Width      │                          │
│ - Languages  ├──────────────────────────┤
│              │   Code Snippet           │
│ [Reset]      │   - Template             │
│              │   - Script               │
│              │   [Copy Code]            │
│              ├──────────────────────────┤
│              │   Feature Highlights     │
│              │   [6 Feature Cards]      │
│              ├──────────────────────────┤
│              │   Quick Examples         │
│              │   [4 Example Buttons]    │
└──────────────┴──────────────────────────┘
```

## Technical Implementation

### State Management
```javascript
const config = ref({
  variant: 'full',
  multiSelect: false,
  showRegions: true,
  showSuggested: true,
  maxWidth: '',
})

const selectedLanguages = ref([])
const copied = ref(false)
```

### Code Generation
```javascript
// Template code computed property
const templateCode = computed(() => {
  // Dynamically build props based on config
  // Only include non-default values
})

// Script code computed property
const scriptCode = computed(() => {
  // Generate imports and refs
  // Based on active features
})
```

### Clipboard API
```javascript
const copyToClipboard = async () => {
  await navigator.clipboard.writeText(fullCode)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
```

## Future Enhancements

- [ ] Dark mode preview
- [ ] A/B comparison view
- [ ] Accessibility checker
- [ ] Keyboard navigation

## Feedback & Contributions

Found a bug or have a suggestion? Please let us know!

## Related Documentation

- [Multi-Select Feature Guide](./MULTI_SELECT_FEATURE.md)
- [API Search Implementation](./API_SEARCH_IMPLEMENTATION.md)
- [Language Selector Guide](./LANGUAGE_SELECTOR_GUIDE.md)
