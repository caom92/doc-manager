import { Component, OnInit, Input } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ng2-materialize'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CertificateInventoryComponent } from './inventory.certificate'

// Componente que define el comportamiento general de aquellas paginas donde el 
// usuario agregara un item del inventario de laboratorios
@Component({
  templateUrl: '../templates/modal.inventory.certificate.product.html'
})
export class ProductCertificateInventoryModalComponent 
  extends MzBaseModal
  implements OnInit
{
  // Las opciones de configuracion del modal
  modalOptions = { 
    // el modal no se cerrara aunque el usuario haga clic fuera de el
    dismissible: true 
  }

  // El formulario de captura para el nuevo item
  captureForm: FormGroup = null

  // El componente padre donde el usuario 
  parent: CertificateInventoryComponent = null

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

  ngOnInit(): void {
    this.captureForm = this.formBuilder.group({
      name: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])]
    })
  }

  onFormSubmit(): void {
    // preparamos los datos a enviar al servidor
    let data = new FormData()
    data.append('name', this.captureForm.controls.name.value)

    // enviamos el nuevo tipo de analisis capturado al servidor
    this.server.write(
      'add-certificate-product',
      data,
      (response: BackendResponse) => {
        // notificamos al usuario del resultado cuando el servidor responda
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'add-lab',
            response.meta.return_code
          )
        )
        
        // obtenemos la lista de categorias con el nuevo producto incluido
        if (response.meta.return_code == 0) {
          this.server.read(
            'list-certificate-products',
            {},
            (response: BackendResponse) => {
              if (response.meta.return_code == 0) {
                // actualizamos la lista de categorias mostrada en pantalla
                this.parent.suppliers = response.data
              } else {
                // si el servidor respondio con un error, notificamos al usuario
                this.toastManager.showText(
                  this.langManager.getServiceMessage(
                    'list-labs',
                    response.meta.return_code
                  )
                )
              } // if (response.meta.return_code == 0)
            } // (response: BackendResponse)
          ) // this.server.read()
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.write
  } // onFormSubmit()
}