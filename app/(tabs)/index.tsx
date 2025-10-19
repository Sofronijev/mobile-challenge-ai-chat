import { IconSymbol } from '@/components/ui/IconSymbol';
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
  TouchableOpacity,
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

  const showMic = !input;

  const onMessageSend = () => {
    if (showMic) {
      // Record message
    } else {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const onAddFiles = () => {
    // Add files to chat...
  };

  const onOpenMic = () => {
    // Allow voice input
  };

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
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onAddFiles}
            style={[styles.icon, { backgroundColor: tColors.greyBackground }]}
          >
            <IconSymbol name="plus" color={tColors.text} />
          </TouchableOpacity>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: tColors.greyBackground },
            ]}
          >
            <TextInput
              style={[styles.inputText, { color: tColors.text }]}
              placeholder="Ask anything"
              multiline
              value={input}
              onChangeText={setInput}
              autoFocus={true}
              placeholderTextColor={tColors.placeholder}
            />
            {showMic && (
              <TouchableOpacity onPress={onOpenMic} style={[styles.icon]}>
                <IconSymbol name="mic" color={tColors.greyIcon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onMessageSend}
              style={[styles.icon, { backgroundColor: tColors.text }]}
            >
              <IconSymbol
                name={showMic ? 'speaker.wave.1' : 'arrow.up'}
                color={tColors.background}
              />
            </TouchableOpacity>
          </View>
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
  msgText: {
    fontWeight: 700,
    fontSize: 25,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  inputContainer: {
    flex: 1,
    marginTop: 8,
    flexDirection: 'row',
    borderRadius: 24,
    overflow: 'hidden',
  },
  inputText: {
    padding: 12,
    flex: 1,
    fontSize: 16,
  },
  icon: {
    margin: 8,
    padding: 4,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
});
