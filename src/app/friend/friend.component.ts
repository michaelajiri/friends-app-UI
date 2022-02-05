import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

export class Friends {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public department: string,
    public email: string,
    public country: string
  ) {
  }
}

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends: Friends[];
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getFriends();

    this.editForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      department: [''],
      email: [''],
      country: ['']
    });
  }

  getFriends() {
    this.httpClient.get<any>('http://localhost:7070/api/friends/allFriends').subscribe(
      response => {
        console.log(response);
        this.friends = response;
      }
    );
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onSubmit(f: NgForm) {
    const url = 'http://localhost:7070/api/friends/addFriend';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openDetails(targetModal, friend: Friends) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'md'
    });
    document.getElementById('dFirstName').setAttribute('value', friend.firstName);
    document.getElementById('dLastName').setAttribute('value', friend.lastName);
    document.getElementById('dDepartment').setAttribute('value', friend.department);
    document.getElementById('dEmail').setAttribute('value', friend.email);
    document.getElementById('dCountry').setAttribute('value', friend.country);
  }

  openEdit(targetModal, friend: Friends) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue({
      id: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      department: friend.department,
      email: friend.email,
      country: friend.country
    });
  }

  onSave() {
    const editURL = 'http://localhost:7070/api/friends/editFriend/' + this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results: Object) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, friend: Friends) {
    this.deleteId = friend.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'md'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:7070/api/friends/deleteFriend/' + this.deleteId;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
}