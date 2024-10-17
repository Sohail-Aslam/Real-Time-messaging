/* eslint-disable */
import { useEffect, useState, useRef } from "react";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "./config/Firebase.js";
import ReactQuill, { displayName } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "./config/Firebase.js";
import SearchUser from "./components/Search.jsx";
import { RiSendPlaneFill } from "react-icons/ri";

function Chat({ selectedUser, fetchUsers }) {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [userList, setUserList] = useState([]);
  const messagesEndRef = useRef(null);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["code-block"],
    ["link", "image", "video"],
    [{ list: "bullet" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    const chatId = getChatId(auth.currentUser.uid, selectedUser.userUid);
    const messagesRef = collection(db, "chats", chatId, "messages");

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      
      loadedMessages.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });

      setMessages(loadedMessages); 
    });

    return () => unsubscribe();
  }, [selectedUser]);

  useEffect(() => {
    
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (value.trim() === "") return;

    const chatId = getChatId(auth.currentUser.uid, selectedUser.userUid);
    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      senderId: auth.currentUser.uid,
      text: value,
      timestamp: serverTimestamp(),
    });

    setValue("");
  };

  const getChatId = (user1Id, user2Id) => {
    return user1Id > user2Id
      ? `${user1Id}_${user2Id}`
      : `${user2Id}_${user1Id}`;
  };

  const handleKey = (e) => {
    if (e.code === "Enter") handleSendMessage();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "user");
      const data = await getDocs(usersRef);
      const users = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserList(users);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <div className="chat-header">
        <h4 style={{ marginBottom: "0" }} className="chsrt">
          Chat with {selectedUser?.userName || "Unknown User"}
        </h4>
      </div>

      <div className="chat">
        <div className="messages">
          {messages.map((message, index) => {
            const user = userList.find((user) => user.id === message.senderId);

            return (
              <div
                key={index}
                className={
                  message.senderId === auth.currentUser.uid
                    ? "sent"
                    : "received"
                }
              >
                <div dangerouslySetInnerHTML={{ __html: message.text }} />
                <span className="timestamp">
                  {message.timestamp
                    ? new Date(
                        message.timestamp.seconds * 1000
                      ).toLocaleString()
                    : ""}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="quill-container">
          <ReactQuill
            modules={modules}
            className="quill"
            value={value}
            onChange={setValue}
            onKeyDown={handleKey}
            theme="snow"
            style={{ height: "150px", marginBottom: "50px" }}
          />
          <button className="quill-classname" onClick={handleSendMessage}>
            <RiSendPlaneFill />
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
