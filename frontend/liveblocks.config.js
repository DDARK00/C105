// src/liveblocks.config.js
import { createClient } from "@liveblocks/client";




export const liveblocksClient = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
});

// roomId 입력 시 Room 입장
export const enterRoom = (roomId) => liveblocksClient.enterRoom(roomId);

// roomId 입력 시 Room 나가기
export const leaveRoom = (roomId) => liveblocksClient.leaveRoom(roomId);

// 커서 위치를 업데이트하는 함수
export const updateMyPresence = (room, presence) => {
  if (room) {
    room.updatePresence(presence);
  }
};

// 다른 사용자들의 presence 상태를 구독하는 함수
export const subscribeToOthers = (room, callback) => {
  if (room) {
    return room.subscribe("others", callback);
  }
};

export default liveblocksClient;
