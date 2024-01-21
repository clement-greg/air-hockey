export class Player {
    avatar: string;

    constructor(playerNumber: number) { }
}

export class JoystickState {
    private left = false;
    private up = false;
    private right = false;
    private down = false;
    onLeftJoyStick: () => void;
    onRightJoyStick: () => void;
    onUpJoyStick: () => void;
    onDownJoyStick: () => void;
    onButtonPress: (index: number) => void;
    private pressedButtons: number[] = [];

    constructor(public index: number) {
        this.gameLoop();
    }

    buttonPressed(b: any) {
        if (typeof b === "object") {
            return b.pressed;
        }
        return b === 1.0;
    }

    gameLoop() {
        const gamepads = navigator.getGamepads();
        if (!gamepads) {
            return;
        }

        const gp = gamepads[this.index];
        if (gp) {
            let i = 0;

            for(let pressedIndex of this.pressedButtons) {
                const btn = gp.buttons[pressedIndex];
                if(!this.buttonPressed(btn) && this.onButtonPress) {
                    this.onButtonPress(pressedIndex);
                }
            }
            this.pressedButtons = [];

              for (const btn of gp?.buttons) {
                if (this.buttonPressed(btn)) {
                  this.pressedButtons.push(i);
                }
                i++;
              }

            i = 0;


            const js1 = this;
            if (js1.left && gp.axes[0] != -1) {
                if (this.onLeftJoyStick) {
                    this.onLeftJoyStick();
                }
            }
            if (js1.right && gp.axes[0] != 1) {
                if (this.onRightJoyStick) {
                    this.onRightJoyStick();
                }
            }
            if (js1.up && gp.axes[1] !== -1) {
                if (this.onUpJoyStick) {
                    this.onUpJoyStick();
                }
            }
            if (js1.down && gp.axes[1] !== 1) {
                if (this.onDownJoyStick) {
                    this.onDownJoyStick();
                }
            }

            js1.left = gp.axes[0] === -1;
            js1.right = gp.axes[0] === 1;
            js1.up = gp.axes[1] === -1;
            js1.down = gp.axes[1] === 1;

        }


        this.start = requestAnimationFrame(this.gameLoop.bind(this));
    }

    start: any;
}

