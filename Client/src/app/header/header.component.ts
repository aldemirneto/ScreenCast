import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	public get isUserLoggedIn(): boolean {
		return this.tokenService.getJwtToken() !== null;
	}
	
	constructor(private tokenService: TokenService) { }

	ngOnInit(): void {
	}

}
