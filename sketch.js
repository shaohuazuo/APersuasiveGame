const game_width = 1020;
const game_height = 800;
const data_width = 300;
const role_width = 60;
const role_height = 80;
const crystal_price = 5000;

var gambling_n = 0;
var story_process = 0;

var step_sound;
var win_sound;
var lost_sound;
var printing_sound;
var attack_sound;
var buy_sound;
var wrong_sound;
var main_bgm;
var home_bgm;
var shop_bgm;
var open_bgm;
var end_bgm;

var state;

var pics;
var cristal_png;
var ro_png;
var player_png;
var json;
var wife_png;
var png;
var ani_pic;
var seller_png;

var player;

var current_bgm;
var current_map;
var field_map;
var home_map;
var map_str1;
var map_str2;
var map_str3;

var count = 0;

var gambling_mode = false;
var story_finished = false;
var story1_start = false;
var story2_start = false;
var story3_start = false;
var story4_start = false;
var story1_finished = false;
var story2_finished = false;
var story3_finished = false;
var story4_finished = false;

var localStorage;
var gambling_state;
var reset_button;
var gameArea;
var gambling_result = "";
var gambling_ui;
var yes_button;
var no_button;

function preload() {
  // load any assets (images, sounds etc.) here

  // load sounds
  printing_sound = loadSound("assets/se/printing.mp3");
  attack_sound = loadSound("assets/se/attack.wav");
  step_sound = loadSound("assets/se/step.ogg");
  win_sound = loadSound("assets/se/win.ogg");
  lost_sound = loadSound("assets/se/lost.ogg");
  buy_sound = loadSound("assets/se/buy.ogg");
  wrong_sound = loadSound("assets/se/wrong.ogg");
  main_bgm = loadSound("assets/bgm/main.ogg");
  home_bgm = loadSound("assets/bgm/home.mid.ogg");
  shop_bgm = loadSound("assets/bgm/shop.mid.ogg");
  open_bgm = loadSound("assets/bgm/open.mid.ogg");
  end_bgm = loadSound("assets/bgm/end.mid.ogg");

  // load graphics
  cristal_png = loadImage("assets/Crystal.png");
  png = loadImage("assets/all.png");
  ani_pic = loadImage("assets/animals.png");
  player_png = loadImage("assets/player.png");
  wife_png = loadImage("assets/wife.png");
  ro_png = loadImage("assets/ro.png");
  seller_png = loadImage("assets/seller.png");

  //load data
  json = loadJSON("assets/png_list.json");
  map_str1 = loadStrings("assets/map1.txt");
  map_str2 = loadStrings("assets/map2.txt");
  map_str3 = loadStrings("assets/map3.txt");
}
function setup() {
  createCanvas(game_width + data_width, game_height);
  current_bgm = open_bgm;
  player = new newPlayer(1, 1);
  field_map = stringToMap(map_str1);
  home_map = stringToMap(map_str2);
  shop_map = stringToMap(map_str3);
  current_map = field_map;
  background("black");
  pics = {
    'w':wife_png,
    's':seller_png
  }
  state = {
    map: "field",
    gold: 50,
    bullet: 0,
    score: 0,
    high_score: 0,
    window_width: game_width / role_width,
    window_height: game_height / role_height,
    field: {shop:{x:1, y:8}, home:{x:1, y:1}, bgm: main_bgm, map: field_map},
    shop:{x:15, y:2, bgm:shop_bgm, map:shop_map},
    home:{x:15, y:7, bgm:home_bgm, map:home_map}
  };
  gambling_state = { bond: 10, p: [100, 90, 90, 80, 80, 80, 60, 20, 0, 0] };
  if (window.localStorage) {
    localStorage = window.localStorage;
    let s = localStorage.getItem("high");
    s = int(s);
    if (s > state.high_score) {
      state.high_score = s;
    } else {
      localStorage.setItem("high", str(state.high_score));
    }
  }
  game_width + 80, 610, data_width - 160, 30;
  reset_button = { l: 1070, t: 700, r: 1270, b: 750 };
  gameArea = { l: 0, t: 0, r: game_width + data_width, b: game_height };
  gambling_ui = { l: 200, t: 300, r: 900, b: 700 };
  yes_button = { l: 250, t: 600, r: 400, b: 650 };
  no_button = { l: 450, t: 600, r: 600, b: 650 };

  printing_sound.play();
}
function draw() {
  // your persuasive arcade game code goes here
  // but its also a good idea to write some functions
  // which deal with specific parts of your game (like drawing things)
  count++;
  if (!current_bgm.isPlaying()) {
    current_bgm.play();
  }
  background("gray");
  draw_frame();
  strokeWeight(1);
  init_story(story_process);
  draw_map();
  draw_player(player);
  draw_information(story_process);
  draw_gambling();
  finish_story(story_process);
}
function buyBullet() {
  if (state.gold >= 50) {
    buy_sound.play();
    state.gold -= 50;
    state.bullet += 100;
  } else {
    wrong_sound.play();
  }
}
function buyCrystal() {
  if (state.gold >= 5000) {
    buy_sound.play();
    state.gold -= 5000;
    current_bgm.stop();
    current_bgm = end_bgm;
    story_process = 4;
  } else {
    wrong_sound.play();
  }
}
function draw_back(x, y) {
  let pos_x = role_width * x;
  let pos_y = game_height - role_height * (y + 1);
  let pos;
  switch (state.map) {
    case "field":
      pos = json.grass;
      break;
    case "shop":
      pos = json.floor2;
      break;
    case "home":
      pos = json.floor1;
      break;
  }
  image(
    png,
    pos_x,
    pos_y,
    role_width,
    role_height,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
}
function draw_bullet_seller(x, y) {
  let pos_x = role_width * x;
  let pos_y = game_height - role_height * (y + 1);
  let pos = json.table1;
  image(
    png,
    pos_x,
    pos_y,
    role_width,
    role_height,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
  pos = json.arrow;
  image(
    png,
    pos_x,
    pos_y + 10,
    role_width,
    role_height - 30,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
}
function draw_crystal(x, y) {
  let pos_x = role_width * x;
  let pos_y = game_height - role_height * (y + 1);
  let pos = json.table2;
  image(
    png,
    pos_x,
    pos_y,
    role_width,
    role_height,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
  image(cristal_png, pos_x + 10, pos_y, role_width - 20, role_width - 20);
}
function draw_enemy(x, y) {
  let t_x = role_width * x;
  let t_y = game_height - role_height * (y + 1);
  let n = int(current_map[x][y]);
  let pos;
  if (n <= 5) {
    pos = json.sq;
  } else if (n <= 10) {
    pos = json.hawk;
  } else if (n <= 20) {
    pos = json.fox;
  } else if (n <= 30) {
    pos = json.deer;
  } else if (n <= 40) {
    pos = json.worf;
  } else {
    pos = json.bear;
  }
  image(
    ani_pic,
    t_x,
    t_y,
    role_width,
    role_height - 20,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
  push();
  strokeWeight(1);
  textSize(16);
  stroke("pink");
  fill("red");
  text(current_map[x][y], t_x + 5, t_y + 5, 20, 15);
  pop();
}
function draw_frame() {
  push();
  stroke("white");
  strokeWeight(5);
  fill("black");
  rect(0, 0, game_width, game_height);
  noFill();
  rect(game_width, 0, data_width, game_height);
  pop();
}
function draw_gambling() {
  if (story_process != 3) {
    return;
  }
  push();
  strokeWeight(5);
  stroke("white");
  fill("black");
  rect(
    gambling_ui.l,
    gambling_ui.t,
    gambling_ui.r - gambling_ui.l,
    gambling_ui.b - gambling_ui.t
  );
  strokeWeight(0);
  fill("white");
  textFont("Fira Code");
  textSize(24);
  let pre = 50;
  if (gambling_result != "") {
    text(gambling_result, gambling_ui.l + 20, gambling_ui.t + 10, 650, pre);
  } else {
    pre = 0;
  }
  text(
    "Your bond will be " +
    str(gambling_state.bond) +
    " in the next run. Earn this number of gold if you win, and lose the same number if you miss it.",
    gambling_ui.l + 20,
    gambling_ui.t + 10 + pre,
    650,
    120
  );
  text(
    "Would you participate in this run?",
    gambling_ui.l + 20,
    gambling_ui.t + 130 + pre,
    650,
    200
  );
  strokeWeight(3);
  fill("black");
  if (mouseInArea(yes_button)) {
    fill("gray");
  }
  rect(
    yes_button.l,
    yes_button.t,
    yes_button.r - yes_button.l,
    yes_button.b - yes_button.t
  );
  fill("black");
  if (mouseInArea(no_button)) {
    fill("gray");
  }
  rect(
    no_button.l,
    no_button.t,
    no_button.r - no_button.l,
    no_button.b - no_button.t
  );
  strokeWeight(0);
  fill("white");
  text("YES", yes_button.l + 50, yes_button.t + 10, 50, 30);
  text("NO", no_button.l + 50, no_button.t + 10, 50, 30);
  pop();
}
function draw_information(n) {
  if (n < 2) {
    return;
  }
  push();
  strokeWeight(0);
  fill("white");
  textSize(18);
  textFont("Fira Code");
  if (state.high_score < state.score) {
    state.high_score = state.score;
    localStorage.setItem("high", str(state.high_score));
  }
  text(
    "High Score:  " + state.high_score,
    game_width + 20,
    40,
    data_width - 40,
    50
  );
  text(
    "     Score:  " + state.score,
    game_width + 20,
    100,
    data_width - 40,
    50
  );

  text("      Gold:  " + state.gold, game_width + 20, 230, data_width - 40, 50);
  text(
    "    Arrows:  " + state.bullet,
    game_width + 20,
    270,
    data_width - 40,
    50
  );
  stroke('white');
  strokeWeight(2);
  textSize(24);
  fill('green');
  text(
    "CONTROL:\n  w : move up\n  s : move down\n  a : move left\n  d : move right\n\nGo hunting and earn money to buy the crystal!",
    game_width + 20,
    350,
    data_width - 40,
    300
  );
  strokeWeight(0);
  textFont("Arial");
  textSize(32);
  fill("lightblue");
  text("Player have:", game_width + 20, 175, data_width - 40, 50);
  if (mouseInArea(reset_button)) {
    fill("blue");
  }
  rect(
    reset_button.l,
    reset_button.t,
    reset_button.r - reset_button.l,
    reset_button.b - reset_button.t
  );
  fill("black");
  if (mouseInArea(reset_button)) {
    fill("white");
  }
  text(
    "RESET",
    reset_button.l + 50,
    reset_button.t + 8,
    reset_button.r - reset_button.l,
    reset_button.b - reset_button.t
  );

  if (state.map == "shop") {
    fill("yellow");
    text("Price:", 20, 10, 200, 50);
    textFont("Fira Code");
    textSize(18);
    fill("white");
    text("     Crystal : 5000", 20, 60, 300, 50);
    text(" Arrow x 100 : 50", 20, 110, 300, 50);
    textFont("Baskerville");
    textSize(26);
    textStyle(ITALIC);
    if (gambling_n == 0) {
      text(
        "Need money? Why don't you try gambling?\n\nFor this time, your wining probability is 100%!",
        20,
        200,
        300,
        250
      );
    } else {
      text("Need money? Why don't you try gambling?", 20, 200, 300, 250);
    }
  }
  pop();
}
function draw_map() {
  if (story_process <= 1 || story_process == 100) {
    return;
  }
  for (let i = 0; i < current_map.length; i++) {
    for (let j = 0; j < current_map[0].length; j++) {
      switch (locType(i, j)) {
        case -1:
          break;
        case 0:
          draw_back(i, j);
          draw_wall(i, j);
          break; // wall
        case 1:
        case 2:
          draw_back(i, j);
          draw_path(i, j, false);
          break; // to home and shop
        case 3:
          draw_back(i, j);
          draw_crystal(i, j);
          break; // crystal
        case 4:
          draw_back(i, j);
          draw_path(i, j, true);
          break; // to filed
        case 8:
          draw_back(i, j);
          draw_object(i, j);
          break;
        case 5:
          draw_back(i, j);
          draw_enemy(i, j);
          break; // enemy
        case 7:
          draw_back(i, j);
          draw_ro(i, j);
          break;
        case 6:
          draw_back(i, j);
          draw_bullet_seller(i, j);
          break;
        case 9:
          draw_back(i, j);
          if (state.map != "field") break;
          let r = random(0, 100);
          if (r <= 0.02 && i > 1 && (i != player.x || j != player.y)) {
            current_map[i][j] = str(int(random(1, 10)));
            if (r <= 0.01) {
              current_map[i][j] = str(int(random(1, 50)));
            }
          }
          break;
        case 10:
          draw_back(i,j);
          draw_object(i, j);
          break;
      }
    }
  }
}
function draw_path(x, y, inverse) {
  if (inverse) {
    return;
  } else {
    let pos_x = role_width * x;
    let pos_y = game_height - role_height * (y + 1);
    let pos = json.home;
    let str = "HOME";
    if (y > 1) {
      pos = json.shop;
      str = "SHOP";
    }
    image(
      png,
      pos_x,
      pos_y,
      role_width,
      role_height - 20,
      pos[0],
      pos[1],
      pos[2],
      pos[3]
    );
    push();
    strokeWeight(2);
    textSize(16);
    stroke("black");
    fill("yellow");
    text(str, pos_x + 5, pos_y + 63, 20, 15);
    pop();
  }
}
function draw_player(p) {
  if (story_process <= 1 || story_process == 100) {
    return;
  }
  let pos;
  let pos_x = role_width * p.x;
  let pos_y = game_height - role_height * (p.y + 1);
  let d = player.direction;
  let f = int(frameCount / 20) % 3;
  pos = player.pics[d][f];
  image(
    player_png,
    pos_x,
    pos_y+10,
    role_width,
    role_width,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
}
function draw_object(x, y){
  let pos_x = role_width * x;
  let pos_y = game_height - role_height * (y + 1);
  let pos = json[current_map[x][y]];
  let img = pics[current_map[x][y]];
  image(
    img,
    pos_x,
    pos_y+10,
    role_width,
    role_width,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
}
function draw_ro(x, y) {
  let pos_x = role_width * x;
  let pos_y = game_height - role_height * (y + 1);
  let pos = json.table1;
  image(
    png,
    pos_x,
    pos_y,
    role_width,
    role_height,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
  image(ro_png, pos_x + 10, pos_y + 20, role_width - 20, role_height - 50);
}
function draw_wall(x, y) {
  let pos_x = role_width * x;
  let pos_y = game_height - role_height * (y + 1);
  let pos;
  switch (state.map) {
    case "field":
      pos = json.tree;
      break;
    case "shop":
      pos = json.wall2;
      break;
    case "home":
      pos = json.wall1;
      break;
  }
  image(
    png,
    pos_x,
    pos_y,
    role_width,
    role_height,
    pos[0],
    pos[1],
    pos[2],
    pos[3]
  );
}
function finish_story(n) {
  if (n < 4) {
    return;
  }
  background("black");
  let s = 3.6;
  let story1 =
    "Finally you got enough money to buy your wife a crystal, by continuing hunting, rather than gambling!";
  let story2 =
    "Now you know that gambling never make you rich, you won't loose too much in this game, but in the reality it's more cruel!";
  let story3 =
    "You may lose everything you have, if you keep doing that. Not only the money, but even your family!";
  let story4 =
    "Your final score is " +
    state.score +
    ". Please remember: NEVER ADDICTED TO GAMBLING!";
  let story5 = "Press any key to restart ...";
  push();
  strokeWeight(0);
  fill("white");
  textSize(32);
  if (!story1_start) {
    printing_sound.play();
    count = 0;
    story1_start = true;
  } else if (!story1_finished && story1_start && count / s <= story1.length) {
    text(story1.substr(0, min(count / s, story1.length)), 200, 50, 800, 700);
  } else if (!story2_start) {
    printing_sound.play();
    count = 0;
    story2_start = true;
    story1_finished = true;
  } else if (!story2_finished && story2_start && count / s <= story2.length) {
    text(story1, 200, 50, 800, 700);
    text(story2.substr(0, min(count / s, story2.length)), 200, 250, 800, 700);
  } else if (!story3_start) {
    printing_sound.play();
    count = 0;
    story3_start = true;
    story2_finished = true;
  } else if (!story3_finished && story3_start && count / s <= story3.length) {
    text(story1, 200, 50, 800, 700);
    text(story2, 200, 250, 800, 700);
    text(story3.substr(0, min(count / s, story3.length)), 200, 450, 800, 700);
  } else if (!story4_start) {
    printing_sound.play();
    count = 0;
    story4_start = true;
    story3_finished = true;
  } else if (!story4_finished && story4_start && count / s <= story4.length) {
    text(story1, 200, 50, 800, 700);
    text(story2, 200, 250, 800, 700);
    text(story3, 200, 450, 800, 700);
    text(story4.substr(0, min(count / s, story3.length)), 200, 650, 800, 700);
  } else {
    if (!story4_finished) {
      story4_finished = true;
      count = 0;
    } else {
      text(story1, 200, 50, 800, 700);
      text(story2, 200, 250, 800, 700);
      text(story3, 200, 450, 800, 700);
      text(story4, 200, 650, 800, 700);
      text(story5.substr(0, min(count / s, story3.length)), 200, 750, 800, 700);
      story_finished = true;
    }
  }
}
function gamble() {
  let bond = gambling_state.bond;
  if (state.gold < bond) {
    lost_sound.play();
    return "No enough gold!";
  }
  let n = gambling_n;
  let p = gambling_state.p[n];
  let r = random(0, 100);
  console.log(gambling_n, r);
  if (r <= p) {
    gambling_n++;
    gambling_state.bond *= 2;
    state.gold += bond;
    win_sound.play();
    return "WIN! You earned " + str(bond) + " gold in this run!";
  } else {
    gambling_n = 0;
    gambling_state.bond = 10;
    state.gold -= bond;
    lost_sound.play();
    return "MISS. You lost your bond in this run.";
  }
}
function init_map(i, j) {
  let new_map = new Array();
  for (let x = 0; x < i; x++) {
    new_map[x] = new Array();
    for (let y = 0; y < j; y++) {
      new_map[x][y] = "_";
      if (x == 0 || y == 0 || x == i - 1 || y == j - 1) {
        console.log("!!");
        new_map[x][y] = "@";
      }
    }
  }
  return new_map;
}
function init_story(n) {
  if (n > 1) {
    return;
  }
  background("black");
  let s = 3.6;
  let story =
    "Today is the Wedding Anniversary of you and your wife, and you want to get a cristal for her as the gift.";
  push();
  strokeWeight(0);
  fill("white");
  textSize(32);
  if (n == 0) {
    text(story.substr(0, min(count / s, story.length)), 200, 300, 800, 700);
    if (count / s > story.length) {
      story_process++;
    }
  } else if (n == 1) {
    printing_sound.stop();
    text(story, 200, 300, 800, 700);
  }
  pop();
}
function keyTyped() {
  if (story_process < 2) {
    story_process++;
    if (story_process == 2) {
      current_bgm.stop();
      current_bgm = main_bgm;
    }
    return;
  }
  if (story_process == 3) {
    return;
  }
  if (story_process == 4 && story_finished) {
    reset();
  } else if (story_process == 4) {
    return;
  }
  console.log(key);
  switch (key) {
    case "W":
    case "w":
      player.moveUp();
      break;
    case "S":
    case "s":
      player.moveDown();
      break;
    case "A":
    case "a":
      player.moveLeft();
      break;
    case "D":
    case "d":
      player.moveRight();
      break;
  }
}
function locType(x, y) {
  switch (current_map[x][y]) {
    case " ":
      return -1; //outside
    case "@":
      return 0; // wall
    case "#":
      return 2; // shop
    case "&":
      return 1; // home
    case "c":
      return 3; // crystal
    case "_":
      return 9; // empty
    case "-":
      return 4; // field
    case "/":
      return 4; // field
    case "*":
      return 4; // field
    case "b":
      return 6; // bullet
    case "d":
      return 7; // gambling
    case "w":
      return 8; // wife
    case 's':
      return 10; // seller
    default:
      return 5; // enemy
  }
}
function mouseClicked(fxn) {
  if (story_process <= 1 && mouseInArea(gameArea)) {
    story_process++;
    if (story_process == 2) {
      current_bgm.stop();
      current_bgm = main_bgm;
    }
  } else if (mouseInArea(reset_button) && story_process == 2) {
    reset();
  } else if (mouseInArea(yes_button) && story_process == 3) {
    gambling_result = gamble();
  } else if (mouseInArea(no_button) && story_process == 3) {
    gambling_result = "";
    story_process = 2;
  }
}
function mouseInArea(area) {
  if (
    mouseX >= area.l &&
    mouseX <= area.r &&
    mouseY >= area.t &&
    mouseY <= area.b
  ) {
    return true;
  }
  return false;
}
function reset() {
  field_map = stringToMap(map_str1);
  player.x = 1;
  player.y = 1;
  state.gold = 50;
  state.bullet = 0;
  state.score = 0;
  current_map = field_map;
  state.map = "field";
  story_process = 0;
  count = 0;
  current_bgm.stop();
  current_bgm = open_bgm;
  story_finished = false;
  story1_start = false;
  story2_start = false;
  story3_start = false;
  story4_start = false;
  story1_finished = false;
  story2_finished = false;
  story3_finished = false;
  story4_finished = false;
  printing_sound.play();
}
function stringToMap(strings) {
  let x = strings.length;
  let y = strings[0].length;
  let new_map = init_map(x, y);
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      new_map[i][j] = strings[i][j];
    }
  }
  return new_map;
}
function transferTo(m){
  current_bgm.stop();
  current_bgm = state[m].bgm;
  current_map = state[m].map;
  let x, y;
  if(m == 'field'){
    x = state[m][state.map].x;
    y = state[m][state.map].y;
  }else{
    x = state[m].x;
    y = state[m].y;
  }
  state.map = m;
  player.x = x;
  player.y = y;
}


class newPlayer {
  constructor(loc_x, loc_y) {
    this.x = loc_x;
    this.y = loc_y;
    this.direction = "d";
    this.pics = {
      d: [json.player_d1, json.player_d2, json.player_d3],
      l: [json.player_l1, json.player_l2, json.player_l3],
      r: [json.player_r1, json.player_r2, json.player_r3],
      u: [json.player_u1, json.player_u2, json.player_u3]
    };
    return this;
  }
  moveUp() {
    let x = this.x;
    let y = this.y + 1;
    this.direction = "u";
    this.moveTo(x, y);
  }
  moveDown() {
    let x = this.x;
    let y = this.y - 1;
    this.direction = "d";
    this.moveTo(x, y);
  }
  moveLeft() {
    let x = this.x - 1;
    let y = this.y;
    this.direction = "l";
    this.moveTo(x, y);
  }
  moveRight() {
    let x = this.x + 1;
    let y = this.y;
    this.direction = "r";
    this.moveTo(x, y);
  }
  moveTo(x, y) {
    step_sound.play();
    switch (current_map[x][y]) {
      case "@":
        return; // wall
      case "#":
        transferTo("shop");
        break; // shop
      case "&":
        transferTo('home');
        break; // home
      case "_":
        this.x = x;
        this.y = y;
        break; // empty
      case "-":
      case "/":
      case "*":
        transferTo('field');
        break; // field
      case "b":
        buyBullet();
        break; // buy bullet
      case "c":
        buyCrystal();
        break;
      case "d":
        story_process = 3;
        break; // gambling
      case "w": // wife
      case "s": // seller
        return;
      default:
        let e = int(current_map[x][y]);
        if (e <= state.bullet) {
          attack_sound.play();
          current_map[x][y] = "_";
          state.score += 2 * e;
          state.gold += 2 * e;
          state.bullet -= e;
          this.x = x;
          this.y = y;
        } else {
          wrong_sound.play();
        }
        break; // enemy
    }
  }
}
