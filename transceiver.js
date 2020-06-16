import * as main from './Main';
import logger from './logger';
import { myUser, activePeers } from './Main';

//To decode message received from signalling
export default function receivedMessage(message) {
    var from = message.sender;
    var data = message.data;
    var type = message.type;

	logger("Received " +  type + " from " + from,log.log);

	switch (type) {
		case 'userData':
			logger("My id is " + data,log.info);
			myUser.id = data;
			break;

		case 'currentActive':
			data.forEach((id) => {
				activePeers.add(id);
			});
			break;

		case 'newUser':
			activePeers.add(data);
			main.connectTo(data);
			break;

		case 'deleteUser':
			activePeers.delete(data);
			break;

		case 'sessionDescriptionOffer':
			var offer = data;
			main.acceptOffer(from, offer);
			break;

		case 'sessionDescriptionAnswer':
			var answer = data;
			main.acceptAnswer(from, answer);
			break;

		case 'iceCandidate':
			var iceCandidate = data;
			main.addIceCandidateToPeer(from, iceCandidate);
			break;

	}
}