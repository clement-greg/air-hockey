# import RPi.GPIO as GPIO

# BEAM_PIN = 17

# def break_beam_callback(channel):
#     if GPIO.input(BEAM_PIN):
#         print("beam unbroken")
#     else:
#         print("beam broken")

# GPIO.setmode(GPIO.BCM)
# GPIO.setup(BEAM_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
# GPIO.add_event_detect(BEAM_PIN, GPIO.BOTH, callback=break_beam_callback)

# message = input("Press enter to quit\n\n")
# GPIO.cleanup()

from gpiozero import Button
from time import sleep

def pressed():
    print("button was pressed")

def released():
    print("button was released")

btn = Button(17)

btn.when_pressed = pressed
btn.when_released = released
while True:
    sleep(1)