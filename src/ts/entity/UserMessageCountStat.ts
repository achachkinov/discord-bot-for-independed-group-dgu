import { ChannelTypeName } from "../structs/channelTypes"
import { Stat } from "./Stat"
import { UserStat } from "./UserStat"

export type UserMessageCountStat = {
    ChannelType: ChannelTypeName,
    messageCount:number
} & UserStat