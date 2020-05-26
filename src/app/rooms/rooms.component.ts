import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, combineLatest, forkJoin } from 'rxjs';
// import * as _ from 'lodash';
import { Message } from '../models/Message';
import { Room } from '../models/Room';
import { AuthServiceService } from '../services/auth-service.service';
import { User } from 'firebase';
import { map, flatMap } from 'rxjs/operators';



@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  messagesCollection: AngularFirestoreCollection<Message>;
  roomsCollection: AngularFirestoreCollection<Room>;
  usersCollection: AngularFirestoreCollection<User>

  messages: Observable<Message[]>;
  rooms: Observable<Room[]>;
  users: Observable<User[]>

  newRoomName = "";
  room = '';
  roomName = '';
  message: Message;
  user: any;

  messagesFull: any;

  constructor(private db: AngularFirestore, public auth: AuthServiceService) {
    this.roomsCollection = db.collection<Room>('rooms', ref => ref.orderBy('name', 'asc'));
    this.usersCollection = db.collection<User>('users')
  }

  ngOnInit(): void {
    this.rooms = this.roomsCollection.valueChanges({ idField: 'id' });
    this.users = this.usersCollection.valueChanges({ idField: 'id' });

    // don't like this
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.submit()
    }
  }

  changeRoom(roomId) {
    this.room = roomId;
    this.message = new Message(new Date(), '', this.user.uid, null);
    this.messagesCollection = this.roomsCollection.doc(this.room).collection('messages', ref => ref.orderBy('timestamp', 'asc'));
    this.messages = this.messagesCollection.valueChanges();

    this.messagesFull = combineLatest(
      this.messages,
      this.users
    ).pipe(
      map(([messages, users]) => {
        const msgs = messages.map(message => {
          const user = users.filter(u => u.uid === message.uid)[0];
          message.user = user
          return message;
        });
        return msgs;
      })
    );
  }

  createRoom(roomName) {
    this.roomsCollection.add({
      name: roomName
    });
  }

  submit() {
    this.message.timestamp = new Date();
    this.message.uid = this.user.uid;
    console.log('Submitting ' + this.message.timestamp, this.message.message)
    this.sendToFirebase(this.message);
    this.message.message = ''
  }

  sendToFirebase(message) {
    console.log('Sending to Firebase')
    this.messagesCollection.add({
      timestamp: message.timestamp,
      message: message.message,
      uid: message.uid
    });
  }
}

