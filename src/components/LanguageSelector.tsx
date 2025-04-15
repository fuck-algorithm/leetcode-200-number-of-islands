import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // 保存用户选择的语言到本地存储
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-selector">
      <span className="language-selector-title">{t('languageSelector.title')}:</span>
      <div className="language-selector-options">
        <button
          className={i18n.language === 'en' ? 'active' : ''}
          onClick={() => changeLanguage('en')}
        >
          {t('languageSelector.english')}
        </button>
        <button
          className={i18n.language === 'zh' ? 'active' : ''}
          onClick={() => changeLanguage('zh')}
        >
          {t('languageSelector.chinese')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector; 