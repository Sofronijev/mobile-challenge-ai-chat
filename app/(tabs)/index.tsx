import AnimatedLoading from '@/components/chatUi/AnimatedLoading';
import ChatBubble from '@/components/chatUi/ChatBubble';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColors } from '@/hooks/useColors';
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIDataTypes, UIMessage, UITools } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useRef, useState } from 'react';
import {
  FlatList,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = UIMessage<unknown, UIDataTypes, UITools>;

const keyExtractor = (item: Message) => item.id;
const BOTTOM_THRESHOLD = 20;

export default function App() {
  const [input, setInput] = useState('');
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const { messages, error, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });
  const flatListRef = useRef<FlatList>(null);

  const tColors = useColors();

  if (error) return <Text>{error.message}</Text>;

  const showMic = !input;
  const isLoadingAnswer = status === 'submitted';

  const onMessageSend = () => {
    if (showMic) {
      // Record message
    } else {
      Keyboard.dismiss();
      sendMessage({ text: input.trim() });
      setInput('');
    }
  };

  const onAddFiles = () => {
    // Add files to chat...
  };

  const onOpenMic = () => {
    // Allow voice input
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);
    setIsUserAtBottom(distanceFromBottom < BOTTOM_THRESHOLD);
  };

  const scrollToBottom = () => {
    if (isUserAtBottom) {
      InteractionManager.runAfterInteractions(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  const renderMessages: ListRenderItem<Message> = ({ item }) => (
    <ChatBubble
      key={item.id}
      id={item.id}
      parts={item.parts}
      role={item.role}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tColors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.flex}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessages}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onContentSizeChange={scrollToBottom}
            ListFooterComponent={isLoadingAnswer ? <AnimatedLoading /> : null}
          />
        </View>
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
                name={showMic ? 'waveform' : 'arrow.up'}
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
