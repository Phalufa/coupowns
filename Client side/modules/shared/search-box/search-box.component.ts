import {
	Component,
	ViewChild,
	ElementRef,
	AfterViewInit,
	Output,
	EventEmitter,
	OnDestroy,
	Input
} from '@angular/core'
import { fromEvent, Subscription } from 'rxjs'
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'

/******
 @deprecated
 old component.
 Recplaced with the 'Search' pipe
 ******/
@Component({
	selector: 'app-search-box',
	template: `<input #input class="search-box" [placeholder]="filterName" />`
})
export class SearchBoxComponent implements AfterViewInit, OnDestroy {
	@ViewChild('input') input: ElementRef
	@Output() searchText: EventEmitter<string> = new EventEmitter<string>()
	@Input() filterName: string
	private _searchSubscription: Subscription

	ngAfterViewInit(): void {
		this._searchSubscription = fromEvent(this.input.nativeElement, 'keyup')
			.pipe(
				map(
					(event: KeyboardEvent) => (<HTMLTextAreaElement>event.target).value
				),
				debounceTime(450),
				distinctUntilChanged()
			)
			.subscribe(val => this.searchText.emit(this.input.nativeElement.value))
	}

	ngOnDestroy(): void {
		this._searchSubscription.unsubscribe()
	}
}
