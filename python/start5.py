from http.server import BaseHTTPRequestHandler, HTTPServer
# import RPi.GPIO as GPIO
from gpiozero import LED
from gpiozero import Button
import json
from urllib.request import urlopen
import sys


hostName = "localhost"
serverPort = sys.argv[0]

BEAM_PIN = 17
BEAM_PIN_2 = 18
scores = []
APP_CLOUD_BASE_URL = "https://air-hockey.azurewebsites.net/"
tableRelay = LED(23)
player1Beam = Button(17)
player2Beam = Button(18)


class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Permissions-Policy", "fullscreen=*;")
        self.end_headers()

        if self.path == "/exchange-updates":
            self.wfile.write(bytes(json.dumps(scores), "utf-8"))
            scores.clear()
        elif self.path == '/turn-table-on':
            turn_table_on()
        elif self.path == '/turn-table-off':
            turn_table_off()
        elif self.path == '/favicon.ico':
            print('')
        else:
            turn_table_off()
            templateUrl = APP_CLOUD_BASE_URL + "assets/html/template.html"
            output = urlopen(templateUrl).read()
            contents = output.decode("utf-8")
            contents = contents.replace("{{APP_CLOUD_BASE_URL}}", APP_CLOUD_BASE_URL)
            self.wfile.write(bytes(contents, "utf-8"))


def turn_table_on():
    tableRelay.on();

def turn_table_off():
    tableRelay.off();

def break_beam_callback():
    msg = {
            "sender": "Server",
            "messageType": "PLAYER_1_SCORED"
        }
    scores.append(msg)


def break_beam_callback_2():
    msg = {
            "sender": "Server",
            "messageType": "PLAYER_2_SCORED"
        }
    scores.append(msg)

if __name__ == "__main__":   
    serverPort = 8080
    print("PORT:")
    print(serverPort)   
    webServer = HTTPServer((hostName, int(serverPort)), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        player1Beam.when_released = break_beam_callback
        player2Beam.when_released = break_beam_callback_2
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()

    print("Server stopped.")