import { startWebSocket, websocket } from './socketSignalling';
import { logger, log } from '../logger';
import {wsUri, myUser} from '../Main';
import * as main from '../Main';

export function initSignalling() {
	startWebSocket(wsUri);
}
export default function sendTo(type, data, receiver) {
	const message = {
		type: type,
		sender: myUser.id,
		receiver: receiver,
		data: data
	}
	if(receiver == -1) {
		sendViaWebsockets(message);
	}
	else {
		const signallingMethod = main.getPeer(receiver).signallingMethod;
		switch(signallingMethod) {
			case 1:
				sendViaWebsockets(message);
				break;
			case 2:
				sendViaDataChannel(message);
				break;
			case 3:
				//TODO: Route data through peers
				break;
		}
	}
}

function sendViaWebsockets(message) {

	try {
		websocket.send(JSON.stringify(message));
		logger("Sending " + message.type + " to " + message.receiver, log.log);
	} catch (error) {
		logger("Failed to communicate with server with Error" + error, log.error);
	}

}

function sendViaDataChannel(message) {
	try {
		main.getPeer(message.receiver).dataChannel.send(JSON.stringify(message));
		logger("Sending " + message.type + " to " + message.receiver, log.log);
	} catch (error) {
		logger("Failed to communicate with " + message.receiver + " via dataChannel with Error" + error, log.error);
	}
}