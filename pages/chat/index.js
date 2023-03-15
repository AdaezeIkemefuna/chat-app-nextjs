import dynamic from "next/dynamic";

const ChatComponent = dynamic(() => import("../../components/ChatComponent"), {
  ssr: false,
});

import React from "react";

export default function Chat() {
  return (
    <div>
      <ChatComponent />
    </div>
  );
}
