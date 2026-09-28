import type { Metadata } from "next";
import Link from "next/link";
import {
  CorreoSoporte,
  Destacado,
  Lista,
  MarcaPendiente,
  Seccion,
  ULTIMA_ACTUALIZACION,
} from "../_componentes/piezas";

export const metadata: Metadata = {
  title: "Política de privacidad — NÚCLEA",
  description:
    "Qué datos trata NÚCLEA, para qué, cuánto tiempo y qué no te prometemos sobre el cifrado. Borrador pendiente de revisión jurídica.",
};

/**
 * /privacidad
 *
 * URL fijada por nuclea-app/app/(auth)/register.tsx:19, que hasta hoy
 * devolvía 404.
 *
 * El apartado 4 es el motivo de que este documento no se pueda copiar de una
 * plantilla. NÚCLEA conserva las claves a propósito, porque sin ellas no
 * podría entregar la cápsula el día que su dueña ya no esté, que es justo lo
 * que la gente compra. Decir aquí lo contrario —o dejarlo ambiguo— es la
 * conducta exacta que la FTC sancionó a Zoom en 2020 sin que hubiera ninguna
 * brecha: lo sancionable fue la frase, no un fallo técnico.
 *
 * La redacción del apartado 4 sale literal de
 * info/NUCLEA_Cifrado_y_Privacidad.md §4 y §3.1, y no se toca sin volver a
 * ese documento.
 */
export default function PrivacidadPage() {
  return (
    <article className="space-y-12">
      <header>
        <h1 className="mb-3 font-serif text-4xl leading-tight text-foreground">
          Política de privacidad
        </h1>
        <p className="font-sans text-[13px] text-foreground/50">
          Última actualización: {ULTIMA_ACTUALIZACION}
        </p>
      </header>

      <Seccion id="responsable" titulo="1. Quién trata tus datos">
        <p>
          Responsable del tratamiento:{" "}
          <MarcaPendiente>
            pendiente: razón social, NIF y domicilio de la empresa
          </MarcaPendiente>
          . Faltan a propósito: son datos obligatorios y no nos los inventamos.
        </p>
        <p>
          Contacto para cualquier asunto de privacidad, incluido el ejercicio de
          tus derechos: <CorreoSoporte />. Delegado de protección de datos:{" "}
          <MarcaPendiente>
            pendiente de decidir si es obligatorio en nuestro caso
          </MarcaPendiente>
          .
        </p>
      </Seccion>

      <Seccion id="resumen" titulo="2. El resumen honesto">
        <Destacado>
          <p>
            NÚCLEA existe para entregar tus recuerdos a otra persona el día que
            tú ya no estés. Para poder cumplir esa promesa,{" "}
            <strong>conservamos a propósito la clave</strong> que abre tu
            cápsula. Tenemos, por tanto, la capacidad técnica de descifrar tu
            contenido.
          </p>
          <p>
            No te decimos que sea imposible para nosotros, porque no lo es. Lo
            que te decimos es que{" "}
            <strong>no lo hacemos, y que cualquier excepción queda
            registrada</strong>
            . El apartado 4 lo explica entero, con lo que hoy todavía no está
            hecho.
          </p>
        </Destacado>
      </Seccion>

      <Seccion id="datos" titulo="3. Qué datos tratamos">
        <p>
          <strong>De tu cuenta:</strong> nombre, correo electrónico, tu
          contraseña guardada en forma de resumen criptográfico (nunca en
          claro), tu fecha de nacimiento si la indicas, tu foto de perfil si la
          subes y la fecha en que te diste de alta. Si entras con Google,
          además, los datos que Google nos devuelve de tu perfil.
        </p>
        <p>
          <strong>De tu uso del servicio:</strong> la fecha y hora de tu última
          entrada. Es el dato que alimenta el protocolo de inactividad descrito
          en las{" "}
          <Link
            href="/condiciones#entrega"
            className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Condiciones de uso
          </Link>
          , y por eso no se puede dejar de registrar.
        </p>
        <p>
          <strong>Tu contenido:</strong> las fotos, vídeos, audios, notas y
          dibujos que subes, junto con lo que escribes sobre ellos (título,
          descripción, lugar y fecha del recuerdo) y el tamaño y tipo de cada
          fichero.
        </p>
        <p>
          <strong>Datos de otras personas que tú nos das:</strong> los de quien
          recibirá la cápsula —nombre y apellidos, relación contigo, correo
          electrónico y, si procede, teléfono y dirección postal— y los de las
          personas que participan en una cápsula compartida. El apartado 5
          habla de esto aparte, porque son datos de terceros.
        </p>
        <p>
          <strong>Técnicos:</strong> el identificador que tu dispositivo usa
          para recibir notificaciones, y los registros normales de
          funcionamiento de nuestros servidores y proveedores.
        </p>
        <p>
          <strong>De pago:</strong> ninguno. Hoy no se cobra y no tratamos
          datos bancarios ni de tarjeta.
        </p>
      </Seccion>

      <Seccion id="cifrado" titulo="4. Cómo protegemos tu contenido y qué NO te prometemos">
        <Destacado titulo="Lo que sí podemos prometerte">
          <p>
            Tus recuerdos se guardan cifrados con una clave única de tu cápsula,
            distinta de la de cualquier otra. Ninguna persona de NÚCLEA accede a
            su contenido en el funcionamiento normal del servicio: nuestro panel
            interno no lo muestra y cualquier acceso excepcional queda
            registrado. Conservamos esa clave a propósito, y solo por eso
            podemos entregar tu cápsula el día que corresponda aunque tú ya no
            estés. Cuando decidas borrar, destruimos la clave y el contenido
            queda irrecuperable, también en nuestras copias de seguridad.
          </p>
        </Destacado>

        <p>
          <strong>Lo que esto no es.</strong> NÚCLEA no funciona con el modelo
          en el que la clave vive solo en tu dispositivo y el proveedor no puede
          abrir nada. Ese modelo es incompatible con el producto: si la única
          copia de la clave fuera tuya, el día que dejaras de estar lo que
          entregaríamos a tu destinatario sería un fichero ilegible. Si lo que
          buscas es un almacén que su dueño no pueda abrir bajo ninguna
          circunstancia, NÚCLEA no es ese producto y preferimos decírtelo aquí.
        </p>

        <p>
          <strong>Y lo que hoy todavía no está hecho.</strong> Esta parte no
          suele aparecer en documentos como este. La escribimos porque lo
          contrario sería prometer de más:
        </p>
        <Lista>
          <li>
            <strong>La clave maestra vive en la configuración de nuestro
            servidor</strong>, no todavía en un servicio de custodia
            independiente. Quien tenga acceso a esa configuración tiene la
            clave, y no queda registro de cada uso. Cambiarlo está planificado.
          </li>
          <li>
            <strong>El texto todavía no va cifrado.</strong> El sobre protege
            hoy los ficheros —fotos, vídeos, audios—. Los títulos, las
            descripciones, los lugares y el texto de tus notas y mensajes están
            guardados en claro en la base de datos. Es el contenido más íntimo
            del producto, lo sabemos, y es la siguiente pieza. Hasta que esté,
            «tu contenido está cifrado» no vale para el texto de una nota.
          </li>
          <li>
            <strong>Los datos de quien recibirá la cápsula están en claro a
            propósito.</strong> Su correo es la dirección a la que hay que
            escribir el día de la entrega: un dato que no pudiéramos leer no
            serviría para enviar ese correo.
          </li>
          <li>
            <strong>El contenido subido durante la beta no está cifrado</strong>{" "}
            y, durante un tiempo, pudo abrirse desde un enlace directo sin
            necesidad de identificarse. Estamos normalizándolo y cerrando ese
            acceso.{" "}
            <MarcaPendiente>
              pendiente: la asesoría tiene que decidir cómo se comunica esto y
              si procede notificarlo formalmente
            </MarcaPendiente>
          </li>
          <li>
            <strong>Destruir la clave no deja el contenido irrecuperable en el
            mismo instante.</strong> Nuestras copias de seguridad conservan un
            estado anterior durante una ventana de tiempo, y mientras dure esa
            ventana la clave podría restaurarse. El plazo exacto está{" "}
            <MarcaPendiente>pendiente de medir</MarcaPendiente> y se escribirá
            aquí en cuanto lo sepamos.
          </li>
          <li>
            El procedimiento de acceso excepcional —quién puede pedirlo, con
            qué justificación y qué se te cuenta después— está{" "}
            <MarcaPendiente>pendiente de escribir con la asesoría</MarcaPendiente>
            .
          </li>
        </Lista>
      </Seccion>

      <Seccion id="terceros" titulo="5. Los datos de las personas a las que nombras">
        <p>
          Para configurar una cápsula nos das datos de alguien que no tiene
          cuenta en NÚCLEA y que probablemente no sabe que existe. Los usamos
          solo para lo que tú nos pides: avisar a esa persona y entregarle la
          cápsula cuando corresponda. No los usamos para nada más, no los
          cruzamos con otros datos y no le enviamos comunicaciones comerciales.
        </p>
        <p>
          Al dárnoslos, nos confirmas que puedes hacerlo. Esa persona tiene los
          mismos derechos que tú sobre sus datos y puede ejercerlos
          escribiéndonos a <CorreoSoporte />, aunque nunca haya usado NÚCLEA.
        </p>
        <p>
          En las cápsulas compartidas, cada participante ve solo lo que ha
          aportado hasta que la cápsula se abre.
        </p>
      </Seccion>

      <Seccion id="finalidades" titulo="6. Para qué usamos cada dato y con qué base legal">
        <Lista>
          <li>
            <strong>Darte el servicio</strong> (tu cuenta, tus cápsulas, tu
            contenido, la entrega): ejecución del contrato que aceptas al
            registrarte.
          </li>
          <li>
            <strong>El protocolo de inactividad</strong> (registrar tu última
            entrada, avisarte y, llegado el caso, entregar): ejecución del
            contrato. Es la prestación principal del servicio y por eso no se
            puede desactivar.
          </li>
          <li>
            <strong>Avisos imprescindibles</strong> (vencimientos, entregas,
            seguridad de la cuenta): ejecución del contrato. No se pueden
            desactivar sin dejar de usar el servicio. Los avisos opcionales sí,
            y esos van con tu consentimiento.
          </li>
          <li>
            <strong>Seguridad</strong> (registros de acceso, prevención de
            abusos): interés legítimo en mantener el servicio en pie y proteger
            el contenido de todo el mundo.
          </li>
          <li>
            <strong>Obligaciones legales</strong>: cuando una norma nos obligue
            a conservar o comunicar algo.
          </li>
        </Lista>
        <p>
          No hacemos perfilado ni decisiones automatizadas con efectos
          jurídicos sobre ti, con una excepción que conviene nombrar: la entrega
          por inactividad es un proceso automático. No decide sobre tus
          derechos, hace lo que tú le pediste que hiciera, y antes de ejecutarse
          te avisa dos veces con más de veinte días de margen.
        </p>
      </Seccion>

      <Seccion id="conservacion" titulo="7. Cuánto tiempo conservamos las cosas">
        <Lista>
          <li>
            <strong>Mientras tengas cuenta</strong>, conservamos tu cuenta y tus
            cápsulas.
          </li>
          <li>
            <strong>Si borras un recuerdo o una cápsula</strong>, borramos sus
            ficheros de nuestro almacenamiento y destruimos la clave de esa
            cápsula, con la salvedad del plazo de las copias de seguridad que
            explica el apartado 4.
          </li>
          <li>
            <strong>Si eliminas tu cuenta</strong>, borramos tus cápsulas, tus
            recuerdos, tus avisos, tus sesiones y los identificadores de tus
            dispositivos. Queda un registro mínimo de la operación de borrado
            —qué se borró, cuándo y cuánto ocupaba— que{" "}
            <strong>
              no contiene ningún nombre de fichero, ningún título y ningún texto
              tuyo
            </strong>
            . Lo conservamos para poder demostrar que el borrado se hizo.
          </li>
          <li>
            <strong>Si alguna de tus cápsulas ya se entregó</strong>, esa
            entrega no desaparece cuando eliminas tu cuenta: el contenido
            pertenece ya a quien lo recibió y seguirá pudiendo abrirlo.
          </li>
          <li>
            Conservamos lo que una obligación legal nos exija conservar,
            durante el plazo que esa obligación marque.{" "}
            <MarcaPendiente>
              pendiente: la lista concreta de plazos legales, con la asesoría
            </MarcaPendiente>
          </li>
        </Lista>
        <p>
          La eliminación de cuenta desde la propia aplicación está en
          construcción. Hasta que esté disponible se pide por correo a{" "}
          <CorreoSoporte /> y la hacemos nosotros.
        </p>
      </Seccion>

      <Seccion id="proveedores" titulo="8. Con quién compartimos datos">
        <p>
          No vendemos datos personales, no los cedemos a anunciantes y no hay
          publicidad en NÚCLEA. Sí nos apoyamos en proveedores que tratan datos
          por nuestra cuenta y siguiendo nuestras instrucciones:
        </p>
        <Lista>
          <li>Alojamiento de la aplicación y ejecución del servidor.</li>
          <li>Base de datos.</li>
          <li>Almacenamiento de los ficheros que subes.</li>
          <li>Envío de correo electrónico.</li>
          <li>Inicio de sesión con Google, si eliges esa opción.</li>
          <li>Envío de notificaciones a tu móvil.</li>
        </Lista>
        <p>
          <MarcaPendiente>
            pendiente: la lista nominal de proveedores, el país desde el que
            trata cada uno y el contrato de encargo firmado con cada uno, antes
            de publicar
          </MarcaPendiente>{" "}
          Publicar una lista incompleta de encargados es peor que publicarla
          tarde, así que aquí van las categorías hasta que esté cerrada.
        </p>
        <p>
          También comunicaremos datos a jueces, tribunales o administraciones
          cuando una norma nos obligue.
        </p>
      </Seccion>

      <Seccion id="transferencias" titulo="9. Transferencias fuera del Espacio Económico Europeo">
        <p>
          Algunos de nuestros proveedores son empresas estadounidenses y es
          previsible que parte del tratamiento ocurra fuera del Espacio
          Económico Europeo. El detalle —qué proveedor, qué datos y con qué
          garantía— está{" "}
          <MarcaPendiente>pendiente de confirmar proveedor por proveedor</MarcaPendiente>
          . No lo afirmamos aquí hasta haberlo comprobado.
        </p>
      </Seccion>

      <Seccion id="derechos" titulo="10. Tus derechos">
        <p>
          Puedes pedirnos acceder a tus datos, rectificarlos, suprimirlos,
          limitar u oponerte a su tratamiento, y recibir una copia en un formato
          que puedas llevarte a otro sitio. También puedes retirar en cualquier
          momento el consentimiento que nos hayas dado, sin que eso afecte a lo
          hecho antes.
        </p>
        <p>
          Escribe a <CorreoSoporte /> desde la dirección con la que te
          registraste. Podemos pedirte que acredites tu identidad si hay dudas
          razonables de que eres tú.
        </p>
        <p>
          Si crees que no te hemos atendido bien, puedes reclamar ante la
          Agencia Española de Protección de Datos (aepd.es).
        </p>
      </Seccion>

      <Seccion id="fallecimiento" titulo="11. Qué pasa cuando alguien fallece">
        <p>
          Es una pregunta central en un producto como este. La ley española
          (artículo 96 de la Ley Orgánica 3/2018) permite que las personas
          vinculadas al fallecido por razones familiares o de hecho, y sus
          herederos, pidan acceder a sus datos personales, rectificarlos o
          suprimirlos, salvo que la persona lo hubiera prohibido expresamente.
        </p>
        <p>
          Eso convive con lo que tú hayas decidido en NÚCLEA: la cápsula se
          entrega a la persona que designaste, y esa decisión es la que manda
          sobre su contenido. El procedimiento para atender una solicitud de
          este tipo, la documentación que pediremos y cómo se resuelve un
          conflicto entre lo que dejaste configurado y lo que pida un heredero
          están{" "}
          <MarcaPendiente>
            pendientes de escribir con la asesoría jurídica
          </MarcaPendiente>
          .
        </p>
      </Seccion>

      <Seccion id="menores" titulo="12. Menores de edad">
        <p>
          La edad mínima para usar NÚCLEA está{" "}
          <MarcaPendiente>pendiente de decidir</MarcaPendiente> y se fijará en
          las Condiciones de uso antes de abrir el registro al público general.
          Si detectamos una cuenta de una persona por debajo de esa edad sin la
          autorización que la ley exija, la eliminaremos.
        </p>
      </Seccion>

      <Seccion id="cookies" titulo="13. Cookies y almacenamiento en tu navegador">
        <p>
          La versión web de NÚCLEA usa únicamente lo imprescindible para
          funcionar: la cookie que mantiene tu sesión abierta y un
          almacenamiento local que permite instalar la web como aplicación y que
          siga respondiendo con mala conexión.
        </p>
        <p>
          No usamos herramientas de analítica, ni de publicidad, ni de
          seguimiento de terceros. Por eso no verás un aviso de cookies: no hay
          ninguna que requiera tu consentimiento.
        </p>
      </Seccion>

      <Seccion id="cambios" titulo="14. Cambios en esta política">
        <p>
          Cuando cambiemos esta política actualizaremos la fecha del
          encabezado. Si el cambio afecta de forma sustancial a cómo tratamos
          tus datos, te avisaremos por correo o dentro de la aplicación antes de
          que entre en vigor.
        </p>
      </Seccion>

      <Seccion id="contacto" titulo="15. Contacto">
        <p>
          Para cualquier cosa relacionada con tus datos: <CorreoSoporte />.
        </p>
      </Seccion>
    </article>
  );
}
