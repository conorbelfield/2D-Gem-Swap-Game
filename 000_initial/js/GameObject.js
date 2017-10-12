"use strict"; 
let GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(.3, .3, .3); 
  this.id = "";
  this.modelMatrix = new Mat4(); 
  this.removing = false;
  this.remCounter = 0;
  this.falling = false;
  this.targetY = null;
};

GameObject.prototype.updateModelMatrix =
                              function(){ 
	this.modelMatrix.set().scale(this.scale).rotate(this.orientation).translate(this.position);
};


GameObject.prototype.draw = function(camera){ 

  this.updateModelMatrix();
  this.mesh.material.modelViewProjMatrix.set(this.modelMatrix.mul(camera.viewProjMatrix));
  this.mesh.draw(); 
};
