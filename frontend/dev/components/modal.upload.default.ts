import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

// Tipo auxiliar que declara la estructura necesaria para implementar 
// sugerencias de autocompletado en los campos de texto del formulario
export type AutoCompleteObject = {
  data: {
    [key: string]: string
  },
  limit: number
}

// Este componente define el comportamiento basico de la pagina donde el 
// usuario capturara un archivo de laboratorio
export class DefaultDocumentUploadModalComponent
  extends MzBaseModal 
  implements OnInit
{
  // El ID del tipo de documento elegido por el usuario
  @Input()
  selectedDocumentTypeID: number = null

  // Las opciones de configuracion del modal
  modalOptions: any = {
  }

  // El archivo del documento que sera subido al servidor
  selectedDocumentFile: any = null

  // Las sugerencias de autocompletado del campo de zonas
  zoneSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  // La interfaz que representa el formulario de captura para el documento a 
  // capturar
  uploadForm: FormGroup = null

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    protected server: BackendService,
    protected toastManager: ToastService,
    protected global: GlobalElementsService,
    protected langManager: LanguageService,
    protected modalManager: MzModalService,
    protected formBuilder: FormBuilder
  ) {
    // invocamos el constructor de la clase padre
    super()
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-zones',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.zoneSuggestions = {
            data: {},
            limit: 4
          }
          for (let zone of response.data) {
            this.zoneSuggestions.data[zone.name] = null
          }
        } else {
          // si el servidor respondio con error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-zones',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read
  } // ngOnInit(): void
} // class DefaultDocumentUploadModalComponent