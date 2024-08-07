import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PubSubService } from '../../services/pub-sub.service';
import { GameSettings } from '../../models/settings';
import { JoystickState } from '../../services/joystick-state';
import { getRandomNumber } from '../../services/utilities';
import { SettingsRepositoryService } from '../../services/settings-repository.service';
declare var Matter: any;


@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [],
  templateUrl: './pong.component.html',
  styleUrl: './pong.component.scss'
})
export class PongComponent implements OnInit, OnDestroy {

  puck: any;
  GAME_WIDTH = window.innerWidth;
  GAME_HEIGHT = window.innerHeight;
  score = {
    playerOne: 0,
    playerTwo: 0
  };
  BORDER = 30;
  PUCK_SIZE = 60;
  paddle1: any;
  paddle2: any;
  inGoal = false;
  PUCK_START_POINT_X: number;
  PUCK_START_POINT_Y: number;
  engine: any;
  puckDirection: 'left' | 'right' = 'right';
  puckRotation = 0;

  PADDLE_SIZE = 80;
  runAnimationFrame: number;
  renderAnimationFrame: number;
  joystick1 = new JoystickState(0);
  joystick2 = new JoystickState(1);
  pressedKeys: any = {};

  constructor(private pubSub: PubSubService) { }

  ngOnInit(): void {
    this.initialize();
  }

  
  // Clean up matter.js resources and cancel annimation frames
  ngOnDestroy(): void {
    Matter.World.clear(this.engine.world);
    Matter.Engine.clear(this.engine);
    delete this.engine;
    window.cancelAnimationFrame(this.runAnimationFrame);
    window.cancelAnimationFrame(this.renderAnimationFrame);
  }

  private initialize() {
    const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies;
    this.engine = Engine.create();
    this.PUCK_START_POINT_X = this.GAME_WIDTH / 2 - this.PUCK_SIZE;
    this.PUCK_START_POINT_Y = this.GAME_HEIGHT / 2;

    this.puck = Matter.Bodies.circle(
      this.PUCK_START_POINT_X,
      this.PUCK_START_POINT_Y,
      this.PUCK_SIZE, {
      inertia: 0,
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0,
      restitution: 1.05,
      label: 'puck'
    });

    this.puck.velocity.x = 1;
    this.paddle1 = Bodies.circle(
      this.PADDLE_SIZE,
      this.GAME_HEIGHT / 2,
      this.PADDLE_SIZE,
      { isStatic: true, label: 'paddleOne' } );

    this.paddle2 = Bodies.circle(
      this.GAME_WIDTH - this.PADDLE_SIZE,
      this.GAME_HEIGHT / 2,
      this.PADDLE_SIZE,
      { isStatic: true, label: 'paddleTwo' });


    const top = Bodies.rectangle(
      this.GAME_WIDTH / 2,
      -20,
      this.GAME_WIDTH,
      this.BORDER, { isStatic: true, label: "topWall" }
    );
    const bottom = Bodies.rectangle(
      this.GAME_WIDTH / 2,
      this.GAME_HEIGHT + 20,
      this.GAME_WIDTH,
      this.BORDER, { isStatic: true, label: "bottomWall" }
    );

    World.add(this.engine.world, [this.puck, this.paddle1, this.paddle2, bottom, top]);
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.x = 0;
    this.run();
    const xDir = getRandomNumber(-1, 1);
    const yDir = getRandomNumber(-1, 1);
    
    Matter.Body.applyForce(this.puck, { x: this.puck.position.x, y: this.puck.position.y }, { x: xDir > 0 ? .2 : -.2, y: yDir > 0 ? .1 : -.1 });
  }

  private run() {
    if (this.runAnimationFrame) {
      window.cancelAnimationFrame(this.runAnimationFrame);
    }
    this.runAnimationFrame = window.requestAnimationFrame(this.run.bind(this));
    this.update();
    this.render();
  }

  render() {
    const paddle1: HTMLElement = document.querySelector('.paddle-1');
    paddle1.style.top = `${this.paddle1.position.y - 82}px`;
    paddle1.style.left = `${this.paddle1.position.x - 82}px`;

    const paddle2: HTMLElement = document.querySelector('.paddle-2');
    paddle2.style.top = `${this.paddle2.position.y - 82}px`;
    paddle2.style.left = `${this.paddle2.position.x - 82}px`;

    const puck: HTMLElement = document.querySelector('.puck');
    puck.style.top = `${this.puck.position.y - (this.PUCK_SIZE)}px`;
    puck.style.left = `${this.puck.position.x - (this.PUCK_SIZE)}px`;
    puck.style.transform = `rotate(${this.puck.angle}rad)`;
  }

  leftArrowKeyDown = false;
  leftArrowKeyUp = false;
  leftArrowKeyLeft = false;
  leftArrowKeyRight = false;

  @HostListener('document:keydown', ['$event'])
  keyDown(evt: KeyboardEvent) {
    this.pressedKeys[evt.key] = true;
    evt.stopPropagation();
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(evt: KeyboardEvent) {
    delete this.pressedKeys[evt.key];
    evt.stopPropagation();
  }

  rightArrowKeyDown = false;
  rightArrowKeyLeft = false;
  rightArrowKeyRight = false;
  rightArrowKeyUp = false;

  update() {
    Matter.Engine.update(this.engine);
    this.leftArrowKeyDown = this.joystick1.isDown || this.pressedKeys['s'];
    this.leftArrowKeyLeft = this.joystick1.isLeft || this.pressedKeys['a'];
    this.leftArrowKeyRight = this.joystick1.isRight || this.pressedKeys['d'];
    this.leftArrowKeyUp = this.joystick1.isUp || this.pressedKeys['w'];

    this.rightArrowKeyDown = this.joystick2.isDown || this.pressedKeys['ArrowDown'];
    this.rightArrowKeyLeft = this.joystick2.isLeft || this.pressedKeys['ArrowLeft'];
    this.rightArrowKeyRight = this.joystick2.isRight || this.pressedKeys['ArrowRight'];
    this.rightArrowKeyUp = this.joystick2.isUp || this.pressedKeys['ArrowUp'];

    if (this.leftArrowKeyDown) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.paddle1.position.y + 20 });
      if (this.paddle1.position.y > this.GAME_HEIGHT - this.PADDLE_SIZE) {
        Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.GAME_HEIGHT - this.PADDLE_SIZE });
      }
    }
    if (this.rightArrowKeyDown) {
      Matter.Body.setPosition(this.paddle2, { x: this.paddle2.position.x, y: this.paddle2.position.y + 20 });
      if (this.paddle2.position.y > this.GAME_HEIGHT - this.PADDLE_SIZE) {
        Matter.Body.setPosition(this.paddle2, { x: this.paddle2.position.x, y: this.GAME_HEIGHT - this.PADDLE_SIZE });
      }
    }
    if (this.leftArrowKeyUp) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.paddle1.position.y - 20 });
      if (this.paddle1.position.y < (this.PADDLE_SIZE)) {
        Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.PADDLE_SIZE });
      }
    }
    if (this.rightArrowKeyUp) {
      Matter.Body.setPosition(this.paddle2, { x: this.paddle2.position.x, y: this.paddle2.position.y - 20 });
      if (this.paddle2.position.y < (this.PADDLE_SIZE)) {
        Matter.Body.setPosition(this.paddle2, { x: this.paddle2.position.x, y: this.PADDLE_SIZE });
      }
    }

    if (this.leftArrowKeyRight) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x + 20, y: this.paddle1.position.y });
      if (this.paddle1.position.x > 400) {
        Matter.Body.setPosition(this.paddle1, { x: 400, y: this.paddle1.position.y });
      }
    }
    if (this.rightArrowKeyRight) {
      Matter.Body.setPosition(this.paddle2, { x: this.paddle2.position.x + 20, y: this.paddle2.position.y });
      if (this.paddle2.position.x > this.GAME_WIDTH - this.PADDLE_SIZE) {
        Matter.Body.setPosition(this.paddle2, { x: this.GAME_WIDTH - this.PADDLE_SIZE, y: this.paddle2.position.y });
      }
    }
    if (this.leftArrowKeyLeft) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x - 20, y: this.paddle1.position.y });

      if (this.paddle1.position.x < this.PADDLE_SIZE) {
        Matter.Body.setPosition(this.paddle1, { x: this.PADDLE_SIZE, y: this.paddle1.position.y });
      }
    }
    if (this.rightArrowKeyLeft) {
      Matter.Body.setPosition(this.paddle2, { x: this.paddle2.position.x - 20, y: this.paddle2.position.y });

      if (this.paddle2.position.x < this.GAME_WIDTH - 400) {
        Matter.Body.setPosition(this.paddle2, { x: this.GAME_WIDTH - 400, y: this.paddle1.position.y });
      }
    }
    const puck = this.puck;

    if (puck.velocity.x < 0 && this.puckDirection === 'right') {
      Matter.Body.applyForce(puck, { x: puck.position.x, y: puck.position.y }, { x: -SettingsRepositoryService.Instance.puckForce, y: 0 });
      this.puckDirection = 'left';
    }

    if (puck.velocity.x > 0 && this.puckDirection === 'left') {
      Matter.Body.applyForce(puck, { x: puck.position.x, y: puck.position.y }, { x: SettingsRepositoryService.Instance.puckForce, y: 0 });
      this.puckDirection = 'right';
    }

    if (puck.position.x > this.GAME_WIDTH - this.BORDER && !this.inGoal) {
      this.resetPuck(() => {
        this.score.playerOne++;
        this.pubSub.publish({
          type: 'PLAYER_1_SCORED',
          messageBody: null,
        });
      });
    } else if (puck.position.x < this.BORDER && !this.inGoal) {
      this.resetPuck(() => {
        this.score.playerTwo++;
        this.pubSub.publish({
          type: 'PLAYER_2_SCORED',
          messageBody: null,
        });
      });
    }

    if ((puck.position.y > this.GAME_HEIGHT + 200) || (puck.position.y < -200)) {
      this.resetPuck((cb: any) => { console.log("pooof matter.js" + puck.position.y + " WTF " + this.GAME_HEIGHT + 200) });
    }
  }

  resetPuck(cb: any) {
    this.inGoal = true;
    this.puck.visible = false;
    setTimeout(() => {
      Matter.Body.setPosition(this.paddle1, {
        x: this.paddle1.position.x,
        y: this.GAME_HEIGHT / 2,
      });
      Matter.Body.setPosition(this.paddle2, {
        x: this.paddle2.position.x,
        y: this.GAME_HEIGHT / 2,
      });
      Matter.Body.setVelocity(this.puck, {
        x: 0,
        y: 0
      });
      this.puck.force = { x: 0, y: 0 };
      this.puck.visible = true;
      Matter.Body.setPosition(this.puck, { x: this.PUCK_START_POINT_X, y: this.PUCK_START_POINT_Y });
      setTimeout(() => {
        const xRand = Math.random();
        const yRand = Math.random();
        this.puckDirection = xRand > .5 ? 'right' : 'left';
        const launchFactor = SettingsRepositoryService.Instance.puckResetForce;
        Matter.Body.setVelocity(this.puck, {
          x: ((xRand > 0.5) ? 1 : -1) * Math.floor((xRand * launchFactor) + launchFactor),
          y: ((yRand > 0.5) ? 1 : -1) * Math.floor((yRand * launchFactor) + launchFactor)
        });
      }, 500);
      this.inGoal = false;
      cb();
    }, 500);
  }
}
