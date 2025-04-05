import { Stat } from "../entity/Stat";
import { UserMessageCountStat } from "../entity/UserMessageCountStat";
import { MessageStruct } from "../structs/MessageStruct";
import { repositoryStat } from "./repositoryStat";

//todo: create database

export class userMessageCountRepository implements repositoryStat {

    private arrayStat: UserMessageCountStat[] = [];

    get(message: MessageStruct): Stat {
        for (const stat of this.arrayStat) {
            if (message.guildId === stat.guildId && message.userId === stat.userId) {
                return stat;
            }
        }

        const newStat: UserMessageCountStat = {
            guildId: message.guildId,
            userId: message.userId,
            messageCount: 0,
        };
        this.arrayStat.push(newStat);
        return newStat;
    }

    set(stat: UserMessageCountStat): void {
        const index = this.arrayStat.findIndex(s => s.guildId === stat.guildId && s.userId === stat.userId);

        if (index !== -1) {
            this.arrayStat[index] = stat;
        } else {
            this.arrayStat.push(stat);
        }
    }
}