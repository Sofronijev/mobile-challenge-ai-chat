import { useColors } from '@/hooks/useColors';
import { UIMessage } from 'ai';
import * as Clipboard from 'expo-clipboard';
import React, { FC } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import ActionIconButton from './ActionIconButton';
import WeatherData from './WeatherData';

type Props = {
  id: string;
  role: UIMessage['role'];
  parts: UIMessage['parts'];
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  onRefresh: () => Promise<void>;
};

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
};

const ChatBubble: FC<Props> = ({ role, parts, id, onLayout, onRefresh }) => {
  const tColors = useColors();
  const isUser = role === 'user';

  return (
    <>
      {parts.map((part, i) => {
        const isTextMessage = part.type === 'text';
        const isWeatherData = part.type === 'tool-weather';
        const validMessage = isTextMessage || isWeatherData;

        return (
          <View key={`${id}-${i}`} onLayout={onLayout} style={styles.container}>
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
                {part.text}
              </Text>
            )}
            {isWeatherData && (
              <WeatherData
                data={part.output as { location: string; temperature: number }}
              />
            )}
            {!isUser && validMessage && (
              <View style={styles.actionButtons}>
                <ActionIconButton
                  name="doc.on.doc"
                  onPress={() =>
                    copyToClipboard(
                      isTextMessage ? part.text : JSON.stringify(part)
                    )
                  }
                />
                <ActionIconButton name="speaker.2" />
                <ActionIconButton name="hand.thumbsup" />
                <ActionIconButton name="hand.thumbsdown" />
                <ActionIconButton
                  name="arrow.2.circlepath"
                  onPress={onRefresh}
                />
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
    fontSize: 16,
  },
  container: {
    marginVertical: 8,
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
