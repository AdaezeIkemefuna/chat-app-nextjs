import { useEffect, useState } from "react";
import { useChannel } from "./AblyReactEffect";
import styles from "./ChatComponent.module.css";

export default function ChatComponent() {
  //VARIABLES
  let inputBox = null;
  let messageEnd = null;
  let name;

  const storedData = JSON.parse(localStorage.getItem("chat-messages"));

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState(
    storedData === null ? [] : storedData
  );
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ably] = useChannel("chat-app", (message) => {
    //COMPUTING STATE FOR HISTORY
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  //SEND MESSAGE
  const sendChatMessage = () => {
    channel.publish({ name, data: messageText });
    setMessageText("");
    inputBox.focus();
  };

  //SUBMIT FORM
  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage();
  };

  //DISPLAY MESSAGES
  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";
    console.log(ably.connection.id);
    return (
      <div
        key={index}
        className={
          author === "me" ? `${styles.mymessage}` : `${styles.message}`
        }
        data-author={author}
      >
        <span className={styles.name}>{message.name}</span>
        <span>{message.data}</span>
      </div>
    );
  });

  //GET NICKNAME AND SCROLL INTO VIEW
  useEffect(() => {
    messageEnd.scrollIntoView({ behaviour: "smooth" });
  });
  useEffect(() => {
    name = localStorage.getItem("username");
    channel.history((err, page) => {
      const historyMessages = Array.from(page.items, (item) => item.data);
      localStorage.setItem("chat-messages", JSON.stringify(receivedMessages));
      console.log(receivedMessages, "received");
    });
  }, [sendChatMessage]);
  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {messages}
        <div
          ref={(element) => {
            messageEnd = element;
          }}
        ></div>{" "}
      </div>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <input
          ref={(element) => {
            inputBox = element;
          }}
          autoFocus
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
      </form>
    </div>
  );
}
