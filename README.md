# Roll the Dice

Misión M1 · El Despertar del DOM

## Cómo probarlo

Abre index.html con Live Server. Empiezas con 100 fichas: elige tu apuesta (mínimo 10),
desliza para decidir por debajo de qué número tiene que salir el dado y pulsa
Tirar. Cuanto más arriesgas, mayor es el multiplicador. Si te quedas sin fichas pierdes.
Tecla secreta: pulsa "n" para el modo noche.

## Uso de IA

Usé Claude Code (modelo Claude Opus 5.5) fase a fase. Claude me ayudó mucho en la parte de
estilos, me dio la estructura inicial del JS. Lo he usado para entender lo que iba haciendo mal
y ejemplos prácticos. Lo he usado al final de cada fase para comprobar lo que iba haciendo.
También lo usé como corrector antes de entregar.

Algún prompt que he usado:
"¿Puedes hacer una corrección siguiendo las métricas del documento para que me pueda hacer una idea
de qué puedo haber pasado por alto?".

Verifiqué cada fase en el navegador haciendo pruebas específicas de cada fase. Usé en todo momento la consola
del navegador para asegurarme de que no hubiera errores que no viera.

Cosas que escribí a mano: calcularMultiplicador, actualizarPanel, tirarDado, la
condición para ganar, la comprobación del saldo, la creación de las fichas con
createElement y el closest de la delegación. En general fui escribiendo fase a fase pidiendo
consejo mirando los ejemplos.

## Autopsia

1. Cargo el JavaScript con type="module" que al igual que defer, espera a que el
   HTML esté leído antes de ejecutarse, pero además activa el strict mode y
   evita variables globales. Descarté script defer aunque permite abrir el
   juego con doble clic, porque deja todo el código en el ámbito global y sin
   strict mode.

2. He usado un solo listener en la lista del historial en vez de uno
   por ficha. Las fichas se crean durante la partida, así que tendría que
   añadir un listener nuevo en cada tirada. Con closest("button") sé qué
   ficha se ha pulsado.
