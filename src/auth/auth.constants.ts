/**
 * The server-side secret required to decrypt JWT tokens.
 */
export const jwtConstants = {

  // Development ONLY
  secret: 'hard!to-guess_secret', // Comment out in a real environment

  // TODO: This secret should be an environment variable injected into a Docker container at deployment
  // using a keystore accessible only by the build pipeline and never known by a human.
  // !!!! AND NOT STORED IN SOURCE CONTROL !!!!
  // secret: process.env.JWT_SECRET
}