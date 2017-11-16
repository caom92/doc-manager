import { Component, OnInit, Input } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ng2-materialize'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LabInventoryComponent } from './inventory.lab'

// Componente que define el comportamiento general de aquellas paginas donde el 
// usuario agregara un item del inventario de laboratorios
export class LabDefaultInventoryModalComponent 
  extends MzBaseModal
{
  // Las opciones de configuracion del modal
  modalOptions = { 
    // el modal no se cerrara aunque el usuario haga clic fuera de el
    dismissible: true 
  }

  // El formulario de captura para el nuevo item
  captureForm: FormGroup = null

  // El componente padre donde el usuario 
  parent: LabInventoryComponent = null

  // Constructor del componente donde importaremos los servicios requeridos
  constructor(
    protected server: BackendService,
    protected toastManager: ToastService,
    protected global: GlobalElementsService,
    protected langManager: LanguageService,
    protected formBuilder: FormBuilder
  ) {
    super() // invocamos el constructor de la clase padre
  }
}