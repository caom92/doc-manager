import { Component, OnInit } from '@angular/core'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { StateService } from '@uirouter/angular'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'

// Componente que define el comportamiento de la pagina de inicio
@Component({
  selector: 'app-root',
  templateUrl: '../templates/app.home.html',
})
export class HomeComponent implements OnInit
{ 
  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private router: StateService,
    private global: GlobalElementsService,
    private langManager: LanguageService
  ) {
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    // si no hay ningun idioma definimo, definimos el idioma español por defecto
    if (localStorage.lang == null) {
      this.langManager.changeLanguage('es')
    }

    // inicializamos los mensajes en el idioma adecuado
    this.langManager.initMessages()

    // si el usuario no ha iniciado sesion, coloca la bandera como falso
    if (localStorage.is_logged_in === undefined) {
      localStorage.is_logged_in = false
    }

    // idealmente, cuando el usuario navega a la pagina, deberiamos revisar el 
    // cookie de sesion en el servidor, sin embargo, como esta es una operacion 
    // asincrona, no se ajusta al modo de trabajo de ui-router, por lo que por 
    // lo pronto dependeremos de sessionStorage
    this.server.read(
      'check-session', 
      {}, 
      (response: any) => {
        if (response.meta.return_code == 0) {
          this.global.hideSpinner()
          if (!response.data) {
            // si el usuario no ha iniciado sesion, desactivamos la bandera y 
            // redireccionamos a la pantalla de inicio de sesion
            localStorage.is_logged_in = false
            this.router.go('login')
          } else {
            // de lo contrario, permitimos la navegacion
            localStorage.is_logged_in = true
            
            // no olvides desplegar el menu lateral de navegacion
            this.global.displaySideNav()
          }
        } else {
          // si hubo un problema con la comunicacion con el servidor 
          // desplegamos un mensaje de error al usuario 
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'check-session', response.meta.return_code
            )
          )
        } // if (result.meta.return_code == 0)
      } // (response: Response)
    ) // this.server.update

    // desplegamos el menu lateral y escondemos la animacion de carga
    // this.global.displaySideNav()
    // this.global.hideSpinner()
  } // ngOnInit()

  // Esta funcion se ejecuta cuando el usuario cambio el idioma de la pagina
  onLanguageButtonClicked(lang): void {
    this.langManager.changeLanguage(lang)
  }

  // Esta es la funcion que se invoca cuando el usuario hace clic en el boton 
  // de cerrar sesion
  onLogOutButtonClicked(): void {
    this.server.read(
      'logout', 
      {}, 
      (response: any) => {
        if (response.meta.return_code == 0) {
          // si la sesion fue cerrada correctamente, desactivamos la bandera y 
          // redireccionamos al usuario a la pantalla de inicio de sesion
          let lang = localStorage.lang
          localStorage.clear()
          localStorage.lang = lang
          localStorage.is_logged_in = false
          this.router.go('login')
        } else {
          // si hubo un problema con la comunicacion con el servidor, 
          // desplegamos un mensaje de error al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'logout', response.meta.return_code
            )
          )
        } // if (result.meta.return_code == 0)
      } // (response: Response)
    ) // this.server.update
  } // onLogOutButtonClicked()
} // export class HomeComponent implements OnInit
