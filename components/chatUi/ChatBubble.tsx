import { useColors } from '@/hooks/useColors';
import { UIMessage } from 'ai';
import * as Clipboard from 'expo-clipboard';
import React, { FC } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import ActionIconButton from './ActionIconButton';

type Props = {
  id: string;
  role: UIMessage['role'];
  parts: UIMessage['parts'];
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
};

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
};

const ChatBubble: FC<Props> = ({ role, parts, id, onLayout }) => {
  const tColors = useColors();
  const isUser = role === 'user';

  return (
    <>
      {parts.map((part, i) => {
        const isTextMessage = part.type === 'text';
        const isWeatherData = part.type === 'tool-weather';
        const validMessage = isTextMessage || isWeatherData;
        const messageData = isTextMessage
          ? part.text
          : JSON.stringify(part, null, 2);

        return (
          <View key={`${id}-${i}`} onLayout={onLayout}>
            {isTextMessage && (
              <Text
                style={[
                  styles.message,
                  {
                    color: tColors.text,
                    backgroundColor: isUser
                      ? tColors.greyBackground
                      : 'transparent',
                  },

                  isUser && styles.messageUser,
                ]}
              >
                {messageData}
              </Text>
            )}
            {isWeatherData && (
              <Text style={[styles.message, { color: tColors.text }]}>
                {messageData}
              </Text>
            )}
            {!isUser && validMessage && (
              <View style={styles.actionButtons}>
                <ActionIconButton
                  name="doc.on.doc"
                  onPress={() => copyToClipboard(messageData)}
                />
                <ActionIconButton name="speaker.2" />
                <ActionIconButton name="hand.thumbsup" />
                <ActionIconButton name="hand.thumbsdown" />
                <ActionIconButton name="arrow.2.circlepath" />
                <ActionIconButton name="tray.and.arrow.up" />
              </View>
            )}
          </View>
        );
      })}
    </>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  message: {
    marginVertical: 8,
    fontSize: 16,
  },
  messageUser: {
    padding: 12,
    alignSelf: 'flex-end',
    borderRadius: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
  },
});
