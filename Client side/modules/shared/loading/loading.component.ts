import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { LoadingService } from 'src/app/services/shared/loading.service'

@Component({
	selector: 'app-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
	isLoading: Subject<boolean> = this._service.loader

	constructor(private _service: LoadingService) {}
}
