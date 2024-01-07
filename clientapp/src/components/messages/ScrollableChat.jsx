import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ messages, decodedToken }) => {
  return (
    <ScrollableFeed forceScroll={true}>
      {messages.map((item) => {
        return item.sender._id === decodedToken.userId ? (
          <div className="chat-message-right mb-4" key={item._id}>
            {/* <div>
              <img
              src="https://bootdey.com/img/Content/avatar/avatar1.png"
              className="rounded-circle mr-1"
              alt="Chris Wood"
              width="40"
              height="40"
              />
              <div className="text-muted small text-nowrap mt-2">
              {convertDateTimeToString(item.createdAt)}
              </div>
            </div> */}
            <div className="flex-shrink-1 rounded py-2 px-3 mr-3 mont-regular bg-gold">
              <div className="mont-bold mb-1">You</div>
              {item.content}
            </div>
          </div>
        ) : (
          <div className="chat-message-left pb-4" key={item._id}>
            {/* <div>
              <img
                src="https://bootdey.com/img/Content/avatar/avatar3.png"
                className="rounded-circle mr-1"
                alt="Sharon Lessman"
                width="40"
                height="40"
              />
              <div className="text-muted small text-nowrap mt-2">
                {convertDateTimeToString(item.createdAt)}
              </div>
            </div> */}
            <div className="flex-shrink-1 bg-light rounded mont-regular py-2 px-3 ml-3">
              <div className="mont-bold mb-1">
                {item.sender.firstName}
              </div>
              {item.content}
            </div>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
