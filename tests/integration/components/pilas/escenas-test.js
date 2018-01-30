import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("pilas", "Integration | Pilas | escenas", {
  integration: true
});

test("puede crear escenas y actores", function(assert) {
  const done = assert.async();

  this.set("cuandoInicia", pilas => {
    assert.ok(pilas.escenas, "Existe el acceso a las escenas");
    assert.ok(pilas.escenas.Normal, "Existe la escena Normal");

    let escena = pilas.escenas.Normal();
    assert.equal(escena.actores.length, 0, "La escena comienza sin actores");

    pilas.actores.Caja();

    assert.equal(escena.actores.length, 1, "El actor se agrega a la escena automáticamente");
    assert.equal(escena.id, pilas.escena_actual().id);

    escena = pilas.escenas.Normal();
    assert.equal(escena.actores.length, 0, "Al crear otra escena vuelve a estar limpia de actores");

    done();
  });

  this.render(hbs`{{pilas-test cuandoInicia=cuandoInicia}}`);
});

test("puede crear escenas personalizadas", function(assert) {
  const done = assert.async();

  this.set("proyecto", {
    titulo: "Proyecto para pilas-test",
    ancho: 500,
    alto: 500,
    codigos: {
      escenas: [
        {
          nombre: "principal",
          codigo: `class MiEscena extends Escena {
            iniciar() {
              alert("escena!");
            }

          }`
        }
      ],
      actores: []
    },
    escenas: [
      {
        nombre: "principal",
        id: 1,
        actores: []
      }
    ]
  });

  this.set("cuandoInicia", (pilas, contexto) => {
    assert.ok(pilas.escenas, "Existe el acceso a las escenas");

    pilas.escenas.vincular(contexto.__clases.MiEscena)
    pilas.escenas.MiEscena();

    done();
  });

  this.render(hbs`{{pilas-test cuandoInicia=cuandoInicia proyecto=proyecto}}`);
});