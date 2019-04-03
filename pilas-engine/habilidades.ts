/// <reference path="habilidades/rotar-constantemente"/>

class Habilidades {
  pilas: Pilas;
  _habilidades: any[];

  constructor(pilas) {
    this.pilas = pilas;
    this._habilidades = [];

    this.vincular(RotarConstantemente);
  }

  buscar(habilidad: String) {
    let lista = this.generar_lista_de_similitudes(habilidad);

    //if (lista[0].habilidad.nombre !== habilidad) {
    // console.warn(`Asumiendo que se quiere aplicar la habilidad ${lista[0].habilidad.nombre}, aunque se la solicitó como ${habilidad}`);
    //}

    return lista[0].habilidad.clase;
  }

  generar_lista_de_similitudes(habilidad) {
    return this._habilidades.map(h => {
      return {
        similitud: this.pilas.utilidades.obtener_similaridad(
          h.nombre,
          habilidad
        ),
        habilidad: h
      };
    });
  }

  listar() {
    return this._habilidades.map(h => h.nombre);
  }

  vincular(clase) {
    let encontrado = this._habilidades.find(function(h) {
      return (h.nombre = clase.name);
    });

    if (!encontrado) {
      this._habilidades.push({
        nombre: clase.name,
        clase: clase
      });
    } else {
      console.warn(
        `No se vinculó la clase ${
          clase.name
        } porque ya estaba vinculada con anterioridad.`
      );
    }
  }
}
