import Ably from "ably/promises";
import { useEffect } from "react";

const ably = new Ably.Realtime.Promise({
  authUrl: "/api/createTokenRequest",
});

export function useChannel(channelName, callBackMsg) {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg) => {
      callBackMsg(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = () => {
    onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook);

  return [channel, ably];
}
