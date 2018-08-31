import { LabDefaultInventoryModalComponent } from './modal.inventory.lab.default'
import { Component, OnInit, Input } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ngx-materialize'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

// Componente que define el comportamiento de la pagina donde el usuario 
// agregara un nuevo subproducto o subarea en el inventario de laboratorios
@Component({
  templateUrl: '../templates/modal.inventory.lab.subproduct.html'
})
export class LabSubProductInventoryModalComponent
  extends LabDefaultInventoryModalComponent
  implements OnInit {
    
  // Lista de tipos de analisis
  types: Array<{
    id: number,
    name: string
  }> = []

  // Lista de subtipos de analisis
  subtypes: Array<{
    id: number,
    name: string
  }> = []

  // Lista de areas de subtipos
  areas: Array<{
    id: number,
    name: string
  }> = []

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
    // inicializamos el formulario de captura
    this.captureForm = this.formBuilder.group({
      typeName: [null, Validators.required],
      subTypeID: [null, Validators.required],
      areaID: [null, Validators.required],
      name: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])]
    })

    // recuperamos la lista de tipos de analisis
    this.server.read(
      'list-analysis-types',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.types = response.data
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-analysis-types',
              response.meta.return_code
            )
          ) // this.toastManager.showText
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read
  }

  // Funcion que se invoca cuando el usuario elije una opcion de la lista
  // de seleccion de tipos de analisis
  onAnalysisTypeSelected(): void {
    // preparamos los datos a enviar al servidor
    const selectedType = <any> this.captureForm.controls.typeName.value

    const data = new FormData()
    data.append('type', selectedType.id)

    // recuperamos la lista de subtipos de analisis correspondientes a ese 
    // tipo de analisis
    this.server.write(
      'list-analysis-subtypes-of-type',
      data,
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.subtypes = response.data
        } else {
          this.langManager.getServiceMessage(
            'list-analysis-subtypes-of-type',
            response.meta.return_code
          )
        }
      } // (response: BackendResponse)
    ) // this.server.write
  } // onAnalysisTypeSelected(): void

  // Funcion que se invoca cuando el usuario elije una opcion de la lista
  // de seleccion de subtipos de analisis
  onAnalysisSubTypeSelected(): void {
    // preparamos los datos a enviar al servidor
    const selectedSubType = <any> this.captureForm.controls.subTypeID.value

    const data = new FormData()
    data.append('subtype', selectedSubType)

    // recuperamos la lista de subtipos de analisis correspondientes a ese 
    // tipo de analisis
    this.server.write(
      'list-areas-of-subtype',
      data,
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.areas = response.data
        } else {
          this.langManager.getServiceMessage(
            'list-analysis-subtypes-of-type',
            response.meta.return_code
          )
        }
      } // (response: BackendResponse)
    ) // this.server.write
  } // onAnalysisTypeSelected(): void

  // Esta funcion se invoca cuando el usuario hizo clic en el boton de capturar
  // del formulario de captura para la nueva area o producto
  onFormSubmit(): void {
    // preparamos los datos a enviar al servidor
    const data = new FormData()
    data.append('parent_id', this.captureForm.controls.areaID.value)
    data.append('name', this.captureForm.controls.name.value)

    // capturamos el nuevo prodcuto o area registrado por el usuario en el 
    // formulario de captura
    this.server.write(
      'add-subarea',
      data,
      (response: BackendResponse) => {
        // notificamos al usuario del resultado cuando el servidor responda
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'add-subarea',
            response.meta.return_code
          )
        )

        // obtenemos la lista de categorias con el nuevo producto incluido
        if (response.meta.return_code === 0) {
          this.server.read(
            'list-lab-categories',
            {},
            (response2: BackendResponse) => {
              if (response.meta.return_code === 0) {
                // actualizamos la lista de categorias mostrada en pantalla
                this.parent.rows = response2.data
              } else {
                // si el servidor respondio con un error, notificamos al usuario
                this.toastManager.showText(
                  this.langManager.getServiceMessage(
                    'list-lab-categories',
                    response2.meta.return_code
                  )
                )
              } // if (response.meta.return_code == 0)
            } // (response: BackendResponse)
          ) // this.server.read()
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.write
  } // onFormSubmit(): void
} // export class LabProductInventoryModalComponent
