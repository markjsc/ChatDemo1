import axios, {AxiosRequestConfig, AxiosRequestHeaders} from 'axios';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {GiftedChat, IMessage, Send} from 'react-native-gifted-chat';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import * as keys from '../../../keys.json';

function ChatbotAvatar(): JSX.Element {
  return (
    <Image source={require('./chatbot.png')} style={[styles.chatbotAvatar]} />
  );
}

function ChatComponent(): JSX.Element {
  const MAX_TOKENS = 2048;
  const USER_ID = 1;
  const BOT_USER_ID = 2;

  const BOT_USER = useMemo(
    () => ({
      _id: BOT_USER_ID,
      name: 'Chatbot GPT',
      avatar: ChatbotAvatar,
    }),
    [],
  );

  const initialMessages: IMessage[] = [
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'Ask me anything',
      createdAt: new Date(),
      user: BOT_USER,
    },
  ];

  const [messages, setMessages] = useState<IMessage[]>(initialMessages);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages),
      );
      const callApi = async (value: string) => {
        const headers: AxiosRequestHeaders = {} as AxiosRequestHeaders;
        headers['Content-Type'] = 'application/json';
        headers['api-key'] = keys.ChatbotKey;
        const config: AxiosRequestConfig = {headers: headers};

        const messagesToSend = [
          ...messages.map(m => ({
            role: m.user._id === USER_ID ? 'user' : 'system',
            content: m.text,
          })),
          {
            role: 'user',
            content: value,
          },
        ];

        const request = {
          messages: messagesToSend,
          max_tokens: MAX_TOKENS,
        };

        console.debug('Request', request);

        const chatbotUrl = keys.ChatbotUrl;
        axios
          .post(`${chatbotUrl}`, request, config)
          .then(response => {
            console.debug('Response', response.data);
            const botMessage: IMessage = {
              _id: Math.round(Math.random() * 1000000),
              text: response.data.choices[0].message.content,
              createdAt: new Date(),
              user: BOT_USER,
            };
            setMessages(previousMessages =>
              GiftedChat.append(previousMessages, [botMessage]),
            );
          })
          .catch(error => {
            console.error(error);
          });
      };

      const value = newMessages[0].text;
      callApi(value);
    },
    [BOT_USER, messages],
  );

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <View style={[styles.header]}>
        <Text style={[styles.headerText]}>This is a demo Chat GPT</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(_messages: IMessage[]) => onSend(_messages)}
        user={{
          _id: USER_ID,
        }}
        showUserAvatar
        alwaysShowSend
        renderSend={props => (
          <Send {...props}>
            <View style={[styles.sendButton]}>
              <Text style={[styles.sendButtonText]}>Send</Text>
            </View>
          </Send>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 10,
    borderBottomColor: '#999999',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#5BC0EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: 40,
    width: 40,
    marginRight: 4,
    marginBottom: 2,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  chatbotAvatar: {
    height: 40,
    width: 40,
  },
});

export default ChatComponent;
