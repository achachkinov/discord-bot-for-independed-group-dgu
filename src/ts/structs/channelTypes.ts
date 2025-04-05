export interface ChannelTypeProperties {
    pointsForCreateMessage: number;
    isSingle: boolean;
  }
  
  export type ChannelTypeName =
    | "none"
    | "project"
    | "memes"
    | "forum"
    | "botChat"
    | "entertaimentBotChat"
    | "deleteMessageLog";
  
  export const ChannelTypeMap: Record<ChannelTypeName, ChannelTypeProperties> = {
    none: {
      pointsForCreateMessage: 1,
      isSingle: false,
    },
    project: {
      pointsForCreateMessage: 2,
      isSingle: false,
    },
    memes: {
      pointsForCreateMessage: 5,
      isSingle: false,
    },
    forum: {
      pointsForCreateMessage: 20,
      isSingle: false,
    },
    botChat: {
      pointsForCreateMessage: 0,
      isSingle: true,
    },
    entertaimentBotChat: {
      pointsForCreateMessage: 0,
      isSingle: true,
    },
    deleteMessageLog: {
      pointsForCreateMessage: 0,
      isSingle: true,
    },
  };