export interface Geo {
    lat: string;
    lng: string;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

export interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}

interface Name {
    title: string;
    first: string;
    last: string;
}

interface Coordinates {
    latitude: string;
    longitude: string;
}

interface Timezone {
    offset: string;
    description: string;
}

interface Location {
    street: string;
    city: string;
    state: string;
    postcode: string;
    coordinates: Coordinates;
    timezone: Timezone;
}

interface Login {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
}

interface Dob {
    date: Date;
    age: number;
}

interface Registered {
    date: Date;
    age: number;
}

interface Id {
    name: string;
    value: string;
}

interface Picture {
    large: string;
    medium: string;
    thumbnail: string;
}

export interface IRandomUserData {
    gender: string;
    name: Name;
    location: Location;
    email: string;
    login: Login;
    dob: Dob;
    registered: Registered;
    phone: string;
    cell: string;
    id: Id;
    picture: Picture;
    nat: string;
}

interface Info {
    seed: string;
    results: number;
    page: number;
    version: string;
}

export interface IUsersResponse {
    results: IRandomUserData[];
    info: Info;
}
