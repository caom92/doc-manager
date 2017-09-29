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
      localStorage.lang = 'es'
    }

    // inicializamos los mensajes en el idioma adecuado
    this.langManager.initMessages()

    // desplegamos el menu lateral y escondemos la animacion de carga
    this.global.displaySideNav()
    this.global.hideSpinner()
  } // ngOnInit()

  // Esta funcion se ejecuta cuando el usuario cambio el idioma de la pagina
  onLanguageButtonClicked(lang): void {
    this.langManager.changeLanguage(lang)
  }
} // export class HomeComponent implements OnInit
