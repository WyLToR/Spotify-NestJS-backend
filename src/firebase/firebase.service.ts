import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = require('../../socloud-c68fb-firebase-adminsdk-2ir21-cf5ebbc35e.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://socloud-c68fb.appspot.com',
      });
    }

    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}