import admin from 'firebase-admin';
import { Auth } from 'firebase-admin/lib/auth/auth';

export default class FirebaseUsage {
  private static _db?: admin.firestore.Firestore;
  private static _initialized: boolean = false;
  private static _auth?: Auth;

  // connect with firebase
  private static _initializeAccount() {
    if (this._initialized) return;

    const serviceAccount = {
      "type": "service_account",
      "project_id": "webdevfinal-c9ede",
      "private_key_id": "b9b6bb7de79b76594ac528ebe2454ab302e633d1",
      "private_key": process.env.SERVICE_ACCOUNT_KEY,
      "client_email": "firebase-adminsdk-cgdn7@webdevfinal-c9ede.iam.gserviceaccount.com",
      "client_id": "110503671987502994940",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-cgdn7%40webdevfinal-c9ede.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    this._initialized = true;

  }

  public static get db(): admin.firestore.Firestore {
    if (!this._initialized || !this._db) {
      this._initializeAccount()
      this._db = admin.firestore();
    }
    return this._db;
  }

  public static get auth(): Auth {
    if (!this._initialized || !this._auth) {
      this._initializeAccount();
      this._auth = admin.auth();
    }
    return this._auth;
  }
}