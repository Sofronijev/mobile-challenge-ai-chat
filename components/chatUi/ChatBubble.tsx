import { useColors } from '@/hooks/useColors';
import { UIMessage } from 'ai';
import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  id: string;
  role: UIMessage['role'];
  parts: UIMessage['parts'];
};

const ChatBubble: FC<Props> = ({ role, parts, id }) => {
  const tColors = useColors();
  const isUser = role === 'user';
  return (
    <>
      {parts.map((part, i) => {
        switch (part.type) {
          case 'text':
            return (
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
                key={`${id}-${i}`}
              >
                {part.text}
              </Text>
            );
          case 'tool-weather':
            return (
              <Text
                key={`${id}-${i}`}
                style={[styles.message, { color: tColors.text }]}
              >
                {JSON.stringify(part, null, 2)}
              </Text>
            );
        }
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
});
