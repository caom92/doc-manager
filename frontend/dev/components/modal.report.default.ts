import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NoParentElement, SingleParentElement } from './modal.search.default'

// Este componente define el comportamiento base necesario para que el usuario 
// genere reportes de un documento del sistema
export class DefaultDocumentReportModalComponent
  extends MzBaseModal
  implements OnInit
{
  // El ID del tipo de documento elegido por el usuario
  @Input()
  selectedDocumentTypeID: number = null

  // Las opciones de configuracion del modal
  modalOptions: any = {
  }

  // La lista de zonas a elegir por el usuario
  zones: Array<any> = [
  ]

  // El componente que invoco este componente
  parent: any = null

  // Instancia que representa el formulario de captura donde el usuario 
  // generara un reporte
  reportForm: FormGroup = null

  // Los datos del reporte a desplegar en pantalla
  reportData: any = null

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
    if (this.global.roleName !== 'Director') {
      this.zones = [ this.global.zone ]
    } else {
      // obtenemos la lista de zonas del servidor
      this.server.read(
        'list-zones',
        {},
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si el servidor respondio con exito, cargamos la respuesta al 
            // objeto de sugerencias de zonas
            this.zones = response.data
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
    }
  } // ngOnInit(): void
}