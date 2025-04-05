import { UserMessageCountStat } from "../entity/UserMessageCountStat";
import { userMessageCountRepository } from "../repositoryStat/userMessageCountRepository";
import { MessageStruct } from "../structs/MessageStruct";
import { MessageObserver } from "./MessageObserver";

export class UserCountMessageObserver implements MessageObserver {

    private repository: userMessageCountRepository;

    constructor() {
        this.repository = new userMessageCountRepository();
    }
    
    execute(message: MessageStruct): void {
        const stat:UserMessageCountStat = this.repository.get( message ) as UserMessageCountStat;
        stat.messageCount++
        this.repository.set( stat )
    }
}