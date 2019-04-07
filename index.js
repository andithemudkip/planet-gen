const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');
const tumult = require('tumult');
const nameGen = require('./genName');

const noise = new tumult.Simplex1(Math.random() * 100);

const fs = require('fs');

const out = fs.createWriteStream(__dirname + '/output.png');

ctx.beginPath();
ctx.rect(0, 0, 512, 512);
ctx.fillStyle = "black";
ctx.fill();

let radius = 128;
let numNodes = 128;
let nodes = [],
    width = (radius * 2) + 50,
    height = width,
    offset = 100,
    opac = Math.random() * 75;

for(let i = 0; i < numNodes; i++) {
    let angle = (i / (numNodes/2)) * Math.PI;
    let n = noise.gen(((radius * Math.cos(angle)) + (width/2)) / 100, ((radius * Math.cos(angle)) + (width/2)) / 100);
    
    n*=20;
    // let n2 = noise.gen(((radius * Math.cos(angle)) + (width/2)) / 100, ((radius * Math.cos(angle)) + (width/2)) / 100);
    // n2*=20;
    let nn = 0; //nn = n
    let x = (radius * Math.cos(angle)) + (width/2) + nn; // +n
    let y = (radius * Math.sin(angle)) + (width/2) + nn; // +n
    n*=30;
    n /= 10;
    let grd = ctx.createRadialGradient(x + offset, y + offset, 0, x, y, Math.abs(n) * 30);

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let color = `rgba(${r}, ${g}, ${b}, $)`;
    grd.addColorStop(0, color.replace('$', Math.abs(n) / opac));
    grd.addColorStop(1, color.replace('$', '0'));
    
    nodes.push({x: x, y: y, gradient: grd});
}

ctx.beginPath();
ctx.moveTo(offset + nodes[0].x, offset + nodes[0].y);
for(let i = 0; i < nodes.length; i++) {
    // let n = noise.gen(nodes[i].x / 64, nodes[i].y / 64);
    //
    let n = Math.random() * Math.pow(-1, Math.round(Math.random()));
    let n2 = Math.random() * Math.pow(-1, Math.round(Math.random()));
    // n /= 5;
    // n2 /= 5;
    n = 0, n2 = 0;
    if(i != nodes.length - 1) {
        ctx.lineTo(offset + nodes[i + 1].x + n * 2, offset + nodes[i + 1].y + n2 * 2);
    } else {
        ctx.lineTo(offset + nodes[0].x + n * 2, offset + nodes[0].y + n2 * 2);
    }
}

ctx.closePath();
ctx.save();
ctx.clip();
loadImage('cheese.jpg').then(img => {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "blue";
    // ctx.drawImage(img, offset, offset, 300, 300);

    //color
    for(let i = 0; i < nodes.length; i++) {
        ctx.fillStyle = nodes[i].gradient;
        ctx.fill();
    }

    //shadows
    let rndx = Math.random() * 100 * Math.pow(-1, Math.round(Math.random()));
    let rndy = Math.random() * 100 * Math.pow(-1, Math.round(Math.random()));
    if(Math.random() < .25) { //original method
        for(let i = 0; i < nodes.length; i++) {
            let grd = ctx.createRadialGradient(nodes[i].x + offset + rndx, nodes[i].y + offset + rndy, 0, nodes[i].x + offset + rndx, nodes[i].y + offset + rndy, 128);
            grd.addColorStop(0, 'rgba(0, 0, 0, .05)');
            grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grd;
            ctx.fill();
        }
    } else { //smooth method
        rndx += 128;
        rndy += 128;
        let grd = ctx.createRadialGradient(rndx + offset, rndy + offset, 0, rndx + offset, rndy + offset, 256);
        grd.addColorStop(0, 'rgba(255, 255, 255, .15)');
        grd.addColorStop(0.25, 'rgba(0, 0, 0, .15)');
        grd.addColorStop(0.35, 'rgba(0, 0, 0, .20)');
        grd.addColorStop(0.5, 'rgba(0, 0, 0, .25)');
        grd.addColorStop(1, 'rgba(255, 255, 255, .25)');
        ctx.fillStyle = grd;
        ctx.fill();
    }
    
    ctx.stroke();
    ctx.restore();

    //overlay stuff
    ctx.fillStyle = "white";
    ctx.font = "40px Impact";
    ctx.fillText(nameGen.toUpperCase(), 20, 50);
    
    // let nodes1 = getNodes(64, 64, 64, 128, 128);

    // ctx.beginPath();
    // ctx.moveTo(offset + nodes1[0].x, offset + nodes1[0].y);
    // for(let i = 0; i < nodes1.length; i++) {
    //     // let n = noise.gen(nodes[i].x / 64, nodes[i].y / 64);
    //     //
    //     let n = Math.random() * Math.pow(-1, Math.round(Math.random()));
    //     let n2 = Math.random() * Math.pow(-1, Math.round(Math.random()));
    //     // n /= 5;
    //     // n2 /= 5;
    //     n = 0, n2 = 0;
    //     if(i != nodes1.length - 1) {
    //         ctx.lineTo(offset + nodes1[i + 1].x + n * 2, offset + nodes1[i + 1].y + n2 * 2);
    //     } else {
    //         ctx.lineTo(offset + nodes1[0].x + n * 2, offset + nodes1[0].y + n2 * 2);
    //     }
    // }


    // drawLandMass(0, 20, -50, -50);

    // drawLandMass(40, 56, 10, 20);

    // drawLandMass(100, 120, -50, -200);
    
    // let grd = ctx.createRadialGradient(nodes[0].x + 20, nodes[0].y - 20, 0, nodes[0].x, nodes[0].y, 50)
    // grd.addColorStop(0, "rgba(255, 255, 255, .75)");
    // grd.addColorStop(1, "rgba(255, 255, 255, 0)");
    // ctx.fillStyle = grd;
    // ctx.fill();
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('saved'));
}).catch(err => console.log(err));

/**
 * 
 * @param {number} num Number of nodes
 * @param {number} w Width
 * @param {number} radius Radius
 * @param {number} offx x offset [x position]
 * @param {number} offy y offset [y position]
 */

function getNodes(num, w, radius, offx, offy) {
    let nodes1 = [];
    for(let i = 0; i < num; i++) {
        let angle = (i / (num/2)) * Math.PI;
        let n = noise.gen(((radius * Math.cos(angle)) + (w/2)) / 100, ((radius * Math.cos(angle)) + (w/2)) / 100);
        
        n*=20;
        let nn = n; //nn = n
        let x = (radius * Math.cos(angle)) + (w/2) + nn; // +n
        let y = (radius * Math.sin(angle)) + (w/2) + nn; // +n
        n*=30;
        n /= 10;
        let grd = ctx.createRadialGradient(x + offx, y + offy, 0, x, y, Math.abs(n) * 30);
    
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        let color = `rgba(${r}, ${g}, ${b}, $)`;
        grd.addColorStop(0, color.replace('$', Math.abs(n) / opac));
        grd.addColorStop(1, color.replace('$', '0'));
        
        nodes1.push({x: x, y: y, gradient: grd});
    }
    return nodes1;
}



function drawLandMass(n1, n2, cp1, cp2) {
    ctx.beginPath();
    ctx.moveTo(nodes[n1].x + offset, nodes[n1].y + offset);
    ctx.bezierCurveTo(nodes[n1].x + offset + cp1, nodes[n1].y + offset, nodes[n2].x + offset + cp2, nodes[n2].y + offset, nodes[n2].x + offset, nodes[n2].y + offset);
    ctx.moveTo(nodes[n2].x + offset, nodes[n2].y + offset);
    if(n2 > n1) {
        for(let i = n2 - 1; i >= n1; i--) {
            ctx.lineTo(nodes[i].x + offset, nodes[i].y + offset);
        }
    } else {
        for(let i = n1; i < numNodes; i++) {
            ctx.lineTo(nodes[i].x + offset, nodes[i].y + offset);
        }
        for(let i = 0; i < n2; i++) {
            ctx.lineTo(nodes[i].x + offset, nodes[i].y + offset);
        }
    }
    
    ctx.fillStyle = "rgba(25, 0, 35, .75)";
    ctx.closePath();
    // ctx.stroke();
    ctx.fill();
}

// console.log(nameGen);