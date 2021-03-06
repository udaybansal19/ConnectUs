import receivedMessage from '../transceiver';
import {logger, log} from '../logger';
import { independent } from "../dht/routingTable";

export var websocket;
export function startWebSocket(wsUri) {
	websocket = new WebSocket(wsUri);
	websocket.onopen = function (evt) { onOpen(evt) };
	websocket.onclose = function (evt) { onClose(evt) };
	websocket.onmessage = function (evt) { onMessage(evt) };
	websocket.onerror = function (evt) { onError(evt) };
}

export function stopWebSocket() {
	websocket.close();
}

function onOpen(evt) {
	logger("Signalling Connected",log.info);
}

function onClose(evt) {
	logger("Signalling Disconnected",log.info);
	if(independent != true){
		startWebSocket();
	}
}

function onMessage(evt) {
	var message = JSON.parse(evt.data);
	receivedMessage(message);
}

function onError(evt) {
	logger("Signalling Error: " + evt, log.error);
}