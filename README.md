```markdown
# Song database Nest-JS

## Overview

This is a NestJS-based API project that provides endpoints for managing songs, albums, artists, playlists, user authentication, and more.

## Features

- Create, update, and delete songs, albums, and artists.
- Manage playlists, add or remove songs from playlists.
- User authentication for creating accounts and logging in.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/WyLToR/Spotify-NestJS-base.git
   ```

2. Install dependencies:

   ```bash
   cd Spotify-NestJS-base
   yarn install
   ```

3. Set up your database connection in the `env` file.

4. Run the application:

   ```bash
   yarn start:dev
   ```

   The API will be accessible at `http://localhost:8081`.

## API Endpoints

### Songs

- **Create New Song:**

  `POST /song/:albumId`

- **Get All Songs:**

  `GET /song`

- **Get Song by ID:**

  `GET /song/:songId`

- **Update Song:**

  `PATCH /song/:albumId/:songId`

- **Delete Song:**

  `DELETE /song/:songId`

### Albums

- **Create New Album:**

  `POST /album/:artistId`

- **Get All Albums:**

  `GET /album`

- **Get Album by ID:**

  `GET /album/:albumId`

- **Update Album:**

  `PATCH /album/:artistId/:albumId`

- **Delete Album:**

  `DELETE /album/:albumId`

### Artists

- **Create New Artist:**

  `POST /artist`

- **Get All Artists:**

  `GET /artist`

- **Get Artist by ID:**

  `GET /artist/:artistId`

- **Update Artist:**

  `PATCH /artist/:artistId`

- **Delete Artist:**

  `DELETE /artist/:artistId`

### Playlists

- **Create Playlist:**

  `POST /playlist/:userId`

- **Get All Playlists of a User:**

  `GET /playlist/user/:userId`

- **Get Playlist by ID:**

  `GET /playlist/:playlistId`

- **Delete Playlist by ID:**

  `DELETE /playlist/:playlistId`

## Authentication

- **Register User:**

  `POST /auth/register`

- **User Login:**

  `POST /auth/login`
## Admin

- **Get All User:**

  `GET /admin/users`
- **Switch User Role**

  `PATCH /admin/role/:userId`

## Authentication-Protected Endpoints

For the following endpoints, a Bearer Token is required in the Authorization header:

- **User:**
    - *Update User:* `PATCH /user/:userId`
    - *Delete User:* `DELETE /user/:userId`
    - *Get All User: (only admin)* `GET /admin/users`
    - *Switch Role: (only admin)* `PATCH /admin/role/:userId`

- **Playlist:**
    - *Create Playlist: (only admin)* `POST /playlist/:userId`
    - *Get All Playlists of a User:* `GET /playlist/user/:userId`
    - *Get Playlist by ID:* `GET /playlist/:playlistId`
    - *Delete Playlist by ID:* `DELETE /playlist/:playlistId`
    - *Delete Song from Playlist:* `DELETE /:playlistId/:songId`

- **Artist:**
    - *Create New Artist: (only admin)* `POST /artist`
    - *Update Artist: (only admin)* `PATCH /artist/:artistId`
    - *Delete Artist: (only admin)* `DELETE /artist/:artistId`

- **Album:**
    - *Create New Album: (only admin)* `POST /album/:artistId`
    - *Update Album: (only admin)* `PATCH /album/:artistId/:albumId`
    - *Delete Album: (only admin)* `DELETE /album/:albumId`

- **Song:**
    - *Create New Song: (only admin)* `POST /song/:albumId`
    - *Update Song: (only admin)* `PATCH /song/:albumId/:songId`
    - *Delete Song: (only admin)* `DELETE /song/:songId`

## Usage

To use the API, you can make HTTP requests to the provided endpoints using your preferred tool (e.g., curl, Postman, or any frontend framework with fetch).

Make sure to include the Bearer Token in the Authorization header for protected endpoints.

`header:{
  'Authorization':'Bearer <token>'
}
`

## About the Author

This NestJS API project was developed with love and dedication by [Your Name].

Feel free to connect with me:

- Email: [bekesi.patrik@gmail.com](mailto:bekesi.patrik@gmail.com)
- GitHub: [WyLToR](https://github.com/WyLToR/)

If you find any issues, have suggestions, or just want to chat about the project, don't hesitate to reach out. Contributions and feedback are always welcome!

**Happy coding!**
