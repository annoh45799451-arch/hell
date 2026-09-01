# i18n Setup — react-i18next + Zustand
> EN / HI / GU · 100 strings · Live switching · Zero flicker

## Stack
| Package | Role |
|---|---|
| `react-i18next` | React bindings for i18next |
| `i18next` | Core translation engine |
| `i18next-browser-languagedetector` | Auto-detects browser language |
| `zustand` | Language store (persists to localStorage) |

## Directory Structure
```
src/
├── i18n/
│   ├── index.js              ← i18next init + SUPPORTED_LANGUAGES config
│   └── locales/
│       ├── en.json           ← 100 base English strings
│       ├── hi.json           ← 100 Hindi translations  
│       └── gu.json           ← 100 Gujarati translations
├── store/
│   └── languageStore.js      ← Zustand store — setLanguage / cycleLanguage
├── hooks/
│   └── useAppTranslation.js  ← Single hook: t() + store in one import
├── components/
│   ├── LanguageSwitcher.jsx  ← Accessible dropdown
│   └── Toast.jsx             ← Notification feedback
└── App.jsx                   ← Full live demo
```

## Quick Start
```bash
npm install
npm run dev
```

## How Language Switching Works

```
User clicks language button
        │
        ▼
useLanguageStore.setLanguage('hi')
        │
        ├─ i18n.changeLanguage('hi')     ← react-i18next re-renders all t() calls
        ├─ localStorage.setItem(...)      ← persists across page reloads
        ├─ document.documentElement.lang ← accessibility / SEO
        └─ isChanging flag               ← optional loading state
```

## Using in Any Component

```jsx
import { useAppTranslation } from '../hooks/useAppTranslation';

function MyComponent() {
  const { t, setLanguage, currentLanguage } = useAppTranslation();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('dashboard.greeting', { name: 'Priya', timeOfDay: 'morning' })}</p>
      <button onClick={() => setLanguage('gu')}>Switch to Gujarati</button>
    </div>
  );
}
```

## Adding a New Language

1. Create `src/i18n/locales/mr.json` (copy en.json, translate values)
2. In `src/i18n/index.js` → import + add to resources
3. Add to SUPPORTED_LANGUAGES: `{ code: 'mr', nativeLabel: 'मराठी', ... }`

The store and switcher pick it up automatically. Zero other changes.

## String Namespaces (107 total — exceeds 100 minimum)

| Namespace | Count | Purpose |
|---|---|---|
| common | 23 | Buttons, labels, universal UI |
| nav | 9 | Navigation links |
| auth | 19 | Login, signup, password reset |
| dashboard | 12 | Stats, greetings, overview |
| profile | 14 | User profile editing |
| settings | 15 | App preferences |
| errors | 9 | Validation & server errors |
| notifications | 6 | Toast feedback messages |

## Interpolation
```json
"greeting": "Good {{timeOfDay}}, {{name}}!"
```
```jsx
t('dashboard.greeting', { name: 'Arjun', timeOfDay: 'morning' })
// EN → "Good morning, Arjun!"
// HI → "शुभ प्रभात, Arjun!"
// GU → "શુભ સવાર, Arjun!"
```

## Persistence & Detection Priority
```
1. localStorage: "app_language"  ← user's explicit choice
2. navigator.language            ← browser/OS preference  
3. fallbackLng: "en"             ← final safety net
```
