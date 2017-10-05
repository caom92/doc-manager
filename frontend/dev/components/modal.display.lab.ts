import { Component, Input, OnInit } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ng2-materialize'
import { LanguageService } from '../services/app.language'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

// El componente del modal que despliega el archivo buscado por el usuario
@Component({
  templateUrl: '../templates/modal.display.lab.html'
})
export class LabDocumentDisplayModalComponent 
  extends MzBaseModal 
  implements OnInit
{
  // Las opciones de configuracion del modal
  modalOptions = {
  }

  // El nombre del tipo de documento a desplegar
  @Input()
  documentType: string = null

  // La fecha del archivo de solicitud
  @Input()
  requestFileDate: string = null

  // El nombre del archivo de solicitud
  @Input()
  requestFileName: string = null

  // La fecha del archivo del resultado
  @Input()
  resultFileDate: string = null

  // El nombre del archivo del resultado
  @Input()
  resultFileName: string = null

  // El URL al documento de solicitud que sera desplegado
  sanitizedRequestPath: SafeResourceUrl = null

  // El URL al documento de resultados que sera desplegado
  sanitizedResultPath: SafeResourceUrl = null

  // Constructor del componente donde importaremos una instancia del servicio 
  // de idioma
  constructor(
    private langManager: LanguageService,
    private sanitizer: DomSanitizer
  ) {
    super() // invocamos el constructor de la clase padre
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    // generamos el URL valido para cargar los documentos
    let baseURL = 
      'http://localhost/doc-manager/backend/ViewerJS/#../documents/lab/'
    this.sanitizedRequestPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      baseURL + this.requestFileName
    )
    this.sanitizedResultPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      baseURL + this.resultFileName
    )

    // inicializamos las pestañas de navegacion
    $('ul.tabs').tabs()
  } // ngOnInit(): void
}