# Product Requirements Document: Wikipedia Universal Language Selector

## 1. Overview

### 1.1 Purpose
Develop an open-source language selector for Wikipedia that enables users to configure language preferences, select fonts, and configure input methods across all Wikipedia language editions.

### 1.2 Background
Wikipedia exists in 300+ languages, and users need robust tools to:
- Navigate content in multiple languages
- Customize UI language independently of content language
- Input text in scripts they may not have keyboard support for
- Display content in scripts that require specialized fonts

### 1.3 Goals
- Provide seamless language switching across Wikipedia editions
- Enable users to write in any script regardless of their physical keyboard
- Ensure content is readable in all supported scripts
- Make language tools accessible to both logged-in and anonymous users

## 2. Target Users

### 2.1 Primary Users
- **Multilingual readers**: Users who consume Wikipedia content in multiple languages
- **Multilingual editors**: Contributors who edit articles in languages using different scripts
- **Language learners**: Users exploring content in non-native languages
- **Users without specialized keyboards**: Those needing input methods for non-Latin scripts

### 2.2 User Personas
1. **Global Reader**: Reads articles in 3-4 languages regularly
2. **Script Learner**: Writing in Hindi/Arabic/Chinese with QWERTY keyboard
3. **Regional Contributor**: Edits in local language but needs English UI
4. **Accessibility User**: Requires specific fonts for readability

## 3. Functional Requirements

### 3.1 Language Settings Panel

#### 3.1.1 Access Points
- **FR-1.1**: Panel accessible from sidebar interlanguage list
- **FR-1.2**: Panel accessible from personal toolbar for wikis lacking interlanguage links
- **FR-1.3**: Panel accessible via keyboard shortcut (configurable)
- **FR-1.4**: Panel state persists across sessions

#### 3.1.2 Panel Features
- **FR-1.5**: Display all configured language preferences in one view
- **FR-1.6**: Search/filter functionality for finding languages
- **FR-1.7**: Recently used languages quick access
- **FR-1.8**: Favorite/pin languages for quick switching

### 3.2 UI Language Adjustments

#### 3.2.1 Language Selection
- **FR-2.1**: Users can select UI language independent of content language
- **FR-2.2**: Support for 300+ Wikipedia language codes
- **FR-2.3**: Language selector shows native language names (e.g., "Deutsch" not "German")
- **FR-2.4**: Fallback to English for incomplete translations

#### 3.2.2 User Types
- **FR-2.5**: Logged-in users: UI language preference saved to account
- **FR-2.6**: Anonymous users: UI language preference saved to browser storage
- **FR-2.7**: Option to detect language from browser settings

### 3.3 Font Selection

#### 3.3.1 Web Font Support
- **FR-3.1**: Automatic web font loading for non-Latin scripts
- **FR-3.2**: Support for major script families:
  - Devanagari (Hindi, Marathi, Nepali, etc.)
  - Arabic/Persian/Urdu
  - Chinese (Simplified & Traditional)
  - Japanese (Kanji, Hiragana, Katakana)
  - Korean (Hangul)
  - Cyrillic
  - Thai, Tamil, Telugu, Bengali, etc.

#### 3.3.2 Font Customization
- **FR-3.3**: Users can select from 2-3 alternative fonts per script
- **FR-3.4**: Option to disable web fonts and use local system fonts
- **FR-3.5**: Font preview before selection
- **FR-3.6**: Font size adjustment (accessibility)

#### 3.3.3 Performance
- **FR-3.7**: Lazy load fonts only when needed
- **FR-3.8**: Cache fonts in browser for faster subsequent loads
- **FR-3.9**: Fallback to system fonts if web fonts fail to load

### 3.4 Input Method Configuration

#### 3.4.1 Input Method Support
- **FR-4.1**: Support for phonetic/transliteration input methods
- **FR-4.2**: Support for major input methods:
  - Hindi: QWERTY → Devanagari (e.g., "pa" → "प")
  - Arabic: QWERTY → Arabic script
  - Chinese: Pinyin → Characters
  - Japanese: Romaji → Hiragana/Katakana/Kanji
  - Korean: QWERTY → Hangul
- **FR-4.3**: Toggle input methods on/off per input field
- **FR-4.4**: Remember input method preference per language

#### 3.4.2 Input Method Switching
- **FR-4.5**: Keyboard shortcut to enable/disable input method
- **FR-4.6**: Visual indicator when input method is active
- **FR-4.7**: Support for multiple input methods per language
- **FR-4.8**: Quick switch between languages without opening settings

### 3.5 Input Method Contextual Menu

#### 3.5.1 Contextual Controls
- **FR-5.1**: Small menu appears near active input elements (textarea, input fields)
- **FR-5.2**: Shows current input language and method
- **FR-5.3**: Quick language switcher dropdown
- **FR-5.4**: Quick input method switcher
- **FR-5.5**: Link to full language settings

#### 3.5.2 Multi-Language Input
- **FR-5.6**: Support inline language switching within same input field
- **FR-5.7**: Example: English → IPA → Russian in single edit
- **FR-5.8**: Visual indicators for active language/input method
- **FR-5.9**: Undo/redo support across language switches

### 3.6 Interlanguage Links

#### 3.6.1 Display
- **FR-6.1**: Show available language versions of current article
- **FR-6.2**: Sort by user's preferred languages first
- **FR-6.3**: Indicate article quality/size in other languages
- **FR-6.4**: Search across language versions

#### 3.6.2 Navigation
- **FR-6.5**: One-click switching to article in another language
- **FR-6.6**: Remember preferred reading languages
- **FR-6.7**: Suggest related articles in user's languages

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-1.1**: Language selector panel opens in <200ms
- **NFR-1.2**: Input method latency <50ms per keystroke
- **NFR-1.3**: Font loading doesn't block page rendering
- **NFR-1.4**: Settings changes apply without page reload

### 4.2 Accessibility
- **NFR-2.1**: WCAG 2.1 AA compliance
- **NFR-2.2**: Full keyboard navigation support
- **NFR-2.3**: Screen reader compatible
- **NFR-2.4**: High contrast mode support
- **NFR-2.5**: RTL (right-to-left) language support

### 4.3 Browser Support
- **NFR-3.1**: Chrome/Edge (last 2 versions)
- **NFR-3.2**: Firefox (last 2 versions)
- **NFR-3.3**: Safari (last 2 versions)
- **NFR-3.4**: Mobile browsers (iOS Safari, Chrome Mobile)
- **NFR-3.5**: Graceful degradation for older browsers

### 4.4 Localization
- **NFR-4.1**: All UI strings externalized for translation
- **NFR-4.2**: Support for 300+ language translations
- **NFR-4.3**: RTL layout support for Arabic, Hebrew, etc.
- **NFR-4.4**: Pluralization rules for all supported languages

### 4.5 Data & Privacy
- **NFR-5.1**: Language preferences stored locally for anonymous users
- **NFR-5.2**: No tracking of language usage without consent
- **NFR-5.3**: GDPR compliance for EU users
- **NFR-5.4**: Option to clear all saved preferences

### 4.6 Compatibility
- **NFR-6.1**: Works with MediaWiki (Wikipedia's platform)
- **NFR-6.2**: Compatible with Wikipedia mobile apps
- **NFR-6.3**: API for third-party Wikipedia tools
- **NFR-6.4**: Works with Wikipedia's existing extensions

## 5. User Stories

### 5.1 Language Switching
```
As a multilingual reader
I want to quickly switch between Wikipedia languages
So that I can read articles in my preferred language
```

### 5.2 UI Customization
```
As a Hindi speaker
I want to read Hindi content with English UI
So that I can navigate the site more easily
```

### 5.3 Font Selection
```
As a user without local Tamil fonts
I want automatic web font loading
So that I can read Tamil articles properly
```

### 5.4 Input Methods
```
As a Hindi editor with QWERTY keyboard
I want to type "namaste" and get "नमस्ते"
So that I can contribute without installing Hindi keyboard
```

### 5.5 Multi-Script Editing
```
As an English Wikipedia editor
I want to combine English, IPA, and Cyrillic in one edit
So that I can write articles about foreign cities with proper pronunciation
```

## 6. Technical Considerations

### 6.1 Architecture
- **TC-1**: Component-based architecture (reusable UI components)
- **TC-2**: Client-side rendering for instant language switching
- **TC-3**: Progressive enhancement (works without JavaScript)
- **TC-4**: Modular design (font support, input methods as plugins)

### 6.2 Data Sources
- **TC-5**: Language codes from ISO 639-1/2/3
- **TC-6**: Language names from CLDR (Unicode)
- **TC-7**: Interlanguage links from Wikidata
- **TC-8**: Font metadata from font configuration files

### 6.3 Dependencies
- **TC-9**: Minimal external dependencies
- **TC-10**: Open-source licensed dependencies only
- **TC-11**: CDN for web font delivery
- **TC-12**: Bundle size <100KB (excluding fonts)

## 7. Success Metrics

### 7.1 Adoption
- **SM-1**: 30% of logged-in users configure language preferences within 3 months
- **SM-2**: 50% increase in cross-language article views
- **SM-3**: 20% of edits use input methods within 6 months

### 7.2 Performance
- **SM-4**: <5% performance degradation vs. baseline
- **SM-5**: 95% font load success rate
- **SM-6**: <1% JavaScript errors in production

### 7.3 User Satisfaction
- **SM-7**: 4+ star rating in user feedback
- **SM-8**: <2% users disable the feature
- **SM-9**: Positive feedback from accessibility audits

## 8. Constraints & Assumptions

### 8.1 Constraints
- Must integrate with existing MediaWiki infrastructure
- Must support legacy browsers (progressive enhancement)
- Cannot significantly increase page load time
- Must be translatable by volunteer community

### 8.2 Assumptions
- Users have basic understanding of language concepts
- Most users have modern browsers with JavaScript enabled
- Web fonts are acceptable substitute for local fonts
- Users understand phonetic/transliteration input

## 9. Out of Scope (v1.0)

- Automatic translation of article content
- Voice input for languages
- Handwriting recognition
- Offline language packs
- Custom keyboard layout creation
- Machine learning-based input prediction

## 10. Future Enhancements

- **v1.1**: Mobile app integration
- **v1.2**: Voice input support
- **v1.3**: Smart language suggestions based on reading history
- **v2.0**: AI-powered input method improvements
- **v2.0**: Collaborative translation tools

## 11. Open Questions

1. Should anonymous users see language selector by default or opt-in?
2. How many fonts per script should be offered?
3. Should there be a "quick setup" wizard for first-time users?
4. How to handle conflicts between browser language and Wikipedia language?
5. Should input methods work in search boxes?

## 12. Appendix

### 12.1 Related Projects
- Current Wikipedia Universal Language Selector (ULS)
- Google Input Tools
- Microsoft Input Method Editors (IMEs)
- Unicode CLDR

### 12.2 References
- [Wikipedia Language List](https://meta.wikimedia.org/wiki/List_of_Wikipedias)
- [MediaWiki Language Support](https://www.mediawiki.org/wiki/Localisation)
- [Web Font Best Practices](https://web.dev/font-best-practices/)
- [Input Method Standards](https://www.w3.org/International/questions/qa-input-methods)

---

**Document Version**: 1.0  
**Last Updated**: October 17, 2025  
**Status**: Draft for Review  
**Owner**: Eugene Wang'ombe - LPL
