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
    firstname: string;
    lastname: string;
    createdAt: FirebaseTimestamp;
  }
  