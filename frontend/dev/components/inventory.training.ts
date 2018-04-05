import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ng2-materialize'
import { TrainingSectionInventoryModalComponent } from './modal.inventory.training.section'

@Component({
  templateUrl: '../templates/inventory.training.html'
})
export class TrainingInventoryComponent implements OnInit {
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
      'list-training-sections',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          this.sections = response.data
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-training-sections',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read()
  }

  onAddSectionButtonClick(): void {
    this.modalManager.open(TrainingSectionInventoryModalComponent, {
      parent: this
    })
  }
}