//To decode message received from signalling
function receivedMessage(message) {
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
			connectTo(data);
			break;

		case 'deleteUser':
			activePeers.delete(data);
			break;

		case 'sessionDescriptionOffer':
			logger("Received offer from" + from,log.log);
			var offer = data;
			if (offer) {
				acceptConnection(from, offer);
			}
			break;

		case 'sessionDescriptionAnswer':
			var answer = data;
			if (answer) {
				peers.get(from).peerConnection.setRemoteDescription(answer);
			}
			break;

		case 'iceCandidate':
			peers.get(from).peerConnection.addIceCandidate(data)
				.then(() => {
					logger("ICE candidate added", log.log);
				}).catch(error => {
					logger("Ice candidate error " + error, log.error);
				});
			break;

	}
}