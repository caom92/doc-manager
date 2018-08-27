import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { 
  SectionProcedureInventoryModalComponent 
} from './modal.inventory.procedure.section'


@Component({
  templateUrl: '../templates/inventory.procedure.html'
})
export class ProcedureInventoryComponent implements OnInit {

  sections: Array<{
    id: number,
    name: string
  }> = []


  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService
  ) {
  }

  ngOnInit(): void {
    this.server.read(
      'list-sections',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          this.sections = response.data
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-sections',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read()
  }

  onAddSectionButtonClick(): void {
    this.modalManager.open(SectionProcedureInventoryModalComponent, {
      parent: this
    })
  }
}
