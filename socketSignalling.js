//To Start Signalling on load.
window.addEventListener('load', onLoad);

function onLoad() {
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
	onLoad();
}

function onMessage(evt) {
	var message = JSON.parse(evt.data);
	receivedMessage(message);
}

function onError(evt) {
	logger("Signalling Error: " + evt, log.error);
}