import { AFUnwrappedDataSnapshot } from 'angularfire2/interfaces';
import {
    Component,
    Output,
    ViewChild,
    EventEmitter
} from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import * as moment from 'moment';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as gcm from "node-gcm";

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent {

    @Output() onDialogDismissEvent = new EventEmitter();

    private title: string;
    private dialogMessage: string;
    private dengerStylesEnabled: boolean = false;

    private records: FirebaseListObservable<any[]>;

    @ViewChild('alertDialogId') private modal: ModalComponent;

    constructor(public af: AngularFire, private db: AngularFireDatabase) {

    }

    public show(message: string, dengerMode: boolean = false, title: string = '') {
        this.title = !title && dengerMode ? 'Error Message' : title;
        this.dialogMessage = message;
        this.dengerStylesEnabled = dengerMode;

        this.modal.open();
        // TODO: The issue comes from the modal's lib.
        // This workaround used to change backdrop z-index as there is no way
        // to add custtom style / id to backdrop object for now.
        let backdrops = document.getElementsByClassName('modal-backdrop');
        if (backdrops.length > 1) {
            let backdrop = <HTMLElement>document.getElementsByClassName('modal-backdrop')[1];
            backdrop.style.zIndex = '1150';
        }
    }

    public hide() {
        this.modal.close();
    }

    public isVisible() {
        return this.modal.visible;
    }

    private onYesPressed() {
        this.hide();
        // this.records = this.db.list('records');
        var a = this.db.list("https://kitchen-b69c7.firebaseio.com");
        var m = moment();
        var today = m.format("YYYY-MM-DD");
        var uuid = this.af.auth.getAuth().uid;
        var self = this;
        a.$ref.once("value", function (s) {
            console.log("--- once " + s.hasChild('records'));
            console.log("--- once " + today + "  " + s.hasChild('records/' + today));
            var ref = s.ref;
            if (s.hasChild('records/' + today) && !s.hasChild('records/' + today + "/participants/" + uuid)) {
                self.addParticipantForADate(s, uuid, today);
            } else if (!s.hasChild('records/' + today)) {
                self.addRecord(s, uuid, today);
            }

        })
    }

    private addParticipantForADate(root: firebase.database.DataSnapshot, uuid: string, date: string) {
        var jsonBody = {};
        var jsonPath = 'records/' + date + '/participants/';
        if (root.hasChild(jsonPath)) {
            this.db.list(jsonPath).push(uuid);
        } else {
            jsonPath = 'records/' + date + "/";
            jsonBody = {
                participants: [uuid]
            }
            jsonBody["participants"].push(uuid);
            root.child(jsonPath).ref.update(jsonBody);
        }
    }

    private addRecord(root: firebase.database.DataSnapshot, uuid: string, date: string) {
        var jsonBody = {};
        jsonBody[date] = {
            participants: [uuid]
        }
        root.child('records/').ref.update(jsonBody)
    }

    private onNoPressed() {

    }
    /* Private Methods */

    private onDialogDismiss() {
        this.onDialogDismissEvent.emit();
    }

    private formatDate(date: Date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return year + '-' + monthIndex + '-' + day;
    }
}