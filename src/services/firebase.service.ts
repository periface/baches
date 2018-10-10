import { ReportModel } from './../models/report.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
@Injectable()
export class FirebaseService {
  reportsRef: AngularFireList<ReportModel>;
  /**
   *
   */
  constructor(db: AngularFireDatabase) {
    this.reportsRef = db.list('reports');
  }
  addReport(reportInput: ReportModel): PromiseLike<any> {
    return this.reportsRef.push(reportInput);
  }
  getReports(): AngularFireList<ReportModel> {
    return this.reportsRef;
  }
}
