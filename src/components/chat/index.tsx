import React, {useCallback, useEffect, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';

function ChatComponent(): JSX.Element {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Test',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Admin',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((_messages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, _messages),
    );
  }, []);

  return (
    <View style={[{flex: 1}]}>
      <GiftedChat
        messages={messages}
        onSend={(_messages: IMessage[]) => onSend(_messages)}
        user={{
          _id: 1,
        }}
        forceGetKeyboardHeight
      />
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} />
    </View>
  );
}

export default ChatComponent;
