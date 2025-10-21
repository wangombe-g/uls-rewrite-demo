<template>
	<nav class="bg-white shadow-md border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo/Brand -->
				<div class="flex items-center gap-8">
					<router-link to="/" class="flex items-center gap-3">
						<svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
						</svg>
						<div class="flex flex-col">
							<span class="text-xl font-bold text-gray-900">{{ t('wikipediaLanguageSelector') }}</span>
						</div>
					</router-link>

					<!-- Navigation Links -->
					<nav class="hidden md:flex items-center gap-6">
						<router-link to="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
							active-class="text-blue-600 border-b-2 border-blue-600">
							Demo </router-link>
					</nav>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
</script>
