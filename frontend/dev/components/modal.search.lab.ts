import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DefaultDocumentSearchModalComponent, NoParentElement, SingleParentElement } from './modal.search.default'

// Este componente define el comportamiento de la pagina donde el usuario puede 
// visualizar los documentos de laboratorios
@Component({
  templateUrl: '../templates/modal.search.lab.html'
})
export class LabDocumentSearchModalComponent 
  extends DefaultDocumentSearchModalComponent
  implements OnInit
{
  // La lista de productores a elegir por el usuario
  producers: Array<SingleParentElement> = [
    this.singleParentOptionAll
  ]

  // La lista de laboratorios a elegir por el usuario
  labs: Array<NoParentElement> = [
    this.noParentOptionAll
  ]

  // La lista de analisis de laboratorio a elegir por el usuario
  analysisTypes: Array<NoParentElement> = [
    this.noParentOptionAll
  ]

  // La lista de subtipos de analisis de laboratorio a elegir por el usuario
  subTypes: Array<SingleParentElement> = [
    this.singleParentOptionAll
  ]

  // La lista de areas a elegir por el usuario
  areas: Array<SingleParentElement> = [
    this.singleParentOptionAll
  ]

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
          zone_name: this.global.zone.id
        },
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue, ingresamos los ranchos recuperados al objeto de 
            // sugerencias de ranchos
            this.producers = this.producers.concat(response.data)
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-zones-ranches-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    }

    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-labs',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.labs = this.labs.concat(response.data)
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

    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-analysis-types',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.analysisTypes = this.analysisTypes.concat(response.data)
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

    // configuramos las reglas de validacion del formulario de captura
    this.searchForm = this.formBuilder.group({
      startDate: [ null, Validators.required ],
      endDate: [ null, Validators.required ],
      zone: [
        (this.global.roleName !== 'Director') ?
          {
            value: this.global.zone,
            disabled: true
          }
          : {
            value: null,
            disabled: false
          }
      ],
      subtype: [ null ],
      producer: [ null ],
      area: [ null ],
      lab: [ null ],
      type: [ null ]
    })
  } // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario ingreso el nombre de una zona
  onZoneSelected(): void {
    // borramos el valor del productor en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de zona
    this.searchForm.controls.producer.setValue(null)
    this.producers = [
      this.singleParentOptionAll
    ]

    // si la zona es valida, mandamos una peticion al servidor para recuperar 
    // los ranchos de esta zona
    let selectedZone = 
      <NoParentElement>this.searchForm.controls.zone.value
    if (selectedZone.id) {
      // recuperamos los productores del servidor
      this.server.read(
        'list-producers-of-zone',
        {
          zone_name: selectedZone.id
        },
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue, ingresamos los ranchos recuperados al objeto de 
            // sugerencias de ranchos
            this.producers = this.producers.concat(response.data)
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-zones-ranches-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.searchForm.controls.zone.valid)
  } // onZoneSelected(event: any): void

  // Esta funcion se invoca cuando el usuario elije un tipo de la lista de 
  // seleccion
  onAnalysisTypeSelected(): void {
    // borramos los valores de subtipo en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de tipo
    this.searchForm.controls.subtype.setValue(null)
    this.searchForm.controls.area.setValue(null)
    this.subTypes = this.areas = [
      this.singleParentOptionAll
    ]

    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    let selectedType =
      <NoParentElement>this.searchForm.controls.type.value
    if (selectedType.id) {
      // preparamos los datos que seran enviados al usuario
      let data = new FormData()
      data.append('type', selectedType.id.toString())

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-analysis-subtypes-of-type',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            this.subTypes = this.subTypes.concat(response.data)
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
    } // if (this.searchForm.controls.typeName.valid)
  } // onAnalysisTypeSelected(event: any): void

  // Esta funcion se invoca cuando el usuario elije un subtipo de la lista de 
  // seleccion
  onSubTypeSelected(): void {
    this.searchForm.controls.area.setValue(null)
    this.areas = [
      this.singleParentOptionAll
    ]

    let selectedSubType = 
      <SingleParentElement>this.searchForm.controls.subtype.value
    if (selectedSubType.id) {
      // preparamos los datos que seran enviados al usuario
      let data = new FormData()
      data.append('subtype', selectedSubType.id.toString())

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-areas-of-subtype',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            this.areas = this.areas.concat(response.data)
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
    } // if (selectedSubType.id)
  } // onSubTypeSelected(): void

  // Esta funcion se invoca cuando el formulario de captura de documento es 
  // enviado al servidor
  onLabDocumentSearch(): void {
    let data = new FormData()
    data.append(
      'document_type_id',
      this.selectedDocumentTypeID.toString()
    )
    data.append(
      'start_date', 
      this.searchForm.controls.startDate.value
    )
    data.append(
      'end_date', 
      this.searchForm.controls.endDate.value
    )

    let selectedZone = 
      <NoParentElement>this.searchForm.controls.zone.value
    if (selectedZone && selectedZone != this.noParentOptionAll) {
      data.append('zone_id', selectedZone.id.toString())
    }

    let selectedProducer = 
      <SingleParentElement>this.searchForm.controls.producer.value
    if (selectedProducer && selectedProducer != this.singleParentOptionAll) {
      data.append('producer_id', selectedProducer.id.toString())
    }

    let selectedLab =
      <NoParentElement>this.searchForm.controls.lab.value
    if (selectedLab && selectedLab != this.noParentOptionAll) {
      data.append('lab_id', selectedLab.id.toString())
    }

    let selectedType =
      <NoParentElement>this.searchForm.controls.type.value
    if (selectedType && selectedType != this.noParentOptionAll) {
      data.append('analysis_type_id', selectedType.id.toString())
    }

    let selectedSubType = 
      <SingleParentElement>this.searchForm.controls.subtype.value
    if (selectedSubType && selectedSubType != this.singleParentOptionAll) {
      data.append('analysis_subtype_id', selectedSubType.id.toString())
    }

    let selectedArea = 
      <SingleParentElement>this.searchForm.controls.area.value
    if (selectedArea && selectedArea != this.singleParentOptionAll) {
      data.append('area_id', selectedArea.id.toString())
    }

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.write(
      'search-lab',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.parent.numDocsWithPhysicalCopy = 
            response.data.num_docs_with_physical_copy
          this.parent.searchResults = response.data.documents
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-lab',
              response.meta.return_code
            )
          )
        }
      } // (response: BackendResponse)
    ) // this.server.write
  } // onDefaultDocumentUpload(): void
}