import { useColors } from '@/hooks/useColors';
import { FC } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol, IconSymbolName } from '../ui/IconSymbol';

type Props = {
  name: IconSymbolName;
  onPress?: () => void;
};

const ActionIconButton: FC<Props> = ({ name, onPress }) => {
  const tColors = useColors();

  return (
    <TouchableOpacity style={styles.icon} onPress={onPress}>
      <IconSymbol name={name} color={tColors.greyIcon} size={18} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {},
});

export default ActionIconButton;
