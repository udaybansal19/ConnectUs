import receivedMessage from '../transceiver';
import { logger, log } from '../logger';

export default function dataTransfer(peer) {
	const dataChannel = peer.dataChannel;
	dataChannel.addEventListener('open', event => {
		logger("Data Channel opened with: " + peer.id, log.debug);
		peer.signallingMethod = 2;
	});
	
	dataChannel.addEventListener('close', event => {
		logger("Data Channel closed with: " + peer.id, log.debug);
	});

	dataChannel.addEventListener('message', event => {
		var message = JSON.parse(evt.data);
		receivedMessage(message);
		logger("Received" + message, log.debug);

	});
}