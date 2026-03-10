alert('hello");

function Cors_DoFecthDatafromUrl(UrlPath,ProgressBarObj)
		{
			return new Promise((resolve,reject) => {
				//demande requête
				fetch(UrlPath).then((ResponseObj) => {
					const ReaderObj = ResponseObj.body.getReader();
					const ContentLength = ResponseObj.headers.get('Content-Length');
					let ReceivedLength = 0;
					let ReceivedData = new Uint8Array();
					
					//init lecture
					ReaderObj.read().then(function pump({done, value}) {
						if(done) {
							ProgressBarObj.value = 100;
							console.log("Success loading");
							//renvoie en arraybuffer
							resolve(ReceivedData.buffer);
							return;
						}
						
						//accumulation donées lues
						let TmpSize = ReceivedLength;
						ReceivedLength += value.length;
						let TmpBuffer = new Uint8Array(ReceivedLength);
						TmpBuffer.set(ReceivedData,0);
						TmpBuffer.set(value,TmpSize);
						ReceivedData = TmpBuffer;
						
						//update progress bar
						ProgressBarObj.value = parseInt((100*ReceivedLength)/ContentLength);
						console.log("Progress " + ProgressBarObj.value + "%");
	
						//lecture donées suivantes
						return ReaderObj.read().then(pump)
						.catch((ErrorObj) => {
							console.log("Some Error occured during load");
							reject(null);
						});
					}) .catch((ErrorObj) => {
						console.log("Error Read");
						reject(null);
					});
				}) .catch((ErrorObj) => {
					console.log("Error Url");
					reject(null);
				});
			});
		}