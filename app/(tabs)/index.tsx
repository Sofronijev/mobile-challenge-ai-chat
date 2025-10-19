import { Colors } from '@/constants/Colors';
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [input, setInput] = useState('');
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });
  const colorScheme = useColorScheme() ?? 'light';
  const tColors = Colors[colorScheme];

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tColors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.flex}>
          {messages.map(m => (
            <View key={m.id} style={styles.msgContainer}>
              <View>
                <Text style={[styles.msgText, { color: tColors.text }]}>
                  {m.role}
                </Text>
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Text
                          style={{ color: tColors.text }}
                          key={`${m.id}-${i}`}
                        >
                          {part.text}
                        </Text>
                      );
                    case 'tool-weather':
                      return (
                        <Text
                          key={`${m.id}-${i}`}
                          style={{ color: tColors.text }}
                        >
                          {JSON.stringify(part, null, 2)}
                        </Text>
                      );
                  }
                })}
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.inputText,
              { color: tColors.text, backgroundColor: tColors.greyBackground },
            ]}
            placeholder="Say something..."
            multiline
            value={input}
            onChangeText={setInput}
            onSubmitEditing={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
            autoFocus={true}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  flex: { flex: 1 },
  msgContainer: { marginVertical: 8 },
  msgText: { fontWeight: 700 },
  inputContainer: { marginTop: 8 },
  inputText: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 24,
  },
});
