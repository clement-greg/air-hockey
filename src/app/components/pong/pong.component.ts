import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PubSubService } from '../../services/pub-sub.service';
import { JoystickState } from '../../models/player';
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
  BALL_SIZE = 60;
  paddle1: any;
  paddle2: any;
  in_goal = false;
  BALL_START_POINT_X: number;
  BALL_START_POINT_Y: number;
  engine: any;
  puckDirection: 'left' | 'right' = 'right';
  puckRotation = 0;
  PUCK_FORCE = .1;

  PADDLE_SIZE = 80;
  runAnimationFrame: number;
  renderAnimationFrame: number;
  joystick1 = new JoystickState(0);

  constructor(private pubSub: PubSubService) {

  }

  ngOnInit(): void {


    this.initialize();
  }

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
    this.BALL_START_POINT_X = this.GAME_WIDTH / 2 - this.BALL_SIZE;
    this.BALL_START_POINT_Y = this.GAME_HEIGHT / 2;

    this.puck = Matter.Bodies.circle(
      this.BALL_START_POINT_X,
      this.BALL_START_POINT_Y,
      this.BALL_SIZE, {
      inertia: 0,
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0,
      restitution: 1.05,
      label: "ball"
    }
    );
    this.puck.velocity.x = 1;
    this.paddle1 = Bodies.circle(
      this.PADDLE_SIZE,
      this.GAME_HEIGHT / 2,
      this.PADDLE_SIZE,
      { isStatic: true, label: 'plankOne' }
    )

    this.paddle2 = Bodies.circle(
      this.GAME_WIDTH - this.PADDLE_SIZE,
      this.GAME_HEIGHT / 2,
      this.PADDLE_SIZE,
      { isStatic: true, label: 'plankTwo' }
    );


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
    Matter.Body.applyForce(this.puck, { x: this.puck.position.x, y: this.puck.position.y }, { x: .2, y: .1 });
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

    const puck: HTMLElement = document.querySelector('.puck');
    puck.style.top = `${this.puck.position.y - (this.BALL_SIZE)}px`;
    puck.style.left = `${this.puck.position.x - (this.BALL_SIZE)}px`;
    puck.style.transform = `rotate(${this.puck.angle}rad)`;
  }



  paddleone_ai(paddle: any, dis: any) {
    const ball = this.puck;

    if (ball.velocity.x > dis * ball.velocity.x) {
      return true;
    }

    let x_dist = Math.abs(paddle.position.x - ball.position.x);
    let time_dist = x_dist / ball.velocity.x;
    let ball_finial_pos_y = (ball.position.y + (ball.velocity.y * time_dist));

    if (Math.abs((ball_finial_pos_y - (paddle.position.y + paddle.height / 2)))) {

    } else if (ball_finial_pos_y > paddle.position.y + 50) {
      if (paddle.position.y < this.GAME_HEIGHT - 100) {

        Matter.Body.setPosition(paddle, { x: paddle.position.x, y: paddle.position.y + 7 });
      }
    } else if (ball_finial_pos_y < paddle.position.y - 50) {
      if (paddle.position.y > 100) {

        Matter.Body.setPosition(paddle, { x: paddle.position.x, y: paddle.position.y - 7 });
      }
    } else {

    }

    return false;

  }

  leftArrowKeyDown = false;
  leftArrowKeyUp = false;
  leftArrowKeyLeft = false;
  leftArrowKeyRight = false;

  @HostListener('document:keydown', ['$event'])
  keyDown(evt: KeyboardEvent) {
    switch (evt.key) {
      case 'ArrowUp':
        this.leftArrowKeyUp = true;
        break;
      case 'ArrowDown':
        //this.player1Down();
        this.leftArrowKeyDown = true;
        break;
      case 'ArrowRight':
        this.leftArrowKeyRight = true;
        break;
      case 'ArrowLeft':
        this.leftArrowKeyLeft = true;
        break;

    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(evt: KeyboardEvent) {
    switch (evt.key) {
      case 'ArrowUp':
        this.leftArrowKeyUp = false;
        break;
      case 'ArrowDown':
        this.leftArrowKeyDown = false;
        break;
      case 'ArrowRight':
        this.leftArrowKeyRight = false;
        break;
      case 'ArrowLeft':
        this.leftArrowKeyLeft = false;
        break;
    }
  }


  update() {

    Matter.Engine.update(this.engine);
    this.leftArrowKeyDown = this.joystick1.isDown;
    this.leftArrowKeyLeft = this.joystick1.isLeft;
    this.leftArrowKeyRight = this.joystick1.isRight;
    this.leftArrowKeyUp = this.joystick1.isUp;

    if (this.leftArrowKeyDown) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.paddle1.position.y + 20 });
      if (this.paddle1.position.y > this.GAME_HEIGHT - this.PADDLE_SIZE) {
        Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.GAME_HEIGHT - this.PADDLE_SIZE });
      }
    }
    if (this.leftArrowKeyUp) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.paddle1.position.y - 20 });
      if (this.paddle1.position.y < (this.PADDLE_SIZE)) {
        Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x, y: this.PADDLE_SIZE });
      }
    }

    if (this.leftArrowKeyRight) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x + 20, y: this.paddle1.position.y });
      if (this.paddle1.position.x > 400) {
        Matter.Body.setPosition(this.paddle1, { x: 400, y: this.paddle1.position.y });
      }
    }
    if (this.leftArrowKeyLeft) {
      Matter.Body.setPosition(this.paddle1, { x: this.paddle1.position.x - 20, y: this.paddle1.position.y });

      if (this.paddle1.position.x < this.PADDLE_SIZE) {
        Matter.Body.setPosition(this.paddle1, { x: this.PADDLE_SIZE, y: this.paddle1.position.y });
      }
    }


    const puck = this.puck;

    if (puck.velocity.x < 0 && this.puckDirection === 'right') {
      Matter.Body.applyForce(puck, { x: puck.position.x, y: puck.position.y }, { x: -this.PUCK_FORCE, y: 0 });
      this.puckDirection = 'left';
    }

    if (puck.velocity.x > 0 && this.puckDirection === 'left') {
      Matter.Body.applyForce(puck, { x: puck.position.x, y: puck.position.y }, { x: this.PUCK_FORCE, y: 0 });
      this.puckDirection = 'right';
    }

    if (puck.position.x > this.GAME_WIDTH - this.BORDER && !this.in_goal) {
      this.resetPuck(() => {
        this.score.playerOne++;
        this.pubSub.publish({
          type: 'PLAYER_1_SCORED',
          messageBody: null,
        });
      });
    } else if (puck.position.x < this.BORDER && !this.in_goal) {
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

    this.paddleone_ai(this.paddle2, 1);
  }

  resetPuck(cb: any) {
    this.in_goal = true;
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
      this.puck.visible = true;
      Matter.Body.setPosition(this.puck, { x: this.BALL_START_POINT_X, y: this.BALL_START_POINT_Y });
      setTimeout(() => {
        Matter.Body.setVelocity(this.puck, {
          x: ((Math.random() > 0.5) ? 1 : -1) * Math.floor((Math.random() * 7) + 6),
          y: ((Math.random() > 0.5) ? 1 : -1) * Math.floor((Math.random() * 7) + 6)
        });
      }, 500);
      this.in_goal = false;
      cb();
    }, 500);

  }

}
