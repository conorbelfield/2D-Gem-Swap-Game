"use strict";
let StarGeometry = function(gl) {
  this.gl = gl;
  // vertex buffer
  this.vertexBuffer = gl.createBuffer();

  let vertices = new Float32Array(33);
  vertices[0] = 0;
  vertices[1] = 0;
  vertices[2] = 0;

  for (var i = 0; i < 10; i++) {
    vertices[3 + 3*i] = getX(i);
    vertices[4 + 3*i] = getY(i);
    vertices[5 + 3*i] = 0;
  }

  function getY(rot) {
    if (rot%2 == 0)
      return .3*Math.cos(rot * Math.PI / 5);
    return .15*Math.cos(rot * Math.PI / 5);
  }

  function getX(rot) {
    if (rot%2 == 0)
      return .3*Math.sin(rot * Math.PI / 5);
    return .15*Math.sin(rot * Math.PI / 5);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, 
    gl.STATIC_DRAW);

  // vertext color buffer ADDED THIS
  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([.9, 0, .1,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      .1, 0, .8,
      


    
      ]), 
    gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  let tris = new Uint16Array(30);
  for (var i = 0; i < 10; i++) {
    tris[3*i] = 0;
    tris[3*i + 1] = ((i)%10)+1;
    tris[3*i + 2] = ((i+1)%10)+1;
    
  }
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    tris,
    gl.STATIC_DRAW);

};

StarGeometry.prototype.draw = function() {
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

  
  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);

};
