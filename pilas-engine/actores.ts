class Actores {
  pilas: Pilas;

  constructor(pilas) {
    this.pilas = pilas;
  }

  Caja(x, y) {
    return this.crear_actor("Caja");
  }

  crear_actor(nombre) {
    let clase = window[nombre];
    let actor = new clase(this.pilas);

    // Toma las propiedades del actor pero como una extensión de las
    // propiedades iniciales.
    let p = this.pilas.utilidades.combinar_propiedades(actor.propiedades_base, actor.propiedades);

    actor.pre_iniciar(p);
    actor.iniciar();
    return actor;
  }

  Aceituna(x: number = 0, y: number = 0) {
    return new Aceituna(this.pilas, x, y);
  }

  Conejo() {
    return this.crear_actor("Conejo");
  }
}
