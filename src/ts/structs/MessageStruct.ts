import { ChannelTypeName } from "./channelTypes";

export type MessageStruct = {
    guildId:string,
    categoryId:string,
    channelId: string,
    channelType: ChannelTypeName,
    userId:string,
    message:string,
    timestamp:string,
    messageId:string,
}