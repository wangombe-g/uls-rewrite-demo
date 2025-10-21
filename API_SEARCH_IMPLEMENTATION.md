# API Search Implementation

## Overview

The language selector now integrates with Wikipedia's `languagesearch` API to provide multilingual search capabilities. Users can search for languages in any language, not just by their native names or English names.

## How It Works

### API Endpoint

The search uses the Wikipedia API based on the current interface language:

```
https://{currentLanguage}.wikipedia.org/w/api.php?action=languagesearch&format=json&search={query}
```

### Example Searches

#### English Interface (en.wikipedia.org)

- Search: `"German"` → Results include: `de - Deutsch`
- Search: `"sw"` → Results include: `sw - Swahili`, `sv - Swedish`, etc.
- Search: `"Japanese"` → Results include: `ja - 日本語`

#### Spanish Interface (es.wikipedia.org)

- Search: `"alemán"` → Results include: `de - Deutsch`
- Search: `"sw"` → Results include: `sw - suajili`

## Priority System

The search results are prioritized as follows:

1. **Priority 0**: API exact code match (e.g., search "de" on API)
2. **Priority 1**: Local exact code match
3. **Priority 2**: Languages found by Wikipedia API (e.g., "German" → "de")
4. **Priority 3**: Local code starts with query
5. **Priority 4**: Native name starts with query
6. **Priority 5**: English name starts with query
7. **Priority 6**: Script match (e.g., "latin", "arabic")
8. **Priority 7**: Direction match (e.g., "rtl", "ltr")

## Implementation Details

### API Integration

- **Debounce**: 300ms delay before API call
- **CORS**: Uses `origin: '*'` parameter
- **Error Handling**: Gracefully falls back to local search on API errors
- **Minimum Query Length**: 2 characters before API call

### Data Merging

- API results are combined with local language data
- Duplicates are removed (API results take precedence)
- API results are marked with `apiResult: true` flag for priority handling
- Languages found via API display their autonym (native name) but matched via the API's translation

### Display Format

- **Primary**: Language autonym (native name) - e.g., "Deutsch"
- **Secondary**: English name - e.g., "German"
- **Sorting**: Results sorted by script family then autonym
- **Layout**: Vertical columns for optimal scanning

## Key Features

✅ **Multilingual Search**: Find languages by their name in any language
✅ **Context-Aware**: API endpoint changes based on interface language
✅ **Seamless Integration**: API results merged with local filtering
✅ **Maintained Sorting**: All results sorted by script family and autonym
✅ **Fast Performance**: Debounced search with loading indicators

## Technical Implementation

### Key Functions

#### `fetchLanguageSearch(query)`

Fetches results from Wikipedia's languagesearch API and converts them to our language format.

#### `filteredLanguages` (computed)

Merges API results with local search results, applies priority scoring, and returns sorted results.

#### Priority Logic

```javascript
if (isApiResult && code === query) priority = 0
else if (code === query) priority = 1
else if (isApiResult) priority = 2
// ... additional local matching priorities
```

## Testing

1. Open language selector
2. Search for "German" (English interface) → Should show "Deutsch"
3. Search for "Japanese" → Should show "日本語"
4. Change interface to Spanish
5. Search for "alemán" → Should show "Deutsch"
6. Search for "japonés" → Should show "日本語"

## Configuration

The feature works automatically with no configuration needed. It:

- Uses the current `currentInterfaceLanguage` for the API endpoint
- Maintains all existing search functionality
- Preserves autocomplete, prefix matching, and script/direction filtering
