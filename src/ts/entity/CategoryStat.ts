import { ChannelTypeName } from "../structs/channelTypes"
import { Stat } from "./Stat"

export type CategoryStat = {
    categoryId:string,
    channelType: ChannelTypeName
    messageCount: number
} & Stat