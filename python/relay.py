import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(23,GPIO.OUT)
print("LED ON")
GPIO.output(23,GPIO.HIGH)
time.sleep(10)
print("LED off")
GPIO.output(23,GPIO.LOW)