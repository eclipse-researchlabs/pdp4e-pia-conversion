import { Component, OnInit } from '@angular/core';
import { ServersService } from '../services/servers.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(
      private servers: ServersService,
      private snack: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  test(url: string)
  {
    this.servers.testUrl(url).subscribe(
      r => {
        console.log(r);
        if(r)
        {
          this.snack.open("Server is available", '', {duration: 3000});
        }
        else
        {
          this.snack.open("Server unavailable", '', {duration: 3000});
        }
      }
    );
  }

}
