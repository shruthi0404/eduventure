import { useState } from 'react';

interface AvatarOption {
  id: string;
  url: string;
}

interface AvatarSelectorProps {
  options: AvatarOption[];
  selectedAvatarUrl: string;
  onSelect: (url: string) => void;
}

const AvatarSelector = ({ options, selectedAvatarUrl, onSelect }: AvatarSelectorProps) => {
  const [selectedId, setSelectedId] = useState<string>(
    options.find(option => option.url === selectedAvatarUrl)?.id || options[0].id
  );

  const handleSelect = (id: string, url: string) => {
    setSelectedId(id);
    onSelect(url);
  };

  return (
    <div className="avatar-selection grid grid-cols-3 gap-4">
      {options.map((option) => (
        <img
          key={option.id}
          src={option.url}
          alt={`Avatar ${option.id}`}
          className={`w-full aspect-square rounded-full object-cover border-4 ${
            selectedId === option.id ? 'border-primary' : 'border-transparent'
          }`}
          onClick={() => handleSelect(option.id, option.url)}
        />
      ))}
    </div>
  );
};

export default AvatarSelector;
