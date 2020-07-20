import { startWebSocket, websocket } from './socketSignalling';
import { logger, log } from '../logger';
import {myUser, defaultSignallingMethod} from '../index';
import * as table from '../dht/routingTable';

export function initSignalling(wsUri) {
	startWebSocket(wsUri);
}
export default function sendTo(type, data, receiver) {
	const messageObj = {
		type: type,
		sender: myUser.id,
		receiver: receiver,
		data: data
	}
	const message = JSON.stringify(messageObj);

	if(receiver == -1) {
		sendViaWebsockets(message);
	}
	else {
		if(defaultSignallingMethod == 2) {
			table.getPeer(receiver).signallingMethod = 2;
			sendViaDataChannel(message);
		} else {
			var signallingMethod = defaultSignallingMethod;
			
			switch(signallingMethod) {
				case 1:
					sendViaWebsockets(message);
					break;
				case 2:
					sendViaDataChannel(message);
					break;
			}
		}
	}
}

function sendViaWebsockets(message) {

	try {
		websocket.send(message);
		logger("Sending " + message.type + " to " + message.receiver, log.log);
	} catch (error) {
		logger("Failed to communicate with server with Error" + error, log.error);
	}

}

function sendViaDataChannel(message) {
	try {
		var peer = table.getPeer(message.receiver);
			if(peer != -1){

				peer.dataChannel.send(message);
				logger("Sending " + message.type + " to " + message.receiver, log.log);
				
			} else {

				table.getClosestPeer(message.receiver).dataChannel.send(message);
				logger("Routing " + message.type + " to " + message.receiver, log.log);

			}
	} catch (error) {
		logger("Failed to communicate with " + message.receiver + " via dataChannel with Error" + error, log.error);
	}
}