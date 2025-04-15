import React from 'react';
import { useTranslation } from 'react-i18next';
import './CustomGridInput.css';

interface CustomGridInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const CustomGridInput: React.FC<CustomGridInputProps> = ({
  value,
  onChange,
  onSubmit
}) => {
  const { t } = useTranslation();

  return (
    <div className="control-group custom-grid-container">
      <label className="custom-grid-label">
        {t('controls.customGrid')}
        <textarea
          className="custom-grid-input"
          rows={5}
          placeholder={t('controls.customGridPlaceholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      <button onClick={onSubmit}>{t('controls.submit')}</button>
    </div>
  );
};

export default CustomGridInput; 