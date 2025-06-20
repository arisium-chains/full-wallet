import 'next/server';
import { RecordModel } from 'pocketbase'; 

declare module 'next/server' {
  interface NextRequest {
    user?: RecordModel; 
    accessToken?: string;
  }
}