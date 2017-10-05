import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

// Componente que define el comportamiento de la pagina donde el usuario puede 
// administrar los tipos de documento
@Component({
  templateUrl: '../templates/app.documents.html'
})
export class DocumentsComponent implements OnInit
{
  // La lista de los diferentes tipos de documentos que estan en el sistema
  documents: Array<{
    id: number,
    name: string
  }> = []

  // La interfaz al formulario de captura para agregar un nuevo tipo de 
  // documento
  typeForm: FormGroup = null

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService,
    private formBuilder: FormBuilder
  ) {
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    // preparamos las reglas de validacion del formulario de captura
    this.typeForm = this.formBuilder.group({
      name: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])]
    })

    // desplegamos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.read(
      'list-documents',
      {},
      (response: BackendResponse) => {
        // cuando el servidor responda, cerramos el modal de espera
        modal.instance.modalComponent.close()
        
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si asi fue, obtenemos la lista de documentos
          this.documents = response.data
        } else {
          // si el servidor respondio con un error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-documents',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: any)
    ) // this.server.read
  } // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario ha capturado un nuevo tipo de 
  // documento
  onDocumentTypeFormSubmit(): void {
    // preparamos los datos que seran enviados al servidor
    let data = new FormData()
    data.append('name', this.typeForm.controls.name.value)

    // desplegamos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.create(
      'add-doc-type',
      data,
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si asi fue, obtenemos la lista de documentos
          this.server.read(
            'list-documents',
            {},
            (response: BackendResponse) => {
              // cuando el servidor responda, cerramos el modal de espera
              modal.instance.modalComponent.close()
              
              // revisamos si el servidor respondio con exito
              if (response.meta.return_code == 0) {
                // si asi fue, obtenemos la lista de documentos
                this.documents = response.data
              } else {
                // si el servidor respondio con un error, notificamos al usuario
                this.toastManager.showText(
                  this.langManager.getServiceMessage(
                    'list-documents',
                    response.meta.return_code
                  )
                )
              } // if (response.meta.return_code == 0)
            } // (response: any)
          ) // this.server.read
        } else {
          // cuando el servidor responda, cerramos el modal de espera
          modal.instance.modalComponent.close()
          
          // si el servidor respondio con un error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'add-doc-type',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: any)
    ) // this.server.create
  } // onDocumentTypeFormSubmit(): void
} // export class DocumentsComponent implements OnInit