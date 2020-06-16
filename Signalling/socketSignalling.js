import receivedMessage from '../transceiver';
import logger from '../logger';

export default function startWebSocket(wsUri) {
	websocket = new WebSocket(wsUri);
	websocket.onopen = function (evt) { onOpen(evt) };
	websocket.onclose = function (evt) { onClose(evt) };
	websocket.onmessage = function (evt) { onMessage(evt) };
	websocket.onerror = function (evt) { onError(evt) };
}

function onOpen(evt) {
	logger("Signalling Connected",log.info);
	startButton.disabled = false;
	stopButton.disabled = false;
}

function onClose(evt) {
	logger("Signalling Disconnected",log.info);
	startWebSocket();
}

function onMessage(evt) {
	var message = JSON.parse(evt.data);
	receivedMessage(message);
}

function onError(evt) {
	logger("Signalling Error: " + evt, log.error);
}