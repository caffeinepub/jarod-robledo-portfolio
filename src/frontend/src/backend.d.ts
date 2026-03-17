import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Category = string;
export interface UserProfile {
    name: string;
}
export interface Photo {
    id: string;
    title: string;
    order: bigint;
    blobKey: ExternalBlob;
    timestamp: bigint;
    category: Category;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    addPhoto(title: string, category: Category, blobKey: ExternalBlob): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePhoto(id: string): Promise<void>;
    getAllPhotos(): Promise<Array<Photo>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPhotosByCategory(category: Category): Promise<Array<Photo>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<Category>>;
    reorderPhoto(photoId: string, newOrder: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
