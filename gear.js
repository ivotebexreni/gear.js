// Desing method: Involute Curve
// Source: http://www.cartertools.com/involute.html

// Source for planetary gears:
// http://www.mekanizmalar.com/transmission.html
// https://www.youtube.com/watch?v=MeyAR8qAOwo

// Revmove a data from a array
Array.prototype.remove = function(index){
	this.splice(index, 1);
}

// Prototype for the new classes
function GearProto(){
  // Methods:
  // setId(): Change the Id of the gear
  // translate(): Translate (move) the gear by a vector
  // gearOff(): Turn the gear invisible
  // gearOn(): Restore the gear style to the default layout (the same it was when created, if invisible turns visible again)
  // guideOff(): Make the guide invisible
  // guideOn(): Restore the guide style to the default layout (the same it was when created)
  // pitchOff(): Restore the guide default layout
  // pitchOn(): Restore the pitch style to the default layout (the same it was when created)
  // copyApperance(): Apply to the gear the style of other one
  // delete(): Delete a gear and its children
}

GearProto.prototype = new Object();

GearProto.prototype.setId = function(){
  var newId = Math.random();
  if(this.drew){
    this.setTagsId(newId);
  }
  this.id = newId;
  for(var i=0; i<this.children.length; i++){
    this.children[i].setId();
  }
}

GearProto.prototype.translate = function(vec){
	this.c.add(vec);
  for(var i=0; i<this.children.length; i++){
    this.children[i].translate(vec);
  }
  this.redraw();
}

GearProto.prototype.gearOff = function(){
  this.gearFillColor = "none";
  this.gearFillOpacity = 0;
  this.gearStrokeOpacity = 0;
  this.gearStrokeWidth = 0;
  this.gearStrokeColor = "none";

  this.guideOff();
  this.pitchOff();

  this.redraw();
}

GearProto.prototype.gearOn = function(){
  this.gearFillColor = "none";
  this.gearFillOpacity = 1;
  this.gearStrokeOpacity = 1;
  this.gearStrokeWidth = 0.2;
  this.gearStrokeColor = "black";

  this.guideOn();
  this.pitchOn();

  this.redraw();
}

GearProto.prototype.guideOff = function(){
  this.guideFillColor = "none";
  this.guideFillOpacity = 0;
  this.guideStrokeOpacity = 0;
  this.guideStrokeWidth = 0;
  this.guideStrokeColor = "none";

  this.redraw();
}

GearProto.prototype.pitchOff = function(){
  this.pitchFillColor = "none";
  this.pitchFillOpacity = 0;
  this.pitchStrokeOpacity = 0;
  this.pitchStrokeWidth = 0;
  this.pitchStrokeColor = "none";

  this.redraw();
}

GearProto.prototype.guideOn = function(){
  this.guideFillColor = "none";
  this.guideFillOpacity = 1;
  this.guideStrokeOpacity = 1;
  this.guideStrokeWidth = 0.2;
  this.guideStrokeColor = "black";

  this.redraw();
}

GearProto.prototype.pitchOn = function(){
  this.pitchFillColor = "none";
  this.pitchFillOpacity = 1;
  this.pitchStrokeOpacity = 1;
  this.pitchStrokeWidth = 0.2;
  this.pitchStrokeColor = "black";

  this.redraw();
}

GearProto.prototype.copyApperance = function(g){
  this.gearFillColor = g.gearFillColor;
  this.gearFillOpacity = g.gearFillOpacity;
  this.gearStrokeOpacity = g.gearStrokeOpacity;
  this.gearStrokeWidth = g.gearStrokeWidth;
  this.gearStrokeColor = g.gearStrokeColor;

  this.guideFillColor = g.guideFillColor;
  this.guideFillOpacity = g.guideFillOpacity;
  this.guideStrokeOpacity = g.guideStrokeOpacity;
  this.guideStrokeWidth = g.guideStrokeWidth;
  this.guideStrokeColor = g.guideStrokeColor;

  this.pitchFillColor = g.pitchFillColor;
  this.pitchFillOpacity = g.pitchFillOpacity;
  this.pitchStrokeOpacity = g.pitchStrokeOpacity;
  this.pitchStrokeWidth = g.pitchStrokeWidth;
  this.pitchStrokeColor = g.pitchStrokeColor;
}

GearProto.prototype.delete = function(){
  for(var i=0; i<this.children.length; i++){
    this.children[i].delete();
    i--;
  }
  if(this.drew){
    var tag = document.getElementById(""+(this.type.substring(this.type.length-4, this.type.length).toLowerCase())+"_"+this.id);
    tag.parentElement.removeChild(tag);
    this.drew = false;
  }
  this.id = -1;
  if(this.parent){
    for(var i=0; i<this.parent.children.length; i++){
      if(this.parent.children[i].id===-1){
        this.parent.children.remove(i);
        i--;
      }
    }
  }
  delete this;
}

GearProto.prototype.erase = function(){
  for(var i=0; i<this.children.length; i++){
    this.children[i].erase();
  }
  if(this.drew){
    var tag = document.getElementById(""+(this.type.substring(this.type.length-4, this.type.length).toLowerCase())+"_"+this.id);
    tag.parentElement.removeChild(tag);
    this.drew = false;
  }
}

GearProto.prototype.toString = function(){
	return ""+this.type+"_"+this.N+"_"+this.P+"_"+(180*this.PA/pi)+"_"
}

// Gear Class
function Gear(N,P,PA,div,ac,dc){

  // Input:
  // N: Number of teeth
  // P: Pitch, teeth density (N/R)
  // PA: Pressure Angle in degrees
  // div: Point density per teeth (resolution)
  // ac: Addendum constant (addendum = ac/P)
  // dc: Dedendum constant (dedendum = dc/P)

  // Output:
  // g: Gear points
  // N: Numer of Teeth
  // P: Pitch, teeth density (N/R)
  // D: Pitch diameter
  // PA: Pressure Angle (radians)
  // an: Angle which the gear is positioned (radians);
  // RD: Root diameter
  // OD: Outer diameter
  // BD: Base Diameter
  // c: Gear center point
  // a: Addendum (distance from pitch to tooth end (OD-D)/2)
  // d: Dedendum (distance from pitch to tooth base (D-RD)/2)
  // gc: Guide circle center point
  // r: Resolution (same as div)
  // type: Gear type (default:gear, can be axialGear when created using connectAxialGear)
  // id: Gear id (ramdom number generated when the gear is created)
  // parent: point to the parent gear (the gear wich has that one as child, when there is not, parent=null)
  // drew: false when gear is not drawn, true when it is
  // children: Gears connected after, if the parent one rotate, the children will also rotate

  // gearFillColor: Gear color (default = none)
  // gearStrokeColor: Gear stroke (default = black)
  // gearStrokeWidth: Gear stroke width (default = 0.1)
  // gearFillOpacity: Gear fill opacity (default 1, range 0-1)
  // gearStrokeOpacity: Gear stroke opacity (default 1, range 0-1)

  // guideFillColor: Color of the guide circle  (default = none)
  // guideStrokeColor: Color of the stroke of the guide circle (default = black)
  // guideStrokeWidth:  Guide circle stroke width (default = 0.1)
  // guideFillOpacity: Guide circle fill opacity (default 1, range 0-1)
  // guideStrokeOpacity: Guide circle stroke opacity (default 1, range 0-1)

  // pitchFillColor: Pitch circle color  (default = none)
  // pitchStrokeColor: Pitch circle stroke (default = black)
  // pitchStrokeWidth: Pitch circle stroke width (default = 0.1)
  // pitchFillOpacity: Pitch circle fill opacity (default 1, range 0-1)
  // pitchStrokeOpacity: Pitch circle stroke opacity (default 1, range 0-1)

  // Methods:
  // draw(): Draw the gear and its children on a SVG element (create the DOM elements of the gear on the svg element)
  // rotate(): Rotate the gear and its children on SVG element (rotates the gear DOM elements)
  // connectGear(): Connect a gear (creates a new one)
  // attathRack(): Connect a rack (creates a new one)
  // connectAxialGear(): Connect a gear with the same axis (creates a new one)
  // setTagsId(): Set the id of the DOM elements of the gear (should'n be used, its called only on setId())
  // copy(): Copy the gear and its children with different id
  // redraw(): Redraw the DOM elements of the gear, do not refresh points on g (should be used when gear style has changed, its called only on translate() and on methods to change the gear style)

  // Warnings for bad argument values
  if(PA>35)
    console.warn('Too high values of pressure angle can cause superposition of teeth in the same gear, recomended value < 35');
  else if (PA<15)
    console.warn('Too low values of pressure angle can cause superposition of teeth in the connected gear, recomended value > 15');
	if(div%2){
		div = div - div%2;
    console.warn('Odd or decimal values for points per teeth, using the value of '+div);
	}
  if(ac >= dc)
    console.warn('Addendum greater than dedendum will cause gear superposition');

	var g=[];

	var fp=ac;
	var fm=dc;

	var TA = 2*pi/N;

	var PA = pi*PA/180;

	var DP = N/P;
	var RP = DP/2;
	var DB = DP*Math.cos(PA);
	var RB = DB/2;

	var a = fp/P;
	var d = fm/P;

	var DO = DP+2*a;
	var RO = DO/2;

	var DR = DP-2*d;
	var RR = DR/2;

	var anInPitch = Math.sqrt((Math.pow(RP,2)-Math.pow(RB,2))/Math.pow(RB,2)); // Angle to generate the point of the tooth curve which intersects the pitch circle
	var anInOuter = Math.sqrt((Math.pow(RO,2)-Math.pow(RB,2))/Math.pow(RB,2)); // Angle to generate the point of the tooth curve which intersects the outer circle

	var poInPitch = Vec.plus(new Vecra(RB,anInPitch),new Vecra(anInPitch*RB,anInPitch-pi/2)); // Point of intersection of tooth curve and pitch circle
	var poInOuter = Vec.plus(new Vecra(RB,anInOuter),new Vecra(anInOuter*RB,anInOuter-pi/2)); // Point of intersection of tooth curve and outer circle

	var initialAngle; // Initial angle do generate tooth arc
	var finalAngle; // Final angle do generate tooth arc

	var divReducer; // DB > DR to generate first point outside loop

    // Initial curve angle
	if(DB < DR){ // If Base circle smaller than root circle, curve starts in root circle
		initialAngle = Math.sqrt((Math.pow(RR,2)-Math.pow(RB,2))/Math.pow(RB,2));
    divReducer = 0;
	}else{ // If Base circle greater than root circle, curve starts in base circle
    initialAngle = 0;
    divReducer = 1;
		g.push(new Vecra(RR,0));
	}

    // Final curve angle
	if(poInPitch.ang()+TA/4 > poInOuter.ang()){ // If tooth reach is smaller than Outer radius
		finalAngle = anInOuter;
	}else{ // If tooth reach is smaller than Outer radius
		finalAngle = solveangle(poInPitch.ang()+TA/4);
	}

	var curvePointAngle = linspace(initialAngle,finalAngle,div/2-divReducer); // The angle to generate each point of the curve

  // Generate the curve
	for(f1=0; f1<curvePointAngle.length; f1++){
		g2 = Vec.plus(new Vecra(RB,curvePointAngle[f1]),new Vecra(RB*curvePointAngle[f1],(-pi/2+curvePointAngle[f1])));
		g.push(g2);
	}

	var len = g.length;

	// Mirror the curve to generate the other half of the tooth
	for(var f2=len-1; f2>=0; f2--){
		g4 = g[f2].mir(poInPitch.ang()+TA/4);
		g.push(g4);
	}

  // Initialize the tooth angle
	var len = g.length;
	for(var f5=0; f5<len; f5++){
		g[f5] = g[f5].rot(-poInPitch.ang()-TA/4);
	}

	// Generate the others teeth rotating the generated one
	len = g.length;
	for(var f4=1; f4<N; f4++){
		for(var f3=0; f3<len; f3++){
			g5 = g[f3].rot(f4*TA);
			g.push(g5);
		}
	}

	var guideCircleCenter = new Vecra(RP,0);
	var guideCircleRadius = d/3;

	this.g = g;
	this.N = N;
	this.P = P;
	this.D = DP;
	this.PA = PA;
	this.an = 0;
	this.RD = DR;
	this.OD = DO;
	this.BD = DB;
	this.c = new Vecxy(0,0);
	this.a = a;
	this.d = d;
	this.gc = guideCircleCenter;
	this.r = div;
	this.type = 'gear';
	this.id = Math.random();
  this.parent = null;
  this.drew = false;
  this.children = [];

  this.gearFillColor = 'lightgray';
  this.gearStrokeColor = 'black';
  this.gearStrokeWidth = .2;
  this.gearFillOpacity = .5;
  this.gearStrokeOpacity = 1;

  this.guideFillColor = 'none';
  this.guideStrokeColor = 'black';
  this.guideStrokeWidth = .2;
  this.guideFillOpacity = 1;
  this.guideStrokeOpacity = 1;

  this.pitchFillColor = 'none';
  this.pitchStrokeColor = 'black';
  this.pitchStrokeWidth = .2;
  this.pitchFillOpacity = 1;
  this.pitchStrokeOpacity = 1;
}

// Extends GearProto
Gear.prototype = new GearProto();

Gear.prototype.draw = function(svgId){
  if(!this.drew && this.id!=-1){
    var m = "translate("+this.c.x+","+this.c.y+") rotate("+(180*this.an/pi)+")";
    var gearSVG = document.getElementById(svgId);
    var svgTag = "<g id=\"gear_" +this.id + "\" class=\"gear\" transform=\""+m+"\"><path id=\"points_" + this.id + "\" class=\"points\"";
    svgTag += " fill=\""+this.gearFillColor+"\" fill-opacity=\""+this.gearFillOpacity+"\"";
    svgTag += " stroke=\""+this.gearStrokeColor+"\" stroke-width=\""+this.gearStrokeWidth+"\" stroke-opacity=\""+this.gearStrokeOpacity+"\" d=\"";
    svgTag += "M " + this.g[0].x + " " + this.g[0].y;
    for(var f6=0; f6<this.g.length; f6++){
      svgTag += " L " + this.g[f6].x + " " + this.g[f6].y;
    }
    svgTag += " Z"
    svgTag += " M " + (this.a/6) + " " + (0);
    for(var i=this.r; i>0; i--){
      svgTag += " L " + (this.a/6*Math.cos(2*pi*i/this.r)) + " " + (this.a/6*Math.sin(2*pi*i/this.r));
    }

    svgTag += " Z\"></path>";
    svgTag += "<circle id=\"pitch_"+this.id+"\" class=\"pitch\" cx=\"0\" cy=\"0\" r=\""+this.D/2+"\"";
    svgTag += " fill=\""+this.pitchFillColor+"\" fill-opacity=\""+this.pitchFillOpacity+"\"";
    svgTag += " stroke=\""+this.pitchStrokeColor+"\" stroke-width=\""+this.pitchStrokeWidth+"\" stroke-opacity=\""+this.pitchStrokeOpacity+"\"></circle>";
    svgTag += "<circle id=\"guide_"+this.id+"\" class=\"guide\" cx=\""+this.gc.x+"\" cy=\""+this.gc.y+"\" r=\""+this.a/3+"\""
    svgTag += " fill=\""+this.guideFillColor+"\" fill-opacity=\""+this.guideFillOpacity+"\"";
    svgTag += " stroke=\""+this.guideStrokeColor+"\" stroke-width=\""+this.guideStrokeWidth+"\" stroke-opacity=\""+this.guideStrokeOpacity+"\"></circle>";
    svgTag += "</g>";
    gearSVG.innerHTML += svgTag;
    for(var f7=0; f7<this.children.length; f7++){
      this.children[f7].draw(svgId);
    }
    this.drew = true;
  }else if(this.drew){
    console.error("Gear "+this.id+" is already drawn");
  }else{

  }
}

Gear.prototype.rotate = function(a){
  if(this.drew){
    this.an+=a;
    this.an = wrap2pi(this.an);
		var m = "translate("+this.c.x+","+this.c.y+") rotate("+(180*this.an/pi)+")";
    document.getElementById("gear_"+this.id).setAttribute("transform",m);
    for(var f8=0; f8<this.children.length; f8++){
      if(this.children[f8].type != 'axialGear'){
        this.children[f8].rotate(-this.N/this.children[f8].N*a);
      }else{
        this.children[f8].rotate(a);
      }
    }
  }else{
  }
}

Gear.prototype.connectGear = function(N,div,angle){
  angle = pi*angle/180;
  var child = new Gear(N,this.P,180/pi*this.PA,div,this.a*this.P,this.d*this.P);
	child.c = Vec.plus(this.c,new Vecra(this.D/2+child.D/2,-angle));

  child.an += pi;
  child.an += pi/child.N;
  child.an -= this.N*this.an/child.N;
  child.an -= this.N*angle/child.N;
  child.an -= angle;
  child.an = wrap2pi(child.an);

  child.parent = this;
  child.copyApperance(this);

  this.children.push(child);
}

Gear.prototype.connectRack = function(N, angle, n){
  var dP = pi/this.P;
  angle = pi*(180+angle)/180;
  var child = new Rack(N,this.P,180/pi*this.PA,this.a*this.P,this.d*this.P,180*wrap2pi(angle)/pi);

	child.c = new Vecxy(0,0);
	child.c.add(this.c);
	child.c.add(new Vecra(this.D/2,pi-angle));
	child.c.ded(new Vecra(n*dP,pi/2-angle));

  var parentAngle = this.an;

  child.an += pi/child.N;
  child.an += 2*pi/child.N*(n%1);
  child.an += -this.N/child.N*parentAngle;
  child.an += -this.N/child.N*(angle+pi);
  child.an = wrap2pi(child.an);

  child.parent = this;
  child.copyApperance(this);

  this.children.push(child);
}

// Connect a gear with same axis (create a new gear)
Gear.prototype.connectAxialGear = function(N,P,PA,div,ac,dc){
  var child = new Gear(N,P,PA,div,ac,dc);
  child.type = 'axialGear';
	child.an = this.an;
	child.c = new Vecxy(0,0);
	child.c.add(this.c);
  child.parent = this;
  child.copyApperance(this);

  this.children.push(child);
}

  Gear.prototype.setTagsId = function(id){
    document.getElementById("gear_"+this.id).setAttribute("id", "gear_"+id);
    document.getElementById("points_"+this.id).setAttribute("id", "points_"+id);
    document.getElementById("pitch_"+this.id).setAttribute("id", "pitch_"+id);
    document.getElementById("guide_"+this.id).setAttribute("id", "guide_"+id);
  }

  Gear.prototype.copy = function(){
    var obj = new Gear(this.N,this.P,180/pi*this.PA,this.r,this.a*this.P,this.d*this.P);
    Object.assign(obj, this);
    obj.drew = false;
    var nChildren = [];
    var nObj
    for(var i=0; i<this.children.length; i++){
      nObj = this.children[i].copy();
      nChildren.push(nObj);
    }
    obj.children = nChildren;
    obj.setId();
    return obj;
  }

  Gear.prototype.redraw = function(){
    document.getElementById("gear_"+this.id).setAttribute("transform", "translate("+this.c.x+","+this.c.y+") rotate("+(180*this.an/pi)+")");

    document.getElementById("points_"+this.id).setAttribute("fill", this.gearFillColor);
    document.getElementById("points_"+this.id).setAttribute("fill-opacity", this.gearFillOpacity);
    document.getElementById("points_"+this.id).setAttribute("stroke", this.gearStrokeColor);
    document.getElementById("points_"+this.id).setAttribute("stroke-width", this.gearStrokeWidth);
    document.getElementById("points_"+this.id).setAttribute("stroke-opacity", this.gearStrokeOpacity);

    document.getElementById("pitch_"+this.id).setAttribute("fill", this.guideFillColor);
    document.getElementById("pitch_"+this.id).setAttribute("fill-opacity", this.guideFillOpacity);
    document.getElementById("pitch_"+this.id).setAttribute("stroke", this.guideStrokeColor);
    document.getElementById("pitch_"+this.id).setAttribute("stroke-width", this.guideStrokeWidth);
    document.getElementById("pitch_"+this.id).setAttribute("stroke-opacity", this.guideStrokeOpacity);

    document.getElementById("guide_"+this.id).setAttribute("fill", this.pitchFillColor);
    document.getElementById("guide_"+this.id).setAttribute("fill-opacity", this.pitchFillOpacity);
    document.getElementById("guide_"+this.id).setAttribute("stroke", this.pitchStrokeColor);
    document.getElementById("guide_"+this.id).setAttribute("stroke-width", this.pitchStrokeWidth);
    document.getElementById("guide_"+this.id).setAttribute("stroke-opacity", this.pitchStrokeOpacity);
  }

// Rack class
function Rack(N,P,PA,ac,dc,ang){

  // Input:
  // N: Number of teeth
  // P: Pitch, teeth density (N/R)
  // PA: Pressure Angle in degrees
  // ac: Addendum constant (addendum = ac/P)
  // dc: Dedendum constant (dedendum = dc/P)
  // ang: Angle of rack with respect to horizontal (normal to rack pitch)

  // Output:
  // g: Gear points
  // N: Numer of Teeth
  // P: Pitch, teeth density (N/R)
  // D: x coordinate of root pitch (always zero)
  // PA: Pressure Angle (radians)
  // an: Angle which the gear is positioned (radians, for rack is the position of guide circle, vary from 0 to 2*pi);
  // RD: x coordinate of root line (-d)
  // OD: x coordinate of outer line (a)
  // c: Rack start point
  // a: Addendum (distance from pitch to tooth end (OD))
  // d: Dedendum (distance from pitch to tooth base (-RD))
  // gc0: Guide 0 circle center point (there are two guides on rack, when one is showing, other is hidden)
  // gc1: Guide 1 circle center point (there are two guides on rack, when one is showing, other is hidden)
  // type: Gear type (default: rack, can be backRack when created using connectBackRack)
  // id: Gear id (ramdom number generated when the gear is created)
  // parent: point to the parent gear (the gear wich has that one as child, when there is not, parent=null)
  // drew: false when gear is not drawn, true when it is
  // children: Gears connected after, if the parent one rotate, the children will also rotate

  // gearFillColor: Gear color (default = none)
  // gearStrokeColor: Gear stroke (default = black)
  // gearStrokeWidth: Gear stroke width (default = 0.1)
  // gearFillOpacity: Gear fill opacity (default 1, range 0-1)
  // gearStrokeOpacity: Gear stroke opacity (default 1, range 0-1)

  // guideFillColor: Color of the guide circle  (default = none)
  // guideStrokeColor: Color of the stroke of the guide circle (default = black)
  // guideStrokeWidth:  Guide circle stroke width (default = 0.1)
  // guideFillOpacity: Guide circle fill opacity (default 1, range 0-1)
  // guideStrokeOpacity: Guide circle stroke opacity (default 1, range 0-1)

  // pitchFillColor: Pitch circle color  (default = none)
  // pitchStrokeColor: Pitch circle stroke (default = black)
  // pitchStrokeWidth: Pitch circle stroke width (default = 0.1)
  // pitchFillOpacity: Pitch circle fill opacity (default 1, range 0-1)
  // pitchStrokeOpacity: Pitch circle stroke opacity (default 1, range 0-1)

  // Methods:
  // draw(): Draw the gear and its children on a SVG element (create the DOM elements of the gear on the svg element)
  // rotate(): Rotate the gear and its children on SVG element (rotates the gear DOM elements)
  // connectGear(): Connect a gear (creates a new one)
  // attathRack(): Connect a rack (creates a new one)
  // connectBackRack(): Connect a gear with the same axis (creates a new one)
  // setTagsId(): Set the id of the DOM elements of the gear (should'n be used, its called only on setId())
  // copy(): Copy the gear and its children with different id
  // redraw(): Redraw the DOM elements of the gear, do not refresh points on g (should be used when gear style has changed, its called only on translate() and on methods to change the gear style)

  // Warnings for bad argument values
  if(PA>35)
    console.warn('Too high values of pressure angle can cause superposition of teeth in the same gear, recomended value < 35');
  else if (PA<15)
    console.warn('Too low values of pressure angle can cause superposition of teeth in the connected gear, recomended value > 15');
	if(div%2){
		div = div - div%2;
    console.warn('Odd or decimal values for points per teeth, using the value of '+div);
	}
  if(ac >= dc)
    console.warn('Addendum greater than dedendum will cause gear superposition');

  var div = 4; // Since rack never has curves, any value of resolution shows the same result, 4 is the minimal resolution

	var g=[];

	var fp=ac;
	var fm=dc;

	var TA = 2*pi/N;

	var PA = pi*PA/180;

	var D = 0;

  var dP = pi/P;

	var a = fp/P;
	var d = fm/P;

	var OD = D+a;
	var RD = D-d;

  var tanPA = Math.tan(PA);

  var dPd = -((OD-RD)*tanPA-dP*N+dP/2-dP*N)/2-dP-dP*N;//0;//-dP/8-dP/2-dP+dP/4;

  var x_0 = linspace(RD,OD,div/2);
  var y_0 = linspace(-dP*N+dPd,(OD-RD)*tanPA-dP*N+dPd,div/2);
  var x_1 = linspace(OD,RD,div/2);
  var y_1 = linspace(dP/2-dP*N+dPd,(OD-RD)*tanPA+dP/2-dP*N+dPd,div/2);

  // Push rack tooth points to g
  for(var f11=0; f11<div/2; f11++){
		g.push(new Vecxy(x_0[f11],y_0[f11]));
  }
  for(var f12=0; f12<div/2; f12++){
		g.push(new Vecxy(x_1[f12],y_1[f12]));
  }

  len = g.length;
  var fN = 2*N+2
	for(var f13=1; f13<fN; f13++){
		for(var f14=0; f14<len; f14++){
			g5 = Vec.plus(g[f14],new Vecxy(0,f13*dP));
			g.push(g5);
		}
	}

  this.g = g;
	this.N = N;
	this.P = P;
	this.D = D;
	this.PA = PA;
  this.ang = pi*ang/180;
	this.an = 0;
	this.RD = RD;
	this.OD = OD;
  this.baseHeight = OD-RD;
	this.c = new Vecxy(0,0);
	this.a = a;
	this.d = d;
	this.gc0 = new Vecxy(D,dP+((OD-RD)*tanPA+dP/2)/2-dP*N+dPd);
	this.gc1 = Vec.plus(this.gc0,new Vecxy(0,N*dP));
	this.type = 'rack';
	this.id = Math.random();
  this.parent = null;
  this.drew = false;
  this.NVisible = N;
  this.children = [];

  this.gearFillColor = 'lightgray';
  this.gearStrokeColor = 'black';
  this.gearStrokeWidth = .2;
	this.gearFillOpacity = .5;
  this.gearStrokeOpacity = 1;

  this.guideFillColor = 'none';
  this.guideStrokeColor = 'black';
  this.guideStrokeWidth = .2;
  this.guideFillOpacity = 1;
  this.guideStrokeOpacity = 1;

  this.pitchFillColor = 'none';
  this.pitchStrokeColor = 'black';
  this.pitchStrokeWidth = .2;
  this.pitchFillOpacity = 1;
  this.pitchStrokeOpacity = 1;
}

// Extends GearProto
Rack.prototype = new GearProto();

Rack.prototype.draw = function(svgId){
  if(!this.drew){
    var dP = pi/this.P;
    var progress = -this.an/(2*pi)*(-dP*this.N);
    var xMin = 0;
    var xMax = 2*(this.OD-this.RD);
    var yMin = 0;
    var yMax = yMin+(this.N*dP)*this.NVisible/this.N;
    var len = this.g.length;
    var m = "translate("+this.c.x+","+this.c.y+") rotate("+(-180*this.ang/pi)+")";
    var gearSVG = document.getElementById(svgId);
    var svgTag = "";
    svgTag += "<g id=\"rack_" +this.id + "\" class=\"rack\"";
    svgTag += " transform=\""+m+"\"";
    svgTag += ">";
    svgTag += "<defs>";
    svgTag += "<clipPath id=\"clip_"+this.id+"\">";
    svgTag += "<polygon id=\"poly_"+this.id+"\"";
    svgTag += " points=\"" +(this.RD-this.baseHeight)+ " " +yMin+ ", " +(this.OD)+ " " +yMin+ ", " +(this.OD)+ " " +yMax+ ", " +(this.RD-this.baseHeight)+ " " +yMax+ "\"";
    svgTag += "transform=\"translate(0,"+(-progress)+") rotate(0)\">";
    svgTag += "</polygon></clipPath></defs>";
    svgTag += "<g  id=\"group_"+this.id+"\"";
    svgTag += " clip-path=\"url(#clip_"+this.id+")\"";
    svgTag += " transform=\"translate(0,"+(progress)+")  rotate(0)\"";
    svgTag += ">";
    svgTag += "<path id=\"points_" + this.id + "\" class=\"points\"";
    svgTag += " fill=\""+this.gearFillColor+"\" fill-opacity=\""+this.gearFillOpacity+"\"";
    svgTag += " stroke=\""+this.gearStrokeColor+"\" stroke-width=\""+this.gearStrokeWidth+"\" stroke-opacity=\""+this.gearStrokeOpacity+"\" d=\"";
    svgTag += "M " + this.g[0].x + " " + this.g[0].y;
    for(var f6=0; f6<len; f6++){
      svgTag += " L " + this.g[f6].x + " " + this.g[f6].y;
    }
    svgTag += " L " + (this.RD-this.baseHeight) + " " + this.g[len-1].y;
    svgTag += " L " + (this.RD-this.baseHeight) + " " + this.g[0].y;

    svgTag += " Z\"></path>";

    svgTag += "<rect id=\"pitch_"+this.id+"\" class=\"pitch\" x=\""+ (this.RD-this.baseHeight) +"\" y=\""+this.g[0].y+"\""
    svgTag += " width=\""+ (this.baseHeight-this.RD) +"\" height=\""+ (this.g[len-1].y-this.g[0].y) +"\"";
    svgTag += " fill=\""+this.pitchFillColor+"\" fill-opacity=\""+this.pitchFillOpacity+"\"";
    svgTag += " stroke=\""+this.pitchStrokeColor+"\" stroke-width=\""+this.pitchStrokeWidth+"\" stroke-opacity=\""+this.pitchStrokeOpacity+"\"></rect>";
    svgTag += "<circle id=\"guide0_"+this.id+"\" class=\"guide\" cx=\""+this.gc0.x+"\" cy=\""+this.gc0.y+"\" r=\""+this.a/3+"\""
    svgTag += " fill=\""+this.guideFillColor+"\" fill-opacity=\""+this.guideFillOpacity+"\"";
    svgTag += " stroke=\""+this.guideStrokeColor+"\" stroke-width=\""+this.guideStrokeWidth+"\" stroke-opacity=\""+this.guideStrokeOpacity+"\"></circle>";
    svgTag += "<circle id=\"guide1_"+this.id+"\" class=\"guide\" cx=\""+this.gc1.x+"\" cy=\""+this.gc1.y+"\" r=\""+this.a/3+"\""
    svgTag += " fill=\""+this.guideFillColor+"\" fill-opacity=\""+this.guideFillOpacity+"\"";
    svgTag += " stroke=\""+this.guideStrokeColor+"\" stroke-width=\""+this.guideStrokeWidth+"\" stroke-opacity=\""+this.guideStrokeOpacity+"\"></circle>";
    svgTag += "</g>";
    svgTag += "</g>";
    gearSVG.innerHTML += svgTag;
    for(var f7=0; f7<this.children.length; f7++){
      this.children[f7].draw(svgId);
    }
    this.drew = true;
  }else{
    console.error("Rack "+this.id+" is already drawn");
  }
}

// Rotate the rack and rotate the children (rotate the <g> element of the gear on svg element)
Rack.prototype.rotate = function(a){
  if(this.drew){
    dP = pi/this.P;
    this.an+=a;
    this.an = wrap2pi(this.an);
    var progress = -this.an/(2*pi)*(-dP*this.N);
    var m1 = "translate(0,"+progress+")";
    var m2 = "translate(0,"+(-progress)+")";
		document.getElementById("group_"+this.id).setAttribute("transform",m1);
    document.getElementById("poly_"+this.id).setAttribute("transform",m2);
    for(var f8=0; f8<this.children.length; f8++){
      if(this.children[f8].type != 'backRack'){
        this.children[f8].rotate(-this.N/this.children[f8].N*a);
      }else{
        this.children[f8].rotate(-this.N/this.children[f8].N*a*this.children[f8].P/this.P);
      }
    }
  }else{
    // console.error("Rack "+this.id+" isn't drawn");
  }
}

// Connect a gear (creates a new gear)
Rack.prototype.connectGear = function(N,div,n){
  var dP = pi/this.P;
  var child = new Gear(N,this.P,180/pi*this.PA,div,this.a*this.P,this.d*this.P);

	child.c = new Vecxy(0,0);
	child.c.add(this.c);
	child.c.add(new Vecra(n*dP, pi/2-this.ang));
	child.c.add(new Vecra(child.D/2, -this.ang));

  // Alling the child gear to parent Rack
  child.an = pi;
  child.an += pi/child.N;
  child.an -= this.ang;
  child.an += -this.N/child.N*this.an;
  child.an += n*dP*2*pi/(dP*this.N)*this.N/child.N;
  child.an = wrap2pi(child.an);

  child.parent = this;
  child.copyApperance(this);

  this.children.push(child);
}

// Connect a rack (creates a new rack)
Rack.prototype.connectRack = function(N,n){
  var dP = pi/this.P;
  var angle = wrap2pi(this.ang+pi);
  var child = new Rack(N,this.P,180/pi*this.PA,this.a*this.P,this.d*this.P,180*angle/pi);

  child.c = new Vecxy(0,0);
	child.c.add(this.c);
	child.c.add(new Vecra((n*2+1)*dP/2,pi/2-this.ang));

  // Alling the child gear to parent Rack
  child.an += -this.N/child.N*this.an;
  child.an += n*dP*2*pi/(dP*this.N)*this.N/child.N;
  child.an = wrap2pi(child.an);

  child.parent = this;
  child.copyApperance(this);

  this.children.push(child);

}

// Connect a rack (creates a new rack)
Rack.prototype.connectBackRack = function(N,P,PA,ac,dc,n){
  var dP = pi/this.P;
  var dP2 = pi/P;
  var angle = wrap2pi(this.ang+pi);
  var child = new Rack(N,P,PA,ac,dc,180*angle/pi);
  child.NVisible = this.N*dP/dP2;
  var RDbH = this.baseHeight-this.RD+child.baseHeight-child.RD;

	child.c = new Vecxy(0,0);
	child.c.add(this.c);
	child.c.add(new Vecra(RDbH,-angle));
	child.c.ded(new Vecra(N*dP2,pi/2-angle));
	child.c.ded(new Vecra(n*dP2,pi/2-angle));
	child.c.add(new Vecra((child.N-child.NVisible)*dP2,pi/2-angle));

  child.type = 'backRack';

  child.parent = this;
  child.copyApperance(this);

  this.children.push(child);
}

Rack.prototype.setTagsId = function(id){
  document.getElementById("rack_"+this.id).setAttribute("id", "rack_"+id);
  document.getElementById("clip_"+this.id).setAttribute("id", "clip_"+id);
  document.getElementById("poly_"+this.id).setAttribute("id", "poly_"+id);
  document.getElementById("group_"+this.id).setAttribute("clip-path", "url(#clip_"+id+")");
  document.getElementById("group_"+this.id).setAttribute("id", "group_"+id);
  document.getElementById("points_"+this.id).setAttribute("id", "points_"+id);
  document.getElementById("pitch_"+this.id).setAttribute("id", "pitch_"+id);
  document.getElementById("guide0_"+this.id).setAttribute("id", "guide0_"+id);
  document.getElementById("guide1_"+this.id).setAttribute("id", "guide1_"+id);
}

Rack.prototype.copy = function(){
  var obj = new Rack(this.N,this.P,180/pi*this.PA,this.a*this.P,this.d*this.P,180*this.ang/pi);
  Object.assign(obj, this);
  obj.drew = false;
  var nChildren = [];
  var nObj
  for(var i=0; i<this.children.length; i++){
    nObj = this.children[i].copy();
    nChildren.push(nObj);
  }
  obj.children = nChildren;
  obj.setId();
  return obj;
}

Rack.prototype.redraw = function(){
  var dP = pi/this.P;
  var progress = -this.an/(2*pi)*(-dP*this.N);

  document.getElementById("rack_"+this.id).setAttribute("transform", "translate("+this.c.x+","+this.c.y+") rotate("+(-180*this.ang/pi)+")");
  document.getElementById("poly_"+this.id).setAttribute("transform", "translate(0,"+(-progress)+") rotate(0)");
  document.getElementById("group_"+this.id).setAttribute("transform", "translate(0,"+(progress)+") rotate(0)");

  document.getElementById("points_"+this.id).setAttribute("fill", this.gearFillColor);
  document.getElementById("points_"+this.id).setAttribute("fill-opacity", this.gearFillOpacity);
  document.getElementById("points_"+this.id).setAttribute("stroke", this.gearStrokeColor);
  document.getElementById("points_"+this.id).setAttribute("stroke-width", this.gearStrokeWidth);
  document.getElementById("points_"+this.id).setAttribute("stroke-opacity", this.gearStrokeOpacity);

  document.getElementById("pitch_"+this.id).setAttribute("fill", this.guideFillColor);
  document.getElementById("pitch_"+this.id).setAttribute("fill-opacity", this.guideFillOpacity);
  document.getElementById("pitch_"+this.id).setAttribute("stroke", this.guideStrokeColor);
  document.getElementById("pitch_"+this.id).setAttribute("stroke-width", this.guideStrokeWidth);
  document.getElementById("pitch_"+this.id).setAttribute("stroke-opacity", this.guideStrokeOpacity);

  document.getElementById("guide0_"+this.id).setAttribute("fill", this.pitchFillColor);
  document.getElementById("guide0_"+this.id).setAttribute("fill-opacity", this.pitchFillOpacity);
  document.getElementById("guide0_"+this.id).setAttribute("stroke", this.pitchStrokeColor);
  document.getElementById("guide0_"+this.id).setAttribute("stroke-width", this.pitchStrokeWidth);
  document.getElementById("guide0_"+this.id).setAttribute("stroke-opacity", this.pitchStrokeOpacity);

  document.getElementById("guide1_"+this.id).setAttribute("fill", this.pitchFillColor);
  document.getElementById("guide1_"+this.id).setAttribute("fill-opacity", this.pitchFillOpacity);
  document.getElementById("guide1_"+this.id).setAttribute("stroke", this.pitchStrokeColor);
  document.getElementById("guide1_"+this.id).setAttribute("stroke-width", this.pitchStrokeWidth);
  document.getElementById("guide1_"+this.id).setAttribute("stroke-opacity", this.pitchStrokeOpacity);
}

// Prototype for the new classes
function Vec(){
}

Vec.prototype = new Object();

Vec.prototype.add = function(vec){
	this.x += vec.x;
	this.y += vec.y;
}

Vec.prototype.ded = function(vec){
	this.x -= vec.x;
	this.y -= vec.y;
}

Vec.prototype.div = function(a){
	this.x /= a;
	this.y /= a;
}

Vec.prototype.times = function(a){
	this.x *= a;
	this.y *= a;
}

Vec.prototype.sum = function(vec){
	return new Vecxy(this.x+vec.x,this.y+vec.y);
}

Vec.prototype.sub = function(vec){
	return new Vecxy(this.x-vec.x,this.y-vec.y);
}

Vec.prototype.abs = function(){
	return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
}

Vec.prototype.ang = function(){
	return Math.atan2(this.y,this.x);
}

Vec.prototype.mir = function(a){
	var an=(a-this.ang());
	return new Vecra(this.abs(),a+an);
}

Vec.prototype.rot = function(a){
	return new Vecra(this.abs(),a+this.ang());
}

Vec.prototype.add = function(vec){
	this.x += vec.x;
	this.y += vec.y;
}

Vec.plus = function(vec1,vec2){
	return new Vecxy(vec1.x+vec2.x,vec1.y+vec2.y);
}

Vec.minus = function(vec1,vec2){
	return new Vecxy(vec1.x-vec2.x,vec1.y-vec2.y);
}

function Vecxy(x,y){
	this.x = x;
	this.y = y;
}
Vecxy.prototype = new Vec();

function Vecra(r,a){
	this.x = r*Math.cos(a);
	this.y = r*Math.sin(a);
}
Vecra.prototype = new Vec();

function Vecde(r,a){
	this.x = r*Math.cos(pi*a/180);
	this.y = r*Math.sin(pi*a/180);
}
Vecde.prototype = new Vec();

// Wrap any angle to 0 to 2*pi
function wrap2pi(a){
	while(a<0){
    a += 2*pi;
  }
	while(a>2*pi){
    a -= 2*pi;
  }
	return a;
	// return ((a/pi*180)%(360))/180*pi;
}

// Solve nonlinear equation to find the angle which generate the tooth reach
function solveangle(a){
	var e=1e-6;
	var b=pi*Math.random();
	var b0=-2*pi;
	var b1=2*pi;
	var r0;
	var r;
	while(true){
		b=(b0+b1)/2;
		r0=a-b0+Math.atan(b0);
		r=a-b+Math.atan(b);
		if(Math.abs(r)<=e){
			break;
		}else{
			if(Math.sign(r)!=Math.sign(r0)){
				b1=b;
			}else{
				b0=b;
			}
		}
	}
	return b;
}

// Create an Array of n elements equally spaced from a to b
function linspace(a,b,n){
  var p = (b-a)/(n-1);
  var r = [];
  for(var i=0;i<n;i++){
    r.push(a+i*p);
  }
  return r;
}
