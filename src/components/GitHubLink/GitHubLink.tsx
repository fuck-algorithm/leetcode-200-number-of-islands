import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import logoGithub from '@iconify/icons-carbon/logo-github';
import './GitHubLink.css';

interface GitHubLinkProps {
  repo: string;
}

const GitHubLink: React.FC<GitHubLinkProps> = ({ repo }) => {
  const { t } = useTranslation();
  
  return (
    <a href={`https://github.com/${repo}`} 
       target="_blank" 
       rel="noopener noreferrer" 
       className="github-link"
       aria-label={t('common.viewOnGitHub')}
    >
      <Icon icon={logoGithub} width="20" height="20" className="github-icon" />
      <span>{t('common.viewOnGitHub')}</span>
    </a>
  );
};

export default GitHubLink; 