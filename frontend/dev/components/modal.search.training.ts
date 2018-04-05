import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DefaultDocumentSearchModalComponent, NoParentElement, SingleParentElement } from './modal.search.default'


@Component({
  templateUrl: '../templates/modal.search.training.html'
})
export class TrainingDocumentSearchModalComponent
  extends DefaultDocumentSearchModalComponent
  implements OnInit {
  sections: Array<NoParentElement> = [
    this.noParentOptionAll
  ]

  constructor(
    server: BackendService,
    toastManager: ToastService,
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService,
    formBuilder: FormBuilder
  ) {
    super(server, toastManager, global, langManager, modalManager, formBuilder)
  }

  ngOnInit(): void {
    super.ngOnInit()

    this.server.read(
      'list-training-sections',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          this.sections = this.sections.concat(response.data)
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-training-sections',
              response.meta.return_code
            )
          )
        }
      }
    )

    this.searchForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
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
      section: [
        {
          value: null,
          disabled: false
        }
      ]
    })
  }

  onProcedureDocumentSearch(): void {
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

    let selectedSection =
      <NoParentElement>this.searchForm.controls.section.value
    if (selectedSection && selectedSection != this.noParentOptionAll) {
      data.append('section_id', selectedSection.id.toString())
    }

    let modal = this.modalManager.open(ProgressModalComponent)

    this.server.write(
      'search-training',
      data,
      (response: BackendResponse) => {
        modal.instance.modalComponent.close()

        if (response.meta.return_code == 0) {
          this.parent.searchResults = response.data.documents
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-training',
              response.meta.return_code
            )
          )
        }
      }
    )
  }
}