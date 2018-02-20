import { Component, Input, OnInit } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ng2-materialize'
import { LanguageService } from '../services/app.language'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { environment } from '../environments/environment'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { SearchResultsListComponent } from './list.default'

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

  countsPhysicalCopies: boolean = false

  checkboxLabel: { en: string, es: string } = {
    en: 'Has a physical copy?',
    es: '¿Tiene una copia física?'
  }

  // El indice del documento cuyos datos vamos a desplegar
  @Input()
  index: number = null

  // El nombre de la carpeta donde se encuentra almacenado el documento a 
  // desplegar
  @Input()
  baseFolder: string = null

  // El componente que lista los resultados de
  @Input()
  parent: SearchResultsListComponent = null

  // El URL al documento que sera desplegado
  sanitizedPath: SafeResourceUrl = null

  // Constructor del componente donde importaremos una instancia del servicio 
  // de idioma
  constructor(
    protected langManager: LanguageService,
    protected sanitizer: DomSanitizer,
    protected server: BackendService,
    protected toastManager: ToastService
  ) {
    super() // invocamos el constructor de la clase padre
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    this.sanitizedPath = (environment.production) ?
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `http://documents.jfdc.tech/backend/ViewerJS/#../documents/${ this.baseFolder }/${ this.parent.searchResults[this.index].file_path }`
      )
      : this.sanitizer.bypassSecurityTrustResourceUrl(
        `http://localhost/doc-manager/backend/ViewerJS/#../documents/${ this.baseFolder }/${ this.parent.searchResults[this.index].file_path }`
      )
  } // ngOnInit(): void

  // Funcion que se invoca cuando el usuario hace clic en la caja para indicar 
  // si el documento tiene una copia fisica
  onPhysicalCopyCheckboxChanged(): void {
    let document = this.parent.searchResults[this.index]
    
    if (document.has_physical_copy == 1) {
      this.parent.numDocsWithPhysicalCopy++
    } else {
      this.parent.numDocsWithPhysicalCopy--
    }

    let data = new FormData()
    data.append(
      'document_id', 
      document.document_id.toString()
    )
    this.server.write(
      'toggle-physical-copy-lab',
      data,
      (response: BackendResponse) => {
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'toggle-physical-copy-lab',
            response.meta.return_code
          )
        )
      }
    )
  } 
}