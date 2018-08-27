import { 
  LabDefaultInventoryModalComponent 
} from './modal.inventory.lab.default'
import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { FormBuilder, Validators } from '@angular/forms'


@Component({
  templateUrl: '../templates/modal.inventory.lab.lab.html'
})
export class LabLabInventoryModalComponent
  extends LabDefaultInventoryModalComponent implements OnInit {

  // Constructor del componente donde importaremos los servicios requeridos
  constructor(
    server: BackendService,
    toastManager: ToastService,
    global: GlobalElementsService,
    langManager: LanguageService,
    formBuilder: FormBuilder
  ) {
    super(server, toastManager, global, langManager, formBuilder)
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    this.captureForm = this.formBuilder.group({
      name: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])]
    })
  }

  // Esta funcion se invoca cuando el usuario hizo clic en el boton de capturar
  // del formulario de captura para el nuevo tipo de analisis
  onFormSubmit(): void {
    // preparamos los datos a enviar al servidor
    const data = new FormData()
    data.append('name', this.captureForm.controls.name.value)

    // enviamos el nuevo tipo de analisis capturado al servidor
    this.server.write(
      'add-lab',
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
        if (response.meta.return_code === 0) {
          this.server.read(
            'list-labs',
            {},
            (response2: BackendResponse) => {
              if (response2.meta.return_code === 0) {
                // actualizamos la lista de categorias mostrada en pantalla
                this.parent.laboratories = response2.data
              } else {
                // si el servidor respondio con un error, notificamos al usuario
                this.toastManager.showText(
                  this.langManager.getServiceMessage(
                    'list-labs',
                    response2.meta.return_code
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
