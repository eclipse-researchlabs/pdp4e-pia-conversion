import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
save(){
  console.log(this.data_risk);
  localStorage.setItem('risks_Imported', this.data_risk);
  localStorage.setItem('server_url', this.secondFormGroup.value.secondCtrl);
  this.close();
  //this.router.navigate(['/analyses']);
}
  onChange(fileList: FileList) {

    let file = fileList[0];

    let fileReader: FileReader = new FileReader();
    fileReader.readAsText(file);
    var fileContent;
    var risques;
    let self = this;
    fileReader.onloadend = function()  {
      fileContent = fileReader.result;
      console.log(fileContent);
      //localStorage.setItem('risks_Imported', fileContent);
      self.data_risk = fileContent;

    }
    console.log(this.data_risk);

  }
  close() {
    this.dialogRef.close({ event: 'close'});
  }
}
