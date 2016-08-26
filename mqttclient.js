var mqtt = require('mqtt')

//client = mqtt.createClient(1883, '192.168.99.100');
client = mqtt.createClient(1883, '10.10.2.6');

client.subscribe('presence');

console.log('Client publishing.. ');
client.publish('presence', 'poo');
client.end();
