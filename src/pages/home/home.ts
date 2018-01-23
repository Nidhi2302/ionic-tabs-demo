import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users;
  userForm;
  constructor(public navCtrl: NavController, private sqlite: SQLite, protected formbuilder: FormBuilder) {
    this.userForm = this.formbuilder.group({
      name: ['', Validators.required],
      address: ['',Validators.required],
      DOB: ['', Validators.required],
      mobileNumber: ['', Validators.required],
    });
  }
  dbInitAndInsert(data) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('create table IF NOT EXISTS userDetail(name VARCHAR(32),address VARCHAR(32),DOB VARCHAR(32),mobileNumber VARCHAR(32))', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        db.executeSql('SELECT * FROM userDetail', {})
          .then(res => {
            this.users = [];
            for (var i = 0; i < res.rows.length; i++) {
              this.users.push({ name: res.rows.item(i).name, address: res.rows.item(i).address, DOB: res.rows.item(i).DOB, mobileNumber: res.rows.item(i).mobileNumber })
            }
            console.log(this.users);
          })
          .catch(e => console.log(e));

        db.executeSql('INSERT INTO userDetail VALUES(?,?,?,?)', [data.name, data.address, data.DOB, data.mobileNumber])
          .then((res) => console.log('Executed INSERT SQL', res))
          .catch(e => console.log(e));

      })
      .catch(e => console.log(e));
  }
}
