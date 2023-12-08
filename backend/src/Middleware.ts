import express from 'express'
import FirebaseUsage from './firebase';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

// ensure that the token exists. if not, send 401. If so, decode the uid and store
export async function ensureToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  console.log(`In middleware for ${req.method} at ${req.url}, the session is ${req.session.user}`)
  if (req.body) console.log(`The body is ${JSON.stringify(req.body)}`);
  if (req.session && req.session.user) {
    try {
      const idToken: DecodedIdToken = await FirebaseUsage.auth.verifySessionCookie(req.session.user);
      console.log(`Got token uid ${idToken.uid}!`);
      req.params.loggedInUid = idToken.uid;
      next();
      return;
    } catch(err) {
      console.error(`Failed to obtain id token: ${err}`);
    }
  }
  res.status(401);
  res.send();
  return;
}