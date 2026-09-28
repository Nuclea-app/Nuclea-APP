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
  title: "Condiciones de uso — NÚCLEA",
  description:
    "Condiciones de uso del servicio NÚCLEA. Borrador pendiente de revisión jurídica.",
};

/**
 * /condiciones
 *
 * Esta URL la fija la pantalla de registro de la app
 * (nuclea-app/app/(auth)/register.tsx:18) y hasta hoy devolvía 404: el alta
 * obligaba a marcar una casilla que enlazaba a un documento inexistente.
 *
 * Regla que gobierna todo el texto: describe lo que el producto hace HOY.
 * Lo que está construido a medias se dice que está a medias. Prometer aquí
 * una función que todavía no se ejecuta convierte una carencia técnica en un
 * incumplimiento contractual.
 */
export default function CondicionesPage() {
  return (
    <article className="space-y-12">
      <header>
        <h1 className="mb-3 font-serif text-4xl leading-tight text-foreground">
          Condiciones de uso
        </h1>
        <p className="font-sans text-[13px] text-foreground/50">
          Última actualización: {ULTIMA_ACTUALIZACION}
        </p>
      </header>

      <Seccion id="quien" titulo="1. Quién presta el servicio">
        <p>
          NÚCLEA es un servicio prestado por{" "}
          <MarcaPendiente>
            pendiente: razón social, NIF y domicilio de la empresa
          </MarcaPendiente>
          . Estos datos son obligatorios por ley y faltan a propósito: no nos
          los inventamos.
        </p>
        <p>
          Dirección de contacto para cualquier asunto relacionado con el
          servicio, incluidas estas condiciones: <CorreoSoporte />.
        </p>
      </Seccion>

      <Seccion id="aceptacion" titulo="2. Qué aceptas al registrarte">
        <p>
          Al crear una cuenta aceptas estas condiciones y la{" "}
          <Link
            href="/privacidad"
            className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Política de privacidad
          </Link>
          . Si no estás de acuerdo con alguna parte, no crees la cuenta.
        </p>
      </Seccion>

      <Seccion id="que-es" titulo="3. Qué es NÚCLEA">
        <p>
          NÚCLEA guarda recuerdos —fotos, vídeos, audios, notas y dibujos—
          dentro de espacios que llamamos cápsulas. Cada cápsula está pensada
          para llegar algún día a una persona destinataria que tú eliges: bien
          porque tú decidas entregarla, bien porque dejes de entrar durante el
          tiempo que se describe en el apartado 7.
        </p>
        <p>
          NÚCLEA no es una red social, no es un servicio de copia de seguridad
          y no sustituye a un testamento ni a ningún otro documento con efectos
          jurídicos sobre tu herencia. Entregar una cápsula no transmite la
          propiedad de nada más que del contenido que hay dentro.
        </p>
      </Seccion>

      <Seccion id="estado" titulo="4. En qué estado está el servicio hoy">
        <Destacado titulo="Léelo antes de subir nada">
          <p>
            NÚCLEA está en desarrollo activo y buena parte de lo que el
            producto promete todavía no se ejecuta. Lo que sigue es la lista
            honesta, a día de hoy:
          </p>
          <Lista>
            <li>
              <strong>Funciona:</strong> registrarte, crear cápsulas, guardar
              recuerdos dentro de ellas, configurar quién las recibirá y
              consultar lo que has guardado.
            </li>
            <li>
              <strong>No se cobra nada.</strong> No hay planes contratables ni
              forma de pagar. Los precios que puedas haber visto en la
              aplicación o en nuestra comunicación son orientativos y todavía
              no están en vigor.
            </li>
            <li>
              <strong>La entrega automática por inactividad no está en
              funcionamiento.</strong> El comportamiento se describe en el
              apartado 7 porque es el núcleo del producto y queremos que lo
              conozcas desde el principio, pero hoy no existe ningún proceso
              que la dispare. No confíes todavía en que tu cápsula llegue sola.
            </li>
            <li>
              <strong>Los mensajes futuros se pueden programar, pero no se
              desbloquean solos</strong> en la fecha que elijas: el proceso que
              lo hace está sin construir.
            </li>
            <li>
              <strong>Puede haber fallos, interrupciones y pérdida de
              contenido.</strong> No uses NÚCLEA como copia única de un recuerdo
              que no quieras perder. Conserva tus originales.
            </li>
          </Lista>
          <p>
            Cuando alguna de estas funciones entre en servicio, te lo diremos y
            actualizaremos este apartado con la fecha.
          </p>
        </Destacado>
      </Seccion>

      <Seccion id="cuenta" titulo="5. Tu cuenta">
        <Lista>
          <li>
            Los datos que nos des al registrarte tienen que ser tuyos y ciertos.
            El correo importa especialmente: es por donde te avisamos de todo lo
            que afecta a tus cápsulas.
          </li>
          <li>
            Tu contraseña la custodias tú. Si crees que alguien ha entrado en tu
            cuenta, escríbenos a <CorreoSoporte /> cuanto antes.
          </li>
          <li>
            Si pierdes el acceso, puedes restablecer la contraseña desde la
            propia aplicación con un enlace que enviamos a tu correo.
          </li>
          <li>
            Edad mínima para registrarse:{" "}
            <MarcaPendiente>
              pendiente de decidir y de revisión jurídica
            </MarcaPendiente>
            .
          </li>
        </Lista>
      </Seccion>

      <Seccion id="contenido" titulo="6. Qué puedes guardar y qué no">
        <Lista>
          <li>
            Puedes guardar contenido del que tengas derecho a disponer. Si en un
            recuerdo aparecen otras personas, eres tú quien responde de poder
            guardarlo y de que algún día se entregue a la persona que has
            designado.
          </li>
          <li>
            No se puede guardar contenido ilícito, ni que vulnere derechos de
            terceros, ni material de abuso sexual infantil, ni contenido cuya
            mera tenencia esté prohibida.
          </li>
          <li>
            Cada cápsula tiene un límite de almacenamiento asociado a su tipo.
            Al alcanzarlo no se pueden subir más recuerdos a esa cápsula.
          </li>
        </Lista>
        <p>
          No revisamos lo que guardas: nuestro panel interno no muestra el
          contenido de las cápsulas y no lo miramos en el funcionamiento normal
          del servicio. Eso significa también que no podemos detectar por
          nuestra cuenta un incumplimiento de este apartado. Si recibimos una
          denuncia fundada o una orden de una autoridad competente, podemos
          suspender una cuenta o retirar contenido; cualquier acceso excepcional
          al contenido queda registrado. El procedimiento exacto está{" "}
          <MarcaPendiente>pendiente de escribir con la asesoría</MarcaPendiente>
          .
        </p>
      </Seccion>

      <Seccion id="propiedad" titulo="7. Tu contenido sigue siendo tuyo">
        <p>
          Lo que subes es tuyo. Nos autorizas únicamente a lo imprescindible
          para prestarte el servicio: almacenarlo, copiarlo entre nuestros
          sistemas, transformarlo técnicamente cuando haga falta (por ejemplo,
          generar una miniatura o una versión más ligera de un vídeo),
          transmitirlo a tu dispositivo y entregarlo a la persona que tú
          designes.
        </p>
        <p>
          No vendemos tu contenido, no lo usamos para publicidad y no lo usamos
          para entrenar sistemas de inteligencia artificial.
        </p>
      </Seccion>

      <Seccion
        id="entrega"
        titulo="8. Destinatario, entrega y protocolo de inactividad"
      >
        <p>
          Antes de activar una cápsula tienes que designar a la persona que la
          recibirá: nombre, apellidos y correo electrónico. Si eliges entrega
          física hace falta además una dirección postal.
        </p>
        <Destacado titulo="Lo que tienes que entender antes de activar">
          <p>
            La entrega por inactividad se dispara porque dejas de entrar, no
            porque hayamos comprobado que has fallecido. El plazo previsto es:
            tres meses sin entrar en NÚCLEA, aviso por correo y notificación;
            quince días más, aviso final; siete días más, entrega automática a
            la persona que designaste.
          </p>
          <p>
            Inactividad significa <strong>no entrar</strong>, no «no subir
            nada»: cualquier entrada válida reinicia el contador. Este protocolo
            forma parte del producto y no se puede desactivar. Si eso no es lo
            que quieres, NÚCLEA no es el servicio que buscas.
          </p>
          <p>
            Como se dice en el apartado 4, hoy este proceso todavía no se
            ejecuta.
          </p>
        </Destacado>
        <Lista>
          <li>
            El correo con el que avisamos a la persona destinataria no revela el
            contenido de la cápsula. Antes de abrirla tiene que verificar su
            identidad.
          </li>
          <li>
            <strong>La entrega no se puede deshacer.</strong> Una vez entregada,
            la copia es de quien la ha recibido: ni tú ni nosotros la podemos
            retirar, y esa cápsula deja de poder borrarse.
          </li>
          <li>
            Quien recibe una cápsula no paga por recibirla y puede descargar su
            contenido.
          </li>
        </Lista>
      </Seccion>

      <Seccion id="pagos" titulo="9. Precios y pagos">
        <Lista>
          <li>
            <strong>Hoy no se cobra nada</strong> por usar NÚCLEA y no hay
            ninguna forma de pagar dentro del producto.
          </li>
          <li>
            Cuando empecemos a cobrar te avisaremos con antelación y hará falta
            que lo contrates de forma expresa. No habrá cargo automático por
            dejar pasar el final de un periodo de prueba.
          </li>
          <li>
            Condiciones concretas de los planes, facturación, renovaciones,
            devoluciones y derecho de desistimiento:{" "}
            <MarcaPendiente>
              pendiente; se redactará cuando exista el sistema de cobro y con
              revisión jurídica previa
            </MarcaPendiente>
            .
          </li>
        </Lista>
      </Seccion>

      <Seccion id="baja" titulo="10. Baja y eliminación de la cuenta">
        <Lista>
          <li>Puedes dejar de usar NÚCLEA cuando quieras.</li>
          <li>
            Para eliminar tu cuenta, escríbenos a <CorreoSoporte /> desde la
            dirección con la que te registraste. Estamos construyendo la opción
            para hacerlo desde la propia aplicación; hasta que esté disponible,
            este es el camino.
          </li>
          <li>
            Una cápsula que ya se entregó no se puede eliminar: la copia
            pertenece a la persona que la recibió.
          </li>
          <li>
            Qué se borra, qué se conserva y durante cuánto tiempo está
            explicado en la{" "}
            <Link
              href="/privacidad#conservacion"
              className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Política de privacidad
            </Link>
            .
          </li>
        </Lista>
      </Seccion>

      <Seccion id="responsabilidad" titulo="11. Disponibilidad y responsabilidad">
        <p>
          No garantizamos que el servicio funcione sin interrupciones ni sin
          errores, y en el estado actual de desarrollo es previsible que los
          haya. Guarda tus originales.
        </p>
        <p>
          Nada de lo escrito aquí limita tu responsabilidad ni la nuestra en los
          casos en que la ley no lo permite, ni los derechos que la normativa
          española reconoce a las personas consumidoras. La cláusula de
          limitación de responsabilidad está{" "}
          <MarcaPendiente>pendiente de redacción jurídica</MarcaPendiente>.
        </p>
      </Seccion>

      <Seccion id="cambios" titulo="12. Cambios en estas condiciones">
        <p>
          Si cambiamos estas condiciones te avisaremos por correo o dentro de la
          aplicación con antelación razonable. Si el cambio es sustancial y no
          lo aceptas, puedes darte de baja y pedirnos una copia de tus datos
          antes de irte.
        </p>
      </Seccion>

      <Seccion id="ley" titulo="13. Ley aplicable y reclamaciones">
        <p>
          Estas condiciones se rigen por la legislación española. Si eres
          consumidora o consumidor, puedes reclamar ante los juzgados de tu
          domicilio. El resto de fueros y el procedimiento de reclamación están{" "}
          <MarcaPendiente>pendientes de revisión jurídica</MarcaPendiente>.
        </p>
      </Seccion>

      <Seccion id="contacto" titulo="14. Contacto">
        <p>
          Para cualquier cosa relacionada con estas condiciones o con tu cuenta:{" "}
          <CorreoSoporte />.
        </p>
      </Seccion>
    </article>
  );
}
