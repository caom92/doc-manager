import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LabSearchResultsListComponent } from './list.lab'
import { AreaDocumentSearchModalComponent, ElementWithoutParent, ElementWithParent } from './modal.search.area'

// Este componente define el comportamiento de la pagina donde el usuario puede 
// visualizar los documentos de laboratorios
@Component({
  templateUrl: '../templates/modal.search.lab.html'
})
export class LabDocumentSearchModalComponent 
  extends AreaDocumentSearchModalComponent
{
  // La lista de laboratorios a elegir por el usuario
  labs: Array<ElementWithoutParent> = [
    this.zoneOptionAll
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

  // Esta funcion inicializa el formulario de captura
  initForm(): void {
    // configuramos las reglas de validacion del formulario de captura
    this.defaultDocumentSearchForm = this.formBuilder.group({
      startDate: [ null, Validators.required ],
      endDate: [ null, Validators.required ],
      zone: [ null ],
      ranch: [ null ],
      producer: [ null ],
      area: [ null ],
      lab: [ null ]
    })
  } // initForm(): void

  // Esta funcion se encarga de solicitar al servidor los datos iniciales que 
  // necesita este formulario para comenzar su captura
  retrieveInitialData(): void {
    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-zones',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.zones = this.zones.concat(response.data)
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
  } // retrieveInitialData(): void

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
      $('input[type="hidden"][name="start-date_submit"]').val()
    )
    data.append(
      'end_date', 
      $('input[type="hidden"][name="end-date_submit"]').val()
    )

    let selectedLab =
      <ElementWithoutParent>this.defaultDocumentSearchForm.controls.lab.value
    if (selectedLab && selectedLab != this.zoneOptionAll) {
      data.append('lab_id', selectedLab.id.toString())
    }

    let selectedZone = 
      <ElementWithoutParent>this.defaultDocumentSearchForm.controls.zone.value
    if (selectedZone && selectedZone != this.zoneOptionAll) {
      data.append('zone_id', selectedZone.id.toString())
    }

    let selectedRanch = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.ranch.value
    if (selectedRanch && selectedRanch != this.optionAll) {
      data.append('ranch_id', selectedRanch.id.toString())
    }

    let selectedProducer = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.producer.value
    if (selectedProducer && selectedProducer != this.optionAll) {
      data.append('producer_id', selectedProducer.id.toString())
    }

    let selectedArea = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.area.value
    if (selectedArea && selectedArea != this.optionAll) {
      data.append('area_id', selectedArea.id.toString())
    }

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.create(
      'search-lab',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.parent.data.searchResults = response.data
          this.parent.data.hasSearchResults = response.data.length > 0
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-default',
              response.meta.return_code
            )
          )
        }
      } // (response: BackendResponse)
    ) // this.server.create
  } // onDefaultDocumentUpload(): void
}