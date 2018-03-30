import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DefaultDocumentUploadModalComponent, AutoCompleteObject } from './modal.upload.default'
import { NoParentElement, SingleParentElement } from './modal.search.default'

// Este componente define el comportamiento de la pagina donde el usuario 
// capturara un archivo de laboratorio
@Component({
  templateUrl: '../templates/modal.upload.lab.html'
})
export class LabDocumentUploadModalComponent 
  extends DefaultDocumentUploadModalComponent
  implements OnInit
{
  // La lista de productores a elegir por el usuario 
  producers: Array<SingleParentElement> = []

  // La lista de laboratorios a elegir por el usuario
  labs: Array<NoParentElement> = []

  // La lista de tipos de analisis a elegir por el usuario
  types: Array<NoParentElement> = []

  // La lista de subtipos de analisis a elegir por el usuario
  subtypes: Array<SingleParentElement> = []

  // La lista de areas o productos a elegir por el usuario
  areas: Array<SingleParentElement> = []

  // La lista de subareas o subproductos a elegir por el usuario
  subareas: Array<SingleParentElement> = []

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    server: BackendService,
    toastManager: ToastService,
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService,
    formBuilder: FormBuilder
  ) {
    // invocamos el constructor de la clase padre
    super(server, toastManager, global, langManager, modalManager, formBuilder)
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    super.ngOnInit()

    if (this.global.roleName !== 'Director') {
      this.server.read(
        'list-producers-of-zone',
        {
          zone_id: this.global.zone.id
        },
        (response: BackendResponse) => {
          // revisamos si el rancho respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue guardamos los productores en el objeto de sugerencias 
            // del campo de productores
            this.producers = response.data
          } else {
            // en caso de que el servidor responda con error, hay que notificar 
            // al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-producers-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.read
    } // if (this.global.roleName !== 'Director')

    // obtenemos la lista de laboratorios del servidor
    this.server.read(
      'list-labs',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.labs = response.data
        } else {
          // si el servidor respondio con error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-labs',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read

    // obtenemos la lista de tipos de analisis del servidor
    this.server.read(
      'list-analysis-types',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.types = response.data
        } else {
          // si el servidor respondio con error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-analysis-types',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read

    // configuramos las reglas de validacion del formulario de captura
    this.uploadForm = this.formBuilder.group({
      documentDate: [ null, Validators.required ],
      type: [ null, Validators.required ],
      lab: [ null, Validators.required ],
      zone: [
        {
          value: this.global.zone,
          disabled: true
        },
        Validators.compose([
          Validators.required
        ])
      ],
      subtype: [ null, Validators.required ],
      producer: [ null, Validators.required ],
      area: [ null, Validators.required ],
      subarea: [ null, Validators.required ],
      notes: [ null, Validators.maxLength(65535)]
    })
  } // // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario ingreso el nombre de una zona
  onZoneSelected(): void {
    // borramos los valores de productor en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de zona
    this.uploadForm.controls.producer.setValue(null)

    // si la zona es valida, mandamos una peticion al servidor para recuperar 
    // la lista de productores
    if (this.uploadForm.controls.zone.valid) {
      // preparamos los datos que seran enviados al servidor
      let selectedZone = 
        <NoParentElement>this.uploadForm.controls.zone.value

      // enviamos la peticion al servidor para recuperar los productores de 
      // este rancho
      this.server.read(
        'list-producers-of-zone',
        {
          zone_id: selectedZone.id
        },
        (response: BackendResponse) => {
          // revisamos si el rancho respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue guardamos los productores en el objeto de sugerencias 
            // del campo de productores
            this.producers = response.data
          } else {
            // en caso de que el servidor responda con error, hay que notificar 
            // al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-producers-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.uploadForm.controls.zone.valid)
  } // onZoneSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa un tipo de analisis
  onAnalysisTypeSelected(): void {
    // borramos los valores de subtipo en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de tipo
    this.uploadForm.controls.subtype.setValue(null)
    this.uploadForm.controls.area.setValue(null)
    this.uploadForm.controls.subarea.setValue(null)

    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    if (this.uploadForm.controls.type.valid) {
      // preparamos los datos que seran enviados al usuario
      let selectedType = 
        <NoParentElement>this.uploadForm.controls.type.value

      let data = new FormData()
      data.append('type', selectedType.id.toString())

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-analysis-subtypes-of-type',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue, ingresamos los subtipos recuperados al objeto de 
            // sugerencias
            this.subtypes = response.data
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-analysis-subtypes-of-type',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.uploadForm.controls.typeName.valid)
  } // onAnalysisTypeSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa el nombre de un subtipo
  onSubTypeSelected(): void {
    this.uploadForm.controls.area.setValue(null)
    this.uploadForm.controls.subarea.setValue(null)

    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    if (this.uploadForm.controls.subtype.valid) {
      // preparamos los datos que seran enviados al usuario
      let selectedSubType = 
        <SingleParentElement>this.uploadForm.controls.subtype.value

      let data = new FormData()
      data.append('subtype', selectedSubType.id.toString())

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-areas-of-subtype',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            this.areas = response.data
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-areas-of-subtype',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.uploadForm.controls.subtype.valid)
  } // onSubTypeSelected(event: any): void

  onAreaSelected(): void {
    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    if (this.uploadForm.controls.area.valid) {
      // preparamos los datos que seran enviados al usuario
      let selectedArea =
        <SingleParentElement>this.uploadForm.controls.area.value

      let data = new FormData()
      data.append('area', selectedArea.id.toString())

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-subareas-of-area',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            this.subareas = response.data
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-areas-of-subtype',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.uploadForm.controls.subtype.valid)
  }

  // Esta funcion se invoca cuando el usuario elije un archivo de solicitud
  onAnalysisFileSelected(event: any): void {
    // borramos el archivo elegido anteriormente
    this.selectedDocumentFile = null
    
    // recuperamos el archivo elegido
    let files = event.target.files
    
    // si el usuario subio un archivo, lo guardamos para su futuro uso
    if (files.length > 0) {
      this.selectedDocumentFile = files[0]
    }
  }

  // Esta funcion se invoca cuando el usuario hace clic en el boton de capturar 
  // documento
  onLabDocumentUpload(): void {
    // preparamos los danew File(tos que seran enviados al servidor
    let data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append('capture_date', this.global.getFormattedDate())
    data.append(
      'file_date', 
      this.uploadForm.controls.documentDate.value
    )

    let selectedProducer = 
      <SingleParentElement>this.uploadForm.controls.producer.value
    data.append(
      'producer', 
      selectedProducer.id.toString()
    )

    let selectedLab = 
      <NoParentElement>this.uploadForm.controls.lab.value
    data.append(
      'lab', 
      selectedLab.id.toString()
    )

    let selectedSubArea = 
      <SingleParentElement>this.uploadForm.controls.subarea.value
    data.append(
      'subarea',
      selectedSubArea.id.toString()
    )

    if (this.uploadForm.controls.notes.value) {
      data.append(
        'notes',
        this.uploadForm.controls.notes.value
      )
    }

    data.append(
      'analysis_file', 
      this.selectedDocumentFile, 
      this.selectedDocumentFile.name
    )

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.write(
      'capture-lab',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // notificamos al usuario del resultado obtenido
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'capture-lab',
            response.meta.return_code
          )
        )

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.uploadForm.reset()
        }
      } // (response: BackendResponse)
    ) // this.server.write
  } // onLabDocumentUpload(): void
} // export class LabDocumentUploadModalComponent extends AreaDocumentUploadModalComponent