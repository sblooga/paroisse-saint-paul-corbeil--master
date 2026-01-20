import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <Picker 
      data={data} 
      onEmojiSelect={onEmojiSelect}
      locale="fr"
      theme="light"
      previewPosition="none"
      skinTonePosition="none"
    />
  );
};

export default EmojiPicker;
