import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = { onSendMessage: (text: string) => void };

const suggestions = [
  {
    id: 1,
    text: 'What is the weather like in Zurich?',
    label: 'Weather in Zurich',
  },
  {
    id: 2,
    text: 'What is the weather like in Belgrade?',
    label: 'Weather in Belgrade',
  },
  {
    id: 3,
    text: 'How to create ChatGPT clone?',
    label: 'How to create ChatGPT clone?',
  },
];

const ChatNullScreen: FC<Props> = ({ onSendMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What can I help you with?</Text>
      <View style={styles.row}>
        {suggestions.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSendMessage(item.text)}
            style={styles.suggestion}
          >
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChatNullScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 16,
    justifyContent: 'center',
  },
  suggestion: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
});
