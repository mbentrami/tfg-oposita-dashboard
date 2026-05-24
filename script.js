// espera a que todo el html exista
document.addEventListener('DOMContentLoaded', function () {

  // referencias principales del dashboard
  var tabs            = Array.from(document.querySelectorAll('.tab'));
  var iframe          = document.getElementById('iframe-dashboard');
  var etiquetaEsquina = document.getElementById('etiqueta-esquina');
  var stage           = document.getElementById('stage');
  var btnAmpliar      = document.getElementById('btn-ampliar');

  // adapta la url antes de cargarla
  function prepararUrl(url) {
    if (!url) return url;

    // sustituye el dominio antiguo
    var urlFinal = url.replace('datastudio.google.com', 'lookerstudio.google.com');

    // añade parámetros para ocultar elementos de looker
    var separador = urlFinal.includes('?') ? '&' : '?';
    urlFinal = urlFinal + separador + 'hideNavigation=true&chrome=false';

    return urlFinal;
  }

  // cambia de sección
  function activarTab(nombreTab) {

    tabs.forEach(function (tab) {

      // comprueba si es el tab actual
      var activo = tab.dataset.tab === nombreTab;

      // actualiza estado accesible
      tab.setAttribute('aria-selected', activo ? 'true' : 'false');

      if (activo) {

        var url = prepararUrl(tab.dataset.src);

        // evita recargar el iframe innecesariamente
        if (url && url !== iframe.src) {
          iframe.src = url;
        }

        // muestra el nombre de la sección activa
        etiquetaEsquina.textContent =
          tab.querySelector('.tab-nombre').textContent;
      }
    });

    // guarda el tab en la url
    history.replaceState(null, '', '#' + nombreTab);
  }

  // recorre todos los tabs
  tabs.forEach(function (tab, indice) {

    // navegación con click
    tab.addEventListener('click', function () {
      activarTab(tab.dataset.tab);
    });

    // control con teclado
    tab.addEventListener('keydown', function (e) {

      // detecta flechas izquierda y derecha
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {

        e.preventDefault();

        // define hacia donde moverse
        var direccion = e.key === 'ArrowRight' ? 1 : -1;

        // calcula el siguiente tab
        var siguiente =
          (indice + direccion + tabs.length) % tabs.length;

        // activa el nuevo tab
        activarTab(tabs[siguiente].dataset.tab);

        // mueve el foco
        tabs[siguiente].focus();
      }
    });

  });

  // obtiene el tab desde la url
  var inicial = (location.hash || '#vision').replace('#', '');

  // comprueba si existe
  var existe = tabs.find(function (tab) {
    return tab.dataset.tab === inicial;
  });

  // carga la sección inicial
  if (existe) {
    activarTab(inicial);
  }

  // botón de pantalla completa
  btnAmpliar.addEventListener('click', function () {

    // si ya está ampliado, sale
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    // activa fullscreen sobre el dashboard
    stage.requestFullscreen();
  });

});