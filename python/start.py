from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import RPi.GPIO as GPIO
import json

hostName = "localhost"
serverPort = 8080

BEAM_PIN = 17
scores = []


class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        if self.path == "/exchange-updates":
            self.wfile.write(bytes(json.dumps(scores), "utf-8"))
            scores.clear()
        else:
            with open('template.html', 'r') as file:
                contents = file.read()

            self.wfile.write(bytes(contents, "utf-8"))



def break_beam_callback(channel):
    if GPIO.input(BEAM_PIN):
        print("beam unbroken")
    else:
        print("beam broken")
        msg = {
            "sender": "Server",
            "messageType": "PLAYER_1_SCORED"
        }
        scores.append(msg)

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(BEAM_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(BEAM_PIN, GPIO.BOTH, callback=break_beam_callback)
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    GPIO.cleanup()
    print("Server stopped.")