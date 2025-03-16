class Cube3D {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.size = 3;
      this.sides = {
        red: "rrrrrrrrr",
        orange: "ooooooooo",
        blue: "bbbbbbbbb",
        green: "ggggggggg",
        white: "wwwwwwwww",
        yellow: "yyyyyyyyy"
      };
      this.colors = {
        o: "orange",
        r: "red",
        w: "white",
        b: "blue",
        g: "green",
        y: "yellow"
      };
      this.Pi180 = Math.PI / 180;
      this.FRONT = 0;
      this.TOP = 1;
      this.RIGHT = 2;
      this.LEFT = 3;
      this.UP = 4;
      this.DOWN = 5;
      this.BACK = 6;
      this.Width = 0;
      this.Height = 0;
      this.tsin = Array(360);
      this.tcos = Array(360);
      this.R_N = 0;
      this.R_X = 1;
      this.R_Y = 2;
      this.R_Z = 3;
      this.viewDistance = 1500;
      this.scale = 1.9;
      this.cam = { x: 0, y: 0, z: 0 };
      this.cubeRot = { x: 360 - 35, y: 40, z: 360 - 25 };
      this.pbuf = [];
    }
  
    init(cv, sz) {
      if (typeof cv !== "undefined") {
        if (typeof cv === "string") cv = document.querySelector(cv);
        this.ctx = cv.getContext("2d");
        this.canvas = cv;
        this.Width = cv.width;
        this.Height = cv.height;
        if (typeof sz === "undefined") sz = 3;
        if (sz < 2) sz = 2;
        this.size = sz;
      }
  
      this.sides["red"] = "rrrrrrrrr";
      this.sides["orange"] = "ooooooooo";
      this.sides["blue"] = "bbbbbbbbb";
      this.sides["green"] = "ggggggggg";
      this.sides["white"] = "wwwwwwwww";
      this.sides["yellow"] = "yyyyyyyyy";
  
      for (let i = 0; i < 360; i++) {
        this.tsin[i] = Math.sin(i * this.Pi180);
        this.tcos[i] = Math.cos(i * this.Pi180);
      }
  
      this.rot_cubies = [];
      this.rotSidePos = {
        F: { pos: [], axis: this.R_Z },
        B: { pos: [], axis: this.R_Z },
        R: { pos: [], axis: this.R_X },
        L: { pos: [], axis: this.R_X },
        U: { pos: [], axis: this.R_Y },
        D: { pos: [], axis: this.R_Y },
        S: { pos: [], axis: this.R_Z },
        E: { pos: [], axis: this.R_X },
        M: { pos: [], axis: this.R_Y }
      };
  
      const s = this.size;
      const ss = s * s;
  
      for (let i = 0; i < ss; i++) this.rotSidePos["F"].pos.push(i); // front
      for (let i = 0; i < ss; i++) this.rotSidePos["B"].pos.push(i + ss * (s - 1)); // back
      for (let j = 0; j < s; j++)
        for (let i = 0; i < s; i++)
          this.rotSidePos["U"].pos.push(i + j * ss); // up
      for (let j = 0; j < s; j++)
        for (let i = 0; i < s; i++)
          this.rotSidePos["D"].pos.push(s * (s - 1) + i + j * ss); // down
  
      for (let i = 0; i < s; i++) {
        this.rotSidePos["L"].pos.push(ss * i); // left
        this.rotSidePos["L"].pos.push(ss * i + s * (s - 1));
      }
      for (let j = 0; j < s; j++)
        for (let i = s; i < s + s - 2; i++)
          this.rotSidePos["L"].pos.push(i + ss * j); // left
  
      for (let i = 0; i < s; i++) {
        this.rotSidePos["R"].pos.push(ss * i + s - 1); // right
        this.rotSidePos["R"].pos.push(ss * i + ss - 1); // s*(s-1)+s-1
      }
      for (let j = 0; j < s; j++)
        for (let i = s + s - 2; i < s + s - 2 + s - 2; i++)
          this.rotSidePos["R"].pos.push(i + ss * j); // right
    }
  
    rotate3d_x(p, a) {
      const py = p.y;
      const pz = p.z;
      const sa = this.tsin[a];
      const ca = this.tcos[a];
      p.y = py * ca - pz * sa;
      p.z = py * sa + pz * ca;
    }
  
    rotate3d_y(p, a) {
      const px = p.x;
      const pz = p.z;
      const sa = this.tsin[a];
      const ca = this.tcos[a];
      p.x = px * ca + pz * sa;
      p.z = -px * sa + pz * ca;
    }
  
    rotate3d_z(p, a) {
      const px = p.x;
      const py = p.y;
      const sa = this.tsin[a];
      const ca = this.tcos[a];
      p.x = px * ca - py * sa;
      p.y = px * sa + py * ca;
    }
  
    rotate3d(pts, angle) {
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (angle.x) this.rotate3d_x(p, angle.x);
        if (angle.y) this.rotate3d_y(p, angle.y);
        if (angle.z) this.rotate3d_z(p, angle.z);
      }
    }
  
    project(pts) {
      for (let i = 0; i < pts.length; i++) {
        const z = pts[i].z - this.viewDistance;
        const scale = this.viewDistance / z;
        pts[i].x = this.Width / 2 + (pts[i].x * scale) / this.scale;
        pts[i].y = this.Height / 2 - (pts[i].y * scale) / this.scale - this.Height / (12 * this.scale);
        pts[i].z = Math.floor(pts[i].z);
      }
    }
  
    translate3d(pts, t) {
      for (let i = 0; i < pts.length; i++) {
        pts[i].x += t.x;
        pts[i].y += t.y;
        pts[i].z += t.z;
      }
    }
  
    bar3d(ctx, pts, fcolor, scolor, lwidth) {
      for (let i = 0; i < pts.length; i += 4) {
        ctx.beginPath();
        ctx.fillStyle = fcolor;
        ctx.lineWidth = lwidth;
        ctx.strokeStyle = scolor;
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
        ctx.lineTo(pts[i + 2].x, pts[i + 2].y);
        ctx.lineTo(pts[i + 3].x, pts[i + 3].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.fill();
      }
    }
  
    drawCube(W, H, rt, angle) {
      for (let i = 0; i < this.size; i++)
        this.drawlayer3d(i, this.Width, this.Height, this.rotSidePos[rt], angle);
    }
  
    draw(par) {
      let angle = 0;
      let size = this.size;
      if (typeof par === "undefined" || par == null) {
        return;
      } else {
        if ("size" in par) size = par.size;
        if ("angle" in par) angle = par.angle;
        if ("layer" in par) layer = par.layer;
      }
  
      this.drawCube(this.Width, this.Height, layer, angle);
  
      this.pbuf.sort(this.sortfunc);
  
      this.ctx.clearRect(0, 0, this.Width, this.Height);
      this.ctx.globalAlpha = 0.65;
      for (let i in this.pbuf) {
        this.project(this.pbuf[i].pts);
        this.bar3d(this.ctx, this.pbuf[i].pts, this.pbuf[i].color, "black", 0.5);
      }
      this.pbuf = [];
    }
  
    sortfunc(a, b) {
      const p1 = a.pts;
      const p2 = b.pts;
      let da = [];
      let db = [];
  
      if (typeof a.dist === "undefined" || typeof b.dist === "undefined") {
        a.dist = [];
        b.dist = [];
        for (let i = 0; i < 4; i++) {
          da = Math.sqrt(p1[i].x * p1[i].x + p1[i].y * p1[i].y + (p1[i].z - 2000) * (p1[i].z - 2000));
          db = Math.sqrt(p2[i].x * p2[i].x + p2[i].y * p2[i].y + (p2[i].z - 2000) * (p2[i].z - 2000));
          a.dist[i] = da;
          b.dist[i] = db;
        }
      }
      let aa = 0;
      let bb = 0;
      for (let i = 0; i < 4; i++) {
        aa += a.dist[i];
        bb += b.dist[i];
      }
      return bb - aa;
    }
  }
  
  let angl = 0;
  let ry = 0;
  let rz = 0;
  
  function drawCube() {
    cube.cubeRot.y = ry;
    cube.draw({ angle: rz, layer: "U" });
  
    angl += 2;
    ry += 2;
    rz += 1;
    if (angl >= 358) angl = 0;
    if (rz >= 358) rz = 0;
    if (ry >= 358) ry = 0;
  }
  
  const cube = new Cube3D();
  cube.init("#cubecv", 3);
  cube.draw();
  setInterval(drawCube, 50);