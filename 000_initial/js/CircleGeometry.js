"use strict";
let CircleGeometry = function(gl) {
  this.gl = gl;
  // vertex buffer
  this.vertexBuffer = gl.createBuffer();

  let vertices = new Float32Array(183);
  vertices[0] = 0;
  vertices[1] = 0;
  vertices[2] = 0;

  for (var i = 0; i < 60; i++) {
    vertices[3 + 3*i] = getX(Math.PI * i / 30);
    vertices[4 + 3*i] = getY(Math.PI * i / 30);
    vertices[5 + 3*i] = 0;
  }

  function getX(rot) {
    return .25*(Math.cos(rot));;
  }

  function getY(rot) {
    return .25*(Math.sin(rot));
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, 
    gl.STATIC_DRAW);

  // vertext color buffer ADDED THIS
  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  let colors = new Float32Array(183);
  colors[0] = .8;
  colors[1] = .2;
  colors[2] = .7;
  for (var i = 3; i < 60; i++) {
    colors[3*i] = 1;
    colors[3*i+1] = 1;
    colors[3*i+2] = 0;
  }

  gl.bufferData(gl.ARRAY_BUFFER,
    colors, 
    gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  let tris = new Uint16Array(180);
  for (var i = 0; i < 61; i++) {
    tris[3*i] = 0;
    tris[3*i + 1] = ((i)%60)+1;
    tris[3*i + 2] = ((i+1)%60)+1;
    
  }
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    tris,
    gl.STATIC_DRAW);

};

CircleGeometry.prototype.draw = function() {
  let gl = this.gl;

  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
  // ADDED THIS to add a new color
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  
  gl.drawElements(gl.TRIANGLES, 180, gl.UNSIGNED_SHORT, 0);

};
