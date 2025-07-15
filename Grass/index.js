var grass = []
var substeps = 1;
var can = document.getElementById("canvas");
var ctx = can.getContext("2d");
can.width = window.innerWidth;
can.height = window.innerHeight;
//The following are the code for the mouse events
var m = { x: can.width / 2, y: can.height / 2, taken: false }
var clicked = false;
can.ontouchstart = function (event) {
  clicked = true;
  m.x = event.touches[0].clientX;
  m.y = event.touches[0].clientY;
}
can.ontouchmove = function (event) {
  m.x = event.touches[0].clientX;
  m.y = event.touches[0].clientY;
}
can.onmousedown = function (event) {
  clicked = true;
  m.x = event.clientX;
  m.y = event.clientY;
}
can.onmousemove = function (event) {
  m.x = event.clientX;
  m.y = event.clientY;
}
can.onmouseup = function (event) {
  clicked = false;
}
can.ontouchend = function (event) {
  clicked = false;
}
function dis(x, y, x2, y2) {
  //This function returns the distance between two points. Uses Pythagoras theorem
  return Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2);
}
function randFrom(min, max) {
  //This function chooses randomly from a minimum to a maximum value
  return Math.random() * (max - min) + min;
}
function randBet(c1, c2) {
  //This function returns a randomly choses member of the pair
  var nArr = [c1, c2];
  return nArr[randFrom(0, 1)];
}
var curveArray = []
function curveVertex(px, py, context, active) {
  curveArray.push({ x: px, y: py })
  var length = curveArray.length
  if (length == 4) {
    var tan1 = { x: (curveArray[2].x - curveArray[0].x) / 4, y: (curveArray[2].y - curveArray[0].y) / 4 }
    var tan2 = { x: (curveArray[1].x - curveArray[3].x) / 4, y: (curveArray[1].y - curveArray[3].y) / 4 }
    context.bezierCurveTo(curveArray[1].x + tan1.x, curveArray[1].y + tan1.y, curveArray[2].x + tan2.x, curveArray[2].y + tan2.y, curveArray[2].x, curveArray[2].y);
    curveArray.shift()
  } else if (length == 2) {
    context.moveTo(curveArray[1].x, curveArray[1].y)
  }
  if (active !== undefined && active == false) {
    curveArray = []
  }
}
can.ontouchend = function () {
}
function Vector(x, y) {
  //This object function creates a 2d Vector
  this.x = x;
  if (x == undefined) { this.x = 0 }
  this.y = y;
  if (y == undefined) { this.y = 0 }
  this.mag = function () {
    return dis(0, 0, this.x, this.y);
  }
  this.dir = function () {
    if (this.mag() !== 0) {
      return Math.atan2(this.y, this.x)
    }
  }
  this.add = function (v) {
    this.x += v.x;
    this.y += v.y;
  }
  this.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
  }
  this.mult = function (n) {
    this.x *= n;
    this.y *= n;
  }
  this.div = function (n) {
    this.x /= n;
    this.y /= n;
  }
  this.makeMag = function (m) {
    if (this.mag() !== 0) {
      this.div(this.mag());
      this.mult(m);
    } else {
      return;
    }
  }
  this.limit = function (l) {
    if (this.mag() > l) {
      this.makeMag(l);
    } else {
      return;
    }
  }
  this.connect = function (v) {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(v.x, v.y);
    ctx.stroke();
  }
  this.get = function () {
    return new Vector(this.x, this.y);
  }
}
var PVector = {
  add: function (v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y)
  },
  sub: function (v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y)
  },
  dot: function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
  },
  mult: function (v, s) {
    return new Vector(v.x * s, v.y * s)
  },
  div: function (v, s) {
    return new Vector(v.x / s, v.y / s)
  },
  clamp: function (v, mag) {
    var V = v.get()
    V.makeMag(mag)
    return V
  }
}
function applySpringForce(p1, p2, l, k, d) {
  //This function applies a spring force on points p1 and p2 at minimum length(l),stiffness(k) and drag(d). Uses Hooke's Law
  var disp, e, elF, norm, diff, dF, sF;
  disp = dis(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y)
  e = disp - l
  elF = k * e
  norm = PVector.sub(p2.pos, p1.pos)
  norm.makeMag(1)
  diff = PVector.sub(p2.vel, p1.vel)
  dF = PVector.dot(norm, diff) * d
  sF = PVector.sub(p2.pos, p1.pos)
  sF.makeMag(elF + dF)
  if (!p1.locked) {
    p1.applyForce(sF)
  }
  sF.mult(-1)
  if (!p2.locked) {
    p2.applyForce(sF)
  }
}

function Particle(x, y) {
  //This function creates a particle
  this.pos = new Vector(x, y)
  this.r = 0
  this.mField = { rad: 100, mag: 12 }
  var mForce;
  //The oscillating wave that controls the wind
  var wave = { angVel: 0.05, amplitude: 0.5, waveLength: can.width, phase: 0 }
  this.mass = 1
  if (this.mass == Infinity) {
    this.invMass = 0
  } else {
    this.invMass = 1 / this.mass
  }
  this.restitution = 1;
  this.locked = false
  this.vel = new Vector()
  this.acc = new Vector()
  this.borderControlPush = function () {
    if (this.pos.x < 0 || this.pos.x > can.width) {
      this.pos.x = Math.min(Math.max(this.pos.x, 0), can.width)
      this.vel.x *= -this.restitution
    }
    if (this.pos.y < 0 || this.pos.y > can.height) {
      this.pos.y = Math.min(Math.max(this.pos.y, 0), can.height)
      this.vel.y *= -this.restitution
    }
  }
  this.applyForce = function (f) {
    var F = f.get()
    F.mult(this.invMass)
    this.acc.add(F)
  }
  this.upd = function () {
    if (!this.locked) {
      mForce = PVector.sub(this.pos, m)
      mForce.makeMag((this.mField.rad - mForce.mag()) / this.mField.rad * this.mField.mag)
      if (clicked && dis(m.x, m.y, this.pos.x, this.pos.y) < this.mField.rad) {
        this.applyForce(mForce)
      }
      var initPhase = 2 * Math.PI * this.pos.x / wave.waveLength
      if (Math.sin(wave.phase - initPhase) > 0.97) {
        this.acc.x += wave.amplitude * (Math.sin(wave.phase - initPhase) + 1)
      }
      wave.phase += wave.angVel
      this.vel.add({ x: this.acc.x / substeps, y: this.acc.y / substeps })
      //this.vel.add(this.acc)
      this.pos.add({ x: this.vel.x / substeps, y: this.vel.y / substeps })
      this.borderControlPush()
      //this.pos.add(this.vel)
    }
    this.acc.mult(0)
  }
  this.show = function () {
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
    ctx.fill()
  }
}
function Blade(x, y, dir, baseLength, stiffness, drag) {
  //This function creates a blade of grass and specifies its direction(dir),base length, stiffness and drag
  this.shrinkVal = 0.8
  var base = new Particle(x, y)
  var col = "hsl(" + randFrom(85, 120) + ",100%," + randFrom(20, 45) + "%)"
  this.l1 = baseLength
  this.l2 = baseLength * this.shrinkVal
  this.l3 = baseLength * this.shrinkVal * this.shrinkVal
  this.node1 = new Particle(x + dir.x * this.l1, y + dir.y * this.l1)
  this.node2 = new Particle(x + dir.x * (this.l1 + this.l2), y + dir.y * (this.l1 + this.l2))
  this.node3 = new Particle(x + dir.x * (this.l1 + this.l2 + this.l3), y + dir.y * (this.l1 + this.l2 + this.l3))
  this.show = function () {
    ctx.strokeStyle = col
    ctx.lineWidth = 4
    ctx.beginPath()
    curveVertex(x, y, ctx)
    curveVertex(x, y, ctx)
    curveVertex(this.node1.pos.x, this.node1.pos.y, ctx)

    curveVertex(this.node2.pos.x, this.node2.pos.y, ctx)
    curveVertex(this.node3.pos.x, this.node3.pos.y, ctx)

    curveVertex(this.node3.pos.x, this.node3.pos.y, ctx, false)
    ctx.stroke()
    this.node1.show()
    this.node2.show()
    this.node3.show()
  }
  this.upd = function () {
    this.anc1 = {
      pos: { x: x + dir.x * this.l1, y: y + dir.y * this.l1 },
      vel: { x: 0, y: 0 },
      locked: true
    }
    this.anc2 = {
      pos: PVector.add(PVector.clamp(PVector.sub(this.node1.pos, base.pos), this.l2), this.node1.pos),
      vel: { x: 0, y: 0 },
      locked: true
    }
    this.anc3 = {
      pos: PVector.add(PVector.clamp(PVector.sub(this.node2.pos, this.node1.pos), this.l3), this.node2.pos),
      vel: { x: 0, y: 0 },
      locked: true
    }
    applySpringForce(this.node1, this.anc1, 0, stiffness, drag)
    applySpringForce(this.node2, this.anc2, 0, stiffness, drag)
    applySpringForce(this.node3, this.anc3, 0, stiffness, drag)
    applySpringForce(base, this.node1, this.l1, stiffness, drag)
    applySpringForce(this.node1, this.node2, this.l2, stiffness, drag)
    applySpringForce(this.node2, this.node3, this.l3, stiffness, drag)
    this.node1.upd()
    this.node2.upd()
    this.node3.upd()
  }
}
// --- Firefly code start ---
// var fireflies = [];
// var FIREFLY_COUNT = 30;
// function Firefly() {
//   this.x = randFrom(0, can.width);
//   this.y = randFrom(0, can.height * 0.7);
//   this.radius = randFrom(1.5, 3.5);
//   this.baseAlpha = randFrom(0.12, 0.22);
//   this.flickerSpeed = randFrom(0.01, 0.03);
//   this.flickerPhase = randFrom(0, Math.PI * 2);
//   this.vx = randFrom(-0.15, 0.15);
//   this.vy = randFrom(-0.07, 0.07);
//   this.color = `rgba(255,${Math.floor(randFrom(220, 255))},100,1)`;
//   this.update = function () {
//     this.x += this.vx;
//     this.y += this.vy;
//     // Bounce off edges
//     if (this.x < 0 || this.x > can.width) this.vx *= -1;
//     if (this.y < 0 || this.y > can.height * 0.8) this.vy *= -1;
//     // Flicker phase
//     this.flickerPhase += this.flickerSpeed;
//   };
//   this.draw = function (ctx) {
//     var flicker = this.baseAlpha + 0.12 * Math.sin(this.flickerPhase + Math.sin(this.flickerPhase * 0.7));
//     ctx.save();
//     ctx.globalAlpha = Math.max(0, flicker);
//     var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
//     grad.addColorStop(0, this.color);
//     grad.addColorStop(0.5, 'rgba(255,255,180,0.5)');
//     grad.addColorStop(1, 'rgba(255,255,180,0)');
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius * 4, 0, 2 * Math.PI);
//     ctx.fillStyle = grad;
//     ctx.fill();
//     ctx.restore();
//   };
// }
// --- Firefly code end ---
function gameMake() {
  //This function sets up the simulation
  var num = 400
  for (i = 0; i < num; i++) {
    var variety = 0.06
    var ang = -Math.PI / 2 + randFrom(-variety, variety)
    grass.push(new Blade((i + 1) / (num + 1) * can.width, can.height, { x: Math.cos(ang), y: Math.sin(ang) }, randFrom(50, 80), 0.3, 0.3))
  }
  // // Add fireflies
  // fireflies = [];
  // for (var f = 0; f < FIREFLY_COUNT; f++) {
  //   fireflies.push(new Firefly());
  // }
}
function gameMove() {
  //This function animates the simulation
  ctx.lineWidth = 1
  ctx.clearRect(0, 0, can.width, can.height);
  // Draw fireflies in the background
  // for (var f = 0; f < fireflies.length; f++) {
  //   fireflies[f].update();
  //   fireflies[f].draw(ctx);
  // }
  ctx.textAlign = "center"
  ctx.strokeStyle = "white"
  ctx.font = "40px Calibri"
  ctx.strokeText("Use the mouse to push the grass around", can.width / 2, 300)
  for (i = 0; i < grass.length; i++) {
    grass[i].show()
    for (j = 0; j < substeps; j++) {
      grass[i].upd()
    }
  }
  requestAnimationFrame(gameMove)
}
gameMake()
gameMove()
