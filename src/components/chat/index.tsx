import axios, {AxiosRequestConfig, AxiosRequestHeaders} from 'axios';
import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {GiftedChat, IMessage, Send} from 'react-native-gifted-chat';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import * as keys from '../../../keys.json';

function ChatComponent(): JSX.Element {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );

    const BOT_USER = {_id: 2, name: 'Chatbot GPT'};
    const callApi = async (value: string) => {
      const headers: AxiosRequestHeaders = {} as AxiosRequestHeaders;
      headers['Content-Type'] = 'application/json';
      headers['api-key'] = keys.ChatbotKey;
      const config: AxiosRequestConfig = {headers: headers};

      const chatbotUrl = keys.ChatbotUrl;
      axios
        .post(
          `${chatbotUrl}`,
          {
            messages: [
              {
                role: 'user',
                content: value,
              },
            ],
          },
          config,
        )
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
  }, []);

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
          _id: 1,
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
});

export default ChatComponent;
