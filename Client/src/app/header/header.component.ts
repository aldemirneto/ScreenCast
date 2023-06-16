import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	public isUserLoggedIn: boolean = false;
	public userName: string = 'Pessoa Legal';
	
	constructor() { }

	ngOnInit(): void {
	}

}
