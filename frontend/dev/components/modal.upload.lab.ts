import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AreaDocumentUploadModalComponent, AutoCompleteObject } from './modal.upload.area'

// Este componente define el comportamiento de la pagina donde el usuario 
// capturara un archivo de laboratorio
@Component({
  templateUrl: '../templates/modal.upload.lab.html'
})
export class LabDocumentUploadModalComponent 
  extends AreaDocumentUploadModalComponent
{
  // Las sugerencias de autocompletado del campo de laboratorio
  labSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4   
  }

  // Las sugerencias de autocompletado del campo de tipos de analisis
  typeSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4   
  }

  // El archivo de solicitud elegido por el usuario
  selectedAnalysisFile: any = null

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
    this.defaultDocumentUploadForm = this.formBuilder.group({
      documentDate: [ null, Validators.required ],
      typeName: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      labName: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      zone: [ null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ])],
      ranch: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      producer: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      area: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      notes: [ null, Validators.maxLength(65535)]
    })
  }

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

    // obtenemos la lista de laboratorios del servidor
    this.server.read(
      'list-labs',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.labSuggestions = {
            data: {},
            limit: 4   
          }
          for (let lab of response.data) {
            this.labSuggestions.data[lab.name] = null
          }
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
          this.typeSuggestions = {
            data: {},
            limit: 4   
          }
          for (let type of response.data) {
            this.typeSuggestions.data[type.name] = null
          }
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
  } // retrieveInitialData(): void

  // Esta funcion se invoca cuando el usuario ingresa un tipo de analisis
  onAnalysisTypeSelected(event: any): void {
    // necesitamos agregar el nombre ingresado al elegir una opcion de la lista 
    // de sugerencias, de lo contrario, solo se guardara la tecla que el 
    // usuario presiono para activar la lista de sugerencias
    this.defaultDocumentUploadForm.controls.typeName.setValue(
      event.target.value
    )
  }

  // Esta funcion se invoca cuando el usuario ingresa el nombre de un 
  // laboratorio
  onLabSelected(event: any): void {
    // necesitamos agregar el nombre ingresado al elegir una opcion de la lista 
    // de sugerencias, de lo contrario, solo se guardara la tecla que el 
    // usuario presiono para activar la lista de sugerencias
    this.defaultDocumentUploadForm.controls.labName.setValue(
      event.target.value
    )
  }

  // Esta funcion se invoca cuando el usuario elije un archivo de solicitud
  onAnalysisFileSelected(event: any): void {
    // borramos el archivo elegido anteriormente
    this.selectedAnalysisFile = null
    
    // recuperamos el archivo elegido
    let files = event.srcElement.files
    
    // si el usuario subio un archivo, lo guardamos para su futuro uso
    if (files.length > 0) {
      this.selectedAnalysisFile = files[0]
    }
  }

  // Esta funcion se invoca cuando el usuario hace clic en el boton de capturar 
  // documento
  onLabDocumentUpload(): void {
    // preparamos los datos que seran enviados al servidor
    let data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append('capture_date', this.global.getFormattedDate())
    data.append(
      'file_date', 
      $('input[type="hidden"][name="document-date_submit"]').val()
    )
    data.append(
      'analysis_type_name',
      this.defaultDocumentUploadForm.controls.typeName.value
    )
    data.append(
      'lab_name', 
      this.defaultDocumentUploadForm.controls.labName.value
    )
    data.append('zone', this.defaultDocumentUploadForm.controls.zone.value)
    data.append('ranch', this.defaultDocumentUploadForm.controls.ranch.value)
    data.append(
      'producer', 
      this.defaultDocumentUploadForm.controls.producer.value
    )
    data.append(
      'area',
      this.defaultDocumentUploadForm.controls.area.value
    )

    if (this.defaultDocumentUploadForm.controls.notes.value) {
      data.append(
        'notes',
        this.defaultDocumentUploadForm.controls.notes.value
      )
    }

    data.append(
      'analysis_file', 
      this.selectedAnalysisFile, 
      this.selectedAnalysisFile.name
    )

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.create(
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
          this.defaultDocumentUploadForm.reset()
        }
      } // (response: BackendResponse)
    ) // this.server.create
  } // onLabDocumentUpload(): void
} // export class LabDocumentUploadModalComponent extends AreaDocumentUploadModalComponent