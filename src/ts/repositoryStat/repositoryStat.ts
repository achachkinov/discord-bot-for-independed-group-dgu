import { Stat } from "../entity/Stat";
import { MessageStruct } from "../structs/MessageStruct";


export interface repositoryStat {
    get( message: MessageStruct ) : Stat;
    set( stat: Stat ) : void;
}