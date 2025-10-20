import AnimatedLoading from '@/components/chatUi/AnimatedLoading';
import ChatBubble from '@/components/chatUi/ChatBubble';
import ChatHeader from '@/components/chatUi/ChatHeader';
import ChatNullScreen from '@/components/chatUi/ChatNullScreen';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColors } from '@/hooks/useColors';
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIDataTypes, UIMessage, UITools } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useRef, useState } from 'react';
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = UIMessage<unknown, UIDataTypes, UITools>;

const keyExtractor = (item: Message) => item.id;
const BOTTOM_THRESHOLD = 20;

export default function App() {
  const [input, setInput] = useState('');
  const [isScrollable, setIsScrollable] = useState(true);
  const [lastUserMsgHeight, setLastUserMsgHeight] = useState(0);
  const [extraFooterSpace, setExtraFooterSpace] = useState(0);
  const [flatListHeight, setFlatListHeight] = useState(0);
  // Controls display options: 
  // true - autoscroll on new message
  // false - or put new user message at the top of the screen
  const [isAutoScroll, setIsAutoScroll] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const tColors = useColors();

  const { messages, error, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  useEffect(() => {
    if (!isAutoScroll) {
      const lastIndex = messages.length - 1;
      const lastMessage = messages[lastIndex];
      if (lastMessage?.role === 'user') {
        setExtraFooterSpace(flatListHeight - lastUserMsgHeight);

        flatListRef.current?.scrollToIndex({
          index: lastIndex,
          viewPosition: 0,
          animated: true,
        });
      }
    }
  }, [messages, flatListHeight, lastUserMsgHeight, isAutoScroll]);

  const showMic = !input.trim();
  const isLoadingAnswer = status === 'submitted';
  const isStreaming = status === 'streaming';
  const isWaitingForResponse = isLoadingAnswer || isStreaming;

  const onMessageSend = () => {
    if (showMic) {
      // Record message
    } else {
      Keyboard.dismiss();
      sendMessage({ text: input.trim() });
      setInput('');
      setIsScrollable(true);
    }
  };

  const sendSuggestion = (message: string) => {
    sendMessage({ text: message.trim() });
    Keyboard.dismiss();
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
    setIsScrollable(distanceFromBottom < BOTTOM_THRESHOLD);

    const messageContentHeigth =
      contentSize.height - extraFooterSpace - BOTTOM_THRESHOLD;
    // if we scroll past the footer hide it
    if (
      messageContentHeigth > contentOffset.y + layoutMeasurement.height &&
      !isWaitingForResponse
    ) {
      setExtraFooterSpace(0);
    }
  };

  const onContentSizeChange = () => {
    if (isScrollable && isAutoScroll) {
      InteractionManager.runAfterInteractions(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  const getSendIcon = () => {
    if (isWaitingForResponse) return 'stop.fill';
    return showMic ? 'waveform' : 'arrow.up';
  };

  const renderMessages: ListRenderItem<Message> = ({ item, index }) => (
    <ChatBubble
      key={item.id}
      id={item.id}
      parts={item.parts}
      role={item.role}
      onLayout={event => {
        if (
          item.role === 'user' &&
          index === messages.findLastIndex(msg => msg.role === 'user')
        ) {
          const height = event.nativeEvent.layout.height ?? 0;
          setLastUserMsgHeight(height);
        }
      }}
    />
  );

  const FooterComponent = () => (
    <>
      {isLoadingAnswer ? <AnimatedLoading /> : null}
      {error && <Text>{error.message}</Text>}
      <View style={{ paddingBottom: extraFooterSpace }} />
    </>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tColors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ChatHeader isNewChat={!messages.length} />
        <View style={styles.flex}>
          {!!messages.length ? (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessages}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              onContentSizeChange={onContentSizeChange}
              ListFooterComponent={FooterComponent}
              onLayout={e => setFlatListHeight(e.nativeEvent.layout.height)}
              onScrollToIndexFailed={info => {
                flatListRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: true,
                });
              }}
            />
          ) : (
            <ChatNullScreen onSendMessage={sendSuggestion} />
          )}
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onAddFiles}
            style={[styles.icon, { backgroundColor: tColors.greyBackground }]}
            disabled={isWaitingForResponse}
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
              onPress={isWaitingForResponse ? stop : onMessageSend}
              style={[styles.icon, { backgroundColor: tColors.text }]}
            >
              <IconSymbol name={getSendIcon()} color={tColors.background} />
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
