import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, Validators } from '@angular/forms'
import { 
  DefaultDocumentSearchComponent, NoParentElement 
} from './modal.search.default'
import { Router, ActivatedRoute } from '@angular/router'


@Component({
  templateUrl: '../templates/modal.search.training.html'
})
export class TrainingDocumentSearchComponent
  extends DefaultDocumentSearchComponent 
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
    formBuilder: FormBuilder,
    stateService: Router,
    routeState: ActivatedRoute
  ) {
    super(
      server, toastManager, global, langManager, modalManager, formBuilder, 
      stateService, routeState
    )
  }

  ngOnInit(): void {
    super.ngOnInit()

    this.numDocsWithPhysicalCopy = 1
    this.server.read(
      'list-training-sections',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.sections = this.sections.concat(response.data)
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-training-sections',
              response.meta.return_code
            )
          )
        }

        this.finishService()
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

    this.setValueOnControlChange('startDate')
    this.setValueOnControlChange('endDate')
    this.setIdOnControlChange('section')
  }

  onProcedureDocumentSearch(): void {
    this.updateUrl()
    this.searchDocument()
  }

  searchDocument(): void {
    const data = new FormData()
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

    const selectedZone =
      <NoParentElement> this.searchForm.controls.zone.value
    if (selectedZone && selectedZone !== this.noParentOptionAll) {
      data.append('zone_id', selectedZone.id.toString())
    }

    const selectedSection =
      <NoParentElement> this.searchForm.controls.section.value
    if (selectedSection && selectedSection !== this.noParentOptionAll) {
      data.append('section_id', selectedSection.id.toString())
    }

    const modal = this.modalManager.open(ProgressModalComponent)

    this.server.write(
      'search-training',
      data,
      (response: BackendResponse) => {
        modal.instance.modalComponent.closeModal()

        if (response.meta.return_code === 0) {
          this.searchResults = response.data.documents
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

  protected afterServiceResponses(): void {
      this.setControlValue(
        'section', this.sections, this.noParentOptionAll
      )
      this.searchDocument()
  }
}
