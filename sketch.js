let video;
let handpose;
let predictions = [];
let numbers = [];
let selected = -1;

function setup() {
  createCanvas(800, 600);
  background(255, 182, 193); // 粉紅色背景
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });

  // 隨機產生1~10的數字及位置
  for (let i = 1; i <= 10; i++) {
    numbers.push({
      value: i,
      x: random(100, width - 100),
      y: random(100, height - 100)
    });
  }
}

function modelReady() {
  console.log("Handpose model ready!");
}

function draw() {
  background(255, 182, 193);
  image(video, 0, 0, width, height);

  // 畫出數字
  textAlign(CENTER, CENTER);
  textSize(48);
  for (let i = 0; i < numbers.length; i++) {
    fill(i === selected ? 'yellow' : 'white');
    stroke(0);
    strokeWeight(2);
    ellipse(numbers[i].x, numbers[i].y, 70, 70);
    fill(0);
    noStroke();
    text(numbers[i].value, numbers[i].x, numbers[i].y);
  }

  // 偵測手指
  if (predictions.length > 0) {
    let hand = predictions[0];
    let tip = hand.landmarks[8]; // 食指指尖
    fill(0, 255, 0);
    noStroke();
    ellipse(tip[0], tip[1], 20, 20);

    // 檢查是否碰到數字
    selected = -1;
    for (let i = 0; i < numbers.length; i++) {
      let d = dist(tip[0], tip[1], numbers[i].x, numbers[i].y);
      if (d < 35) {
        selected = i;
        // 移動數字
        numbers[i].x = tip[0];
        numbers[i].y = tip[1];
        break;
      }
    }
  }
}