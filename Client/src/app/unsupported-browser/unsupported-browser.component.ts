import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-unsupported-browser',
	templateUrl: './unsupported-browser.component.html',
	styleUrls: ['./unsupported-browser.component.css']
})
export class UnsupportedBrowserComponent implements OnInit {

	@Output() close = new EventEmitter<void>();

	constructor() { }

	ngOnInit(): void {
	}

}
