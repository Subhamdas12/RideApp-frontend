// utils/socket.ts
import config from "@/config/config";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type SubscriptionConfig = {
  topic: string;
  callback: (msg: string) => void;
};

type SocketOptions = {
  subscriptions: SubscriptionConfig[];
};

let stompClient: Client | null = null;

const connectSocket = ({ subscriptions }: SocketOptions): Client => {
  const socket = new SockJS(config.NEXT_APP_BACKEND_URL + "/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log("[WebSocket]", str),

    onConnect: () => {
      console.log("Connected to WebSocket");

      subscriptions.forEach(({ topic, callback }) => {
        stompClient?.subscribe(topic, (message: IMessage) => {
          console.log(`[WebSocket] Message from ${topic}:`, message.body);
          callback(message.body);
        });
      });
    },

    reconnectDelay: 5000,
  });

  stompClient.activate();

  return stompClient;
};

export const sendDriverLocation = (
  userId: number,
  latitude: number,
  longitude: number
) => {
  if (stompClient && stompClient.connected) {
    const body = JSON.stringify({
      userId,
      coordinates: [longitude, latitude],
    });

    stompClient.publish({
      destination: "/app/driver/location",
      body,
    });
  } else {
    console.warn("WebSocket not connected. Cannot send location.");
  }
};

export default connectSocket;
