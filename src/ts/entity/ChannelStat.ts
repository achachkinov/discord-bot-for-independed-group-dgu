import { ChannelTypeName } from "../structs/channelTypes"
import { Stat } from "./Stat"

export type ChannelStat = {
    channelId:string,
    channelType: ChannelTypeName
    messageCount: number
} & Stat