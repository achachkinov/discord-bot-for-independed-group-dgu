import { MessageStruct } from "../structs/MessageStruct";

export interface messageObserver {
    execute( messageStruct: MessageStruct ) : void;
}