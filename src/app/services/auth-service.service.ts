import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/User'; // optional
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  user$: Observable<User>;

  constructor(
    protected auth: AngularFireAuth,
    protected afs: AngularFirestore,
    protected router: Router
  ) {

    this.user$ = this.auth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    )

  }

  async googleSignin() {
    const credential = await this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    return this.updateUserData(credential.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }

    return userRef.set(data, { merge: true })

  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }

  async login(email: string, password: string) {
    const credential = await this.auth.signInWithEmailAndPassword(email, password)
    this.updateUserData(credential.user)
  }


  register(user) {
    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
  }

}
