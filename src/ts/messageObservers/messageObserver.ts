import { MessageStruct } from "../structs/MessageStruct";

export interface MessageObserver {
    execute( message: MessageStruct ) : void;
}