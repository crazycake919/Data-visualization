const frmRate = 30;

let xScale = 1160; //1160
let yScale = 600;
let number = 200;

let numberScale = number / 10;
let xSize =xScale / number;
let ySize = yScale + 60;
let xOffSet = 60;
let yOffSet = 50;
let valueIncrease = Math.round(yScale / number);
let arr = Array.from(Array(number), (_, i) => i + 1);

// colors
let c1, c2;


let cnv;
let beep;
let startTime = 0;
let endTime = 0;
let started = false;
function initializeScene(n) {
    numberScale = n / 10;
    xSize =  xScale / n;
    ySize = yScale + 60;
    xOffSet = 60;
    valueIncrease = yScale / n;
    arr = Array.from(Array(n), (_, i) => i + 1);

    setRandom();
    drawEverything();
}
function preload() {
    beep = loadSound("beep.mp3");
}
function setup() {
    cnv = createCanvas(1280, 720);
    cnv.mouseClicked(start);
    frameRate(frmRate);

    setRandom();
    c1 = color("#0EDAF1"); // start
    c2 = color("#2418E7"); // end
    drawEverything();
    noLoop();

}

function draw() {

}

function start() {


    if (!started) {

        if (!isNaN($("#numbers").val()) && $("#numbers").val() == "") {
            return;
        }
        beep.loop();
        started = true;
        number = parseInt($("#numbers").val());
        initializeScene(number);

        //saveGif('BS.gif', 5);
        //asyncBS();
        asyncQS(0, number - 1);

    }


}

async function asyncBS() {
    startTime = performance.now();
    for (let i = 0; i < number; i++) {
        for (let j = 0; j < number - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                await sleep(0)
                drawEverything()
            }

        }

    }
    endTime = performance.now();
    let elapsed = endTime - startTime;
    console.log(elapsed);
    started = false;


}
async function asyncQS(begin, end) {

    if (begin == 0 && end == number - 1)
        startTime = performance.now();
    if (begin >= end) {
        if (begin == 0 && end == number - 1) {

            endTime = performance.now();
            let elapsed = endTime - startTime;
            console.log(elapsed);
            started = false;
            beep.pause();
        }
        return;

    }
    var mid;
    var w = arr[begin];
    var i = begin, j = end + 1;

    while (j >= begin) {
        if (i == j) {
            if (w > arr[j]) {
                swap(begin, j);
                await sleep(0)

                drawEverything()
            }
            mid = j;
            break;
        };
        j--;
        if (w >= arr[j]) {
            while (i <= end) {
                if (i == j) {
                    break;
                }
                i++;
                if (w <= arr[i]) {
                    swap(i, j);
                    await sleep(0)
                    let panning = map(j, 0, number, -0.8, 0.8);
                    let volume = map(j, 0, number, 0, 1);
                    volume = constrain(volume, 0.2, 0.6);
                    let speed = map(j, 0, number, 0.1, 0.5);
                    //speed = constrain(speed, 0.01, 4);
                    beep.rate(speed);
                    beep.amp(volume);
                    //beep.pan(panning);
                    drawEverything()

                    break;
                }
            }
        }
    }

    await asyncQS(begin, mid - 1);
    await asyncQS(mid + 1, end);



    // Record the end time and calculate elapsed time
    if (begin == 0 && end == number - 1) {

        endTime = performance.now();
        let elapsed = endTime - startTime;
        console.log(elapsed);
        started = false;
        beep.pause();
    }


}

function swap(i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
function sleep(millisecondsDuration) {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecondsDuration);
    })
}

function drawEverything() {

    background(0);
    lines();
    //rects

    stroke(0);
    strokeWeight(2);

    for (let i = 0; i < number; i++) {
        drawSquare(xSize * i + xOffSet, ySize, arr[i]);
    }
    //text
    stroke(255);
    textSize(15);
    strokeWeight(0.9);
    textAlign(RIGHT);

    for (let i = 0; i <= number; i++) {
        if (i % numberScale == 0) {
            push();
            translate(50, yScale + 65 - valueIncrease * i);
            rotate(-0.05 * PI);
            text(i, 0, 0);
            pop();
        }
    }

}

function lines() {
    //lines
    stroke(255);
    strokeWeight(1);
    for (let i = 1; i <= number; i++) {
        if (i % numberScale == 0) {
            line(xOffSet, yScale + 60 - valueIncrease * i, xOffSet + xScale, yScale + 60 - valueIncrease * i);
        }
    }
    stroke(255);
    strokeWeight(3);
    //x
    line(xOffSet - 1, ySize + 2, xOffSet + xScale + 5, ySize + 2);
    //y
    line(xOffSet - 3, yOffSet, xOffSet - 3, ySize + 2);
}

function drawSquare(x, y, value) {
    noFill();
    
    
    
    for (let i = x; i < x + xSize; i++) {
        
            let inter = map(value, 1, number, 0, 1);
            let smthing = 1.0/((number-1)*2)
            
            let neki = map(i, x, x + xSize, -smthing, smthing);
            inter += neki;
    
            inter = map(inter, 0.0 - smthing, 1.0 + smthing, 0, 1);
    
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            
            line(i, y, i, y - value * valueIncrease);

        
    }
}

function setRandom() {
    arr = shuffle(arr);
}