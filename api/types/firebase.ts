export interface AuthUser {
    uid: string;
    email: string | null;
  }
  
  export interface FirebaseTimestamp {
    toDate: () => Date;
    seconds: number;
    nanoseconds: number;
  }
  
  export interface UserData {
    email: string;
    name: string;
    photoURL: string;
    createdAt: FirebaseTimestamp;
  }
  