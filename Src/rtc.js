import { logger, log } from './logger';
import sendTo from './Signalling/Signalling';
import { myUser } from '.';

const offerOptions = {
	offerToReceiveVideo: 1,
};

export function createOffer(peer) {
	const peerConnection = peer.peerConnection;
    peerConnection.createOffer(offerOptions)
		.then((offer) => {
			peerConnection.setLocalDescription(offer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionOffer', offer, peer.id);
		});
}

export function createAnswer(peer, offer) {
	const peerConnection = peer.peerConnection;
    peerConnection.setRemoteDescription(offer);
	peerConnection.createAnswer()
		.then((answer) => {
			peerConnection.setLocalDescription(answer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionAnswer', answer, peer.id);
		});
}

export function acceptAnswer(peer, answer) {
	peer.peerConnection.setRemoteDescription(answer);
}

export function addIceCandidate(peer,iceCandidate) {
	peer.peerConnection.addIceCandidate(iceCandidate)
		.then(() => {
			logger("ICE candidate added", log.log);
		}).catch(error => {
			logger("Ice candidate error " + error, log.error);
		});
}

export function manageConnection(peer) {

	const peerConnection = peer.peerConnection;

	//Ice Candidate
	//sending iceCandidate data
	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			sendTo('iceCandidate', event.candidate, peer.id);
		}
	};

	peerConnection.addEventListener("negotiationneeded", ev => {
		logger("Negotiation Needed", log.debug);
		createOffer(peer);
	});



	//WebRTC connection status
	peerConnection.addEventListener('connectionstatechange', event => {
		switch(peerConnection.connectionState) {
			case 'connected':
				logger("WebRTC Connected with " + peer.id, log.info);
				break;
			case 'disconnected':
				logger("WebRTC Disonnected with " + peer.id, log.info);
				break;
			default:
				logger("WebRTC " + peerConnection.connectionState + " with id " + peer.id, log.debug );
				break;			
		}
	});

	//Add remote stream to DOM object at sender's side
	peerConnection.addEventListener('track', async (event) => {
		logger("Stream received", log.debug);
		peer.remoteStream.addTrack(event.track, peer.remoteStream);
		event.track.onunmute = () => {
			logger('track unmuted', log.debug);
			peer.remoteVideo = document.createElement("video");
			myUser.remoteVideos.appendChild(peer.remoteVideo);
			peer.remoteVideo.srcObject = event.streams[0];
			peer.remoteVideo = peer.remoteStream;
			peer.remoteVideo.autoplay = true;
		    peer.remoteVideo.playsInline = true;
			peer.remoteVideo.muted = true;
			console.log(peer.remoteStream);
			console.log(peer.remoteStream.getTracks());
    	}
	});

	peerConnection.addEventListener("iceconnectionstatechange", ev => {
		logger("IceConnection State changed to: " + peerConnection.iceConnectionState, log.log);
	});
	logger("IceConnection initial state: " + peerConnection.iceConnectionState,log.log);


	peerConnection.addEventListener("icegatheringstatechange", ev => {
		logger("Ice Gathering State changed to: " + peerConnection.iceGatheringState, log.log);
	});
	logger("Ice Gathering inital state: " + peerConnection.iceGatheringState, log.log);


}