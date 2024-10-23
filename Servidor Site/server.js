const WebSocket = require('ws');
const mqtt = require('mqtt');

// Conexão com o broker MQTT
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');

    // Envia uma mensagem de boas-vindas ao cliente
    ws.send('Conectado ao servidor WebSocket');

    // Quando receber uma mensagem do cliente
    ws.on('message', (message) => {
        console.log(`Mensagem recebida do cliente: ${message}`);
        // Aqui você pode lidar com mensagens recebidas do cliente WebSocket, se necessário
    });
});

// Subscribir ao tópico MQTT
mqttClient.on('connect', () => {
    mqttClient.subscribe('teste/aleatorio', (err) => {
        if (!err) {
            console.log('Inscrito no tópico teste/aleatorio');
        }
    });
});

// Quando receber uma mensagem do broker MQTT
mqttClient.on('message', (topic, message) => {
    console.log(`Mensagem recebida do MQTT: ${message.toString()}`); // Adicione esta linha
    // Enviar a mensagem recebida do broker para todos os clientes WebSocket
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
        }
    });
});

console.log('Servidor WebSocket está rodando na ws://localhost:8080');
