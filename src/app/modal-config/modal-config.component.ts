import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-modal-config',
  templateUrl: './modal-config.component.html',
  styleUrls: ['./modal-config.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ModalConfigComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  showImport = false;
  showConnect = false;
  data_risk;
  constructor(
    private http: HttpClient,
    public router: Router,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
     this.firstFormGroup = this._formBuilder.group({
      firstCtrl1: ['', Validators.required],
      firstCtrl2: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    //localStorage.setItem('risks_Imported', "");
    //localStorage.setItem('server_url', "");
  }
  radioChange($event) {
    console.log($event.value);
    if($event.value == 1){
      this.showImport = true;
      this.showConnect = false;
    }
    else {
      this.showConnect = true;
      this.showImport = false;
    }

}

//save all information(url back-end of PIA, url and token of the server pdp4e) in the local storage
save(){
  localStorage.setItem('server_pdp4_url', this.firstFormGroup.value.firstCtrl1);
  localStorage.setItem('server_pdp4_token', this.firstFormGroup.value.firstCtrl2);
  localStorage.setItem('server_url', this.secondFormGroup.value.secondCtrl);
  this.getData(this.firstFormGroup.value.firstCtrl1, this.firstFormGroup.value.firstCtrl2 );
}

//update data (risks) from the file imported
  onChange(fileList: FileList) {

    let file = fileList[0];

    let fileReader: FileReader = new FileReader();
    fileReader.readAsText(file);
    var fileContent;
    var risques;
    let self = this;
    fileReader.onloadend = function()  {
      fileContent = fileReader.result;
      self.data_risk = fileContent;

    }


  }

//get data (risks) from URL and token of the server of PDP4E
  getData(url, token){
    if(url !='' && token != ""){

    const headers = {  'Content-type': 'application/json', 'token': token };
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-type': 'application/json',
          'token': token
      })
      };

    const headers1 = {'Content-type': 'application/json', 'token': token };
    this.http.get(url,  { headers })
      .pipe(map(r => { console.log(r);
        var data = JSON.stringify(r);
        localStorage.setItem('risks_Imported', data);
        this.close();
      }))
      .subscribe(resp => {

        console.log(resp);
      });
    }
    else if (this.data_risk != undefined){
      localStorage.setItem('risks_Imported', this.data_risk);
      this.close();
    }

  }

  //close the modal
  close() {
    this.dialogRef.close({ event: 'close'});
  }
}
