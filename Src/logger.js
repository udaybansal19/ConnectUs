//Logging types and conventions
export const log = {
	error:1,
	warn:2,
	log:3,
	info:4,
	debug:5
}
Object.freeze(log);

export function logger(message, type) {
	switch(type) {

		//Error
		case 1:
			console.error(message);
			break;

		//Warn	
		case 2:
			console.warn(message);
			break;

		//Log
		case 3:
			//console.log(message);
			break;

		//Info
		case 4:
			console.log(`%c ${message}`,"color:Chartreuse");
			break;

		//Debug
		case 5:
			console.log(`%c ${message}`,"color:yellow");
			break;

		default:
			console.log(message);
			break;
	}

}