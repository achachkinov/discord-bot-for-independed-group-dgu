import { ChannelTypeName } from "../structs/channelTypes"
import { Stat } from "./Stat"
import { UserStat } from "./UserStat"

export type UserCategoryMessageCountStat = {
    channelId: string,
    channelType: ChannelTypeName,
    messageCount:number
} & UserStat