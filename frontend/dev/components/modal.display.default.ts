import { Component, Input, OnInit } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ng2-materialize'
import { LanguageService } from '../services/app.language'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { environment } from '../environments/environment'

// El componente del modal que despliega el archivo buscado por el usuario
@Component({
  templateUrl: '../templates/modal.display.default.html'
})
export class DefaultDocumentDisplayModalComponent 
  extends MzBaseModal 
  implements OnInit
{
  // Las opciones de configuracion del modal
  modalOptions = {
  }

  // El nombre del tipo de documento a desplegar
  @Input()
  documentType: string = null

  // El nombre de la carpeta donde se encuentra almacenado el documento a 
  // desplegar
  @Input()
  baseFolder: string = null 

  // La fecha del archivo 
  @Input()
  fileDate: string = null

  // El nombre del archivo
  @Input()
  fileName: string = null

  // Las notas o comentarios escritos al capturar el documento
  @Input()
  notes: string = null

  // El URL al documento que sera desplegado
  sanitizedPath: SafeResourceUrl = null

  // Constructor del componente donde importaremos una instancia del servicio 
  // de idioma
  constructor(
    protected langManager: LanguageService,
    protected sanitizer: DomSanitizer
  ) {
    super() // invocamos el constructor de la clase padre
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    this.sanitizedPath = (environment.production) ?
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `http://documents.jfdc.tech/backend/ViewerJS/#../documents/${ this.baseFolder }/${ this.fileName }`
      )
      : this.sanitizer.bypassSecurityTrustResourceUrl(
        `http://localhost/doc-manager/backend/ViewerJS/#../documents/${ this.baseFolder }/${ this.fileName }`
      )
  } // ngOnInit(): void
}