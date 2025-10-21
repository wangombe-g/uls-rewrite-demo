<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span>{{ currentLanguageInfo.name }}</span>
      <svg 
        class="w-4 h-4 transition-transform" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="dropdownPanel"
        class="absolute mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        :class="dropdownPositionClass"
        :style="{ width: dropdownWidth, minWidth: dropdownWidth, maxWidth: dropdownWidth, maxHeight: 'calc(100vh - 100px)' }"
      >
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-700 mb-3">{{ t('interfaceLanguage') }}</h3>
          
          <!-- Selected Languages (Multi-select mode) -->
          <div v-if="multiSelect && selectedLanguageObjects.length > 0" class="mb-3">
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="language in selectedLanguageObjects" 
                :key="language.code"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-sm"
              >
                <span class="font-medium text-blue-900" :dir="language.dir">{{ language.name }}</span>
                <button
                  @click.stop="removeSelectedLanguage(language.code)"
                  class="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-sm p-0.5 transition-colors"
                  :aria-label="`Remove ${language.name}`"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="relative">
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                :placeholder="t('searchLanguages')"
                class="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click.stop
                @keydown.tab.prevent="acceptAutocomplete"
                @keydown.right="acceptAutocompleteOnArrow"
              />
              <!-- Autocomplete suggestion overlay -->
              <div 
                v-if="autocompleteSuggestion" 
                class="absolute left-0 top-0 px-4 py-2 text-sm pointer-events-none"
                style="color: transparent;"
              >
                <span>{{ searchQuery }}</span><span class="text-gray-400">{{ autocompleteSuggestion }}</span>
              </div>
            </div>
            <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Search hints -->
          <div v-if="!searchQuery" class="mt-2 text-xs text-gray-500">
            <span v-if="multiSelect">Select multiple languages for translation priorities</span>
            <span v-else>Search by language name in any language, code, script, or direction</span>
          </div>
        </div>

        <div class="max-h-[600px] overflow-y-auto p-4">
          <!-- Loading State -->
          <div v-if="isSearching" class="py-12 text-center text-gray-500">
            <div class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching...</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="hasSearchQuery && filteredLanguages.length === 0" class="py-12 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="font-medium text-lg">No languages found</p>
            <p class="text-sm mt-1">Try a different search term</p>
          </div>

          <!-- Suggested Languages Section (Only when not searching) -->
          <div v-if="!hasSearchQuery && suggestedLanguagesList.length > 0" class="mb-6">
            <div class="suggested-section">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                Suggested languages
              </h4>
              <!-- Vertical columns layout with 2 items per column for suggested -->
              <div class="flex gap-6">
                <div 
                  v-for="(column, colIndex) in organizeIntoColumns(suggestedLanguagesList, 2)" 
                  :key="`suggested-col-${colIndex}`"
                  class="flex-1 space-y-2"
                >
                  <button
                    v-for="language in column"
                    :key="language.code"
                    @click="selectLanguage(language.code)"
                    class="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200"
                    :class="{ 
                      'bg-blue-50 border-blue-200': isLanguageSelected(language.code),
                      'relative': multiSelect && isLanguageSelected(language.code)
                    }"
                  >
                    <div class="font-medium text-sm text-gray-900" :dir="language.dir">
                      {{ language.name }}
                      <!-- Checkmark for multi-select -->
                      <svg 
                        v-if="multiSelect && isLanguageSelected(language.code)"
                        class="inline-block w-4 h-4 ml-1 text-blue-600" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="text-xs text-gray-500 truncate">
                      {{ language.englishName }}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Results -->
          <div v-else-if="hasSearchQuery" class="space-y-1">
            <button
              v-for="language in filteredLanguages"
              :key="language.code"
              @click="selectLanguage(language.code)"
              class="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200"
              :class="{ 
                'bg-blue-50 border-blue-200': isLanguageSelected(language.code),
                'relative': multiSelect && isLanguageSelected(language.code)
              }"
            >
              <div class="font-medium text-sm text-gray-900" :dir="language.dir">
                {{ language.name }}
                <!-- Checkmark for multi-select -->
                <svg 
                  v-if="multiSelect && isLanguageSelected(language.code)"
                  class="inline-block w-4 h-4 ml-1 text-blue-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div v-if="!isMiniVariant" class="text-xs text-gray-500 truncate">
                {{ language.englishName }}
              </div>
            </button>
          </div>

          <!-- All Languages (Default View) -->
          <div v-else-if="!isMiniVariant">
            <!-- Show "All languages" title only if suggested languages are shown -->
            <h4 
              v-if="suggestedLanguagesList.length > 0" 
              class="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200"
            >
              All languages
            </h4>
            
            <!-- Vertical columns layout with 5 items per column -->
            <div class="flex gap-6">
              <div 
                v-for="(column, colIndex) in organizeIntoColumns(allLanguages, 5)" 
                :key="`all-col-${colIndex}`"
                class="flex-1 space-y-2"
              >
                <button
                  v-for="language in column"
                  :key="language.code"
                  @click="selectLanguage(language.code)"
                  class="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200"
                  :class="{ 
                    'bg-blue-50 border-blue-200': isLanguageSelected(language.code),
                    'relative': multiSelect && isLanguageSelected(language.code)
                  }"
                >
                  <div class="font-medium text-sm text-gray-900" :dir="language.dir">
                    {{ language.name }}
                    <!-- Checkmark for multi-select -->
                    <svg 
                      v-if="multiSelect && isLanguageSelected(language.code)"
                      class="inline-block w-4 h-4 ml-1 text-blue-600" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="text-xs text-gray-500 truncate">
                    {{ language.englishName }}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Simple List (Default View for mini variant) -->
          <div v-else class="space-y-4">
            <!-- Suggested Languages for mini variant -->
            <div v-if="suggestedLanguagesList.length > 0" class="space-y-1">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">
                Suggested languages
              </h4>
              <button
                v-for="language in suggestedLanguagesList"
                :key="language.code"
                @click="selectLanguage(language.code)"
                class="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200"
                :class="{ 
                  'bg-blue-50 border-blue-200': isLanguageSelected(language.code),
                  'relative': multiSelect && isLanguageSelected(language.code)
                }"
              >
                <div class="font-medium text-sm text-gray-900" :dir="language.dir">
                  {{ language.name }}
                  <!-- Checkmark for multi-select -->
                  <svg 
                    v-if="multiSelect && isLanguageSelected(language.code)"
                    class="inline-block w-4 h-4 ml-1 text-blue-600" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ language.englishName }}
                </div>
              </button>
            </div>

            <!-- All Languages for mini variant -->
            <div class="space-y-1">
              <h4 
                v-if="suggestedLanguagesList.length > 0" 
                class="text-sm font-semibold text-gray-700 mb-2"
              >
                All languages
              </h4>
              <button
                v-for="language in allLanguages"
                :key="language.code"
                @click="selectLanguage(language.code)"
                class="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200"
                :class="{ 
                  'bg-blue-50 border-blue-200': isLanguageSelected(language.code),
                  'relative': multiSelect && isLanguageSelected(language.code)
                }"
              >
                <div class="font-medium text-sm text-gray-900" :dir="language.dir">
                  {{ language.name }}
                  <!-- Checkmark for multi-select -->
                  <svg 
                    v-if="multiSelect && isLanguageSelected(language.code)"
                    class="inline-block w-4 h-4 ml-1 text-blue-600" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ language.englishName }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
          <div v-if="hasSearchQuery">
            {{ filteredLanguages.length }} {{ filteredLanguages.length === 1 ? 'language' : 'languages' }} found
          </div>
          <div v-else>
            {{ totalLanguagesCount }} languages available
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useLanguage } from '../composables/useLanguage'

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'full', // 'full' or 'mini'
    validator: (value) => ['full', 'mini'].includes(value)
  },
  maxWidth: {
    type: String,
    default: null // Custom max-width override
  },
  suggestedLanguages: {
    type: Array,
    default: () => ['en', 'es', 'fr', 'de', 'ja', 'zh'] // Up to 6 suggested languages
  },
  showSuggested: {
    type: Boolean,
    default: true
  },
  multiSelect: {
    type: Boolean,
    default: false // Enable multi-select mode
  },
  modelValue: {
    type: Array,
    default: () => [] // Array of selected language codes for multi-select
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

const { 
  currentInterfaceLanguage, 
  interfaceLanguages,
  availableLanguages,
  setInterfaceLanguage, 
  getCurrentLanguageInfo,
  t,
  languageData
} = useLanguage()

const isOpen = ref(false)
const searchQuery = ref('')
const debouncedQuery = ref('')
const dropdownRef = ref(null)
const dropdownPanel = ref(null)
const searchInput = ref(null)
const debounceTimeout = ref(null)
const isSearching = ref(false)
const autocompleteSuggestion = ref('')
const apiSearchResults = ref([])
const selectedLanguages = ref([...props.modelValue]) // Local copy of selected languages

// Get full language objects for selected languages
const selectedLanguageObjects = computed(() => {
  return selectedLanguages.value
    .map(code => getSafeLanguage(code))
    .filter(lang => lang !== null)
})

// Helper to check if a language is selected (for multi-select mode)
const isLanguageSelected = (code) => {
  if (props.multiSelect) {
    return selectedLanguages.value.includes(code)
  }
  return currentInterfaceLanguage.value === code
}

const currentLanguageInfo = computed(() => getCurrentLanguageInfo.value)
const hasSearchQuery = computed(() => debouncedQuery.value.trim().length > 0)

// Layout configuration based on variant
const isMiniVariant = computed(() => props.variant === 'mini')
const dropdownWidth = computed(() => {
  if (props.maxWidth) return props.maxWidth
  // Mini variant uses responsive width, not 100vw
  // 320px is a good mobile-friendly width
  return isMiniVariant.value ? '320px' : '512px'
})
const gridColumns = computed(() => isMiniVariant.value ? 1 : 3)

// Dropdown positioning - ensure it stays within viewport
const dropdownPositionClass = computed(() => {
  // Default to right-aligned
  // In a real implementation, you could use dynamic positioning based on viewport
  // For now, we'll use right-0 for desktop and adjust for mobile
  if (isMiniVariant.value) {
    return 'left-0 right-0' // Full width on mobile
  }
  return 'right-0' // Right-aligned on desktop
})

// Calculate grid columns for suggested languages (2 or 3 columns based on count)
const suggestedGridColumns = computed(() => {
  if (isMiniVariant.value) return 1
  const count = props.suggestedLanguages.length
  // Use 2 columns if 4 or fewer languages, 3 columns if 5 or 6
  return count <= 4 ? 2 : 3
})

// Build suggested languages list with full language data
const suggestedLanguagesList = computed(() => {
  if (!props.showSuggested || props.suggestedLanguages.length === 0) {
    return []
  }
  
  // Sort suggested languages before returning
  const sortedCodes = sortLanguages(props.suggestedLanguages.slice(0, 6))
  
  return sortedCodes
    .map(code => getSafeLanguage(code))
    .filter(lang => lang !== null)
})

// Organize languages into vertical columns (for display optimization)
// Each column has 5 items (2 for suggested languages)
const organizeIntoColumns = (languages, itemsPerColumn = 5) => {
  if (languages.length === 0) return []
  
  const numColumns = gridColumns.value
  const totalItems = languages.length
  
  // Calculate items per column
  const baseItemsPerColumn = Math.ceil(totalItems / numColumns)
  const effectiveItemsPerColumn = itemsPerColumn
  
  // Calculate number of complete blocks
  const itemsPerBlock = effectiveItemsPerColumn * numColumns
  const numCompleteBlocks = Math.floor(totalItems / itemsPerBlock)
  const remainingItems = totalItems % itemsPerBlock
  
  // Organize into columns
  const columns = []
  let currentIndex = 0
  
  // Fill complete blocks
  for (let block = 0; block < numCompleteBlocks; block++) {
    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < effectiveItemsPerColumn; row++) {
        if (!columns[col]) columns[col] = []
        columns[col].push(languages[currentIndex++])
      }
    }
  }
  
  // Fill remaining items
  if (remainingItems > 0) {
    const remainingCols = Math.ceil(remainingItems / effectiveItemsPerColumn)
    for (let col = 0; col < remainingCols; col++) {
      const itemsInThisCol = Math.min(effectiveItemsPerColumn, remainingItems - (col * effectiveItemsPerColumn))
      for (let row = 0; row < itemsInThisCol; row++) {
        if (!columns[col]) columns[col] = []
        columns[col].push(languages[currentIndex++])
      }
    }
  }
  
  return columns
}

// Fetch language search results from Wikipedia API
const fetchLanguageSearch = async (query) => {
  if (!query || query.length < 2) {
    apiSearchResults.value = []
    return
  }
  
  try {
    // Use the current interface language for the API endpoint
    const currentLang = currentInterfaceLanguage.value || 'en'
    const apiUrl = `https://${currentLang}.wikipedia.org/w/api.php`
    
    const params = new URLSearchParams({
      action: 'languagesearch',
      format: 'json',
      search: query,
      formatversion: '2',
      origin: '*' // Required for CORS
    })
    
    const response = await fetch(`${apiUrl}?${params}`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && data.languagesearch) {
      // Convert API results to our language format
      const results = Object.entries(data.languagesearch).map(([code, name]) => {
        // Try to get full language data, or create a minimal entry
        const existingLang = availableLanguages.value.find(lang => lang.code === code)
        
        if (existingLang) {
          // Return existing language but mark it as API result for priority
          return {
            ...existingLang,
            apiResult: true,
            apiMatch: name // Store the API match name for debugging
          }
        }
        
        // Create a minimal language entry for API-only results
        try {
          const autonym = languageData.getAutonym(code)
          const autonymStr = Array.isArray(autonym) ? autonym[autonym.length - 1] : autonym
          
          return {
            code,
            name: String(autonymStr || name || code),
            englishName: String(name || code),
            dir: languageData.getDir(code) || 'ltr',
            script: String(languageData.getScript(code) || 'Latin'),
            apiResult: true,
            apiMatch: name
          }
        } catch (error) {
          // Fallback for languages not in languageData
          return {
            code,
            name: String(name || code),
            englishName: String(name || code),
            dir: 'ltr',
            script: 'Latin',
            apiResult: true,
            apiMatch: name
          }
        }
      })
      
      apiSearchResults.value = results
    } else {
      apiSearchResults.value = []
    }
  } catch (error) {
    console.warn('Language search API error:', error)
    apiSearchResults.value = []
  }
}

// Debounce the search query and calculate autocomplete
watch(searchQuery, (newValue) => {
  isSearching.value = true
  
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  
  debounceTimeout.value = setTimeout(async () => {
    debouncedQuery.value = newValue
    
    // Fetch API results in parallel with local processing
    if (newValue.trim()) {
      await fetchLanguageSearch(newValue.trim())
    } else {
      apiSearchResults.value = []
    }
    
    // Calculate autocomplete suggestion
    if (newValue.trim()) {
      const query = newValue.toLowerCase()
      const match = availableLanguages.value.find(lang => {
        const name = String(lang.name || '').toLowerCase()
        const englishName = String(lang.englishName || '').toLowerCase()
        return name.startsWith(query) || englishName.startsWith(query)
      })
      
      if (match) {
        const name = String(match.name || '').toLowerCase()
        const englishName = String(match.englishName || '').toLowerCase()
        
        if (name.startsWith(query)) {
          autocompleteSuggestion.value = name.substring(query.length)
        } else if (englishName.startsWith(query)) {
          autocompleteSuggestion.value = englishName.substring(query.length)
        } else {
          autocompleteSuggestion.value = ''
        }
      } else {
        autocompleteSuggestion.value = ''
      }
    } else {
      autocompleteSuggestion.value = ''
    }
    
    isSearching.value = false
  }, 300)
})

// Regional language mappings - now just a simple list of all languages
const allLanguageCodes = [
  // Popular/Common
  'en', 'es', 'fr', 'de', 'ja', 'zh', 'ar', 'ru', 'it', 'pt', 'hi', 'ko',
  // Europe
  'nl', 'pl', 'uk', 'cs', 'sv', 'no', 'da', 'fi', 'el', 'ro', 'hu', 'bg', 
  'hr', 'sk', 'lt', 'lv', 'et', 'sl', 'is', 'ga', 'cy', 'sq', 'mk', 'bs', 
  'sr', 'be', 'ca', 'eu', 'gl',
  // Asia
  'bn', 'pa', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'th', 'vi', 'id', 'ms', 
  'tl', 'ur', 'fa', 'ps', 'km', 'lo', 'my', 'ne', 'si', 'ka', 'hy', 'az', 
  'uz', 'kk', 'mn', 'ky',
  // Middle East & North Africa
  'he', 'tr', 'ku', 'ckb', 'arz', 'ary',
  // Sub-Saharan Africa
  'sw', 'ha', 'yo', 'ig', 'zu', 'xh', 'am', 'so', 'mg', 'rw', 'ny', 'sn', 
  'st', 'tn', 'ts',
  // Americas
  'qu', 'gn', 'ay', 'ht',
  // Oceania
  'mi', 'sm', 'to', 'ty', 'fj'
]

// Safe language getter
const getSafeLanguage = (code) => {
  try {
    const autonym = languageData.getAutonym(code)
    const languages = languageData.getLanguages()
    const langData = languages[code]
    
    // Extract native name from array
    const nativeName = Array.isArray(langData) ? langData[langData.length - 1] : langData
    const autonymStr = Array.isArray(autonym) ? autonym[autonym.length - 1] : autonym
    
    // English name mapping
    const englishNames = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'ja': 'Japanese',
      'zh': 'Chinese', 'ar': 'Arabic', 'ru': 'Russian', 'it': 'Italian', 'pt': 'Portuguese',
      'hi': 'Hindi', 'ko': 'Korean', 'nl': 'Dutch', 'pl': 'Polish', 'sv': 'Swedish',
      'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish', 'el': 'Greek', 'ro': 'Romanian',
      'hu': 'Hungarian', 'bg': 'Bulgarian', 'hr': 'Croatian', 'sk': 'Slovak', 'lt': 'Lithuanian',
      'lv': 'Latvian', 'et': 'Estonian', 'sl': 'Slovenian', 'is': 'Icelandic', 'ga': 'Irish',
      'cy': 'Welsh', 'sq': 'Albanian', 'mk': 'Macedonian', 'bs': 'Bosnian', 'sr': 'Serbian',
      'be': 'Belarusian', 'ca': 'Catalan', 'eu': 'Basque', 'gl': 'Galician', 'bn': 'Bengali',
      'pa': 'Punjabi', 'te': 'Telugu', 'ta': 'Tamil', 'mr': 'Marathi', 'gu': 'Gujarati',
      'kn': 'Kannada', 'ml': 'Malayalam', 'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian',
      'ms': 'Malay', 'tl': 'Tagalog', 'ur': 'Urdu', 'fa': 'Persian', 'ps': 'Pashto',
      'km': 'Khmer', 'lo': 'Lao', 'my': 'Burmese', 'ne': 'Nepali', 'si': 'Sinhala',
      'ka': 'Georgian', 'hy': 'Armenian', 'az': 'Azerbaijani', 'uz': 'Uzbek', 'kk': 'Kazakh',
      'mn': 'Mongolian', 'ky': 'Kyrgyz', 'he': 'Hebrew', 'tr': 'Turkish', 'ku': 'Kurdish',
      'ckb': 'Central Kurdish', 'arz': 'Egyptian Arabic', 'ary': 'Moroccan Arabic',
      'sw': 'Swahili', 'ha': 'Hausa', 'yo': 'Yoruba', 'ig': 'Igbo', 'zu': 'Zulu',
      'xh': 'Xhosa', 'am': 'Amharic', 'so': 'Somali', 'mg': 'Malagasy', 'rw': 'Kinyarwanda',
      'ny': 'Chichewa', 'sn': 'Shona', 'st': 'Sesotho', 'tn': 'Setswana', 'ts': 'Tsonga',
      'qu': 'Quechua', 'gn': 'Guarani', 'ay': 'Aymara', 'ht': 'Haitian Creole',
      'mi': 'Māori', 'sm': 'Samoan', 'to': 'Tongan', 'ty': 'Tahitian', 'fj': 'Fijian',
      'uk': 'Ukrainian', 'cs': 'Czech'
    }
    
    const finalNativeName = autonymStr || nativeName || code
    const englishName = englishNames[code] || code.toUpperCase()
    
    return {
      code,
      name: String(finalNativeName),
      englishName: String(englishName),
      dir: languageData.getDir(code) || 'ltr',
      script: String(languageData.getScript(code) || 'Latin')
    }
  } catch (error) {
    console.warn(`Error loading language ${code}:`, error)
    return null
  }
}

// Sort languages by script group and autonym
const sortLanguages = (languageCodes) => {
  // First sort by script group
  const sortedByScript = languageData.sortByScriptGroup(languageCodes)
  
  // Then sort by autonym within each script group
  const groupedByScript = languageData.getLanguagesByScriptGroup(sortedByScript)
  const result = []
  
  // Sort each script group alphabetically by autonym
  Object.keys(groupedByScript).sort().forEach(scriptGroup => {
    const groupLanguages = groupedByScript[scriptGroup].sort(languageData.sortByAutonym)
    result.push(...groupLanguages)
  })
  
  return result
}

// Organize all languages sorted by script and autonym
const allLanguages = computed(() => {
  // Sort all language codes
  const sortedCodes = sortLanguages(allLanguageCodes)
  
  const languages = sortedCodes
    .map(code => getSafeLanguage(code))
    .filter(lang => lang !== null)
    .filter((lang, index, self) => 
      // Remove duplicates
      index === self.findIndex(l => l.code === lang.code)
    )
  
  return languages
})

// Calculate total languages
const totalLanguagesCount = computed(() => allLanguages.value.length)

// Search filter with prefix-based search, API results, and priority ordering
const filteredLanguages = computed(() => {
  const query = debouncedQuery.value.toLowerCase().trim()
  
  if (!query) {
    return []
  }

  const allAvailableLanguages = availableLanguages.value
  
  // Combine local and API results, removing duplicates
  const apiCodes = new Set(apiSearchResults.value.map(lang => lang.code))
  const combinedLanguages = [
    ...apiSearchResults.value,
    ...allAvailableLanguages.filter(lang => !apiCodes.has(lang.code))
  ]
  
  // Map languages to include priority score
  const languagesWithPriority = combinedLanguages.map(lang => {
    try {
      // Safe property access with type checking
      const name = String(lang.name || '').toLowerCase()
      const englishName = String(lang.englishName || '').toLowerCase()
      const code = String(lang.code || '').toLowerCase()
      const script = String(lang.script || '').toLowerCase()
      const dir = String(lang.dir || 'ltr')
      const isApiResult = lang.apiResult === true
      
      let priority = 999 // No match by default
      
      // Priority 0: API exact match (highest priority - from Wikipedia's language search)
      if (isApiResult && code === query) {
        priority = 0
      }
      // Priority 1: Exact code match (local)
      else if (code === query) {
        priority = 1
      }
      // Priority 2: API results (languages found by Wikipedia's search)
      else if (isApiResult) {
        priority = 2
      }
      // Priority 3: Code starts with query
      else if (code.startsWith(query)) {
        priority = 3
      }
      // Priority 4: Native name starts with query (PREFIX MATCH)
      else if (name.startsWith(query)) {
        priority = 4
      }
      // Priority 5: English name starts with query (PREFIX MATCH)
      else if (englishName.startsWith(query)) {
        priority = 5
      }
      // Priority 6: Script match (for queries like "latin", "arabic")
      else if (script.includes(query)) {
        priority = 6
      }
      // Priority 7: Direction match (for queries like "rtl")
      else if ((query === 'rtl' && dir === 'rtl') || (query === 'ltr' && dir === 'ltr')) {
        priority = 7
      }
      
      return { lang, priority }
    } catch (error) {
      console.warn('Error filtering language:', lang, error)
      return { lang, priority: 999 }
    }
  })
  .filter(item => item.priority < 999) // Only keep matches
  .sort((a, b) => {
    // Sort by priority first
    if (a.priority !== b.priority) {
      return a.priority - b.priority
    }
    // Then alphabetically by native name
    return a.lang.name.localeCompare(b.lang.name)
  })
  .slice(0, 100) // Limit results
  .map(item => item.lang) // Extract just the language objects
  
  // Sort the filtered results by script group and autonym
  const filteredCodes = languagesWithPriority.map(lang => lang.code)
  const sortedCodes = sortLanguages(filteredCodes)
  
  return sortedCodes
    .map(code => languagesWithPriority.find(lang => lang.code === code))
    .filter(lang => lang !== undefined)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    debouncedQuery.value = ''
    autocompleteSuggestion.value = ''
    apiSearchResults.value = []
    // Focus the search input after the dropdown is rendered
    nextTick(() => {
      if (searchInput.value) {
        searchInput.value.focus()
      }
    })
  }
}

const selectLanguage = (code) => {
  if (props.multiSelect) {
    // Multi-select mode: toggle language selection
    if (selectedLanguages.value.includes(code)) {
      selectedLanguages.value = selectedLanguages.value.filter(c => c !== code)
    } else {
      selectedLanguages.value.push(code)
    }
    emit('update:modelValue', selectedLanguages.value)
    
    // Clear search and refocus
    searchQuery.value = ''
    debouncedQuery.value = ''
    autocompleteSuggestion.value = ''
    apiSearchResults.value = []
    
    // Keep dropdown open and refocus search input
    nextTick(() => {
      if (searchInput.value) {
        searchInput.value.focus()
      }
    })
  } else {
    // Single select mode: set interface language and close
    setInterfaceLanguage(code)
    isOpen.value = false
    searchQuery.value = ''
    debouncedQuery.value = ''
    autocompleteSuggestion.value = ''
    apiSearchResults.value = []
  }
}

const removeSelectedLanguage = (code) => {
  selectedLanguages.value = selectedLanguages.value.filter(c => c !== code)
  emit('update:modelValue', selectedLanguages.value)
  
  // Refocus search input
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const acceptAutocomplete = () => {
  if (autocompleteSuggestion.value) {
    searchQuery.value = searchQuery.value + autocompleteSuggestion.value
    autocompleteSuggestion.value = ''
  }
}

const acceptAutocompleteOnArrow = (event) => {
  // Only accept autocomplete if cursor is at the end of the input
  if (event.target.selectionStart === searchQuery.value.length && autocompleteSuggestion.value) {
    event.preventDefault()
    acceptAutocomplete()
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
    searchQuery.value = ''
    debouncedQuery.value = ''
    autocompleteSuggestion.value = ''
    apiSearchResults.value = []
  }
}

// Watch for external changes to modelValue (for multi-select)
watch(() => props.modelValue, (newValue) => {
  if (props.multiSelect) {
    selectedLanguages.value = [...newValue]
  }
}, { deep: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
})
</script>
