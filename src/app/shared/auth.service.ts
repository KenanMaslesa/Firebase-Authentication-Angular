import { Injectable, NgZone } from '@angular/core';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  errorMessage: string;
  sucessMessage: string;
  showLoader = false;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
     /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      debugger;
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.removeMessages();

          this.showLoader = true;
          setTimeout(() => {
            this.showLoader = false;
            this.router.navigate(['dashboard']);
          }, 1000);
        });
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.removeMessages();
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }

  // Email verification when new user register
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.sucessMessage = 'Password reset email sent, check your inbox.';
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.removeMessages();
      localStorage.removeItem('user');
      this.router.navigate(['auth']);
    });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified? true : false;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  removeMessages() {
    this.sucessMessage = null;
    this.errorMessage = null;
  }
}
