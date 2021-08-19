const ws = require('ws')

const wss = new ws.Server({
	port: 5000,
}, () => console.log(`server started on 5000`))

wss.on('connection', function connection(ws) {
	ws.id = Date.now()
	ws.on('message', function(message) {
		message = JSON.parse(message)

		switch (message.event) {
			case 'message':
				broadCastMessage(message)
			break
			case 'connection':
				broadCastMessage(message)
			break
			case 'disconnect':
				broadCastMessage(message)
			break
			default:
				break;
		}
	})
})

function broadCastMessage(message, id) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message))
	})
}