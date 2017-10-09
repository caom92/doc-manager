import { Component, Input, OnInit } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ng2-materialize'
import { LanguageService } from '../services/app.language'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { AreaDocumentDisplayModalComponent } from './modal.display.area'

// El componente del modal que despliega el archivo buscado por el usuario
@Component({
  templateUrl: '../templates/modal.display.lab.html'
})
export class LabDocumentDisplayModalComponent 
  extends AreaDocumentDisplayModalComponent
  implements OnInit
{
  // Constructor del componente donde importaremos una instancia del servicio 
  // de idioma
  constructor(
    langManager: LanguageService,
    sanitizer: DomSanitizer
  ) {
    super(langManager, sanitizer) // invocamos el constructor de la clase padre
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    // generamos el URL valido para cargar los documentos
    this.sanitizedPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://localhost/doc-manager/backend/ViewerJS/#../documents/lab/${ this.fileName }`
    )
  } // ngOnInit(): void
}