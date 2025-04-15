import React from 'react';
import { useTranslation } from 'react-i18next';
import GitHubLink from '../GitHubLink';
import LanguageSelector from '../LanguageSelector';
import './TitlePanel.css';

interface TitlePanelProps {
  repoUrl: string;
  backLink?: {
    url: string;
    text: string;
  };
}

const TitlePanel: React.FC<TitlePanelProps> = ({ repoUrl, backLink }) => {
  const { t, i18n } = useTranslation();
  
  const handleTitleClick = () => {
    // 根据当前语言决定跳转到哪个LeetCode网站
    const leetcodeUrl = i18n.language === 'zh' 
      ? 'https://leetcode.cn/problems/number-of-islands/'
      : 'https://leetcode.com/problems/number-of-islands/';
    
    // 在新窗口打开链接
    window.open(leetcodeUrl, '_blank', 'noopener,noreferrer');
  };

  // 根据当前语言确定提示文本
  const tooltipText = i18n.language === 'zh' 
    ? '查看LeetCode中文原题' 
    : 'View on LeetCode';
  
  return (
    <div className="title-wrapper">
      <div className="title-container">
        {backLink && (
          <a href={backLink.url} 
             className="back-to-list"
             target="_blank"
             rel="noopener noreferrer">
            <span className="back-arrow">←</span>
            <span className="back-text">{backLink.text}</span>
          </a>
        )}
        
        <div 
          className="title-link" 
          onClick={handleTitleClick}
          data-tooltip={tooltipText}
        >
          <h1 className="main-title">{t('appTitle')}</h1>
        </div>
        <div className="title-right">
          <GitHubLink repo={repoUrl} />
        </div>
      </div>
      
      <div className="language-selector-container">
        <LanguageSelector />
      </div>
    </div>
  );
};

export default TitlePanel; 