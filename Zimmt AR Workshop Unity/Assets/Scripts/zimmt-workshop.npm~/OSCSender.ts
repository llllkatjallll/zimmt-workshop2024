import { Behaviour, serializable } from "@needle-tools/engine";
// Assuming you have some way to send OSC messages (e.g., via WebSocket to a server that handles OSC)

export class OSCSender extends Behaviour {
    // Define any properties you need to configure your OSC messages
    // For example, the address and port of your OSC server, message address pattern, etc.
    @serializable
    oscAddress: string = '/defaultAddress';

    @serializable
    oscPort: number = 9000;

    @serializable
    messageAddress: string = '/myMessage';

    start() {
        // Initialization code here
        // For example, establishing a WebSocket connection to your server
        console.log("OSCSender started");
    }

    // Method to send an OSC message
    sendOSCMessage(messageContent: string | number | Array<string | number>) {
        // Construct the OSC message
        // The actual implementation will depend on how you plan to send the message
        // Here we just log it to the console for demonstration
       // console.log(`Sending OSC Message to ${this.oscAddress}:${this.oscPort} with address ${this.messageAddress} and content:`, messageContent);

        // Here you would typically send the message to your server via WebSocket or another method
        // which would then forward the message to the OSC network
        // WebSocket.send(JSON.stringify({ address: this.messageAddress, content: messageContent }));
    }
}