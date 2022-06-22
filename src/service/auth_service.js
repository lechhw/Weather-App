import { firebaseAuth, githubProvider, googleProvider } from './firebase';

class AuthService {
  login(providerName) {
    const provider = this.getProvider(providerName);
    return firebaseAuth.signInWithPopup(provider);
  }

  logout() {
    firebaseAuth.signOut();
  }

  createUser(email, password) {
    return firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

  signInUser(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  // auth 관찰자 . 유저 상태에 변화가 있으면 user 정보를 담아 onUserchange 콜백함수를 리턴한다.
  onAuthChange(onUserChange) {
    firebaseAuth.onAuthStateChanged((user) => {
      onUserChange(user);
    });
  }

  getProvider(providerName) {
    switch (providerName) {
      case 'Google':
        return googleProvider;
      case 'Github':
        return githubProvider;

      default:
        throw new Error(`not supported provider: ${providerName}`);
    }
  }
}

export default AuthService;
