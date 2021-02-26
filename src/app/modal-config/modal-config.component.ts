import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
@Component({
  selector: 'app-modal-config',
  templateUrl: './modal-config.component.html',
  styleUrls: ['./modal-config.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ModalConfigComponent implements OnInit {
  public loading = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  showImport = false;
  showConnect = false;
  data_risk;
  risks = [];
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

  getContainers(url, token){

  }

//get data (risks) from URL and token of the server of PDP4E
getData(url, token){
  if(this.showConnect == true && url !='' && token != ""){
   this.setRisks_server(url, token);
  }
  else if ( this.showImport == true && this.data_risk != undefined){
    this.setRisks_file();
  }

}

//set risks(from the server (url and token)) to localStorage
setRisks_server(url, token){
  this.loading = true;
  const headers = {  'Content-type': 'application/json', 'token': token };
  const httpOptions = {
    headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': token
    })
    };

  const headers1 = {'Content-type': 'application/json', 'token': token };
  var url_containers = url + "/api/graphql?query={containers{id,name}}";
  this.http.get(url_containers,  { headers })
    .pipe(map(r => { console.log(r);
      var data = JSON.stringify(r);
      var i = 0;
      JSON.parse(data).containers.forEach(element => {
        i++;
      var url_risk = url + "/api/graphql?query={containers(where:{path:%22RootId%22,comparison:%22equal%22,value:%22" + element.id + "%22}){name,assets{id,name,risks{vulnerabilities{id, payload},name, description,payload{impact, likelihood},treatments{id,payload,definition{id,type,description,createdDateTime}}}},,edges{id,risks{vulnerabilities{id,payload},name,description,payload{impact,likelihood}}}}}";
         this.http.get(url_risk,  { headers })
           .pipe(map(r => {
              console.log(r);
             var data = JSON.stringify(r);
             this.risks.push(JSON.parse(data).containers[0]);
             console.log(this.risks);
             if(this.risks.length == i )
             {
              var data_risks = {
                "containers": this.risks};
                var  dataRisks = JSON.stringify(data_risks);
                localStorage.setItem('risks_Imported', dataRisks);

                this.close();
             }

           }))
           .subscribe(resp => {
           });

      });
    }))
    .subscribe(resp => {
    });
}

//set risks (from file JSON) to localStorage
setRisks_file(){
  localStorage.setItem('risks_Imported', this.data_risk);
  this.close();
}


  //close the modal
  close() {
    this.dialogRef.close({ event: 'close'});
  }
}
