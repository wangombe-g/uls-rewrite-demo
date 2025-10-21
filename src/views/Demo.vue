<template>
	<div class="min-h-screen bg-gray-50 py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="mb-12">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">
					Language Selector Demo
				</h1>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Configuration Panel -->
				<div class="lg:col-span-1">
					<div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
						<h2 class="text-xl font-bold text-gray-900 mb-4">Configuration</h2>

						<!-- Variant Selection -->
						<div class="mb-6">
							<label class="block text-sm font-semibold text-gray-700 mb-2">
								Variant
							</label>
							<div class="space-y-2">
								<label class="flex items-center">
									<input type="radio" v-model="config.variant" value="full" class="mr-2">
									<span class="text-sm">Full (512px width, 3 columns)</span>
								</label>
								<label class="flex items-center">
									<input type="radio" v-model="config.variant" value="mini" class="mr-2">
									<span class="text-sm">Mini (320px width, 1 column)</span>
								</label>
							</div>
						</div>

						<!-- Multi-Select -->
						<div class="mb-6">
							<label class="flex items-center">
								<input type="checkbox" v-model="config.multiSelect" class="mr-2">
								<span class="text-sm font-semibold text-gray-700">Multi-Select Mode</span>
							</label>
							<p class="text-xs text-gray-500 mt-1 ml-6">
								Allow selecting multiple languages
							</p>
						</div>

						<!-- Show Suggested -->
						<div class="mb-6">
							<label class="flex items-center">
								<input type="checkbox" v-model="config.showSuggested" class="mr-2">
								<span class="text-sm font-semibold text-gray-700">Show Suggested Languages</span>
							</label>
							<p class="text-xs text-gray-500 mt-1 ml-6">
								Display suggested languages section
							</p>
						</div>

						<!-- Custom Width -->
						<div class="mb-6">
							<label class="block text-sm font-semibold text-gray-700 mb-2">
								Custom Max Width
							</label>
							<input type="text" v-model="config.maxWidth" placeholder="e.g., 400px, 100%, auto"
								class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
							<p class="text-xs text-gray-500 mt-1">
								Leave empty for default width
							</p>
						</div>

						<!-- Suggested Languages -->
						<div class="mb-6">
							<label class="block text-sm font-semibold text-gray-700 mb-2">
								Suggested Languages
							</label>
							<input type="text" v-model="suggestedLanguagesInput" placeholder="e.g., en, es, fr, de"
								class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
							<p class="text-xs text-gray-500 mt-1">
								Comma-separated language codes (max 6)
							</p>
						</div>

						<!-- Reset Button -->
						<button @click="resetConfig"
							class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors">
							Reset to Defaults
						</button>
					</div>
				</div>

				<!-- Preview & Code Panel -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Live Preview -->
					<div class="bg-white rounded-lg shadow-md p-6">
						<h2 class="text-xl font-bold text-gray-900 mb-4">Live Preview</h2>

						<div class="mb-4">
							<div class="inline-block">
								<LanguageSelector :variant="config.variant" :multiSelect="config.multiSelect"
									:showSuggested="config.showSuggested" :maxWidth="config.maxWidth || null"
									:suggestedLanguages="parsedSuggestedLanguages" v-model="selectedLanguages" />
							</div>
						</div>

						<!-- Selected Languages Display (Multi-Select) -->
						<div v-if="config.multiSelect && selectedLanguages.length > 0"
							class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<h3 class="text-sm font-semibold text-blue-900 mb-2">
								Selected Languages ({{ selectedLanguages.length }}):
							</h3>
							<div class="flex flex-wrap gap-2">
								<span v-for="code in selectedLanguages" :key="code"
									class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
									{{ code }}
								</span>
							</div>
						</div>
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-xl font-bold text-gray-900">Code Snippet</h2>
								<button @click="copyToClipboard"
									class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
									{{ copied ? 'Copied!' : 'Copy Code' }}
								</button>
							</div>

							<!-- Template Code -->
							<div class="mb-4">
								<h3 class="text-sm font-semibold text-gray-700 mb-2">Template</h3>
								<pre
									class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{{ templateCode }}</code></pre>
							</div>

							<!-- Script Code -->
							<div>
								<h3 class="text-sm font-semibold text-gray-700 mb-2">Script</h3>
								<pre
									class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{{ scriptCode }}</code></pre>
							</div>
						
					</div>
					<!-- Quick Examples -->
					<div class="bg-white rounded-lg shadow-md p-6">
						<h2 class="text-xl font-bold text-gray-900 mb-4">Quick Examples</h2>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<button @click="loadExample('default')"
								class="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
								<h3 class="font-semibold text-gray-900 mb-1">Default Configuration</h3>
								<p class="text-sm text-gray-600">Full variant with all features enabled</p>
							</button>

							<button @click="loadExample('multiselect')"
								class="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
								<h3 class="font-semibold text-gray-900 mb-1">Multi-Select Priority Languages</h3>
								<p class="text-sm text-gray-600">For translation preferences or content filtering</p>
							</button>

							<button @click="loadExample('minimal')"
								class="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
								<h3 class="font-semibold text-gray-900 mb-1">Minimal Setup</h3>
								<p class="text-sm text-gray-600">Simple language selector without extras</p>
							</button>

							<button @click="loadExample('mobile')"
								class="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
								<h3 class="font-semibold text-gray-900 mb-1">Mobile Optimized</h3>
								<p class="text-sm text-gray-600">Mini variant for mobile devices</p>
							</button>
						</div>
					</div>

					<!-- Feature Highlights -->
					<div class="bg-white rounded-lg shadow-md p-6">
						<h2 class="text-xl font-bold text-gray-900 mb-4">Features</h2>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- Feature Cards -->
							<div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
								<h3 class="font-semibold text-blue-900 mb-2">🔍 Smart Search</h3>
								<p class="text-sm text-blue-800">
									Autocomplete, prefix matching, and Wikipedia API integration for multilingual search
								</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
								<h3 class="font-semibold text-green-900 mb-2">🌐 Script Sorting</h3>
								<p class="text-sm text-green-800">
									Languages organized by script family (Arabic, Cyrillic, Latin, etc.) then autonym
								</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
								<h3 class="font-semibold text-purple-900 mb-2">✅ Multi-Select</h3>
								<p class="text-sm text-purple-800">
									Select multiple languages with visual chips and checkmarks
								</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
								<h3 class="font-semibold text-orange-900 mb-2">📱 Responsive</h3>
								<p class="text-sm text-orange-800">
									Full and mini variants with adaptive layouts for all screen sizes
								</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
								<h3 class="font-semibold text-pink-900 mb-2">🔄 RTL Support</h3>
								<p class="text-sm text-pink-800">
									Proper text direction for right-to-left languages like Arabic and Hebrew
								</p>
							</div>

							<div class="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
								<h3 class="font-semibold text-indigo-900 mb-2">♿ Accessible</h3>
								<p class="text-sm text-indigo-800">
									ARIA labels, keyboard navigation, and screen reader friendly
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import LanguageSelector from '../components/LanguageSelector.vue'

// Configuration state
const config = ref({
  variant: 'full',
  multiSelect: false,
  showSuggested: true,
  maxWidth: '',
})

const suggestedLanguagesInput = ref('en, es, fr, de, ja, zh')
const selectedLanguages = ref([])
const copied = ref(false)

// Parse suggested languages from input
const parsedSuggestedLanguages = computed(() => {
  return suggestedLanguagesInput.value
    .split(',')
    .map(lang => lang.trim())
    .filter(lang => lang.length > 0)
    .slice(0, 6) // Max 6 languages
})

// Generate template code
const templateCode = computed(() => {
  let code = '<LanguageSelector'
  
  // Add props
  if (config.value.variant !== 'full') {
    code += `\n  variant="${config.value.variant}"`
  }
  
  if (config.value.multiSelect) {
    code += '\n  :multiSelect="true"'
    code += '\n  v-model="selectedLanguages"'
  }
  
  if (!config.value.showSuggested) {
    code += '\n  :showSuggested="false"'
  }
  
  if (config.value.maxWidth) {
    code += `\n  maxWidth="${config.value.maxWidth}"`
  }
  
  const defaultSuggested = 'en, es, fr, de, ja, zh'
  if (suggestedLanguagesInput.value !== defaultSuggested) {
    code += '\n  :suggestedLanguages="suggestedLanguages"'
  }
  
  code += '/>'
  
  return code
})

// Generate script code
const scriptCode = computed(() => {
  let code = '<script setup>\n'
  code += "import { ref } from 'vue'\n"
  code += "import LanguageSelector from './components/LanguageSelector.vue'\n\n"
  
  if (config.value.multiSelect) {
    code += 'const selectedLanguages = ref([])\n'
  }
  
  const defaultSuggested = 'en, es, fr, de, ja, zh'
  if (suggestedLanguagesInput.value !== defaultSuggested) {
    const langs = parsedSuggestedLanguages.value.map(l => `'${l}'`).join(', ')
    code += `const suggestedLanguages = [${langs}]\n`
  }
  
  code += '<\/script>'
  
  return code
})

// Copy to clipboard
const copyToClipboard = async () => {
  const fullCode = `${templateCode.value}\n\n${scriptCode.value}`
  
  try {
    await navigator.clipboard.writeText(fullCode)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Reset configuration
const resetConfig = () => {
  config.value = {
    variant: 'full',
    multiSelect: false,
    showSuggested: true,
    maxWidth: '',
  }
  suggestedLanguagesInput.value = 'en, es, fr, de, ja, zh'
  selectedLanguages.value = []
}

// Load example configurations
const loadExample = (example) => {
  switch (example) {
    case 'default':
      resetConfig()
      break
      
    case 'multiselect':
      config.value = {
        variant: 'full',
        multiSelect: true,
        showSuggested: true,
        maxWidth: '',
      }
      suggestedLanguagesInput.value = 'en, es, fr, de, ja, zh'
      selectedLanguages.value = ['en', 'es', 'fr']
      break
      
    case 'minimal':
      config.value = {
        variant: 'full',
        multiSelect: false,
        showSuggested: false,
        maxWidth: '512px',
      }
      suggestedLanguagesInput.value = ''
      selectedLanguages.value = []
      break
      
    case 'mobile':
      config.value = {
        variant: 'mini',
        multiSelect: false,
        showSuggested: true,
        maxWidth: '',
      }
      suggestedLanguagesInput.value = 'en, es, fr'
      selectedLanguages.value = []
      break
  }
}

// Clear selected languages when switching from multi-select to single
watch(() => config.value.multiSelect, (newValue) => {
  if (!newValue) {
    selectedLanguages.value = []
  }
})
</script>
