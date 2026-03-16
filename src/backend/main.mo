import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Category = Text;

  type Photo = {
    id : Text;
    title : Text;
    category : Category;
    blobKey : Storage.ExternalBlob;
    order : Nat;
    timestamp : Int;
  };

  type UserProfile = {
    name : Text;
  };

  module Photo {
    public func compare(photo1 : Photo, photo2 : Photo) : Order.Order {
      Nat.compare(photo1.order, photo2.order);
    };
  };

  let categories : [Category] = ["Architecture", "Interior Design", "Renders", "Photography"];

  let photos = Map.empty<Text, Photo>();
  var nextId = 1;

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public query endpoints (no auth required)
  public query ({ caller }) func listCategories() : async [Category] {
    categories;
  };

  public query ({ caller }) func getAllPhotos() : async [Photo] {
    let photoArray = photos.values().toArray();
    photoArray.sort();
  };

  public query ({ caller }) func getPhotosByCategory(category : Category) : async [Photo] {
    let filteredPhotos = photos.values().toArray().filter(
      func(p : Photo) : Bool { p.category == category }
    );
    filteredPhotos.sort();
  };

  // Admin-only mutation endpoints
  public shared ({ caller }) func addPhoto(title : Text, category : Category, blobKey : Storage.ExternalBlob) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add photos");
    };

    // Validate category
    let validCategory = categories.find(func(c : Category) : Bool { c == category });
    switch (validCategory) {
      case (null) { Runtime.trap("Invalid category: " # category) };
      case (?_) {};
    };

    let id = nextId.toText();
    nextId += 1;

    let photo : Photo = {
      id;
      title;
      category;
      blobKey;
      order = photos.size();
      timestamp = Time.now();
    };

    photos.add(id, photo);
    id;
  };

  public shared ({ caller }) func deletePhoto(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete photos");
    };

    switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found: " # id) };
      case (_) {
        photos.remove(id);
      };
    };
  };

  public shared ({ caller }) func reorderPhoto(photoId : Text, newOrder : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reorder photos");
    };

    switch (photos.get(photoId)) {
      case (null) { Runtime.trap("Photo not found: " # photoId) };
      case (?photo) {
        let updatedPhoto = { photo with order = newOrder };
        photos.add(photoId, updatedPhoto);
      };
    };
  };
};
