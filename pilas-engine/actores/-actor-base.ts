class ActorBase {
  tipo: String;
  sprite: Phaser.GameObjects.Sprite;
  pilas: Pilas;
  id_color: string;
  figura = "";

  propiedades_base = {
    x: 0,
    y: 0,
    imagen: "sin_imagen",
    figura: "",
    figura_dinamica: true,
    figura_ancho: 100,
    figura_alto: 100,
    figura_radio: 40,
    figura_sin_rotacion: false
  };

  propiedades = {
    x: 0,
    y: 0,
    imagen: "sin_imagen",
    figura: ""
  };

  constructor(pilas) {
    this.pilas = pilas;
  }

  get propiedades_iniciales() {
    return this.propiedades;
  }

  pre_iniciar(propiedades) {
    let figura = propiedades.figura || "";
    let imagen = propiedades.imagen;

    switch (figura) {
      case "rectangulo":
        this.sprite = this.pilas.modo.matter.add.sprite(0, 0, imagen);
        this.figura = figura;
        this.crear_figura_rectangular(propiedades.figura_ancho, propiedades.figura_alto, propiedades.figura_dinamica, propiedades.figura_sin_rotacion);
        break;

      case "circulo":
        this.sprite = this.pilas.modo.matter.add.sprite(0, 0, imagen);
        this.figura = figura;
        this.crear_figura_circular(propiedades.figura_radio, propiedades.figura_dinamica, propiedades.figura_sin_rotacion);
        break;

      case "":
        this.figura = figura;
        this.sprite = this.pilas.modo.add.sprite(0, 0, imagen);
        break;

      default:
        throw Error(`No se conoce el tipo de figura ${figura}`);
    }

    this.rotacion = propiedades.rotacion || 0;
    this.escala_x = propiedades.escala_x || 1;
    this.escala_y = propiedades.escala_y || 1;
    this.id_color = this.generar_color_para_depurar();

    this.tipo = propiedades.tipo;
    this.centro_x = propiedades.centro_x || 0.5;
    this.centro_y = propiedades.centro_y || 0.5;
    this.transparencia = propiedades.transparencia || 0;
    this.x = propiedades.x || 0;
    this.y = propiedades.y || 0;

    this.sprite["actor"] = this;
    /*
    try {
      this.iniciar();
    } catch (e) {
      this.pilas.mensajes.emitir_excepcion_al_editor(e, "iniciar actor");
    }
    */

    this.sprite.update = () => {
      try {
        this.actualizar();
      } catch (e) {
        this.pilas.mensajes.emitir_excepcion_al_editor(e, "actualizar actor");
      }
    };

    this.pilas.escena.agregar_actor(this);
  }

  iniciar() {}

  serializar() {
    return {
      tipo: this.tipo,
      x: Math.round(this.x),
      y: Math.round(this.y),
      centro_x: this.centro_x,
      centro_y: this.centro_y,
      rotacion: this.rotacion,
      escala_x: this.escala_x,
      escala_y: this.escala_y,
      imagen: this.imagen,
      transparencia: this.transparencia,
      id_color: this.id_color
    };
  }

  generar_color_para_depurar() {
    let opacidad = "FF";
    return this.pilas.utilidades.obtener_color_al_azar(opacidad);
  }

  actualizar() {}

  get imagen(): string {
    return this.sprite.texture.key;
  }

  set imagen(nombre: string) {
    this.sprite.setTexture(nombre);
  }

  set x(_x: number) {
    this.pilas.utilidades.validar_numero(_x);
    let { x } = this.pilas.utilidades.convertir_coordenada_de_pilas_a_phaser(_x, 0);
    this.sprite.x = x;
  }

  get x() {
    let { x } = this.pilas.utilidades.convertir_coordenada_de_phaser_a_pilas(this.sprite.x, 0);
    return x;
  }

  set y(_y: number) {
    this.pilas.utilidades.validar_numero(_y);
    let { y } = this.pilas.utilidades.convertir_coordenada_de_pilas_a_phaser(0, _y);
    this.sprite.y = y;
  }

  get y() {
    let { y } = this.pilas.utilidades.convertir_coordenada_de_phaser_a_pilas(0, this.sprite.y);
    return y;
  }

  set rotacion(angulo: number) {
    this.pilas.utilidades.validar_numero(angulo);
    this.sprite.angle = -(angulo % 360);
  }

  get rotacion() {
    return -this.sprite.angle % 360;
  }

  set escala_x(s) {
    this.pilas.utilidades.validar_numero(s);
    this.sprite.scaleX = s;
  }

  get escala_x() {
    return this.sprite.scaleX;
  }

  set escala_y(s) {
    this.pilas.utilidades.validar_numero(s);
    this.sprite.scaleY = s;
  }

  get escala_y() {
    return this.sprite.scaleY;
  }

  get escala() {
    /*
    if (this.escala_x != this.escala_y) {
      console.warning("La escala x e y difieren, se asume que la escala_x es la más importante.");
    }
    */

    return this.escala_x;
  }

  set escala(escala) {
    this.pilas.utilidades.validar_numero(escala);
    this.escala_x = escala;
    this.escala_y = escala;
  }

  get centro_y() {
    return this.sprite.originY;
  }

  set centro_y(y) {
    let comunes = {
      centro: 0.5,
      arriba: 0,
      abajo: 1,
      medio: 0.5
    };

    if (comunes[y] !== undefined) {
      y = comunes[y];
    }

    this.pilas.utilidades.validar_numero(y);
    this.sprite.setOrigin(this.centro_x, y);
  }

  get centro_x() {
    return this.sprite.originX;
  }

  set centro_x(x) {
    let comunes = {
      centro: 0.5,
      izquierda: 0,
      derecha: 1,
      medio: 0.5
    };

    if (comunes[x] !== undefined) {
      x = comunes[x];
    }

    this.pilas.utilidades.validar_numero(x);
    this.sprite.setOrigin(x, this.centro_y);
  }

  set transparencia(t) {
    this.pilas.utilidades.validar_numero(t);
    t = this.pilas.utilidades.limitar(t, 0, 100);
    this.sprite.alpha = 1 - t / 100;
  }

  get transparencia() {
    return (1 - this.sprite.alpha) * 100;
  }

  toString() {
    let clase = this.constructor["name"];
    return `<${clase} en (${this.x}, ${this.y})>`;
  }

  fallar_si_no_tiene_figura() {
    if (!this.figura) {
      throw Error(`Este actor no tiene figura física, no se puede llamar a este método`);
    }
  }

  crear_figura_rectangular(ancho: number = 0, alto: number = 0, dinamica: boolean = false, figura_sin_rotacion = false) {
    this.fallar_si_no_tiene_figura();

    this.pilas.utilidades.validar_numero(ancho);
    this.pilas.utilidades.validar_numero(alto);

    console.warn("TODO: tengo que leer la variable estatico y definirla en el cuerpo matter");

    if (ancho && alto) {
      this.sprite.setRectangle(ancho, alto);
    } else {
      this.sprite.setRectangle(this.ancho, this.alto);
    }

    this.sprite.setBounce(1);
    this.sprite.angle = -this.rotacion;
    this.dinamico = dinamica;

    if (figura_sin_rotacion) {
      this.sprite.setFixedRotation();
    }
  }

  crear_figura_circular(radio: number = 0, dinamica: boolean = false, figura_sin_rotacion = false) {
    this.fallar_si_no_tiene_figura();

    this.pilas.utilidades.validar_numero(radio);

    console.warn("TODO: tengo que leer la variable estatico y definirla en el cuerpo matter");

    if (radio) {
      this.sprite.setCircle(radio);
    } else {
      this.sprite.setCircle();
    }

    this.sprite.setBounce(1);
    this.sprite.angle = -this.rotacion;
    this.dinamico = dinamica;

    console.log({ figura_sin_rotacion });

    if (figura_sin_rotacion) {
      this.sprite.setFixedRotation(true);
    }
  }

  get ancho() {
    return this.sprite.width;
  }

  get alto() {
    return this.sprite.height;
  }

  set alto(a: number) {
    throw new Error("No puede definir este atributo");
  }

  set ancho(a: number) {
    throw new Error("No puede definir este atributo");
  }

  get estatico() {
    this.fallar_si_no_tiene_figura();

    return this.sprite.isStatic();
  }

  set estatico(estatico: boolean) {
    this.fallar_si_no_tiene_figura();

    this.sprite.setStatic(estatico);
  }

  set dinamico(dinamico: boolean) {
    this.fallar_si_no_tiene_figura();

    this.estatico = !dinamico;
  }

  get dinamico() {
    this.fallar_si_no_tiene_figura();

    return !this.estatico;
  }

  get fijo() {
    return this.sprite.scrollFactorX == 0;
  }

  set fijo(valor: boolean) {
    if (valor) {
      this.sprite.setScrollFactor(0, 0);
    } else {
      this.sprite.setScrollFactor(1, 1);
    }
  }

  set espejado(valor: boolean) {
    this.sprite.setFlipX(valor);
  }

  get espejado() {
    return this.sprite.flipX;
  }

  set espejado_vertical(valor: boolean) {
    this.sprite.setFlipY(valor);
  }

  get espejado_vertical() {
    return this.sprite.flipY;
  }

  cada_segundo() {}

  avanzar(rotacion: number = null, velocidad: number = 1) {
    rotacion = rotacion || this.rotacion;

    let r = this.pilas.utilidades.convertir_angulo_a_radianes(rotacion);

    this.x += Math.cos(r) * velocidad;
    this.y += Math.sin(r) * velocidad;
  }
}
