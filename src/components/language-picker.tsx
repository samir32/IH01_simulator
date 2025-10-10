import { useLanguage, Language } from './language-context';

export function LanguagePicker() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="flex items-center gap-1">
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-blue-600 text-white text-xs border-none outline-none cursor-pointer px-1"
      >
        <option value="fr">{t('language.french')}</option>
        <option value="en">{t('language.english')}</option>
      </select>
    </div>
  );
}