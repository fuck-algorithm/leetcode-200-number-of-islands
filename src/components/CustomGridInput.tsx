import React from 'react';

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
  return (
    <div className="control-group custom-grid-container">
      <label className="custom-grid-label">
        自定义网格(1表示陆地，0表示水):
        <textarea
          className="custom-grid-input"
          rows={5}
          placeholder="例如:
10010
11000
00100
00011"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      <button onClick={onSubmit}>应用自定义网格</button>
    </div>
  );
};

export default CustomGridInput; 