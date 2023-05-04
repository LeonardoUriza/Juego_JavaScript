let canvas;
let ctx;
let FPS = 50;

let anchoF = 50;
let altoF = 50;

let muro = "#044f14";
let puerta = "#3a1700";
let tierra = "#c6892f";
let llave = "#c6bc00";

let tileMap;
let protagonista;
let enemigo = [];

let escenario = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0],
  [0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0],
  [0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0],
  [0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0],
  [0, 2, 2, 3, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function dibujaEscenario() {
  for (y = 0; y < 10; y++) {
    for (x = 0; x < 15; x++) {
      let tile = escenario[y][x];
      ctx.drawImage(tileMap, tile * 32, 0, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
    }
  }
}

// Clase Jugador
let jugador = function () {
  this.x = 1;
  this.y = 1;
  this.color = "#820c01";
  this.llave = false;

  this.dibuja = function () {
    ctx.drawImage(tileMap, 32, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
  };


  this.margenes = function (x, y) {
    var colision = false;

    if (escenario[y][x] == 0) {
      colision = true;
    }

    return colision;
  };

  this.arriba = function () {
    if (this.margenes(this.x, this.y - 1) == false)
      this.y--;
    this.logicaObjetos();
  };

  this.abajo = function () {
    if (this.margenes(this.x, this.y + 1) == false)
      this.y++;
    this.logicaObjetos();
  };

  this.izquierda = function () {
    if (this.margenes(this.x - 1, this.y) == false)
      this.x--;
    this.logicaObjetos();
  };

  this.derecha = function () {
    if (this.margenes(this.x + 1, this.y) == false)
      this.x++;
    this.logicaObjetos();
  };

  this.logicaObjetos = function () {
    let objeto = escenario[this.y][this.x];

    //Obteniendo la llave
    if (objeto == 3) {
      this.llave = true;
      escenario[this.y][this.x] = 2;
      console.log("Haz Obtenido la llave para el siguiente nivel");
    }

    //Abriendo la puerta
    if (objeto == 1) {
      if (this.llave == true) {
        this.victoria();
      } else {
        console.log("No tienes la llave, no puedes pasar");
      }
    }
  };

  this.victoria = function () {
    console.log("Haz Completado el nivel...!!!");
    this.x = 1;
    this.y = 1;
    this.llave = false;
    escenario[8][3] = 3;
  };

  this.colisionEnemigo = function (x, y) {
    if (this.x == x && this.y == y) {
      this.muerte();
    }
  }

  this.muerte = function () {
    console.log("Haz Perdido este nivel...!!!");
    this.x = 1;
    this.y = 1;
    this.llave = false;
    escenario[8][3] = 3;
  }
};

// Clase Enemigo
let malo = function (x, y) {
  this.x = x;
  this.y = y;
  this.retraso = 50;
  this.fotograma = 0;
  this.direccion = Math.floor(Math.random() * 4);

  this.dibuja = function () {
    ctx.drawImage(tileMap, 0, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
  };

  this.compruebaColision = function (x, y) {
    let colisiona = false;
    if (escenario[x][y] == 0) {
      colisiona = true;
    }
    return colisiona;
  };

  this.mueve = function () {
    //Velocidad de movimiento
    if (this.contador < this.retraso) {
      this.contador++;
    } else {
      this.contador = 0;
      //Arriba
      if (this.direccion == 0) {
        if (this.compruebaColision(this.x, this.y - 1) == false) {
          this.y--;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
      //Abajo
      if (this.direccion == 1) {
        if (this.compruebaColision(this.x, this.y + 1) == false) {
          this.y++;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
      //Izquierda
      if (this.direccion == 2) {
        if (this.compruebaColision(this.x - 1, this.y) == false) {
          this.x--;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
      //Derecha
      if (this.direccion == 3) {
        if (this.compruebaColision(this.x + 1, this.y) == false) {
          this.x++;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
    }

    protagonista.colisionEnemigo(this.x, this.y);
  };
};


function inicializa() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  tileMap = new Image();
  tileMap.src = "img/tilemap.png";

  //crear jugador
  protagonista = new jugador(0, 0);

  // Crear enemigos
  enemigo.push(new malo(3, 3));
  enemigo.push(new malo(5, 7));
  enemigo.push(new malo(7, 7));

  //Lectura de las flechas del teclado
  document.addEventListener("keydown", function (tecla) {
    if (tecla.keyCode == 38) {
      protagonista.arriba();
    }

    if (tecla.keyCode == 40) {
      protagonista.abajo();
    }

    if (tecla.keyCode == 37) {
      protagonista.izquierda();
    }

    if (tecla.keyCode == 39) {
      protagonista.derecha();
    }
  });

  setInterval(function () {
    principal();
  }, 1000 / FPS);
}

function borraCanvas() {
  canvas.width = 750;
  canvas.height = 500;
}

function principal() {
  borraCanvas();
  dibujaEscenario();
  protagonista.dibuja();

  for (contrincante = 0; contrincante < enemigo.length; contrincante++) {
    enemigo[contrincante].mueve();
    enemigo[contrincante].dibuja();
  }
}
