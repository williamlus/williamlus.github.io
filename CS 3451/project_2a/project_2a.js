/**
 * Bicycles are replicated by object instancing.
*/

let time = 0;  // track the passage of time, used to move the objects
let polygonCnt=0;
let barAngle=0;
let barDir=1;
let dBarAngle=0.3;
let maxBarAngle=30;
let tiltAngle=0;
// let roadLength=10;
let roadLength=13;
let roadWidth=1;
let roadDepth=0.1;
let gridCols=20;
let gridSize=20;
let gridRows;
let roadGrid;
let randomIdx=0;
let roadScale=400;
let treeViewed=0;
let randomArr=[];
let init_pos=-300;
let bikePositions=[init_pos,init_pos,init_pos];
let bikeSpeeds=[8,8,8];
let minSpeed=7;
let maxSpeed=9;
let bikeAccs=[0,0,0];
let wheelRotations=[0,0,0];
let colors=[[[200,100,100],[200,80,80]],[[100,200,100],[80,200,80]],[[100,100,200],[80,80,200]]];
let colorTexts=['red','green','blue'];
let hasWinner=false;
let cameraRotation=0;

// called once at the start
function setup() {
  let seed=new Date().getTime();
  // let seed=1645070654157;
  console.log('random seed: '+seed);
  randomSeed(seed);
  createCanvas(800, 600, WEBGL);
  
  let fov = 60.0;  // 60 degrees FOV
  perspective(PI * fov / 180.0, width / height, 10, 2000);

  gridRows=int(gridCols/roadWidth*roadLength)+1;;
  for(let i=0;i<100;i++){
    randomArr[i]=random(0,1);
  }
}

// this is called repeatedly to draw new per-frame images
function draw() {
  treeViewed=0;
  randomIdx=0;
  background(173, 216, 255);  // light blue background
  polygonCnt=0;
  
  // set the virtual camera position
  let viewPos=min(bikePositions);
  // let totalTime=int(2*roadLength*roadScale/(minSpeed+maxSpeed));
  let totalTime=int(roadLength*roadScale/(maxSpeed*1.1));
  if(cameraRotation<Math.PI/2)
    cameraRotation+=Math.PI/2/totalTime
  let xRot=init_pos*Math.sin(cameraRotation);
  let zRot=init_pos*Math.cos(cameraRotation);
  camera(xRot, -200, viewPos-zRot, 0, 0, min(bikePositions), 0, 1, 0);  // from, at, up
  
  ambientStrength=150;
  directionalStrength=250;
  // pointStrength=200;
  // include some light even in shadows
  ambientLight(ambientStrength,ambientStrength,ambientStrength);
  
  // set light position
  directionalLight(directionalStrength,directionalStrength,directionalStrength,1,1,1);
  // pointLight(pointStrength,pointStrength,pointStrength,0,-100,min(bikePositions));

  noStroke();  // do not draw polygon outlines

  driveBikes(hasWinner);

  push();
  scale(roadScale);
  drawRoad();
  pop();

  time += 1;  // update the time

  let minPos=min(bikePositions);
  if(!hasWinner && minPos<=-roadLength*roadScale+150){
    bikeSpeeds=[0,0,0];
    hasWinner=true;
    let idx=bikePositions.indexOf(minPos);
    let msg='The '+colorTexts[idx]+' bike wins the race!';
    console.log(msg);
  }

}

function driveBikes(hasWinner=false){
  let acc;
  for(let i=0;i<3;i++){
    if(hasWinner) acc=0;
    else acc=random(-0.1,0.1);
    if(!hasWinner) bikeSpeeds[i]=max(minSpeed,min(bikeSpeeds[i]+acc,maxSpeed));
    let wheelSpeed=bikeSpeeds[i]/19;
    wheelRotations[i]+=wheelSpeed/Math.PI*180;
    bikePositions[i]-=bikeSpeeds[i];
    push();
    translate(roadScale/3*(i-1),0,bikePositions[i]);
    scale(5);
    translate(0,-19/5,0);
    rotateY(Math.PI/2);
    drawBike(0,wheelRotations[i],wheelRotations[i],colors[i][0],colors[i][1]);
    pop();
  }

}

function drawRoad(){
  push();
  rotateX(Math.PI/2);
  push();
  fill(70,60,50);
  translate(0,-roadLength/2,-roadDepth/2);
  box(roadWidth,roadLength,roadDepth);
  pop();
  fill(150,150,150);
  push();
  translate(-roadWidth/6,-roadLength/2,0.01/roadScale);
  plane(roadWidth/15,roadLength);
  pop();
  push();
  translate(roadWidth/6,-roadLength/2,0.01/roadScale);
  plane(roadWidth/15,roadLength);
  pop();
  fill(200,200,170);
  for(let i=0;i<49;i++){
    push();
    translate(0,-roadLength/50*i,0.005/roadScale);
    plane(roadWidth,roadWidth/45);
    pop();
  }
  push();
  fill(255,0,0);
  translate(0,-roadLength/50*49,0.005/roadScale);
  plane(roadWidth,roadWidth/30);
  pop();
  fill(139,185,45);
  push();
  translate(-roadWidth*0.75,0,0);
  drawLawn();
  pop();
  push();
  translate(roadWidth*0.75,0,0);
  drawLawn();
  pop();
  pop();
}

function drawLawn(){
  push();
  translate(0,-roadLength/2,0);
  plane(roadWidth/2,roadLength);
  pop();
  for(let i=int(30*randomArr[randomIdx]+20);i<gridRows;i+=int(30*randomArr[randomIdx]+20)){
    let h=roadLength/gridRows*i;
    push();
    translate(0,-h,0);
    rotateX(-Math.PI/2);
    scale(roadWidth/40);
    drawTree();
    pop();
    randomIdx=(randomIdx+1)%randomArr.length    
  }
}

function drawTree(detailX=4,detailY=4){
  push();
  treeHeight=10;
  fill(139,69,19);
  translate(0,-treeHeight/2,0);
  cylinder(1,treeHeight,detailX,detailY);
  pop();
  fill(119,59,0);
  let rootLength=treeHeight/2;
  for(let i=0;i<4;i++){
    push();
    rotateY(Math.PI/2*i);
    translate(0,0,rootLength/2);
    rotateX(Math.PI/2);
    cone(rootLength/4,rootLength,detailX,detailY);
    pop();
  }
  fill(50,200,50);
  push();
  translate(0,-treeHeight,0);
  sphere(5,detailX=detailX,detailY=detailY);
  pop();
  push();
  translate(0,-treeHeight+2,0);
  scale(1.5,1.2,1.5);
  push();
  translate(0,0,1.732/3*2);
  sphere(3,detailX=detailX,detailY=detailY);
  pop();
  push();
  translate(1,0,-1.732/3);
  sphere(3,detailX=detailX,detailY=detailY);
  pop();
  push();
  translate(-1,0,-1.732/3);
  sphere(3,detailX=detailX,detailY=detailY);
  pop();
  pop();
  treeViewed+=1;
}

/** points2D: array of 2D points in counter-clockwise order
 *  The polygon should be convex
 *  */
function drawPolygon(points2D){
  let points=getP5Vector(points2D);
  drawPolygonHelper(points);
}

/** points2D: array of 3D points in counter-clockwise order
 *  The polygon should be convex
 *  */ 
function drawPolygon3D(points3D){
  let points=getP5Vector(points3D);
  drawPolygonHelper(points);
}

function drawPolygonHelper(vectors){
  const n_pts=vectors.length;
  let indices=new Array(n_pts-2);
  for(let i=1;i<n_pts-1;i++)
    indices[i-1]=[0,i,i+1];
  model(new p5.Geometry(1,1,
    function(){
      vectors.forEach(pt => this.vertices.push(pt));
      indices.forEach(idx => this.faces.push(idx));
      this.computeNormals();
      this.gid='Polygon-'+polygonCnt;
      polygonCnt+=1;
  }));
}

/** height along z-axis
 */
function drawPrism(points2D,height){
  push();
  translate(0,0,height/2);
  drawPolygon(points2D);
  pop();push();
  translate(0,0,-height/2);
  drawPolygon(points2D.slice().reverse());
  pop();
  const n_pts=points2D.length;
  let x_prev=points2D[n_pts-1][0];
  let y_prev=points2D[n_pts-1][1];
  let x_curr,y_curr;
  for(let i=0;i<n_pts;i++){
    x_curr=points2D[i][0];
    y_curr=points2D[i][1];
    let vertices=[
      [x_curr,y_curr,height/2],
      [x_prev,y_prev,height/2],
      [x_prev,y_prev,-height/2],
      [x_curr,y_curr,-height/2]
    ];
    drawPolygon3D(vertices);
    x_prev=x_curr;
    y_prev=y_curr;
  }
}

/** upperPoints3D and lowerPoints3D have one to one correspondence */
function drawPolyhedron3D(upperPoints3D,lowerPoints3D,drawTop=true,drawBottom=true){
  if(drawTop) drawPolygon3D(upperPoints3D);
  if(drawBottom) drawPolygon3D(lowerPoints3D.slice().reverse());
  const n_pts=upperPoints3D.length;
  for(let i=0;i<n_pts;i++){
    let i_next=(i+1)%n_pts;
    let vertices=[
      upperPoints3D[i_next],
      upperPoints3D[i],
      lowerPoints3D[i],
      lowerPoints3D[i_next]
    ];
    drawPolygon3D(vertices);
  }
}

function getP5Vector(arr){
  const n_pts=arr.length;
  const dim=arr[0].length;
  if(dim!=2 && dim!=3){
    throw "Wrong dimension in getP5Vector()!";
  }
  let points=new Array(n_pts);
  if(dim==2){
    for(let i=0;i<n_pts;i++)
      points[i]=new p5.Vector(arr[i][0],arr[i][1],0);
  }
  else{
    for(let i=0;i<n_pts;i++)
      points[i]=new p5.Vector(arr[i][0],arr[i][1],arr[i][2]);
  }
  return points;
}

function drawBike(barAngle=0,backWheelAngle=0,frontWheelAngle=0,frameColor=[200,100,100],handleColor=[200,80,80]){
  push();
  translate(-5,0,0);
  push();
  scale(19/5);
  drawWheel(wheelAngle=backWheelAngle);
  pop();push();
  translate(5,0,0);
  drawFrame(0.3,0.5,rodColor=frameColor);
  pop();
  push();
  let angle=Math.PI/180*60;
  translate(5,0,0);
  rotateZ(-Math.PI/180*20);
  translate(11*Math.sin(angle),-11/2,0);
  rotateY(-Math.PI/2);
  drawHandleBar(barAngle,frontWheelAngle,0.3,0.5,handleColor);
  pop();
  push();
  translate(5,0,0);
  drawPedalPair(backWheelAngle*0.5,0.3,0.5);
  pop();
  pop();
}

function drawPedalPair(pedalAngle=0,rodRadius=0.3,wheelSectionRadius=0.5,pedalColor=[50,50,50],metalColor=[180,180,180]){
  push();
  translate(0,0,wheelSectionRadius*2.5);
  drawPedal(pedalAngle,pedalColor,metalColor);
  pop();
  push();
  translate(0,0,-wheelSectionRadius*2.5);
  rotateZ(Math.PI);
  rotateY(Math.PI);
  drawPedal(-pedalAngle,pedalColor,metalColor);
  pop();
  push();
  rotateX(Math.PI/2);
  fill(metalColor);
  cylinder(rodRadius,wheelSectionRadius*5);
  pop();
}

function drawPedal(rotateAngle=0,pedalColor=[50,50,50],metalColor=[180,180,180]){
  let sectionNumber=5;
  let points2D=new Array(sectionNumber+1+2);
  let radius=0.3;
  let theta=0;
  let dt=Math.PI/sectionNumber;
  let i;
  for(i=0;i<=sectionNumber;i++){
    points2D[i]=[radius*Math.cos(theta),-radius*Math.sin(theta)];
    theta+=dt;
  }
  let pedalHeight=2;
  points2D[i]=[-radius,pedalHeight];
  points2D[i+1]=[radius,pedalHeight];
  points2D.reverse();
  push();
  rotateZ(Math.PI/180*rotateAngle);
  push();
  fill(metalColor);
  drawPrism(points2D,radius/4);
  pop();
  fill(pedalColor);
  push();
  translate(0,pedalHeight,0);
  rotateY(Math.PI/2);
  rotateZ(Math.PI/2);
  cylinder(radius/2,radius);
  pop();
  push();
  let height=5;
  let depth=1;
  let scaling=0.2;
  translate(0,pedalHeight,(height+3)*scaling/2);
  rotateZ(-Math.PI/180*rotateAngle);
  rotateX(Math.PI/2);
  scale(scaling);
  box(1,height,depth);
  push();
  translate(-2,0,0);
  box(1,height,depth);
  pop();
  push();
  translate(2,0,0);
  box(1,height,depth);
  pop();
  push();
  translate(0,-0.5-height/2,0);
  box(5,1,depth);
  pop();
  push();
  translate(0,0.5+height/2,0);
  box(5,1,depth);
  pop();
  pop();pop();
}

function drawHandleBar(barAngle=0,wheelAngle=0,rodRadius=0.3,wheelSectionRadius=0.5,rodColor=[200,80,80]){
  push();
  rotateY(Math.PI/180*barAngle);
  fill(rodColor);
  cylinder(rodRadius,4);
  push();
  translate(0,2,0);
  rotateZ(Math.PI/2);
  cylinder(rodRadius,2);
  pop();
  push();
  translate(-wheelSectionRadius*1.5,5.5,0);
  cylinder(rodRadius,7);
  pop();push();
  translate(wheelSectionRadius*1.5,5.5,0);
  cylinder(rodRadius,7);
  pop();push();
  translate(0,-2,-0.5);
  rotateY(Math.PI/2);
  rotateZ(Math.PI/2);
  cylinder(rodRadius,1);
  pop();
  push();
  translate(0,-2);
  sphere(0.25);
  pop();
  push();
  translate(0,-2,-1);
  rotateZ(Math.PI/2);
  cylinder(rodRadius*0.75,8);
  pop();
  push();
  translate(0,9,0);
  scale(19/5);
  rotateY(Math.PI/2);
  drawWheel(wheelAngle=wheelAngle);
  pop();
  pop();
}

/** sectionNumber: precision of the circle of the section (>=1),
 * rotationNumber: precision of the rotation (>=2),
 * rodDensity: density of the rods
 */
function drawWheel(wheelAngle=0,sectionNumber=3,rotationNumber=12,rodDensity=0.5,
  wheelColor=[50,50,50],metalColor=[127,127,127],plateColor=[180,180,180]){
    // Initialize parameters
    let wheel_radius=10;
    let rod_radius=1/4;
    let plate_radius=2;
    let plate_height=1/4;
    
  push();
  rotateZ(Math.PI/180*wheelAngle);
  rotateY(Math.PI/2);
  scale(1/10);
  let points=[];
  let theta=0;
  let dTheta=Math.PI/sectionNumber;
  for(let i=0;i<=sectionNumber;i++){
    points[i]=[Math.cos(theta),Math.sin(theta),0];
    theta+=dTheta;
  }
  points=points.concat([
    [-1,-0.5,0],
    [-1/3,-1,0],
    [1/3,-1,0],
    [1,-0.5,0]
  ]);
  let points2=[
    [-1/3,-1+wheel_radius,0],
    [-1/3,-1.5+wheel_radius,0],
    [1/3,-1.5+wheel_radius,0],
    [1/3,-1+wheel_radius,0]
  ];
  
  for(let j=0;j<points.length;j++){
    let p=points[j];
    points[j]=[p[0],p[1]+wheel_radius,p[2]];
  }
  let dPhi=Math.PI*2/rotationNumber;
  let c=Math.cos(dPhi);
  let s=Math.sin(dPhi);
  let rotation_matrix=Create_Matrix([
    1,0,0,
    0,c,s,
    0,-s,c],3,3); // transpose of rotation matrix
  let rod_skip_num=int(1/rodDensity);
  for(let j=0;j<rotationNumber;j++){
    let next_points=matmul(points,rotation_matrix);
    let next_points2=matmul(points2,rotation_matrix);
    fill(wheelColor);
    // draw the plastic parts of the wheel
    drawPolyhedron3D(next_points,points,false,false);
    fill(metalColor);
    // draw the metal parts of the wheel
    drawPolyhedron3D(next_points2,points2,false,false);
    if(j%rod_skip_num==0){
      // draw rods
      push();
      rotateX(Math.PI*2/rotationNumber*j);
      translate(0,-wheel_radius/2);
      fill(metalColor);
      cylinder(rod_radius,wheel_radius);
      pop();
    }
    points=next_points;
    points2=next_points2;
  }
  // draw plates
  fill(plateColor);
  push();
  translate(rod_radius,0,0);
  rotateY(Math.PI/2);
  rotateX(Math.PI/2);
  cylinder(plate_radius,plate_height);
  pop();push();
  translate(-rod_radius,0,0);
  rotateY(Math.PI/2);
  rotateX(Math.PI/2);
  cylinder(plate_radius,plate_height);
  pop();push();
  // translate(-rod_radius,0,0);
  rotateY(Math.PI/2);
  rotateX(Math.PI/2);
  cylinder(plate_radius/2,rod_radius*16);
  pop();pop();
}
/** Draw the frame of the bicycle. */
function drawFrame(rodRadius,wheelSectionRadius,rodColor=[200,200,200],plateColor=[180,180,180]){
  let smallRatio=0.5;
  fill(rodColor);
  push();
  translate(0,0,rodRadius*smallRatio/2+wheelSectionRadius*1.5);
  push();
  translate(0,0,1/10+rodRadius*smallRatio);
  rotateX(Math.PI/2);
  fill(plateColor);
  cylinder(1,1/5);
  pop();push();
  translate(-2.5,0,0);
  rotateZ(Math.PI/2);
  cylinder(rodRadius*smallRatio,5);
  pop();push();
  translate(-2.5,0,-rodRadius*smallRatio-wheelSectionRadius*3);
  rotateZ(Math.PI/2);
  cylinder(rodRadius*smallRatio,5);
  pop();pop();
  let angle=Math.PI/180*70;
  let length=2.5/Math.cos(angle);
  push();
  translate(-(length+1)*Math.cos(angle)/2,-(length+1)*Math.sin(angle)/2,0);
  rotateZ(-Math.PI/2+angle);
  cylinder(rodRadius,length+1);
  pop();
  
  // thin rods
  push();
  let triangleH=1.5;
  let width=3*wheelSectionRadius;
  let thinLength=length-triangleH;
  let triangleA=Math.PI/180*50;
  let sideH=0.5*width/Math.cos(triangleA);
  translate(-5,0,0);
  rotateZ(Math.PI/2-angle); 
  rotateY(Math.PI/2);
  push();
  translate(0,-thinLength,0);
  push();
  translate(-width/2,0,0);
  rotateZ(Math.PI/2-triangleA);
  translate(0,-sideH/2,0);
  cylinder(rodRadius*smallRatio,sideH);
  pop();push();
  translate(width/2,0,0);
  rotateZ(-Math.PI/2+triangleA);
  translate(0,-sideH/2,0);
  cylinder(rodRadius*smallRatio,sideH);
  pop();push();
  rotateZ(Math.PI/2);
  cylinder(rodRadius*smallRatio,width);
  pop();pop();push();
  translate(-width/2,-thinLength/2,0);
  cylinder(rodRadius*smallRatio,thinLength);
  pop();push();
  translate(width/2,-thinLength/2,0);
  cylinder(rodRadius*smallRatio,thinLength);
  pop();pop();
  
  push();
  rotateX(Math.PI/2);
  cylinder(rodRadius,wheelSectionRadius*4);
  pop();push();
  translate(0.5-(length+1)*Math.cos(angle),-(length+1)*Math.sin(angle),0);
  rotateY(Math.PI/2);
  rotateX(Math.PI/2);
  drawSeat();
  pop();
  angle=Math.PI/180*60;
  push();
  rotateZ(-angle/3);
  push();
  let diagLength=11;
  length=diagLength*Math.sin(angle);
  translate(length/2,-diagLength/2,0);
  rotateZ(Math.PI/2);
  cylinder(rodRadius,length);
  pop();push();
  rotateZ(angle);
  translate(0,-diagLength/2,0);
  cylinder(rodRadius,diagLength);
  pop();push();
  translate(diagLength*Math.sin(angle),-diagLength/2,0);
  cylinder(rodRadius,4);
  pop();pop();

}

function drawSeat(seatColor=[80,80,80]){
  let seatHeight=0.4;
  let lowerPoints=[
    [-1,-1,-seatHeight/2],
    [1,-1,-seatHeight/2],
    [1/3,1,-seatHeight/2],
    [-1/3,1,-seatHeight/2]];
  let shrink=0.8;
  let upperPoints=[
    [-shrink,-shrink,seatHeight/2],
    [shrink,-shrink,seatHeight/2],
    [shrink/3,shrink,seatHeight/2],
    [-shrink/3,shrink,seatHeight/2]];
  fill(seatColor);
  scale(1.5);
  drawPolyhedron3D(upperPoints,lowerPoints);
  }

/** Matrix multiplication of m by n and n by k matrices */
function matmul(A,B){
  const m=A.length;
  const n=A[0].length;
  const k=B[0].length;
  var re=Zero_Matrix(m,k);
  for(let i=0;i<m;i++){
    for(let j=0;j<k;j++){
      for(let t=0;t<n;t++){
        re[i][j]+=A[i][t]*B[t][j]
      }
    }
  }
  return re;
}

/** Initialization of an m by n zero matrix */
function Zero_Matrix(m,n){
  var mat=new Array(m);
  for(let i=0;i<m;i++){
    mat[i]=new Array(n);
    for(let j=0;j<n;j++){
      mat[i][j]=0;
    }
  }
  return mat;
}

/** Create an m by n matrix by row with values in arr or 0 if used up */
function Create_Matrix(arr,m,n){
  var cnt=0;
  var not_used_up=(cnt<arr.length);
  var mat=Zero_Matrix(m,n);
  for(let i=0;i<m;i++){
    for(let j=0;j<n;j++){
      if(not_used_up){
        mat[i][j]=arr[cnt++];
        not_used_up=(cnt<arr.length);
      }
      else{
        mat[i][j]=0;
      }
    }
  }
  return mat;
}
