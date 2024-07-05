# Couldn't get this to work the way I needed

from gpiozero import DistanceSensor
ultrasonic = DistanceSensor(echo=17, trigger=4)

def inrange():
    print('in range')

def outofrange():
    print('out of range')

ultrasonic.when_in_range = inrange
ultrasonic.when_out_of_range = outofrange
while True:
    distance = ultrasonic.distance
    # if distance > 0:
    #     print(distance)
