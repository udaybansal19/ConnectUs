import receivedMessage from '../transceiver';
import logger from '../logger';

export default function dataTransfer(id) {
	const dataChannel = peers.get(id).dataChannel;
	dataChannel.addEventListener('open', event => {
		logger("Data Channel opened with: " + id, log.debug);
		peers.get(id).signallingMethod = signallingMethod.dataChannel;
	});
	
	dataChannel.addEventListener('close', event => {
		logger("Data Channel closed with: " + id, log.debug);
	});

	dataChannel.addEventListener('message', event => {
		var message = JSON.parse(evt.data);
		receivedMessage(message);
		logger("Received" + message, log.debug);

	});

}