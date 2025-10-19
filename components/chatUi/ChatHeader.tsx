import { useColors } from '@/hooks/useColors';
import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';

type Props = {
  isNewChat?: boolean;
};

const ChatHeader: FC<Props> = ({ isNewChat }) => {
  const tColors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity>
          <IconSymbol
            name="line.horizontal.3.decrease"
            color={tColors.text}
            size={28}
          />
        </TouchableOpacity>
        <Text style={styles.text}>
          ChatGPT<Text style={{ color: tColors.greyIcon }}>{'5 >'}</Text>
        </Text>
      </View>
      {isNewChat ? (
        <TouchableOpacity>
          <IconSymbol name="lock.icloud" color={tColors.text} size={28} />
        </TouchableOpacity>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity>
            <IconSymbol
              name="square.and.pencil"
              color={tColors.text}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <IconSymbol name="ellipsis" color={tColors.text} size={28} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
});
