import { MessageStruct } from "../structs/MessageStruct";
import { MessageObserver } from "./MessageObserver";
import { UserCountMessageObserver } from "./UserCountMessageObserver";

export class MessageObservable {

    private observers: MessageObserver[] = [];

    constructor() {
        this.subscribe( new UserCountMessageObserver() );
    }

    subscribe( observer: MessageObserver ):void {
        this.observers.push( observer );
    }

    notify( message: MessageStruct) {
        this.observers.forEach((observer) => observer.execute(message));
    }
}