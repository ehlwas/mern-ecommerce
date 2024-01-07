import { useEffect, useContext, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

import { ItemPropsContext } from "../../context/itemPropsContext";
import { IoMdArrowBack } from "react-icons/io"

const socket = io.connect("https://testagoy.onrender.com");

var selectedChatCompare;

import "./messages.css";
import ScrollableChat from "./ScrollableChat";
import ScrollableFeed from "react-scrollable-feed";

const Messages = () => {
  const { token, decodedToken } = useContext(ItemPropsContext);

  const [chats, setChats] = useState();
  const [messages, setMessages] = useState();
  const [searchChats, setSearchChats] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [messageValue, setMessageValue] = useState('')

  const getSender = (users) => {
    const name = users[0]?._id === decodedToken.userId ? users[1] : users[0]
    return `${name.firstName} ${name.lastName}`;
  };

  const selectChatFunction = async (data) => {
    await setSelectedChat(data)
  }

  const selectChatFromSearch = async (userId) => {
    const config = {
      headers: {
        'x-access-token': token
      }
    }

    const { data } = await axios.post(`/api/chat`, { userId }, config);

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    await setSelectedChat(data);
    socket.emit("new chat", {...data, sender: decodedToken.userId})
    setSearchChats()
    setSearchValue('')
  }

  const fetchMessages = async () => {
    const config = {
      headers: {
        'x-access-token': token
      }
    }

    await axios.get(`/api/message/${selectedChat._id}`, config)
    .then(response => {
      setMessages(response.data)
    }).catch(err => console.log(err))
  }

  const searchChatsFunction = async (e) => {
    if (e.key !== "Enter" || e === "Enter")
     return

    if (!searchValue) {
      setSearchChats()
      return
    }

    const config = {
      headers: {
        'x-access-token': token
      }
    }

    await axios.get(`/api/user/find?search=${searchValue}`, config)
    .then(response => {
      setSearchChats(response.data)
    })
  }

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e === "send") && messageValue) {
      const config = {
        headers: {
          'x-access-token': token
        }
      }

      const data ={
        content: messageValue,
        chatId: selectedChat._id
      }
    
      await axios.post('/api/message', data, config)
      .then(response => {
        setMessages([...messages, response.data]);
        socket.emit("new message", response.data);
        setChats(prev => {
          const newChats = prev.map(item => {
            if (item._id === selectedChat._id) {
              return {
                ...item,
                updatedAt: response.data.updatedAt,
                latestMessage: {
                  ...item.latestMessage,
                  content: messageValue,
                  sender: {
                    ...response.data.sender
                  }
                }
              }
            } else {
              return item
            }
          })
          newChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          return newChats
        })
        setMessageValue('')
      }).catch(err => console.log(err))
    }
  }

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          'x-access-token': token
        }
      }

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log(error)
    }
  };

  const convertDateTimeToString = (item) => {
    const dateTime = new Date(item)
    const options = { hour: 'numeric', minute: 'numeric' };
    // return dateTime.toLocaleTimeString(undefined, options);
    return dateTime.toLocaleDateString()
  }

  const updateChat = (data) => {
    // if (!chats.find((c) => c._id === data._id))
    setChats(prev => {
      let newChats = prev.map(item => {
        if (item._id === data.chat._id) {
          return {
            ...item,
            updatedAt: data.updatedAt,
            latestMessage: data
          }
        } else {
          return item
        }
      })
      newChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return newChats
    });
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages()
      socket.emit("join chat", selectedChat._id);
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat])

  useEffect(() => {
    if (decodedToken) {
      fetchChats()
      socket.emit("setup", decodedToken);
    }
  }, [decodedToken]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
          // setNotification([newMessageRecieved, ...notification]);
          // setFetchAgain(!fetchAgain);
        // }
        console.log('notification here')
      } else {
        setMessages(prev => [...prev, newMessageRecieved]);
      }
      updateChat(newMessageRecieved)
    });
  }, []);

  useEffect(() => {
    socket.on("chat recieved", (newChatReceived) => {
      console.log(newChatReceived)
      setChats(prev => [newChatReceived, ...prev])
    })
  }, [])

  // useEffect(() => {
  //   socket.on("message recieved", (newMessageRecieved) => {
  //     console.log(newMessageRecieved);
  //   });
  // }, []);
  return (
    // <>
    //   <main className="content content-message py-3">
    //     <div className="container p-0">
    //       {/* <h1 className="h3 mb-3">Messages</h1> */}

    //       <div className="card rounded-0 shadow">
    //         <div className="row g-0">
    //           <div className={`col-12 col-lg-5 col-xl-3 border-right ${selectedChat ? 'display-off' : ''}`}>
    //             <div className="px-4 position-relative border-bottom">
    //               <div className="d-flex align-items-center">
    //                 <div className="flex-grow-0 w-100">
    //                   <div className="input-group align-items-center">
    //                     <input
    //                       type="text"
    //                       className="form-control input-gold my-3"
    //                       value={searchValue}
    //                       placeholder="Search..."
    //                       onChange={e => setSearchValue(e.target.value)}
    //                       onKeyDown={e => searchChatsFunction(e)}
    //                     />
    //                     <button className="btn-gold search-btn" onClick={() => searchChatsFunction('Enter')}>Search</button>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="chat-holder">
    //             {searchChats ? (
    //               searchChats ? (
    //                   searchChats.map(item => {
    //                     return (
    //                       <div key={item._id} className="list-group-item mont-regular text-gold list-group-item-action border-0 mb-2 chat-list" onClick={() => selectChatFromSearch(item._id)}>
    //                         {/* <div className="badge bg-success float-right">5</div> */}
    //                         <div className="d-flex align-items-start">
    //                           {/* <img
    //                             src="https://bootdey.com/img/Content/avatar/avatar5.png"
    //                             className="rounded-circle mr-1"
    //                             alt="Vanessa Tucker"
    //                             width="40"
    //                             height="40"
    //                           /> */}
    //                           <div className="flex-grow-1 ml-3">
    //                             {item.firstName} {item.lastName}
    //                             <div className="small">
    //                               <span className="fas fa-circle chat-online"></span>{" "}
    //                               {/* Online */}
    //                             </div>
    //                           </div>
    //                         </div>
    //                       </div>
    //                     )
    //                   })
    //                 ) : (
    //                   <h2>No Result.</h2>
    //                 )
    //               ) : (
    //                 chats &&
    //                   chats.map(item => {
    //                     return (
    //                       <div key={item._id} className={`list-group-item mont-regular list-group-item-action border-bottom ${selectedChat && item._id === selectedChat._id ? 'bg-gold' : 'chat-list'}`} onClick={() => selectChatFunction(item)}>
    //                         {/* <div className="badge bg-success float-right">5</div> */}
    //                         <div className="d-flex align-items-start">
    //                           {/* <img
    //                             src="https://bootdey.com/img/Content/avatar/avatar5.png"
    //                             className="rounded-circle mr-1"
    //                             alt="Vanessa Tucker"
    //                             width="40"
    //                             height="40"
    //                           /> */}
    //                           <div className={`flex-grow-1 ml-3 mont-bold ${selectedChat && item._id === selectedChat._id ? 'text-white' : 'text-gold'}`}>
    //                             {getSender(item.users)}
    //                             <div className={`small mont-regular ${selectedChat && item._id === selectedChat._id ? 'text-white' : 'text-lblue'}`}>
    //                               <span className="fas fa-circle chat-online"></span>{" "}
    //                               {item.latestMessage ? 
    //                                 `${item.latestMessage.sender._id === decodedToken.userId ? 'You' : `${item.latestMessage.sender.firstName}`}: ${item.latestMessage.content.length > 20 ? `${item.latestMessage.content.substring(0,20)}...` : item.latestMessage.content}`
    //                                 : 'Send a message to connect.'}
    //                             </div>
    //                           </div>
    //                         </div>
    //                       </div>
    //                     )
    //                   })
    //               )
    //             }
    //             </div>
    //             <hr className="d-block d-lg-none mt-1 mb-0" />
    //           </div>
    //           {selectedChat &&
    //             <div className={`col-12 col-lg-7 col-xl-9 ${selectedChat ? '' : 'display-off'}`}>
    //               <div className="py-2 px-4 border-bottom">
    //                 <div className="d-flex align-items-center py-1">
    //                   <div className="position-relative">
    //                     {/* <img
    //                       src="https://bootdey.com/img/Content/avatar/avatar3.png"
    //                       className="rounded-circle mr-1"
    //                       alt="Sharon Lessman"
    //                       width="40"
    //                       height="40"
    //                     /> */}
    //                   </div>
    //                   <div className="flex-grow-1">
    //                     <button className="btn-gold btn-back py-1 mr-3" onClick={() => setSelectedChat()}><IoMdArrowBack /></button>
    //                     <strong className="mont-bold text-gold">{selectedChat && getSender(selectedChat.users)}</strong>
    //                     <div className="text-muted small">
    //                       {/* <em>Typing...</em> */}
    //                     </div>
    //                   </div>
    //                   <div>
    //                     {/* <button className="btn btn-primary btn-lg mr-1 px-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-phone feather-lg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></button>
    //                     <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-video feather-lg"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></button>
    //                     <button className="btn btn-light border btn-lg px-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-horizontal feather-lg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button> */}
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="position-relative message-container">
    //                 {/* <div className="chat-messages p-4"> */}
    //                   {messages && <ScrollableChat messages={messages} decodedToken={decodedToken} />}
    //                 {/* </div> */}
    //               </div>

    //               <div className="flex-grow-0 py-3 px-4 border-top">
    //                 <div className="input-group">
    //                   <input
    //                     type="text"
    //                     className="form-control input-gold"
    //                     value={messageValue}
    //                     placeholder="Type your message"
    //                     onChange={e => setMessageValue(e.target.value)}
    //                     onKeyDown={e => sendMessage(e)}
    //                   />
    //                   <button className="btn-gold" onClick={() => sendMessage('send')}>Send</button>
    //                 </div>
    //               </div>
    //             </div>}
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    //   {/* <button onClick={() => sendMessage()}>send message</button>
    //         <input type='text' value={chat} onChange={e => setChat(e.target.value)} /> */}
    // </>
    <>
      <iframe src="https://app.chatsimple.ai/iframe23/f1048931-2cf0-4973-97f6-355fa7b46a27/11c740de-d1fc-4b63-9cc1-0af10ef49f59/5bdbf9fb-8c53-4321-bbae-fa2325b7d667" height="400" width="800" title="Chatsimple" style="display:block;margin-left:auto;margin-right:auto;border:none;border-radius:20px;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);"></iframe>
    </>
  );
};

export default Messages;
